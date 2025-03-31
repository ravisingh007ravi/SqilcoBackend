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




exports.ChangeUserEmail = async (name, email, randomOtp) => {

    const emailTemplate = {
        from: '"MoviesAll" <support@moviesall.com>',
        to: email,
        subject: "Email Change Verification - MoviesAll",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <!-- Header -->
                <div style="background-color: #16253D; padding: 25px; border-radius: 10px 10px 0 0;">
                    <h1 style="color: #FF4500; font-size: 24px; font-weight: bold; margin: 0;">MoviesAll</h1>
                </div>
                
                <!-- Content -->
                <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0;">
                    <h2 style="color: #16253D; margin-top: 0;">Confirm Your Email Change</h2>
                    <p style="margin: 0 0 15px 0; line-height: 1.6;">Hello ${name},</p>
                    <p style="margin: 0 0 15px 0; line-height: 1.6;">We received a request to change the email address associated with your MoviesAll account. To complete this change, please use the following verification code:</p>
                    
                    <!-- OTP Box -->
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 25px 0; text-align: center; border: 1px dashed #16253D;">
                        <p style="margin: 0 0 10px 0; font-weight: bold;">Your verification code:</p>
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #FF4500; font-family: 'Courier New', monospace;">${randomOtp}</span>
                    </div>
                    
                    <!-- Important Info -->
                    <p style="margin: 0 0 5px 0; font-weight: bold;">Important information:</p>
                    <ul style="margin: 5px 0 20px 0; padding-left: 20px;">
                        <li style="margin-bottom: 5px;">This code will expire in 5 minutes</li>
                        <li style="margin-bottom: 5px;">For your security, don't share this code with anyone</li>
                        <li>If you didn't request this change, please secure your account immediately</li>
                    </ul>
                    
                    <!-- Support Info -->
                    <p style="margin: 25px 0 15px 0; line-height: 1.6;">Need help? Contact our support team at <a href="mailto:support@moviesall.com" style="color: #FF4500; text-decoration: none;">support@moviesall.com</a></p>
                    
                    <!-- Signature -->
                    <p style="margin: 0; line-height: 1.6;">Best regards,<br>The MoviesAll Team</p>
                </div>
                
                <!-- Footer -->
                <div style="text-align: center; padding-top: 20px; color: #777777; font-size: 12px; margin-top: 20px; border-top: 1px solid #eeeeee;">
                    <p style="margin: 5px 0;">This is an automated message. Please do not reply directly to this email.</p>
                    <p style="margin: 5px 0;">&copy; ${new Date().getFullYear()} MoviesAll. All rights reserved.</p>
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
        throw new Error("Failed to send verification email");
    }
};