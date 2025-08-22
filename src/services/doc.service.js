import { Document } from "../models/Document.model.js";
import { AppError } from "../utils/appError.js";
// import { Revision } from "../models/Revision.model.js";

export const docService = {
  async create({ title, ownerId }) {
    const doc = await Document.create({
      title,
      owner: ownerId,
      content: "",
      collaborators: [ownerId],
    });
    return doc;
  },
  async get(docId) {
    return Document.findById(docId);
  },
  async updateContent({ docId, userId, changes }) {
    const doc = await Document.findById(docId);
    if (!doc) throw new AppError("Document not found", 404);

    // Example changes: { content: 'new text', title?: '...' }
    if (changes.title) doc.title = changes.title;
    if (changes.content) doc.content = changes.content;

    // doc.rev += 1;
    await doc.save();

    // await Revision.create({
    //   docId,
    //   userId,
    //   changes,
    //   rev: doc.rev,
    // });

    return doc;
  },
  async listByUser(userId) {
    return Document.find({
      $or: [{ owner: userId }, { collaborators: userId }],
    }).sort({ updatedAt: -1 });
  },
  async getContent(docId) {
    const doc = await Document.findById(docId);
    if (!doc) throw new AppError("Document not found", 404);
    return doc.content;
  },
};
