import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Trash2 } from 'lucide-react';

const PlayerSlot = ({ position, player, onClick, onDropPlayer, onRemovePlayer }) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'PLAYER',
      item: { player, slotId: position.id },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [player]
  );

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: 'PLAYER',
      drop: (item) => onDropPlayer(item, position.id),
      canDrop: (item) => item.slotId !== position.id,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [player]
  );

  const handleRemove = (e) => {
    e.stopPropagation();
    onRemovePlayer(position.id);
  };

  const content = player ? (
    <div className="jersey">{player.number || '?'}</div>
  ) : (
    <div className="plus-icon">+</div>
  );

  return (
    <div
      className={`player-slot ${isOver && canDrop ? 'highlight' : ''}`}
      ref={(node) => drag(drop(node))}
      style={{ top: position.top, left: position.left }}
      onClick={() => onClick(position.id)}
    >
      {content}
      {player && <div className="player-name">{player.name}</div>}

      {player && (
        <button
          className="remove-button"
          onClick={handleRemove}
          title="Usuń zawodnika"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
};

export default PlayerSlot;
