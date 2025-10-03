import React, { useState } from 'react';
import Pitch from './Pitch';
import PlayerSlot from './PlayerSlot';
import PlayerListModal from './PlayerListModal';

const ALL_PLAYERS = [
  { id: 1, name: 'Abramowicz', number: 50 },
  { id: 2, name: 'Wdowik', number: 27 },
  { id: 3, name: 'Pelmard', number: 70 },
  { id: 4, name: 'Vital', number: 13 },
  { id: 5, name: 'Wojtuszek', number: 15 },
  { id: 6, name: 'Romanczuk', number: 6 },
  { id: 7, name: 'Drachal', number: 8 },
  { id: 8, name: 'Imaz', number: 11 },
  { id: 9, name: 'Pietuszewski', number: 80 },
  { id: 10, name: 'Pululu', number: 10 },
  { id: 11, name: 'Pozo', number: 7 },
  { id: 12, name: 'Stojinovic', number: 3 },
  { id: 13, name: 'Kobayashi', number: 4 },
  { id: 14, name: 'Polak', number: 5 },
  { id: 15, name: 'Rallis', number: 9 },
  { id: 16, name: 'Sylla', number: 17 },
  { id: 17, name: 'Prip', number: 18 },
  { id: 18, name: 'Cantero', number: 19 },
  { id: 19, name: 'Lozano', number: 21 },
  { id: 20, name: 'Piekutowski', number: 22 },
  { id: 21, name: 'Jackson', number: 25 },
  { id: 22, name: 'Flach', number: 31 },
  { id: 23, name: 'Krasiewicz', number: 53 },
  { id: 24, name: 'Hirosawa', number: 55 },
  { id: 25, name: 'Damasiewicz', number: 66 },
  { id: 26, name: 'Jóźwiak', number: 72 },
  { id: 27, name: 'Kozłowski', number: 85 },
  { id: 28, name: 'Mazurek', number: 86 },
  { id: 29, name: 'Listkowski', number: 29 },
];

const formationSlots = [
  { id: 'gk', top: '65%', left: '47%' },

  { id: 'lb', top: '45%', left: '17%' },
  { id: 'lcb', top: '45%', left: '35%' },
  { id: 'rcb', top: '45%', left: '57%' },
  { id: 'rb', top: '45%', left: '77%' },

  { id: 'ldm', top: '7%', left: '20%' },
  { id: 'cm', top: '7%', left: '47%' },
  { id: 'rdm', top: '7%', left: '75%' },

  { id: 'lw', top: '-30%', left: '20%' }, 
  { id: 'cf', top: '-30%', left: '47%' }, 
  { id: 'rw', top: '-30%', left: '75%' },
];

const App = () => {
  const [lineup, setLineup] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlotId, setCurrentSlotId] = useState(null);

  const handleSlotClick = (slotId) => {
    setCurrentSlotId(slotId);
    setIsModalOpen(true);
  };

  const handlePlayerSelect = (player) => {
    setLineup(prevLineup => ({
      ...prevLineup,
      [currentSlotId]: player,
    }));
    setIsModalOpen(false);
  };

  return (
    <div className="app">
      <Pitch>
        {formationSlots.map(slot => (
          <PlayerSlot 
            key={slot.id}
            position={slot}
            player={lineup[slot.id]}
            onClick={handleSlotClick}
          />
        ))}
      </Pitch>
      
      {isModalOpen && (
        <PlayerListModal 
          players={ALL_PLAYERS} 
          onSelect={handlePlayerSelect} 
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;