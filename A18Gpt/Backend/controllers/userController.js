import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// Register User
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.json({
                success: false,
                message: "User already exists",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = generateToken(user._id);

        return res.json({
            success: true,
            token,
        });

    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

// Login User
export const loginUser = async (req, res) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = generateToken(user._id);

        return res.json({
            success: true,
            token,
        });

    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

// Get User
export const getUser = async (req, res) => {

    try {

        return res.json({
            success: true,
            user: req.user,
        });

    } catch (error) {

        return res.json({
            success: false,
            message: error.message,
        });

    }
};