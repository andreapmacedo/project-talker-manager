const express = require('express');
const fs = require('fs/promises');
const talker = require('./talker');
const { validateEmail, validatePassword, generateToken,
   validateToken, validateName, validateAge, validateTalk,
   validateRateWatchedAt, validateRate } = require('./helper/helpers');

const speakersPath = './talker.json';

const app = express();
app.use(express.json());

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
    const speakers = await fs.readFile(speakersPath, 'utf8');
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
    await fs.writeFile(speakersPath, JSON.stringify(speakersParse));
    return res.status(201).json(newSpeaker);
  },
);

app.put(
  '/talker/:id',
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateRateWatchedAt,
  validateRate,
  async (req, res) => {
    const { id } = req.params;
    const { name, age, talk: { watchedAt, rate } } = req.body;
    const speakers = await fs.readFile(speakersPath, 'utf8');
    const speakersParse = JSON.parse(speakers);
    const filtered = speakersParse.filter((speaker) => speaker.id !== Number(id));
    const speaker = {
      id: Number(id),
      name,
      age,
      talk: {
        watchedAt,
        rate,
      },
    };
    filtered.push(speaker);
    await fs.writeFile(speakersPath, JSON.stringify(filtered));
    return res.status(200).json(speaker);
  },
);

app.delete(
  '/talker/:id',
  validateToken,
  async (req, res) => {
    const { id } = req.params;
    const speakers = await fs.readFile(speakersPath, 'utf8');
    const filtered = JSON.parse(speakers).filter((speaker) => speaker.id !== Number(id));
  await fs.writeFile(speakersPath, JSON.stringify(filtered));
  return res.status(204).json();
  },
);

app.listen(PORT, () => {
  console.log('Online');
});