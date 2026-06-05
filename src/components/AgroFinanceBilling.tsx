import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  HelpCircle,
  Activity,
  Sliders,
  Sparkles,
  RefreshCw,
  Plus,
  Compass
} from 'lucide-react';

interface AgroFinanceBillingProps {
  onAddLog: (level: 'info' | 'success' | 'warn' | 'error', message: string) => void;
}

export default function AgroFinanceBilling({ onAddLog }: AgroFinanceBillingProps) {
  // Simulator inputs
  const [revenueSim, setRevenueSim] = useState(450000);
  const [expenseSim, setExpenseSim] = useState(210000);

  // Dynamic Score Calculation based on simulation
  const netProfitSim = revenueSim - expenseSim;
  const marginPercent = Math.round((netProfitSim / revenueSim) * 100);
  const calculatedHealthScore = Math.min(100, Math.max(10, Math.round((marginPercent / 60) * 100)));

  // Month charts (Jan - Jun) representing exact heights from Image 4
  const revenueMonths = [70, 75, 80, 85, 90, 50]; // (TOS thousands)
  const expenseMonths = [35, 40, 40, 35, 30, 30]; 
  const netProfitMonths = [35, 35, 40, 50, 60, 20];

  const handleAdjustFinancials = () => {
    onAddLog('success', `FINANCE: Simulation financière réalignée ! Score de santé ré-indexé à ${calculatedHealthScore}/100.`);
  };

  const handleAddCustomReceipt = () => {
    onAddLog('success', 'FINANCE: Transaction instantanée comptabilisée via passerelle sécurisée HerboStripe.');
  };

  return (
    <div className="bg-[#FAF9F5] text-stone-800 p-6 rounded-[28px] border border-[#e1d5c1] font-sans shadow-md" id="agro-finance-center-module">
      
      {/* Brand Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e1d5c1] pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#BA5834] to-[#f26b4f] rounded-xl flex items-center justify-center text-white text-lg font-bold">
            💰
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-serif font-bold text-[#451e09]">AgroMaître (Herboferme)</span>
              <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-green-200 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-tight">IMAGE 4: FINANCIAL HEALTH</span>
            </div>
            <p className="text-xs text-stone-500 font-mono">Secured Bank Sockets SOC-2 & Enterprise Capital Audit</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleAddCustomReceipt}
            className="text-[10px] bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 px-3 py-1.5 rounded-full font-mono font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Simulate Invoice</span>
          </button>
        </div>
      </header>

      {/* Title with Overall Score Gauge embedded of right side */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 border-b border-orange-100/40 pb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#451e09] tracking-tight">Strategic Financial Health Center</h1>
          <p className="text-xs text-[#6e5845] font-mono uppercase mt-0.5">Global ledger consolidation, seasonal amortization & profit margins analysis</p>
        </div>

        {/* Small radial financial score gauge mimicking Image 4's score panel on top right */}
        <div className="bg-white border border-[#e1d5c1]/80 rounded-[22px] px-5 py-3.5 flex items-center gap-4 shadow-xs shrink-0 w-full lg:w-auto">
          <div className="relative w-14 h-14 flex items-center justify-center">
            {/* Simple colored SVG progress circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.8" fill="none" stroke="#f3f4f6" strokeWidth="3" />
              <circle 
                cx="18" cy="18" r="15.8" fill="none" 
                stroke="#BA5834" strokeWidth="3" 
                strokeDasharray={`${calculatedHealthScore}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-sm font-bold font-mono text-stone-800">{calculatedHealthScore}</span>
            </div>
          </div>
          <div>
            <span className="text-[9.5px] font-mono text-stone-500 block uppercase font-semibold">FINANCIAL HEALTH SCORE</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-serif font-bold text-[#451e09]">
                {calculatedHealthScore >= 80 ? 'Excellent' : calculatedHealthScore >= 50 ? 'Stable' : 'Critical'}
              </span>
              <span className="text-[10px] text-green-600 font-bold font-mono">(94th pct)</span>
            </div>
          </div>
        </div>
      </div>

      {/* The Three Glorious Vertical Cards - Column layout matching Image 4 precisely */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* CARD 1: REVENUE OVERVIEW */}
        <div className="bg-white border border-[#e1d5c1] rounded-[24px] p-5.5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-stone-400 font-bold uppercase tracking-widest block mb-1">Card 01 // Input Vectors</span>
            <h3 className="font-serif font-bold text-base text-stone-800">Revenue Overview</h3>
            
            <div className="my-4 font-mono text-3xl font-bold text-gray-800">
              ${revenueSim.toLocaleString()}
            </div>

            {/* Custom bar chart (Jan - Jun) */}
            <div className="h-28 border-b border-stone-100 flex items-end justify-between px-2 gap-1.5 pt-4 mb-4 select-none">
              {revenueMonths.map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-[#BA5834] rounded-t-sm transition-all duration-300 hover:brightness-105" 
                    style={{ height: `${(val / 100) * 100}%` }}
                    title={`$${val}k`}
                  />
                  <span className="text-[8.5px] font-mono text-stone-400 mt-1 uppercase">
                    {['J','F','M','A','M','J'][idx]}
                  </span>
                </div>
              ))}
            </div>

            {/* Breakdown table below of card 1 */}
            <div className="space-y-2 pt-2 text-xs">
              <div className="text-[9px] font-mono text-gray-400 font-bold uppercase tracking-wider mb-2">PROFIT DISTRIBUTION PER PLOT YTD</div>
              <div className="flex justify-between items-center border-b border-stone-50 pb-1 font-mono text-stone-600">
                <span>Parcel A:</span>
                <span className="font-bold text-stone-800">$250,000</span>
              </div>
              <div className="flex justify-between items-center border-b border-stone-50 pb-1 font-mono text-stone-600">
                <span>Parcel B:</span>
                <span className="font-bold text-stone-800">$150,000</span>
              </div>
              <div className="flex justify-between items-center font-mono text-stone-600">
                <span>Parcel C:</span>
                <span className="font-bold text-stone-800">$50,000</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-stone-100 flex justify-end">
            <span className="text-[10px] font-mono font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.3%</span>
            </span>
          </div>
        </div>

        {/* CARD 2: EXPENSES OVERVIEW */}
        <div className="bg-white border border-[#e1d5c1] rounded-[24px] p-5.5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-stone-400 font-bold uppercase tracking-widest block mb-1">Card 02 // Outward Vectors</span>
            <h3 className="font-serif font-bold text-base text-stone-800">Expenses Overview</h3>
            
            <div className="my-4 font-mono text-3xl font-bold text-gray-800">
              ${expenseSim.toLocaleString()}
            </div>

            {/* Custom bar chart (Jan - Jun) but with a slightly lighter terracotta color */}
            <div className="h-28 border-b border-stone-100 flex items-end justify-between px-2 gap-1.5 pt-4 mb-4 select-none">
              {expenseMonths.map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-[#fca5a5] rounded-t-sm transition-all duration-300 hover:brightness-105" 
                    style={{ height: `${(val / 60) * 100}%` }}
                    title={`$${val}k`}
                  />
                  <span className="text-[8.5px] font-mono text-stone-400 mt-1 uppercase">
                    {['J','F','M','A','M','J'][idx]}
                  </span>
                </div>
              ))}
            </div>

            {/* Expense factors lists */}
            <div className="space-y-2 pt-2 text-xs">
              <div className="text-[9px] font-mono text-gray-400 font-bold uppercase tracking-wider mb-2">FARM DEPRECIATION WEIGHTS</div>
              <div className="flex justify-between items-center border-b border-stone-50 pb-1 font-mono text-stone-600">
                <span>Seeds / Nutrients:</span>
                <span className="font-bold text-stone-800">$80,000</span>
              </div>
              <div className="flex justify-between items-center border-b border-stone-50 pb-1 font-mono text-stone-600">
                <span>Heavy Equipments:</span>
                <span className="font-bold text-stone-800">$40,000</span>
              </div>
              <div className="flex justify-between items-center font-mono text-stone-600">
                <span>Operational Labor:</span>
                <span className="font-bold text-stone-800">$60,000</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-stone-100 flex justify-end">
            <span className="text-[10px] font-mono font-bold text-red-500 flex items-center gap-0.5">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>-2.4%</span>
            </span>
          </div>
        </div>

        {/* CARD 3: NET PROFIT PER PARCEL */}
        <div className="bg-white border border-[#e1d5c1] rounded-[24px] p-5.5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-stone-400 font-bold uppercase tracking-widest block mb-1">Card 03 // Net Yield Margin</span>
            <h3 className="font-serif font-bold text-base text-stone-800">Net Profit per Parcel</h3>
            
            <div className="my-4 font-mono text-3xl font-bold text-[#BA5834]">
              ${netProfitSim.toLocaleString()}
            </div>

            {/* Custom bar chart (Jan - Jun) highlight net profit values */}
            <div className="h-28 border-b border-stone-100 flex items-end justify-between px-2 gap-1.5 pt-4 mb-4 select-none">
              {netProfitMonths.map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-emerald-600 rounded-t-sm transition-all duration-300 hover:brightness-105" 
                    style={{ height: `${(val / 80) * 100}%` }}
                    title={`$${val}k`}
                  />
                  <span className="text-[8.5px] font-mono text-stone-400 mt-1 uppercase">
                    {['J','F','M','A','M','J'][idx]}
                  </span>
                </div>
              ))}
            </div>

            {/* Breakdown table below of card 3 */}
            <div className="space-y-2 pt-2 text-xs">
              <div className="text-[9px] font-mono text-gray-400 font-bold uppercase tracking-wider mb-2">PLOT OPERATIVE RETOUR RATIOS</div>
              <div className="flex justify-between items-center border-b border-stone-50 pb-1 font-mono text-stone-600">
                <span>Parcel A Net:</span>
                <span className="font-bold text-stone-850">$150,000 <span className="text-[10px] text-emerald-600 font-semibold">(30% Mrg)</span></span>
              </div>
              <div className="flex justify-between items-center border-b border-stone-50 pb-1 font-mono text-stone-600">
                <span>Parcel B Net:</span>
                <span className="font-bold text-stone-850">$70,000 <span className="text-[10px] text-emerald-600 font-semibold">(25% Mrg)</span></span>
              </div>
              <div className="flex justify-between items-center font-mono text-stone-600">
                <span>Parcel C Net:</span>
                <span className="font-bold text-stone-850">$20,000 <span className="text-[10px] text-emerald-600 font-semibold">(20% Mrg)</span></span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-stone-100 flex justify-end">
            <span className="text-[10.5px] font-mono font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{marginPercent}% Margin</span>
            </span>
          </div>
        </div>

      </div>

      {/* Adjust simulation section slider to keep the page interactive */}
      <div className="bg-[#FFF9F4] border border-[#e1d5c1] rounded-[24px] p-6 relative overflow-hidden">
        <h3 className="font-serif text-sm font-bold text-[#451e09] mb-4 border-b border-orange-100 pb-2 flex items-center gap-1.5 select-none">
          <Activity className="w-4 h-4 text-[#BA5834]" />
          <span>Interactive Pro Forma Margin Simulator</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          <div className="space-y-4">
            {/* Control Slider 1: Gross Revenue */}
            <div>
              <div className="flex justify-between text-xs mb-1 font-mono font-bold text-stone-600 select-none">
                <span>Simulated Gross Sales:</span>
                <span className="text-[#BA5834]">${revenueSim.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="200000"
                max="800000"
                step="10000"
                value={revenueSim}
                onChange={(e) => setRevenueSim(parseInt(e.target.value))}
                className="w-full accent-[#BA5834] bg-stone-150 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Control Slider 2: Operational Costs */}
            <div>
              <div className="flex justify-between text-xs mb-1 font-mono font-bold text-stone-600 select-none">
                <span>Simulated OpEx Bounds:</span>
                <span className="text-[#BA5834]">${expenseSim.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="100000"
                max="400000"
                step="5000"
                value={expenseSim}
                onChange={(e) => setExpenseSim(parseInt(e.target.value))}
                className="w-full accent-[#BA5834] bg-stone-150 h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-white/80 p-5 rounded-2xl border border-[#e1d5c1]/50 space-y-3.5 text-center">
            <span className="text-[10px] font-mono text-stone-400 font-bold block uppercase tracking-wide">SIMULATED NET EBITDA MARGIN</span>
            <div className="text-3xl font-mono font-bold text-[#BA5834]">${netProfitSim.toLocaleString()}</div>
            
            <button
              onClick={handleAdjustFinancials}
              className="px-5 py-2.5 bg-[#BA5834] hover:bg-[#a04321] text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition w-full cursor-pointer shadow"
            >
              Recalibrate Ledger Index
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
