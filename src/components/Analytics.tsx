import React from 'react';
import { motion } from 'framer-motion';
import { useNoteStore } from '../store/noteStore';
import { format } from 'date-fns';
import { BarChart, Activity, Clock, BookOpen } from 'lucide-react';

export const Analytics = () => {
  const { analytics } = useNoteStore();

  const getActivityCount = (type: string) => {
    return analytics.activityLog.filter(log => log.type === type).length;
  };

  const getRecentActivity = () => {
    return analytics.activityLog
      .slice(-5)
      .reverse()
      .map(log => ({
        ...log,
        formattedTime: format(log.timestamp, 'MMM dd, h:mm a'),
      }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 shadow-lg shadow-indigo-500/20"
    >
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-6">
        Analytics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                {format(analytics.lastUpdated, 'MMM dd, h:mm a')}
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
                <div>
                  <p className="text-sm text-indigo-200/70">Created</p>
                  <p className="text-lg font-bold text-white">{getActivityCount('create')}</p>
                </div>
                <div>
                  <p className="text-sm text-indigo-200/70">Edited</p>
                  <p className="text-lg font-bold text-white">{getActivityCount('edit')}</p>
                </div>
                <div>
                  <p className="text-sm text-indigo-200/70">Deleted</p>
                  <p className="text-lg font-bold text-white">{getActivityCount('delete')}</p>
                </div>
                <div>
                  <p className="text-sm text-indigo-200/70">Pinned</p>
                  <p className="text-lg font-bold text-white">{getActivityCount('pin')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
        <div className="space-y-2">
          {getRecentActivity().map((activity, index) => (
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
          ))}
        </div>
      </div>
    </motion.div>
  );
}; 