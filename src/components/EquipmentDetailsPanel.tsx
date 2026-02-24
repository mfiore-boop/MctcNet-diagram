import React from 'react';
import { Equipment } from '../types/equipment';
import { cn } from '../lib/utils';
import { X, Trash2 } from 'lucide-react';

interface EquipmentDetailsPanelProps {
  equipment: Equipment;
  allEquipment: Equipment[];
  onUpdate: (id: string, updates: Partial<Equipment>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function EquipmentDetailsPanel({ equipment, allEquipment, onUpdate, onDelete, onClose }: EquipmentDetailsPanelProps) {
  const selectedItem = equipment;

  const handleUpdateItem = (id: string, updates: Partial<Equipment>) => {
    onUpdate(id, updates);
  };

  return (
    <div className="w-80 bg-carbon-gray-10 border-l border-carbon-gray-20 overflow-y-auto p-8 z-20 h-full absolute right-0 top-0 shadow-xl flex flex-col">
      <div className="flex justify-between items-center mb-8 border-b border-carbon-gray-20 pb-2">
        <h3 className="text-sm font-bold text-carbon-gray-100 uppercase tracking-widest">Dettagli Strumento</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => onDelete(selectedItem.id)}
            className="text-carbon-gray-80 hover:text-red-600 transition-colors"
            title="Elimina Strumento"
          >
            <Trash2 size={20} />
          </button>
          <button onClick={onClose} className="text-carbon-gray-80 hover:text-carbon-gray-100">
            <X size={20} />
          </button>
        </div>
      </div>
      
      <div className="space-y-6 flex-1">
        {selectedItem.type === 'PC' ? (
          <div className="space-y-6">
            {/* PC Type Selector */}
            <div className="bg-white p-4 border border-carbon-gray-20 mb-6">
              <label className="block text-[10px] font-bold text-carbon-gray-80 uppercase tracking-widest mb-3">Tipo PC</label>
              <div className="flex">
                  <button
                    onClick={() => {
                      handleUpdateItem(selectedItem.id, { 
                          name: selectedItem.name.includes('Stazione') ? selectedItem.name : 'PC Stazione',
                          isServer: false 
                      });
                    }}
                    className={cn(
                      "flex-1 py-2 px-3 text-[10px] font-bold border transition-all uppercase tracking-widest",
                      selectedItem.name.includes('Stazione')
                        ? "bg-carbon-blue-60 border-carbon-blue-60 text-white" 
                        : "bg-white border-carbon-gray-20 text-carbon-gray-80 hover:bg-carbon-gray-10"
                    )}
                  >
                    STAZIONE
                  </button>
                  <button
                    onClick={() => {
                        const newName = selectedItem.name.includes('Stazione') ? 'PCP Client' : selectedItem.name;
                        handleUpdateItem(selectedItem.id, { name: newName });
                    }}
                    className={cn(
                      "flex-1 py-2 px-3 text-[10px] font-bold border-t border-b border-r transition-all uppercase tracking-widest",
                      !selectedItem.name.includes('Stazione')
                        ? "bg-carbon-blue-60 border-carbon-blue-60 text-white" 
                        : "bg-white border-carbon-gray-20 text-carbon-gray-80 hover:bg-carbon-gray-10"
                    )}
                  >
                    PRENOTAZIONE
                  </button>
              </div>
            </div>

            {/* Common Fields */}
            <div>
              <label className="block text-[10px] font-bold text-carbon-gray-80 uppercase tracking-widest mb-1">Produttore</label>
              <input 
                type="text" 
                value={selectedItem.manufacturer || ''}
                onChange={(e) => handleUpdateItem(selectedItem.id, { manufacturer: e.target.value })}
                className="w-full px-3 py-2 bg-white border-b border-carbon-gray-80 focus:border-carbon-blue-60 outline-none transition-all text-sm font-light"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-carbon-gray-80 uppercase tracking-widest mb-1">Nome Prodotto</label>
              <input 
                type="text" 
                value={selectedItem.name}
                onChange={(e) => handleUpdateItem(selectedItem.id, { name: e.target.value })}
                className="w-full px-3 py-2 bg-white border-b border-carbon-gray-80 focus:border-carbon-blue-60 outline-none transition-all text-sm font-light"
              />
            </div>

              <div>
                <label className="block text-[10px] font-bold text-carbon-gray-80 uppercase tracking-widest mb-1">N° Approvazione</label>
                <input 
                  type="text" 
                  value={selectedItem.approval || ''}
                  onChange={(e) => handleUpdateItem(selectedItem.id, { approval: e.target.value })}
                  className="w-full px-3 py-2 bg-white border-b border-carbon-gray-80 focus:border-carbon-blue-60 outline-none transition-all font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-carbon-gray-80 uppercase tracking-widest mb-1">Data Approvazione</label>
                <input 
                  type="text" 
                  value={selectedItem.approvalDate || ''}
                  onChange={(e) => handleUpdateItem(selectedItem.id, { approvalDate: e.target.value })}
                  placeholder="GG/MM/AAAA"
                  className="w-full px-3 py-2 bg-white border-b border-carbon-gray-80 focus:border-carbon-blue-60 outline-none transition-all font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-carbon-gray-80 uppercase tracking-widest mb-1">Versione Software</label>
                <input 
                  type="text" 
                  value={selectedItem.softwareVersion || ''}
                  onChange={(e) => handleUpdateItem(selectedItem.id, { softwareVersion: e.target.value })}
                  className="w-full px-3 py-2 bg-white border-b border-carbon-gray-80 focus:border-carbon-blue-60 outline-none transition-all font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-carbon-gray-80 uppercase tracking-widest mb-1">N° Licenza</label>
                <input 
                  type="text" 
                  value={selectedItem.licenseNumber || ''}
                  onChange={(e) => handleUpdateItem(selectedItem.id, { licenseNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-white border-b border-carbon-gray-80 focus:border-carbon-blue-60 outline-none transition-all font-mono text-xs"
                />
              </div>

            {/* PC Prenotazione Specific */}
            {!selectedItem.name.includes('Stazione') && (
              <div className="pt-4 border-t border-carbon-gray-20">
                <label className="block text-[10px] font-bold text-carbon-gray-80 uppercase tracking-widest mb-3">Postazione Server/Client</label>
                <div className="flex">
                  <button
                    onClick={() => handleUpdateItem(selectedItem.id, { isServer: true })}
                    className={cn(
                      "flex-1 py-2 px-3 text-[10px] font-bold border transition-all uppercase tracking-widest",
                      selectedItem.isServer 
                        ? "bg-carbon-gray-100 text-white border-carbon-gray-100" 
                        : "bg-white border-carbon-gray-20 text-carbon-gray-80 hover:bg-carbon-gray-10"
                    )}
                  >
                    Server
                  </button>
                  <button
                    onClick={() => handleUpdateItem(selectedItem.id, { isServer: false })}
                    className={cn(
                      "flex-1 py-2 px-3 text-[10px] font-bold border-t border-b border-r transition-all uppercase tracking-widest",
                      !selectedItem.isServer 
                        ? "bg-carbon-gray-100 text-white border-carbon-gray-100" 
                        : "bg-white border-carbon-gray-20 text-carbon-gray-80 hover:bg-carbon-gray-10"
                    )}
                  >
                    Client
                  </button>
                </div>
              </div>
            )}

            {/* PC Stazione Specific */}
            {selectedItem.name.includes('Stazione') && (
              <div className="pt-4 border-t border-carbon-gray-20">
                  <label className="block text-[10px] font-bold text-carbon-gray-80 uppercase tracking-widest mb-1">N° Linea</label>
                  <input 
                      type="text" 
                      value={selectedItem.location || 'Linea 1'}
                      onChange={(e) => handleUpdateItem(selectedItem.id, { location: e.target.value })}
                      className="w-full px-3 py-2 bg-white border-b border-carbon-gray-80 focus:border-carbon-blue-60 outline-none transition-all text-sm font-light"
                  />
              </div>
            )}

            {/* Connection Protocol */}
            <div className="pt-4 border-t border-carbon-gray-20">
              <label className="block text-[10px] font-bold text-carbon-gray-80 uppercase tracking-widest mb-1">Protocollo</label>
              <select 
                value={selectedItem.connectionProtocol}
                onChange={(e) => handleUpdateItem(selectedItem.id, { connectionProtocol: e.target.value as any })}
                className="w-full px-3 py-2 bg-white border-b border-carbon-gray-80 focus:border-carbon-blue-60 outline-none transition-all text-sm font-light appearance-none"
              >
                <option value="RETE">RETE (LAN)</option>
                <option value="RS">RS (SERIALE)</option>
                <option value="DIR">DIR (DIRETTO)</option>
              </select>
            </div>
          </div>
        ) : (
          // Standard view for Instruments
          <>
            <div>
              <label className="block text-[10px] font-bold text-carbon-gray-80 uppercase tracking-widest mb-1">Nome</label>
              <input 
                type="text" 
                value={selectedItem.name}
                onChange={(e) => handleUpdateItem(selectedItem.id, { name: e.target.value })}
                className="w-full px-3 py-2 bg-white border-b border-carbon-gray-80 focus:border-carbon-blue-60 outline-none transition-all text-sm font-light"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-carbon-gray-80 uppercase tracking-widest mb-1">Produttore</label>
              <input 
                type="text" 
                value={selectedItem.manufacturer}
                onChange={(e) => handleUpdateItem(selectedItem.id, { manufacturer: e.target.value })}
                className="w-full px-3 py-2 bg-white border-b border-carbon-gray-80 focus:border-carbon-blue-60 outline-none transition-all text-sm font-light"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-carbon-gray-80 uppercase tracking-widest mb-1">Omologazione</label>
              <textarea 
                value={selectedItem.approval}
                onChange={(e) => handleUpdateItem(selectedItem.id, { approval: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 bg-white border-b border-carbon-gray-80 focus:border-carbon-blue-60 outline-none transition-all font-mono text-xs resize-y"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-carbon-gray-80 uppercase tracking-widest mb-1">Seriale</label>
                <input 
                  type="text" 
                  value={selectedItem.serialNumber}
                  onChange={(e) => handleUpdateItem(selectedItem.id, { serialNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-white border-b border-carbon-gray-80 focus:border-carbon-blue-60 outline-none transition-all font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-carbon-gray-80 uppercase tracking-widest mb-1">Scadenza</label>
                <input 
                  type="text" 
                  value={selectedItem.expirationDate || ''}
                  onChange={(e) => handleUpdateItem(selectedItem.id, { expirationDate: e.target.value })}
                  placeholder="GG/MM/AAAA"
                  className="w-full px-3 py-2 bg-white border-b border-carbon-gray-80 focus:border-carbon-blue-60 outline-none transition-all font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-carbon-gray-80 uppercase tracking-widest mb-1">Protocollo</label>
              <select 
                value={selectedItem.connectionProtocol}
                onChange={(e) => handleUpdateItem(selectedItem.id, { connectionProtocol: e.target.value as any })}
                className="w-full px-3 py-2 bg-white border-b border-carbon-gray-80 focus:border-carbon-blue-60 outline-none transition-all text-sm font-light appearance-none"
              >
                <option value="RETE">RETE (LAN)</option>
                <option value="RS">RS (SERIALE)</option>
                <option value="DIR">DIR (DIRETTO)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-carbon-gray-80 uppercase tracking-widest mb-1">Collegato a</label>
              <select 
                value={selectedItem.connectedTo || ''}
                onChange={(e) => handleUpdateItem(selectedItem.id, { connectedTo: e.target.value || undefined })}
                className="w-full px-3 py-2 bg-white border-b border-carbon-gray-80 focus:border-carbon-blue-60 outline-none transition-all text-sm font-light appearance-none"
              >
                <option value="">-- Nessuno (Root/Server) --</option>
                
                <optgroup label="PC e Server">
                  {allEquipment
                    .filter(eq => eq.id !== selectedItem.id && eq.type === 'PC')
                    .map(eq => (
                    <option key={eq.id} value={eq.id}>
                      {eq.isServer ? '[SERVER] ' : '[PC] '}{eq.name}
                    </option>
                  ))}
                </optgroup>

                <optgroup label="Altri Dispositivi">
                  {allEquipment
                    .filter(eq => eq.id !== selectedItem.id && eq.type !== 'PC')
                    .map(eq => (
                    <option key={eq.id} value={eq.id}>
                      {eq.name}
                    </option>
                  ))}
                </optgroup>
              </select>
              <p className="text-[9px] text-carbon-gray-80 mt-2 font-light leading-tight">
                Seleziona il PC o il dispositivo a cui questo strumento è fisicamente collegato.
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-carbon-gray-80 uppercase tracking-widest mb-1">Capacità Veicolo</label>
              <select 
                value={selectedItem.vehicleCapability || 'UNIVERSAL'}
                onChange={(e) => handleUpdateItem(selectedItem.id, { vehicleCapability: e.target.value as any })}
                className="w-full px-3 py-2 bg-white border-b border-carbon-gray-80 focus:border-carbon-blue-60 outline-none transition-all text-sm font-light appearance-none"
              >
                <option value="UNIVERSAL">Universale</option>
                <option value="AUTO">Auto</option>
                <option value="MOTO">Moto</option>
                <option value="AUTO_MOTO">Auto e Moto</option>
                <option value="AUTO_2_3_4">Auto + 2/3/4 Ruote</option>
                <option value="MOTO_3_4">Moto 3/4 Ruote</option>
                <option value="AUTO_3_4">Auto 3/4 Ruote</option>
                <option value="MOTO_2_3_4">Moto 2/3/4 Ruote</option>
              </select>
            </div>

            {(selectedItem.name?.includes('RT') || selectedItem.rtType) && (
              <div>
                <label className="block text-[10px] font-bold text-carbon-gray-80 uppercase tracking-widest mb-1">Modalità Telecamera</label>
                <select 
                  value={selectedItem.rtType || 'UNIVERSALE'}
                  onChange={(e) => handleUpdateItem(selectedItem.id, { rtType: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white border-b border-carbon-gray-80 focus:border-carbon-blue-60 outline-none transition-all text-sm font-light appearance-none"
                >
                  <option value="UNIVERSALE">Universale</option>
                  <option value="POSTERIORE">Posteriore</option>
                </select>
              </div>
            )}

            <div className="pt-4 border-t border-carbon-gray-20">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox"
                    checked={selectedItem.isIntegrated || false}
                    onChange={(e) => handleUpdateItem(selectedItem.id, { isIntegrated: e.target.checked })}
                    className="w-4 h-4 text-carbon-blue-60 border-carbon-gray-80 focus:ring-0 cursor-pointer"
                  />
                </div>
                <span className="text-xs text-carbon-gray-100 font-normal uppercase tracking-tight">Contagiri Integrato</span>
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
