import React from 'react';
import Piece from './Piece';

function Square({ piece, isLight, isSelected, onClick }) {
  const backgroundColor = isLight
    ? 'bg-gray-700 hover:bg-gray-600'
    : 'bg-gray-900 hover:bg-gray-800';
  const selectedColor = isSelected ? 'ring-4 ring-purple-500 ring-offset-1 ring-offset-gray-900' : '';

  return (
    <div
      className={`w-20 h-20 flex items-center justify-center text-4xl transition duration-100 ${backgroundColor} ${selectedColor} cursor-pointer`}
      onClick={onClick}
    >
      {piece && <Piece piece={piece} />}
    </div>
  );
}

export default Square;
