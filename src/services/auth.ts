import crypto from "crypto";
import {SignInRequest} from "../models/requestModels";
import {fetchMemberByEmail} from "../database/members";

interface HashResult {
    salt: string;
    hashedPassword: string;
}

export const hashPassword = (password: string): HashResult => {
    const salt = generateSalt();
    const hashedPassword = hash(salt, password);
    
    return { salt, hashedPassword }
}

export const checkPassword = async (signInRequest: SignInRequest): Promise<boolean> => {
    const member = await fetchMemberByEmail(signInRequest.email);
    
    if (!member) {
        return false;
    }
    
    const hashedPasswordAttempt = hash(member.salt, signInRequest.password);
    return hashedPasswordAttempt === member.hashed_password;
}

const generateSalt = (): string => {
    return crypto.randomBytes(16).toString('base64');
}

const hash = (salt: string, password: string): string => {
    return crypto
        .createHash('sha256')
        .update(password + salt)
        .digest('base64');
}