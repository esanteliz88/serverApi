import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';


const PORT = process.env.PORT || 4000;

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Autenticación',
            version: '1.0.0',
            description: 'Documentación de la API de Autenticación con Swagger',
        },
        servers: [
            {
                url: 'http://localhost:${PORT}/api', // Cambia la URL base según tu configuración
                description: 'Servidor de desarrollo',
            },
        ],
    },
    apis: ['./routes/*.js'], // Rutas donde se definen las operaciones de la API
};

const specs = swaggerJsdoc(options);

export default specs;

