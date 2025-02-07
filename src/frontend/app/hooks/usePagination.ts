import { useState, useMemo } from 'react';

import {
  ICategorizedQuestionResultsObject,
  ICategorizedQuestionsObject,
} from '../utils/interfaces';

/**
 * Hook to handle pagination for a list of categorized questions.
 * @param data List of categorized questions.
 * @param itemsPerPage Number of items per page.
 * @returns Pagination state.
 */
export function usePagination(
  data: ICategorizedQuestionsObject[] | ICategorizedQuestionResultsObject[],
  itemsPerPage: number,
) {
  const [currentPage, setCurrentPage] = useState(1);

  // Flatten all questions while keeping category information
  const flattenedData = useMemo(() => {
    if (data) {
      return data?.reduce((acc, category) => {
        const questionsWithCategory = category.questions.map((question) => ({
          ...question,
          category: category.category,
        }));
        return [...acc, ...questionsWithCategory];
      }, [] as any[]);
    }
  }, [data]);

  const totalItems = flattenedData?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Slice the data for the current page
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return flattenedData?.slice(startIndex, endIndex);
  }, [currentPage, flattenedData, itemsPerPage]);

  // Group paginated data back into categories
  const paginatedCategories = useMemo(() => {
    if (data && paginatedData) {
      return data
        .map((category) => {
          const filteredQuestions = paginatedData.filter(
            (question) => question.category === category.category,
          );
          return { ...category, questions: filteredQuestions };
        })
        .filter((category) => category.questions.length > 0);
    }
  }, [data, paginatedData]);

  return {
    currentPage,
    setCurrentPage,
    paginatedCategories,
    totalPages,
    isLastPage: currentPage === totalPages,
    isFirstPage: currentPage === 1,
  };
}
