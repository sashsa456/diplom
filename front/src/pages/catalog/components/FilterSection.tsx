import { FilterSectionProps } from '@/types/catalog';
import { Checkbox, Space, Typography, Rate } from 'antd';

const { Title } = Typography;

export const FilterSection = ({
  title,
  options,
  filterType,
  filters,
  onFilterChange,
}: FilterSectionProps) => (
  <div className="mb-4">
    <Title level={5}>{title}</Title>
    <Space direction="vertical">
      {options.map((option) => (
        <Checkbox
          key={option.toString()}
          checked={
            filterType === 'rating'
              ? filters[filterType] === option
              : (filters[filterType] as string[]).includes(option.toString())
          }
          onChange={(e) => {
            if (filterType === 'rating') {
              onFilterChange(
                filterType,
                e.target.checked ? (option as number) : 0,
              );
            } else {
              const newValues = e.target.checked
                ? [...(filters[filterType] as string[]), option.toString()]
                : (filters[filterType] as string[]).filter(
                    (item) => item !== option.toString(),
                  );
              onFilterChange(filterType, newValues);
            }
          }}
        >
          {filterType === 'rating' ? (
            <Rate disabled defaultValue={option as number} count={5} />
          ) : (
            option
          )}
        </Checkbox>
      ))}
    </Space>
  </div>
);
