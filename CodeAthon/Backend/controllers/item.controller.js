import Item from '../models/Item.js';
import asyncHandler from '../utils/asyncHandler.js';
import apiResponse from '../utils/apiResponse.js';

/**
 * List catalog items with search, GST slab filter, and pagination
 */
export const getItems = asyncHandler(async (req, res) => {
  const { search = '', gstPercent, page = 1, limit = 10 } = req.query;
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const query = { shopId: req.user.shopId };

  if (search && search.trim()) {
    const q = search.trim();
    query.$or = [
      { name: { $regex: q, $options: 'i' } },
      { hsnCode: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
    ];
  }

  if (gstPercent !== undefined && gstPercent !== '') {
    query.gstPercent = Number(gstPercent);
  }

  const existingCount = await Item.countDocuments({ shopId: req.user.shopId });
  if (existingCount === 0) {
    await Item.insertMany([
      {
        shopId: req.user.shopId,
        name: 'Laptop ThinkPad T14 Gen 4',
        hsnCode: '84713010',
        price: 65000,
        gstPercent: 18,
        description: 'Intel Core i7 13th Gen, 16GB RAM, 512GB SSD',
      },
      {
        shopId: req.user.shopId,
        name: 'Logitech MX Master 3S Wireless Mouse',
        hsnCode: '84716060',
        price: 8995,
        gstPercent: 18,
        description: 'Precision wireless ergonomic mouse',
      },
      {
        shopId: req.user.shopId,
        name: 'Mechanical RGB Backlit Keyboard',
        hsnCode: '84716060',
        price: 3499,
        gstPercent: 18,
        description: 'Custom mechanical keyboard with hot-swappable switches',
      },
      {
        shopId: req.user.shopId,
        name: 'Dell UltraSharp 27" 4K Monitor',
        hsnCode: '85285200',
        price: 38500,
        gstPercent: 18,
        description: 'IPS UHD USB-C Hub Monitor U2723QE',
      },
      {
        shopId: req.user.shopId,
        name: 'Epson EcoTank L3250 Wi-Fi All-in-One Printer',
        hsnCode: '84433200',
        price: 15499,
        gstPercent: 18,
        description: 'High-yield color ink tank printer',
      },
    ]);
  }

  const [items, total] = await Promise.all([
    Item.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Item.countDocuments(query),
  ]);

  return apiResponse.success(res, 'Items retrieved successfully', {
    items,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      pages: Math.ceil(total / limitNum) || 1,
    },
  });
});

/**
 * Get item by ID
 */
export const getItemById = asyncHandler(async (req, res) => {
  const item = await Item.findOne({ _id: req.params.id, shopId: req.user.shopId });
  if (!item) {
    return apiResponse.notFound(res, 'Item not found');
  }
  return apiResponse.success(res, 'Item retrieved', { item });
});

/**
 * Create a new catalog item
 */
export const createItem = asyncHandler(async (req, res) => {
  const { name, hsnCode, price, gstPercent, description } = req.body;

  const item = await Item.create({
    shopId: req.user.shopId,
    name: name.trim(),
    hsnCode: hsnCode ? hsnCode.trim() : '',
    price: Number(price),
    gstPercent: Number(gstPercent),
    description: description ? description.trim() : '',
  });

  return apiResponse.created(res, 'Item created successfully', { item });
});

/**
 * Update catalog item
 */
export const updateItem = asyncHandler(async (req, res) => {
  const { name, hsnCode, price, gstPercent, description } = req.body;

  const item = await Item.findOne({ _id: req.params.id, shopId: req.user.shopId });
  if (!item) {
    return apiResponse.notFound(res, 'Item not found');
  }

  if (name) item.name = name.trim();
  if (hsnCode !== undefined) item.hsnCode = hsnCode.trim();
  if (price !== undefined) item.price = Number(price);
  if (gstPercent !== undefined) item.gstPercent = Number(gstPercent);
  if (description !== undefined) item.description = description.trim();

  await item.save();

  return apiResponse.success(res, 'Item updated successfully', { item });
});

/**
 * Delete catalog item
 */
export const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findOne({ _id: req.params.id, shopId: req.user.shopId });
  if (!item) {
    return apiResponse.notFound(res, 'Item not found');
  }

  await item.deleteOne();

  return apiResponse.success(res, 'Item deleted successfully');
});

export default {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
