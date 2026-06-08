import mongoose, { Schema, models, Document } from "mongoose";

// TypeScript Interface for User
export interface IUser extends Document {
  name: string;
  phone: string;
  email: string;
  passwordHash: string;
  role: "user" | "admin" | "super-admin";
  refreshTokenHash: string | null;
  avatar: string;
  savedProperties: mongoose.Types.ObjectId[];
  isVerified: boolean;
  loginCount: number;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      default: "User",
      trim: true,
    },
    phone: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      trim: true,
    },
    email: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
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
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ FIXED: Only create indexes that don't conflict
// REMOVED the duplicate phone index because schema already has unique:true
// UserSchema.index({ phone: 1 });  // ← REMOVED THIS LINE (causing conflict)

// Keep these indexes (no conflict)
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

// Virtual for full profile
UserSchema.virtual("profile").get(function () {
  return {
    id: this._id,
    name: this.name,
    phone: this.phone,
    email: this.email,
    role: this.role,
    avatar: this.avatar,
    isVerified: this.isVerified,
    savedPropertiesCount: this.savedProperties?.length || 0,
  };
});

// Method to get public profile (safe to share)
UserSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    name: this.name,
    phone: this.phone,
    email: this.email,
    role: this.role,
    avatar: this.avatar,
    isVerified: this.isVerified,
    loginCount: this.loginCount,
    lastLoginAt: this.lastLoginAt,
    createdAt: this.createdAt,
  };
};

// Method to check if user is admin
UserSchema.methods.isAdmin = function (): boolean {
  return this.role === "admin" || this.role === "super-admin";
};

// Method to check if user is super admin
UserSchema.methods.isSuperAdmin = function (): boolean {
  return this.role === "super-admin";
};

export default models.User || mongoose.model<IUser>("User", UserSchema);