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
    { id: 4, name: 'Wdowik', number: 20 },
    { id: 5, name: 'Montoia', number: 23 },
    { id: 6, name: 'Polak', number: 2 },
    { id: 7, name: 'Vital', number: 5 },
    { id: 8, name: 'Stojinović', number: 3 },
    { id: 9, name: 'Tolis', number: 44 },
    { id: 10, name: 'Kobayashi', number: 4 },
    { id: 11, name: 'Wojtuszek', number: 15 },
    { id: 12, name: 'Conceição', number: 27 },
  ],

  midfielders: [
    { id: 13, name: 'Romanczuk', number: 6 },
    { id: 14, name: 'Kozłowski', number: 85 },
    { id: 15, name: 'Finndell', number: 14 },
    { id: 16, name: 'Klynge', number: 19 },
    { id: 17, name: 'Lozano', number: 21 },
    { id: 18, name: 'Drachal', number: 8 },
    { id: 19, name: 'Imaz', number: 11 },
    { id: 20, name: 'Szmyt', number: 7 },
    { id: 21, name: 'Ćirković', number: 32 },
    { id: 22, name: 'Agbonifo', number: 10 },
    { id: 23, name: 'Sow', number: 30 },
    { id: 24, name: 'Jóźwiak', number: 72 },
    { id: 25, name: 'Zalewski', number: 80 },
  ],

  attackers: [
    { id: 26, name: 'Prelec', number: 99 },
    { id: 27, name: 'Sylla', number: 17 },
    { id: 28, name: 'Rallis', number: 9 },
  ],
};

const ALL_STAR = [
  { id: 100, name: 'Pelmard', number: 70 },
  { id: 101, name: 'Ebosse', number: 23 },
  { id: 102, name: 'Skrzypczak', number: 72 },
  { id: 103, name: 'Moutinho', number: 44 },
  { id: 104, name: 'Nene', number: 8 },
  { id: 105, name: 'Kubicki', number: 14 },
  { id: 106, name: 'Hansen', number: 99 },
  { id: 108, name: 'Pietuszewski', number: 80 },
  { id: 109, name: 'Diaby-Fadiga', number: 9 },
  { id: 110, name: 'Pululu', number: 10 },
  { id: 111, name: 'Pozo', number: 7 },
  { id: 112, name: 'Mazurek', number: 86 },
];

const SECOND_TEAM = [
  { id: 200, name: 'Rabiczko', number: 67 },
  { id: 201, name: 'Krasiewicz', number: 61 },
  { id: 203, name: 'Pankiewicz', number: 62 },
  { id: 204, name: 'Kuczyński', number: 90 },
  { id: 205, name: 'Pakieła', number: 59 },
  { id: 206, name: 'Konanau', number: 65 },

  {
    id: 207,
    name: 'Pawelczyk',
    number: 81,
    unconfirmedNumber: true,
  },

  {
    id: 208,
    name: 'Konachowicz',
    number: 82,
    unconfirmedNumber: true,
  },

  {
    id: 209,
    name: 'Tymoszczuk',
    number: 83,
    unconfirmedNumber: true,
  },
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

      await new Promise((resolve) =>
        requestAnimationFrame(() => resolve())
      );

      await new Promise((resolve) =>
        requestAnimationFrame(() => resolve())
      );

      const pitchContainer = pitchRef.current;
      const pitchField =
        pitchContainer.querySelector('.pitch-field');

      if (!pitchField) return;

      /*
      * Docelowy rozmiar PNG.
      */
      const EXPORT_WIDTH = 902;
      const EXPORT_HEIGHT = 820;

      /*
      * Najpierw robimy normalny screenshot
      * dokładnie tak, jak wygląda aplikacja.
      */
      const fullCanvas = await html2canvas(
        pitchContainer,
        {
          backgroundColor: null,
          useCORS: true,
          allowTaint: true,

          /*
          * 2x dla lepszej jakości.
          */
          scale: 2,

          /*
          * NIE zmieniamy windowWidth/windowHeight.
          *
          * html2canvas ma użyć prawdziwego
          * rozmiaru aplikacji.
          */
          scrollX: 0,
          scrollY: 0,

          logging: false,

          onclone: (clonedDocument) => {
            /*
            * Niczego nie przeliczamy.
            * Tylko chowamy elementy UI.
            */
            clonedDocument
              .querySelectorAll(
                '.remove-button, .save-button, .modal-backdrop'
              )
              .forEach((element) => {
                element.style.display = 'none';
              });

            /*
            * Pozwalamy zawodnikom wystawać
            * poza pitch-field.
            */
            const clonedContainer =
              clonedDocument.querySelector(
                '.pitch-container'
              );

            const clonedField =
              clonedDocument.querySelector(
                '.pitch-field'
              );

            if (clonedContainer) {
              clonedContainer.style.overflow = 'visible';
            }

            if (clonedField) {
              clonedField.style.overflow = 'visible';
            }
          },
        }
      );

      /*
      * Rzeczywiste położenie boiska na ekranie.
      */
      const fieldRect =
        pitchField.getBoundingClientRect();

      const containerRect =
        pitchContainer.getBoundingClientRect();

      /*
      * html2canvas używa scale=2,
      * więc wszystkie współrzędne mnożymy przez 2.
      */
      const scale = 2;

      /*
      * Środek boiska.
      */
      const fieldCenterX =
        (fieldRect.left - containerRect.left) +
        fieldRect.width / 2;

      /*
      * Chcemy zachować cały lineup:
      *
      * - górny rząd zawodników
      * - środek
      * - obronę
      * - bramkarza
      * - logo
      *
      * Dlatego nie zaczynamy dokładnie
      * od początku pitch-field.
      */
      const cropWidth =
        EXPORT_WIDTH / 0.76;

      const cropHeight =
        EXPORT_HEIGHT / 0.76;

      /*
      * Centrujemy poziomo względem boiska.
      */
      let cropX =
        fieldCenterX - cropWidth / 2;

      /*
      * Ustawiamy pion tak, aby górny
      * rząd zawodników znalazł się
      * w górnej części obrazka.
      */
      let cropY =
        fieldRect.top -
        containerRect.top -
        fieldRect.height * 0.38;

      /*
      * Nie wychodzimy poza screenshot.
      */
      const sourceWidth =
        fullCanvas.width / scale;

      const sourceHeight =
        fullCanvas.height / scale;

      cropX = Math.max(
        0,
        Math.min(
          cropX,
          sourceWidth - cropWidth
        )
      );

      cropY = Math.max(
        0,
        Math.min(
          cropY,
          sourceHeight - cropHeight
        )
      );

      /*
      * Canvas wynikowy.
      */
      const outputCanvas =
        document.createElement('canvas');

      outputCanvas.width = 1804;
      outputCanvas.height = 1435;

      const ctx =
        outputCanvas.getContext('2d');

      if (!ctx) return;

      /*
      * Dobre wygładzanie przy zmniejszaniu.
      */
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      /*
      * Wycinamy fragment normalnego
      * screenshota i skalujemy go
      * do docelowego PNG.
      */
      ctx.drawImage(
        fullCanvas,

        cropX * scale,
        cropY * scale,
        cropWidth * scale,
        cropHeight * scale,

        0,
        0,
        EXPORT_WIDTH * scale,
        EXPORT_HEIGHT * scale
      );

      /*
      * Zapis.
      */
      const link =
        document.createElement('a');

      link.download =
        'sklad-jagiellonia.png';

      link.href =
        outputCanvas.toDataURL('image/png');

      link.click();
    } finally {
      document.body.classList.remove(
        'saving-image-mode'
      );
    }
};

  const handleSlotClick = (slotId) => {
    setCurrentSlotId(slotId);
    setIsModalOpen(true);
  };

  const handlePlayerSelect = (player) => {
    if (!currentSlotId) return;

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
    const {
      player: draggedPlayer,
      slotId: sourceSlotId,
    } = item;

    if (
      !draggedPlayer ||
      sourceSlotId === targetSlotId
    ) {
      return;
    }

    setLineup((prevLineup) => {
      const updatedLineup = { ...prevLineup };

      const targetPlayer =
        updatedLineup[targetSlotId];

      updatedLineup[targetSlotId] = draggedPlayer;

      if (targetPlayer) {
        updatedLineup[sourceSlotId] = targetPlayer;
      } else {
        delete updatedLineup[sourceSlotId];
      }

      return updatedLineup;
    });
  };

  const backend = isTouchDevice()
    ? TouchBackend
    : HTML5Backend;

  const backendOptions = isTouchDevice()
    ? {
        enableMouseEvents: true,
        delayTouchStart: 80,
      }
    : undefined;

  return (
    <DndProvider
      backend={backend}
      options={backendOptions}
    >
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

        <button
          className="save-button"
          type="button"
          onClick={handleSaveImage}
        >
          Zapisz jako PNG
        </button>

        {isModalOpen && (
          <PlayerListModal
            players={FIRST_TEAM}
            allStarPlayers={ALL_STAR}
            reservePlayers={SECOND_TEAM}
            onSelect={handlePlayerSelect}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default App;