 import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name is required!"],
        minLength: [3, "First Name must contain at least 3 characters!"],
    },
    lastName: {
        type: String,
        required: [true, "Last Name is required!"],
        minLength: [3, "Last Name must contain at least 3 characters!"],
    },
    email: {
        type: String,
        required: [true, "Email is required!"],
        validate: [validator.isEmail, "Provide a valid email!"],
    },
    phone: {
        type: String,
        required: [true, "Phone number is required!"],
        minLength: [11, "Phone number must contain exactly 11 digits!"],
        maxLength: [11, "Phone number must contain exactly 11 digits!"],
    },
    nic: {
        type: String,
        required: [true, "NIC is required!"],
        minLength: [13, "NIC must contain 13 digits!"],
        maxLength: [13, "NIC must contain 13 digits!"],
    },
    dob: {
        type: Date,
        required: [true, "Date of Birth is required!"],
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female"],
        default: "Male",
    },
    password: {
        type: String,
        required: true,
        select: false,
        minLength: [8, "Password must contain at least 8 characters!"],
    },
    role: {
        type: String,
        required: true,
        enum: ["Admin", "Patient", "Doctor"],
        
    },
    doctorDepartment: {
        type: String,
        default: null,
    },
    docAvatar: {
        public_id: String,
        url: String,
      },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {        
        next();
    }
    this.password = await bcrypt.hash(this.password, 10); // password jo aya he us ko hash man convert karni ke lei bcrypt ka use 
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {        // jo hash password aya he us ko jo fer se Passowrd Enter hoa he us dono ko Compair karni ke lei bcrpt ek methord provide karta he compairPassowrd
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT
userSchema.methods.generateJsonWebToken = function () {         // uper wale condition true hogie to us ka jwt token genrate hoga 
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {  // us ka Token User ke id per Genrate hoga Unique ID per per us JWT_SECRET_KEY matlb token hm  JWT_SECRET_KEY save kar de ge our us ko .env men rakhen ke Context APi ke Tarah hm apni peroject men kahan be use kar sakte hen 
        expiresIn: process.env.JWT_EXPIRES,
    });
};

export const User = mongoose.model("User", userSchema);
