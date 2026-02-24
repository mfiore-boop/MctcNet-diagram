import React from 'react';
import { Equipment } from '../types/equipment';
import { EQUIPMENT_TEMPLATES } from '../data/equipmentTemplates';
import { Plus, Server, Monitor, Activity } from 'lucide-react';

interface EquipmentLibraryProps {
  onAdd: (template: Partial<Equipment>) => void;
}

export function EquipmentLibrary({ onAdd }: EquipmentLibraryProps) {
  return (
    <div className="w-64 bg-carbon-gray-10 border-r border-carbon-gray-20 overflow-y-auto p-4 h-full">
      <h3 className="text-[10px] font-bold text-carbon-gray-80 uppercase tracking-widest mb-4">Libreria Strumenti</h3>
      
      {/* PC & Server Group */}
      <div className="mb-8">
        <h4 className="text-[9px] font-bold text-carbon-gray-100 uppercase mb-2 border-b border-carbon-gray-20 pb-1">PC & Server</h4>
        <div className="space-y-1">
          <button
            onClick={() => onAdd({
              type: 'PC',
              name: 'PC Prenotazione',
              isServer: false,
              connectionProtocol: 'RETE',
              vehicleCapability: 'UNIVERSAL'
            })}
            className="w-full flex items-center gap-3 p-3 bg-white border border-transparent hover:border-carbon-blue-60 transition-all text-left group"
          >
            <div className="w-8 h-8 bg-carbon-gray-10 flex items-center justify-center text-carbon-gray-80 group-hover:text-carbon-blue-60">
              <Server size={16} />
            </div>
            <div>
              <div className="text-xs font-normal text-carbon-gray-100 uppercase tracking-tight">PC Prenotazione</div>
            </div>
            <Plus size={14} className="ml-auto opacity-0 group-hover:opacity-100 text-carbon-blue-60" />
          </button>

          <button
            onClick={() => onAdd({
              type: 'PC',
              name: 'PC Stazione',
              isServer: false,
              connectionProtocol: 'RETE',
              vehicleCapability: 'UNIVERSAL'
            })}
            className="w-full flex items-center gap-3 p-3 bg-white border border-transparent hover:border-carbon-blue-60 transition-all text-left group"
          >
            <div className="w-8 h-8 bg-carbon-gray-10 flex items-center justify-center text-carbon-gray-80 group-hover:text-carbon-blue-60">
              <Monitor size={16} />
            </div>
            <div>
              <div className="text-xs font-normal text-carbon-gray-100 uppercase tracking-tight">PC Stazione</div>
            </div>
            <Plus size={14} className="ml-auto opacity-0 group-hover:opacity-100 text-carbon-blue-60" />
          </button>
        </div>
      </div>

      {/* Other Equipment Group */}
      <div>
        <h4 className="text-[9px] font-bold text-carbon-gray-100 uppercase mb-2 border-b border-carbon-gray-20 pb-1">Strumenti</h4>
        <div className="space-y-1">
          {(() => {
            const processedTypes = new Set<string>();
            const uniqueTemplates: (Partial<Equipment> & { displayName: string })[] = [];

            const getGroupKey = (t: Partial<Equipment>) => {
              if (t.type === 'BRAKE_TESTER') return 'BRAKE_TESTER';
              if (t.type === 'SPEED_TESTER') return 'SPEED_TESTER';
              if (t.type === 'RPM_COUNTER') return 'RPM_COUNTER';
              if (t.name?.includes('RT ')) return 'RT_CAMERA';
              return t.name || t.type || 'OTHER';
            };

            const getDisplayName = (t: Partial<Equipment>) => {
              if (t.type === 'BRAKE_TESTER') return 'Banco Prova Freni';
              if (t.type === 'SPEED_TESTER') return 'Banco Prova Velocità';
              if (t.type === 'RPM_COUNTER') return 'Contagiri';
              if (t.name?.includes('RT ')) return 'Telecamera / RT';
              return t.name || 'Strumento';
            };

            for (const t of EQUIPMENT_TEMPLATES.filter(t => t.type !== 'PC')) {
              const key = getGroupKey(t);
              if (!processedTypes.has(key)) {
                processedTypes.add(key);
                uniqueTemplates.push({ ...t, displayName: getDisplayName(t) });
              }
            }

            return uniqueTemplates.sort((a, b) => (a.displayName || '').localeCompare(b.displayName || '')).map((template, idx) => (
              <button
                key={`eq-${idx}`}
                onClick={() => onAdd(template)}
                className="w-full flex items-center gap-3 p-3 bg-white border border-transparent hover:border-carbon-blue-60 transition-all text-left group"
              >
                <div className="w-8 h-8 bg-carbon-gray-10 flex items-center justify-center text-carbon-gray-80 group-hover:text-carbon-blue-60">
                  <Activity size={16} />
                </div>
                <div>
                  <div className="text-xs font-normal text-carbon-gray-100 uppercase tracking-tight">{template.displayName}</div>
                </div>
                <Plus size={14} className="ml-auto opacity-0 group-hover:opacity-100 text-carbon-blue-60" />
              </button>
            ));
          })()}
        </div>
      </div>
    </div>
  );
}
