import React from 'react';
import { GroundingSource } from '../types';
import { Link2 } from 'lucide-react';

interface AttributionProps {
  sources: GroundingSource[];
}

export const Attribution: React.FC<AttributionProps> = ({ sources }) => {
  if (sources.length === 0) return null;

  return (
    <div className="mt-6 pt-4 border-t border-slate-700/50">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
        <Link2 size={12} /> Sources
      </h3>
      <div className="flex flex-wrap gap-2">
        {sources.slice(0, 5).map((source, index) => (
          <a
            key={index}
            href={source.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-sky-400 hover:text-sky-300 transition-colors bg-slate-800/50 px-2 py-1 rounded-md border border-slate-700 hover:border-sky-500/30 truncate max-w-[200px]"
          >
            {source.title}
          </a>
        ))}
      </div>
    </div>
  );
};
