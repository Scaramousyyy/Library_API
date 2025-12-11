import { verifyAccessToken } from "../utils/jwt.js"; 
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({ 
            success: false, 
            message: "Authentication required: Missing Authorization header" 
        });
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ 
            success: false, 
            message: "Invalid token format: Must be 'Bearer <token>'" 
        });
    }

    try {
        const decoded = verifyAccessToken(token); 
        
        req.user = decoded; 
        
        next();
    } catch (err) {
        
        if (err instanceof TokenExpiredError) {
            return res.status(401).json({ 
                success: false, 
                message: "Access token has expired." 
            });
        }
        
        if (err instanceof JsonWebTokenError) {
             return res.status(401).json({ 
                success: false, 
                message: "Invalid token signature or format." 
            });
        }

        next(err); 
    }
};