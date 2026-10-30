import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
    unique: true,
  },
  sequence: {
    type: Number,
    default: 0,
  },
});

const Counter = mongoose.model('Counter', counterSchema);

export default Counter;
