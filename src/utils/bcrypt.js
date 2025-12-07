import bcrypt from "bcrypt";

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password, hashed) => {
  return await bcrypt.compare(password, hashed);
};