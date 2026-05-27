import html2canvas from 'html2canvas';
import React, { useRef, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import Pitch from './Pitch';
import PlayerSlot from './PlayerSlot';
import PlayerListModal from './PlayerListModal';

const FIRST_TEAM = {
  goalkeepers: [
    { id: 1, name: 'Abramowicz', number: 50 },
    { id: 2, name: 'Perchel', number: 1 },
    { id: 3, name: 'Damasiewicz', number: 66 },
  ],

  defenders: [
    { id: 4, name: 'Montoia', number: 23 },
    { id: 5, name: 'Polak', number: 5 },
    { id: 6, name: 'Vital', number: 13 },
    { id: 7, name: 'Stojinovic', number: 3 },
    { id: 8, name: 'Kobayashi', number: 4 },
    { id: 9, name: 'Tolis', number: 44 },
    { id: 10, name: 'Wojtuszek', number: 15 },
  ],

  midfielders: [
    { id: 11, name: 'Romanczuk', number: 6 },
    { id: 12, name: 'Kozłowski', number: 85 },
    { id: 13, name: 'Flach', number: 31 },
    { id: 14, name: 'Mazurek', number: 86 },
    { id: 15, name: 'Lozano', number: 21 },
    { id: 16, name: 'Drachal', number: 8 },
    { id: 17, name: 'Imaz', number: 11 },
    { id: 18, name: 'Szmyt', number: 77 },
    { id: 19, name: 'Jóźwiak', number: 72 },
    { id: 20, name: 'Zalewski', number: 80 },
  ],

  attackers: [
    { id: 21, name: 'Rallis', number: 9 },
    { id: 22, name: 'Sylla', number: 17 },
  ]
};

const SECOND_TEAM = [
  { id: 100, name: 'Pelmard', number: 70 },
  { id: 101, name: 'Wdowik', number: 27 },
  { id: 102, name: 'Skrzypczak', number: 72 },
  { id: 103, name: 'Moutinho', number: 44 },
  { id: 104, name: 'Nene', number: 8 },
  { id: 105, name: 'Kubicki', number: 14 },
  { id: 106, name: 'Hansen', number: 99 },
  { id: 108, name: 'Pietuszewski', number: 80 },
  { id: 109, name: 'Diaby-Fadiga', number: 9 },
  { id: 110, name: 'Pululu', number: 10 },
  { id: 111, name: 'Pozo', number: 7 },
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

const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);

const App = () => {
  const [lineup, setLineup] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlotId, setCurrentSlotId] = useState(null);
  const pitchRef = useRef(null);

  const handleSaveImage = async () => {
    if (!pitchRef.current) return;

    document.body.classList.add('saving-image-mode');

    try {
      await document.fonts?.ready;
      await new Promise((resolve) => requestAnimationFrame(resolve));

      const canvas = await html2canvas(pitchRef.current, {
        backgroundColor: null,
        useCORS: true,
        allowTaint: true,
        scale: 2,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = 'sklad-jagiellonia.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      document.body.classList.remove('saving-image-mode');
    }
  };


  const handleSlotClick = (slotId) => {
    setCurrentSlotId(slotId);
    setIsModalOpen(true);
  };

  const handlePlayerSelect = (player) => {
    setLineup((prevLineup) => ({
      ...prevLineup,
      [currentSlotId]: player,
    }));
    setIsModalOpen(false);
  };

  const handleRemovePlayer = (slotId) => {
      setLineup((prevLineup) => {
          const updatedLineup = { ...prevLineup };
          delete updatedLineup[slotId]; 
          return updatedLineup;
      });
  };

  const handleDropPlayer = (item, targetSlotId) => {
    const { player: draggedPlayer, slotId: sourceSlotId } = item;
    setLineup((prevLineup) => {
      const updatedLineup = { ...prevLineup };
      const targetPlayer = updatedLineup[targetSlotId];
      updatedLineup[targetSlotId] = draggedPlayer;
      if (targetPlayer) {
        updatedLineup[sourceSlotId] = targetPlayer;
      } else {
        delete updatedLineup[sourceSlotId];
      }
      return updatedLineup;
    });
  };

  return (
    <DndProvider backend={isTouchDevice() ? TouchBackend : HTML5Backend} options={isTouchDevice() ? { enableMouseEvents: true } : undefined}>
      <div className="app">
        <Pitch ref={pitchRef}>
          {formationSlots.map((slot) => (
            <PlayerSlot
              key={slot.id}
              position={slot}
              player={lineup[slot.id]}
              onClick={handleSlotClick}
              onDropPlayer={handleDropPlayer}
              onRemovePlayer={handleRemovePlayer}
            />
          ))}
        </Pitch>

        <button className="save-button" type="button" onClick={handleSaveImage}>
          Zapisz jako PNG
        </button>

        {isModalOpen && (
          <PlayerListModal
            players={FIRST_TEAM}
            benchPlayers={SECOND_TEAM}
            onSelect={handlePlayerSelect}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default App;
