import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },

    // 🔗 Link each post to a user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Must match the model name in user.js
      required: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
