import React, { useState } from 'react';

const modalStyles = {
  input: {
    marginBottom: '15px',
    padding: '10px',
    width: '100%',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },

  ul: {
    maxHeight: 'min(52vh, 420px)',
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: 0,
    margin: 0,
  },

  li: {
    listStyle: 'none',
    textAlign: 'left',
  },

  button: {
    padding: '10px 20px',
    cursor: 'pointer',
  },

  noResults: {
    padding: '10px',
    listStyle: 'none',
    textAlign: 'center',
    color: '#888',
  },

  unconfirmedNumber: {
    display: 'block',
    marginTop: '3px',
    fontSize: '0.72rem',
    color: '#999',
    fontStyle: 'italic',
  },
};

const PlayerListModal = ({
  players,
  allStarPlayers = [],
  reservePlayers = [],
  onSelect,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const [includeAllStar, setIncludeAllStar] =
    useState(false);

  const [includeReserves, setIncludeReserves] =
    useState(false);

  const categories = [
    {
      title: 'Bramkarze',
      players: players.goalkeepers || [],
    },
    {
      title: 'Obrońcy',
      players: players.defenders || [],
    },
    {
      title: 'Pomocnicy',
      players: players.midfielders || [],
    },
    {
      title: 'Napastnicy',
      players: players.attackers || [],
    },
  ];

  const filterPlayers = (playersList) =>
    playersList
      .map((player) => ({
        ...player,
        searchString:
          `${player.number} ${player.name}`.toLowerCase(),
      }))
      .filter((player) =>
        player.searchString.includes(
          searchTerm.toLowerCase()
        )
      );

  const filteredCategories = categories.map(
    (category) => ({
      ...category,
      players: filterPlayers(category.players),
    })
  );

  const filteredAllStarPlayers = includeAllStar
    ? filterPlayers(allStarPlayers)
    : [];

  const filteredReservePlayers = includeReserves
    ? filterPlayers(reservePlayers)
    : [];

  const hasResults =
    filteredCategories.some(
      (category) =>
        category.players.length > 0
    ) ||
    filteredAllStarPlayers.length > 0 ||
    filteredReservePlayers.length > 0;

  /*
   * Renderowanie zawodnika.
   *
   * isReserve = true oznacza zawodnika
   * z Jagiellonii Białystok II.
   *
   * Wtedy pod zawodnikiem pojawia się:
   * "*numer niepotwierdzony"
   */
  const renderPlayer = (
    player,
    isLastInCategory = false
  ) => (
    <li
      key={player.id}
      className={
        isLastInCategory
          ? 'last-in-category'
          : ''
      }
      onClick={() => onSelect(player)}
      style={modalStyles.li}
    >
      <strong>
        #{player.number}
      </strong>{' '}
      {player.name}

      {player.unconfirmedNumber && (
        <span
          style={modalStyles.unconfirmedNumber}
        >
          numer niepotwierdzony
        </span>
      )}
    </li>
  );

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
    >
      <div
        className="modal-content"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <h3>Wybierz zawodnika</h3>

        <input
          type="text"
          placeholder="Szukaj zawodnika..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
          autoFocus
          style={modalStyles.input}
        />

        <ul style={modalStyles.ul}>

          {/* =====================================
              PIERWSZY SKŁAD
          ===================================== */}

          {filteredCategories.map(
            (category) =>
              category.players.length > 0 ? (
                <React.Fragment
                  key={category.title}
                >
                  <li className="player-section-title">
                    {category.title}
                  </li>

                  {category.players.map(
                    (player, index) =>
                      renderPlayer(
                        player,
                        index ===
                          category.players.length - 1
                      )
                  )}
                </React.Fragment>
              ) : null
          )}

          {/* =====================================
              ALL-STARS
          ===================================== */}

          {includeAllStar &&
            filteredAllStarPlayers.length > 0 && (
              <>
                <li className="player-section-title all-star-section-title">
                  All-Stars
                </li>

                {filteredAllStarPlayers.map(
                  (player, index) =>
                    renderPlayer(
                      player,
                      index ===
                        filteredAllStarPlayers.length - 1
                    )
                )}
              </>
            )}

          {/* =====================================
              JAGIELLONIA BIAŁYSTOK II
          ===================================== */}

          {includeReserves &&
            filteredReservePlayers.length > 0 && (
              <>
                <li className="player-section-title reserve-section-title">
                  Jagiellonia Białystok II
                </li>

                {filteredReservePlayers.map(
                  (player, index) =>
                    renderPlayer(
                      player,

                      index ===
                        filteredReservePlayers.length - 1,

                      true
                    )
                )}
              </>
            )}

          {/* =====================================
              BRAK WYNIKÓW
          ===================================== */}

          {!hasResults && (
            <li
              style={
                modalStyles.noResults
              }
            >
              Brak wyników dla "{searchTerm}"
            </li>
          )}
        </ul>

        {/* =====================================
            DOLNY WIERSZ
        ===================================== */}

        <div className="modal-bottom-row">

          <button
            onClick={onClose}
            style={modalStyles.button}
            type="button"
          >
            Zamknij
          </button>

          <div className="player-source-switches">

            {/* =================================
                ALL-STARS SWITCH
            ================================= */}

            <label
              className="bench-switch"
              title="Pokaż zawodników All-Stars"
            >
              <input
                type="checkbox"
                checked={includeAllStar}
                onChange={() =>
                  setIncludeAllStar(
                    (prev) => !prev
                  )
                }
              />

              <span className="bench-slider" />

              <span className="bench-switch-label">
                All-Stars
              </span>
            </label>

            {/* =================================
                JAGIELLONIA II SWITCH
            ================================= */}

            <label
              className="bench-switch"
              title="Pokaż zawodników Jagiellonii Białystok II"
            >
              <input
                type="checkbox"
                checked={includeReserves}
                onChange={() =>
                  setIncludeReserves(
                    (prev) => !prev
                  )
                }
              />

              <span className="bench-slider" />

              <span className="bench-switch-label">
                Jagiellonia II
              </span>
            </label>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerListModal;