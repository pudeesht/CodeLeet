import { useState, useEffect } from 'react';
import { getUserContestHistory, getContestQuestions, getReplayEvents } from './api';
import { analyzeEvents, CheatReport } from './analysis';
import FloatingButton from './components/FloatingButton';
import ContestCard from './components/ContestCard';
import detectiveLogo from '../assets/logo.png';
import SettingsView from './components/SettingsView';



function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedContest, setExpandedContest] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<Record<string, CheatReport>>({});
  const [analyzing, setAnalyzing] = useState(false);

  const [activeTab, setActiveTab] = useState<'scan'|'settings'>('scan');


  useEffect(() => {
    const checkUser = () => {
      const pathParts = window.location.pathname.split('/');
      if (pathParts[1] === 'u' && pathParts[2]) {
        setUsername(pathParts[2]);
      } else {
        setUsername(null);
        setIsOpen(false);
      }
    };
    checkUser();
    window.addEventListener('popstate', checkUser);
    return () => window.removeEventListener('popstate', checkUser);
  }, []);

  const handleScan = async () => {
    if (!username) return;
    setLoading(true);
    try {
      const contests = await getUserContestHistory(username);
      setHistory(contests);
      setExpandedContest(null);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleAnalyzeContest = async (contestSlug: string) => {
    if (expandedContest === contestSlug) {
      setExpandedContest(null);
      return;
    }
    setExpandedContest(contestSlug);
    setAnalyzing(true);
    setAnalysisResults({});

    try {
      const questions = await getContestQuestions(contestSlug);
      const results: Record<string, CheatReport> = {};
      
      await Promise.all(questions.map(async (q: any) => {
        const events = await getReplayEvents(username!, contestSlug, q.titleSlug);
        results[q.titleSlug] = analyzeEvents(events);
      }));
      setAnalysisResults(results);
    } catch (err) { console.error(err); }
    setAnalyzing(false);
  };

  if (!username) return null;

  if (!isOpen) return <FloatingButton onClick={() => setIsOpen(true)} />;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end animate-fade-in-up font-sans">
      <div className="bg-gray-900 text-white w-96 rounded-xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden max-h-[80vh]">
        
        {/* Header */}
        <div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center shrink-0">
          

          {/*logo and name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-gray-600 overflow-hidden">
              <img src={detectiveLogo} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="font-bold text-gray-100 text-sm leading-tight">CodeLeet</h2>
              <p className="text-xs text-green-400 font-mono">@{username}</p>
            </div>
          </div>



          

          <div className="flex gap-2">
             {/* Settings Toggle Button */}
             <button 
               onClick={() => setActiveTab(activeTab === 'scan' ? 'settings' : 'scan')}
               className={`p-1.5 rounded transition-colors ${activeTab === 'settings' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
               title="Settings"
             >
               {/* Gear Icon SVG */}
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
             </button>

             {/* Close Button */}
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white hover:bg-gray-700 p-1 rounded">✕</button>
           </div>



          {/*Close button*/ }
          {/* <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white hover:bg-gray-700 p-1 rounded">✕</button> */}
        
        
        
        </div>



        <div className='p-4 overflow-y-auto flex-1'>

          {activeTab=='scan'?(
            <>
              {/* Module: Contest Scanner */}
          <div className="mb-4">
             <div className="flex justify-between items-end mb-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contest History</h3>
                {history.length > 0 && <span className="text-xs text-gray-500">{history.length} found</span>}
             </div>
             <button
                onClick={handleScan} disabled={loading}
                className={`w-full py-2 rounded font-bold text-sm transition-all shadow-lg 
                  ${loading ? "bg-gray-700 text-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-500 text-white"}`}
              >
                {loading ? "Processing..." : " Scan Last 5 Contests"}
             </button>
          </div>

          {/* List of Contests */}
          <div>
             {history.map((item: any) => (
               <ContestCard 
                  key={item.contest.titleSlug}
                  contest={item.contest}
                  ranking={item.ranking}
                  isExpanded={expandedContest === item.contest.titleSlug}
                  analyzing={analyzing}
                  results={analysisResults}
                  onExpand={() => handleAnalyzeContest(item.contest.titleSlug)}
               />
             ))}
             {/* {history.length === 0 && !loading && (
               <div className="text-center text-gray-600 text-xs py-4 italic">Ready to scan.</div>
             )} */}
          </div>
            </>
            ) : (
              <SettingsView/>
          )}
          
        </div>








        {/* Footer */}
        <div className="bg-gray-800 p-2 text-center border-t border-gray-700 text-[10px] text-gray-500">
          v1.1 
        </div>
      </div>
    </div>
  );
}

export default App;