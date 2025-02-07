import { IResponseObject } from '../../utils/interfaces';

interface IStatisticsProps {
  data: IResponseObject[];
}

/**
 * Statistics component for displaying mean, median, and standard deviation.
 */
export default function Statistics({ data }: IStatisticsProps) {
  // Limit display for questions with more than 5 options
  if (data.length > 5) return null;
  if (!data || !data.length) return <p>No data available.</p>;

  // Expand the data into weighted values
  const expandedValues: number[] = data.flatMap((item, index) =>
    Array(item.count).fill(index + 1),
  );

  // Sort for median calculation
  const sortedValues = [...expandedValues].sort((a, b) => a - b);
  const totalCount = expandedValues.length;

  // Mean (weighted average)
  const mean =
    data.reduce((acc, item, index) => acc + (index + 1) * item.count, 0) /
    totalCount;

  // Median (weighted)
  const median = () => {
    if (!sortedValues.length) return 0;
    const mid = Math.floor(totalCount / 2);
    return totalCount % 2 !== 0
      ? sortedValues[mid]
      : (sortedValues[mid - 1] + sortedValues[mid]) / 2;
  };

  // Standard Deviation (weighted)
  const standardDeviation = () => {
    const meanValue = mean;
    const variance =
      data.reduce(
        (acc, item, index) => acc + item.count * (index + 1 - meanValue) ** 2,
        0,
      ) / totalCount;
    return Math.sqrt(variance);
  };

  return (
    <div className="min-w-[100px]">
      <ul>
        <li>n: {totalCount}</li>
        <li className="text-brand-3">mw: {mean.toFixed(2)}</li>
        <li>s: {standardDeviation().toFixed(2)}</li>
      </ul>
    </div>
  );
}
