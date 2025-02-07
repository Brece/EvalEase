import {
  DocumentDuplicateIcon,
  DocumentIcon,
  InformationCircleIcon,
  PencilSquareIcon,
  PlusIcon,
  QrCodeIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import ActionsContainer from '../components/ActionsContainer';
import Button from '../components/Button';
import Category from '../components/Category';
import CreateNewElementModal from '../components/suveyBuilder/CreateNewElementModal';
import EvaluationContainer from '../components/EvaluationContainer';
import NotFound from './NotFound';
import {
  ICategorizedQuestionsObject,
  ISurveyObject,
} from '../utils/interfaces';
import Pagination from '../components/Pagination';
import QRCodeModal from '../components/QRCodeModal';
import { Modal } from '../components/Modal';
import { scrollToTop } from '../utils/helpers';
import { urls } from '../utils/urls';
import { useCopySurveyById } from '../hooks/surveys/useCopySurveyById';
import { useCreateSurvey } from '../hooks/surveys/useCreateSurvey';
import { useDeleteSurveyById } from '../hooks/surveys/useDeleteSurveyById';
import { useGetSurveyById } from '../hooks/surveys/useGetSurveyById';
import { useGetSurveys } from '../hooks/surveys/useGetSurveys';
import { usePagination } from '../hooks/usePagination';
import { useTooltips } from '../hooks/useTooltips';
import { useUpdateSurveyById } from '../hooks/surveys/useUpdateSurveyById';

const TABS = {
  Survey: 'survey',
  Custom: 'custom',
};

const ITEMS_PER_PAGE = 10;

/**
 * Evaluation details page.
 */
export default function SurveyBuilder() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const isCustomTemplate = id && id !== '0';

  const { data: survey, isLoading, error } = useGetSurveyById(id);
  const { mutate: createSurvey } = useCreateSurvey();
  const { mutate: updateSurvey } = useUpdateSurveyById();
  const { mutate: deleteSurvey } = useDeleteSurveyById();
  const { mutate: copySurvey } = useCopySurveyById();
  const { data: surveys } = useGetSurveys();
  const [activeTab, setActiveTab] = useState('survey');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveModalAction, setSaveModalAction] = useState<'create' | 'edit'>(
    'create',
  );
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showNewElementModal, setShowNewElementModal] = useState(false);
  const [filteredData, setFilteredData] = useState(survey?.questions || []);
  // prettier-ignore
  const [activeFilter, setActiveFilter] = useState<'none' | 'category'>('none');
  const [filterValue, setFilterValue] = useState<string | null>(null);
  const { TooltipModal, setTooltipIsOpen } = useTooltips();

  // Drag and drop feature
  const [surveyQuestionIds, setSurveyQuestionIds] = useState<string[]>([]);

  // Pagination
  const {
    currentPage,
    setCurrentPage,
    paginatedCategories: paginatedData,
    totalPages,
    isLastPage,
    isFirstPage,
  } = usePagination(filteredData, ITEMS_PER_PAGE);

  // Tabs configuration
  const tabsConfig = [
    { label: `${survey?.title} - Survey` || 'Survey', value: 'survey' },
    { label: 'Custom Questions', value: 'custom' },
  ];

  // Save modal actions
  const SAVE_MODAL_ACTIONS = {
    create: {
      title: 'Create Survey',
      buttonLabel: 'Create',
      action: handleCreate,
      value: 'create',
    },
    edit: {
      title: 'Edit Survey',
      buttonLabel: 'Save',
      action: handleSave,
      value: 'edit',
    },
  };

  // Actions configuration
  const actionsConfig = [
    {
      label: 'MyTemplates',
      isOpen: true,
      subActions: [
        {
          label: 'Create new survey with Default Template',
          action: () => {
            navigate(`${urls.surveyBuilder}/0`);
          },
        },
        ...(surveys?.map((item: ISurveyObject) => ({
          label: item?.title,
          action: () => {
            navigate(`${urls.surveyBuilder}/${item._id}`);
          },
        })) || []),
      ],
    },
    {
      label: 'Sections',
      isOpen: true,
      subActions: [
        {
          label: 'All',
          action: () => {
            resetFilters();
          },
        },
        ...(survey?.questions.map(
          (item: ICategorizedQuestionsObject, index: number) => {
            return {
              label: `${index + 1}. ${item.category}`,
              action: () => {
                filterCategory(item.category);
              },
            };
          },
        ) || []),
      ],
    },
    // Display different actions based on the survey id, 0 is the default survey template
    ...(id === '0'
      ? [
          {
            label: 'Create Survey',
            icon: DocumentIcon,
            color: 'primary' as 'primary',
            onClick: () => {
              setSaveModalAction('create');
              setShowSaveModal(true);
            },
          },
        ]
      : [
          {
            label: 'Generate QR-Code',
            icon: QrCodeIcon,
            color: 'primary' as 'primary',
            onClick: () => {
              setShowQRCodeModal(true);
            },
          },
          {
            label: 'Edit Title',
            icon: PencilSquareIcon,
            color: 'inactive' as 'inactive',
            onClick: () => {
              setSaveModalAction('edit');
              setShowSaveModal(true);
            },
          },
          {
            label: 'Copy Survey',
            icon: DocumentDuplicateIcon,
            color: 'ternary' as 'ternary',
            onClick: () => {
              copySurvey({ surveyId: survey?._id });
            },
          },
          {
            label: 'Delete Survey',
            icon: TrashIcon,
            color: 'secondary' as 'secondary',
            onClick: () => {
              setShowDeleteModal(true);
            },
          },
        ]),
    {
      label: 'Help',
      icon: InformationCircleIcon,
      onClick: () => {
        setTooltipIsOpen(true);
      },
    },
  ];

  // Handle save survey, redirect happens in the hook
  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setShowSaveModal(false);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const title = formData.get('title') as string;
    createSurvey({ title });
  }

  // Handle edit survey title
  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setShowSaveModal(false);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const title = formData.get('title') as string;
    const surveyData = { ...survey, title };
    delete surveyData.questions;
    updateSurvey({ data: { ...surveyData } });
  }

  // Handle delete survey, redirect happens in the hook
  const handleDelete = () => {
    setShowDeleteModal(false);
    deleteSurvey(survey?._id);
  };

  // Filter questions based on active tab
  const filterTabs = (
    data: ICategorizedQuestionsObject[],
    activeTab: string,
  ) => {
    let result = data;

    if (activeTab === TABS.Custom) {
      const personalizedQuestionsIndex = 7;

      result = data?.filter(
        (_item: ICategorizedQuestionsObject, index) =>
          index === personalizedQuestionsIndex,
      );
    }
    return result;
  };

  const resetFilters = () => {
    setActiveFilter('none');
    setFilterValue(null);
    // Reset pagination
    setCurrentPage(1);
    scrollToTop();
    setFilteredData(filterTabs(survey?.questions, activeTab));
  };

  // Filter questions based on category and active tab
  const filterCategory = (category: string) => {
    setActiveFilter('category');
    setFilterValue(category);
    // Reset pagination
    setCurrentPage(1);
    scrollToTop();

    const data: ICategorizedQuestionsObject[] =
      activeTab === TABS.Survey
        ? survey?.questions
        : filterTabs(survey?.questions, TABS.Custom);

    const filtered = data?.filter(
      (item: ICategorizedQuestionsObject) => item.category === category,
    );

    setFilteredData(filtered);
  };

  // Update filtered data when active tab changes
  useEffect(() => {
    // Redirect to default survey if no id is provided
    if (!id) {
      navigate(`${urls.surveyBuilder}/0`);
    }

    setFilteredData(filterTabs(survey?.questions, activeTab));
  }, [activeTab, survey, id]);

  // Set survey questions to track order when ID is provided
  useEffect(() => {
    if (survey) {
      setSurveyQuestionIds(survey.questionIds);
    }
  }, [survey]);

  if (error) {
    return <NotFound />;
  }

  return (
    <div className="flex flex-col sm:flex-row gap-x-8">
      {/* Left column actions section */}
      <ActionsContainer
        actions={actionsConfig}
        shouldResetFilter={activeTab === TABS.Custom}
      />

      {/* Right column content section */}
      <EvaluationContainer
        tabs={tabsConfig}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {paginatedData && paginatedData.length
          ? paginatedData.map(
              (item: ICategorizedQuestionsObject, index: number) => (
                <Category
                  key={index}
                  index={index + 1}
                  data={item}
                  survey={survey}
                  allQuestionIds={surveyQuestionIds}
                />
              ),
            )
          : null}

        {/* AddButton for new question */}
        {isCustomTemplate ? (
          <div className="flex justify-center mt-6">
            <Button
              label="NEW ELEMENT"
              color="primary"
              hasIcon={true}
              icon={PlusIcon}
              onClick={() => setShowNewElementModal(true)}
            />
          </div>
        ) : null}

        {/* New element modal */}
        <CreateNewElementModal
          isOpen={showNewElementModal}
          setIsOpen={setShowNewElementModal}
          id={id}
        />

        {/* Pagination */}
        <Pagination
          onPageChange={setCurrentPage}
          currentPage={currentPage}
          totalPages={totalPages}
          isLastPage={isLastPage}
          isFirstPage={isFirstPage}
        />
      </EvaluationContainer>

      {/* Create survey modal */}
      <Modal
        title={SAVE_MODAL_ACTIONS[saveModalAction].title}
        isOpen={showSaveModal}
        setIsOpen={setShowSaveModal}
      >
        <form
          onSubmit={SAVE_MODAL_ACTIONS[saveModalAction].action}
          className="flex flex-col gap-y-8"
        >
          <input
            name="title"
            type="text"
            placeholder="Survey Title"
            className="w-full p-2 border border-gray-300 rounded-md"
            defaultValue={survey?.title}
            required
          />
          <Button
            label={SAVE_MODAL_ACTIONS[saveModalAction].buttonLabel}
            size="medium"
            color="primary"
            width="full"
            type="submit"
          />
        </form>
      </Modal>

      {/* QR-Modal */}
      <QRCodeModal
        showModal={showQRCodeModal}
        setShowModal={setShowQRCodeModal}
        id={survey?._id}
      />

      {/* Delete survey modal */}
      <Modal
        title="Delete Survey"
        isOpen={showDeleteModal}
        setIsOpen={setShowDeleteModal}
      >
        <p>
          Are you sure you want to delete:{' '}
          <em className="font-semibold">{survey?.title}</em>
        </p>
        <Button
          label="Delete"
          size="medium"
          color="secondary"
          width="full"
          type="button"
          onClick={handleDelete}
        />
      </Modal>

      <TooltipModal />
    </div>
  );
}
