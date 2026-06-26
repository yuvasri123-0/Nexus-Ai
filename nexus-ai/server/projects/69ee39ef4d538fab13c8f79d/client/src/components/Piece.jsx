import React from 'react';

const pieceUnicode = {
  b: {
    p: '♟',
    r: '♜',
    n: '♞',
    b: '♝',
    q: '♛',
    k: '♚',
  },
  w: {
    p: '♙',
    r: '♖',
    n: '♘',
    b: '♗',
    q: '♕',
    k: '♔',
  },
};

function Piece({ piece }) {
  if (!piece) return null;

  const unicodeChar = pieceUnicode[piece.color][piece.type];
  const pieceColorClass = piece.color === 'w' ? 'text-white' : 'text-gray-400';

  return (
    <span className={`select-none ${pieceColorClass}`}>
      {unicodeChar}
    </span>
  );
}

export default Piece;
