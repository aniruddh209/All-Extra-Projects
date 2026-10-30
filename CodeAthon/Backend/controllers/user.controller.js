import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import apiResponse from '../utils/apiResponse.js';

/**
 * List all users for current shop
 */
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ shopId: req.user.shopId })
    .select('-password -otp')
    .sort({ createdAt: -1 });

  return apiResponse.success(res, 'Users retrieved successfully', { users });
});

/**
 * Get user by ID
 */
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, shopId: req.user.shopId }).select('-password -otp');
  if (!user) {
    return apiResponse.notFound(res, 'User not found');
  }
  return apiResponse.success(res, 'User retrieved', { user });
});

/**
 * Create a new team member
 */
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'STAFF' } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    return apiResponse.badRequest(res, 'A user with this email address already exists');
  }

  const hashedPassword = await bcrypt.hash(password || 'Password123!', 12);

  const newUser = await User.create({
    shopId: req.user.shopId,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    role,
    isActive: true,
  });

  const safeUser = newUser.toObject();
  delete safeUser.password;
  delete safeUser.otp;

  return apiResponse.created(res, 'Team member invited successfully', { user: safeUser });
});

/**
 * Update team member
 */
export const updateUser = asyncHandler(async (req, res) => {
  const { name, role, password, isActive } = req.body;

  const user = await User.findOne({ _id: req.params.id, shopId: req.user.shopId });
  if (!user) {
    return apiResponse.notFound(res, 'User not found');
  }

  // Prevent changing role of the owner
  if (user.role === 'OWNER' && role && role !== 'OWNER') {
    return apiResponse.badRequest(res, 'Cannot change role of the primary owner');
  }

  if (name) user.name = name.trim();
  if (role && user.role !== 'OWNER') user.role = role;
  if (isActive !== undefined) user.isActive = isActive;
  if (password && password.trim()) {
    user.password = await bcrypt.hash(password.trim(), 12);
  }

  await user.save();

  const safeUser = user.toObject();
  delete safeUser.password;
  delete safeUser.otp;

  return apiResponse.success(res, 'Team member updated successfully', { user: safeUser });
});

/**
 * Toggle user active/inactive status
 */
export const toggleStatus = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, shopId: req.user.shopId });
  if (!user) {
    return apiResponse.notFound(res, 'User not found');
  }

  if (user.role === 'OWNER') {
    return apiResponse.badRequest(res, 'Cannot deactivate the primary account owner');
  }

  user.isActive = req.body.isActive !== undefined ? req.body.isActive : !user.isActive;
  await user.save();

  return apiResponse.success(res, `User status updated to ${user.isActive ? 'Active' : 'Inactive'}`, {
    user: { _id: user._id, isActive: user.isActive },
  });
});

/**
 * Delete team member
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, shopId: req.user.shopId });
  if (!user) {
    return apiResponse.notFound(res, 'User not found');
  }

  if (user.role === 'OWNER') {
    return apiResponse.badRequest(res, 'Cannot delete the primary account owner');
  }

  await user.deleteOne();

  return apiResponse.success(res, 'User removed from organization');
});

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  toggleStatus,
  deleteUser,
};
