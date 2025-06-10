import { Pagination } from 'antd';

interface CatalogPaginationProps {
  currentPage: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const CatalogPagination = ({
  currentPage,
  total,
  pageSize,
  onPageChange,
}: CatalogPaginationProps) => {
  if (total <= pageSize) {
    return null;
  }

  return (
    <div className="text-center mt-4">
      <Pagination
        current={currentPage}
        total={total}
        pageSize={pageSize}
        onChange={onPageChange}
        showSizeChanger={false}
      />
    </div>
  );
};
