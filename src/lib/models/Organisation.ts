import mongoose, { type Document, type Model, Schema } from "mongoose";
import type { Organisation } from "@/types";

interface IOrganisation extends Omit<Organisation, "_id">, Document {}

const OrganisationSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    settings: {
      timeFormat: {
        type: String,
        enum: ["12h", "24h"],
        default: "24h",
      },
      currency: {
        type: String,
        default: "GBP",
      },
      weekStart: {
        type: String,
        enum: ["monday", "sunday"],
        default: "monday",
      },
      categories: {
        type: [String],
        default: ["Development", "Design", "Marketing", "Admin"],
      },
    },
  },
  {
    timestamps: true,
  },
);

OrganisationSchema.index({ slug: 1 });
OrganisationSchema.index({ ownerId: 1 });

const OrganisationModel: Model<IOrganisation> =
  mongoose.models.Organisation ||
  mongoose.model<IOrganisation>("Organisation", OrganisationSchema);

export default OrganisationModel;
