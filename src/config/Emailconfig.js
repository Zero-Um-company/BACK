require('dotenv').config();
const nodemailer = require('nodemailer');

class EmailConfig {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: { rejectUnauthorized: false }
        });
    }

    async sendMail(mailOptions) {
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log(`E-mail enviado: ${info.response}`);
            return info;
        } catch (error) {
            throw new Error(`Erro ao enviar e-mail: ${error.message}`);
        }
    }
}

module.exports = EmailConfig;