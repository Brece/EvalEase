import React from 'react';

import '../../styles/SurveyStyles/question.css';
import { EQuestionType } from '../../utils/interfaces';

type QuestionProps = {
  text: string; // Fragetext
  type: string; // Fragetyp
  options: string[] | undefined; // Antwortmöglichkeiten
  selectedAnswer: string | number;
  handleAnswerSelection: (answer: string | number) => void;
};

/**
 * Komponente für die Anzeige einer Frage: Text und Radiobuttons werden zurzeit genutzt
 */
export default function Question({
  text,
  type,
  options,
  selectedAnswer,
  handleAnswerSelection,
}: QuestionProps) {
  const handleInputResize = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    // Setze die Höhe auf 'auto', damit sie schrumpfen kann
    textarea.style.height = 'auto';
    // Setze die Höhe auf die tatsächliche Höhe des Inhalts
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <div className="question-container">
      <h1 className="question-text">{text}</h1>
      {type !== EQuestionType.Text && (
        <p className="select-one-text">Select one</p>
      )}
      <hr className="hr-line"></hr>

      {/* Bedingte Anzeige basierend auf dem Typ und prüft ob options nicht leer ist*/}
      {type === 'rating' && options ? (
        <div className="options-container-rating">
          {options.map((option, index) => (
            <button
              key={index}
              type="button"
              className={`option-button ${selectedAnswer === option ? 'selected' : ''}`}
              onClick={() => handleAnswerSelection(option)}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}

      {type === EQuestionType.Text ? (
        <textarea
          placeholder="Ihre Antwort"
          className="text-input"
          value={selectedAnswer as string}
          onInput={handleInputResize} // Passt die Größe des Textareas an, wenn der Benutzer schreibt
          onChange={(e) => handleAnswerSelection(e.target.value)}
        />
      ) : null}

      {(type === EQuestionType.Scale || type === EQuestionType.Pie) &&
      options ? (
        <div className="options-container">
          {options.map((option, index) => (
            <label key={index} className="option-label cursor-pointer">
              <input
                type="radio"
                value={option}
                className="option-input"
                checked={selectedAnswer === option}
                onChange={() => handleAnswerSelection(option)}
              />
              {option}
            </label>
          ))}
        </div>
      ) : null}

      {type === 'yes-no' && options ? (
        <div className="options-container-yes-no">
          {options.map((option, index) => (
            <button
              key={index}
              type="button"
              className={`option-button ${selectedAnswer === option ? 'selected' : ''}`}
              onClick={() => handleAnswerSelection(option)}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
