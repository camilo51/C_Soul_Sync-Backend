const User = require('../models/User');
const bcrypt = require('bcryptjs');


const login = (req, res) => {
    res.json('Login');
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

module.exports = {
    login,
    register
}