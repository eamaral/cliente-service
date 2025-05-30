const AWS = require('aws-sdk');
require('dotenv').config();
const ClienteRepository = require('../../domain/repositories/ClienteRepository');

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: process.env.AWS_REGION || 'us-east-1',
});
const {
  COGNITO_CLIENT_ID,
  COGNITO_USER_POOL_ID
} = process.env;

// ======== REGISTER =========
exports.register = async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }
  try {
    await cognito.adminCreateUser({
      UserPoolId: COGNITO_USER_POOL_ID,
      Username: email,
      TemporaryPassword: senha,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'email_verified', Value: 'true' },
      ],
      MessageAction: 'SUPPRESS',
    }).promise();
    return res.status(201).json({
      message: 'Usuário criado com sucesso. Use /api/auth/confirmar-senha para ativar.',
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return res.status(500).json({
      error:    'Erro ao criar usuário',
      detalhes: error.message
    });
  }
};

// ======== CONFIRMAR SENHA =========
exports.confirmarSenha = async (req, res) => {
  const { email, senhaTemporaria, novaSenha } = req.body;
  if (!email || !senhaTemporaria || !novaSenha) {
    return res.status(400).json({
      error: 'Email, senha temporária e nova senha são obrigatórios'
    });
  }
  try {
    const authResult = await cognito.initiateAuth({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: senhaTemporaria
      },
    }).promise();

    if (authResult.ChallengeName !== 'NEW_PASSWORD_REQUIRED') {
      return res.status(400).json({
        error: 'Desafio inesperado. Nenhuma atualização feita.'
      });
    }

    const finalResponse = await cognito.respondToAuthChallenge({
      ClientId: COGNITO_CLIENT_ID,
      ChallengeName: 'NEW_PASSWORD_REQUIRED',
      Session: authResult.Session,
      ChallengeResponses: {
        USERNAME:     email,
        NEW_PASSWORD: novaSenha
      },
    }).promise();

    return res.status(200).json({
      message: 'Senha atualizada com sucesso!',
      tokens:  finalResponse.AuthenticationResult
    });
  } catch (error) {
    console.error('Erro ao confirmar senha:', error);
    return res.status(500).json({
      error:    'Erro ao confirmar senha',
      detalhes: error.message
    });
  }
};

// ======== LOGIN via email/senha =========
exports.login = async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }
  try {
    const response = await cognito.initiateAuth({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: senha
      },
    }).promise();

    const { AccessToken, IdToken, RefreshToken } = response.AuthenticationResult;
    return res.status(200).json({
      accessToken:  AccessToken,
      idToken:      IdToken,
      refreshToken: RefreshToken
    });
  } catch (error) {
    console.error('Erro ao autenticar via email:', error);
    return res.status(401).json({ error: 'Email ou senha inválidos' });
  }
};

// ======== LOGIN via CPF =========
exports.loginViaCpf = async (req, res) => {
  const { cpf, senha } = req.body;
  if (!cpf || !senha) {
    return res.status(400).json({ error: 'CPF e senha são obrigatórios' });
  }

  try {
    const repo    = new ClienteRepository();

    const cliente = await repo.findById(cpf);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado para o CPF informado' });
    }

    const response = await cognito.initiateAuth({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: cliente.email,
        PASSWORD: senha
      },
    }).promise();

    const { AccessToken, IdToken, RefreshToken } = response.AuthenticationResult;
    return res.status(200).json({
      accessToken:  AccessToken,
      idToken:      IdToken,
      refreshToken: RefreshToken
    });

  } catch (error) {
    console.error('Erro no login via CPF:', error);

    if (error.code === 'NotAuthorizedException' || error.code === 'UserNotFoundException') {
      return res.status(401).json({ error: 'CPF ou senha inválidos' });
    }
    return res.status(500).json({ error: 'Erro ao autenticar via CPF' });
  }
};
