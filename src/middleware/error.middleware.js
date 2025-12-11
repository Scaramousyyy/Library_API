import { Prisma } from '@prisma/client';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

export const errorHandler = (err, req, res, next) => {
    const NODE_ENV = process.env.NODE_ENV || 'development';
    console.error(`[${NODE_ENV}]`, "ERROR:", err.message);
    if (NODE_ENV === 'development' && err.stack) {
        console.error(err.stack);
    }

    let statusCode = 500;
    let message = "Internal Server Error";
    let errors = undefined;

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case 'P2002': // Unique constraint violation
                statusCode = 409;
                message = "Duplicate entry error";
                errors = err.meta?.target || ['Unique field constraint violated'];
                break;
            case 'P2025': // Record not found
                statusCode = 404;
                message = "Resource not found";
                break;
            case 'P2003': // Foreign Key constraint violation
                statusCode = 400;
                message = "Foreign key constraint failed";
                break;
            default:
                break;
        }
    }

    else if (err instanceof JsonWebTokenError) {
        statusCode = 401;
        message = "Invalid token signature or format.";
    } else if (err instanceof TokenExpiredError) {
        statusCode = 401;
        message = "Token has expired.";
    }

    else if (err.errors) {
         statusCode = 400;
         message = "Validation Error";
         errors = err.errors;
    }

    if (statusCode === 500 && NODE_ENV !== 'development') {
        message = "Internal Server Error";
        errors = undefined;
    }
    
    if (statusCode === 500 && NODE_ENV === 'development' && err.message) {
        message = err.message;
    }


    return res.status(statusCode).json({
        success: false,
        message: message,
        ...(errors && { errors: errors }),
        ...(statusCode === 500 && NODE_ENV === 'development' && { stack: err.stack }),
    });
};