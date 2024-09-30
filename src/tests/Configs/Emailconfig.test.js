require('dotenv').config();
const nodemailer = require('nodemailer');
const EmailConfig = require('../../config/Emailconfig');

jest.mock('nodemailer', () => ({
    createTransport: jest.fn(() => ({
        sendMail: jest.fn(),
    })),
}));

describe('EmailConfig', () => {
    let emailConfig;

    beforeAll(() => {
        emailConfig = new EmailConfig();
    });

    it('deve criar um transportador de e-mail com as configurações corretas', () => {
        expect(nodemailer.createTransport).toHaveBeenCalledWith({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: { rejectUnauthorized: false }
        });
    });

    it('deve enviar um e-mail com sucesso', async () => {
        const mailOptions = {
            from: 'teste@gmail.com',
            to: 'destinatario@gmail.com',
            subject: 'Teste',
            text: 'Mensagem de teste'
        };

        const mockResponse = { response: 'E-mail enviado com sucesso' };
        emailConfig.transporter.sendMail.mockResolvedValue(mockResponse); 

        const result = await emailConfig.sendMail(mailOptions);
        expect(result).toEqual(mockResponse);
        expect(emailConfig.transporter.sendMail).toHaveBeenCalledWith(mailOptions);
    });

    it('deve lançar um erro se ocorrer um problema ao enviar o e-mail', async () => {
        const mailOptions = {
            from: 'teste@gmail.com',
            to: 'destinatario@gmail.com',
            subject: 'Teste',
            text: 'Mensagem de teste'
        };
        const errorMessage = 'Erro ao enviar';
        emailConfig.transporter.sendMail.mockRejectedValueOnce(new Error(errorMessage)); 

        await expect(emailConfig.sendMail(mailOptions)).rejects.toThrow(errorMessage);
        expect(emailConfig.transporter.sendMail).toHaveBeenCalledWith(mailOptions);
    });
});
