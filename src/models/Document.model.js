import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // permissions...
  },
  { timestamps: true }
);

export const Document = mongoose.model("Document", documentSchema);
