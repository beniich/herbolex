import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertTriangle, 
  Package, 
  Check, 
  QrCode, 
  RefreshCw, 
  Search, 
  Printer, 
  Database,
  Camera,
  X,
  FileCheck
} from 'lucide-react';

interface AgroInventorySupplyProps {
  onAddLog: (level: 'info' | 'success' | 'warn' | 'error', message: string) => void;
}

export default function AgroInventorySupply({ onAddLog }: AgroInventorySupplyProps) {
  // Alert stats states
  const [wheatSeedsLevel, setWheatSeedsLevel] = useState(10);
  const [npkFertLevel, setNpkFertLevel] = useState(2);

  const [isReorderingWheat, setIsReorderingWheat] = useState(false);
  const [isReorderingNpk, setIsReorderingNpk] = useState(false);

  // Scan modal simulation states
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannerStep, setScannerStep] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [scannedCode, setScannedCode] = useState('PKG-SEED-WHT-89240');

  // Ledger lists
  const [ledger, setLedger] = useState([
    { id: 'WHT-SEED-Q4-01', status: 'Checked In', scanned: '08:42 AM', gate: 'RFID Gate 1', color: 'text-green-700 bg-green-50 border-green-200' },
    { id: 'NPK-FERT-L2-35', status: 'In Transit', scanned: '--', gate: 'pending', color: 'text-amber-700 bg-amber-50 border-amber-200 animate-pulse' }
  ]);

  const handleReorderWheat = () => {
    setIsReorderingWheat(true);
    onAddLog('info', 'INVENTORY_REORDER: Lancement de la commande fétiche de semence de blé d\'hiver (A-12)...');
    setTimeout(() => {
      setWheatSeedsLevel(100);
      setIsReorderingWheat(false);
      onAddLog('success', 'INVENTORY_REORDER: 1,500kg de Graines de Blé réceptionnés et balisés en soute A-12.');
    }, 1200);
  };

  const handleReorderNpk = () => {
    setIsReorderingNpk(true);
    onAddLog('info', 'INVENTORY_REORDER: Déplacement du bon de transport d\'engrais N-P-K (B-35) au statut Prioritaire...');
    setTimeout(() => {
      setNpkFertLevel(100);
      setIsReorderingNpk(false);
      onAddLog('success', 'INVENTORY_REORDER: N-P-K bio-engrais réapprovisionné à 100%. Compartiment B-35 calibré.');
    }, 1200);
  };

  const handleStartScanner = () => {
    setIsScannerOpen(true);
    setScannerStep('scanning');
    onAddLog('info', 'SCANNER_NFC: Allumage de la caméra de scannage laser...');
    
    // Simulate camera laser scan reading
    setTimeout(() => {
      setScannerStep('success');
      onAddLog('success', `SCANNER_NFC: Code-barres mémorisé avec succès ! ID: [${scannedCode}].`);
    }, 2000);
  };

  const handleAcceptPackage = () => {
    const newEntry = {
      id: scannedCode,
      status: 'Checked In',
      scanned: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      gate: 'Manual Terminal Scan 02',
      color: 'text-green-700 bg-green-50 border-green-200'
    };
    setLedger(prev => [newEntry, ...prev]);
    setIsScannerOpen(false);
    onAddLog('success', `INVENTORY: Colis [${scannedCode}] enregistré par certificat sécurisé.`);
    
    // Regenerate random package id for the next mock check-in
    setScannedCode(`PKG-FERT-NPK-${Math.floor(Math.random() * 90000 + 10000)}`);
  };

  return (
    <div className="bg-[#fdfbf9] text-[#4a4a4a] p-6 rounded-[28px] border border-stone-200/60 font-sans shadow-lg select-none" id="inventory-alerts-module">
      
      {/* Brand Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-orange-100 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#f26b4f] to-[#e65a3d] rounded-xl flex items-center justify-center text-white text-lg font-bold">
            📦
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-800">AgroMaître <span className="text-xs font-normal text-gray-400">(Herboferme)</span></span>
              <span className="text-[9px] bg-orange-50 text-[#f26b4f] border border-orange-200 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-tight">INVENTORY_LOGISTICS</span>
            </div>
            <p className="text-xs text-gray-500 font-mono">Image 5: Reorder alerts, Barcode Scanning Simulation</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full font-sans font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Stock Ledger Synchronized
          </span>
        </div>
      </header>

      {/* Title */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Inventory Alerts & Supply Logistics</h1>
        <p className="text-sm text-gray-400 mt-1">Automated material requisitioning & scanning portal</p>
      </div>

      {/* Low stocks notifications block cards (Image 5) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        
        {/* Alert Card 1: Wheat Seeds */}
        <div className="bg-white border-2 border-orange-100 rounded-[24px] p-6 shadow-xs relative overflow-hidden group hover:shadow-md transition">
          <span className="absolute top-4 right-4 text-[10px] uppercase font-mono font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Low Material Level</span>
          </span>

          <div className="space-y-4">
            <div>
              <span className="text-xs text-gray-400 block font-mono">MATERIAL REQUISITION:</span>
              <span className="text-xl font-bold text-gray-800 block">Wheat Seeds</span>
              <span className="text-xs text-gray-500 uppercase font-mono mt-1 block">Storage Box: <strong className="text-gray-700">A-12</strong></span>
            </div>

            {/* Cylinder level gauge */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span>Stock Left:</span>
                <span className={`${wheatSeedsLevel <= 10 ? 'text-orange-500 font-bold' : 'text-green-600'}`}>{wheatSeedsLevel}%</span>
              </div>
              <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200/50">
                <motion.div 
                  initial={{ width: '0%' }}
                  animate={{ width: `${wheatSeedsLevel}%` }}
                  className={`h-full rounded-full ${wheatSeedsLevel <= 10 ? 'bg-gradient-to-r from-orange-400 to-[#f26b4f]' : 'bg-green-500'}`}
                />
              </div>
            </div>

            <button
              onClick={handleReorderWheat}
              disabled={isReorderingWheat || wheatSeedsLevel > 10}
              className="mt-2.5 w-full py-2.5 bg-gradient-to-r from-[#f26b4f] to-[#e65a3d] hover:brightness-105 text-white text-xs font-bold rounded-xl transition uppercase disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isReorderingWheat ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Package className="w-3.5 h-3.5" />}
              <span>{isReorderingWheat ? 'Acquiring Stock...' : wheatSeedsLevel > 10 ? 'Replenished ✓' : 'Reorder Now'}</span>
            </button>
          </div>
        </div>

        {/* Alert Card 2: NPK Fertilizer */}
        <div className="bg-white border-2 border-red-100 rounded-[24px] p-6 shadow-xs relative overflow-hidden group hover:shadow-md transition">
          <span className="absolute top-4 right-4 text-[10px] uppercase font-mono font-bold text-red-650 text-red-500 bg-red-50/50 px-2 py-0.5 rounded-full border border-red-200 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            <span>Critically Low Level</span>
          </span>

          <div className="space-y-4">
            <div>
              <span className="text-xs text-gray-400 block font-mono">MATERIAL REQUISITION:</span>
              <span className="text-xl font-bold text-gray-800 block">NPK fertilizer</span>
              <span className="text-xs text-gray-500 uppercase font-mono mt-1 block">Storage Box: <strong className="text-gray-700">B-35</strong></span>
            </div>

            {/* Cylinder level gauge */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span>Stock Left:</span>
                <span className={`${npkFertLevel <= 2 ? 'text-red-500 font-bold' : 'text-green-600'}`}>{npkFertLevel}%</span>
              </div>
              <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200/50">
                <motion.div 
                  initial={{ width: '0%' }}
                  animate={{ width: `${npkFertLevel}%` }}
                  className={`h-full rounded-full ${npkFertLevel <= 2 ? 'bg-gradient-to-r from-red-400 to-red-600' : 'bg-green-500'}`}
                />
              </div>
            </div>

            <button
              onClick={handleReorderNpk}
              disabled={isReorderingNpk || npkFertLevel > 2}
              className="mt-2.5 w-full py-2.5 bg-gradient-to-r from-[#f26b4f] to-[#e65a3d] hover:brightness-105 text-white text-xs font-bold rounded-xl transition uppercase disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isReorderingNpk ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Package className="w-3.5 h-3.5" />}
              <span>{isReorderingNpk ? 'Acquiring Stock...' : npkFertLevel > 2 ? 'Replenished ✓' : 'Reorder Now'}</span>
            </button>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Logistics Verification Ledger details */}
        <div className="lg:col-span-8 bg-white border border-stone-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="border-b border-stone-100 pb-3 mb-4">
              <h2 className="text-base font-bold text-gray-800">Logistics Verification Ledger</h2>
              <p className="text-xs text-gray-400 mt-0.5">Checked barcode arrivals tracking history</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#4a4a4a] font-sans">
                <thead>
                  <tr className="border-b border-stone-100 text-[#4a4a4a]/50 pb-2.5 font-bold font-mono text-[10px]">
                    <th className="pb-2">Material / Package Serial</th>
                    <th className="pb-2">Logistics Status</th>
                    <th className="pb-2">Scanned At</th>
                    <th className="pb-2">Verified Operator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50 font-medium">
                  {ledger.map((item, index) => (
                    <tr key={index} className="hover:bg-stone-50/50 transition">
                      <td className="py-3 font-mono font-bold text-gray-800">{item.id}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${item.color}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-gray-500">{item.scanned}</td>
                      <td className="py-3 font-mono text-gray-600">{item.gate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t border-stone-100 pt-4 flex flex-col sm:flex-row gap-2 mt-4">
            <button
              onClick={handleStartScanner}
              className="flex-1 py-3 bg-gradient-to-r from-[#f26b4f] to-[#e65a3d] text-white text-xs font-bold rounded-xl shadow-md transition hover:opacity-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Camera className="w-4 h-4" />
              <span>Simulate Scan Barcode</span>
            </button>
          </div>
        </div>

        {/* Logistics quick actions panel */}
        <div className="lg:col-span-4 bg-white border border-stone-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="border-b border-stone-100 pb-3 mb-4">
              <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">
                Logistic Quick Options
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <button 
                onClick={() => {
                  onAddLog('info', 'INVENTORY: Réconciliation des stocks théorique vs physique.');
                  alert('Reconciling stocks count across all decentralized locations...');
                }}
                className="w-full text-left p-3.5 border border-stone-100 hover:border-orange-200 bg-stone-50/20 hover:bg-white text-gray-700 font-semibold rounded-xl flex items-center gap-2.5 transition cursor-pointer"
              >
                <Database className="w-4 h-4 text-gray-400" />
                <span>Reconcile Stocks Balance</span>
              </button>

              <button 
                onClick={() => {
                  onAddLog('info', 'INVENTORY: Lancement du diagnostic XLS de réquisition.');
                  alert('Generating mass CSV purchase orders templates...');
                }}
                className="w-full text-left p-3.5 border border-stone-100 hover:border-orange-200 bg-stone-50/20 hover:bg-white text-gray-700 font-semibold rounded-xl flex items-center gap-2.5 transition cursor-pointer"
              >
                <FileCheck className="w-4 h-4 text-gray-400" />
                <span>Scan Batch CSV Requisition</span>
              </button>

              <button 
                onClick={() => {
                  onAddLog('success', 'INVENTORY: Impression de 50 étiquettes code-barres thermiques PDF.');
                  alert('Spooling QR labels printer queue: Checked successfully!');
                }}
                className="w-full text-left p-3.5 border border-stone-100 hover:border-orange-200 bg-stone-50/20 hover:bg-white text-gray-700 font-semibold rounded-xl flex items-center gap-2.5 transition cursor-pointer"
              >
                <Printer className="w-4 h-4 text-gray-400" />
                <span>Print QR Barcodes Labels</span>
              </button>
            </div>
          </div>

          <div className="p-3 bg-[#fff5f2] border border-[#f26b4f]/10 rounded-xl mt-4">
            <span className="text-[10px] font-mono text-[#f26b4f] uppercase font-bold block mb-1">Fleet Tracker integrations</span>
            <p className="text-[10.5px] italic text-[#f26b4f]/80 leading-relaxed font-sans">
              NPK fertilizer cargo transit coordinates: Lat 48.85 // Speed: 80km/h
            </p>
          </div>
        </div>

      </div>

      {/* Barcode scanner slide-up Simulator Modal OVERLAY (from HTML mockup) */}
      <AnimatePresence>
        {isScannerOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-stone-200 p-6 max-w-sm w-full font-sans text-xs text-[#4a4a4a] shadow-2xl relative"
            >
              <div className="flex justify-between items-center border-b border-stone-100 pb-3 mb-4">
                <span className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-[#f26b4f]" /> Barcode Scan Simulator
                </span>
                <button onClick={() => setIsScannerOpen(false)} className="cursor-pointer hover:text-red-500 text-gray-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {scannerStep === 'scanning' ? (
                <div className="flex flex-col items-center py-6 space-y-4">
                  {/* Mock Barcode Container with a red laser scanner effect line moving up/down */}
                  <div className="relative w-48 h-32 bg-stone-50 border border-stone-200 rounded-lg flex items-center justify-center p-4 overflow-hidden shadow-inner">
                    {/* Glowing Red laser scanning line */}
                    <div className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_10px_2px_rgba(239,68,68,0.8)] animate-bounce" style={{ top: '35%' }} />
                    
                    {/* Simulated vertical barcode lines */}
                    <div className="flex items-stretch gap-1 w-full h-16 select-none opacity-80">
                      <div className="bg-stone-800 w-1.5"></div>
                      <div className="bg-stone-800 w-0.5"></div>
                      <div className="bg-stone-800 w-1"></div>
                      <div className="bg-stone-800 w-2"></div>
                      <div className="bg-stone-800 w-0.5"></div>
                      <div className="bg-stone-800 w-1"></div>
                      <div className="bg-[#f26b4f] w-1.5 animate-pulse"></div>
                      <div className="bg-stone-800 w-2"></div>
                      <div className="bg-stone-800 w-0.5"></div>
                      <div className="bg-stone-800 w-1"></div>
                      <div className="bg-stone-800 w-1.5"></div>
                    </div>
                  </div>
                  <span className="text-gray-500 font-mono tracking-wider animate-pulse">Aligning laser lens aperture...</span>
                </div>
              ) : (
                <div className="space-y-4 py-3">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                    <div className="w-10 h-10 bg-green-500 rounded-full text-white flex items-center justify-center mx-auto mb-2 shadow-sm">
                      <Check className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-green-800 block">Package Code Read Successfully!</span>
                    <span className="text-xs font-mono text-green-700 block mt-1">{scannedCode}</span>
                  </div>

                  <div className="space-y-2.5 text-xs text-gray-600 bg-stone-50 p-3.5 rounded-xl">
                    <div className="flex justify-between">
                      <span>Inferred Material:</span>
                      <strong className="text-gray-800 font-mono">Organic Winter Seeds G4</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Carrier Logistics:</span>
                      <strong className="text-gray-800 font-mono">AgroCargo Express CC-15</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Status Certified:</span>
                      <strong className="text-green-600">PASSED QUALITY CTRL</strong>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2 text-xs">
                    <button 
                      type="button" 
                      onClick={() => setIsScannerOpen(false)}
                      className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 rounded-lg font-bold text-gray-600 transition cursor-pointer text-center"
                    >
                      Reject Pack
                    </button>
                    <button 
                      type="button" 
                      onClick={handleAcceptPackage}
                      className="flex-1 py-2.5 bg-[#f26b4f] hover:bg-[#e65a3d] text-white rounded-lg font-bold transition shadow-sm cursor-pointer text-center"
                    >
                      Accept Package into Ledger
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
