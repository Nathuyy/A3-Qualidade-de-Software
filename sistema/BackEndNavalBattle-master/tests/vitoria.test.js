const { createBoard, placeShipOnBoard } = require('../game/board');
const { games } = require('../controllers/initialGameController');
const { startBattle, handleAttack } = require('../controllers/gameController');

describe('Simulação de batalha completa', () => {
  beforeEach(() => {
    // Cria a sala e jogadores
    games['salaSimulada'] = {
      players: {
        1: { id: 1, namePlayer: 'Equipe Alpha', board: createBoard(), hits: [] },
        2: { id: 2, namePlayer: 'Equipe Beta', board: createBoard(), hits: [] },
      },
      currentTurn: null,
      status: 'waiting',
      winner: null
    };

    // Posiciona navios
    placeShipOnBoard(games['salaSimulada'].players[2].board, 0, 0, 2, 'H'); // jogador 2
    placeShipOnBoard(games['salaSimulada'].players[2].board, 2, 2, 1, 'V'); // jogador 2
    placeShipOnBoard(games['salaSimulada'].players[1].board, 1, 1, 2, 'V'); // jogador 1
    placeShipOnBoard(games['salaSimulada'].players[1].board, 3, 3, 1, 'H'); // jogador 1

    // Inicia batalha
    startBattle({ params: { roomId: 'salaSimulada' } }, { status: () => ({ json: () => {} }) });
  });

  it('Jogador 1 deve vencer após atingir todos os navios do jogador 2', () => {
    // Função auxiliar para atacar
    const attack = (playerId, row, col) => {
      let result;
      handleAttack(
        { params: { roomId: 'salaSimulada', playerId }, body: { row, col } },
        {
          status: () => ({
            json: (obj) => { result = obj; }
          })
        }
      );
      return result;
    };

    // Ataques de jogador 1 contra jogador 2
    attack(1, 0, 0);
    attack(1, 0, 1);
    const finalAttack = attack(1, 2, 2); // último navio

    // Verifica se o vencedor é o jogador 1
    expect(finalAttack.gameOver).toBe(true);
    expect(finalAttack.winner).toBe('Equipe Alpha');
    expect(games['salaSimulada'].status).toBe('finished');
  });
});
