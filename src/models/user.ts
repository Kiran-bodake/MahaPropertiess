import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    phone:           { type: String },
    name:            { type: String, trim: true },
    email:           { type: String },
    passwordHash:    { type: String },
    role:            { type: String, default: "user", enum: ["user","admin","super-admin"] },
    refreshTokenHash:{ type: String, default: null },
    savedProperties: [{ type: Schema.Types.ObjectId, ref: "Property" }],
    isVerified:      { type: Boolean, default: false },
    otp:             String,
    otpExpiresAt:    Date,
  },
  { timestamps: true }
);

export default models.User ?? model("User", UserSchema);
