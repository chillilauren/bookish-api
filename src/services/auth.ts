import crypto from "crypto";

interface HashResult {
    salt: string;
    hashedPassword: string;
}

export const hashPassword = (password: string): HashResult => {
    const salt = generateSalt();
    const hashedPassword = crypto
        .createHash('sha256')
        .update(password)
        .digest('base64');
    
    return { salt, hashedPassword }
}

const generateSalt = (): string => {
    return crypto.randomBytes(16).toString('base64');
}