const crypto = require('crypto');

const encode = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
const decode = (str) => JSON.parse(Buffer.from(str, 'base64url').toString('utf8'));

const signToken = (payload) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
  const body = { ...payload, exp };
  const encodedHeader = encode(header);
  const encodedBody = encode(body);
  const unsigned = `${encodedHeader}.${encodedBody}`;
  const signature = crypto
    .createHmac('sha256', process.env.JWT_SECRET)
    .update(unsigned)
    .digest('base64url');
  return `${unsigned}.${signature}`;
};

const verifyToken = (token) => {
  const [header, payload, signature] = token.split('.');
  if (!header || !payload || !signature) throw new Error('Malformed token');

  const unsigned = `${header}.${payload}`;
  const expected = crypto
    .createHmac('sha256', process.env.JWT_SECRET)
    .update(unsigned)
    .digest('base64url');

  if (expected !== signature) throw new Error('Invalid signature');

  const decoded = decode(payload);
  if (decoded.exp < Math.floor(Date.now() / 1000)) throw new Error('Token expired');
  return decoded;
};

module.exports = { signToken, verifyToken };
