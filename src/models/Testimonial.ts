import mongoose from "mongoose";

const TestimonialSchema = new mongoose.Schema(
  {
    n: String,

    r: String,

    lc: String,

    av: String,

    col: String,

    pImg: String,

    txt: String,

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Testimonial ||
  mongoose.model("Testimonial", TestimonialSchema);
