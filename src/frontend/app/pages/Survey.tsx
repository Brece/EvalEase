import { useParams } from 'react-router';
import { useEffect, useState } from 'react';

import '../styles/SurveyStyles/survey.css';
import Headline from '../components/SurveyComponents/Headline';
import NavigationBack from '../components/SurveyComponents/NavigationBack';
import NavigationNext from '../components/SurveyComponents/NavigationNext';
import NotFound from './NotFound';
import ProgressBar from '../components/SurveyComponents/ProgressBar';
import Question from '../components/SurveyComponents/Question';
import SubmitButton from '../components/SurveyComponents/SubmitButton';
import ThankYouMessage from '../components/SurveyComponents/ThankYouMessage';
import { ICategorizedQuestionsObject } from '../utils/interfaces';
import { scrollToTop } from '../utils/helpers';
import { useGetSurveyById } from '../hooks/surveys/useGetSurveyById';

export default function Survey() {
  const { id = '' } = useParams();
  const { data: survey, isLoading, error } = useGetSurveyById(id);
  const [categorizedQuestions, setCategorizedQuestions] = useState<
    ICategorizedQuestionsObject[]
  >([]);

  // Zustand für die Anzeige der Dankeschön-Nachricht
  const [thankYouVisible, setThankYouVisible] = useState(false);

  // Zustand für aktuelle Headline
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  // Zustand für beantwortene Fragen
  const [answers, setAnswers] = useState<{ [key: string]: string | number }>(
    {},
  );

  // Fortschritt berechnen
  const totalQuestionsLength = categorizedQuestions
    .map((category) => category.questions.length)
    .reduce((acc, val) => acc + val, 0);
  const answeredQuestions = Object.keys(answers).length;
  const progress =
    totalQuestionsLength > 0
      ? Math.round((answeredQuestions / totalQuestionsLength) * 100)
      : 0;

  // Funktion, um zur nächsten Headline zu wechseln
  const nextHeadline = () => {
    if (currentCategoryIndex < categorizedQuestions.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
    }
    // Scrollt nach oben
    scrollToTop();
  };

  // Funktion, um zur vorherigen Headline zu wechseln
  const prevHeadline = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1);
    }
    // Scrollt nach oben
    scrollToTop();
  };

  const handleAnswerSelection = (frageId: string, answer: string | number) => {
    setAnswers({ ...answers, [frageId]: answer });
    console.log('----------');
    console.log('Question ID: ' + frageId);
    console.log('Selected answer: ' + answer);
    console.log('----------');
  };

  // TODO: sumbmitting form to EvalEase is not implemented, this is just a mock
  const handleSubmit = async () => {
    // Hier können wir das Absender der Antworten umsetzen
    //console.log("Gesendete Antworten:", answers);
    //alert("Survey abgeschlossen!");
    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/posts',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(answers), // Sende die Antworten aus dem State
        },
      );

      if (response.ok) {
        const result = await response.json(); // Antwort des Servers
        alert('Antworten erfolgreich gesendet!');
        console.log('Serverantwort:', result);
        setAnswers({}); // antworten reseten
        setThankYouVisible(true);
      } else {
        alert('Fehler beim Senden der Antworten.');
        console.error('Serverfehler:', response.statusText);
      }
    } catch (error) {
      console.error('Netzwerkfehler:', error);
      alert('Es gab ein Problem beim Senden der Antworten.');
    }
  };

  const fragen = categorizedQuestions[currentCategoryIndex]?.questions?.map(
    (question) => {
      return (
        <Question
          key={question._id}
          text={question.question}
          type={question.type}
          options={question.options}
          selectedAnswer={answers[question._id]}
          handleAnswerSelection={(answer) =>
            handleAnswerSelection(question._id, answer)
          }
        />
      );
    },
  );

  // Wenn die Umfrage Id nicht existiert oder Fehler beim Fetchen, wird eine 404-Seite angezeigt
  if (error) {
    return <NotFound />;
  }

  useEffect(() => {
    if (survey) {
      setCategorizedQuestions(survey.questions);
    }
  }, [survey]);

  return (
    <div className="survey-container">
      {thankYouVisible ? (
        <>
          <ThankYouMessage />
        </>
      ) : (
        <>
          <div className="sticky top-0 z-10 pt-4 bg-white ">
            <ProgressBar progress={progress} />
            <Headline
              key={categorizedQuestions[currentCategoryIndex]?.category}
              titel={categorizedQuestions[currentCategoryIndex]?.category}
            />
          </div>

          {fragen}

          {/* Navigationspfeile und Absende-Button */}
          <div className="navigation-container">
            {currentCategoryIndex !== 0 ? (
              <NavigationBack onPrev={prevHeadline} />
            ) : (
              <div></div>
            )}

            {currentCategoryIndex === categorizedQuestions.length - 1 && (
              <SubmitButton submit={handleSubmit} />
            )}

            {currentCategoryIndex !== categorizedQuestions.length - 1 && (
              <NavigationNext onNext={nextHeadline} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
