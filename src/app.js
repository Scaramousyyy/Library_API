import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import apiRouter from "./routes/index.js";
import { errorHandler } from './middleware/error.middleware.js';
import { loggerMiddleware } from './middleware/logger.middleware.js';

const app = express();

// --- MIDDLEWARE GLOBAL ---

app.use(helmet());
app.use(compression());
app.use(loggerMiddleware); 
app.use(express.json());

const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};
app.use(cors(corsOptions));


// --- ENDPOINT DASAR & HEALTH CHECK ---
app.get("/", (req, res) => {
    res.json({ 
        success: true,
        message: `${process.env.APP_NAME} API running!`,
    });
});


// --- ROUTE REGISTRATION ---
app.use("/api", apiRouter); 


// --- ERROR HANDLING & 404 FALLBACK ---
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Resource not found on this server."
    });
});

app.use(errorHandler);

export default app;