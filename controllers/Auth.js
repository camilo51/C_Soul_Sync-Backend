const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const User = require('../models/User');
const { generateToken, getCookieOptions } = require('../utils/jwt');
const { sendEmail } = require('./Email');
const messages = require('../utils/messages');


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json(messages.error('Usuario no encontrado'));
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json(messages.error('Contraseña incorrecta'));
        }

        const token = generateToken(user.id);
        res.cookie('token', token, getCookieOptions());

        const { password: _, ...userData } = user.toJSON();

        res.status(200).json(messages.success('Usuario autenticado exitosamente', { user: userData }));
    } catch (error) {
        res.status(500).json(messages.error('Error interno del servidor'));
    }
}

const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json(messages.error('El correo electrónico ya está en uso'));
        }
        if (password !== confirmPassword) {
            return res.status(422).json(messages.error('Las contraseñas no coinciden'));
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPassword });

        const token = generateToken(user.id);
        res.cookie('token', token, getCookieOptions());        

        const { password: _, ...userData } = user.toJSON();

        res.status(201).json(messages.success('Usuario registrado exitosamente', { user: userData }));
    } catch (error) {
        res.status(500).json(messages.error('Error interno del servidor')); 
    }
}

const logout = (req, res) => {
    res.clearCookie('token', getCookieOptions());
    res.status(200).json(messages.success('Usuario desconectado exitosamente'));
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json(messages.error('El email es requerido'));
        }
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json(messages.error('Se ha enviado un email con instrucciones para recuperar tu contraseña'));
        }

        const token = uuid();
        user.token = token;
        await user.save();

        await sendEmail(user.email, user.name, token, 'forgot-password');

        res.status(200).json(messages.success('Se ha enviado un email con instrucciones para recuperar tu contraseña'));
    } catch (error) {
        res.status(500).json(messages.error('Error interno del servidor'));
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token, password, confirmPassword } = req.body;
        if (!token) {
            return res.status(400).json(messages.error('El token es requerido'));
        }
        const user = await User.findOne({ where: { token } });
        if (!user) {
            return res.status(400).json(messages.error('El token es inválido o ha expirado. Por favor solicita un nuevo enlace'));
        }
        if (password !== confirmPassword) {
            return res.status(400).json(messages.error('Las contraseñas no coinciden'));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.token = null;
        await user.save();

        res.status(200).json(messages.success('Contraseña restablecida exitosamente'));
    } catch (error) {
        res.status(500).json(messages.error('Error interno del servidor'));
    }
};

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
        console.error(error);
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
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    sendEmailVerify,
    verifyAccount
}