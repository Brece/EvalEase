import classNames from 'classnames';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

import { scrollToTop } from '../utils/helpers';

interface IPaginationProps {
  currentPage: number;
  totalPages: number;
  isLastPage: boolean;
  isFirstPage: boolean;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  isLastPage,
  isFirstPage,
  onPageChange,
}: IPaginationProps) {
  // Create an array of page numbers
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  // Hide pagination if there is only one page
  const hidePagination = totalPages === 0 || totalPages === 1;

  const handleOnPageChange = (page: number) => {
    onPageChange(page);
    scrollToTop();
  };

  return hidePagination ? null : (
    <div className="flex items-center justify-between px-4 py-3 sm:px-6">
      {/* Navigation for mobile view without page numbers*/}
      <div className="flex flex-1 justify-between sm:hidden">
        <p
          onClick={handleOnPageChange.bind(null, currentPage - 1)}
          className={classNames(
            'relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50',
            {
              hidden: isFirstPage,
            },
          )}
        >
          Previous
        </p>

        <p
          onClick={handleOnPageChange.bind(null, currentPage + 1)}
          className={classNames(
            'relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50',
            {
              hidden: isLastPage,
            },
          )}
        >
          Next
        </p>
      </div>

      {/* Navigation for destop view */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
        <div>
          <nav
            aria-label="Pagination"
            className="isolate inline-flex -space-x-px rounded-md shadow-xs"
          >
            <p
              onClick={handleOnPageChange.bind(null, currentPage - 1)}
              className={classNames(
                'relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 cursor-pointer',
                {
                  hidden: isFirstPage,
                },
              )}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon aria-hidden="true" className="size-5" />
            </p>

            {/* Render page numbers */}
            {pages.map((page) => (
              <p
                key={`page-${page}`}
                onClick={handleOnPageChange.bind(null, page)}
                className={classNames(
                  'relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-gray-300 ring-inset hover:opacity-80 ease-in-out transition-all duration-200 focus:z-20 focus:outline-offset-0 cursor-pointer',
                  {
                    'bg-brand-7 text-white': page === currentPage, // Highlight active page
                    'bg-brand-14 text-gray-900': page !== currentPage,
                  },
                )}
              >
                {page}
              </p>
            ))}

            {/* Next page */}
            <p
              onClick={handleOnPageChange.bind(null, currentPage + 1)}
              className={classNames(
                'relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 cursor-pointer',
                {
                  hidden: isLastPage,
                },
              )}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon aria-hidden="true" className="size-5" />
            </p>
          </nav>
        </div>
      </div>
    </div>
  );
}
