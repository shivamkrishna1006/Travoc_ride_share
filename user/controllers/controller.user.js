const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
module.exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !phone || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Check if phone already exists
        const phoneExists = await userModel.findOne({ phone });
        if (phoneExists) {
            return res.status(400).json({ message: 'Phone number already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword
        });

        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, { httpOnly: true });
        res.status(201).json({ 
            message: 'User registered successfully',
            userId: newUser._id,
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }   
};

// Login user
module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required' });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: 'Account is inactive' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, { httpOnly: true });
        res.status(200).json({
            message: 'Login successful',
            userId: user._id,
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user profile
module.exports.getProfile = async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await userModel.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user profile
module.exports.updateProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { firstName, lastName, profilePicture, emergencyContact } = req.body;

        const updateData = {};
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (profilePicture) updateData.profilePicture = profilePicture;
        if (emergencyContact) updateData.emergencyContact = emergencyContact;

        const user = await userModel.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update home address
module.exports.updateHomeAddress = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { street, city, state, zipCode, country, coordinates } = req.body;

        const homeAddress = {
            street: street || undefined,
            city: city || undefined,
            state: state || undefined,
            zipCode: zipCode || undefined,
            country: country || undefined
        };

        if (coordinates) {
            homeAddress.coordinates = {
                type: 'Point',
                coordinates: coordinates // [longitude, latitude]
            };
        }

        const user = await userModel.findByIdAndUpdate(
            userId,
            { homeAddress },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Home address updated', user });
    } catch (error) {
        console.error('Update home address error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update work address
module.exports.updateWorkAddress = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { street, city, state, zipCode, country } = req.body;

        const workAddress = {
            street,
            city,
            state,
            zipCode,
            country
        };

        const user = await userModel.findByIdAndUpdate(
            userId,
            { workAddress },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Work address updated', user });
    } catch (error) {
        console.error('Update work address error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add payment method
module.exports.addPaymentMethod = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { type, cardNumber, cardHolderName, expiryDate, isDefault } = req.body;

        if (!type || !cardNumber || !cardHolderName || !expiryDate) {
            return res.status(400).json({ message: 'All payment details required' });
        }

        const newPaymentMethod = {
            type,
            cardNumber,
            cardHolderName,
            expiryDate,
            isDefault: isDefault || false
        };

        const user = await userModel.findByIdAndUpdate(
            userId,
            { $push: { paymentMethods: newPaymentMethod } },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(201).json({ message: 'Payment method added', user });
    } catch (error) {
        console.error('Add payment method error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete payment method
module.exports.deletePaymentMethod = async (req, res) => {
    try {
        const userId = req.params.userId;
        const paymentMethodId = req.params.paymentMethodId;

        const user = await userModel.findByIdAndUpdate(
            userId,
            { $pull: { paymentMethods: { _id: paymentMethodId } } },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Payment method deleted', user });
    } catch (error) {
        console.error('Delete payment method error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update preferences
module.exports.updatePreferences = async (req, res) => {
    try {
        const userId = req.params.userId;
        const preferences = req.body;

        const user = await userModel.findByIdAndUpdate(
            userId,
            { preferences },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Preferences updated', user });
    } catch (error) {
        console.error('Update preferences error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Logout user
module.exports.logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all users (admin only)
module.exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find().select('-password');
        res.status(200).json({ users });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete user account
module.exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await userModel.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.clearCookie('token');
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Change password
module.exports.changePassword = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new password required' });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};