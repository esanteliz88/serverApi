import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; // Importar la función de conexión a la base de datos
import { authRouter } from './routes/authRoutes.js';
import protectedRouter from './routes/protectedRoutes.js'; // Importar el router de rutas protegidas

dotenv.config();
const app = express();
app.use(express.json());

// Conectar a MongoDB
connectDB();

// Rutas de autenticación
app.use('/api/auth', authRouter);

// Rutas protegidas
app.use('/api/protected', protectedRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}`);
});

// Ruta raíz
app.get('/', (req, res) => {
    res.send({ msg: 'API' });
});

// Middleware para servir archivos estáticos
app.use(express.static('public'));
