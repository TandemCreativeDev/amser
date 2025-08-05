import mongoose, { type Document, type Model, Schema } from "mongoose";
import type { TimeEntry } from "@/types";

interface ITimeEntry extends Omit<TimeEntry, "_id">, Document {}

const TimeEntrySchema: Schema = new Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      default: null,
    },
    duration: {
      type: Number,
      required: true,
      min: 0,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    appliedRate: {
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
  },
  {
    timestamps: true,
  },
);

TimeEntrySchema.index({ userId: 1, isPersonal: 1 });
TimeEntrySchema.index({ organisationId: 1, isPersonal: 1 });
TimeEntrySchema.index({ projectId: 1 });
TimeEntrySchema.index({ clientId: 1 });
TimeEntrySchema.index({ startTime: -1 });

const TimeEntryModel: Model<ITimeEntry> =
  mongoose.models.TimeEntry ||
  mongoose.model<ITimeEntry>("TimeEntry", TimeEntrySchema);

export default TimeEntryModel;
