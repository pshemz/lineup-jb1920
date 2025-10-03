import React, { useState } from 'react';

const modalStyles = {
  input: {
    marginBottom: '15px',
    padding: '10px',
    width: '90%',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  ul: {
    maxHeight: '300px',
    overflowY: 'auto',
    padding: 0
  },
  li: {
    padding: '10px',
    cursor: 'pointer',
    borderBottom: '1px solid #eee',
    listStyle: 'none',
    textAlign: 'left'
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    cursor: 'pointer'
  },
  noResults: {
    padding: '10px',
    listStyle: 'none',
    textAlign: 'center',
    color: '#888'
  }
};

const PlayerListModal = ({ players, onSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlayers = players.map(player => ({
    ...player,
    searchString: `${player.number} ${player.name}`.toLowerCase(),
  })).filter(player =>
    player.searchString.includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>Wybierz zawodnika</h3>

        <input
          type="text"
          placeholder="Szukaj"
          value={searchTerm}
          onChange={handleSearchChange}
          autoFocus
          style={modalStyles.input}
        />

        <ul style={modalStyles.ul}>
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map(player => (
              <li
                key={player.id}
                onClick={() => onSelect(player)}
                style={modalStyles.li}
              >
                <strong>#{player.number}</strong> {player.name}
              </li>
            ))
          ) : (
            <li style={modalStyles.noResults}>
              Brak wyników dla "{searchTerm}"
            </li>
          )}
        </ul>

        <button
          onClick={onClose}
          style={modalStyles.button}
        >
          Zamknij
        </button>
      </div>
    </div>
  );
};

export default PlayerListModal;