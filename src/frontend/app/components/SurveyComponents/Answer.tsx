import { useState } from 'react';

import '../../styles/SurveyStyles/answer.css';
import HeartDefault from '../../assets/images/HeartDefault.svg';
import HeartSelected from '../../assets/images/HeartSelected.svg';

type AnswerProps = {
  antwortId: string;
  antwort: string;
  isSelected: boolean;
  handleAnswerSelection: (id: string) => void;
};

export default function Answer({
  antwortId,
  antwort,
  isSelected,
  handleAnswerSelection,
}: AnswerProps) {
  const [isHovered, setIsHovered] = useState(false); // Zustand für Hover

  const handleMouseEnter = () => setIsHovered(true); // Hover starten
  const handleMouseLeave = () => setIsHovered(false); // Hover beenden

  /*
  const [isSelected, setIsSelected] = useState(false); // Zustand für das Herz

  const handleHeartClick = () => {
    setIsSelected((prev) => !prev);
  };
  */

  return (
    <div className="answer-container">
      <h1 className="answer-text">{antwort}</h1>
      <hr className="hr-line"></hr>
      <button
        type="button"
        className="heart-button"
        onClick={() => handleAnswerSelection(antwortId)}
        onMouseEnter={handleMouseEnter} // Hover starten
        onMouseLeave={handleMouseLeave} // Hover beenden
      >
        <img
          src={isHovered || isSelected ? HeartSelected : HeartDefault}
          alt={isHovered || isSelected ? 'Selected Heart' : 'Default Heart'}
        />
      </button>
    </div>
  );
}
