import 'dotenv/config';
import mongoose from 'mongoose';

try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
} catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
}

const validation = new mongoose.Schema({
    email: String,
    otp: String
});

export const db_otp = mongoose.model('otpverify', validation, 'email');