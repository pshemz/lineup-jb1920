import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const PlayerSlot = ({ position, player, onClick, onDropPlayer }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'PLAYER',
    item: { player, slotId: position.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [player]);

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'PLAYER',
    drop: (item) => onDropPlayer(item, position.id),
    canDrop: () => player === undefined || item.slotId !== position.id,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [player]);

  const content = player ? (
    <div className="jersey">{player.number || '?'}</div>
  ) : (
    <div className="plus-icon">+</div>
  );

  return (
    <div
      className="player-slot"
      ref={(node) => drag(drop(node))}
      style={{ top: position.top, left: position.left }}
      onClick={() => onClick(position.id)}
    >
      {content}
      {player && <div className="player-name">{player.name}</div>}
    </div>
  );
};

export default PlayerSlot;
