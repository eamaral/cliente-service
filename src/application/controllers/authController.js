const AWS = require('aws-sdk');
const ClienteRepository = require('../../domain/repositories/ClienteRepository');
require('dotenv').config();

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: process.env.AWS_REGION || 'us-east-1',
});
const { COGNITO_CLIENT_ID, COGNITO_USER_POOL_ID } = process.env;

exports.login = async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  try {
    const r = await cognito.initiateAuth({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: COGNITO_CLIENT_ID,
      AuthParameters: { USERNAME: email, PASSWORD: senha },
    }).promise();
    const { AccessToken, IdToken, RefreshToken } = r.AuthenticationResult;
    return res.status(200).json({ accessToken: AccessToken, idToken: IdToken, refreshToken: RefreshToken });
  } catch {
    return res.status(401).json({ error: 'Email ou senha inválidos' });
  }
};

exports.register = async (req, res) => { /* permanece igual */ };
exports.confirmarSenha = async (req, res) => { /* permanece igual */ };

exports.loginViaCpf = async (req, res) => {
  const { cpf, senha } = req.body;
  if (!cpf || !senha) return res.status(400).json({ error: 'CPF e senha são obrigatórios' });
  try {
    const repo = new ClienteRepository();
    const cli = await repo.findByCPF(cpf);
    if (!cli) return res.status(404).json({ error: 'Cliente não encontrado' });
    req.body = { email: cli.email, senha };
    return exports.login(req, res);
  } catch {
    return res.status(500).json({ error: 'Erro ao autenticar via CPF' });
  }
};
