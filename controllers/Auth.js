const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const User = require('../models/User');
const { generateToken, getCookieOptions } = require('../utils/jwt');
const { sendEmail } = require('./Email');


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const token = generateToken(user.id);
        res.cookie('token', token, getCookieOptions());

        const { password: _, ...userData } = user.toJSON();

        res.status(200).json({ message: 'Login successful', user: userData });
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'El email ya está registrado' });
        }
        if (password !== confirmPassword) {
            return res.status(422).json({ message: 'Las contraseñas no coinciden' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPassword });

        const token = generateToken(user.id);
        res.cookie('token', token, getCookieOptions());        

        const { password: _, ...userData } = user.toJSON();

        res.status(201).json({ message: 'User registered successfully', user: userData });
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

const logout = (req, res) => {
    res.clearCookie('token', getCookieOptions());
    res.status(200).json({ message: 'Logout successful' });
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'El email es requerido' });
        }
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Se ha enviado un email con instrucciones para recuperar tu contraseña' });
        }

        const token = uuid();
        user.token = token;
        await user.save();

        await sendEmail(user.email, user.name, token, 'forgot-password');

        res.status(200).json({ message: 'Se ha enviado un email con instrucciones para recuperar tu contraseña' });
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token, password, confirmPassword } = req.body;
        if (!token) {
            return res.status(400).json({ message: 'Token es requerido' });
        }
        const user = await User.findOne({ where: { token } });
        if (!user) {
            return res.status(400).json({ message: 'El token es inválido o ha expirado. Por favor solicita un nuevo enlace' });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Las contraseñas no coinciden' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.token = null;
        await user.save();

        res.status(200).json({ message: 'Contraseña restablecida exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const sendEmailVerify = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'El email es requerido.' });
        }
        const user = await User.findOne({ where: { email } });
        const responseMessage = 'Si el email existe, hemos enviado instrucciones para recuperar tu contraseña.';

        if (!user) {
            return res.status(200).json({ message: responseMessage });
        }
        const token = uuid();

        user.token = token;
        user.tokenExpiration = Date.now() + 3600 * 1000; //validar 1 hora el token
        await user.save();

        //enviar email con forgot password
        await sendEmail(user.email, user.name, token, 'forgot-password');
        return res.status(200).json({ message: responseMessage });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
};


const verifyAccount = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: 'Token es requerido' });
        }
        const user = await User.findOne({ where: { token } });
        if (!user) {
            return res.status(400).json({ message: 'El token es inválido o ha expirado. Por favor solicita un nuevo enlace' });
        }

        user.token = null;
        user.verified = true;
        await user.save();

        res.status(200).json({ message: 'Cuenta verificada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = {
    login,
    register,
    logout,
    forgotPassword,
    resetPassword
}