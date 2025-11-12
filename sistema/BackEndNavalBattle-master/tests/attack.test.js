const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { initializeGame, joinGame } = require('./../controllers/lobbyGame');
const { startBattle, handleAttack, getGameState } = require('../controllers/gameController');

const app = express();
app.use(bodyParser.json());
app.post('/initialize', initializeGame);
app.post('/join', joinGame);
app.post('/startBattle/:roomId', startBattle);
app.post('/attack/:roomId/:playerId', handleAttack);
app.get('/state/:roomId', getGameState);

describe('POST /attack', () => {

  beforeEach(async () => {
    await request(app)
      .post('/initialize')
      .send({ roomId: 'sala123', nameTeam: 'Equipe Alpha' });

    await request(app)
      .post('/join')
      .send({ roomId: 'sala123', nameTeam: 'Equipe Beta' });

    await request(app)
      .post('/startBattle/sala123')
      .send();
  });

  it('Deve iniciar a batalha com sucesso', async () => {
    const res = await request(app).post('/startBattle/sala123');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Batalha iniciada!');
    expect(res.body).toHaveProperty('status', 'in-progress');
  });

  it('Deve processar um ataque válido', async () => {
    const res = await request(app)
      .post('/attack/sala123/1')
      .send({ row: 0, col: 0 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Ataque processado!');
    expect(['hit', 'miss']).toContain(res.body.hitResult);
    expect(res.body).toHaveProperty('targetRow', 0);
    expect(res.body).toHaveProperty('targetCol', 0);
  });

  it('Não deve permitir atacar a mesma posição duas vezes', async () => {
    await request(app)
      .post('/attack/sala123/1')
      .send({ row: 1, col: 1 });

    const res = await request(app)
      .post('/attack/sala123/1')
      .send({ row: 1, col: 1 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Posição já atacada!');
  });

  it('Deve retornar erro se a sala não existir', async () => {
    const res = await request(app)
      .post('/attack/salaInexistente/1')
      .send({ row: 0, col: 0 });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Sala não encontrada.');
  });

  it('Deve retornar o estado atual do jogo', async () => {
    const res = await request(app).get('/state/sala123');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('players');
    expect(res.body).toHaveProperty('currentTurn');
  });

});
