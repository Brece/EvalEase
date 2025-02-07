import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import Statistics from './Statistics';
import { IResponseObject } from '../../utils/interfaces';

interface ISimpleBarChartProps {
  data: IResponseObject[];
}

/**
 * Simple bar chart.
 */
export default function SimpleBarChart({ data }: ISimpleBarChartProps) {
  const IS_MORE_THAN_FIVE = data.length > 5;
  const fontSize = IS_MORE_THAN_FIVE ? 8 : 11;
  const rotate = IS_MORE_THAN_FIVE ? -20 : -15;
  return (
    <div className="flex flex-row justify-between gap-x-4 w-full h-[250px] sm:h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={400}
          height={250}
          data={data}
          margin={{
            left: -25,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="option"
            padding={{ left: 30, right: 30 }}
            interval={0}
            tick={<CustomizedAxisTick fontSize={fontSize} rotate={rotate} />}
          />
          <YAxis tick={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Bar dataKey="count" fill="#0FA3B1" />
        </BarChart>
      </ResponsiveContainer>

      <Statistics data={data} />
    </div>
  );
}

function CustomizedAxisTick(props: any) {
  const { x, y, payload, fontSize, rotate, index } = props;
  // Alternate offsets: even indexes get dy=16, odd indexes get dy=32 -> remove rotation with transform
  // const offset = index % 2 === 0 ? 16 : 32;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16} // Offset from the x-axis
        textAnchor="end"
        fill="#666"
        transform={`rotate(${rotate})`} // Rotate the label
        fontSize={fontSize}
      >
        {payload.value}
      </text>
    </g>
  );
}
