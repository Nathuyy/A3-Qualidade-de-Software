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
- Gabriel Machado de Matos, 1292326181

## 🧪 Testes

# 🧪 Testes Caixa Preta:

| ID  | Módulo        | Caso de Teste                            | Justificativa                                 |
| --- | ------------- | ---------------------------------------- | --------------------------------------------- |
| T01 | Backend - API | Criar sala via `POST /rooms`             | Essencial para iniciar o fluxo do jogo        |
| T02 | Backend - WS  | Conectar usuário a uma sala (`joinRoom`) | Valida a entrada e sincronização de jogadores |
| T03 | Backend - WS  | Enviar ataque (`attack`)                 | Core da mecânica do jogo                      |
| T04 | Backend - WS  | Vitória do jogador                       | Valida condição de término do jogo            |
| T05 | Frontend Jogo | Posicionar barcos                        | Etapa crítica antes da batalha começar        |

- T01: Criar sala: não foi possível realizar os testes de caixa preta;

- T02: Conectar usuário a uma sala:
Podem ser conectados até 2 usuário:
Equivalência: 2 são válidos;
Fronteira: 1 e 3 não são válido

- T03: Enviar ataque: não foi possível realizar os testes de caixa preta;
- T04: Vitória do jogador: não foi possível realizar os testes de caixa preta, o jogodar só ganha depois de achar as 10 posições do inimigo;
- T05: Posicionar barcos: não foi possível realizar os testes de caixa preta, o jogo não inicia até as 20 posições serem preenchidas
  
  
## 🤖 Estratégia:
- Testes Automatizados
- Testes de sistema


## 🔧 Versionamento
Seguimos o modelo de sempre utilizarmos Pull Requests para main.
Então, para cada feature, foi realizada a criação de uma nova branch com nome e commit descritivo

[Pull Request realizados](https://github.com/Nathuyy/A3-Qualidade-de-Software/pulls?q=is%3Apr+is%3Aclosed)
[Commits Realizados - branch main](https://github.com/Nathuyy/A3-Qualidade-de-Software/commits/main/)

## 🚀 Execução
Passo a passo para rodar o sistema localmente e os testes.

## 🌐 GitHub Pages
[Link para a landing page do projeto](https://seuusuario.github.io/repositorio)
