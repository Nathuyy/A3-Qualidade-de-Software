import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './games.css';

interface BattlePageState {
  roomId: string;
  playerId: string;
  nameTeam: string;
}

interface PlayerData {
  board: any[][];
  hits?: { row: number; col: number; status: string }[];
  namePlayer?: string;
}

interface GameState {
  currentTurn: string | number;
  players: { [key: string]: PlayerData };
  winner: string | null;
}

const BOARD_SIZE = 6;

const BattlePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId, playerId } = (location.state || {}) as BattlePageState;

  const [gameState, setGameState] = useState<GameState>({
    currentTurn: '',
    players: {},
    winner: null,
  });
  const [isMyTurn, setIsMyTurn] = useState(false);

  useEffect(() => {
    if (!roomId || !playerId) {
      navigate('/');
      return;
    }

    const startBattle = async () => {
      try {
        await axios.post(
          `https://battlenaval-c54092694ddd.herokuapp.com/api/game/${roomId}/startBattle`
        );
        await fetchGameState();
      } catch (error) {
        // Trate erros conforme necessário
      }
    };

    const fetchGameState = async () => {
      try {
        const response = await axios.get(
          `https://battlenaval-c54092694ddd.herokuapp.com/api/game/${roomId}/state`
        );
        const newGameState: GameState = {
          currentTurn: response.data.currentTurn || '',
          players: response.data.players || {},
          winner: response.data.winner || null,
        };

        const myPlayerIdStr = String(playerId);
        const currentTurnStr = String(newGameState.currentTurn);
        setGameState(newGameState);
        setIsMyTurn(myPlayerIdStr === currentTurnStr);
      } catch (error) {
        // Trate erros conforme necessário
      }
    };

    startBattle();
    const interval = setInterval(fetchGameState, 2000);
    return () => clearInterval(interval);
  }, [roomId, playerId, navigate]);

  // Função de ataque
  const handleAttack = async (row: number, col: number) => {
    if (!isMyTurn) {
      alert('Não é sua vez!');
      return;
    }

    try {
      const response = await axios.post(
        `https://battlenaval-c54092694ddd.herokuapp.com/api/game/${roomId}/player/${playerId}/attack`,
        { row, col },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const newGameState: GameState = {
        currentTurn: response.data.currentTurn,
        players: response.data.players,
        winner: response.data.winner,
      };

      const myPlayerIdStr = String(playerId);
      const currentTurnStr = String(newGameState.currentTurn);
      setGameState(newGameState);
      setIsMyTurn(myPlayerIdStr === currentTurnStr);

      if (response.data.hitResult === 'hit') {
        alert('🎯 Acertou!');
      } else if (response.data.hitResult === 'miss') {
        alert('💧 Água!');
      }

      if (response.data.winner) {
        alert(`🏆 O vencedor é: ${response.data.winner}`);
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (error: any) {
      if (error.response?.data?.error) {
        alert(`❌ ${error.response.data.error}`);
      } else {
        alert('❌ Erro ao processar ataque');
      }
    }
  };

  // Renderiza tabuleiro com coordenadas
  const renderBoardWithCoordinates = (playerData: PlayerData, isOpponent = false) => {
    if (!playerData?.board || playerData.board.length === 0) {
      return <p>Tabuleiro vazio ou não carregado</p>;
    }

    const { board, hits = [] } = playerData;

    return (
      <table style={{
        borderCollapse: 'collapse',
        margin: '0 auto',
        background: 'rgba(20,40,60,0.65)',
        borderRadius: 16,
        boxShadow: '0 2px 12px #0004'
      }}>
        <thead>
          <tr>
            <th style={{ width: 32, height: 32 }}></th>
            {Array.from({ length: BOARD_SIZE }).map((_, col) => (
              <th
                key={col}
                style={{
                  padding: 6,
                  color: '#0ff',
                  fontWeight: 700,
                  fontSize: 17,
                  background: 'rgba(0,0,0,0.12)',
                  borderBottom: '2px solid #0369a1'
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: BOARD_SIZE }).map((_, row) => (
            <tr key={row}>
              <th
                style={{
                  padding: 6,
                  color: '#0ff',
                  fontWeight: 700,
                  fontSize: 17,
                  background: 'rgba(0,0,0,0.12)',
                  borderRight: '2px solid #0369a1'
                }}
              >
                {row}
              </th>
              {Array.from({ length: BOARD_SIZE }).map((_, col) => {
                const hit = hits.find((h) => h.row === row && h.col === col);
                const isHit = hit?.status === 'hit';
                const isMiss = hit?.status === 'miss';
                const hasShip = board[row][col] === 'ship' || board[row][col] === 1;
                const isClickable = isOpponent && isMyTurn && !hit;

                return (
                  <td
                    key={col}
                    style={{
                      width: 48,
                      height: 48,
                      textAlign: 'center',
                      border: '1px solid #1e293b',
                      background: isHit
                        ? '#ef4444'
                        : isMiss
                        ? '#3b82f6'
                        : !isOpponent && hasShip
                        ? '#22d3ee'
                        : isClickable
                        ? '#0ea5e9'
                        : '#0d3c5a',
                      color: '#fff',
                      cursor: isClickable ? 'pointer' : 'default',
                      fontSize: 22,
                      borderRadius: 8,
                      transition: 'background 0.15s',
                      boxShadow: isClickable ? '0 0 0 2px #0ff5' : undefined,
                    }}
                    onClick={isClickable ? () => handleAttack(row, col) : undefined}
                  >
                    {isHit
                      ? '💥'
                      : isMiss
                      ? '❌'
                      : !isOpponent && hasShip
                      ? '🚢'
                      : ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Identifica jogadores
  const playerKeys = Object.keys(gameState.players);
  const currentPlayerData = gameState.players[playerId];
  const opponentKey = playerKeys.find((key) => String(key) !== String(playerId));
  const opponentData = gameState.players[opponentKey || ''];

  // Tela de vitória
  if (gameState.winner) {
    return (
      <div className="battle-page-body">
        <div className="battle-bg-decor-1"></div>
        <div className="battle-bg-decor-2"></div>
        <h1 className="battle-page-title">Batalha Naval</h1>
        <h2 className="battle-page-winner-message">
          🏆 O vencedor é: {gameState.winner}
        </h2>
        <button onClick={() => navigate('/')}>Voltar ao Lobby</button>
        <div className="battle-page-footer">
          <p>Aguarde até que a partida seja decidida e boa sorte na batalha!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="battle-page-body">
      {/* Círculos decorativos de fundo */}
      <div className="battle-bg-decor-1"></div>
      <div className="battle-bg-decor-2"></div>

      <h1 className="battle-page-title">⚓ Batalha Naval</h1>
      <h2
        className="battle-page-turn-indicator"
        style={{
          color: isMyTurn ? '#4CAF50' : '#FF9800',
        }}
      >
        {isMyTurn ? '🎯 SUA VEZ - Clique na célula para atacar!' : '⏳ Aguarde sua vez...'}
      </h2>

      <div className="battle-page-container" style={{ display: 'flex', gap: 32, justifyContent: 'center' }}>
        {/* Seu Tabuleiro */}
        <div className="battle-page-board">
          <h2 className="battle-page-board-title">
            🛡️ Seu Tabuleiro ({currentPlayerData?.namePlayer || playerId})
          </h2>
          {renderBoardWithCoordinates(currentPlayerData, false)}
        </div>

        {/* Tabuleiro do Oponente */}
        <div className="battle-page-board">
          <h2 className="battle-page-board-title">
            🎯 Tabuleiro do Oponente ({opponentData?.namePlayer || opponentKey || 'Oponente'})
          </h2>
          {renderBoardWithCoordinates(opponentData, true)}
        </div>
      </div>

      {/* Footer padronizado */}
      <div className="battle-page-footer">
        <p>Aguarde até que a partida seja decidida e boa sorte na batalha!</p>
      </div>
    </div>
  );
};

export default BattlePage;