import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Item or service name is required'],
      trim: true,
    },
    hsnCode: {
      type: String,
      default: '',
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be non-negative'],
    },
    gstPercent: {
      type: Number,
      required: [true, 'GST percentage is required'],
      enum: [0, 5, 12, 18, 28],
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

itemSchema.index({ shopId: 1, name: 1 });
itemSchema.index({ shopId: 1, hsnCode: 1 });

const Item = mongoose.model('Item', itemSchema);

export default Item;
