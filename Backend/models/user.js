//require mongoose
const mongoose = require('mongoose');

// require bcrypt
const bcrypt = require('bcrypt');

// require validator
const validator = require('validator');

//create user schema
const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },  // Hashed password
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: "user"
    }    // "user" or "admin"

}, { timestamps: true }
);

// static method to create a new user
userSchema.statics.signup = async function (email, password, role) {

    // Validate email and password
    if (!email || !password) {
        throw Error('All fields must be filled');
    }
    if (!validator.isEmail(email)) {
        throw Error('Email is not valid');
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('Password is not strong enough');
    }

    // Check if user with this email already exists
    const exists = await this.findOne({ email });

    // If user with this email already exists, throw an error
    if (exists) {
        throw Error('Email already in use');
    }

    // Generate a salt and hash the password with the salt
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create a new user with the hashed password
    const user = await this.create({email, password: hash, role});

    return user;
}

// static method to login a user
userSchema.statics.login =  async function (email, password) {

    if (!email || !password) {
        throw Error('All fields must be filled');
    }

    // check if email exists
    const user = await this.findOne({ email });
    
    if (!user) {
        throw Error('Incorrect email');
    }

    // check if password is correct
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw Error('Incorrect password');
    }

    // Ensure the user has a role (backward compatibility)
    if (!user.role) {
        user.role = 'user';  // Default role if missing
        await user.save();   // Update the document
    }

    return user;

}

userSchema.statics.updateUser = async function (userId, email, currentPassword, newPassword) {
    // Validate incoming data
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID');
    }

    const user = await this.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    // Verify current password if changing sensitive data
    if (email || newPassword) {
        if (!currentPassword) {
            throw new Error('Current password is required for changes');
        }
        
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            throw new Error('Current password is incorrect');
        }
    }

    // Update fields
    const updates = {};
    if (email && email !== user.email) {
        if (!validator.isEmail(email)) {
            throw new Error('Email is not valid');
        }

        const emailExists = await this.findOne({ email });
        if (emailExists) {
            throw new Error('Email already in use');
        }
        updates.email = email;
    }

    if (newPassword) {
        if (!validator.isStrongPassword(newPassword, { 
            minLength: 8, 
            minLowercase: 1, 
            minUppercase: 1, 
            minNumbers: 1, 
            minSymbols: 1 
        })) {
            throw new Error('Password must be at least 8 characters with uppercase, lowercase, number and symbol');
        }

        const salt = await bcrypt.genSalt(10);
        updates.password = await bcrypt.hash(newPassword, salt);
        updates.passwordChangedAt = Date.now();
    }

    // Apply updates
    return await this.findByIdAndUpdate(
        userId,
        updates,
        { new: true, runValidators: true }
    );
}

//export user model
module.exports = mongoose.model('User', userSchema);
