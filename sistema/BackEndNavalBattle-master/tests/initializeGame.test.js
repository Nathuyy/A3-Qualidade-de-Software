const request = require('supertest');
const express = require('express');
const { initializeGame } = require('./../controllers/lobbyGame');
const bodyParser = require('body-parser');

// Cria um app express apenas para teste
const app = express();
app.use(bodyParser.json());
app.post('/initialize', initializeGame);

describe('POST /initialize', () => {
  it('Deve criar uma sala com sucesso', async () => {
    const response = await request(app)
      .post('/initialize')
      .send({ roomId: '12', nameTeam: 'Equipe Alpha' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Sala criada com sucesso.');
    expect(response.body).toHaveProperty('playerId', 1);
    expect(response.body).toHaveProperty('Jogador:', 'Equipe Alpha');
  });

  it('Deve retornar erro se faltar o roomId', async () => {
    const response = await request(app)
      .post('/initialize')
      .send({ nameTeam: 'Equipe Sem Sala' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Room ID é obrigatório.');
  });

  it('Deve retornar erro se faltar o nameTeam', async () => {
    const response = await request(app)
      .post('/initialize')
      .send({ roomId: 'salaErro' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Digite um nome para sua Equipe.');
  });
});
