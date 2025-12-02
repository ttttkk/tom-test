import React, { useEffect, useState, useMemo } from 'react';
import { fetchExchangeRate } from './services/geminiService';
import { ApiResponse, ExchangeData } from './types';
import { HistoricalChart } from './components/HistoricalChart';
import { Attribution } from './components/Attribution';
import { 
  ArrowRightLeft, 
  RefreshCw, 
  TrendingUp, 
  JapaneseYen, 
  DollarSign,
  Info
} from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [exchangeData, setExchangeData] = useState<ExchangeData | null>(null);
  const [sources, setSources] = useState<ApiResponse['sources']>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [amount, setAmount] = useState<string>('1000');
  const [isJpyToHkd, setIsJpyToHkd] = useState<boolean>(true);

  // Initial Data Fetch
  const loadData = async () => {
    setLoading(true);
    setError(null);
    const result = await fetchExchangeRate();
    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setExchangeData(result.data);
      setSources(result.sources);
    } else {
      setError("Could not retrieve data from Gemini.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Conversion Logic
  const currentRate = exchangeData?.currentRate || 0.052; // Default fallback for skeleton
  
  const convertedValue = useMemo(() => {
    const numAmount = parseFloat(amount.replace(/,/g, ''));
    if (isNaN(numAmount)) return '---';
    
    if (isJpyToHkd) {
      return (numAmount * currentRate).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } else {
      return (numAmount / currentRate).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }
  }, [amount, currentRate, isJpyToHkd]);

  const handleSwap = () => {
    setIsJpyToHkd(!isJpyToHkd);
  };

  const handleQuickAmount = (val: number) => {
    setAmount(val.toString());
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 selection:bg-sky-500/30">
      
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-600/10 rounded-full blur-[120px]" />
      </div>

      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 mb-4 bg-slate-800/50 rounded-2xl border border-slate-700 shadow-xl backdrop-blur-md">
           <JapaneseYen className="text-rose-400 mr-2" size={28} />
           <ArrowRightLeft className="text-slate-500 mx-1" size={16} />
           <DollarSign className="text-sky-400 ml-2" size={28} />
        </div>
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-200 via-white to-sky-200">
          YenLink
        </h1>
        <p className="text-slate-400 mt-2">Real-time JPY / HKD Converter</p>
      </header>

      <main className="w-full max-w-lg">
        {/* Main Card */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
              <RefreshCw className="animate-spin mb-3 text-sky-500" size={32} />
              <p className="text-sm font-medium animate-pulse">Fetching live rates...</p>
            </div>
          )}

          {/* Top Info Bar */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-slate-400">
                Live Market Rate
              </span>
            </div>
            <button 
              onClick={loadData}
              disabled={loading}
              className="p-2 hover:bg-slate-700/50 rounded-full transition-colors text-slate-400 hover:text-white"
              title="Refresh Rate"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* Input Section */}
          <div className="space-y-4">
            {/* FROM */}
            <div className="relative group">
              <label className="text-xs font-semibold text-slate-500 uppercase ml-1 mb-1 block">From</label>
              <div className="flex items-center bg-slate-900/80 rounded-2xl border border-slate-700 focus-within:border-sky-500/50 transition-all p-4">
                <span className="text-2xl font-bold text-slate-400 w-16">
                  {isJpyToHkd ? 'JPY' : 'HKD'}
                </span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full bg-transparent text-right text-3xl font-bold text-white focus:outline-none placeholder-slate-600"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center -my-3 relative z-10">
              <button 
                onClick={handleSwap}
                className="bg-slate-700 hover:bg-sky-600 text-white p-3 rounded-full shadow-lg border-4 border-slate-800 transition-all hover:scale-110 active:scale-95"
              >
                <ArrowRightLeft size={20} />
              </button>
            </div>

            {/* TO */}
            <div className="relative">
              <label className="text-xs font-semibold text-slate-500 uppercase ml-1 mb-1 block">To</label>
              <div className="flex items-center bg-slate-900/40 rounded-2xl border border-slate-700/50 p-4">
                <span className="text-2xl font-bold text-slate-400 w-16">
                  {isJpyToHkd ? 'HKD' : 'JPY'}
                </span>
                <div className="w-full text-right text-3xl font-bold text-emerald-400 truncate">
                  {convertedValue}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Amounts Chips */}
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {(isJpyToHkd ? [1000, 5000, 10000, 50000] : [100, 500, 1000, 5000]).map((val) => (
              <button
                key={val}
                onClick={() => handleQuickAmount(val)}
                className="px-3 py-1 bg-slate-700/50 hover:bg-slate-700 text-xs font-medium text-slate-300 rounded-lg transition-colors border border-transparent hover:border-slate-500"
              >
                {val.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Rate Info */}
          <div className="mt-8 bg-slate-900/30 rounded-xl p-4 border border-slate-700/30">
            <div className="flex justify-between items-end mb-2">
               <div>
                 <p className="text-slate-400 text-sm">Exchange Rate</p>
                 <p className="text-xl font-semibold text-white">
                   1 {isJpyToHkd ? 'JPY' : 'HKD'} = {' '}
                   <span className="text-sky-400">
                     {isJpyToHkd 
                       ? currentRate.toFixed(5) 
                       : (1 / currentRate).toFixed(5)
                     }
                   </span> {' '}
                   {isJpyToHkd ? 'HKD' : 'JPY'}
                 </p>
               </div>
               <div className="text-right">
                  {exchangeData?.lastUpdated && (
                    <p className="text-[10px] text-slate-500">
                      Updated: {exchangeData.lastUpdated}
                    </p>
                  )}
               </div>
            </div>
            
            {exchangeData?.analysis && (
              <div className="flex items-start gap-2 mt-3 pt-3 border-t border-slate-700/30">
                <TrendingUp size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-xs text-slate-300 leading-relaxed">
                  {exchangeData.analysis}
                </p>
              </div>
            )}
          </div>

          {/* Historical Chart */}
          {exchangeData?.history && (
            <HistoricalChart 
              data={exchangeData.history} 
              currentRate={exchangeData.currentRate} 
            />
          )}

          {/* Sources */}
          <Attribution sources={sources} />

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-900/50 rounded-lg flex items-center gap-2 text-red-200 text-sm">
              <Info size={16} />
              <span>{error}</span>
            </div>
          )}

        </div>
      </main>

      <footer className="mt-8 text-center text-slate-600 text-xs">
        <p>Data provided by Gemini AI & Google Search.</p>
        <p>Not financial advice. Check with your bank for exact rates.</p>
      </footer>
    </div>
  );
};

export default App;
