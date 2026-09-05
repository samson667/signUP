import mongoose from 'mongoose'




    await mongoose.connect(
        'mongodb+srv://samson66:samson7890@cluster0.2kgdexp.mongodb.net/otp?appName=Cluster0'
    )

    const validation = new mongoose.Schema({
        email: String,
        otp: String
    })

   export const db_otp = mongoose.model(
        'otpverify',
        validation,
        'email'
    )

   




    



