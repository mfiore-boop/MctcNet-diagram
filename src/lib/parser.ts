import { Equipment, EquipmentType } from '../types/equipment';

export const parseRevFile = async (file: File): Promise<Equipment[]> => {
  let text = "";
  try {
    text = await file.text();
  } catch (e) {
    console.error("Error reading file text:", e);
    throw new Error("Impossibile leggere il file. Potrebbe essere binario o corrotto.");
  }

  // MCTCNet2 .sav/.rev Format Parser
  // Structure: <rev:test tipo="TYPE" ...> [INI_CONTENT] </rev:test>
  // Plus global sections like [DatiPCPrenotazione] outside tags.

  const equipmentList: Equipment[] = [];
  const rawSections: { type: string, content: string }[] = [];

  // 1. Extract <rev:test> blocks
  const blockRegex = /<rev:test\s+tipo="([^"]+)"[^>]*>([\s\S]*?)<\/rev:test>/gi;
  let match;
  while ((match = blockRegex.exec(text)) !== null) {
    rawSections.push({ type: match[1].toUpperCase(), content: match[2] });
  }

  // 2. Extract global sections (outside tags, usually at the end)
  // We'll just parse the whole file as INI for global sections, ignoring the XML tags for a moment
  // or better, extract specific global blocks we know of.
  const globalBlocks = ["[DatiPCPrenotazione]", "[DatiCentroRevisione]"];
  let globalContent = text.replace(blockRegex, ""); // Remove the xml blocks to isolate globals

  // Helper to parse INI content
  const parseIni = (iniText: string): Record<string, Record<string, string>> => {
    const data: Record<string, Record<string, string>> = {};
    let currentSection = "root";
    
    iniText.split(/\r?\n/).forEach(line => {
      line = line.trim();
      if (!line || line.startsWith(';') || line.startsWith('#')) return;
      
      if (line.startsWith('[') && line.endsWith(']')) {
        currentSection = line.slice(1, -1);
        if (!data[currentSection]) data[currentSection] = {};
      } else if (line.includes('=')) {
        const firstEq = line.indexOf('=');
        const key = line.substring(0, firstEq).trim();
        const val = line.substring(firstEq + 1).trim();
        if (!data[currentSection]) data[currentSection] = {};
        data[currentSection][key] = val;
      }
    });
    return data;
  };

  // 3. Process Specific Equipment Types

  // --- PC Prenotazione (Global) ---
  const globalIni = parseIni(globalContent);
  let pcpId = "";
  
  if (globalIni['DatiPCPrenotazione']) {
    const pcp = globalIni['DatiPCPrenotazione'];
    pcpId = `pcp-${Date.now()}`;
    equipmentList.push({
      id: pcpId,
      type: 'PC',
      name: 'PC Prenotazione',
      manufacturer: pcp['MarcaPrenotazione'] || 'Unknown',
      code: pcp['ModelloPrenotazione'] || '',
      serialNumber: pcp['NumeroMatricolaPrenotazione'] || '',
      approval: pcp['ApprovazionePrenotazione'] || '',
      location: 'Ufficio',
      status: 'active',
      isServer: true,
      connectionProtocol: 'RETE',
      lastRevision: pcp['DataApprovazionePrenotazione'], // Format usually DDMMYYYY
      approvalDate: pcp['DataApprovazionePrenotazione'],
      softwareVersion: pcp['NumVersionePrenotazione'] || pcp['NumVersioneSoftware'],
      licenseNumber: pcp['NumeroLicenza'] || pcp['NumeroMatricolaPrenotazione'], // Often serial is used as license ref
    });
  }

  // --- PC Stazione (in AC2) ---
  let pcsId = "";
  const ac2Block = rawSections.find(s => s.type === 'AC2');
  if (ac2Block) {
    const ac2Ini = parseIni(ac2Block.content);
    if (ac2Ini['EsitoComplessivo']) {
      const pcs = ac2Ini['EsitoComplessivo'];
      pcsId = `pcs-${Date.now()}`;
      equipmentList.push({
        id: pcsId,
        type: 'PC',
        name: 'PC Stazione',
        manufacturer: pcs['MarcaStazione'] || 'Unknown',
        code: pcs['ModelloStazione'] || '',
        serialNumber: pcs['NumeroMatricolaStazione'] || '',
        approval: pcs['ApprovazioneStazione'] || '',
        location: 'Linea',
        status: 'active',
        isServer: false,
        connectedTo: pcpId || undefined,
        connectionProtocol: 'RETE',
        lastRevision: pcs['DataApprovazioneStazione'],
        approvalDate: pcs['DataApprovazioneStazione'],
        softwareVersion: pcs['NumVersioneStazione'] || pcs['NumVersioneSoftware'],
        licenseNumber: pcs['NumeroLicenza'] || pcs['NumeroMatricolaStazione'],
      });
    }

    // --- Prova Giochi (in AC2) ---
    if (ac2Ini['ProvaGiochi']) {
      const pg = ac2Ini['ProvaGiochi'];
      equipmentList.push({
        id: `pg-${Date.now()}`,
        type: 'PLAY_DETECTOR',
        name: 'Prova Giochi',
        manufacturer: pg['Marca'] || '',
        code: pg['Modello'] || '',
        serialNumber: pg['NumSerie'] || '',
        approval: pg['NumOmologazione'] || '',
        location: 'Linea',
        status: 'active',
        connectedTo: pcsId || undefined, // Usually connected to PCS
        connectionProtocol: 'DIR', // Assumption
        expirationDate: pg['DataScadenza']
      });
    }
  }

  // --- Other Instruments ---
  rawSections.forEach((section, idx) => {
    if (section.type === 'AC2') return; // Handled above

    const ini = parseIni(section.content);
    // Usually the main section has the same name as the tag description, but keys are standard
    // We look for the section that contains 'Marca' or 'MarcaXxx'
    
    let mainSectionKey = Object.keys(ini).find(k => 
      ini[k]['Marca'] || ini[k][`Marca${getSuffix(section.type)}`] || 
      ini[k]['MarcaStrumento'] || ini[k]['CostruttoreObiettivo']
    );

    // Fallback for specific types if generic search fails
    if (!mainSectionKey) {
       if (section.type === 'PFR') mainSectionKey = 'ProvaFreni';
       if (section.type === 'OPA') mainSectionKey = 'AnalisiOpacita';
       if (section.type === 'GAS') mainSectionKey = 'AnalisiGas';
       if (section.type === 'FON') mainSectionKey = 'Fonometro';
       if (section.type === 'FAR') mainSectionKey = 'ProvaFari';
       if (section.type === 'FOT') mainSectionKey = 'FotoTarga';
       if (section.type === 'GOM') mainSectionKey = 'Pneumatici';
       if (section.type === 'VEL') mainSectionKey = 'ProvaVelocita';
    }

    if (mainSectionKey && ini[mainSectionKey]) {
      const data = ini[mainSectionKey];
      const suffix = getSuffix(section.type); // e.g. "Opacimetro" for OPA
      
      const type = mapTagToType(section.type);
      const id = `${section.type.toLowerCase()}-${idx}`;
      
      // Main Instrument
      equipmentList.push({
        id: id,
        type: type,
        name: mapTagToName(section.type),
        manufacturer: data['Marca'] || data[`Marca${suffix}`] || data['MarcaStrumento'] || '',
        code: data['Modello'] || data['Tipo'] || data[`Tipo${suffix}`] || data[`Modello${suffix}`] || data['ModelloStrumento'] || '',
        serialNumber: data['NumSerie'] || data[`NumSerie${suffix}`] || data['NumeroSerieStrumento'] || '',
        approval: data['NumOmologa'] || data[`NumOmologa${suffix}`] || data['Approvazione'] || '',
        location: 'Linea',
        status: 'active',
        connectedTo: pcsId || undefined,
        connectionProtocol: (data['TipoCollegamento'] as any) || 'RS',
        expirationDate: data['DataScadenza'] || data[`DataScadenza${suffix}`] || data[`DataScad${suffix}`],
        softwareVersion: data['NumVersioneSoftware'] || data[`NumVersSoftware${suffix}`] || data['VersioneSoftware'] || '',
        approvalDate: data['DataApprovazione'] || data[`DataApprovazione${suffix}`] || '',
        licenseNumber: data['NumeroLicenza'] || data['NumLicenza'] || '',
      });

      // --- Attached Devices (Contagiri, Calibratore) ---
      
      // Contagiri
      if (data['MarcaContagiri'] || data['NumSerieContagiri']) {
        equipmentList.push({
          id: `${id}-rpm`,
          type: 'OTHER', // RPM Counter
          name: 'Contagiri',
          manufacturer: data['MarcaContagiri'] || '',
          code: data['TipoContagiri'] || data['ModelloContagiri'] || '',
          serialNumber: data['NumSerieContagiri'] || '',
          approval: data['NumOmologaContagiri'] || '',
          location: 'Linea',
          status: 'active',
          connectedTo: id, // Connected to the main instrument
          connectionProtocol: (data['TipoCollegamentoContagiri'] as any) || 'RS',
          isIntegrated: data['TipoCollegamentoContagiri'] === 'INTERNO',
          expirationDate: data['DataScadenzaContagiri'] || data['DataScadContagiri']
        });
      }

      // Calibratore (Fonometro)
      if (data['MarcaCalibratore'] || data['NumSerieCalibratore']) {
        equipmentList.push({
          id: `${id}-cal`,
          type: 'OTHER',
          name: 'Calibratore',
          manufacturer: data['MarcaCalibratore'] || '',
          code: data['ModelloCalibratore'] || '',
          serialNumber: data['NumSerieCalibratore'] || '',
          approval: '', // Not usually present for calibrator in this file
          location: 'Linea',
          status: 'active',
          connectedTo: id,
          connectionProtocol: 'DIR',
          expirationDate: data['DataScadCalibratore']
        });
      }
    }
  });

  if (equipmentList.length === 0) {
    throw new Error("Nessun dato valido trovato nel file .SAV/.REV");
  }

  return equipmentList;
};

// Helpers
const getSuffix = (tag: string): string => {
  switch(tag) {
    case 'OPA': return 'Opacimetro';
    case 'GAS': return 'Gas'; // Often MarcaGas, TipoGas
    case 'FON': return 'Fonometro';
    default: return '';
  }
};

const mapTagToType = (tag: string): EquipmentType => {
  switch(tag) {
    case 'PFR': return 'BRAKE_TESTER';
    case 'GAS': return 'GAS_ANALYZER';
    case 'OPA': return 'SMOKE_METER';
    case 'FAR': return 'HEADLIGHT_TESTER';
    case 'FON': return 'SOUND_LEVEL_METER';
    case 'VEL': return 'SPEED_TESTER';
    case 'GOM': return 'OTHER'; // Tread depth
    case 'FOT': return 'OTHER'; // Camera
    case 'DEC': return 'OTHER'; // Decelerometer
    case 'SOS': return 'OTHER'; // Suspension
    case 'DER': return 'OTHER'; // Side slip
    default: return 'OTHER';
  }
};

const mapTagToName = (tag: string): string => {
  switch(tag) {
    case 'PFR': return 'Banco Prova Freni';
    case 'GAS': return 'Analizzatore Gas';
    case 'OPA': return 'Opacimetro';
    case 'FAR': return 'Centrafari';
    case 'FON': return 'Fonometro';
    case 'VEL': return 'Prova Velocità';
    case 'GOM': return 'Prova Pneumatici';
    case 'FOT': return 'Riconoscimento Targa';
    case 'DEC': return 'Decelerometro';
    case 'SOS': return 'Prova Sospensioni';
    case 'DER': return 'Prova Deriva';
    default: return 'Strumento';
  }
};

export const generateMockData = (): Equipment[] => {
  return [
    {
      id: 'pcp-server',
      type: 'PC',
      name: 'PCP Server',
      code: 'PCP-SRV-G4',
      approval: '413/PCP/RSW/NET2/16/RM',
      approvalDate: '16032016',
      serialNumber: 'SN-SRV-001',
      softwareVersion: '4.0',
      licenseNumber: 'LIC-001',
      location: 'Ufficio',
      status: 'active',
      manufacturer: 'Prisma Informatica',
      connectionProtocol: 'RETE',
      isServer: true,
    },
    {
      id: 'pcs-01',
      type: 'PC',
      name: 'PC Stazione',
      code: 'PCS-01',
      approval: '345/PCS/RSW/NET2/17/RM',
      approvalDate: '24112017',
      serialNumber: 'SN-PCS-001',
      softwareVersion: '3.18.5.0',
      licenseNumber: 'LIC-PCS-001',
      location: 'Linea 1',
      status: 'active',
      manufacturer: 'Prisma Informatica',
      connectionProtocol: 'RETE',
      connectedTo: 'pcp-server',
    },
    {
      id: 'bt-auto-moto',
      type: 'BRAKE_TESTER',
      name: 'Banco prova freni',
      code: 'FR-UNI',
      approval: 'OM-FR-001',
      serialNumber: 'FR-100',
      expirationDate: '19082026',
      softwareVersion: '1.00',
      location: 'Linea 1',
      status: 'active',
      manufacturer: 'Corghi',
      connectionProtocol: 'RETE',
      vehicleCapability: 'AUTO_2_3_4',
      connectedTo: 'pcs-01',
    },
    {
      id: 'gas-auto-moto-int',
      type: 'GAS_ANALYZER',
      name: 'Analizzatore Gas',
      code: 'AGS-UNI',
      approval: 'OM-GAS-001',
      serialNumber: 'GS-100',
      expirationDate: '19082026',
      softwareVersion: '1.00',
      location: 'Linea 1',
      status: 'active',
      manufacturer: 'Texa',
      connectionProtocol: 'RS',
      vehicleCapability: 'AUTO_MOTO',
      isIntegrated: true,
      connectedTo: 'pcs-01',
    },
    {
      id: 'sound-meter',
      type: 'SOUND_LEVEL_METER',
      name: 'Fonometro',
      code: 'SLM-01',
      approval: 'OM-SLM-001',
      serialNumber: 'SLM-100',
      expirationDate: '19082026',
      softwareVersion: '1.00',
      location: 'Linea 1',
      status: 'active',
      manufacturer: 'Bruel',
      connectionProtocol: 'RS',
      connectedTo: 'pcs-01',
    },
    {
      id: 'headlight',
      type: 'HEADLIGHT_TESTER',
      name: 'Centrafari',
      code: 'CF-01',
      approval: 'OM-CF-001',
      serialNumber: 'CF-100',
      expirationDate: '19082026',
      softwareVersion: '1.00',
      location: 'Linea 1',
      status: 'active',
      manufacturer: 'Hella',
      connectionProtocol: 'DIR',
      connectedTo: 'pcs-01',
    },
    {
      id: 'obd-scan',
      type: 'OTHER',
      name: 'ScanTool OBD',
      code: 'OBD-01',
      approval: 'OM-OBD-001',
      serialNumber: 'OBD-100',
      expirationDate: '19082026',
      softwareVersion: '2.50',
      location: 'Linea 1',
      status: 'active',
      manufacturer: 'Brain Bee',
      connectionProtocol: 'RS',
      connectedTo: 'pcs-01',
    }
  ];
};
