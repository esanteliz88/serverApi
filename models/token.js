import mongoose from 'mongoose';

const userTokenSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: false }, // Estado de activación del usuario
    appsUsed: { type: String, default: "" }, // Lista de aplicaciones que utiliza el usuario
    fullName: { type: String, default: "" },
    email: { type: String, default: "" },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Rol del usuario (ej. 'user' o 'admin')
    createdAt: { type: Date, default: Date.now }, // Fecha de creación del usuario
});

const UserToken = mongoose.model('UserToken', userTokenSchema);

export default UserToken;
