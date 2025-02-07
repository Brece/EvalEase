import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useLocation } from 'react-router';

import {
  ICategorizedQuestionResultsObject,
  ICategorizedQuestionsObject,
  IQuestionObject,
  IQuestionResultObject,
} from '../utils/interfaces';
import QuestionResult, { EQuestionMode } from './QuestionResult';
import { SurveyQuestion } from './suveyBuilder/SurveyQuestion';
import { urls } from '../utils/urls';
import { useUpdateSurveyById } from '../hooks/surveys/useUpdateSurveyById';

interface ICategoryProps {
  data: ICategorizedQuestionsObject | ICategorizedQuestionResultsObject;
  index: number;
  mode?: EQuestionMode;
  allQuestionIds: string[];
  survey?: any;
}

/**
 * Category component wrapper for categorized questions
 */
export default function Category({
  data,
  mode,
  allQuestionIds,
  survey,
  index,
}: ICategoryProps) {
  const location = useLocation();
  const isSurveyBuilder = location.pathname.startsWith(urls.surveyBuilder);
  const { mutate: updateSurveyById } = useUpdateSurveyById();

  if (data.questions.length === 0) {
    return null;
  }

  // Update questions order
  const updateQuestionsOrder = (newQuestions: string[]) => {
    if (!survey || !survey._id) return; // Prevent API call if no survey exists

    const surveyData = { ...survey, questionIds: newQuestions };
    delete surveyData.questions;
    updateSurveyById({ data: { ...surveyData } });
  };

  // Drag and drop functionality calculates the new order of questions
  const handleDragEnd = (result: any) => {
    if (!result.destination) return; // Dropped outside - do nothing

    const { source, destination, draggableId } = result;

    // Find the global index of the dragged question
    const originalIndex = allQuestionIds.indexOf(draggableId);
    if (originalIndex === -1) return; // Safety check

    // Calculate the number of positions it has moved
    const moveOffset = destination.index - source.index;
    if (moveOffset === 0) return; // No actual movement

    // Find the new index by shifting the same amount in the full questionIds array
    const newIndex = originalIndex + moveOffset;

    // Prevent out-of-bounds errors
    if (newIndex < 0 || newIndex >= allQuestionIds.length) return;

    // Create a new array with the question moved
    const updatedQuestionIds = [...allQuestionIds];
    const [movedItem] = updatedQuestionIds.splice(originalIndex, 1); // Remove the question
    updatedQuestionIds.splice(newIndex, 0, movedItem); // Insert at the new index

    // Update state or trigger an API call
    updateQuestionsOrder(updatedQuestionIds);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-brand-6">{data.category}</h3>
      <div className="flex flex-col gap-y-8 mt-4">
        {isSurveyBuilder ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId={'category'}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex flex-col gap-y-8 mt-4"
                >
                  {data.questions.map((question, i) => (
                    <Draggable
                      key={question._id}
                      draggableId={question._id}
                      index={i}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="cursor-grab"
                        >
                          <SurveyQuestion
                            key={question._id}
                            data={question as IQuestionObject}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <>
            {data.questions.map((question, i) => (
              <QuestionResult
                key={question._id}
                data={question as IQuestionResultObject}
                mode={mode}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
