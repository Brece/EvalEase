import { useParams } from 'react-router';
import { useEffect, useState } from 'react';

import '../styles/SurveyStyles/survey.css';
import AnswerComponent from '../components/SurveyComponents/Answer';
import Headline from '../components/SurveyComponents/Headline';
import NavigationBack from '../components/SurveyComponents/NavigationBack';
import NavigationNext from '../components/SurveyComponents/NavigationNext';
import NotFound from './NotFound';
import SubmitButton from '../components/SurveyComponents/SubmitButton';
import ThankYouMessage from '../components/SurveyComponents/ThankYouMessage';
import {
  EQuestionType,
  ICategorizedQuestionResultsObject,
  IQuestionResultObject,
} from '../utils/interfaces';
import { useGetEvaluationById } from '../hooks/evaluations/useGetEvaluationById';

export default function EvaluationResult() {
  const { id = '' } = useParams();
  const { data: evaluation, isLoading, error } = useGetEvaluationById(id);
  const [freeTextQuestions, setFreeTextQuestions] = useState<
    IQuestionResultObject[]
  >([]);

  // Zustand für die Anzeige der Dankeschön-Nachricht
  const [thankYouVisible, setThankYouVisible] = useState(false);

  // Zustand für die aktuelle Frage und die Antworten
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Zustand für liked Fragen (antwort-id als key)
  const [likedAnswers, setLikedAnswers] = useState<{ [key: string]: boolean }>(
    {},
  );

  const currentQuestion = freeTextQuestions[currentQuestionIndex];

  // Funktion, um zur nächsten Headline zu wechseln
  const nextQuestion = () => {
    if (currentQuestionIndex < freeTextQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Funktion, um zur vorherigen Headline zu wechseln
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // TODO: submitting to Evalease is not implemented, this is just a mock
  const handleSubmit = async () => {
    // Hier können wir das Absender der Antworten umsetzen
    const likedAnswerIds = Object.keys(likedAnswers).filter(
      (id) => likedAnswers[id],
    );
    console.log('Gelikte Antworten:', likedAnswerIds);

    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/posts',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(likedAnswers), // Sende die Antworten aus dem State
        },
      );

      if (response.ok) {
        const result = await response.json(); // Antwort des Servers
        alert('Antworten erfolgreich gesendet!');
        console.log('Serverantwort:', result);
        setLikedAnswers({}); // antworten reseten
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

  const handleAnswerSelection = (antwortId: string) => {
    setLikedAnswers((prev) => ({
      ...prev,
      [antwortId]: !prev[antwortId], // Toggle den Zustand der Antwort
    }));
    console.log('----------');
    console.log('Question: ' + currentQuestion?.question);
    console.log('Liked: ' + antwortId);
    console.log('----------');
  };

  const antworten = currentQuestion?.responses?.map((antwort, index) => {
    const antwortId = `${currentQuestion?._id}-${index}`; // Kombinierte ID für jede Antwort
    return (
      <AnswerComponent
        key={index}
        antwortId={antwortId}
        antwort={antwort.toString()}
        isSelected={likedAnswers[antwortId]}
        handleAnswerSelection={handleAnswerSelection}
        //handleAnswerSelection={() => console.log(`Antwort ausgewählt: ${antwort}`)}
      />
    );
  });

  // Wenn die Umfrage Id nicht existiert oder Fehler beim Fetchen, wird eine 404-Seite angezeigt
  if (error) {
    return <NotFound />;
  }

  useEffect(() => {
    if (evaluation) {
      // Aggregate all free text questions that are visible
      const freeTextQuestions: IQuestionResultObject[] = evaluation.results
        .map((category: ICategorizedQuestionResultsObject) => {
          return category.questions.filter(
            (question) =>
              question.show &&
              (question.type === EQuestionType.Text ||
                question.type === EQuestionType.WordCloud),
          );
        })
        .flat();
      setFreeTextQuestions(freeTextQuestions);
    }
  }, [evaluation]);

  return (
    <div className="survey-container">
      {thankYouVisible ? (
        <ThankYouMessage />
      ) : (
        <>
          <Headline
            key={currentQuestion?._id}
            titel={currentQuestion?.question}
          />

          {antworten}

          {/* Navigationspfeile und Absende-Button */}
          <div className="navigation-container">
            {currentQuestionIndex !== 0 ? (
              <NavigationBack onPrev={prevQuestion} />
            ) : (
              <div></div>
            )}

            {currentQuestionIndex === freeTextQuestions.length - 1 && (
              <SubmitButton submit={handleSubmit} />
            )}

            {currentQuestionIndex !== freeTextQuestions.length - 1 && (
              <NavigationNext onNext={nextQuestion} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
