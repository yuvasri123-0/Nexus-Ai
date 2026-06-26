const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Adjust if your client runs on a different port/domain
    methods: ["GET", "POST"]
  }
});

// Serve static files from the client's build directory
app.use(express.static(path.join(__dirname, 'client/dist')));

// All other GET requests will serve the client's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

// --- Chess Game Logic (Simplified) ---

const initialBoard = () => [
  [{ type: 'r', color: 'b' }, { type: 'n', color: 'b' }, { type: 'b', color: 'b' }, { type: 'q', color: 'b' }, { type: 'k', color: 'b' }, { type: 'b', color: 'b' }, { type: 'n', color: 'b' }, { type: 'r', color: 'b' }],
  [{ type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }],
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  [{ type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }],
  [{ type: 'r', color: 'w' }, { type: 'n', color: 'w' }, { type: 'b', color: 'w' }, { type: 'q', color: 'w' }, { type: 'k', color: 'w' }, { type: 'b', color: 'w' }, { type: 'n', color: 'b' }, { type: 'r', color: 'w' }]
];

const games = {}; // Stores active games: { gameId: { board, turn, players: { white: socketId, black: socketId }, status: 'waiting' | 'playing' | 'gameOver' } }
let waitingPlayer = null; // Socket ID of a player waiting for an opponent

const generateGameId = () => Math.random().toString(36).substring(2, 9);

// Basic move validation (highly simplified, does not check for checks/checkmates, special moves like castling, en passant, promotion)
const isValidMove = (board, from, to, turn) => {
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;

  if (fromRow < 0 || fromRow > 7 || fromCol < 0 || fromCol > 7 ||
      toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) {
    return false; // Out of bounds
  }

  const piece = board[fromRow][fromCol];
  if (!piece || piece.color !== turn) {
    return false; // No piece, or not current player's piece
  }

  const targetPiece = board[toRow][toCol];
  if (targetPiece && targetPiece.color === turn) {
    return false; // Cannot capture own piece
  }

  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);
  const rowDir = toRow > fromRow ? 1 : (toRow < fromRow ? -1 : 0);
  const colDir = toCol > fromCol ? 1 : (toCol < fromCol ? -1 : 0);

  // Check for path obstruction (for sliding pieces)
  const isPathClear = (r, c, dr, dc) => {
    let currentRow = fromRow + dr;
    let currentCol = fromCol + dc;
    while (currentRow !== r || currentCol !== c) {
      if (board[currentRow][currentCol]) return false; // Path obstructed
      currentRow += dr;
      currentCol += dc;
    }
    return true;
  };

  switch (piece.type) {
    case 'p': // Pawn
      const pawnDir = (piece.color === 'w') ? -1 : 1; // White moves up, Black moves down

      // Basic forward move
      if (colDiff === 0 && toRow === fromRow + pawnDir && !targetPiece) {
        return true;
      }
      // Initial two-square move
      if (colDiff === 0 && (fromRow === (piece.color === 'w' ? 6 : 1)) && toRow === fromRow + 2 * pawnDir && !targetPiece && !board[fromRow + pawnDir][fromCol]) {
        return true;
      }
      // Basic capture (diagonal)
      if (colDiff === 1 && toRow === fromRow + pawnDir && targetPiece && targetPiece.color !== piece.color) {
        return true;
      }
      return false;

    case 'r': // Rook
      if ((rowDiff === 0 && colDiff > 0) || (colDiff === 0 && rowDiff > 0)) {
        return isPathClear(toRow, toCol, rowDir, colDir);
      }
      return false;

    case 'n': // Knight
      return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);

    case 'b': // Bishop
      if (rowDiff === colDiff && rowDiff > 0) {
        return isPathClear(toRow, toCol, rowDir, colDir);
      }
      return false;

    case 'q': // Queen
      if ((rowDiff === 0 && colDiff > 0) || (colDiff === 0 && rowDiff > 0) || (rowDiff === colDiff && rowDiff > 0)) {
        return isPathClear(toRow, toCol, rowDir, colDir);
      }
      return false;

    case 'k': // King
      return rowDiff <= 1 && colDiff <= 1;

    default:
      return false;
  }
};


io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  let playerGameId = null;

  // Try to find an existing game to join or create a new one
  if (waitingPlayer) {
    // A player is waiting, create a new game
    const gameId = generateGameId();
    games[gameId] = {
      board: initialBoard(),
      turn: 'w',
      players: { white: waitingPlayer, black: socket.id },
      status: 'playing'
    };
    playerGameId = gameId;

    // Assign colors and join rooms
    io.to(waitingPlayer).emit('playerColor', 'w');
    io.to(waitingPlayer).join(gameId);
    io.to(socket.id).emit('playerColor', 'b');
    socket.join(gameId);

    io.to(gameId).emit('gameUpdate', games[gameId]);
    io.to(gameId).emit('message', `Game ${gameId} started! White: ${waitingPlayer}, Black: ${socket.id}`);
    console.log(`Game ${gameId} started between ${waitingPlayer} and ${socket.id}`);

    waitingPlayer = null; // Reset waiting player

  } else {
    // No player waiting, this player waits
    waitingPlayer = socket.id;
    socket.emit('message', 'Waiting for an opponent...');
    console.log(`${socket.id} is waiting for an opponent.`);
  }

  socket.on('joinGame', (gameId) => {
    // This can be used for specific game IDs, not implemented for auto-match
    if (games[gameId] && games[gameId].status === 'waiting') {
      // ... logic to join specific game
    } else {
      // ... logic to create new game if gameId not found, or inform client
    }
  });

  socket.on('makeMove', ({ from, to }) => {
    // Find the game this player belongs to
    const gameId = Object.keys(games).find(id =>
      games[id].players.white === socket.id || games[id].players.black === socket.id
    );

    if (!gameId) {
      socket.emit('message', 'You are not in an active game.');
      return;
    }

    const game = games[gameId];
    const playerColor = (game.players.white === socket.id) ? 'w' : 'b';

    if (game.status !== 'playing') {
      socket.emit('message', 'Game is not active.');
      return;
    }

    if (playerColor !== game.turn) {
      socket.emit('message', `It's not your turn, it's ${game.turn}'s turn.`);
      return;
    }

    const piece = game.board[from[0]][from[1]];
    if (!piece || piece.color !== playerColor) {
      socket.emit('message', 'Invalid piece selection.');
      return;
    }

    if (isValidMove(game.board, from, to, game.turn)) {
      // Apply the move
      const newBoard = JSON.parse(JSON.stringify(game.board)); // Deep copy
      newBoard[to[0]][to[1]] = newBoard[from[0]][from[1]];
      newBoard[from[0]][from[1]] = null;

      game.board = newBoard;
      game.turn = (game.turn === 'w') ? 'b' : 'w';

      io.to(gameId).emit('gameUpdate', game);
      io.to(gameId).emit('message', `Move made. It's ${game.turn}'s turn.`);
      console.log(`Move made in game ${gameId} by ${socket.id}`);

      // Basic check for game over (e.g., if a king is captured - highly simplified)
      const whiteKingPresent = newBoard.flat().some(p => p && p.type === 'k' && p.color === 'w');
      const blackKingPresent = newBoard.flat().some(p => p && p.type === 'k' && p.color === 'b');

      if (!whiteKingPresent) {
        game.status = 'gameOver';
        io.to(gameId).emit('gameOver', 'Black wins!');
        io.to(gameId).emit('message', 'Game over! Black wins!');
        console.log(`Game ${gameId} over: Black wins.`);
      } else if (!blackKingPresent) {
        game.status = 'gameOver';
        io.to(gameId).emit('gameOver', 'White wins!');
        io.to(gameId).emit('message', 'Game over! White wins!');
        console.log(`Game ${gameId} over: White wins.`);
      }

    } else {
      socket.emit('message', 'Invalid move.');
      console.log(`Invalid move attempt in game ${gameId} by ${socket.id}`);
    }
  });

  socket.on('resetGame', () => {
    const gameId = Object.keys(games).find(id =>
      games[id].players.white === socket.id || games[id].players.black === socket.id
    );

    if (gameId) {
      games[gameId].board = initialBoard();
      games[gameId].turn = 'w';
      games[gameId].status = 'playing';
      io.to(gameId).emit('gameUpdate', games[gameId]);
      io.to(gameId).emit('message', 'Game has been reset!');
      io.to(gameId).emit('gameOver', null); // Clear game over message
      console.log(`Game ${gameId} reset by ${socket.id}`);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);

    // If the disconnected player was waiting
    if (waitingPlayer === socket.id) {
      waitingPlayer = null;
      console.log(`${socket.id} (waiting player) disconnected.`);
    }

    // Find and clean up games where this player was involved
    for (const gameId in games) {
      if (games[gameId].players.white === socket.id || games[gameId].players.black === socket.id) {
        io.to(gameId).emit('message', 'Opponent disconnected. Game ended.');
        io.to(gameId).emit('gameOver', 'Opponent disconnected.');
        delete games[gameId];
        console.log(`Game ${gameId} ended due to ${socket.id} disconnection.`);
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
