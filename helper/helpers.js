const crypto = require('crypto');
const fs = require('fs/promises');

function validateEmailRegex(mail) {
  const regex = /^\w+(\[\+\.-\]?\w)*@\w+(\[\.-\]?\w+)*\.[a-z]+$/i;
  return regex.test(mail);
}

const readFile = async () => {
  const fileContent = await fs.readFile('./talker.json');
  const parseContent = JSON.parse(fileContent);
  return parseContent;
};

function generateToken() {
  const tokenId = crypto.randomBytes(8).toString('hex');
  return { token: tokenId };
}

async function validateToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token || token === '') return res.status(401).json({ message: 'Token não encontrado' });
  if (token.length !== 16) return res.status(401).json({ message: 'Token inválido' });

  next();
}

function validateEmail(req, res, next) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if (!validateEmailRegex(email)) {
    return res
      .status(400)
      .json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  next();
}

function validatePassword(req, res, next) {
  const { password } = req.body;
  if (!password) {
    return res
      .status(400)
      .json({ message: 'O campo "password" é obrigatório' });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  next();
}

const validateName = (req, res, next) => {
  const { name } = req.body;
  if (!name || name === '') {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  }
  if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  next();
};

const validateAge = (req, res, next) => {
  const { age } = req.body;
  if (!age || age === '') {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  }
  if (!Number.isInteger(age) || Number(age) < 18) {
    return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }
  next();
};

const validateTalk = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) {
    return res.status(400).json({
      message: 'O campo "talk" é obrigatório',
    });
  } return next();
};

function validateRateWatchedAt(req, res, next) {
  const { talk } = req.body;
  const regexDate = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;
  
  if (!talk.watchedAt || talk.watchedAt === '') {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  if (!regexDate.test(talk.watchedAt)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
}

const validateRate = (req, res, next) => {
  const { talk } = req.body;

  if (!talk.rate && talk.rate !== 0) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }
  if (talk.rate > 5 || talk.rate < 1) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  next();
};

module.exports = {
  validateRateWatchedAt,
  readFile,
  generateToken,
  validateToken,
  validateEmail,
  validatePassword,
  validateName,
  validateAge,
  validateTalk,
  validateRate,
};