
import React from 'react';
import { StrategicStep, PhaseStatus } from '../types';

interface PhaseCardProps {
  step: StrategicStep;
  index: number;
}

const PhaseCard: React.FC<PhaseCardProps> = ({ step, index }) => {
  const getStatusColor = (status: PhaseStatus) => {
    switch (status) {
      case PhaseStatus.COMPLETED: return 'bg-emerald-500';
      case PhaseStatus.IN_PROGRESS: return 'bg-blue-500';
      default: return 'bg-slate-300';
    }
  };

  return (
    <div className="relative pl-8 pb-12 last:pb-0">
      {/* Timeline Line */}
      <div className="absolute left-[11px] top-2 bottom-0 w-0.5 bg-slate-200"></div>
      
      {/* Timeline Dot */}
      <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-white shadow-sm ${getStatusColor(step.status)} z-10 animate-pulse`}></div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-blue-600 px-2 py-1 bg-blue-50 rounded">阶段 {index + 1}</span>
            <h3 className="text-xl font-bold text-slate-800">{step.title}</h3>
          </div>
          <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{step.duration}</span>
        </div>
        
        <div className="mb-4">
          <p className="text-sm font-semibold text-slate-700 mb-1">核心目标：</p>
          <p className="text-slate-600 leading-relaxed">{step.goal}</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-700 mb-2">关键行动：</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            {step.actions.map((action, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>
                {action}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PhaseCard;
