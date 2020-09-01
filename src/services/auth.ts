import crypto from "crypto";
import {fetchMemberByEmail, Member} from "../database/members";

interface HashResult {
    salt: string;
    hashedPassword: string;
}

export const hashPassword = (password: string): HashResult => {
    const salt = generateSalt();
    const hashedPassword = hash(salt, password);
    
    return { salt, hashedPassword }
}

export const tryLoginMember = async(email: string, password: string): Promise<Member | null> => {
    const member = await fetchMemberByEmail(email);
    
    if (!member) {
        return null;
    }

    if (passwordsMatch(member.salt, password, member.hashed_password)) {
        return member;
    }
    return null;
}

const passwordsMatch = (salt: string, password: string, hashedValue: string): Boolean => {
    const hashedAttempt = hash(salt, password);
    return hashedAttempt === hashedValue;
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