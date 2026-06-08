import { Schema, model, models, Model } from "mongoose";

export interface IDeal {
  dealNumber: string;

  inquiryId: Schema.Types.ObjectId;

  propertyId: string;
  propertyTitle: string;
  propertyPrice: number;

  customerName: string;
  customerPhone: string;
  customerEmail: string;

  title: string;

  dealValue: number;
  finalPrice: number;

  expectedClosingDate: Date | null;

  status:
    | "new"
    | "site_visit"
    | "negotiation"
    | "token_paid"
    | "agreement"
    | "registration"
    | "closed"
    | "cancelled";

  owner: string;

  notes: string;

  tokenAmount: number;
  totalReceived: number;
  balanceAmount: number;

  isClosed: boolean;
  isCancelled: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const DealSchema = new Schema<IDeal>(
  {
    dealNumber: {
      type: String,
      unique: true,
      index: true,
    },

    inquiryId: {
      type: Schema.Types.ObjectId,
      ref: "PropertyInquiry",
      required: true,
      index: true,
    },

    propertyId: {
      type: String,
      default: "",
      index: true,
    },

    propertyTitle: {
      type: String,
      default: "",
    },

    propertyPrice: {
      type: Number,
      default: 0,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    customerPhone: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },

    customerEmail: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    dealValue: {
      type: Number,
      default: 0,
      min: 0,
    },

    finalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    expectedClosingDate: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "new",
        "site_visit",
        "negotiation",
        "token_paid",
        "agreement",
        "registration",
        "closed",
        "cancelled",
      ],
      default: "new",
      index: true,
    },

    owner: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },

    notes: {
      type: String,
      default: "",
    },

    tokenAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalReceived: {
      type: Number,
      default: 0,
      min: 0,
    },

    balanceAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    isClosed: {
      type: Boolean,
      default: false,
      index: true,
    },

    isCancelled: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto Generate Deal Number
DealSchema.pre("save", async function () {
  try {
    if (!this.isNew || this.dealNumber) {
      return;
    }

    const DealModel = this.constructor as Model<IDeal>;

    const totalDeals = await DealModel.countDocuments();

    this.dealNumber = `DEAL-${String(
      totalDeals + 1
    ).padStart(5, "0")}`;

 return;
  } catch (error) {
   return;(error as Error);
  }
});

// Auto Calculate Balance
DealSchema.pre("save", function (next) {
  this.balanceAmount =
    (this.finalPrice || 0) -
    (this.totalReceived || 0);

  this.isClosed = this.status === "closed";
  this.isCancelled = this.status === "cancelled";

return;
});

// Useful Indexes
DealSchema.index({ status: 1 });
DealSchema.index({ customerName: 1 });
DealSchema.index({ customerPhone: 1 });
DealSchema.index({ createdAt: -1 });
DealSchema.index({ owner: 1 });

const Deal =
  (models.Deal as Model<IDeal>) ||
  model<IDeal>("Deal", DealSchema);

export default Deal;