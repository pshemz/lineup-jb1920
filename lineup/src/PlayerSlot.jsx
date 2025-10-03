import React from 'react';

const PlayerSlot = ({ position, player, onClick }) => {
  
  const content = player 
    ? <div className="jersey">{player.number || '?'}</div>
    : <div className="plus-icon">+</div>;

  return (
    <div 
      className="player-slot" 
      style={{ top: position.top, left: position.left }}
      onClick={() => onClick(position.id)}
    >
      {content}
      {player && <div className="player-name">{player.name}</div>}
    </div>
  );
};

export default PlayerSlot;