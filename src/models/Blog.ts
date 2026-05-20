import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    s: String, // slug

    t: String, // title

    excerpt: String,

    cat: String,

    d: String,

    r: String,

    img: String,

    feat: {
      type: Boolean,
      default: false,
    },

    content: String,

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
