import {
  InformationCircleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import ActionsContainer from '../components/ActionsContainer';
import Button from '../components/Button';
import EvaluationContainer from '../components/EvaluationContainer';
import EvaluationTeaser from '../components/EvaluationTeaser';
import { IEvaluationObject } from '../utils/interfaces';
import { Modal } from '../components/Modal';
import { urls } from '../utils/urls';
import { useGetEvaluations } from '../hooks/evaluations/useGetEvaluations';
import { useTooltips } from '../hooks/useTooltips';

const TABS = {
  History: 'history',
  Favorites: 'favorites',
};

export default function Home() {
  const navigate = useNavigate();
  const { data: evaluations, isLoading, error } = useGetEvaluations();
  const [activeTab, setActiveTab] = useState(TABS.History);
  const [showModal, setShowModal] = useState(false);
  const [filteredData, setFilteredData] = useState(evaluations || []);
  const { TooltipModal, setTooltipIsOpen } = useTooltips();

  // Tabs configuration
  const tabsConfig = [
    { label: 'History', value: TABS.History },
    { label: 'Favorites', value: TABS.Favorites },
  ];

  // Actions configuration
  const actionsConfig = [
    {
      label: 'Search',
      icon: MagnifyingGlassIcon,
      color: 'primary' as 'primary',
      onClick: () => {
        setShowModal(true);
      },
    },
    {
      label: 'Sort Options',
      subActions: [
        {
          label: 'Latest',
          action: () => {
            sortByDate('desc');
          },
        },
        {
          label: 'Oldest',
          action: () => {
            sortByDate('asc');
          },
        },
        {
          label: 'A-Z',
          action: () => {
            sortAplhabetically();
          },
        },
      ],
    },
    {
      label: 'Actions',
      subActions: [
        {
          label: 'Create Survey',
          action: () => navigate(urls.surveyBuilder),
        },
      ],
    },
    {
      label: 'Help',
      icon: InformationCircleIcon,
      onClick: () => {
        setTooltipIsOpen(true);
      },
    },
  ];

  // Filter evaluations based on active tab
  const filterTabs = (data: IEvaluationObject[], activeTab: string) => {
    if (activeTab === TABS.Favorites) {
      return data.filter((item: IEvaluationObject) => item.isFavorite);
    }
    return data;
  };

  // Search evaluations based on query
  const searchEvaluations = (data: IEvaluationObject[], query: string) => {
    return data.filter((item: IEvaluationObject) =>
      item.title.toLowerCase().includes(query.toLowerCase()),
    );
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('query') as string;

    // Only display filtered data based on current tab
    setFilteredData(
      searchEvaluations(filterTabs(evaluations, activeTab), query),
    );
    setShowModal(false);
  };

  // Sort evaluations based on date
  const sortByDate = (order: 'asc' | 'desc') => {
    // fallback if evaluations is undefined
    const sortedEvaluations = [...(evaluations || [])].sort(
      (a: IEvaluationObject, b: IEvaluationObject) => {
        return order === 'asc'
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      },
    );

    setFilteredData(filterTabs(sortedEvaluations, activeTab));
  };

  // Sort evaluations alphabetically
  const sortAplhabetically = () => {
    const sortedEvaluations = [...(evaluations || [])].sort(
      (a: IEvaluationObject, b: IEvaluationObject) => {
        return a.title.localeCompare(b.title);
      },
    );

    setFilteredData(filterTabs(sortedEvaluations, activeTab));
  };

  // Update filtered data when active tab changes
  useEffect(() => {
    setFilteredData(filterTabs(evaluations, activeTab));
  }, [activeTab, evaluations]);

  return (
    <div className="flex flex-col sm:flex-row gap-x-8">
      {/* Left column actions section */}
      <ActionsContainer
        actions={actionsConfig}
        shouldResetFilter={activeTab === TABS.Favorites}
      />

      {/* Right column content section */}
      <EvaluationContainer
        tabs={tabsConfig}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {filteredData && filteredData.length > 0
          ? filteredData.map((item: IEvaluationObject, index: number) => (
              <EvaluationTeaser key={index} data={item} />
            ))
          : null}
      </EvaluationContainer>

      {/* Search modal */}
      <Modal title="Search" isOpen={showModal} setIsOpen={setShowModal}>
        <form onSubmit={handleSearch} className="flex flex-col gap-y-8">
          <input
            name="query"
            type="text"
            placeholder="Search..."
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <Button
            label="Search"
            size="medium"
            color="primary"
            width="full"
            type="submit"
          />
        </form>
      </Modal>

      {/* Tooltip modal */}
      <TooltipModal />
    </div>
  );
}
