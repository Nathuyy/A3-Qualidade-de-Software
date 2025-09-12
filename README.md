# Nome do Projeto

## 🎯 Sobre o Projeto  

O objetivo do jogo é **afundar todos os barcos do adversário**.  
A experiência multiplayer ocorre em tempo real, permitindo:  

1. Criar ou entrar em uma sala  
2. Escolher a posição dos barcos no tabuleiro  
3. Iniciar a batalha (atacar e aguardar o ataque do oponente)  

---

## 🚀 Tecnologias Utilizadas  

### 🔹 Backend  
- **Node.js** – Ambiente de execução  
- **Express** – Criação da API REST  
- **Socket.IO** – Comunicação em tempo real  
- **Cors** – Permitir acesso do frontend  

### 🔹 Frontend  
- **React** – Biblioteca principal para construção da interface  
- **Vite** – Ambiente de desenvolvimento rápido (ou CRA, caso tenha sido usado)  
- **React Router** – Navegação entre telas (se aplicável)  
- **Socket.IO Client / WebSockets** – Comunicação em tempo real com o servidor  
- **Tailwind CSS / CSS Modules / Styled Components** – Estilização  

---

## 📌 Funcionalidades  

### Backend  
✔️ Criar e entrar em salas de jogo  
✔️ Gerenciamento de usuários conectados em cada sala  
✔️ Emissão e escuta de eventos via Socket.IO (ataque, resposta, vitória, derrota)  
✔️ API REST para criação/listagem de salas (separado do WebSocket)  

### Frontend  
✔️ Criar uma sala ou entrar em uma já existente  
✔️ Definir a posição dos barcos no tabuleiro  
✔️ Sistema de turnos (atacar e aguardar ataque do oponente)  
✔️ Feedback visual de acertos e erros  
✔️ Indicação de vitória ou derrota ao afundar todos os barcos do adversário  

---

## 👥 Equipe
- Nathália Cericatto, 12924110993
- Luiz Filipe de Lima Ávila, 1291419212
- Miqueias Allisson Freire Galdino, 1292414297

## 🧪 Testes

# 🧪 Plano de Testes - Batalha Naval Multiplayer

| ID  | Módulo        | Caso de Teste                                                                 | Passos                                                                 | Resultado Esperado                                                      | Tipo de Teste   |
|-----|--------------|-------------------------------------------------------------------------------|----------------------------------------------------------------------|------------------------------------------------------------------------|----------------|
| T01 | Backend - API | Criar sala via `POST /rooms`                                                 | Enviar requisição com nome da sala válido                             | Sala criada com ID único e retornada no response                        | Funcional      |
| T02 | Backend - API | Listar salas via `GET /rooms`                                                | Enviar requisição GET                                                 | Retorna lista com todas as salas disponíveis                            | Funcional      |
| T03 | Backend - WS  | Conectar usuário a uma sala (`joinRoom`)                                     | Cliente envia evento com ID da sala                                   | Servidor confirma conexão e envia evento `roomUpdate`                   | Integração     |
| T04 | Backend - WS  | Desconectar usuário de uma sala (`leaveRoom`)                                | Cliente envia evento de saída                                         | Servidor remove usuário e atualiza lista de jogadores                   | Integração     |
| T05 | Backend - WS  | Enviar ataque (`attack`)                                                     | Jogador envia coordenadas (ex: A3)                                    | O servidor processa e envia evento `attackResult` ao atacante e alvo    | Funcional      |
| T06 | Backend - WS  | Vitória do jogador                                                           | Afundar todos os barcos do oponente                                   | Servidor emite evento `victory` para o vencedor e `defeat` para o perdedor | Funcional   |
| T07 | Frontend UI   | Criar sala pelo formulário                                                   | Acessar tela inicial, preencher nome da sala e clicar "Criar"         | Sala é criada e jogador redirecionado ao lobby                          | Interface/UX   |
| T08 | Frontend UI   | Entrar em sala existente                                                     | Selecionar uma sala na lista e clicar "Entrar"                        | Jogador entra no lobby da sala escolhida                                | Interface/UX   |
| T09 | Frontend Jogo | Posicionar barcos                                                            | Arrastar/soltar barcos no tabuleiro                                   | Barcos são exibidos corretamente no tabuleiro                           | Interface/Funcional |
| T10 | Frontend Jogo | Realizar ataque no tabuleiro                                                 | Jogador clica em uma célula inimiga                                   | Feedback visual (acerto = vermelho, erro = azul)                        | Funcional/UX   |
| T11 | Frontend Jogo | Verificar turnos                                                             | Jogador realiza ataque e espera adversário                            | Sistema bloqueia jogadas fora do turno                                  | Funcional      |
| T12 | Frontend Jogo | Exibir resultado final                                                       | Ao receber `victory` ou `defeat` do servidor                          | Tela exibe mensagem de vitória ou derrota                               | Funcional/UX   |
| T13 | Performance   | Testar múltiplas salas e usuários simultâneos                                | Criar 10 salas com 2 jogadores cada                                   | Servidor mantém estabilidade sem queda de conexões                      | Desempenho     |
| T14 | Robustez      | Desconexão inesperada de jogador                                             | Jogador fecha navegador durante partida                               | Servidor remove jogador e atualiza estado da sala                       | Confiabilidade |
| T15 | Segurança     | Tentativa de ataque fora da sala                                             | Cliente envia `attack` sem estar em sala                              | Servidor ignora requisição e retorna erro                               | Segurança      |

## 🤖 Testes Automatizados
- Ferramentas utilizadas
- Como rodar os testes

## 📊 Métricas e Estimativas
- Métricas aplicadas (ex: cobertura, defeitos, complexidade)
- Estimativas de esforço

## 🔍 Revisão Técnica
- Técnicas usadas (pareamento, SonarQube, Lint)
- Resultados encontrados

## 🔧 Versionamento
Seguimos o modelo de sempre utilizarmos Pull Requests para main.
Então, para cada feature, foi realizada a criação de uma nova branch com nome e commit descritivo

[Pull Request realizados](https://github.com/Nathuyy/A3-Qualidade-de-Software/pulls?q=is%3Apr+is%3Aclosed)
[Commits Realizados - branch main](https://github.com/Nathuyy/A3-Qualidade-de-Software/commits/main/)

## 🚀 Execução
Passo a passo para rodar o sistema localmente e os testes.

## 🌐 GitHub Pages
[Link para a landing page do projeto](https://seuusuario.github.io/repositorio)
