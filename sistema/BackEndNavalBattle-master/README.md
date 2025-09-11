⚓ Batalha Naval - Backend

Este é o backend do jogo Batalha Naval Multiplayer, responsável por gerenciar salas, comunicação em tempo real e lógica da partida.

O servidor foi desenvolvido utilizando Node.js, Express e Socket.IO, oferecendo rotas de API para gerenciamento e WebSockets para troca de mensagens entre jogadores.

🚀 Tecnologias Utilizadas

Node.js
 – Ambiente de execução

Express
 – Criação da API REST

Socket.IO
 – Comunicação em tempo real

Cors
 – Permitir acesso do frontend


📌 Funcionalidades

✔️ Criar e entrar em salas de jogo
✔️ Gerenciamento de usuários conectados em cada sala
✔️ Emissão e escuta de eventos via Socket.IO (ataque, resposta, vitória, derrota)
✔️ API REST para criação/listagem de salas (separado do WebSocket)
