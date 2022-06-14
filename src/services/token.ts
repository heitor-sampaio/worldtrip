import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET

export function generateJwtToken(email: string, payload: object = {}) {
  const token = jwt.sign(payload, secret, {
    subject: email,
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  });

  return token
}
