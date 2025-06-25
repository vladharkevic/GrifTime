const express = require('express');
const bodyParser = require('body-parser');
const { Rcon } = require('rcon-client');

const app = express();
app.use(bodyParser.json());

// Твої дані для RCON
const RCON_HOST = '107.161.154.161';
const RCON_PORT = 25605;
const RCON_PASSWORD = 'F83VICD8Xa';

app.post('/api/give', async (req, res) => {
  const { nick, product, type, quantity } = req.body;

  try {
    const rcon = await Rcon.connect({
      host: RCON_HOST,
      port: RCON_PORT,
      password: RCON_PASSWORD
    });

    let command = '';

    if (type === 'donate') {
      // Видаємо 1 діамант за донат
      command = `give ${nick} diamond 1`;
    } else if (type === 'case') {
      // Видаємо кейс як ендер сундук з кастомним ім'ям
      command = `give ${nick} minecraft:ender_chest ${quantity} 0 {display:{Name:'{"text":"${product}"}'}}`;
    } else {
      throw new Error('Невідомий тип товару');
    }

    const response = await rcon.send(command);
    await rcon.end();

    console.log('✅ Команда виконана:', command);
    res.send({ status: 'done', command, response });
  } catch (err) {
    console.error('❌ Помилка при відправці команди:', err);
    res.status(500).send({ status: 'error', message: err.message });
  }
});

app.listen(3000, () => {
  console.log('🟢 RCON сервер запущено на порту 3000');
});
