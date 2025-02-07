import classNames from 'classnames';
import { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

import Statistics from './Statistics';
import { IResponseObject } from '../../utils/interfaces';

const COLORS = [
  '#0088FE', // Blue
  '#00C49F', // Teal
  '#FFBB28', // Yellow
  '#FF8042', // Orange
  '#A28DFF', // Purple
  '#FF6384', // Red
  '#36A2EB', // Light Blue
  '#4BC0C0', // Aqua
  '#9966FF', // Violet
  '#FF9F40', // Light Orange
];

const renderCustomizedLabel = ({ percent }: { percent: number }) => {
  return `${(percent * 100).toFixed(0)}%`;
};

interface IPieChartWithCustomizedLabelProps {
  data: IResponseObject[];
}

/**
 * Pie chart with customized label.
 */
export default function PieChartWithCustomizedLabel({
  data,
}: IPieChartWithCustomizedLabelProps) {
  const [outerRadius, setOuterRadius] = useState(200);
  const IS_MORE_THAN_FIVE = data.length > 5;

  // Update radius based on screen size
  useEffect(() => {
    const updateRadius = () => {
      if (window.innerWidth < 768) {
        setOuterRadius(80); // Mobile view
      } else {
        setOuterRadius(200); // Desktop view
      }
    };

    updateRadius();
    window.addEventListener('resize', updateRadius);

    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  return (
    <div
      className={classNames('flex flex-row justify-between gap-x-4 w-full', {
        'h-[320px] sm:h-[350px]': IS_MORE_THAN_FIVE,
        'h-[180px] sm:h-[300px]': !IS_MORE_THAN_FIVE,
      })}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            dataKey="count"
            nameKey="option"
            startAngle={180}
            endAngle={0}
            data={data}
            cx="50%"
            cy="95%"
            outerRadius={outerRadius}
            fill="#8884d8"
            label={renderCustomizedLabel}
          >
            {data.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                fontSize={12}
              />
            ))}
          </Pie>
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
            itemStyle={{
              color: '#6C757D',
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <Statistics data={data} />
    </div>
  );
}
