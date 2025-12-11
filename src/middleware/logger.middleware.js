export const loggerMiddleware = (req, res, next) => {
    const start = Date.now();
    
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;

    console.log(`[REQUEST IN] ${new Date().toISOString()} | ${req.method} ${req.originalUrl} | IP: ${ip}`);

    res.on('finish', () => {
        const duration = Date.now() - start;
        
        const logMessage = 
            `[RESPONSE OUT] ${new Date().toISOString()} | ` +
            `${req.method} ${req.originalUrl} | ` +
            `Status: ${res.statusCode} | ` +
            `Duration: ${duration}ms | ` +
            `IP: ${ip}`;

        console.log(logMessage);
    });

    next();
};