import crypto from 'crypto';

export class PendingUsers {
    constructor() {
        this.users = new Map();
        this.expireTime = 10 * 60 * 1000;
        
        setInterval(() => {
            const now = Date.now();
            
            for (const [tempToken, userData] of this.users) {
                if (now - userData.timestamp > this.expireTime) {
                    this.users.delete(tempToken);
                }
            }
        }, 5 * 60 * 1000);
    }

    add(userData) {
        const tempToken = crypto.randomBytes(32).toString('hex');
        
        this.users.set(tempToken, {
            username: userData.username,
            email: userData.email,
            hashedPassword: userData.hashedPassword,
            salt: userData.salt,
            qrSecret: userData.qrSecret,
            timestamp: Date.now()
        });
        
        return tempToken;
    }

    get(tempToken) {
        this.cleanExpired();
        return this.users.get(tempToken);
    }

    remove(tempToken) {
        return this.users.delete(tempToken);
    }

    cleanExpired() {
        const now = Date.now();
        
        for (const [tempToken, userData] of this.users) {
            if (now - userData.timestamp > this.expireTime) {
                this.users.delete(tempToken);
            }
        }
    }

    clear() {
        this.users.clear();
    }
}

export const pendingUsers = new PendingUsers();