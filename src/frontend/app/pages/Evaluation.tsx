import {
  DocumentIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import ActionsContainer from '../components/ActionsContainer';
import Category from '../components/Category';
import EvaluationContainer from '../components/EvaluationContainer';
import NotFound from './NotFound';
import Pagination from '../components/Pagination';
import QRCodeModal from '../components/QRCodeModal';
import { EQuestionMode } from '../components/QuestionResult';
import {
  EQuestionType,
  ICategorizedQuestionResultsObject,
} from '../utils/interfaces';
import { scrollToTop } from '../utils/helpers';
import { urls } from '../utils/urls';
import { useGetEvaluationById } from '../hooks/evaluations/useGetEvaluationById';
import { usePagination } from '../hooks/usePagination';
import { useTooltips } from '../hooks/useTooltips';
const TABS = {
  Results: 'results',
  Highlights: 'highlights',
};

const FILTER_OPTIONS = {
  all: {
    label: 'All',
    value: 'all',
  },
  text: {
    label: 'Free Text',
    value: EQuestionType.Text,
  },
  wordCloud: {
    label: 'Word Cloud',
    value: EQuestionType.WordCloud,
  },
  scale: {
    label: 'Scale Chart',
    value: EQuestionType.Scale,
  },
  pie: {
    label: 'Pie Chart',
    value: EQuestionType.Pie,
  },
  line: {
    label: 'Line Chart',
    value: EQuestionType.Line,
  },
};

const ITEMS_PER_PAGE = 10;

/**
 * Evaluation details page.
 */
export default function Evaluation() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: evaluation, isLoading, error } = useGetEvaluationById(id);
  const [activeTab, setActiveTab] = useState(TABS.Results);
  const [showModal, setShowModal] = useState(false);
  const [filteredData, setFilteredData] = useState(evaluation?.results || []);
  // prettier-ignore
  const [activeFilter, setActiveFilter] = useState<'none' | 'category' | 'type'>('none');
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
    { label: evaluation?.title || 'Results', value: TABS.Results },
    { label: 'MyHighlights', value: TABS.Highlights },
  ];

  // Actions configuration
  const actionsConfig = [
    {
      label: 'Filter Options',
      subActions: Object.values(FILTER_OPTIONS).map((option) => {
        return {
          label: option.label,
          action: () => {
            filterType(option.value);
          },
        };
      }),
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
        ...(evaluation?.results.map(
          (item: ICategorizedQuestionResultsObject, index: number) => {
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
    {
      label: 'EvalManager',
      subActions: [
        {
          label: 'Generate QR-Code',
          action: () => {
            setShowModal(true);
          },
        },
      ],
    },
    {
      label: 'Create Presentation',
      icon: DocumentIcon,
      color: 'primary' as 'primary',
      onClick: () => {
        navigate(`${urls.presentation}/${evaluation._id}`);
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

  const resetFilters = () => {
    setActiveFilter('none');
    setFilterValue(null);
    // Reset pagination
    setCurrentPage(1);
    scrollToTop();
    setFilteredData(filterTabs(evaluation?.results, activeTab));
  };

  // Filter questions based on active tab
  const filterTabs = (
    data: ICategorizedQuestionResultsObject[],
    activeTab: string,
  ) => {
    let result = data;

    if (activeTab === TABS.Highlights) {
      const personalizedQuestionsIndex = 7;
      result = data?.map((item: ICategorizedQuestionResultsObject, index) => {
        return index === personalizedQuestionsIndex
          ? item
          : {
              ...item,
              questions: item.questions.filter(
                (question) => question.isFavorite,
              ),
            };
      });
    }
    clearFilters();
    return result;
  };

  // Filter questions based on type and active tab
  const filterType = (type: string) => {
    setActiveFilter('type');
    setFilterValue(type);
    // Reset pagination
    setCurrentPage(1);
    scrollToTop();

    const data: ICategorizedQuestionResultsObject[] =
      activeTab === TABS.Results
        ? evaluation?.results
        : filterTabs(evaluation?.results, TABS.Highlights);

    if (type === 'all') {
      setFilteredData(data);
      clearFilters();
      return;
    }

    const filtered = data?.map((item: ICategorizedQuestionResultsObject) => {
      return {
        ...item,
        questions: item.questions.filter((question) => question.type === type),
      };
    });

    setFilteredData(filtered);
  };

  // Filter questions based on category and active tab
  const filterCategory = (category: string) => {
    setActiveFilter('category');
    setFilterValue(category);
    // Reset pagination
    setCurrentPage(1);
    scrollToTop();

    const data: ICategorizedQuestionResultsObject[] =
      activeTab === TABS.Results
        ? evaluation?.results
        : filterTabs(evaluation?.results, TABS.Highlights);

    const filtered = data?.filter(
      (item: ICategorizedQuestionResultsObject) => item.category === category,
    );

    setFilteredData(filtered);
  };

  const clearFilters = () => {
    setActiveFilter('none');
    setFilterValue(null);
  };

  // Update filtered data when active tab changes
  useEffect(() => {
    if (!evaluation?.results) return;

    if (activeFilter === 'none') {
      setFilteredData(filterTabs(evaluation.results, activeTab));
    } else if (activeFilter === 'category' && filterValue) {
      filterCategory(filterValue);
    } else if (activeFilter === 'type' && filterValue) {
      filterType(filterValue);
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
          previousPage={urls.home}
          shouldResetFilter={activeTab === TABS.Results}
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
                    mode={EQuestionMode.REVIEW}
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
