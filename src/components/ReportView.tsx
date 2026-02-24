import React from 'react';
import { DiagramView } from './DiagramView';
import { MCTCReportTable } from './MCTCReportTable';
import { Equipment } from '../types/equipment';

interface ReportViewProps {
  equipment: Equipment[];
  layoutDirection: 'horizontal' | 'vertical';
  showDetails: boolean;
}

export function ReportView({ equipment, layoutDirection, showDetails }: ReportViewProps) {
  return (
    <div id="report-content" className="bg-carbon-gray-10 p-8 flex flex-col gap-12 items-center print:p-0 print:bg-white font-sans">
      {/* Page 1: Diagram - Fixed A4 Height */}
      <div className="print-page bg-white shadow-2xl print:shadow-none w-[210mm] h-[297mm] p-[15mm] flex flex-col relative overflow-hidden border border-carbon-gray-20">
        <div className="border-b-2 border-carbon-gray-100 mb-6 pb-4 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-widest text-carbon-blue-60">MCTCNet 2</h1>
            <p className="text-xs text-carbon-gray-80 font-light italic">Schema di Collegamento della Linea di Revisione</p>
          </div>
          <div className="text-right text-[10px] font-bold uppercase tracking-widest text-carbon-gray-80">
            Tavola 01 / 02
          </div>
        </div>

        <div className="flex-1 border border-carbon-gray-20 overflow-hidden relative min-h-0 bg-carbon-gray-10">
          {equipment.length > 0 ? (
            <DiagramView 
              equipment={equipment} 
              layoutDirection={layoutDirection} 
              onLayoutChange={() => {}} 
              showDetails={showDetails} 
              onShowDetailsChange={() => {}}
              className="w-full h-full border-none"
              readOnly={true}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-carbon-gray-40 text-sm uppercase tracking-widest">
              Nessuno schema presente
            </div>
          )}
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-4 text-[9px] uppercase tracking-widest text-carbon-gray-80 font-bold">
          <div className="border-t border-carbon-gray-20 pt-2">Data: {new Date().toLocaleDateString('it-IT')}</div>
          <div className="border-t border-carbon-gray-20 pt-2 text-center">Protocollo: MCTCNet2</div>
          <div className="border-t border-carbon-gray-20 pt-2 text-right">Approvato: RT</div>
        </div>
      </div>

      {/* Page 2: MCTC Report Table - Landscape A4 */}
      <div className="print-page bg-white shadow-2xl print:shadow-none w-[297mm] min-h-[210mm] p-[15mm] flex flex-col relative print:landscape border border-carbon-gray-20">
        <style>{`
          @media print {
            @page {
              size: auto; 
              margin: 0mm;
            }
            .print-page {
              break-after: page;
            }
          }
        `}</style>
        <MCTCReportTable equipment={equipment} />
        <div className="mt-6 text-[9px] text-center text-carbon-gray-80 uppercase tracking-widest font-bold">
          Tavola 02 / 02 - Dettaglio Componenti ed Omologazioni
        </div>
      </div>
    </div>
  );
}
