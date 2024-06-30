import express from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { generateToken } from '../jwt.js';
import User from '../models/token.js';

const router = express.Router();

// Registro de usuario
router.post('/register', [
    body('username').notEmpty().withMessage('El nombre de usuario es requerido').isString().withMessage('El nombre de usuario debe ser un string'),
    body('password').notEmpty().withMessage('La contraseña es requerida').isString().withMessage('La contraseña debe ser un string').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('appsUsed').notEmpty().withMessage('Ingrese qué App va a usar este servicio').isString().withMessage('El campo appsUsed debe ser un string'),
    body('fullName').optional().isString().withMessage('El nombre completo debe ser un string'),
    body('email').optional().isEmail().withMessage('El email debe tener un formato válido'),
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

            // Hashear la contraseña antes de almacenarla
            const hashedPassword = await bcrypt.hash(password, 10);

            // Crear usuario con los datos proporcionados
            user = new User({
                username,
                password: hashedPassword,
                isActive: false,
                appsUsed,
                fullName,
                email,
            });

            // Guardar usuario en la base de datos
            await user.save();

            // Devolver client_id y la contraseña hasheada
            res.status(200).json({
                message: 'Usuario registrado exitosamente. Debe ser activado por un administrador.',
                client_id: user._id, // Usando el _id como client_id
                secret_key: hashedPassword, // Devolver la clave hasheada
            });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
]);

// Inicio de sesión de usuario
router.post('/token', [
    body('client_id').notEmpty().withMessage('El Client ID es requerido').isString().withMessage('El Client ID debe ser un string'),
    body('secret_key').notEmpty().withMessage('La Secret Key es requerida').isString().withMessage('La Secret Key debe ser un string'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { client_id, secret_key } = req.body;

        try {
          

            const user = await User.findById(client_id);
            if (!user) {
                return res.status(400).json({ message: 'Usuario no encontrado.' });
            }

           

            // Deshashear la clave recibida para compararla con la almacenada
            if (secret_key !== user.password) {
                return res.status(400).json({ message: 'Usuario o contraseña incorrectos.' });
            }
            
            if (user.isActive){
                const token = generateToken(user);
                res.status(200).json({ token: `Bearer ${token}` });
            }else{
                return res.status(400).json({ message: 'Usuario inactivo.' }); 
            }

            // Si las contraseñas coinciden, generar y devolver el token
           
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
]);

export { router as authRouter };
