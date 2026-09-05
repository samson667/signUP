import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import nodemailer from 'nodemailer'
import mongoose from 'mongoose'
import { otp_generte } from './private/otp.js'
import  {db_otp} from './private/atlas.js'
const app = express()

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'notshareotp@gmail.com',
    pass: 'hwcb ozwx xghd mzya'
  }
})
 

const PORT = process.env.PORT || 7000;



app.use(express.json())

let absulate_path = fileURLToPath(import.meta.url)
let dirpath = path.dirname(absulate_path)

app.use(express.static(path.join(dirpath, 'public')))

app.get('/', (req, res) => {
  try {
    
    res.sendFile(path.join(dirpath, 'views', 'home.html'))
  } catch (error) {
    res.status(500).res.send('server is failed')
  }
})

app.post('/sendOtp', async (req, res) => {
  try {
    await db_otp.deleteMany({ email: req.body.email });
    let otp = otp_generte();
    await db_otp.create({
      email: req.body.email,
      otp: otp
    });

    const mail = {
  from: 'OTP PROVIDER SERVICE',
  to: req.body.email,
  subject: 'Verify Your Email Address',
  html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 40px 0; color: #333333;">
        <div style="max-width: 500px; margin: auto; background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
            
            <!-- কোম্পানির লোগো বা ছবি (এখানে আপনার কোম্পানির লোগোর লিংক দিতে পারেন) -->
            <div style="text-align: center; margin-bottom: 25px;">
                <img src="https://img.icons8.com/ios-filled/100/ffffff/key.png" alt="Logo" style="width: 50px; height: 50px; margin-bottom: 10px;" />
                <h2 style="color: #1e293b; margin: 0; font-size: 22px; font-weight: bold;">OTP provider</h2>
            </div>

            <h3 style="color: #334155; font-size: 18px; margin-bottom: 15px;">Hello,</h3>
            <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 25px;">
                We received a request to verify your email address. Please use the following one-time password (OTP) to proceed:
            </p>

            <!-- ওটিপি দেখানোর প্রফেশনাল বক্স -->
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; text-align: center; font-size: 34px; font-weight: bold; letter-spacing: 8px; border-radius: 8px; margin: 25px 0; color: #0f172a;">
                ${otp}
            </div>

            <p style="font-size: 14px; color: #64748b; line-height: 1.5; margin-bottom: 30px;">
                This code is valid for <strong>5 minutes</strong>. For your security, do not share this code with anyone.
            </p>

            <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 25px 0;" />

            <!-- ফুটার বা হেল্প টেক্সট -->
            <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0; line-height: 1.4;">
                If you didn't request this, you can safely ignore this email.<br>© 2026 Your Company. All rights reserved.
            </p>
        </div>
    </div>
  `
};

    setTimeout(async () => {
      await db_otp.findOneAndDelete({ email: req.body.email });
    }, 300000); 

    console.log(
      `____________________________________${req.body.email}___________________________________`
    );

    transport.sendMail(mail, (error, info) => {
      if (error) {
        res.send('email send failed');
      } else {
        res.send('mail send successFull');
      }
    });
  } catch (error) {
    res.status(500).send('otp pathate giye server is failed');
  }
});

app.post("/verify",async(req,res)=>{
  let {email,userOtp}=req.body
  let result= await db_otp.findOne({email:email})
  if (!result) {
        return res.status(404).send('Email not found')
    }
  if(userOtp===result.otp){
     res.send("verified")
     return
  }
  res.send("worng otp")
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on ${PORT}`);
});