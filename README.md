# A3_US_DES_MOB

Jogo da Memória educativo sobre animais ameaçados de extinção, desenvolvido em React e Bootstrap para o projeto acadêmico de Usabilidade (ODS 15 – Vida Terrestre).

## Funcionalidades

- Grade 4×4 com 8 pares de animais, embaralhados a cada partida
- Animação de flip 3D nas cartas (CSS `rotateY`)
- Contador de jogadas e cronômetro em tempo real
- Curiosidades educativas carregadas via requisição HTTP (Wikipedia)
- Leaderboard da sessão persistido no `localStorage` (ranking por menor nº de jogadas)
- Interface responsiva — 3 colunas no desktop, empilhado no mobile
- Tela de setup com validação e instruções

## Heurísticas de Nielsen aplicadas

| # | Heurística | Como se aplica |
|---|-----------|---------------|
| 1 | **Visibilidade do status** | Stats-bar com jogadas, tempo, pares encontrados e barra de progresso atualizados em tempo real |
| 2 | **Controle e liberdade** | Botões "Reiniciar" e "Trocar jogador" disponíveis a qualquer momento |
| 3 | **Prevenção de erros** | Cliques bloqueados durante animação de flip; cartas já encontradas não são clicáveis |
| 4 | **Reconhecimento em vez de memorização** | Pares encontrados ficam permanentemente visíveis; emoji + nome exibidos ao virar |
| 5 | **Estética e design minimalista** | Layout de 3 colunas foca no tabuleiro; informações secundárias nos painéis laterais |

## Tecnologias

- React 19 + Vite
- Bootstrap 5
- ESLint

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run build
```
