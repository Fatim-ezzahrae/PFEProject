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
        default: "user"
    }    // "user" or "admin"

}, { timestamps: true }
);

// static method to create a new user
userSchema.statics.signup = async function (email, password) {

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
    const user = await this.create({email, password: hash});

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

    return user;

}

//export user model
module.exports = mongoose.model('User', userSchema);
