import React from 'react';
import { Equipment } from '../types/equipment';

interface MCTCReportTableProps {
  equipment: Equipment[];
}

export function MCTCReportTable({ equipment }: MCTCReportTableProps) {
  // Helper to find equipment by type or criteria
  const findEquipment = (predicate: (e: Equipment) => boolean) => {
    return equipment.find(predicate);
  };

  const pcPrenotazione = findEquipment(e => e.type === 'PC' && !!e.isServer);
  const pcStazione = findEquipment(e => e.type === 'PC' && !e.isServer);
  const brakeTester = findEquipment(e => e.type === 'BRAKE_TESTER');
  const gasAnalyzer = findEquipment(e => e.type === 'GAS_ANALYZER');
  const smokeMeter = findEquipment(e => e.type === 'SMOKE_METER');
  const soundLevelMeter = findEquipment(e => e.type === 'SOUND_LEVEL_METER');

  // Helper to format date DDMMYYYY -> DD/MM/YYYY
  const formatDate = (dateStr?: string) => {
    if (!dateStr || dateStr.length !== 8) return dateStr || '';
    return `${dateStr.substring(0, 2)}/${dateStr.substring(2, 4)}/${dateStr.substring(4)}`;
  };

  const renderSectionHeader = (title: string) => (
    <div className="bg-carbon-gray-100 border border-carbon-gray-100 font-bold text-center py-2 text-[10px] text-white uppercase tracking-widest">
      {title}
    </div>
  );

  const renderRow = (labels: string[], values: (string | undefined)[]) => (
    <div className="flex border-l border-black border-r border-b">
      {labels.map((label, idx) => (
        <div key={idx} className="flex-1 border-r border-black last:border-r-0">
          <div className="bg-gray-100 border-b border-black px-1 py-0.5 text-[10px] font-semibold h-8 flex items-center">
            {label}
          </div>
          <div className="px-1 py-1 text-xs h-8 flex items-center bg-white">
            {values[idx] || ''}
          </div>
        </div>
      ))}
    </div>
  );

  // Custom row renderer for specific grid layouts (like PC Prenotazione)
  const renderPCRow = (eq: Equipment | undefined, type: 'PCP' | 'PCS') => {
    return (
      <div className="border border-carbon-gray-20 border-t-0 text-[10px]">
        <div className="flex border-b border-carbon-gray-20">
          <div className="w-1/6 border-r border-carbon-gray-20 p-2 bg-carbon-gray-10 font-bold text-carbon-gray-100 uppercase tracking-tight">Produttore</div>
          <div className="w-1/6 border-r border-carbon-gray-20 p-2 bg-carbon-gray-10 font-bold text-carbon-gray-100 uppercase tracking-tight">Nome prodotto</div>
          <div className="w-1/6 border-r border-carbon-gray-20 p-2 bg-carbon-gray-10 font-bold text-carbon-gray-100 uppercase tracking-tight">N° Approvazione</div>
          <div className="w-1/6 border-r border-carbon-gray-20 p-2 bg-carbon-gray-10 font-bold text-carbon-gray-100 uppercase tracking-tight">Data Approvazione</div>
          <div className="w-1/6 border-r border-carbon-gray-20 p-2 bg-carbon-gray-10 font-bold text-carbon-gray-100 uppercase tracking-tight">Versione software</div>
          <div className="w-1/12 border-r border-carbon-gray-20 p-2 bg-carbon-gray-10 font-bold text-carbon-gray-100 uppercase tracking-tight">N° licenza</div>
          <div className="w-1/12 p-2 bg-carbon-gray-10 font-bold text-carbon-gray-100 uppercase tracking-tight">
            {type === 'PCP' ? 'Postazione' : 'N° Linea'}
          </div>
        </div>
        <div className="flex min-h-[2.5rem] bg-white">
          <div className="w-1/6 border-r border-carbon-gray-20 p-2 text-carbon-gray-80 font-light uppercase">{eq?.manufacturer}</div>
          <div className="w-1/6 border-r border-carbon-gray-20 p-2 text-carbon-gray-80 font-light uppercase">{eq?.code || eq?.name}</div>
          <div className="w-1/6 border-r border-carbon-gray-20 p-2 text-carbon-gray-100 font-mono">{eq?.approval}</div>
          <div className="w-1/6 border-r border-carbon-gray-20 p-2 text-carbon-gray-100 font-mono">{formatDate(eq?.approvalDate)}</div>
          <div className="w-1/6 border-r border-carbon-gray-20 p-2 text-carbon-gray-100 font-mono">{eq?.softwareVersion}</div>
          <div className="w-1/12 border-r border-carbon-gray-20 p-2 text-carbon-gray-100 font-mono">{eq?.licenseNumber || eq?.serialNumber}</div>
          <div className="w-1/12 p-2 text-carbon-gray-100 font-bold uppercase">{type === 'PCP' ? 'Server' : '1'}</div>
        </div>
      </div>
    );
  };

  const renderInstrumentRow = (eq: Equipment | undefined, title: string, extraLabel: string = "Tipo configurazione", extraValue: string = "") => {
    return (
      <div className="mb-6">
        {renderSectionHeader(title)}
        <div className="border border-carbon-gray-20 border-t-0 text-[10px]">
          <div className="flex border-b border-carbon-gray-20">
            <div className="w-1/6 border-r border-carbon-gray-20 p-2 bg-carbon-gray-10 font-bold text-carbon-gray-100 uppercase tracking-tight">Costruttore</div>
            <div className="w-1/6 border-r border-carbon-gray-20 p-2 bg-carbon-gray-10 font-bold text-carbon-gray-100 uppercase tracking-tight">Nome prodotto</div>
            <div className="w-1/6 border-r border-carbon-gray-20 p-2 bg-carbon-gray-10 font-bold text-carbon-gray-100 uppercase tracking-tight">Omologazione</div>
            <div className="w-1/6 border-r border-carbon-gray-20 p-2 bg-carbon-gray-10 font-bold text-carbon-gray-100 uppercase tracking-tight">Numero di serie</div>
            <div className="w-1/6 border-r border-carbon-gray-20 p-2 bg-carbon-gray-10 font-bold text-carbon-gray-100 uppercase tracking-tight">Versione software</div>
            <div className="w-1/6 p-2 bg-carbon-gray-10 font-bold text-carbon-gray-100 uppercase tracking-tight">{extraLabel}</div>
          </div>
          <div className="flex min-h-[2.5rem] bg-white">
            <div className="w-1/6 border-r border-carbon-gray-20 p-2 text-carbon-gray-80 font-light uppercase">{eq?.manufacturer}</div>
            <div className="w-1/6 border-r border-carbon-gray-20 p-2 text-carbon-gray-80 font-light uppercase">{eq?.code || eq?.name}</div>
            <div className="w-1/6 border-r border-carbon-gray-20 p-2 text-carbon-gray-100 font-mono">{eq?.approval}</div>
            <div className="w-1/6 border-r border-carbon-gray-20 p-2 text-carbon-gray-100 font-mono">{eq?.serialNumber}</div>
            <div className="w-1/6 border-r border-carbon-gray-20 p-2 text-carbon-gray-100 font-mono">{eq?.softwareVersion}</div>
            <div className="w-1/6 p-2 text-carbon-gray-100 font-bold uppercase">{extraValue}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-white text-carbon-gray-100 font-sans p-8 border border-carbon-gray-20">
      <div className="border-b-2 border-carbon-gray-100 mb-6 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-widest text-carbon-blue-60">MCTCNet 2</h1>
          <p className="text-xs text-carbon-gray-80 font-light">Allegato 1 - Schema di Collegamento</p>
        </div>
        <div className="text-right text-[10px] font-bold uppercase tracking-widest text-carbon-gray-80">
          Versione 1.0.4
        </div>
      </div>

      <div className="bg-carbon-gray-10 border border-carbon-gray-20 p-4 text-center font-bold mb-8 text-xs uppercase tracking-widest text-carbon-gray-100">
        SCHEMA DI COLLEGAMENTO MCTCNet DELLA LINEA DI REVISIONE
      </div>

      <div className="grid grid-cols-2 gap-6 mb-10">
        <div className="border border-carbon-gray-20 p-4 bg-carbon-gray-10">
          <h4 className="text-[10px] font-bold text-carbon-gray-80 uppercase tracking-widest mb-2 border-b border-carbon-gray-20 pb-1">Dati Centro</h4>
          <p className="text-xs text-carbon-gray-100 font-light italic">Dati del centro di revisione autorizzato</p>
        </div>
        <div className="border border-carbon-gray-20 p-4 bg-carbon-gray-10">
          <h4 className="text-[10px] font-bold text-carbon-gray-80 uppercase tracking-widest mb-2 border-b border-carbon-gray-20 pb-1">Responsabili Tecnici</h4>
          <p className="text-xs text-carbon-gray-100 font-light italic">Elenco dei Responsabili Tecnici abilitati</p>
        </div>
      </div>

      <h3 className="text-center font-bold mb-6 uppercase tracking-[0.2em] text-sm text-carbon-gray-100 border-b border-carbon-gray-20 pb-2">Attrezzature in uso</h3>

      <div className="space-y-8">
        {/* PC Prenotazione */}
        <div>
          {renderSectionHeader('PC Prenotazione')}
          {renderPCRow(pcPrenotazione, 'PCP')}
        </div>

        {/* PC Stazione */}
        <div>
          {renderSectionHeader('PC Stazione')}
          {renderPCRow(pcStazione, 'PCS')}
        </div>

        {/* Instruments */}
        {renderInstrumentRow(brakeTester, 'Banco prova freni', 'Capacità Veicolo', brakeTester?.vehicleCapability || '')}
        {renderInstrumentRow(gasAnalyzer, 'Analizzatore dei Gas')}
        {renderInstrumentRow(smokeMeter, 'Opacimetro')}
        {renderInstrumentRow(soundLevelMeter, 'Fonometro')}
      </div>
      
      <div className="mt-12 text-[9px] text-right border-t border-carbon-gray-20 pt-2 text-carbon-gray-80 uppercase tracking-widest">
        Testo Unico MCTC Net2 - Documentazione Tecnica Ministeriale
      </div>
    </div>
  );
}
