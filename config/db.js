import mongoose from "mongoose";

const conectarDB = async () => {
    try {
        // Conectamos a la BD
        const connection = await mongoose.connect(process.env.MONGO_URI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );

        // Mostramos la conexión en la consola, cuando se inicie la app
        const url = `${connection.connection.host}:${connection.connection.port}`
        console.log(`MongoDB conectado en: ${url}`)

    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
}

export default conectarDB;