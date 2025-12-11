const jwtConfig = {
    // Access Token
    ACCESS_SECRET: process.env.JWT_SECRET,
    ACCESS_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m', 

    // Refresh Token
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

    // Password Hashing Salt Rounds
    SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10,
};

if (!jwtConfig.ACCESS_SECRET || !jwtConfig.REFRESH_SECRET) {
    console.error("Kesalahan Konfigurasi: JWT_SECRET atau JWT_REFRESH_SECRET tidak ditemukan.");
    if (process.env.NODE_ENV === 'production') {
        throw new Error("Critical Error: JWT secrets must be configured.");
    }
}

export default jwtConfig;