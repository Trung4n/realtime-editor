import * as Y from "yjs";
import { docService } from "../services/doc.service.js";
import { env } from "../config/index.js";

const docs = new Map(); // docId -> { ydoc, saveTimeout }
const presence = new Map(); // docId -> Map<userId, Set<socketId>>

async function saveDoc(docId, userId) {
  const docData = docs.get(docId);
  if (!docData) return;
  const snapshot = docData.ydoc.getText("content").toString();
  await docService.updateContent({
    docId,
    userId,
    changes: { content: snapshot },
  });
}

export const docSocket = (io, socket) => {
  const userId = socket.user?.sub;

  socket.on("doc:join", async ({ docId }) => {
    if (!docId) return;

    if (!docs.has(docId)) {
      // if doc not loaded yet, load it from DB
      const ydoc = new Y.Doc();
      const content = await docService.getContent(docId);
      if (content) {
        ydoc.getText("content").insert(0, content.toString());
      }
      const saveInterval = setInterval(
        () => saveDoc(docId, userId),
        env.AUTO_SAVE_INTERVAL
      );
      docs.set(docId, { ydoc, saveInterval, cleanupTimeout: null });
    }

    const { ydoc, cleanupTimeout } = docs.get(docId);

    if (cleanupTimeout) {
      // cancel cleanup
      clearTimeout(cleanupTimeout);
      docs.get(docId).cleanupTimeout = null;
    }

    // send snapshot to the client
    socket.emit("doc:init", Y.encodeStateAsUpdate(ydoc));

    socket.join(docId);

    // presence
    if (!presence.has(docId)) presence.set(docId, new Map());
    const docUsers = presence.get(docId);
    // multi-tab same user
    if (!docUsers.has(userId)) docUsers.set(userId, new Set());
    docUsers.get(userId).add(socket.id);

    io.to(docId).emit("presence:update", {
      docId,
      users: [...docUsers.keys()],
    });

    // relay updates CRDT
    socket.on("doc:update", (update) => {
      Y.applyUpdate(ydoc, update);
      socket.to(docId).emit("doc:remote-update", update); // send to others
    });

    socket.on("doc:save", () => saveDoc(docId, userId));

    socket.on("disconnect", () => {
      const docUsers = presence.get(docId);
      if (!docUsers) return;

      const userSockets = docUsers.get(userId);

      if (userSockets) {
        userSockets.delete(socket.id); // remove this socket
        if (userSockets.size === 0) {
          docUsers.delete(userId); // remove user if no sockets left
        }
      }

      io.to(docId).emit("presence:update", {
        docId,
        users: [...docUsers.keys()],
      });

      if (docUsers.size === 0) {
        const cleanupTimeout = setTimeout(() => {
          saveDoc(docId, userId); // save before cleanup
          // delay cleanup
          const docData = docs.get(docId);
          if (docData) clearInterval(docData.saveInterval); // stop auto-save
          docs.delete(docId);
          presence.delete(docId);
        }, env.CLEANUP_DELAY);

        docs.get(docId).cleanupTimeout = cleanupTimeout;
      }
    });
  });
};
