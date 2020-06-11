var crypto = require('crypto');

export function hashPassword(password: string): string{
    return crypto.createHash('md5')
        .update(password)
        .digest('hex');
}