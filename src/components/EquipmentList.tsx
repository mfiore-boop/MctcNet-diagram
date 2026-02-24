import React from 'react';
import { Equipment, EQUIPMENT_LABELS, EQUIPMENT_ICONS } from '../types/equipment';
import * as Icons from 'lucide-react';
import { Download } from 'lucide-react';

interface EquipmentListProps {
  equipment: Equipment[];
  onDownloadReport?: () => void;
}

export function EquipmentList({ equipment, onDownloadReport }: EquipmentListProps) {
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-carbon-gray-20 pb-4">
        <h2 className="text-2xl font-light text-carbon-gray-100">Inventario Attrezzature</h2>
      </div>

      <div className="bg-white border border-carbon-gray-20 overflow-hidden">
        {equipment.length === 0 ? (
          <div className="p-16 text-center text-carbon-gray-80 font-light">
            <div className="mb-4 flex justify-center text-carbon-gray-30">
              <Icons.Box size={48} strokeWidth={1} />
            </div>
            <h3 className="text-xl font-light text-carbon-gray-100 mb-2">Inventario Vuoto</h3>
            <p className="text-sm text-carbon-gray-60">
              Non sono presenti attrezzature. Procedi alla creazione dello schema per popolare l'inventario.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-carbon-gray-10 border-b border-carbon-gray-20">
                <tr>
                  <th className="px-4 py-3 font-bold text-xs uppercase tracking-wider text-carbon-gray-100">Attrezzatura</th>
                  <th className="px-4 py-3 font-bold text-xs uppercase tracking-wider text-carbon-gray-100">Codice / Matricola</th>
                  <th className="px-4 py-3 font-bold text-xs uppercase tracking-wider text-carbon-gray-100">Omologazione</th>
                  <th className="px-4 py-3 font-bold text-xs uppercase tracking-wider text-carbon-gray-100">Scadenza</th>
                  <th className="px-4 py-3 font-bold text-xs uppercase tracking-wider text-carbon-gray-100">Collegamento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-carbon-gray-20">
                {equipment.map((eq) => {
                  const IconComponent = (Icons as any)[EQUIPMENT_ICONS[eq.type]] || Icons.Box;
                  const connectedDevice = equipment.find(e => e.id === eq.connectedTo);
                  
                  return (
                    <tr key={eq.id} className="hover:bg-carbon-gray-10 transition-colors group">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-carbon-gray-10 text-carbon-gray-80 group-hover:bg-white transition-colors">
                            <IconComponent size={18} />
                          </div>
                          <div>
                            <div className="font-normal text-carbon-gray-100">{eq.name}</div>
                            <div className="text-[10px] uppercase tracking-widest text-carbon-gray-80">{EQUIPMENT_LABELS[eq.type]}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-mono text-xs text-carbon-gray-100">{eq.code}</div>
                        <div className="text-[10px] text-carbon-gray-80">SN: {eq.serialNumber}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2 py-1 bg-carbon-gray-10 text-carbon-gray-100 text-[10px] font-bold border border-carbon-gray-20">
                          {eq.approval}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {eq.expirationDate ? (
                          <span className="text-xs text-carbon-gray-100 font-mono">
                            {eq.expirationDate}
                          </span>
                        ) : (
                          <span className="text-[10px] text-carbon-gray-20 italic">Non specificata</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          {eq.connectionProtocol ? (
                            <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold border ${
                              eq.connectionProtocol === 'RETE' ? 'bg-carbon-blue-60 text-white border-carbon-blue-60' :
                              eq.connectionProtocol === 'RS' ? 'bg-[#f1c21b] text-carbon-gray-100 border-[#f1c21b]' :
                              'bg-carbon-gray-100 text-white border-carbon-gray-100'
                            }`}>
                              {eq.connectionProtocol === 'RETE' ? 'LAN / RETE' : 
                               eq.connectionProtocol === 'RS' ? 'SERIALE RS232' : 
                               'DIRETTO'}
                            </span>
                          ) : (
                            <span className="text-[10px] text-carbon-gray-20">-</span>
                          )}
                          
                          {connectedDevice && (
                            <div className="text-[10px] text-carbon-gray-80 flex items-center gap-1 mt-1">
                              <Icons.Link size={10} />
                              <span className="uppercase tracking-tighter">{connectedDevice.name}</span>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
