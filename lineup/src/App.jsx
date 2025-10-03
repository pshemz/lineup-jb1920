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
  { id: 12, name: 'Listkowski', number: 29 },
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