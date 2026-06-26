import React from 'react';
import Square from './Square';

function Board({ board, selectedSquare, onSquareClick, playerColor }) {
  const renderBoard = () => {
    const boardElements = [];
    // If playerColor is 'b', reverse the board for black player's perspective
    const displayBoard = playerColor === 'b' ? board.slice().reverse().map(row => row.slice().reverse()) : board;

    for (let i = 0; i < 8; i++) {
      const row = displayBoard[i];
      for (let j = 0; j < 8; j++) {
        // Original coordinates for logic, not display
        const originalRow = playerColor === 'b' ? 7 - i : i;
        const originalCol = playerColor === 'b' ? 7 - j : j;

        const piece = board[originalRow][originalCol]; // Always use original board for piece data
        const isLight = (i + j) % 2 === 0;
        const isSelected = selectedSquare && selectedSquare[0] === originalRow && selectedSquare[1] === originalCol;

        boardElements.push(
          <Square
            key={`${i}-${j}`}
            piece={piece}
            isLight={isLight}
            isSelected={isSelected}
            onClick={() => onSquareClick(originalRow, originalCol)}
          />
        );
      }
    }
    return boardElements;
  };

  const renderRankLabels = () => {
    const labels = [];
    for (let i = 8; i >= 1; i--) {
      labels.push(<div key={`rank-${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400 font-semibold">{playerColor === 'b' ? 9 - i : i}</div>);
    }
    return playerColor === 'b' ? labels : labels.reverse();
  };

  const renderFileLabels = () => {
    const labels = [];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    for (let i = 0; i < 8; i++) {
      labels.push(<div key={`file-${files[i]}`} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400 font-semibold">{files[playerColor === 'b' ? 7 - i : i]}</div>);
    }
    return labels;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-8 w-[calc(8*80px)] h-[calc(8*80px)] border-2 border-gray-700 shadow-2xl">
        {renderBoard()}
      </div>
      <div className="flex justify-between w-[calc(8*80px)] mt-2">
        {renderFileLabels()}
      </div>
    </div>
  );
}

export default Board;
