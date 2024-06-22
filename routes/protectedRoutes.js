import express from 'express';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

// Ejemplo de ruta protegida
router.get('/', authenticateJWT, (req, res) => {
    res.json({ message: 'Esta es una ruta protegida', user: req.user });
});

export default router;
