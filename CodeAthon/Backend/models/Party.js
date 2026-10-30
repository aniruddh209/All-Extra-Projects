import mongoose from 'mongoose';

const partySchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Customer/Party name is required'],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
    },
    email: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      required: [true, 'Billing address is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required for GST determination'],
      trim: true,
    },
    gstin: {
      type: String,
      default: '',
      trim: true,
      uppercase: true,
    },
  },
  {
    timestamps: true,
  }
);

partySchema.index({ shopId: 1, name: 1 });
partySchema.index({ shopId: 1, mobile: 1 });
partySchema.index({ shopId: 1, gstin: 1 });

const Party = mongoose.model('Party', partySchema);

export default Party;
