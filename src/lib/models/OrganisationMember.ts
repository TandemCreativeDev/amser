import mongoose, { type Document, type Model, Schema } from "mongoose";
import type { OrganisationMember } from "@/types";

interface IOrganisationMember
  extends Omit<OrganisationMember, "_id">,
    Document {}

const OrganisationMemberSchema: Schema = new Schema({
  organisationId: {
    type: Schema.Types.ObjectId,
    ref: "Organisation",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "member"],
    default: "member",
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

OrganisationMemberSchema.index(
  { organisationId: 1, userId: 1 },
  { unique: true },
);
OrganisationMemberSchema.index({ userId: 1 });

const OrganisationMemberModel: Model<IOrganisationMember> =
  mongoose.models.OrganisationMember ||
  mongoose.model<IOrganisationMember>(
    "OrganisationMember",
    OrganisationMemberSchema,
  );

export default OrganisationMemberModel;
