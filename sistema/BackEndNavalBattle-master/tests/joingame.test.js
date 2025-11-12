const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { initializeGame, joinGame } = require('./../controllers/lobbyGame');

// Monta app Express para testes
const app = express();
app.use(bodyParser.json());
app.post('/initialize', initializeGame);
app.post('/join', joinGame);

describe('POST /join', () => {
  beforeEach(async () => {
    // Cria uma sala antes de cada teste que precisa dela
    await request(app)
      .post('/initialize')
      .send({ roomId: 'sala123', nameTeam: 'Equipe Alpha' });
  });

  it('Deve permitir que o jogador 2 entre na sala', async () => {
    const response = await request(app)
      .post('/join')
      .send({ roomId: 'sala123', nameTeam: 'Equipe Beta' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Jogador 2 entrou na sala.');
    expect(response.body).toHaveProperty('playerId', 2);
    expect(response.body).toHaveProperty('Jogador:', 'Equipe Beta');
  });

  it('Deve retornar erro se faltar o roomId', async () => {
    const response = await request(app)
      .post('/join')
      .send({ nameTeam: 'Equipe Beta' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Room ID é obrigatório.');
  });

  it('Deve retornar erro se faltar o nameTeam', async () => {
    const response = await request(app)
      .post('/join')
      .send({ roomId: 'sala123' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Digite um nome para sua Equipe.');
  });

  it('Deve retornar erro se a sala não existir', async () => {
    const response = await request(app)
      .post('/join')
      .send({ roomId: 'salaInexistente', nameTeam: 'Equipe Zeta' });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Sala não encontrada.');
  });

  it('Deve retornar erro se a sala já estiver cheia', async () => {
    // Primeiro jogador 2 entra com sucesso
    await request(app)
      .post('/join')
      .send({ roomId: 'sala123', nameTeam: 'Equipe Beta' });

    // Tentativa de um terceiro jogador
    const response = await request(app)
      .post('/join')
      .send({ roomId: 'sala123', nameTeam: 'Equipe Gama' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Sala já está cheia.');
  });
});
