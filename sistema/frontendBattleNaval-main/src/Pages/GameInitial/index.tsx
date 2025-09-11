import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Ship, 
  RotateCw, 
  Trash2, 
  CheckCircle, 
  User, 
  Hash, 
  Users, 
  Anchor,
  Target,
  Grid3x3
} from 'lucide-react';
import './game.css';

// Tipos auxiliares
interface GameLocationState {
  roomId: string;
  playerId: string;
  nameTeam: string;
}

type Orientation = 'H' | 'V';

interface ShipsRemaining {
  [key: number]: number;
}

// Função para criar um tabuleiro vazio
function createEmptyBoard(rows: number, cols: number): number[][] {
  return Array.from({ length: rows }, () => Array(cols).fill(0));
}

// Função para converter índices de matriz para coordenadas legíveis
function getCoordinates(row: number, col: number): string {
  const letter = row // A, B, C, D, E, F
  const number = col; // 1, 2, 3, 4, 5, 6
  return `{${letter},${number}]`;
}

const GamePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Tipagem segura dos dados vindos de location.state
  const { roomId, playerId, nameTeam } = (location.state || {}) as GameLocationState;

  const [selectedShip, setSelectedShip] = useState<number | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [orientation, setOrientation] = useState<Orientation>('H');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [board, setBoard] = useState<number[][]>(() => createEmptyBoard(6, 6));
  const [shipsRemaining, setShipsRemaining] = useState<ShipsRemaining>({
    1: 3,
    2: 2,
    3: 1,
  });
  const [isReady, setIsReady] = useState(false);

  // Redireciona se faltar dados essenciais
  useEffect(() => {
    if (!roomId || !playerId) {
      navigate('/');
    }
  }, [roomId, playerId, navigate]);

  // Atualiza estado de pronto
  useEffect(() => {
    const allShipsPlaced = Object.values(shipsRemaining).every((count) => count === 0);
    setIsReady(allShipsPlaced);
  }, [shipsRemaining]);

  // Clique na célula do tabuleiro
  const handleCellClick = async (row: number, col: number) => {
    // Debug: mostrar coordenadas clicadas
    console.log(`Clicou na posição: ${getCoordinates(row, col)} (matriz: [${row}, ${col}])`);
    
    if (isRemoving) {
      try {
        const response = await axios.delete(
          `https://battlenaval-c54092694ddd.herokuapp.com/api/game/${roomId}/player/${playerId}/removeShip`,
          { data: { row, col } }
        );
        const { message, board: updatedBoard, shipsRemaining: updatedShipsRemaining } = response.data;
        setBoard(updatedBoard);
        // Garantir que shipsRemaining seja atualizado corretamente
        if (updatedShipsRemaining) {
          setShipsRemaining(updatedShipsRemaining);
        }
        setSuccess(`${message} - Removido de ${getCoordinates(row, col)}`);
        setError('');
      } catch (err: any) {
        if (err.response?.data?.error) {
          setError(err.response.data.error);
        } else {
          setError('Erro ao remover o navio.');
        }
        setSuccess('');
      }
      return;
    }

    if (!selectedShip) {
      setError('Selecione um navio antes de posicioná-lo.');
      return;
    }

    try {
      const response = await axios.post(
        `https://battlenaval-c54092694ddd.herokuapp.com/api/game/${roomId}/player/${playerId}/placeShips`,
        { row, col, orientation, shipId: selectedShip }
      );
      const { message, board: updatedBoard, shipsRemaining: updatedShipsRemaining } = response.data;
      setBoard(updatedBoard);
      
      // Garantir que shipsRemaining seja atualizado corretamente
      if (updatedShipsRemaining) {
        setShipsRemaining(updatedShipsRemaining);
      } else {
        // Fallback: decrementar manualmente se a API não retornar
        setShipsRemaining(prev => ({
          ...prev,
          [selectedShip]: Math.max(0, prev[selectedShip] - 1)
        }));
      }
      
      setSuccess(`${message} - Posicionado em ${getCoordinates(row, col)}`);
      setError('');
      
      // Limpar seleção se não há mais navios deste tipo
      if (updatedShipsRemaining && updatedShipsRemaining[selectedShip] === 0) {
        setSelectedShip(null);
      } else if (!updatedShipsRemaining && shipsRemaining[selectedShip] <= 1) {
        setSelectedShip(null);
      }
      
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Erro ao posicionar o navio. Tente novamente.');
      }
      setSuccess('');
    }
  };

  // Seleção de navio
  const handleShipSelection = (shipId: number) => {
    if (shipsRemaining[shipId] > 0) {
      setSelectedShip(shipId);
      setIsRemoving(false);
      setError('');
      setSuccess('');
    }
  };

  // Alternar modo de remoção
  const handleRemoveMode = () => {
    setSelectedShip(null);
    setIsRemoving((prev) => !prev);
    setError('');
    setSuccess('');
  };

  // Alternar orientação
  const handleOrientationChange = () => {
    setOrientation((prev) => (prev === 'H' ? 'V' : 'H'));
  };

  // Jogador pronto
  const handleReady = async () => {
    try {
      await axios.post(
        `https://battlenaval-c54092694ddd.herokuapp.com/api/game/${roomId}/player/${playerId}/setPlayerReady`
      );
      navigate('/waiting', { state: { roomId, playerId, nameTeam } });
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Erro ao definir o estado de pronto.');
      }
    }
  };

  const getShipName = (shipId: string) => {
    switch (shipId) {
      case '1': return 'Submarino';
      case '2': return 'Torpedeiro';
      case '3': return 'Porta-avião';
      default: return 'Navio';
    }
  };

  const getShipIcon = (shipId: string) => {
    switch (shipId) {
      case '1': return '🚤';
      case '2': return '🛥️';
      case '3': return '🚢';
      default: return '⚓';
    }
  };

  // Calcular total de navios posicionados
  const totalShipsPlaced = 6 - Object.values(shipsRemaining).reduce((a, b) => a + b, 0);

  return (
    <div className="game-body">
      {/* Background decorativo */}
      <div className="game-background-overlay" />
      <div className="game-decoration-circle-1" />
      <div className="game-decoration-circle-2" />

      {/* Header */}
      <div className="game-header">
        <div className="game-title-container">
          <Anchor className="game-anchor-icon" />
          <h1 className="game-main-title">POSICIONAMENTO DE NAVIOS</h1>
          <Target className="game-target-icon" />
        </div>
        <p className="game-subtitle">Posicione estrategicamente sua frota naval</p>
      </div>

      {/* Player Info Card */}
      <div className="player-info-card">
        <div className="player-info-header">
          <User size={20} />
          <span>INFORMAÇÕES DO JOGADOR</span>
        </div>
        <div className="player-info-content">
          <div className="player-info-item">
            <Hash size={16} />
            <span>Sala: <strong>{roomId}</strong></span>
          </div>
          <div className="player-info-item">
            <User size={16} />
            <span>ID: <strong>{playerId}</strong></span>
          </div>
          <div className="player-info-item">
            <Users size={16} />
            <span>Equipe: <strong>{nameTeam || 'Não especificada'}</strong></span>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="game-message game-message-error">
          <span>⚠️ {error}</span>
        </div>
      )}
      {success && (
        <div className="game-message game-message-success">
          <span>✅ {success}</span>
        </div>
      )}

      {/* Main Game Container */}
      <div className="game-main-container">
        {/* Sidebar */}
        <div className="game-sidebar">
          {/* Ship Selection */}
          <div className="game-section">
            <div className="game-section-header">
              <Ship size={20} />
              <h3>SELECIONAR NAVIO</h3>
            </div>
            <div className="ship-selection-grid">
              {Object.keys(shipsRemaining).map((shipId) => (
                <button
                  key={shipId}
                  className={`ship-selection-btn ${selectedShip === parseInt(shipId) ? 'selected' : ''} ${shipsRemaining[parseInt(shipId)] === 0 ? 'disabled' : ''}`}
                  onClick={() => handleShipSelection(parseInt(shipId))}
                  disabled={shipsRemaining[parseInt(shipId)] === 0}
                >
                  <div className="ship-icon">{getShipIcon(shipId)}</div>
                  <div className="ship-info">
                    <div className="ship-name">{getShipName(shipId)}</div>
                    <div className="ship-count">Restantes: {shipsRemaining[parseInt(shipId)] || 0}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="game-section">
            <div className="game-section-header">
              <RotateCw size={20} />
              <h3>CONTROLES</h3>
            </div>
            <div className="controls-grid">
              <button 
                className={`control-btn orientation-btn ${orientation === 'H' ? 'horizontal' : 'vertical'}`}
                onClick={handleOrientationChange}
              >
                <RotateCw size={18} />
                <span>{orientation === 'H' ? 'Horizontal' : 'Vertical'}</span>
              </button>
              
              <button
                className={`control-btn remove-btn ${isRemoving ? 'active' : ''}`}
                onClick={handleRemoveMode}
              >
                <Trash2 size={18} />
                <span>Remover Navio</span>
              </button>
            </div>
          </div>

          {/* Ready Section */}
          <div className="game-section">
            <div className="ready-section">
              <div className="ready-progress">
                <div className="progress-text">
                  Navios posicionados: {totalShipsPlaced}/6
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(totalShipsPlaced / 6) * 100}%` }}
                  />
                </div>
              </div>
              
              <button
                className={`ready-btn ${isReady ? 'ready' : 'disabled'}`}
                onClick={handleReady}
                disabled={!isReady}
              >
                <CheckCircle size={20} />
                <span>{isReady ? 'PRONTO PARA BATALHA!' : 'POSICIONE TODOS OS NAVIOS'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="game-board-container">
          <div className="game-board-header">
            <Grid3x3 size={24} />
            <h3>TABULEIRO DE POSICIONAMENTO</h3>
          </div>
          
          <div className="game-board-wrapper">
            <div className="game-board">
              {board.map((rowArray, row) =>
                rowArray.map((cell, col) => (
                  <div
                    key={`${row}-${col}`}
                    className={`game-cell ${cell !== 0 ? 'occupied' : ''} ${isRemoving ? 'remove-mode' : ''}`}
                    onClick={() => handleCellClick(row, col)}
                    title={`Posição: ${getCoordinates(row, col)} (Matriz: [${row}, ${col}])`}
                  >
                    <div className="cell-content">
                      {cell !== 0 && <span className="ship-emoji">🚢</span>}
                      <div className="cell-coords">{getCoordinates(row, col)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="board-legend">
            <div className="legend-item">
              <div className="legend-color empty"></div>
              <span>Água</span>
            </div>
            <div className="legend-item">
              <div className="legend-color occupied"></div>
              <span>Navio</span>
            </div>
          </div>
        </div>
      </div>


            <div className="footer-section">
          <div className="footer-content">
            <div className="footer-line"></div>
            <span>Batalha Naval Educativa — Direitos Autorais Reservados à Turma de Estruturas Matematicas - Uniritter.</span>
            <div className="footer-line footer-line-reverse"></div>
          </div>
        </div>

          </div>
      

  );
};

export default GamePage;