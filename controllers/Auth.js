const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const User = require('../models/User');
const { generateToken, getCookieOptions } = require('../utils/jwt');


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
        console.log(uuid());
        

        const { password: _, ...userData } = user.toJSON();

        res.status(200).json({ message: 'Login successful', user: userData });
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

const register = async (req, res) => {
    try {
        const {name, email, password, confirmPassword} = req.body;
        
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'El email ya está registrado' });
        }
        if (password !== confirmPassword) {
            return res.status(422).json({ message: 'Las contraseñas no coinciden' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPassword });

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor'}); 
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

        // Aquí enviarías el email con el token para restablecer la contraseña

        res.status(200).json({ message: 'Se ha enviado un email con instrucciones para recuperar tu contraseña' });
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

module.exports = {
    login,
    register,
    logout,
    forgotPassword
}