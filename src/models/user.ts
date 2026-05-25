import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,

      default: "User",
    },

    phone: {
      type: String,

      required: true,

      unique: true,
    },

    email: {
      type: String,

      default: "",
    },

    passwordHash: {
      type: String,

      default: "",
    },

    role: {
      type: String,

      enum: ["user", "admin", "super-admin"],

      default: "user",
    },

    refreshTokenHash: {
      type: String,

      default: null,
    },

    avatar: {
      type: String,

      default: "",
    },

    savedProperties: [
      {
        type: mongoose.Schema.Types.ObjectId,

        ref: "Property",
      },
    ],

    isVerified: {
      type: Boolean,

      default: false,
    },

    loginCount: {
      type: Number,

      default: 0,
    },

    lastLoginAt: Date,
  },

  {
    timestamps: true,
  },
);

export default mongoose.models.User ||
  mongoose.model(
    "User",

    UserSchema,
  );
