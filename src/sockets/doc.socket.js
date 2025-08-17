import { docService } from "../services/doc.service.js";

const presence = new Map();

export const docSocket = (io, socket) => {
  const userId = socket.user?.sub;

  socket.on("doc:join", async ({ docId }) => {
    if (!docId) return;
    socket.join(docId);

    if (!presence.has(docId)) presence.set(docId, new Set());
    presence.get(docId).add(userId);
    io.to(docId).emit("presence:update", {
      docId,
      users: [...presence.get(docId)],
    });
  });
  socket.on("doc:leave", ({ docId }) => {
    socket.leave(docId);
    const set = presence.get(docId);
    if (set) {
      set.delete(userId);
      io.to(docId).emit("presence:update", { docId, users: [...set] });
    }
  });
  socket.on("disconnecting", () => {
    for (const docId of socket.rooms) {
      if (docId === socket.id) continue;
      const set = presence.get(docId);
      if (set) {
        set.delete(userId);
        io.to(docId).emit("presence:update", { docId, users: [...set] });
      }
    }
  });
  socket.on("doc:update", async ({ docId, changes, clientRev }) => {
    try {
      if (!docId) return;
      // naive revision check (informational)
      const { doc, rev } = await docService.updateContent({
        docId,
        userId,
        changes,
      });
      io.to(docId).emit("doc:updated", { docId, changes, serverRev: rev });
    } catch (e) {
      socket.emit("doc:error", { message: e.message });
    }
  });
};
