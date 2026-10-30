import mongoose from 'mongoose';

const billItemSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    hsnCode: {
      type: String,
      default: '',
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    gstPercent: {
      type: Number,
      required: true,
    },
    taxableAmount: {
      type: Number,
      required: true,
    },
    cgstAmount: {
      type: Number,
      default: 0,
    },
    sgstAmount: {
      type: Number,
      default: 0,
    },
    igstAmount: {
      type: Number,
      default: 0,
    },
    totalTax: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const billSchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
      index: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    invoiceDate: {
      type: Date,
      default: Date.now,
    },
    partyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Party',
    },

    // Frozen Snapshots for historical integrity
    partySnapshot: {
      name: String,
      mobile: String,
      email: String,
      address: String,
      state: String,
      gstin: String,
    },

    shopSnapshot: {
      name: String,
      businessName: String,
      ownerName: String,
      address: String,
      state: String,
      gstin: String,
      phone: String,
      email: String,
    },

    items: [billItemSchema],

    intraState: {
      type: Boolean,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    totalCgst: {
      type: Number,
      default: 0,
    },
    totalSgst: {
      type: Number,
      default: 0,
    },
    totalIgst: {
      type: Number,
      default: 0,
    },
    totalTax: {
      type: Number,
      required: true,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['FINALIZED'],
      default: 'FINALIZED',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Virtuals for frontend convenience
billSchema.virtual('party').get(function () {
  return this.partySnapshot || null;
});

billSchema.virtual('shop').get(function () {
  return this.shopSnapshot || null;
});

billSchema.set('toJSON', { virtuals: true });
billSchema.set('toObject', { virtuals: true });

billSchema.index({ shopId: 1, invoiceNumber: 1 });
billSchema.index({ shopId: 1, invoiceDate: -1 });
billSchema.index({ shopId: 1, partyId: 1 });

const Bill = mongoose.model('Bill', billSchema);

export default Bill;
