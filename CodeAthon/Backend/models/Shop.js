import mongoose from 'mongoose';

/**
 * Shop Schema
 *
 * Stores business profile information required for:
 * - Invoice headers (business name, address, GSTIN)
 * - GST calculation (shop state vs party state)
 * - Invoice number configuration (prefix)
 *
 * One shop is created per OWNER signup.
 * ADMIN and STAFF users belong to the same shop.
 */
const shopSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
      maxlength: [200, 'Business name cannot exceed 200 characters'],
    },

    ownerName: {
      type: String,
      required: [true, 'Owner name is required'],
      trim: true,
    },

    address: {
      type: String,
      default: '',
      trim: true,
    },

    state: {
      type: String,
      required: [true, 'State is required for GST calculation'],
      trim: true,
    },

    gstin: {
      type: String,
      default: '',
      trim: true,
      uppercase: true,
    },

    phone: {
      type: String,
      default: '',
      trim: true,
    },

    email: {
      type: String,
      default: '',
      lowercase: true,
      trim: true,
    },

    invoicePrefix: {
      type: String,
      default: 'INV',
      trim: true,
      uppercase: true,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

shopSchema.virtual('name')
  .get(function () {
    return this.businessName;
  })
  .set(function (v) {
    this.businessName = v;
  });

shopSchema.set('toJSON', { virtuals: true });
shopSchema.set('toObject', { virtuals: true });

// ─── Indexes ───
shopSchema.index({ ownerId: 1 }, { unique: true });

const Shop = mongoose.model('Shop', shopSchema);

export default Shop;
