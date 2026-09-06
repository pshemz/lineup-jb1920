import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Trash2 } from 'lucide-react';

const PlayerSlot = ({
  position,
  player,
  onClick,
  onDropPlayer,
  onRemovePlayer,
}) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'PLAYER',

      item: {
        player,
        slotId: position.id,
      },

      canDrag: Boolean(player),

      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [player, position.id]
  );

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: 'PLAYER',

      drop: (item) => {
        if (item.slotId !== position.id) {
          onDropPlayer(item, position.id);
        }
      },

      canDrop: (item) =>
        Boolean(item.player) &&
        item.slotId !== position.id,

      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [player, position.id, onDropPlayer]
  );

  const handleRemove = (event) => {
    event.stopPropagation();
    onRemovePlayer(position.id);
  };

  const content = player ? (
    <div className="jersey">
      {player.number || '?'}
    </div>
  ) : (
    <div className="plus-icon">+</div>
  );

  return (
    <div
      className={[
        'player-slot',
        isOver && canDrop ? 'highlight' : '',
        isDragging ? 'dragging' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      ref={(node) => drag(drop(node))}
      style={{
        top: position.top,
        left: position.left,
      }}
      onClick={() => onClick(position.id)}
    >
      {content}

      {player && (
        <div className="player-name">
          {player.name}
        </div>
      )}

      {player && (
        <button
          className="remove-button"
          onClick={handleRemove}
          title="Usuń zawodnika"
          type="button"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
};

export default PlayerSlot;