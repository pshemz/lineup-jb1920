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
    padding: 0,
    margin: 0
  },
  li: {
    listStyle: 'none',
    textAlign: 'left'
  },
  button: {
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

const PlayerListModal = ({ players, benchPlayers = [], onSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [includeBench, setIncludeBench] = useState(false);

  const categories = [
    { title: 'Bramkarze', players: players.goalkeepers || [] },
    { title: 'Obrońcy', players: players.defenders || [] },
    { title: 'Pomocnicy', players: players.midfielders || [] },
    { title: 'Napastnicy', players: players.attackers || [] },
  ];

  const filterPlayers = (playersList) =>
    playersList
      .map(player => ({
        ...player,
        searchString: `${player.number} ${player.name}`.toLowerCase(),
      }))
      .filter(player =>
        player.searchString.includes(searchTerm.toLowerCase())
      );

  const filteredCategories = categories.map(category => ({
    ...category,
    players: filterPlayers(category.players),
  }));

  const filteredBenchPlayers = includeBench ? filterPlayers(benchPlayers) : [];

  const hasResults =
    filteredCategories.some(category => category.players.length > 0) ||
    filteredBenchPlayers.length > 0;

  const renderPlayer = (player, isLastInCategory = false) => (
    <li
      key={player.id}
      className={isLastInCategory ? 'last-in-category' : ''}
      onClick={() => onSelect(player)}
      style={modalStyles.li}
    >
      <strong>#{player.number}</strong> {player.name}
    </li>
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>Wybierz zawodnika</h3>

        <input
          type="text"
          placeholder="Szukaj"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          autoFocus
          style={modalStyles.input}
        />

        <ul style={modalStyles.ul}>
          {filteredCategories.map(category =>
            category.players.length > 0 ? (
              <React.Fragment key={category.title}>
                <li className="player-section-title">
                  {category.title}
                </li>

                {category.players.map((player, index) =>
                  renderPlayer(player, index === category.players.length - 1)
                )}
              </React.Fragment>
            ) : null
          )}

          {includeBench && filteredBenchPlayers.length > 0 && (
            <>
              <li className="player-section-title bench-section-title">
                Byli zawodnicy
              </li>

              {filteredBenchPlayers.map((player, index) =>
                renderPlayer(player, index === filteredBenchPlayers.length - 1)
              )}
            </>
          )}

          {!hasResults && (
            <li style={modalStyles.noResults}>
              Brak wyników dla "{searchTerm}"
            </li>
          )}
        </ul>

        <div className="modal-bottom-row">
          <button onClick={onClose} style={modalStyles.button}>
            Zamknij
          </button>

          <label className="bench-switch" title="Pokaż byłych zawodników">
            <input
              type="checkbox"
              checked={includeBench}
              onChange={() => setIncludeBench(prev => !prev)}
            />
            <span className="bench-slider" />
            <span className="bench-switch-label">Byli zawodnicy</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PlayerListModal;