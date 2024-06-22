// validationMessages.js

export default {
    username: {
        notEmpty: 'El nombre de usuario es obligatorio',
        isString: 'El nombre de usuario debe ser un texto',
    },
    password: {
        notEmpty: 'La contraseña es obligatoria',
        isString: 'La contraseña debe ser un texto',
        isLength: 'La contraseña debe tener al menos 6 caracteres',
    },
    appsUsed: {
        isString: 'Las aplicaciones utilizadas deben ser un texto',
    },
    fullName: {
        isString: 'El nombre completo debe ser un texto',
    },
    email: {
        isEmail: 'Debe proporcionar un correo electrónico válido',
    },
};
