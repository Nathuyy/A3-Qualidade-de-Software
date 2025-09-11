import { useState } from 'react';
// NÃO precisa importar React!



import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { Anchor, Users, Play, Plus, Info, Ship, Target, MapPin } from 'lucide-react';
import './BattleshipLobby.css';

function BattleshipLobby() {
  const [roomCodeCreate, setRoomCodeCreate] = useState('');
  const [teamNameCreate, setTeamNameCreate] = useState('');
  const [roomCodeJoin, setRoomCodeJoin] = useState('');
  const [teamNameJoin, setTeamNameJoin] = useState('');
  const [message, setMessage] = useState('');
  const [showRules, setShowRules] = useState(false);

  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    if (!roomCodeCreate || !teamNameCreate) {
      setMessage('Por favor, insira o código da sala e o nome da equipe');
      return;
    }

    try {
      const response = await axios.post('https://battlenaval-c54092694ddd.herokuapp.com/api/game/initialize', {
        roomId: roomCodeCreate,
        nameTeam: teamNameCreate,
      });

      if (response.status === 200) {
        setMessage(response.data.message);
        navigate('/game', {
          state: {
            roomId: roomCodeCreate,
            playerId: response.data.playerId,
            nameTeam: teamNameCreate,
          },
        });
      }
    } catch (error) {
      const err = error as AxiosError<any>;
      if (err.response && err.response.data && (err.response.data as any).error) {
        setMessage((err.response.data as any).error);
      } else {
        setMessage('Erro ao conectar ao servidor.');
      }
    }
  };

  const handleJoinRoom = async () => {
    if (!roomCodeJoin || !teamNameJoin) {
      setMessage('Por favor, insira o código da sala e o nome da equipe');
      return;
    }

    try {
      const response = await axios.post('https://battlenaval-c54092694ddd.herokuapp.com/api/game/joinGame', {
        roomId: roomCodeJoin,
        nameTeam: teamNameJoin,
      });

      if (response.status === 200) {
        setMessage(response.data.message);
        navigate('/game', {
          state: {
            roomId: roomCodeJoin,
            playerId: response.data.playerId,
            nameTeam: teamNameJoin,
          },
        });
      }
    } catch (error) {
      const err = error as AxiosError<any>;
      if (err.response && err.response.data && (err.response.data as any).error) {
        setMessage((err.response.data as any).error);
      } else {
        setMessage('Erro ao conectar ao servidor.');
      }
    }
  };

  return (
    <div className="battleship-container">
      {/* Elementos decorativos de fundo */}
      <div className="background-image" />
      <div className="background-overlay" />
      <div className="wave-bottom" />
      <div className="decoration-circle-1" />
      <div className="decoration-circle-2" />

      <div className="content-wrapper">
        {/* Header */}
        <div className="header-section">
          <div className="title-container">
            <Anchor className="anchor-icon" />
            <h1 className="main-title">BATALHA NAVAL</h1>
            <Anchor className="anchor-icon anchor-flipped" />
          </div>
          
          <p className="subtitle">
            Aprenda matrizes jogando o clássico jogo naval
          </p>
          
          <button 
            onClick={() => setShowRules(!showRules)}
            className="rules-toggle-btn"
          >
            <Info size={20} />
            {showRules ? 'OCULTAR REGRAS' : 'COMO JOGAR'}
          </button>
        </div>

        {/* Seção Como Jogar */}
        {showRules && (
          <div className="rules-section">
            <div className="rules-container">
              <h2 className="rules-title">
                <Ship size={24} />
                COMO JOGAR
              </h2>
              
              <div className="game-phases">
                {/* Fase 1: Posicionamento */}
                <div className="phase-card phase-setup">
                  <div className="phase-header">
                    <div className="phase-icon-container phase-icon-setup">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h3 className="phase-title">FASE 1: POSICIONAMENTO</h3>
                      <p className="phase-subtitle">Posicione estrategicamente seus navios</p>
                    </div>
                  </div>
                  
                  <div className="phase-content">
                    <ul className="phase-steps">
                      <li>🚢 <span><strong>Escolha as posições:</strong> Clique nas células da matriz para posicionar seus navios</span></li>
                      <li>📐 <span><strong>Use coordenadas:</strong> Cada posição tem coordenadas (linha, coluna) como uma matriz matemática</span></li>
                      <li>🎯 <span><strong>Planejamento:</strong> Pense estrategicamente onde colocar cada embarcação</span></li>
                      <li>✅ <span><strong>Confirme:</strong> Após posicionar todos os navios, confirme sua formação</span></li>
                    </ul>
                  </div>
                </div>

                {/* Fase 2: Batalha */}
                <div className="phase-card phase-battle">
                  <div className="phase-header">
                    <div className="phase-icon-container phase-icon-battle">
                      <Target size={24} />
                    </div>
                    <div>
                      <h3 className="phase-title">FASE 2: BATALHA</h3>
                      <p className="phase-subtitle">Ataque os navios inimigos</p>
                    </div>
                  </div>
                  
                  <div className="phase-content">
                    <ul className="phase-steps">
                      <li>🎯 <span><strong>Escolha coordenadas:</strong> Ataque as coordenadas da matriz (tabuleiro) </span></li>
                      <li>💥 <span><strong>Veja o resultado:</strong> Acerto, erro ou navio afundado</span></li>
                      <li>🧠 <span><strong>Use lógica:</strong> Analise os padrões para encontrar todos os navios</span></li>
                      <li>🏆 <span><strong>Vença:</strong> Primeiro a afundar todos os navios inimigos ganha!</span></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Dica educativa */}
              <div className="educational-tip">
                <div className="tip-icon">🎓</div>
                <div>
                  <h4 className="tip-title">DICA EDUCATIVA</h4>
                  <p className="tip-content">
                    Este jogo te ajuda a entender <strong>matrizes</strong> de forma prática! 
                    Cada posição no tabuleiro representa um elemento da matriz, 
                    identificado por suas <strong>coordenadas (linha, coluna)</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mensagem */}
        {message && (
          <div className="message-container">
            <div className="message-box">
              <p className="message-text">{message}</p>
            </div>
          </div>
        )}

        {/* Cards principais */}
        <div className="cards-grid">
          {/* Card Criar Sala */}
          <div className="card-wrapper">
            <div className="game-card card-create">
              <div className="card-header">
                <div className="card-icon icon-create">
                  <Plus size={24} />
                </div>
                <h2 className="card-title">CRIAR SALA</h2>
              </div>
              
              <div className="card-content">
                <div className="input-group">
                  <label className="input-label">Código da Sala</label>
                  <input
                    type="text"
                    placeholder="Digite o código da sala"
                    value={roomCodeCreate}
                    onChange={(e) => setRoomCodeCreate(e.target.value)}
                    className="game-input"
                  />
                </div>
                
                <div className="input-group">
                  <label className="input-label">Nome da Equipe</label>
                  <input
                    type="text"
                    placeholder="Digite o nome da sua equipe"
                    value={teamNameCreate}
                    onChange={(e) => setTeamNameCreate(e.target.value)}
                    className="game-input"
                  />
                </div>
                
                <button onClick={handleCreateRoom} className="game-button button-create">
                  <Users size={20} />
                  CRIAR SALA
                </button>
              </div>
            </div>
          </div>

          {/* Card Entrar na Sala */}
          <div className="card-wrapper">
            <div className="game-card card-join">
              <div className="card-header">
                <div className="card-icon icon-join">
                  <Play size={24} />
                </div>
                <h2 className="card-title">ENTRAR NA SALA</h2>
              </div>
              
              <div className="card-content">
                <div className="input-group">
                  <label className="input-label">Código da Sala</label>
                  <input
                    type="text"
                    placeholder="Digite o código da sala"
                    value={roomCodeJoin}
                    onChange={(e) => setRoomCodeJoin(e.target.value)}
                    className="game-input"
                  />
                </div>
                
                <div className="input-group">
                  <label className="input-label">Nome da Equipe</label>
                  <input
                    type="text"
                    placeholder="Digite o nome da sua equipe"
                    value={teamNameJoin}
                    onChange={(e) => setTeamNameJoin(e.target.value)}
                    className="game-input"
                  />
                </div>
                
                <button 
                  onClick={handleJoinRoom} 
                  className="game-button button-join"
                  disabled={!roomCodeJoin || !teamNameJoin}
                >
                  <Play size={20} />
                  ENTRAR NA SALA
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer-section">
          <div className="footer-content">
            <div className="footer-line"></div>
            <span>Batalha Naval Educativa — Direitos Autorais Reservados à Turma de Estruturas Matematicas - Uniritter.</span>
            <div className="footer-line footer-line-reverse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BattleshipLobby;