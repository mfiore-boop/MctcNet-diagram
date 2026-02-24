/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FileUploader } from './components/FileUploader';
import { DiagramView } from './components/DiagramView';
import { EquipmentList } from './components/EquipmentList';
import { ReportView } from './components/ReportView';
import { Equipment } from './types/equipment';
import { parseRevFile, generateMockData } from './lib/parser';
import { generateAutoLine, generateAutoMotoLine, generateAutoMoto34Line } from './lib/templates';
import { generatePDF } from './lib/pdf';
import { LayoutDashboard, Network, FileText, Database, Download, Printer, Menu } from 'lucide-react';
import { cn } from './lib/utils';

type ViewMode = 'dashboard' | 'diagram' | 'list' | 'report';

function App() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Diagram State
  const [layoutDirection, setLayoutDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const [showDetails, setShowDetails] = useState(true);

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;
    setIsLoading(true);
    try {
      const file = files[0];
      
      // Check if JSON
      if (file.name.endsWith('.json') || file.type === 'application/json') {
        const text = await file.text();
        const data = JSON.parse(text);
        if (Array.isArray(data)) {
          setEquipment(data);
          setViewMode('diagram');
        } else {
          alert("Formato JSON non valido: deve essere un array di attrezzature.");
        }
      } else {
        // Assume .rev/.sav
        const data = await parseRevFile(file);
        setEquipment(data);
        setViewMode('diagram');
      }
    } catch (error) {
      console.error("Error parsing file:", error);
      alert("Errore durante la lettura del file. Verifica il formato.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadDemoData = () => {
    setEquipment(generateMockData());
    setViewMode('diagram');
  };

  const handleManualUpdate = (updatedEquipment: Equipment[]) => {
    setEquipment(updatedEquipment);
    // Stay in diagram view
  };

  const handleExportSchema = () => {
    const json = JSON.stringify(equipment, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schema_mctc_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = async () => {
    // We need to be in Report mode to capture the full content
    const previousMode = viewMode;
    if (viewMode !== 'report') {
      setViewMode('report');
      // Wait for render - ReactFlow needs time to layout nodes
      await new Promise(resolve => setTimeout(resolve, 1500));
    } else {
      // Even if already in report mode, give it a moment if just switched
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    await generatePDF('report-content', `report_mctc_${new Date().toISOString().split('T')[0]}.pdf`);

    // Optional: Switch back? Maybe stay in report mode to let them see what they downloaded.
    // setViewMode(previousMode); 
  };

  return (
    <div className="min-h-screen bg-white flex font-sans">
      {/* Sidebar - Carbon SideNav style */}
      <aside className={cn(
        "bg-carbon-gray-100 text-white fixed inset-y-0 left-0 z-30 flex flex-col print:hidden transition-all duration-300 ease-in-out overflow-hidden",
        isSidebarOpen ? "w-64" : "w-12"
      )}>
        <div className={cn(
          "h-12 flex items-center border-b border-carbon-gray-80 transition-all",
          isSidebarOpen ? "px-4 justify-between" : "justify-center px-0"
        )}>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-carbon-blue-60 shrink-0" />
            {isSidebarOpen && <span className="font-semibold text-sm tracking-widest uppercase whitespace-nowrap">Net2 Config</span>}
          </div>
        </div>

        <nav className="flex-1 py-4 overflow-hidden">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'diagram', icon: Network, label: 'Diagramma' },
            { id: 'list', icon: FileText, label: 'Elenco' },
            { id: 'report', icon: Printer, label: 'Report Completo' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setViewMode(item.id as ViewMode)}
              className={cn(
                "w-full flex items-center gap-3 py-3 text-sm transition-colors border-l-4",
                isSidebarOpen ? "px-4" : "justify-center px-0",
                viewMode === item.id 
                  ? "bg-carbon-gray-80 border-carbon-blue-60 text-white" 
                  : "text-carbon-gray-20 border-transparent hover:bg-carbon-gray-90 hover:text-white"
              )}
              title={!isSidebarOpen ? item.label : undefined}
            >
              <item.icon size={18} className="shrink-0" />
              {isSidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className={cn("p-4 bg-carbon-gray-90", !isSidebarOpen && "p-2 flex justify-center")}>
          {isSidebarOpen ? (
            <div className="flex items-center justify-between text-[10px] text-carbon-gray-20 uppercase tracking-widest">
              <span>Status</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500"></span>
                Online
              </span>
            </div>
          ) : (
             <span className="w-2 h-2 bg-emerald-500 rounded-full" title="Online"></span>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 min-h-screen flex flex-col print:ml-0 print:p-0 transition-all duration-300 ease-in-out",
        isSidebarOpen ? "ml-64" : "ml-12"
      )}>
        {/* Carbon Header */}
        <header className="h-12 bg-carbon-gray-100 text-white flex items-center justify-between px-6 sticky top-0 z-20 print:hidden">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1 hover:bg-carbon-gray-80 rounded-sm transition-colors mr-2"
              title={isSidebarOpen ? "Chiudi Menu" : "Apri Menu"}
            >
              <Menu size={20} />
            </button>
            <h1 className="text-sm font-normal tracking-tight">
              {viewMode === 'dashboard' && 'Caricamento Configurazione'}
              {viewMode === 'diagram' && 'Schema Collegamenti'}
              {viewMode === 'list' && 'Inventario Attrezzature'}
              {viewMode === 'report' && 'Report Completo'}
            </h1>
          </div>
          
          {equipment.length > 0 && (
            <div className="flex items-center h-full">
              <button
                onClick={handleExportSchema}
                className="h-full px-4 text-sm hover:bg-carbon-gray-80 transition-colors flex items-center gap-2 border-r border-carbon-gray-80"
              >
                <Download size={16} />
                Esporta
              </button>
              
              <button
                onClick={handleDownloadPDF}
                className="h-full px-4 text-sm bg-carbon-blue-60 hover:bg-carbon-blue-70 transition-colors flex items-center gap-2"
              >
                <FileText size={16} />
                Scarica PDF
              </button>
              
              <div className="px-4 flex items-center gap-2 bg-carbon-gray-90 h-full">
                <span className="text-xs font-bold text-carbon-blue-60">{equipment.length}</span>
                <span className="text-[10px] text-carbon-gray-20 uppercase tracking-tighter">Dispositivi</span>
              </div>
            </div>
          )}
        </header>

        <div className="p-8 flex-1">
          {viewMode === 'dashboard' && (
            <div className="max-w-6xl mx-auto mt-8">
              <div className="mb-8 border-b border-carbon-gray-20 pb-6">
                <h2 className="text-3xl font-light text-carbon-gray-100 mb-2">Net2 Configurator</h2>
                <p className="text-carbon-gray-80 font-light">Importa i file di configurazione per generare il diagramma tecnico della rete MCTC Net2.</p>
              </div>

              <div className="mb-8">
                <FileUploader onFileUpload={handleFileUpload} isLoading={isLoading} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="bg-carbon-gray-10 border border-carbon-gray-20 flex flex-col">
                  <div className="p-4 border-b border-carbon-gray-20">
                    <h3 className="text-sm font-semibold text-carbon-gray-100">Modelli Predefiniti</h3>
                  </div>
                  <div className="p-4 space-y-3 flex-1">
                    <button
                      onClick={() => {
                        setEquipment(generateAutoLine());
                        setViewMode('diagram');
                      }}
                      className="w-full carbon-btn-primary justify-between"
                    >
                      <span>Linea Auto</span>
                      <Network size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setEquipment(generateAutoMotoLine());
                        setViewMode('diagram');
                      }}
                      className="w-full carbon-btn-primary justify-between"
                    >
                      <span>Linea Auto e Moto</span>
                      <Network size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setEquipment(generateAutoMoto34Line());
                        setViewMode('diagram');
                      }}
                      className="w-full carbon-btn-primary justify-between"
                    >
                      <span>Linea Completa</span>
                      <Network size={16} />
                    </button>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-carbon-gray-10 border border-carbon-gray-20 flex flex-col">
                  <div className="p-4 border-b border-carbon-gray-20">
                    <h3 className="text-sm font-semibold text-carbon-gray-100">Azioni Rapide</h3>
                  </div>
                  <div className="p-4 space-y-3 flex-1">
                    <button
                      onClick={() => {
                        setEquipment([]);
                        setViewMode('diagram');
                      }}
                      className="w-full carbon-btn-secondary justify-between"
                    >
                      <span>Crea Manualmente</span>
                      <LayoutDashboard size={16} />
                    </button>
                    <button
                      onClick={loadDemoData}
                      className="w-full carbon-btn-ghost justify-between bg-white border border-carbon-gray-20"
                    >
                      <span>Carica Dati Demo</span>
                      <Database size={16} />
                    </button>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="bg-carbon-gray-100 text-white border border-carbon-gray-100 flex flex-col">
                  <div className="p-4 border-b border-carbon-gray-80">
                    <h3 className="text-sm font-semibold text-white">Informazioni di Sistema</h3>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <p className="text-sm text-carbon-gray-20 font-light leading-relaxed flex-1">
                      L'applicazione supporta lo standard MCTC Net2 per la visualizzazione delle catene metrologiche, dei collegamenti di rete e la generazione di report PDF conformi.
                    </p>
                    <div className="mt-4 pt-4 border-t border-carbon-gray-80 flex justify-between items-center text-xs text-carbon-gray-20">
                      <span>Versione 3.0</span>
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500"></span> Online</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'diagram' && (
            <div className="animate-in fade-in duration-300 h-[calc(100vh-10rem)]">
              <DiagramView 
                equipment={equipment} 
                layoutDirection={layoutDirection}
                onLayoutChange={setLayoutDirection}
                showDetails={showDetails}
                onShowDetailsChange={setShowDetails}
                onEquipmentUpdate={handleManualUpdate}
              />
            </div>
          )}

          {viewMode === 'list' && (
            <div className="animate-in fade-in duration-300">
              <EquipmentList 
                equipment={equipment} 
                onDownloadReport={handleDownloadPDF}
              />
            </div>
          )}

          {viewMode === 'report' && (
            <div className="animate-in fade-in duration-300">
              <ReportView 
                equipment={equipment} 
                layoutDirection={layoutDirection}
                showDetails={showDetails}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
