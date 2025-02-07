import classNames from 'classnames';
import { useNavigate } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import {
  DocumentArrowDownIcon,
  EllipsisHorizontalCircleIcon,
} from '@heroicons/react/24/outline';

import { IEvaluationObject } from '../utils/interfaces';
import { urls } from '../utils/urls';
import { useDeleteEvaluationById } from '../hooks/evaluations/useDeleteEvaluationById';
import { useUpdateFavorite } from '../hooks/evaluations/useUpdateFavorite';

interface IEvaluationTeaserProps {
  data: IEvaluationObject;
}

/**
 * EvaluationTeaser is a component that displays a teaser of an evaluation.
 * @param data - The evaluation object.
 * @returns An evaluation teaser component.
 */
export default function EvaluationTeaser({ data }: IEvaluationTeaserProps) {
  const navigate = useNavigate();
  const settingsRef = useRef<HTMLDivElement>(null);
  const [showSettings, setShowSettings] = useState(false);
  const { mutate: toggleFavorite } = useUpdateFavorite();
  const { mutate: deleteEvaluation } = useDeleteEvaluationById();

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };
  const handleUpdateFavorite = () => {
    toggleFavorite({ _id: data._id, isFavorite: !data.isFavorite });
  };
  const handleDeleteEvaluation = () => {
    deleteEvaluation(data._id);
  };

  // Close settings modal when clicked outside anywhere on the document
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setShowSettings(false);
      }
    };

    if (showSettings) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showSettings]);

  return (
    <div className="flex justify-between py-5 px-7 rounded-md bg-brand-14 hover:bg-brand-2">
      <div
        className="grow cursor-pointer"
        onClick={() => navigate(`${urls.evaluation}/${data._id}`)}
      >
        <p>
          {data.title} {data.isFavorite ? '⭐️' : ''}
        </p>
      </div>
      <div className="flex justify-between text-brand-5">
        <div
          className="relative mr-8 cursor-pointer"
          onClick={toggleSettings}
          ref={settingsRef}
        >
          <EllipsisHorizontalCircleIcon className="w-[24px] h-[24px] hover:text-brand-8" />

          <div
            className={classNames(
              'flex flex-col gap-y-2 px-4 py-2 border border-brand-5 rounded-t-md rounded-br-md absolute -top-[90px] left-6 bg-white text-sm text-brand-6',
              {
                hidden: !showSettings,
              },
            )}
          >
            <p
              className="hover:text-brand-8"
              onClick={() => navigate(`${urls.evaluation}/${data._id}`)}
            >
              Edit
            </p>
            <p className="hover:text-brand-8" onClick={handleUpdateFavorite}>
              Favorite
            </p>
            <p className="hover:text-brand-8" onClick={handleDeleteEvaluation}>
              Delete
            </p>
          </div>
        </div>
        <div
          className="cursor-pointer hover:text-brand-8"
          onClick={() => console.log('download')}
        >
          <DocumentArrowDownIcon className="w-[24px] h-[24px]" />
        </div>
      </div>
    </div>
  );
}
