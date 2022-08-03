const express = require('express');

const talker = express.Router();

const { readFile } = require('./helper/helpers');

talker.get('/', async (_req, res) => {
  try {
    const talkers = await readFile();
    return res.status(200).json(talkers); // retorna todos os palestrantes
  } catch (err) {
    return res.status(200).json([]); // não remova esse return
  }
});

talker.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const talkers = await readFile();
    const users = talkers.find((user) => user.id === +(id));
    if (!users) {
      return res.status(404).json({ message: 'Pessoa palestrante não encontrada' }); 
    }
    return res.status(200).json(users);
  } catch (err) {
   console.log(err);
  }
});

module.exports = talker;