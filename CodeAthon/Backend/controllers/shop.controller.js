import Shop from '../models/Shop.js';
import asyncHandler from '../utils/asyncHandler.js';
import apiResponse from '../utils/apiResponse.js';

/**
 * Get current shop profile
 */
export const getShop = asyncHandler(async (req, res) => {
  const shop = await Shop.findById(req.user.shopId);
  if (!shop) {
    return apiResponse.notFound(res, 'Shop profile not found');
  }
  return apiResponse.success(res, 'Shop profile retrieved', { shop });
});

/**
 * Update shop profile (OWNER only)
 */
export const updateShop = asyncHandler(async (req, res) => {
  const { name, businessName, ownerName, address, state, gstin, phone, email, invoicePrefix } = req.body;

  const shop = await Shop.findById(req.user.shopId);
  if (!shop) {
    return apiResponse.notFound(res, 'Shop profile not found');
  }

  if (name || businessName) shop.businessName = (name || businessName).trim();
  if (ownerName) shop.ownerName = ownerName.trim();
  if (address !== undefined) shop.address = address.trim();
  if (state) shop.state = state.trim();
  if (gstin !== undefined) shop.gstin = gstin.trim().toUpperCase();
  if (phone !== undefined) shop.phone = phone.trim();
  if (email !== undefined) shop.email = email.trim().toLowerCase();
  if (invoicePrefix) shop.invoicePrefix = invoicePrefix.trim().toUpperCase();

  await shop.save();

  return apiResponse.success(res, 'Shop settings updated successfully', { shop });
});

export default {
  getShop,
  updateShop,
};
