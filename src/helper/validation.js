const validator = require("validator");
const Users = require("../../model/Users");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require("bcryptjs");



const verifyRequired = (req, requiredFields) => {
    const errorMsg = []
    for (const field of requiredFields) {
        if (!req.body[field]) {
            errorMsg.push(`${field} is required`);
        }
    }
    return errorMsg;
};

const isExistingUser = async (email) => {
    let Userinfo = await Users.findOne({ email });
    return Userinfo ? true : false
}

const fetchUser = async (email) => {
    let Userinfo = await Users.findOne({ email });
    return Userinfo
}

const bcryptPassword = async (password) => {
    let bcryptPass = await bcrypt.hash(password, 7);
    return bcryptPass
}
const generateResetToken = () => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(20, (err, buffer) => {
            if (err) {
                reject(err);
            } else {
                const resetToken = buffer.toString('hex');
                resolve(resetToken);
            }
        });
    });
};



const sendResetEmail = async (recipientEmail, resetToken) => {
    try {
        // Create a transporter using your email service provider's SMTP settings
        const transporter = nodemailer.createTransport({
            service: "gmail",
            secure: false, // Set to true if using a secure connection (e.g., SSL/TLS)
            auth: {
                user: 'urvashil.itpath@gmail.com',
                pass: 'rjfhsbwlwtkihvey',
            },
        });

        // Compose the email message
        const message = {
            from: 'abc@gmail.com',
            to: recipientEmail,
            subject: 'Password Reset',
            text: `Click on the following link to reset your password: http://your-frontend-url/reset-password?token=${resetToken}`,
            html: `<p>Click <a href="http://your-frontend-url/reset-password?token=${resetToken}">here</a> to reset your password.</p>`,
        };

        // Send the email
        const info = await transporter.sendMail(message);
        console.log(`Reset email sent to ${recipientEmail}. Message ID: ${info.messageId}`);
    } catch (error) {
        console.error('Error sending reset email:', error);
    }
};


module.exports = {
    isExistingUser,
    fetchUser,
    verifyRequired,
    generateResetToken,
    sendResetEmail,
    bcryptPassword
};  