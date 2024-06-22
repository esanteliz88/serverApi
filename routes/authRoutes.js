import express from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { generateToken } from '../jwt.js';
import User from '../models/token.js';

const router = express.Router();

// Registro de usuario
router.post('/register', [
    body('username')
        .notEmpty().withMessage('El nombre de usuario es requerido')
        .isString().withMessage('El nombre de usuario debe ser un string'),
    body('password')
        .notEmpty().withMessage('La contraseña es requerida')
        .isString().withMessage('La contraseña debe ser un string')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('appsUsed')
        .notEmpty()
        .isString().withMessage('Ingrese que App va a usar este servicio'),
    body('fullName')
        .optional()
        .isString().withMessage('El nombre completo debe ser un string'),
    body('email')
        .optional()
        .isEmail().withMessage('El email debe tener un formato válido'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password, appsUsed, fullName, email } = req.body;

        try {
            let user = await User.findOne({ username });
            if (user) {
                return res.status(400).json({ message: 'El usuario ya existe.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            user = new User({
                username,
                password: hashedPassword,
                isActive: false,
                appsUsed,
                fullName,
                email,
            });

            await user.save();

            const token = generateToken(user);
            res.status(200).json({ token: `Bearer ${token}` });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
]);

// Inicio de sesión de usuario
router.post('/token', [
    body('username')
        .notEmpty().withMessage('El nombre de usuario es requerido')
        .isString().withMessage('El nombre de usuario debe ser un string'),
    body('password')
        .notEmpty().withMessage('La contraseña es requerida')
        .isString().withMessage('La contraseña debe ser un string'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        try {
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(400).json({ message: 'Usuario o contraseña incorrectos.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Usuario o contraseña incorrectos.' });
            }

            const token = generateToken(user);
            res.status(200).json({ token: `Bearer ${token}` });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
]);

export { router as authRouter };
