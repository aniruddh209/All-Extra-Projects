import Party from '../models/Party.js';
import Bill from '../models/Bill.js';
import asyncHandler from '../utils/asyncHandler.js';
import apiResponse from '../utils/apiResponse.js';

/**
 * List parties with search, state filter, and pagination
 */
export const getParties = asyncHandler(async (req, res) => {
  const { search = '', state, page = 1, limit = 10 } = req.query;
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const query = { shopId: req.user.shopId };

  if (search && search.trim()) {
    const q = search.trim();
    query.$or = [
      { name: { $regex: q, $options: 'i' } },
      { mobile: { $regex: q, $options: 'i' } },
      { gstin: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
    ];
  }

  if (state && state.trim()) {
    query.state = state.trim();
  }

  const existingCount = await Party.countDocuments({ shopId: req.user.shopId });
  if (existingCount === 0) {
    await Party.insertMany([
      {
        shopId: req.user.shopId,
        name: 'Rahul Traders',
        mobile: '9876543210',
        email: 'rahul@traders.com',
        address: 'Shop 12, Main Market, Ring Road, Surat',
        state: 'Gujarat',
        gstin: '24ABCDE1234F1Z5',
      },
      {
        shopId: req.user.shopId,
        name: 'Sharma Enterprises',
        mobile: '9823456789',
        email: 'sharma@ent.com',
        address: 'Plot 45, MIDC Industrial Area, Andheri East, Mumbai',
        state: 'Maharashtra',
        gstin: '27ABCDE5678F1Z9',
      },
      {
        shopId: req.user.shopId,
        name: 'Himalaya Supplies',
        mobile: '9765432100',
        email: 'himalaya@supplies.com',
        address: 'Mall Road, Commercial Complex, Shimla',
        state: 'Himachal Pradesh',
        gstin: '02ABCDE9181F1Z2',
      },
      {
        shopId: req.user.shopId,
        name: 'Northeast Distributors',
        mobile: '9654321098',
        email: 'northeast@dist.com',
        address: 'GS Road, Dispur, Guwahati',
        state: 'Assam',
        gstin: '18ABCDE1122F1Z4',
      },
      {
        shopId: req.user.shopId,
        name: 'Green Valley Traders',
        mobile: '9543210987',
        email: 'greenvalley@biz.in',
        address: 'Industrial Area, Haridwar',
        state: 'Uttarakhand',
        gstin: '05ABCDE3344F1Z7',
      },
    ]);
  }

  const [parties, total] = await Promise.all([
    Party.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Party.countDocuments(query),
  ]);

  return apiResponse.success(res, 'Parties retrieved successfully', {
    parties,
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
 * Get party by ID
 */
export const getPartyById = asyncHandler(async (req, res) => {
  const party = await Party.findOne({ _id: req.params.id, shopId: req.user.shopId });
  if (!party) {
    return apiResponse.notFound(res, 'Customer not found');
  }
  return apiResponse.success(res, 'Customer retrieved', { party });
});

/**
 * Create a new party
 */
export const createParty = asyncHandler(async (req, res) => {
  const { name, mobile, email, address, state, gstin } = req.body;

  const party = await Party.create({
    shopId: req.user.shopId,
    name: name.trim(),
    mobile: mobile.trim(),
    email: email ? email.trim().toLowerCase() : '',
    address: address.trim(),
    state: state.trim(),
    gstin: gstin ? gstin.trim().toUpperCase() : '',
  });

  return apiResponse.created(res, 'Customer registered successfully', { party });
});

/**
 * Update party
 */
export const updateParty = asyncHandler(async (req, res) => {
  const { name, mobile, email, address, state, gstin } = req.body;

  const party = await Party.findOne({ _id: req.params.id, shopId: req.user.shopId });
  if (!party) {
    return apiResponse.notFound(res, 'Customer not found');
  }

  if (name) party.name = name.trim();
  if (mobile) party.mobile = mobile.trim();
  if (email !== undefined) party.email = email.trim().toLowerCase();
  if (address) party.address = address.trim();
  if (state) party.state = state.trim();
  if (gstin !== undefined) party.gstin = gstin.trim().toUpperCase();

  await party.save();

  return apiResponse.success(res, 'Customer details updated successfully', { party });
});

/**
 * Delete party
 */
export const deleteParty = asyncHandler(async (req, res) => {
  const party = await Party.findOne({ _id: req.params.id, shopId: req.user.shopId });
  if (!party) {
    return apiResponse.notFound(res, 'Customer not found');
  }

  await party.deleteOne();

  return apiResponse.success(res, 'Customer profile deleted successfully');
});

/**
 * Get bills for a specific party
 */
export const getPartyBills = asyncHandler(async (req, res) => {
  const bills = await Bill.find({
    shopId: req.user.shopId,
    partyId: req.params.id,
  }).sort({ invoiceDate: -1 });

  return apiResponse.success(res, 'Customer bills retrieved', { bills });
});

export default {
  getParties,
  getPartyById,
  createParty,
  updateParty,
  deleteParty,
  getPartyBills,
};
