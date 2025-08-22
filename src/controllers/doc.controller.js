import { asyncHandler } from "../utils/asyncHandler.js";
import { docService } from "../services/doc.service.js";

export const createDoc = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const doc = await docService.create({
    title,
    ownerId: req.user.sub,
  });
  res.status(201).json(doc);
});

export const listDocs = asyncHandler(async (req, res) => {
  const docs = await docService.listByUser(req.user.sub);
  res.json(docs);
});

export const getDoc = asyncHandler(async (req, res) => {
  const doc = await docService.get(req.params.id);
  if (!doc) return res.status(404).json({ message: "Document not found" });
  res.json(doc);
});
