import React, { useEffect, useState, useMemo } from 'react';
import { useExpenseStore } from '../../../store/expenseStore'; 
import type { PreferredCurrency } from '../../../store/expenseStore'; 
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector } from 'recharts';
import type { ExpenseCategory } from '../types'; 
import { categoryColors as feCategoryColors } from '../types'; 
import { TrendingUp, PieChart as PieChartIconLucide, Loader2 } from 'lucide-react';

interface ChartData {
  name: string; 
  value: number; 
}

interface ActiveShapePropsFromRecharts {
  cx?: number; 
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  fill?: string;
  payload?: { name: string; };
  percent?: number;
  value?: number;
}
interface CustomActiveShapeProps extends ActiveShapePropsFromRecharts {
    activeCurrency: PreferredCurrency;
}

const renderActiveShape = (props: CustomActiveShapeProps) => { 
  const RADIAN = Math.PI / 180;
  const { 
    cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, 
    startAngle = 0, endAngle = 0, fill = '#8884d8', 
    payload = { name: 'Unknown' }, percent = 0, value = 0, 
    activeCurrency 
  } = props;

  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  const formattedValue = new Intl.NumberFormat(activeCurrency === 'PHP' ? 'en-PH' : 'en-US', {
    style: 'currency',
    currency: activeCurrency,
  }).format(value);

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} fontWeight="bold" className="text-sm sm:text-base">
        {payload.name}
      </text>
      <Sector
        cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius}
        startAngle={startAngle} endAngle={endAngle} fill={fill}
      />
      <Sector
        cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle}
        innerRadius={outerRadius + 6} outerRadius={outerRadius + 10} fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="var(--color-text-primary)" className="text-xs sm:text-sm">{formattedValue}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="var(--color-text-secondary)" className="text-xs">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};


const ExpenseChart: React.FC = () => {
  const { summary, fetchSummary, isLoading: isLoadingExpensesGlobal, error: globalExpenseError, preferredCurrency } = useExpenseStore();
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const [isChartLoadingLocal, setIsChartLoadingLocal] = useState(false);

  useEffect(() => {
    if (!summary && !isLoadingExpensesGlobal && !globalExpenseError) {
        setIsChartLoadingLocal(true);
        fetchSummary().finally(() => setIsChartLoadingLocal(false));
    }
  }, [summary, fetchSummary, isLoadingExpensesGlobal, globalExpenseError]);

  const onPieEnter = (_data: unknown, index: number) => { 
    setActiveIndex(index);
  };
   const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  const chartData: ChartData[] = useMemo(() => {
    if (!summary?.summary) return [];
    return summary.summary.map(item => ({
        name: item.category,
        value: item.totalAmount,
    })).filter(d => d.value > 0); 
  }, [summary]);

  if (isChartLoadingLocal && !summary) { 
    return (
        <div className="my-6 p-6 bg-card-background shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center min-h-[300px]">
            <Loader2 className="animate-spin h-12 w-12 text-primary-accent mb-4" />
            <p className="text-text-secondary">Loading chart data...</p>
        </div>
    );
  }

  if (!summary || chartData.length === 0) { 
    return (
      <div className="my-6 p-6 bg-card-background shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 text-center min-h-[300px] flex flex-col justify-center items-center">
        <PieChartIconLucide size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-3" />
        <h2 className="text-xl font-semibold mb-2 text-text-primary">Expense Breakdown</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
            {globalExpenseError ? `Could not load summary: ${globalExpenseError}` : "Log some expenses to see your spending habits here!"}
        </p>
      </div>
    );
  }

  const localeForTooltip = preferredCurrency === 'PHP' ? 'en-PH' : 'en-US';

  return (
    <div className="my-6 p-4 sm:p-6 bg-card-background shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-6 text-text-primary flex items-center">
        <TrendingUp size={24} className="mr-2 text-primary-accent" />
        Expense Breakdown
      </h2>
      <div style={{ width: '100%', height: 350 }}> 
        <ResponsiveContainer>
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={(propsFromPie: ActiveShapePropsFromRecharts) => renderActiveShape({...propsFromPie, activeCurrency: preferredCurrency})} 
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={window.innerWidth < 640 ? 60 : 90} 
              innerRadius={window.innerWidth < 640 ? 35 : 55}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={feCategoryColors[entry.name as ExpenseCategory] || feCategoryColors.Other} />
              ))}
            </Pie>
            <Tooltip
                formatter={(value: number, name: string) => {
                    const formattedValue = new Intl.NumberFormat(localeForTooltip, {
                        style: 'currency',
                        currency: preferredCurrency,
                    }).format(value);
                    return [formattedValue, name];
                }}
                wrapperClassName="rounded-md shadow-lg !bg-card-background !border-gray-300 dark:!border-gray-600 text-sm"
                contentStyle={{ backgroundColor: 'var(--color-card-background)', border: 'none', borderRadius: '0.375rem' }}
                labelStyle={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}
                itemStyle={{ color: 'var(--color-text-primary)' }}
            />
            <Legend
                iconSize={10}
                wrapperStyle={{ fontSize: '11px', paddingTop: '20px', lineHeight: '1.5' }}
                formatter={(value, entry) => ( 
                    <span style={{ color: entry.color }}>{value}</span>
                )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseChart;