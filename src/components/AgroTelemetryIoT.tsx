import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wifi, 
  Battery, 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  Activity, 
  ListFilter, 
  Cpu, 
  AlertTriangle,
  RefreshCw,
  Droplets,
  Thermometer,
  Sun,
  Bug
} from 'lucide-react';

interface AgroTelemetryIoTProps {
  onAddLog: (level: 'info' | 'success' | 'warn' | 'error', message: string) => void;
}

export default function AgroTelemetryIoT({ onAddLog }: AgroTelemetryIoTProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [zoneFilter, setZoneFilter] = useState<string>('All Zones');

  // Hardcoded 12 sensor cards matching exactly descriptions from image screenshot 6
  const [sensors, setSensors] = useState([
    { id: 1, name: 'Soil Moisture A1', zone: 'Zone A', signal: -75, battery: 88, lastPing: '2s ago', active: true, points: [10, 15, 5, 20, 10, 15] },
    { id: 2, name: 'Temp/Humidity B4', zone: 'Zone B', signal: -70, battery: 88, lastPing: '2s ago', active: true, points: [12, 18, 14, 15, 22, 18] },
    { id: 3, name: 'Temp/Humidity B4', zone: 'Zone B', signal: -72, battery: 88, lastPing: '2s ago', active: true, points: [8, 15, 12, 19, 10, 15] },
    { id: 4, name: 'Irrigation Controller C2', zone: 'Zone C', signal: -75, battery: 88, lastPing: '2s ago', active: true, points: [15, 12, 10, 8, 14, 12] },
    { id: 5, name: 'Pest Monitor E1', zone: 'Zone E', signal: -75, battery: 88, lastPing: '2s ago', active: true, points: [5, 12, 8, 10, 6, 8] },
    { id: 6, name: 'Nutrient Sensor F3', zone: 'Zone F', signal: -75, battery: 88, lastPing: '2s ago', active: true, points: [18, 14, 15, 12, 19, 16] },
    
    { id: 7, name: 'Irrigation Controller C2', zone: 'Zone C', signal: -75, battery: 88, lastPing: '2s ago', active: true, points: [12, 15, 22, 10, 18, 12] },
    { id: 8, name: 'Weather Station D5', zone: 'Zone D', signal: -68, battery: 92, lastPing: '5s ago', active: true, points: [5, 15, 25, 22, 18, 20] },
    { id: 9, name: 'Pest Monitor E1', zone: 'Zone E', signal: -75, battery: 88, lastPing: '2s ago', active: true, points: [8, 14, 10, 12, 15, 11] },
    { id: 10, name: 'Weather Station D6', zone: 'Zone D', signal: -75, battery: 88, lastPing: '2s ago', active: false, points: [10, 10, 8, 5, 2, 0] },
    { id: 11, name: 'Nutrient Sensor F2', zone: 'Zone F', signal: -75, battery: 88, lastPing: '2s ago', active: true, points: [15, 18, 12, 14, 19, 21] },
    { id: 12, name: 'Nutrient Sensor F3', zone: 'Zone F', signal: -75, battery: 88, lastPing: '2s ago', active: true, points: [14, 12, 18, 15, 22, 24] },
    
    { id: 13, name: 'Soil Moisture A2', zone: 'Zone A', signal: -75, battery: 88, lastPing: '2s ago', active: true, points: [10, 8, 12, 15, 14, 18] },
    { id: 14, name: 'Temp/Humidity B5', zone: 'Zone B', signal: -75, battery: 88, lastPing: '2s ago', active: true, points: [15, 22, 18, 14, 12, 15] },
    { id: 15, name: 'Pest Monitor E2', zone: 'Zone E', signal: -75, battery: 88, lastPing: '2s ago', active: true, points: [6, 12, 15, 8, 10, 14] },
    { id: 16, name: 'Nutrient Sensor F1', zone: 'Zone F', signal: -75, battery: 88, lastPing: '2s ago', active: true, points: [10, 14, 12, 18, 15, 19] },
    { id: 17, name: 'Nutrient Sensor F2', zone: 'Zone F', signal: -75, battery: 88, lastPing: '2s ago', active: true, points: [15, 12, 18, 10, 14, 20] },
    { id: 18, name: 'Nutrient Sensor F3', zone: 'Zone F', signal: -75, battery: 88, lastPing: '2s ago', active: false, points: [5, 4, 2, 1, 0, 0] },
  ]);

  const toggleSensorActive = (id: number, name: string, current: boolean) => {
    setSensors(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, active: !current, lastPing: !current ? 'Just now' : 'Failed' };
      }
      return s;
    }));
    onAddLog(current ? 'warn' : 'success', `SENSORS: Diagnostic du capteur [${name}] modifié. Nouvel état: ${!current ? 'ACTIF' : 'DESACTIVÉ'}.`);
  };

  // Filtration logic
  const filteredSensors = sensors.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' 
      ? true 
      : statusFilter === 'Active' 
        ? s.active 
        : !s.active;
    const matchesZone = zoneFilter === 'All Zones' 
      ? true 
      : s.zone === zoneFilter;

    return matchesSearch && matchesStatus && matchesZone;
  });

  return (
    <div className="bg-[#FAF9F5] text-[#2c1a04] p-4 sm:p-6 border border-[#e1d5c1] rounded-sm font-sans shadow-md" id="iot-telemetry-monitor">
      
      {/* Brand Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e1d5c1] pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#BA5834] rounded-sm flex items-center justify-center text-white font-bold text-lg select-none">
            📡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-serif font-bold text-[#451e09] lg:text-base">AgroMaître Telemetry</span>
              <span className="text-[10px] text-stone-500 font-mono hidden sm:inline">|</span>
              <span className="text-xs uppercase font-mono tracking-wider font-bold text-[#BA5834]">IoT Telemetry & Health Monitor</span>
            </div>
            <p className="text-xs text-[#6e5845] font-mono uppercase">IMAGE 6: Remote Sensor Signals, Battery Ratios & Graphs</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-gray-500 bg-white border border-[#CED1C5] px-2.5 py-1 rounded-sm select-none">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          <span>System nominal (18 NODES)</span>
        </div>
      </header>

      {/* Control filter row represented exactly inside the header block of image 6 */}
      <div className="bg-[#FAF8F5] border border-[#e1d5c1] p-3 rounded-xs mb-6 flex flex-col sm:flex-row justify-between items-center gap-3">
        
        {/* Left segment - Zone filter dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <ListFilter className="w-4 h-4 text-[#BA5834]" />
          <select 
            value={zoneFilter}
            onChange={(e) => {
              setZoneFilter(e.target.value);
              onAddLog('info', `SENSORS: Filtrage géographique activé: [${e.target.value}].`);
            }}
            className="bg-white border border--stroke border-[#e1d5c1] rounded-sm py-1.5 px-3 text-xs outline-none font-mono cursor-pointer"
          >
            <option value="All Zones">All Zones</option>
            <option value="Zone A">Zone A</option>
            <option value="Zone B">Zone B</option>
            <option value="Zone C">Zone C</option>
            <option value="Zone D">Zone D</option>
            <option value="Zone E">Zone E</option>
            <option value="Zone F">Zone F</option>
          </select>
        </div>

        {/* Middle segment - Active/Inactive toggle buttons */}
        <div className="bg-stone-200/50 p-1 rounded-xs border border-stone-300/40 flex items-center gap-1">
          <button 
            type="button"
            onClick={() => setStatusFilter('All')}
            className={`px-3 py-1 text-xs font-mono rounded-sm transition ${
              statusFilter === 'All' ? 'bg-white text-black font-bold shadow-xs' : 'text-stone-500'
            }`}
          >
            All Zones
          </button>
          <button 
            type="button"
            onClick={() => setStatusFilter('Active')}
            className={`px-3 py-1 text-xs font-mono rounded-sm transition ${
              statusFilter === 'Active' ? 'bg-[#BA5834] text-white font-bold shadow-xs' : 'text-stone-500'
            }`}
          >
            Active
          </button>
          <button 
            type="button"
            onClick={() => setStatusFilter('Inactive')}
            className={`px-3 py-1 text-xs font-mono rounded-sm transition ${
              statusFilter === 'Inactive' ? 'bg-red-800 text-white font-bold shadow-xs' : 'text-stone-500'
            }`}
          >
            Inactive
          </button>
        </div>

        {/* Right segment - Search Bar input query */}
        <div className="relative w-full sm:w-64">
          <input 
            type="text"
            placeholder="Search sensor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-[#e1d5c1] pl-8 pr-3 py-1.5 text-xs rounded-sm outline-none font-mono text-black"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
        </div>

      </div>

      {/* Grid containing the dynamically filtered cards list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <AnimatePresence>
          {filteredSensors.map((s) => {
            const pathData = s.points.map((p, i) => `${i * 18},${30 - p}`).join(' ');
            return (
              <motion.div 
                key={s.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                onClick={() => toggleSensorActive(s.id, s.name, s.active)}
                className={`bg-white border rounded-sm p-3.5 shadow-xs flex flex-col justify-between transition hover:shadow-md cursor-pointer group ${
                  s.active ? 'border-[#e1d5c1] hover:border-[#BA5834]' : 'border-red-300 opacity-65 bg-red-50/10'
                }`}
              >
                
                {/* Header info */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[8.5px] font-mono font-bold flex items-center gap-1 ${
                      s.active ? 'text-emerald-700' : 'text-red-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full inline-block ${s.active ? 'bg-emerald-600 animate-pulse' : 'bg-red-500'}`} />
                      {s.active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-[8.5px] text-gray-400 font-mono">SENS_ID_{100 + s.id}</span>
                  </div>

                  {/* Main sensor icon & title */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm select-none">
                      {s.name.includes('Moisture') && '💧'}
                      {s.name.includes('Temp') && '🌡️'}
                      {s.name.includes('Irrigation') && '⛲'}
                      {s.name.includes('Pest') && '🐛'}
                      {s.name.includes('Nutrient') && '🧪'}
                      {s.name.includes('Weather') && '☀️'}
                    </span>
                    <h3 className="text-xs font-bold font-sans text-stone-850 truncate group-hover:text-[#BA5834] transition-colors">
                      {s.name}
                    </h3>
                  </div>

                  {/* Sparkline mini-graph chart */}
                  <div className="h-10 w-full bg-stone-50 border-b border-l border-stone-200 mt-3.5 relative overflow-hidden flex items-end">
                    
                    <svg className="w-full h-full pointer-events-none" viewBox="0 0 100 30" preserveAspectRatio="none">
                      <polyline 
                        fill="none" 
                        stroke={s.active ? '#BA5834' : '#ef4444'} 
                        strokeWidth="1.2" 
                        points={pathData} 
                      />
                    </svg>

                    <div className="absolute right-1 top-0.5 text-[7px] font-mono text-gray-400">24h</div>
                  </div>
                </div>

                {/* Bottom telemetry indicators */}
                <div className="mt-3.5 pt-2 border-t border-stone-100 flex justify-between items-center text-[8px] font-mono text-stone-500">
                  <div className="flex items-center gap-1">
                    <Wifi className="w-2.5 h-2.5 text-stone-400" />
                    <span>{s.signal}dBm</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Battery className="w-2.5 h-2.5 text-stone-400" />
                    <span className={s.battery < 20 ? 'text-red-500 font-bold' : ''}>{s.battery}%</span>
                  </div>

                  <span className="text-gray-400">{s.lastPing}</span>
                </div>

              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
}
