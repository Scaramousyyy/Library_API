import bcrypt from 'bcrypt';
import jwtConfig from '../config/jwt.js';
const { SALT_ROUNDS } = jwtConfig;

export const hashPassword = async (password) => {
    return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};