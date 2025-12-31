import { CheatReport } from '../analysis';

interface Props {
  contest: any;
  ranking: number;
  isExpanded: boolean;
  analyzing: boolean;
  results: Record<string, CheatReport>;
  onExpand: () => void;
}

export default function ContestCard({ contest, ranking, isExpanded, analyzing, results, onExpand }: Props) {
  const pageNum = Math.ceil(ranking / 25);
  const replayUrl = `https://leetcode.com/contest/${contest.titleSlug}/ranking/${pageNum}/?region=global_v2`;

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-sm transition-all hover:border-gray-500 mb-3 last:mb-0">
      
      {/* Header Row */}
      <div className="p-3 flex justify-between items-center">
        <div 
          className="cursor-pointer hover:text-green-400 transition-colors flex-1 pr-2"
          onClick={onExpand}
        >
          <span className="font-bold text-sm text-gray-200 block truncate">{contest.title}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs bg-black/30 px-2 py-1 rounded text-gray-400 font-mono">#{ranking}</span>
          <a 
            href={replayUrl} target="_blank" rel="noreferrer"
            className="text-xs bg-blue-600 hover:bg-blue-500 text-white h-6 w-6 flex items-center justify-center rounded transition-colors"
            title="Watch Replay"
            onClick={(e) => e.stopPropagation()} 
          >📺</a>
        </div>
      </div>

      {/* Expanded Analysis Area */}
      {isExpanded && (
        <div className="bg-black/50 p-3 border-t border-gray-700 animate-fade-in">
           {analyzing ? (
              <div className="text-center text-xs text-gray-400 py-2 flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span> Analyzing Keystrokes...
              </div>
           ) : (
              Object.keys(results).length > 0 ? (
                Object.entries(results).map(([qTitle, report]) => (
                  <div key={qTitle} className="mb-3 last:mb-0">
                      <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-gray-300 w-2/3 truncate" title={qTitle}>{qTitle}</span>
                          <span className={`${report.color} bg-gray-900 px-1.5 py-0.5 rounded border border-gray-700 whitespace-nowrap`}>
                            {report.label}
                          </span>
                      </div>
                      
                      {report.details.length > 0 && (
                        <div className="mt-1 pl-2 border-l-2 border-gray-700 ml-1">
                           {report.details.map((d, i) => (
                             <div key={i} className="text-[10px] text-gray-400 leading-relaxed">• {d}</div>
                           ))}
                        </div>
                      )}
                  </div>
                ))
              ) : (
                <div className="text-center text-xs text-gray-500">No submission data found.</div>
              )
           )}
        </div>
      )}
    </div>
  );
}