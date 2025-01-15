import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    bio: {
        type: String,
    },
    emailID: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    profilePhoto: {
        type: String,
        default: 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?size=626&ext=jpg'
    },
    isAdmin : {
        type: Boolean,
        default: false,
    },
    oAuth: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
    }
}, {timestamps: true});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 8);
    next();
});

userSchema.methods.isPasswordCorrect = async function(password) {
    if (!password || !this.password) {
        throw new Error('Password or stored hash is missing');
    }
    return await bcrypt.compare(password, this.password);
};


userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            emailID: this.emailID,
            userName: this.userName,
            fullName: this.fullName,
            isAdmin: this.isAdmin,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            isAdmin: this.isAdmin,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};

export const User = mongoose.model('User', userSchema);
