import { useState } from 'react';

export const usePagination = (itemsPerPage: number = 16) => {
  const [currentPage, setCurrentPage] = useState(1);

  const getPaginatedItems = <T>(items: T[]): T[] => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  const getTotalPages = (totalItems: number): number => {
    return Math.ceil(totalItems / itemsPerPage);
  };

  const nextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return {
    currentPage,
    setCurrentPage,
    getPaginatedItems,
    getTotalPages,
    nextPage,
    prevPage,
  };
};
