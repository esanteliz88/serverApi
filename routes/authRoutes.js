import express from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../jwt.js';
import User from '../models/token.js'; // Importar el modelo de usuario

const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
    const { username, password, appsUsed, fullName, email } = req.body;

    try {
        // Validar que el usuario no exista
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'El usuario ya existe.' });
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
        user = new User({
            username,
            password: hashedPassword,
            isActive: false, // Por defecto, el usuario está inactivo al registrarse
            appsUsed,
            fullName,
            email,
        });

        // Guardar usuario en la base de datos
        await user.save();

        // Generar token
        const token = generateToken(user);

        res.status(200).json({ token: `Bearer ${token}` }); // Concatenar 'Bearer' al token
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Inicio de sesión de usuario
router.post('/token', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Buscar al usuario
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Usuario o contraseña incorrectos.' });
        }

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Usuario o contraseña incorrectos.' });
        }

        // Verificar si el usuario está activo
        if (!user.isActive) {
            return res.status(400).json({ message: 'El usuario no está activo.' });
        }

        // Generar token
        const token = generateToken(user);

        res.status(200).json({ token: `Bearer ${token}` }); // Concatenar 'Bearer' al token
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

export { router as authRouter };
