import mongoose, { type Document, type Model, Schema } from "mongoose";
import type { User } from "@/types";

interface IUser extends Omit<User, "_id">, Document {}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    settings: {
      defaultView: {
        type: String,
        enum: ["timer", "dashboard"],
        default: "timer",
      },
      timeFormat: {
        type: String,
        enum: ["12h", "24h"],
        default: "24h",
      },
      weekStart: {
        type: String,
        enum: ["monday", "sunday"],
        default: "monday",
      },
    },
  },
  {
    timestamps: true,
  },
);

const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
