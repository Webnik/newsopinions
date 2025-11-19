'use client';

import { useState } from 'react';

interface AgentAnalysisProps {
  agentName: string;
  agentBias: string;
  agentColorClass: string;
  analysis: string;
  stance?: string;
  keyPoints?: string[];
}

export default function AgentAnalysis({
  agentName,
  agentBias,
  agentColorClass,
  analysis,
  stance,
  keyPoints = [],
}: AgentAnalysisProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`${agentColorClass} rounded-lg p-6 mb-4`}>
      {/* Agent header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center">
            <span className="text-lg font-bold">
              {agentName.charAt(0)}
            </span>
          </div>
          <div>
            <h4 className="font-headline text-lg">{agentName}</h4>
            <span className="font-sans text-xs uppercase tracking-wider opacity-70">
              {agentBias}
            </span>
          </div>
        </div>
        {stance && (
          <span className="font-sans text-sm font-medium px-3 py-1 bg-white/30 rounded-full">
            {stance}
          </span>
        )}
      </div>

      {/* Key points */}
      {keyPoints.length > 0 && (
        <div className="mb-4">
          <h5 className="font-sans text-sm font-semibold mb-2">Key Points:</h5>
          <ul className="space-y-1">
            {keyPoints.map((point, i) => (
              <li key={i} className="font-sans text-sm flex items-start gap-2">
                <span className="text-[var(--color-text)]">•</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Analysis text */}
      <div className="relative">
        <div
          className={`font-sans text-sm leading-relaxed ${
            !isExpanded ? 'line-clamp-4' : ''
          }`}
        >
          {analysis}
        </div>
        {analysis.length > 300 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="font-sans text-sm font-medium mt-2 underline hover:no-underline"
          >
            {isExpanded ? 'Show less' : 'Read full analysis'}
          </button>
        )}
      </div>
    </div>
  );
}
