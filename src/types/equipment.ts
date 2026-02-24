export type ConnectionProtocol = 'RETE' | 'RS' | 'DIR';

export interface Equipment {
  id: string;
  type: EquipmentType;
  name: string;
  code: string;
  approval: string; // Omologazione
  serialNumber: string;
  location?: string;
  status: 'active' | 'inactive' | 'maintenance';
  lastRevision?: string;
  nextRevision?: string;
  expirationDate?: string; // Data Scadenza
  softwareVersion?: string; // Versione Software
  approvalDate?: string; // Data Approvazione
  licenseNumber?: string; // N° Licenza
  manufacturer?: string;
  connectionProtocol?: ConnectionProtocol; // RETE, RS, DIR
  isIntegrated?: boolean; // For Gas/Smoke/Sound with integrated RPM
  isServer?: boolean; // For PCP
  vehicleCapability?: 'AUTO' | 'MOTO' | 'AUTO_MOTO' | 'MOTO_3_4' | 'AUTO_3_4' | 'AUTO_2_3_4' | 'MOTO_2_3_4' | 'UNIVERSAL'; 
  rtType?: 'POSTERIORE' | 'UNIVERSALE'; // For RT systems
  connectedTo?: string; // ID of the equipment this device is connected to
}

export type EquipmentType = 
  | 'PC' 
  | 'BRAKE_TESTER' 
  | 'GAS_ANALYZER' 
  | 'SMOKE_METER' 
  | 'HEADLIGHT_TESTER' 
  | 'PLAY_DETECTOR' 
  | 'SOUND_LEVEL_METER' 
  | 'LIFT' 
  | 'SPEED_TESTER'
  | 'RPM_COUNTER'
  | 'OTHER';

export const EQUIPMENT_LABELS: Record<EquipmentType, string> = {
  PC: 'Pannello di Concentrazione (PCP)',
  BRAKE_TESTER: 'Banco prova freni',
  GAS_ANALYZER: 'Analizzatore Gas',
  SMOKE_METER: 'Opacimetro',
  HEADLIGHT_TESTER: 'Prova Fari',
  PLAY_DETECTOR: 'Prova Giochi',
  SOUND_LEVEL_METER: 'Fonometro',
  LIFT: 'Ponte Sollevatore',
  SPEED_TESTER: 'Banco Prova Velocità',
  RPM_COUNTER: 'Contagiri',
  OTHER: 'Altro',
};

export const EQUIPMENT_ICONS: Record<EquipmentType, string> = {
  PC: 'Monitor',
  BRAKE_TESTER: 'Gauge',
  GAS_ANALYZER: 'Wind',
  SMOKE_METER: 'CloudFog',
  HEADLIGHT_TESTER: 'Lightbulb',
  PLAY_DETECTOR: 'Vibrate',
  SOUND_LEVEL_METER: 'Mic',
  LIFT: 'ArrowUpFromLine',
  SPEED_TESTER: 'Speedometer',
  RPM_COUNTER: 'Gauge',
  OTHER: 'Box',
};
