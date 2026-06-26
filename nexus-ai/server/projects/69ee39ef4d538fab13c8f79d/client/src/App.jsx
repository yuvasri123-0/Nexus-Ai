import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Board from './components/Board';

const socket = io('http://localhost:3000'); // Connect to your server

function App() {
  const [board, setBoard] = useState([]);
  const [turn, setTurn] = useState('w'); // 'w' or 'b'
  const [selectedSquare, setSelectedSquare] = useState(null); // [row, col]
  const [playerColor, setPlayerColor] = useState(null); // 'w' or 'b'
  const [message, setMessage] = useState('Connecting...');
  const [gameOver, setGameOver] = useState(null); // null, or winner message

  useEffect(() => {
    socket.on('connect', () => {
      setMessage('Connected to server.');
      console.log('Connected to server');
    });

    socket.on('playerColor', (color) => {
      setPlayerColor(color);
      setMessage(`You are playing as ${color === 'w' ? 'White' : 'Black'}`);
      console.log(`Assigned color: ${color}`);
    });

    socket.on('gameUpdate', (gameState) => {
      setBoard(gameState.board);
      setTurn(gameState.turn);
      // Clear selected square if it's no longer the player's turn or game state changed significantly
      if (gameState.turn !== playerColor) {
        setSelectedSquare(null);
      }
      console.log('Game state updated:', gameState);
    });

    socket.on('message', (msg) => {
      setMessage(msg);
      console.log('Server message:', msg);
    });

    socket.on('gameOver', (winner) => {
      setGameOver(winner);
      if (winner) {
        setMessage(winner);
      }
      setSelectedSquare(null);
    });

    socket.on('disconnect', () => {
      setMessage('Disconnected from server.');
      console.log('Disconnected from server');
      setBoard([]);
      setTurn('w');
      setSelectedSquare(null);
      setPlayerColor(null);
      setGameOver(null);
    });

    return () => {
      socket.off('connect');
      socket.off('playerColor');
      socket.off('gameUpdate');
      socket.off('message');
      socket.off('gameOver');
      socket.off('disconnect');
    };
  }, [playerColor]); // Re-run effect if playerColor changes to update message logic

  const handleSquareClick = (row, col) => {
    if (gameOver) return; // No moves after game over
    if (playerColor !== turn) {
      setMessage(`It's not your turn, it's ${turn === 'w' ? 'White' : 'Black'}'s turn.`);
      return;
    }

    const clickedPiece = board[row][col];

    if (selectedSquare) {
      // A piece is already selected, try to make a move
      const [fromRow, fromCol] = selectedSquare;
      if (fromRow === row && fromCol === col) {
        // Clicked the same square again, deselect
        setSelectedSquare(null);
      } else {
        // Attempt to move the selected piece
        socket.emit('makeMove', { from: selectedSquare, to: [row, col] });
        setSelectedSquare(null); // Deselect after attempting move
      }
    } else if (clickedPiece && clickedPiece.color === playerColor) {
      // No piece selected, select this piece if it's the player's color
      setSelectedSquare([row, col]);
      setMessage(`Selected ${clickedPiece.color === 'w' ? 'White' : 'Black'} ${clickedPiece.type.toUpperCase()} at ${String.fromCharCode(97 + col)}${8 - row}`);
    } else if (clickedPiece && clickedPiece.color !== playerColor) {
      setMessage("That's not your piece.");
    } else {
      setMessage('Select a piece to move.');
    }
  };

  const resetGame = () => {
    socket.emit('resetGame');
    setGameOver(null);
    setMessage('Game reset initiated...');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-bold mb-8 text-purple-400">Dark Chess</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-8 w-full max-w-lg">
        <p className="text-lg mb-2 text-center">
          <span className="font-semibold text-purple-300">Status:</span> {message}
        </p>
        {playerColor && (
          <p className="text-md text-center mb-4">
            You are playing as <span className={`font-bold ${playerColor === 'w' ? 'text-white' : 'text-gray-400'}`}>
              {playerColor === 'w' ? 'White' : 'Black'}
            </span>
          </p>
        )}
        {turn && !gameOver && (playerColor === turn) && (
          <p className="text-lg font-bold text-center text-green-400">It's YOUR turn!</p>
        )}
        {turn && !gameOver && (playerColor !== turn) && playerColor && (
          <p className="text-lg font-bold text-center text-red-400">Waiting for {turn === 'w' ? 'White' : 'Black'}'s move...</p>
        )}
        {gameOver && (
          <div className="text-center mt-4">
            <p className="text-2xl font-bold text-yellow-400">Game Over!</p>
            <p className="text-xl text-yellow-300">{gameOver}</p>
            <button
              onClick={resetGame}
              className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md shadow-lg transition duration-300"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {board.length > 0 ? (
        <Board
          board={board}
          selectedSquare={selectedSquare}
          onSquareClick={handleSquareClick}
          playerColor={playerColor}
        />
      ) : (
        <div className="text-xl text-gray-400">Waiting for game to start...</div>
      )}

      <div className="mt-8 text-gray-500 text-sm">
        <p>Instructions: Two players connect to the server. The first player to connect waits for an opponent. Once two players are connected, a game begins. Click on your piece to select it, then click on a valid destination square to move it. Basic move validation is implemented on the server-side. (Note: Full chess rules like check/checkmate, castling, en passant, promotion are simplified or not implemented for brevity).</p>
        <p className="mt-2">To run: `npm install` in root, `cd client && npm install`, then `npm run dev` in root. Open two browser tabs to `http://localhost:5173`.</p>
      </div>
    </div>
  );
}

export default App;
