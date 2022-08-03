const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs/promises');
const talker = require('./talker');
const { validateEmail, validatePassword, generateToken,
   validateToken, validateName, validateAge, validateTalk,
   validateRateWatchedAt, validateRate } = require('./helper/helpers');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.use('/talker', talker);

app.post('/login', validateEmail, validatePassword,
  (req, res) => res.status(200).json(generateToken()));

app.post(
  '/talker',
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateRateWatchedAt,
  validateRate,
  async (req, res) => {
    const { name, age, talk: { watchedAt, rate } } = req.body;
    const speakers = await fs.readFile('./talker.json', 'utf8');
    const speakersParse = JSON.parse(speakers);
    const newSpeaker = { 
      id: speakersParse.length + 1,
      name,
      age,
      talk: {
        watchedAt,
        rate,
      },
    };
    speakersParse.push(newSpeaker);
    await fs.writeFile('./talker.json', JSON.stringify(speakersParse));
    return res.status(201).json(newSpeaker);
  },
);

app.listen(PORT, () => {
  console.log('Online');
});