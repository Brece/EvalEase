import { ArrowsUpDownIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useLocation } from 'react-router';
import { useState } from 'react';

import { EQuestionType, IQuestionObject } from '../../utils/interfaces';
import { urls } from '../../utils/urls';
import { useDeleteSurveyQuestionById } from '../../hooks/surveys/useDeleteSurveyQuestionById';

interface ISurveyQuestionProps {
  data: IQuestionObject;
}

export function SurveyQuestion({ data }: ISurveyQuestionProps) {
  const location = useLocation();
  const isSurveyBuilder = location.pathname.startsWith(urls.surveyBuilder);
  const { mutate: deleteSurveyQuestionById } = useDeleteSurveyQuestionById();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const personalizedQuestionCategory = 'Personalisierte Fragen'; // Hardoced index for personalized questions
  const isTextType =
    data.type === EQuestionType.Text || data.type === EQuestionType.WordCloud;

  const handleChange = (option: string) => {
    setSelectedOption(option);
  };

  const handleDelete = () => {
    deleteSurveyQuestionById({
      surveyId: data.surveyId,
      questionId: data._id,
    });
  };

  return (
    <div className="relative py-3 px-4 sm:py-5 sm:px-7 rounded-md bg-brand-14 hover:bg-white hover:opacity-100 text-brand-6">
      <h4 className="mb-4">{data.question}</h4>
      {!isTextType ? (
        <div className="flex flex-col gap-y-2">
          {data.options?.map((option, index) => (
            <label
              key={data._id + index}
              className="flex items-center cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedOption === option}
                onChange={() => handleChange(option)}
                className="w-4 h-4 mr-3"
                {...(isSurveyBuilder ? { disabled: true } : {})}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      ) : (
        <div className="w-full h-[70px] bg-brand-14"></div>
      )}

      {/* Icons */}
      <div className="absolute right-0 bottom-0 flex flex-row items-end">
        {data.category === personalizedQuestionCategory && (
          <div
            className="py-4 px-2 cursor-pointer hover:text-brand-3"
            onClick={handleDelete}
          >
            <TrashIcon className="w-[24px] h-[24px] mr-8" />
          </div>
        )}
        <div className="pt-10 pb-4 px-4 cursor-grab hover:text-brand-8">
          <ArrowsUpDownIcon className="w-[24px] h-[24px]" />
        </div>
      </div>
    </div>
  );
}
