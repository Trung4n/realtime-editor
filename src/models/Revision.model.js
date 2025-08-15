import mongoose from "mongoose";

const revisionSchema = new mongoose.Schema(
  {
    docId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      index: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    changes: { type: Object, default: {} }, // store patch/diff
    rev: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Revision = mongoose.model("Revision", revisionSchema);
