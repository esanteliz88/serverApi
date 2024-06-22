import dotenv from 'dotenv';

dotenv.config();

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        // Solo mostrar el stack trace en desarrollo
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

const notFound = (req, res, next) => {
    res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
};

export { errorHandler, notFound };
