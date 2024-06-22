import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/token.js'; // Importa el modelo de usuario desde donde esté definido

dotenv.config();

const authenticateJWT = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verificar tiempo de expiración
        if (decoded.exp <= Date.now() / 1000) {
            return res.status(401).json({ message: 'Token expirado' });
        }

        // Verificar si el usuario está activo
        const user = await User.findById(decoded.id);
        if (!user || !user.isActive) {
            return res.status(401).json({ message: 'Usuario no activo' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido' });
    }
};

export { authenticateJWT };
