import mongoose, { type Document, type Model, Schema } from "mongoose";
import type { Project } from "@/types";

interface IProject extends Omit<Project, "_id">, Document {}

const ProjectSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    category: {
      type: String,
      default: null,
    },
    colour: {
      type: String,
      required: true,
      default: "#10B981",
    },
    defaultRate: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    isPersonal: {
      type: Boolean,
      default: true,
    },
    organisationId: {
      type: Schema.Types.ObjectId,
      ref: "Organisation",
      default: null,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

ProjectSchema.index({ userId: 1, isPersonal: 1 });
ProjectSchema.index({ organisationId: 1, isPersonal: 1 });
ProjectSchema.index({ clientId: 1 });
ProjectSchema.index({ archived: 1 });

const ProjectModel: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default ProjectModel;
