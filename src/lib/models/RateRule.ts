import mongoose, { type Document, type Model, Schema } from "mongoose";
import type { RateRule } from "@/types";

interface IRateRule extends Omit<RateRule, "_id">, Document {}

const RateRuleSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    baseRate: {
      type: Number,
      required: true,
      min: 0,
    },
    conditions: [
      {
        weeklyHoursThreshold: {
          type: Number,
          required: true,
          min: 0,
        },
        newRate: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organisationId: {
      type: Schema.Types.ObjectId,
      ref: "Organisation",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

RateRuleSchema.index({ projectId: 1, isActive: 1 });
RateRuleSchema.index({ userId: 1 });
RateRuleSchema.index({ organisationId: 1 });

const RateRuleModel: Model<IRateRule> =
  mongoose.models.RateRule ||
  mongoose.model<IRateRule>("RateRule", RateRuleSchema);

export default RateRuleModel;
