import classNames from 'classnames';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { ElementType, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import Button from './Button';
import { useParams } from 'react-router';
import { useGetSurveyById } from '../hooks/surveys/useGetSurveyById';

interface ISubAction {
  label: string;
  action: () => void;
}

interface IActionConfig {
  label: string;
  icon?: ElementType;
  color?: 'primary' | 'secondary' | 'ternary' | 'active' | 'inactive';
  subActions?: ISubAction[]; // Optional dropdown actions
  isOpen?: boolean;
  setIsOpen?: (label: string) => void;
  onClick?: () => void;
  shouldResetFilter?: boolean;
}

interface IActionsContainerProps {
  actions: IActionConfig[];
  previousPage?: string;
  shouldResetFilter?: boolean;
}

/**
 * The ActionsContainer component is a reusable container for actions.
 * It displays a list of actions with optional dropdown sub-actions.
 * @param actions - An array of action configurations.
 * @param previousPage - The previous page to navigate back to.
 * @returns An actions container component.
 */
export default function ActionsContainer({
  actions,
  previousPage,
  shouldResetFilter = false,
}: IActionsContainerProps) {
  const navigate = useNavigate();
  const [activeAction, setActiveAction] = useState('');

  return (
    <div className={classNames('min-w-[320px]', { 'mt-14': !previousPage })}>
      <div className="sticky top-36">
        {previousPage && (
          <button
            className="flex items-center justify-center mb-2 py-2 pl-3 pr-4 rounded-md bg-brand-4 text-white text-sm uppercase"
            onClick={() => navigate(previousPage)}
          >
            <ChevronLeftIcon className="w-[13px] h-[13px] mr-1 stroke-2" />
            <span>Back</span>
          </button>
        )}

        <div className="flex flex-col gap-y-4">
          {actions.map((action, index) => (
            <DropdownAction
              key={index}
              isOpen={activeAction === action.label}
              // Toggle dropdown
              setIsOpen={(label) =>
                setActiveAction((prev) => (prev === label ? '' : label))
              }
              onClick={action.onClick}
              shouldResetFilter={shouldResetFilter}
              {...action}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * The DropdownAction component is a reusable dropdown action component.
 * It displays a button with an optional dropdown list of sub-actions.
 * @param label - The label of the action.
 * @param icon - The icon of the action.
 * @param subActions - An array of sub-action configurations.
 * @param isOpen - A boolean to determine if the dropdown is open.
 * @param setIsOpen - A function to set the open state of the dropdown.
 * @param onClick - A function to handle the click event of the action.
 * @param shouldResetFilter - A boolean to determine if the filter should be reset.
 * @returns A dropdown action component.
 */
function DropdownAction({
  label,
  icon: Icon = ChevronRightIcon,
  color,
  subActions = [],
  isOpen = false,
  setIsOpen = () => {},
  onClick,
  shouldResetFilter,
}: IActionConfig) {
  const { id = '' } = useParams();
  const { data: survey, isLoading, error } = useGetSurveyById(id);
  const [activeSubAction, setActiveSubAction] = useState('');
  const buttonColor = color ? color : isOpen ? 'active' : 'inactive';

  // Reset active sub-action highlighting when dropdown is closed or id changes
  useEffect(() => {
    setActiveSubAction('');
  }, [isOpen, id, survey]);

  useEffect(() => {
    if (shouldResetFilter) {
      setActiveSubAction('');
    }
  }, [shouldResetFilter]);

  return (
    <div>
      <Button
        label={label}
        hasIcon={true}
        icon={isOpen && subActions.length ? ChevronDownIcon : Icon}
        onClick={() => {
          onClick ? onClick() : setIsOpen(label);
        }}
        width="full"
        color={buttonColor}
        className={isOpen && subActions?.length ? 'rounded-b-none' : ''}
      />

      {subActions.length ? (
        <div
          className={classNames(
            'flex flex-col gap-y-2 px-4 py-2 text-sm font-semibold bg-brand-12',
            {
              'h-0 hidden': !isOpen,
              'h-auto block': isOpen,
            },
          )}
        >
          {subActions.map((subAction, index) => (
            <p
              key={index}
              className={classNames(
                'w-full py-1 cursor-pointer hover:text-brand-1',
                {
                  'text-brand-7': activeSubAction !== subAction.label,
                  'text-brand-1': activeSubAction === subAction.label,
                },
              )}
              onClick={() => {
                subAction.action();
                setActiveSubAction(subAction.label);
              }}
            >
              {subAction.label}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
