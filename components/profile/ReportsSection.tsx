import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { toast } from 'sonner';

// Define the structure for a single day's report data
interface DailyReportData {
  date: string;
  registered: number;
  completed: number;
  due: number;
}

// Helper function to calculate percentage change
const calculatePercentageChange = (current: number, previous: number): string => {
  if (previous === 0) {
    return current > 0 ? 'New data' : 'No change'; // Handle division by zero
  }
  const change = ((current - previous) / previous) * 100;
  return change.toFixed(1); // Format to one decimal place
};

// Main App component to display the daily task report
const ReportsSection: React.FC = () => {
  const [dailyReport, setDailyReport] = useState<DailyReportData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State to hold the percentage changes for the latest day
  const [latestChanges, setLatestChanges] = useState<{
    registered: string;
    completed: string;
    due: string;
  } | null>(null);

  useEffect(() => {
    const fetchDailyReport = async () => {
      try {
        setLoading(true);
        // Construct a full URL using window.location.origin to avoid URL parsing errors
        const apiUrl = `${window.location.origin}/api/report/summary`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && Array.isArray(data.dailyReport)) {
          setDailyReport(data.dailyReport);

          // Calculate percentage changes for the latest day
          if (data.dailyReport.length >= 2) {
            const latestDay = data.dailyReport[data.dailyReport.length - 1];
            const dayBeforeLatest = data.dailyReport[data.dailyReport.length - 2];

            setLatestChanges({
              registered: calculatePercentageChange(latestDay.registered, dayBeforeLatest.registered),
              completed: calculatePercentageChange(latestDay.completed, dayBeforeLatest.completed),
              due: calculatePercentageChange(latestDay.due, dayBeforeLatest.due),
            });
          } else {
            setLatestChanges(null); // Not enough data for comparison
          }

        } else {
          throw new Error("Invalid data format received from API.");
        }
      } catch (err) {
        const e = err as Error
        setError(e.message || "Failed to fetch daily report data.");
        console.error("Error fetching daily report:", e);
        toast.error('Error Fetching Report ')
      } finally {
        setLoading(false);
      }
    };

    fetchDailyReport();
  }, []); // Empty dependency array means this effect runs once after the initial render

  const renderChart = (dataKey: keyof DailyReportData, strokeColor: string, name: string) => (
    <div className="w-full h-80 md:h-96 mb-8 bg-gray-50  rounded-lg py-4 shadow-inner">
      <h2 className="text-xl font-semibold text-cyan-900  mb-4 text-center">{name} Trend</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={dailyReport}
          margin={{ top: 5, right: 10, left: -35, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" className="stroke-cyan-600" />
          <XAxis dataKey="date" className="text-sm text-gray-700 " />
          <YAxis className="text-sm text-gray-700 " />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
            labelStyle={{ fontWeight: 'bold', color: '#333' }} 
            itemStyle={{ color: '#555' }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px', color: '#555' }} />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={strokeColor}
            activeDot={{ r: 8 }}
            strokeWidth={2}
            name={name}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const getChangeClassName = (change: string | null) => {
    if (!change || change === 'No change' || change === 'New data') return 'text-gray-600 dark:text-gray-400';
    const value = parseFloat(change);
    if (isNaN(value)) return 'text-gray-600 dark:text-gray-400';
    if (value > 0) return 'text-green-600 dark:text-green-400';
    if (value < 0) return 'text-amber-600 dark:text-amber-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const formatChangeText = (change: string | null, metricName: string) => {
    if (!change) return '';
    if (change === 'No change') return `No change in ${metricName} today.`;
    if (change === 'New data') return `New ${metricName} data today.`;

    const value = parseFloat(change);
    if (isNaN(value)) return '';

    if (value > 0) {
      return `${value}% improved in ${metricName} today.`;
    } else if (value < 0) {
      return `${Math.abs(value)}% worsened in ${metricName} today.`;
    } else {
      return `No change in ${metricName} today.`;
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100  text-gray-900 ">
        <div className="text-xl font-semibold">Loading daily report...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50  text-red-800 p-4 rounded-lg shadow-md m-4">
        <div className="text-xl font-semibold">Error: {error}</div>
      </div>
    );
  }

  if (dailyReport.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100  text-gray-900 ">
        <div className="text-xl font-semibold">No daily report data available for this month.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  w-full mb-15  flex flex-col items-center font-inter">
      <div className="w-full  bg-white max-w-[1200px] mx-auto  p-6 mb-8">
        <h1 className="text-3xl font-bold text-cyan-900 mb-6 text-center">
          Monthly Task Activity Report
        </h1>

        {latestChanges && (
          <div className="mb-8 p-4 bg-cyan-900  rounded-lg text-center shadow-2xl shadow-cyan-900">
            <h2 className="text-2xl font-bold text-gray-50 mb-3">Today&apos;s Performance Summary</h2>
            <p className={`text-lg ${getChangeClassName(latestChanges.registered)}`}>
              {formatChangeText(latestChanges.registered, 'Registered Tasks')}
            </p>
            <p className={`text-lg ${getChangeClassName(latestChanges.completed)}`}>
              {formatChangeText(latestChanges.completed, 'Completed Tasks')}
            </p>
            <p className={`text-lg ${getChangeClassName(latestChanges.due)}`}>
              {formatChangeText(latestChanges.due, 'Due Tasks')}
            </p>
            {dailyReport.length < 2 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                (Comparison available after at least two days of data)
              </p>
            )}
          </div>
        )}

        {renderChart('registered', '#8884d8', 'Registered Tasks')}
        {renderChart('completed', '#82ca9d', 'Completed Tasks')}
        {renderChart('due', '#ffc658', 'Due Tasks')}
      </div>
    </div>
  );
};

export default ReportsSection;
