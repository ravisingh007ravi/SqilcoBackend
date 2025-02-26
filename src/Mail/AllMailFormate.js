const nodemailer = require("nodemailer");
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
        user: process.env.NodeMailerUser,
        pass: process.env.NodeMailerPass,
    },
});


exports.verifyOtp = async (name, email, randomOtp) => {
    
    const emailTemplate = {
        from: '"MoviesAll" <your-email@gmail.com>',
        to: email,
        subject: "Email Verification OTP - MoviesAll",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #16253D; padding: 30px; border-radius: 10px;">
                    <h1 style="color: #FF4500; margin: 0; padding-bottom: 20px;">MoviesAll</h1>
                    
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 8px;">
                        <h2 style="color: #16253D; margin-top: 0;">Verify Your Email</h2>
                        <p style="color: #333333;">Hello ${name},</p>
                        <p style="color: #333333;">Thank you for signing up with MoviesAll. To verify your email address, please use the following verification code:</p>
                        
                        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #16253D;">${randomOtp}</span>
                        </div>
                        
                        <p style="color: #333333; margin-bottom: 5px;"><strong>Important:</strong></p>
                        <ul style="color: #333333;">
                            <li>This verification code is valid for 5 minutes</li>
                            <li>Do not share this code with anyone</li>
                            <li>If you didn't create an account with MoviesAll, please ignore this email</li>
                        </ul>
                        
                        <p style="color: #333333; margin-top: 20px;">Welcome aboard!<br>Team MoviesAll</p>
                    </div>
                    
                    <div style="text-align: center; padding-top: 20px; color: #ffffff; font-size: 12px;">
                        <p>This is an automated message, please do not reply to this email.</p>
                    </div>
                </div>
            </div>
        `
    };

     try {
        const info = await transporter.sendMail(emailTemplate);
        console.log(`Email sent successfully. Message ID: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Email sending failed:", error);
        throw new Error("Failed to send OTP email");
    }
};