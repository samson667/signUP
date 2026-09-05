import 'dotenv/config';
import mongoose from 'mongoose'

await mongoose.connect(process.env.MONGO_URI)

const validation = new mongoose.Schema({
    email: String,
    otp: String
})

export const db_otp = mongoose.model('otpverify', validation, 'email')