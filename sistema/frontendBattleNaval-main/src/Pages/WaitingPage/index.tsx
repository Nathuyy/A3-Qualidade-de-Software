import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Clock, 
  Users, 
  Wifi, 
  WifiOff, 
  CheckCircle, 
  User, 
  Hash, 
  Shield,
  Anchor,
  Target,
  Loader2
} from 'lucide-react';
import './waiting.css';

// Tipagem para os dados recebidos via location.state
interface WaitingPageState {
  roomId: string;
  playerId: string;
  nameTeam: string;
}

interface GameState {
  status: string;
  players: Array<{
    id: string;
    name: string;
    ready: boolean;
  }>;
  readyCount: number;
  totalPlayers: number;
}

const WaitingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Faz a tipagem segura dos dados vindos de location.state
  const { roomId, playerId, nameTeam } = (location.state || {}) as WaitingPageState;

  const [waitingMessage, setWaitingMessage] = useState('Aguardando os outros jogadores ficarem prontos...');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [dots, setDots] = useState('');

  // Efeito para animação dos pontos
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!roomId || !playerId || !nameTeam) {
      navigate('/');
      return;
    }

    const checkGameStatus = async () => {
      try {
        const response = await axios.get(`https://battlenaval-c54092694ddd.herokuapp.com/api/game/${roomId}/state`);
        const gameStateData = response.data;
        
        setGameState(gameStateData);
        setIsConnected(true);

        if (gameStateData.status === 'in-progress' || gameStateData.status === 'ready') {
          setWaitingMessage('Todos os jogadores estão prontos!');
          setCountdown(3);
          
          // Countdown antes de navegar
          const countdownInterval = setInterval(() => {
            setCountdown(prev => {
              if (prev === null || prev <= 1) {
                clearInterval(countdownInterval);
                navigate('/gameBattle', { state: { roomId, playerId, nameTeam } });
                return null;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          const readyCount = gameStateData.readyCount || 1;
          const totalPlayers = gameStateData.totalPlayers || 2;
          setWaitingMessage(`Aguardando jogadores (${readyCount}/${totalPlayers} prontos)`);
          setCountdown(null);
        }
      } catch (error) {
        setIsConnected(false);
        setWaitingMessage('Erro ao conectar ao servidor. Tentando novamente...');
        console.error('Erro ao verificar status do jogo:', error);
      }
    };

    // Primeira verificação imediata
    checkGameStatus();

    // Verificações periódicas
    const intervalId = setInterval(checkGameStatus, 3000);

    return () => clearInterval(intervalId);
  }, [roomId, playerId, nameTeam, navigate]);

  const getStatusIcon = () => {
    if (countdown !== null) {
      return <CheckCircle className="status-icon ready" />;
    }
    if (!isConnected) {
      return <WifiOff className="status-icon error" />;
    }
    return <Loader2 className="status-icon loading" />;
  };

  const getProgressPercentage = () => {
    if (!gameState) return 0;
    const ready = gameState.readyCount || 1;
    const total = gameState.totalPlayers || 2;
    return Math.round((ready / total) * 100);
  };

  return (
    <div className="waiting-body">
      {/* Background decorativo */}
      <div className="waiting-background-overlay"></div>
      <div className="waiting-decoration-circle-1"></div>
      <div className="waiting-decoration-circle-2"></div>

      {/* Header */}
      <div className="waiting-header">
        <div className="waiting-title-container">
          <Anchor className="waiting-anchor-icon" />
          <h1 className="waiting-main-title">Batalha Naval</h1>
          <Target className="waiting-target-icon" />
        </div>
        <p className="waiting-subtitle">Preparando para o combate</p>
      </div>

      {/* Player Info Card */}
      <div className="player-info-card">
        <div className="player-info-header">
          <User className="player-icon" />
          <span>Informações do Jogador</span>
        </div>
        <div className="player-info-content">
          <div className="player-info-item">
            <Hash className="info-icon" />
            <span>Sala: {roomId}</span>
          </div>
          <div className="player-info-item">
            <User className="info-icon" />
            <span>ID: {playerId}</span>
          </div>
          <div className="player-info-item">
            <Shield className="info-icon" />
            <span>Equipe: {nameTeam || 'Não especificada'}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="waiting-main-container">
        {/* Status Section */}
        <div className="waiting-status-section">
          <div className="status-header">
            {getStatusIcon()}
            <h2 className="status-title">
              {countdown !== null ? 'Iniciando Jogo!' : 'Status da Sala'}
            </h2>
          </div>

          {countdown !== null ? (
            <div className="countdown-container">
              <div className="countdown-number">{countdown}</div>
              <p className="countdown-text">Redirecionando para o jogo...</p>
            </div>
          ) : (
            <>
              <div className="status-message">
                <h3>{waitingMessage}{dots}</h3>
                <p>Por favor, aguarde enquanto os outros jogadores se preparam.</p>
              </div>

              {/* Progress Bar */}
              {gameState && (
                <div className="progress-section">
                  <div className="progress-header">
                    <span>Progresso da Sala</span>
                    <span>{getProgressPercentage()}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                  <div className="progress-details">
                    <span>{gameState.readyCount || 1} de {gameState.totalPlayers || 2} jogadores prontos</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Connection Status */}
        <div className="connection-status">
          <div className="connection-indicator">
            {isConnected ? (
              <>
                <Wifi className="connection-icon connected" />
                <span className="connection-text">Conectado ao servidor</span>
              </>
            ) : (
              <>
                <WifiOff className="connection-icon disconnected" />
                <span className="connection-text">Reconectando...</span>
              </>
            )}
          </div>
        </div>

        {/* Players List (if available) */}
        {gameState?.players && gameState.players.length > 0 && (
          <div className="players-section">
            <div className="players-header">
              <Users className="players-icon" />
              <h3>Jogadores na Sala</h3>
            </div>
            <div className="players-list">
              {gameState.players.map((player, index) => (
                <div key={player.id} className={`player-item ${player.ready ? 'ready' : 'waiting'}`}>
                  <div className="player-info">
                    <User className="player-avatar" />
                    <span className="player-name">
                      {player.id === playerId ? 'Você' : `Jogador ${index + 1}`}
                    </span>
                  </div>
                  <div className={`player-status ${player.ready ? 'ready' : 'waiting'}`}>
                    {player.ready ? (
                      <>
                        <CheckCircle className="status-check" />
                        <span>Pronto</span>
                      </>
                    ) : (
                      <>
                        <Clock className="status-clock" />
                        <span>Preparando...</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="waiting-footer">
        <p>Aguarde enquanto todos os jogadores finalizam seus preparativos</p>
      </div>
    </div>
  );
};

export default WaitingPage;