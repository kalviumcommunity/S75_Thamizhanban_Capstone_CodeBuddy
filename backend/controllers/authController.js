const bcrypt = require('bcrypt');
const { Signup } = require('../model/UserScehma');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All the data are required" });
        }
        const hashedPass = await bcrypt.hash(password, 10);
        await Signup.create({ email, password: hashedPass });
        res.status(201).json({ message: "Data created successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const dataExist = await Signup.findOne({ email });
        if (!dataExist) {
            return res.status(404).json({ message: "No users found on this email" });
        }

        const isPasswordValid = await bcrypt.compare(password, dataExist.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid Password" });
        }

        const token = jwt.sign({ id: dataExist._id, email: dataExist.email }, process.env.JWT_SECRET, { expiresIn: '24h' });

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            // Use 'Lax' for local development to allow cookies across localhost ports
            // 'Strict' blocks it. 'None' requires Secure=true which needs HTTPS.
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 3600000 * 24 // 24 hours (increased from 1h for better UX)
        });

        res.status(200).json({ message: "Login successful!", user: { email: dataExist.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: "Logout successful" });
};

const getSignupData = async (req, res) => {
    try {
        const data = await Signup.find();
        if (!data) {
            return res.status(500).json({ message: 'Data not found' });
        }
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const verifyUser = (req, res) => {
    res.status(200).json({ user: req.user, message: "Authorized" });
};

module.exports = { signup, login, logout, getSignupData, verifyUser };
