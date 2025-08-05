import mongoose, { type Document, type Model, Schema } from "mongoose";
import type { Client } from "@/types";

interface IClient extends Omit<Client, "_id">, Document {}

const ClientSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    colour: {
      type: String,
      required: true,
      default: "#3B82F6",
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

ClientSchema.index({ userId: 1, isPersonal: 1 });
ClientSchema.index({ organisationId: 1, isPersonal: 1 });
ClientSchema.index({ archived: 1 });

const ClientModel: Model<IClient> =
  mongoose.models.Client || mongoose.model<IClient>("Client", ClientSchema);

export default ClientModel;
