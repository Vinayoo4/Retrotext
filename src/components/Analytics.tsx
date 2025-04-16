import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import useNoteStore from '../store/noteStore';
import { format } from 'date-fns';
import { BarChart, Activity, Clock, BookOpen } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

type RecentActivity = {
  type: string;
  timestamp: Date;
  formattedTime: string;
};

const chartColors = ['#6366f1', '#4ade80', '#facc15', '#f87171', '#38bdf8', '#f472b6'];

const SimplePieChart = ({ data }: { data: { name: string; value: number }[] }) => {
  if (data.length === 0) return <p className="text-gray-400">No data available.</p>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const Analytics = () => {
  const { analytics } = useNoteStore();
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

  const getActivityCount = (type: string) =>
    analytics.activityLog.filter(log => log.type === type).length;

  const categoryData = useMemo(() => {
    const grouped = analytics.notes.reduce((acc, note) => {
      acc[note.theme] = (acc[note.theme] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [analytics.notes]);

  const tagData = useMemo(() => {
    const grouped = analytics.notes
      .flatMap(note => note.tags || [])
      .reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [analytics.notes]);

  const recentActivities = useMemo(() => {
    return analytics.activityLog
      .slice(-5)
      .reverse()
      .map(log => ({
        ...log,
        formattedTime: format(log.timestamp, 'MMM dd, h:mm a'),
      }));
  }, [analytics.activityLog]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 shadow-lg shadow-indigo-500/20"
    >
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-6">
        Analytics
      </h2>

      {/* Category Distribution */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Category Distribution</h3>
          <button
            aria-label="Toggle view mode"
            onClick={() => setViewMode(viewMode === 'chart' ? 'table' : 'chart')}
            className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            {viewMode === 'chart' ? 'View as Table' : 'View as Chart'}
          </button>
        </div>
        {viewMode === 'chart' ? (
          <SimplePieChart data={categoryData} />
        ) : categoryData.length > 0 ? (
          <table className="w-full text-left text-gray-300">
            <thead>
              <tr>
                <th className="border-b border-gray-600 py-2">Category</th>
                <th className="border-b border-gray-600 py-2">Count</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.map((entry, index) => (
                <tr key={index}>
                  <td className="py-2">{entry.name}</td>
                  <td className="py-2">{entry.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-400">No category data available.</p>
        )}
      </div>

      {/* Tag Usage */}
      <div className="mt-6">
        <h3 className="text-lg font-bold text-white mb-4">Tag Usage</h3>
        <SimplePieChart data={tagData} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-lg">
            <BookOpen className="w-6 h-6 text-indigo-400" />
            <div>
              <p className="text-indigo-200/70">Total Notes</p>
              <p className="text-2xl font-bold text-white">{analytics.totalNotes}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-lg">
            <Activity className="w-6 h-6 text-indigo-400" />
            <div>
              <p className="text-indigo-200/70">Last Updated</p>
              <p className="text-2xl font-bold text-white">
                {analytics.lastUpdated ? format(analytics.lastUpdated, 'MMM dd, h:mm a') : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-lg">
            <BarChart className="w-6 h-6 text-indigo-400" />
            <div>
              <p className="text-indigo-200/70">Activity Summary</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['create', 'edit', 'delete', 'pin'].map(type => (
                  <div key={type}>
                    <p className="text-sm text-indigo-200/70 capitalize">{type}</p>
                    <p className="text-lg font-bold text-white">{getActivityCount(type)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6">
        <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
        <div className="space-y-2">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity: RecentActivity, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span className="text-indigo-200">{activity.formattedTime}</span>
                </div>
                <span className="text-white capitalize">{activity.type}</span>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-400">No recent activity found.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
