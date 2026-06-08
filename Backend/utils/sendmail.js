const nodemailer = require('nodemailer');

const sendmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: options.from,
            to: options.to,
            subject: options.subject,
            text: options.text
        };
        console.log(mailOptions);
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = sendmail;