const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

const sendBookingEmail = async (userEmail,userName,eventTitle) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Booking Confirmed: ${eventTitle}',
            html: `
            <h2>Hi ${userName}!</h2>
            <p>Your booking for <strong>${eventTitle}</strong> has been confirmed.</p>
            <p>Thank you for choosing Eventora.</p>
            `

        };
        await transporter.sendMail(mailOptions);
        console.log(`Booking email sent to ${userEmail}`);
    } catch (error) {
        console.error('Error sending booking email to ${userEmail}:', error);
    }
};

exports.sendOTPEmail = async (email, otp,type ) => {
    try {

        const title = type === 'account_verification' ? 'Account Verification' : 'Event Booking';
        const msg = type === 'account_verification' ? 'Please use the following OTP to verify your account:' : 'Please use the following OTP to confirm your event booking:';

        const mailOptions = {
            from: process.env.EMAIL_USER    ,
            to: email,
            subject: 'Your OTP Code',
            // text: `Your OTP code for ${type} is: ${otp}`
            html:`
                <div> style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                    <h2>${title}</h2>
                    <p>${msg}</p>
                    <h3 style="color: #007bff;">${otp}</h3>
                    <p>Please enter this code to complete your request.</p>
                </div>
            `
        };
         await transporter.sendMail(mailOptions);
         console.log(`OTP email sent to ${email} for ${type}`);
    } catch (error) {
        console.error('Error sending OTP email to ${email}:', error);
    }
   
    
};