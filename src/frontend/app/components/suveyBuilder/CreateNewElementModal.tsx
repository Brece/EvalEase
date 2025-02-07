import classNames from 'classnames';
import { useState } from 'react';

import Button from '../Button';
import { Modal } from '../Modal';
import { useCreateSurveyItem } from '../../hooks/surveys/useCreateSurveyItem';

// Tags configuration reflects the default display type for result when evaluated
const TAGS = {
  text: {
    label: 'Free Text', // label for tag button
    value: 'text', // same as key
    component: TextInput,
    displayType: 'text', // default display type
  },
  checkbox3: {
    label: 'Checkboxes - 3 options',
    value: 'checkbox3',
    component: CheckBoxInput3,
    displayType: 'scale',
    options: 3,
  },
  checkbox5: {
    label: 'Checkboxes - 5 options',
    value: 'checkbox5',
    component: CheckBoxInput5,
    displayType: 'scale',
    options: 5,
  },
};

interface ICreateNewElementModalProps {
  id: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export default function CreateNewElementModal({
  id,
  isOpen,
  setIsOpen,
}: ICreateNewElementModalProps) {
  const { mutate: createSurveyItem } = useCreateSurveyItem();
  const [tag, setTag] = useState<keyof typeof TAGS>('text');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const question = formData.get('question') as string;
    const options = formData.getAll('option') as string[];

    createSurveyItem({
      surveyId: id,
      data: {
        question,
        options,
        displayType: TAGS[tag].displayType,
      },
    });
    setIsOpen(false);
  };

  return (
    <Modal title="Add new element" isOpen={isOpen} setIsOpen={setIsOpen}>
      <form
        onSubmit={handleSubmit}
        className="sm:w-[800px] flex flex-col gap-y-8"
      >
        <div className="w-full flex gap-x-3">
          {/* Tags */}
          {Object.values(TAGS).map((item, index) => (
            <p
              key={`${item.value}-${index}`}
              className={classNames(
                'py-2 px-2 rounded-md text-white cursor-pointer',
                {
                  'bg-brand-1': tag === item.value,
                  'bg-brand-6': tag !== item.value,
                },
              )}
              onClick={() => setTag(item.value as keyof typeof TAGS)}
            >
              {item.label}
            </p>
          ))}
        </div>

        {/* Tag component */}
        <h3 className="text-2xl font-semibold text-brand-6">Preview</h3>
        {tag && TAGS[tag].component()}

        <Button
          label="Add Element"
          size="medium"
          color="primary"
          width="full"
          type="submit"
        />
      </form>
    </Modal>
  );
}

function TextInput() {
  return (
    <div className="flex flex-col gap-y-4">
      <label htmlFor="question">
        Your Custom open question for a free text field:
      </label>
      <input
        className="w-full p-2 border border-gray-300 rounded-md"
        type="text"
        name="question"
        placeholder="Type your question here..."
        required
      />
      <div className="w-full h-[100px] bg-brand-11 mb-4"></div>
    </div>
  );
}

function CheckBoxInput3() {
  return (
    <div>
      <div className="flex flex-col gap-y-2 mb-4">
        <label htmlFor="question">
          Your Custom question for a checkbox field:
        </label>
        <input
          className="w-full p-2 border border-gray-300 rounded-md"
          type="text"
          name="question"
          placeholder="Type your question here..."
          required
        />
      </div>

      <p className="mb-4">
        You can replace the default option values with your custom ones:
      </p>

      <div className="flex flex-col gap-y-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <label key={index} className="flex items-center cursor-pointer">
            <input type="checkbox" className="w-4 h-4 mr-3" disabled />
            <input
              className="w-full p-2 border border-gray-300 rounded-md"
              type="text"
              name="option"
              placeholder={`Option ${index + 1}`}
              required
              defaultValue={''} // reset values when switching between 3 and 5 options
            />
          </label>
        ))}
      </div>
    </div>
  );
}

function CheckBoxInput5() {
  const defaultValues = [
    'Trifft völlig zu',
    'Trifft eher zu',
    'Neutral',
    'Trifft eher nicht zu',
    'Trifft gar nicht zu',
  ];

  return (
    <div>
      <div className="flex flex-col gap-y-2 mb-4">
        <label htmlFor="question">
          Your Custom question for a checkbox field:
        </label>
        <input
          className="w-full p-2 border border-gray-300 rounded-md"
          type="text"
          name="question"
          placeholder="Type your question here..."
          required
        />
      </div>

      <p className="mb-4">
        You can replace the default option values with your custom ones:
      </p>

      <div className="flex flex-col gap-y-2">
        {defaultValues.map((value, index) => (
          <label key={index} className="flex items-center cursor-pointer">
            <input type="checkbox" className="w-4 h-4 mr-3" disabled />
            <input
              className="w-full p-2 border border-gray-300 rounded-md"
              type="text"
              name="option"
              placeholder={`Option ${index + 1}`}
              required
              defaultValue={value}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
