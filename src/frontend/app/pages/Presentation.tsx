import { InformationCircleIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import ActionsContainer from '../components/ActionsContainer';
import Category from '../components/Category';
import EvaluationContainer from '../components/EvaluationContainer';
import NotFound from './NotFound';
import Pagination from '../components/Pagination';
import QRCodeModal from '../components/QRCodeModal';
import {
  ICategorizedQuestionResultsObject,
  IQuestionResultObject,
} from '../utils/interfaces';
import { EQuestionMode } from '../components/QuestionResult';
import { scrollToTop } from '../utils/helpers';
import { urls } from '../utils/urls';
import { useGetEvaluationById } from '../hooks/evaluations/useGetEvaluationById';
import { usePagination } from '../hooks/usePagination';
import { useTooltips } from '../hooks/useTooltips';
import { useUpdateAllEvaluationResults } from '../hooks/evaluations/useUpdateAllEvaluationResults';

const TABS = {
  Details: 'details',
  Hidden: 'hidden',
};

const ITEMS_PER_PAGE = 10;

/**
 * Evaluation details page.
 */
export default function Presentation() {
  const { id = '' } = useParams();
  const { data: evaluation, isLoading, error } = useGetEvaluationById(id);
  const { mutate: updateAllResults } = useUpdateAllEvaluationResults(id);
  const [activeTab, setActiveTab] = useState('details');
  const [showModal, setShowModal] = useState(false);
  const [filteredData, setFilteredData] = useState(evaluation?.results || []);
  // prettier-ignore
  const [activeFilter, setActiveFilter] = useState<'none' | 'category'>('none');
  const [filterValue, setFilterValue] = useState<string | null>(null);
  const { TooltipModal, setTooltipIsOpen } = useTooltips();

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
    {
      label: `${evaluation?.title} - Presentation` || 'Details',
      value: 'details',
    },
    { label: 'Hidden Results', value: 'hidden' },
  ];

  // Actions configuration
  const actionsConfig = [
    {
      label: 'EvalManager',
      subActions: [
        {
          label: 'Set all results to be visible',
          action: () => setAllResultsVisible(),
        },
      ],
    },
    {
      label: 'Sections',
      subActions: [
        {
          label: 'All',
          action: () => {
            resetFilters();
          },
        },
        ...(evaluation
          ? evaluation.results.map(
              (item: ICategorizedQuestionResultsObject, index: number) => {
                return {
                  label: `${index + 1}. ${item.category}`,
                  action: () => {
                    filterCategory(item.category);
                  },
                };
              },
            )
          : []),
        ,
      ],
    },
    {
      label: 'Generate QR-Code',
      icon: QrCodeIcon,
      color: 'primary' as 'primary',
      onClick: () => {
        setShowModal(true);
      },
    },
    {
      label: 'Help',
      icon: InformationCircleIcon,
      onClick: () => {
        setTooltipIsOpen(true);
      },
    },
  ];

  // Filter questions based on active tab
  const filterTabs = (
    data: ICategorizedQuestionResultsObject[],
    activeTab: string,
  ) => {
    let result = data;

    if (activeTab === TABS.Hidden) {
      result = data.map((item: ICategorizedQuestionResultsObject) => {
        return {
          ...item,
          questions: item.questions.filter((question) => !question.show),
        };
      });
    }
    return result;
  };

  const resetFilters = () => {
    setActiveFilter('none');
    setFilterValue(null);
    // Reset pagination
    setCurrentPage(1);
    scrollToTop();
    setFilteredData(filterTabs(evaluation?.results, activeTab));
  };

  // Filter questions based on category and active tab
  const filterCategory = (category: string) => {
    setActiveFilter('category');
    setFilterValue(category);
    // Reset pagination
    setCurrentPage(1);
    scrollToTop();

    const data: ICategorizedQuestionResultsObject[] =
      activeTab === TABS.Details
        ? evaluation?.results
        : filterTabs(evaluation?.results, TABS.Hidden);

    const filtered = data?.filter(
      (item: ICategorizedQuestionResultsObject) => item.category === category,
    );

    setFilteredData(filtered);
  };

  // Set all results to be visible
  const setAllResultsVisible = () => {
    const updatedData: ICategorizedQuestionResultsObject[] =
      evaluation?.results.map(
        (
          item: ICategorizedQuestionResultsObject,
        ): ICategorizedQuestionResultsObject => {
          return {
            ...item,
            questions: item.questions.map(
              (question: IQuestionResultObject): IQuestionResultObject => {
                return {
                  ...question,
                  show: true,
                };
              },
            ),
          };
        },
      );

    updateAllResults({ id, results: updatedData });
  };

  // Update filtered data when active tab changes
  useEffect(() => {
    if (!evaluation?.results) return;

    if (activeFilter === 'none') {
      setFilteredData(filterTabs(evaluation.results, activeTab));
    } else if (activeFilter === 'category' && filterValue) {
      filterCategory(filterValue);
    }
  }, [activeTab, evaluation]);

  if (error) {
    return <NotFound />;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-x-8">
        {/* Left column actions section */}
        <ActionsContainer
          actions={actionsConfig}
          previousPage={`${urls.evaluation}/${evaluation?._id}`}
        />

        {/* Right column content section */}
        <EvaluationContainer
          tabs={tabsConfig}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        >
          {paginatedData && paginatedData.length
            ? paginatedData.map(
                (item: ICategorizedQuestionResultsObject, index: number) => (
                  <Category
                    key={index}
                    index={index + 1}
                    data={item}
                    mode={EQuestionMode.CREATE_PRESENTATION}
                    allQuestionIds={evaluation?.questionIds || []}
                  />
                ),
              )
            : null}

          {/* Pagination */}
          <Pagination
            onPageChange={setCurrentPage}
            currentPage={currentPage}
            totalPages={totalPages}
            isLastPage={isLastPage}
            isFirstPage={isFirstPage}
          />
        </EvaluationContainer>

        <QRCodeModal
          showModal={showModal}
          setShowModal={setShowModal}
          id={evaluation?._id}
        />

        <TooltipModal />
      </div>
    </div>
  );
}
