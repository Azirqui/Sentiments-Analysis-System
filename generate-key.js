const crypto = require('crypto');

// Generate 32-byte (256-bit) key and 16-byte IV
const key = crypto.randomBytes(32).toString('hex');
const iv = crypto.randomBytes(16).toString('hex');

console.log('AES_SECRET_KEY=', key);
console.log('AES_IV=', iv);
