const { Resend } = require('resend');
const templates = require('../utils/email');
const { v4: uuid } = require('uuid');
const messages = require('../utils/messages');
const User = require('../models/User');
require('dotenv').config();

const resend = new Resend(process.env.EMAIL_API_KEY);

const sendEmail = async (email, name, token, templateName) => {
    try {

        const template = templates.find(t => t.name === templateName);
        if (!template) throw new Error('Template not found');

        const html = template.html(name, token);

        const response = await resend.emails.send({
            from: 'C-Soul Sync <onboarding@resend.dev>',
            to: [email],
            subject: 'MiApp Notification',
            html
        });
        return response;
    } catch (error) {
        throw error;
    }
}

const sendEmailVerify = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json(messages.error('El email es requerido'));
        }
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json(messages.success('Se ha enviado un email de verificación a tu correo electrónico.'));
        }
        const token = uuid();

        user.token = token;
        await user.save();

        await sendEmail(user.email, user.name, token, 'verify-account');
        return res.status(200).json(messages.success('Se ha enviado un email de verificación a tu correo electrónico.'));
    } catch (error) {
        return res.status(500).json(messages.error('Error interno del servidor'));
    }
};


const verifyAccount = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json(messages.error('El token es requerido'));
        }
        const user = await User.findOne({ where: { token } });
        if (!user) {
            return res.status(404).json(messages.error('El token es inválido o ha expirado. Por favor solicita un nuevo enlace'));
        }

        user.token = null;
        user.verified = true;
        await user.save();

        res.status(200).json(messages.success('Cuenta verificada exitosamente'));
    } catch (error) {
        res.status(500).json(messages.error('Error interno del servidor'));
    }
};

module.exports = {
    sendEmail,
    sendEmailVerify,
    verifyAccount
}
