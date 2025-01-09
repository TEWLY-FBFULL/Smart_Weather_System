const sgMail = require('@sendgrid/mail'); // manage Email Verification 
require('dotenv').config(); // import .env

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * sent email with SendGrid
 * @param {string} to
 * @param {string} subject
 * @param {string} html
 */

const sendEmail = async (to, subject, html) => {
    try {
        const msg = {
            to,
            from: process.env.EMAIL,
            subject,
            html,
        };
        await sgMail.send(msg);
        console.log('ส่งอีเมลสำเร็จ');
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการส่งอีเมล:', error.response.body);
        throw new Error('Failed to send email');
    }
};

module.exports = sendEmail;