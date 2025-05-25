require('dotenv').config();

const ENV = process.env.NODE_ENV || 'local';

let verifier;
if (ENV !== 'local') {
  const { CognitoJwtVerifier } = require('aws-jwt-verify');
  verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.COGNITO_USER_POOL_ID,
    tokenUse:   'access',
    clientId:   process.env.COGNITO_CLIENT_ID
  });
}

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ error: 'Token de autenticação ausente ou inválido' });
  }

  const token = authHeader.split(' ')[1];

  if (ENV !== 'local') {
    try {
      await verifier.verify(token);
    } catch (err) {
      console.error('Erro na verificação do token:', err.message);
      return res
        .status(403)
        .json({ error: 'Token inválido ou expirado' });
    }
  }

  next();
};
