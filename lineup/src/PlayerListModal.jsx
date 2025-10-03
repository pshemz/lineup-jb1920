import React from 'react';

const PlayerListModal = ({ players, onSelect, onClose }) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}> 
        <h3>Wybierz zawodnika</h3>
        <ul>
          {players.map(player => (
            <li key={player.id} onClick={() => onSelect(player)}>
              {player.number} - {player.name}
            </li>
          ))}
        </ul>
        <button onClick={onClose}>Zamknij</button>
      </div>
    </div>
  );
};

export default PlayerListModal;