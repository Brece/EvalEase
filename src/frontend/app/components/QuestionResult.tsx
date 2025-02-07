import classNames from 'classnames';
import {
  EllipsisHorizontalCircleIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';

import FreeTextWordCloud from './charts/FreeTextWordCloud';
import LineChartWithCustomizedLabel from './charts/LineChartWithCustomizedLabel';
import PieChartWithCustomizedLabel from './charts/PieChartWithCustomizedLabel';
import SimpleBarChart from './charts/SimpleBarChart';
import SimpleFreeText from './charts/SimpleFreeText';
import { IQuestionResultObject } from '../utils/interfaces';
import { useUpdateEvaluationResultById } from '../hooks/evaluations/useUpdateEvaluationResultById';

// Display different components based on displayType
const CHART_COMPONENTS_MAP: { [key: string]: React.ComponentType<any> } = {
  scale: SimpleBarChart,
  text: SimpleFreeText,
  'word-cloud': FreeTextWordCloud,
  pie: PieChartWithCustomizedLabel,
  line: LineChartWithCustomizedLabel,
};

const ALLOWED_DISPLAY_TYPE_UPDATES = {
  scale: ['pie', 'line'],
  pie: ['scale', 'line'],
  line: ['scale', 'pie'],
  text: ['word-cloud'],
  'word-cloud': ['text'],
};

// Display different settings based on display mode for various views
export enum EQuestionMode {
  REVIEW = 'review',
  PRESENTATION = 'presentation',
  CREATE_PRESENTATION = 'create-presentation',
}

interface IQuestionResultProps {
  data: IQuestionResultObject;
  mode?: EQuestionMode; // Default is review mode
}

export default function QuestionResult({
  data,
  mode = EQuestionMode.REVIEW,
}: IQuestionResultProps) {
  const settingsRef = useRef<HTMLDivElement>(null);
  const [showSettings, setShowSettings] = useState(false);
  const { mutate: updateResult } = useUpdateEvaluationResultById(
    data.evaluationId,
  );

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleUpdateResult = (data: IQuestionResultObject) => {
    updateResult({ data });
  };

  const ChartTypeComponent = CHART_COMPONENTS_MAP[data.type];

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

  // Display different components based on display type
  return (
    <div
      className={classNames(
        'py-3 px-4 sm:py-5 sm:px-7 rounded-md bg-brand-14 hover:bg-white hover:opacity-100 text-brand-6',
        {
          'opacity-60 border border-brand-3':
            mode === EQuestionMode.CREATE_PRESENTATION && !data.show,
          'border border-brand-8':
            mode === EQuestionMode.CREATE_PRESENTATION && data.show,
        },
      )}
    >
      <h4 className="mb-4">{data.question}</h4>

      <div className="text-brand-5">
        {/* Chart component */}
        {ChartTypeComponent && <ChartTypeComponent data={data.responses} />}

        {/* Settings config */}
        {mode === EQuestionMode.REVIEW ? (
          <div
            className="relative flex items-end justify-end"
            onClick={toggleSettings}
            ref={settingsRef}
          >
            <EllipsisHorizontalCircleIcon className="w-[24px] h-[24px] hover:text-brand-8 cursor-pointer" />

            <Settings
              show={showSettings}
              configs={[
                ...ALLOWED_DISPLAY_TYPE_UPDATES[
                  data.type as keyof typeof ALLOWED_DISPLAY_TYPE_UPDATES
                ].map((type: string) => ({
                  label: `Change to ${type}`,
                  action: handleUpdateResult.bind(null, { ...data, type }),
                })),
                {
                  label: 'Favorite',
                  action: handleUpdateResult.bind(null, {
                    ...data,
                    isFavorite: !data.isFavorite,
                  }),
                },
              ]}
            />
          </div>
        ) : null}

        {mode === EQuestionMode.CREATE_PRESENTATION && (
          <div className="relative">
            <div
              className="absolute bottom-0 -right-4 px-4 py-2 cursor-pointer"
              onClick={handleUpdateResult.bind(null, {
                ...data,
                show: !data.show,
              })}
            >
              {data.show ? (
                <MinusCircleIcon className="w-[24px] h-[24px] text-brand-13" />
              ) : (
                <PlusCircleIcon className="w-[24px] h-[24px] text-brand-8" />
              )}
            </div>
          </div>
        )}

        {/* TODO: Different view based on mode */}
        {mode === EQuestionMode.PRESENTATION && <div>presentation mode</div>}
      </div>
    </div>
  );
}

interface ISettingsProps {
  show: boolean;
  configs: {
    label: string;
    action: () => void;
  }[];
}

function Settings({ show, configs }: ISettingsProps) {
  return (
    <div
      className={classNames(
        'flex flex-col gap-y-2 px-4 py-2 border border-brand-5 rounded-t-md rounded-br-md absolute -top-[100px] -right-28 bg-white text-sm text-brand-6',
        {
          hidden: !show,
        },
      )}
    >
      {configs.map((config, index) => (
        <p
          className="cursor-pointer hover:text-brand-8"
          onClick={config.action}
          key={index}
        >
          {config.label}
        </p>
      ))}
    </div>
  );
}
