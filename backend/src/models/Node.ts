import mongoose, { Schema, models } from "mongoose";

const NodeSchema = new Schema(
  {
    wallet: {
      type: String,
      required: true,
      index: true,
      match: /^0x[a-fA-F0-9]{40}$/,
    },
    region: {
      type: String,
      required: true,
      trim: true,
    },
    pricePerGB: {
      type: Number,
      required: true,
      min: 0,
    },
    endpoint: {
      type: String,
      default: null,
    },
    capacityMbps: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

NodeSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const NodeModel = models.Node || mongoose.model("Node", NodeSchema);
export default NodeModel;
