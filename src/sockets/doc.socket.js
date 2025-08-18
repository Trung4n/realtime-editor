import * as Y from "yjs";
import { docService } from "../services/doc.service.js";
const docs = new Map(); // docId -> Y.Doc
const presence = new Map(); // docId -> set(userId)

const SNAPSHOT_INTERVAL = 10000;

export const docSocket = (io, socket) => {
  const userId = socket.user?.sub;

  socket.on("doc:join", ({ docId }) => {
    if (!docId) return;

    if (!docs.has(docId)) {
      const ydoc = new Y.Doc();
      const content = docService.getContent(docId);
      if (content) ydoc.getText("content").insert(0, content);
      docs.set(docId, ydoc);
      docs.set(docId, { ydoc, saveTimeout: null });
    }

    const { ydoc } = docs.get(docId);

    // send snapshot to the client
    socket.emit("doc:init", Y.encodeStateAsUpdate(ydoc));

    socket.join(docId);

    // presence
    if (!presence.has(docId)) presence.set(docId, new Set());
    presence.get(docId).add(userId);
    io.to(docId).emit("presence:update", {
      docId,
      users: [...presence.get(docId)],
    });

    socket.on("disconnecting", () => {
      const set = presence.get(docId);
      if (set) {
        set.delete(userId);
        io.to(docId).emit("presence:update", { docId, users: [...set] });
      }
    });

    // relay updates
    socket.on("doc:update", (update) => {
      Y.applyUpdate(ydoc, update);
      socket.to(docId).emit("doc:remote-update", update); // send to others

      try {
        docService.updateContent({
          docId,
          userId,
          changes: { content: ydoc.getText("content").toString() },
        });
      } catch (err) {
        console.error("Failed to save incremental update:", err);
      }

      const docData = docs.get(docId);
      if (!docData.saveTimeout) {
        docData.saveTimeout = setTimeout(async () => {
          try {
            const snapshot = Y.encodeStateAsUpdate(ydoc);
            await docService.updateContent({
              docId,
              userId,
              changes: { content: snapshot }, // save as snapshot
            });
          } catch (err) {
            console.error("Failed to save snapshot:", err);
          } finally {
            docData.saveTimeout = null;
          }
        }, SNAPSHOT_INTERVAL);
      }
    });
  });
};
