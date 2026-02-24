import { Equipment } from '../types/equipment';

export const EQUIPMENT_TEMPLATES: Partial<Equipment>[] = [
  {
    type: 'PC',
    name: 'PCP Server',
    isServer: true,
    connectionProtocol: 'RETE',
    vehicleCapability: 'UNIVERSAL',
  },
  {
    type: 'PC',
    name: 'PCP Client',
    isServer: false,
    connectionProtocol: 'RETE',
    vehicleCapability: 'UNIVERSAL',
  },
  {
    type: 'PC',
    name: 'PC Stazione',
    isServer: false,
    connectionProtocol: 'RETE',
    vehicleCapability: 'UNIVERSAL',
  },
  {
    type: 'BRAKE_TESTER',
    name: 'Banco prova freni Auto',
    vehicleCapability: 'AUTO',
    connectionProtocol: 'DIR',
  },
  {
    type: 'BRAKE_TESTER',
    name: 'Banco prova freni Moto',
    vehicleCapability: 'MOTO',
    connectionProtocol: 'DIR',
  },
  {
    type: 'BRAKE_TESTER',
    name: 'Banco prova freni Univ.',
    vehicleCapability: 'AUTO_MOTO',
    connectionProtocol: 'DIR',
  },
  {
    type: 'GAS_ANALYZER',
    name: 'Analizzatore Gas',
    vehicleCapability: 'AUTO_MOTO',
    connectionProtocol: 'RS',
  },
  {
    type: 'SMOKE_METER',
    name: 'Opacimetro',
    vehicleCapability: 'UNIVERSAL',
    connectionProtocol: 'RS',
  },
  {
    type: 'HEADLIGHT_TESTER',
    name: 'Centrafari',
    vehicleCapability: 'UNIVERSAL',
    connectionProtocol: 'RS',
  },
  {
    type: 'SPEED_TESTER',
    name: 'Prova Velocità 2R',
    vehicleCapability: 'MOTO',
    connectionProtocol: 'RS',
  },
  {
    type: 'SPEED_TESTER',
    name: 'Prova Velocità 3/4R',
    vehicleCapability: 'MOTO_3_4',
    connectionProtocol: 'RS',
  },
  {
    type: 'PLAY_DETECTOR',
    name: 'Prova Giochi',
    vehicleCapability: 'AUTO',
    connectionProtocol: 'DIR',
  },
  {
    type: 'OTHER',
    name: 'Scantool',
    vehicleCapability: 'UNIVERSAL',
    connectionProtocol: 'RS', // Usually BT/RS
  },
  {
    type: 'OTHER',
    name: 'Fonometro',
    vehicleCapability: 'UNIVERSAL',
    connectionProtocol: 'RS',
  },
  {
    type: 'OTHER',
    name: 'RT Universale',
    rtType: 'UNIVERSALE',
    vehicleCapability: 'AUTO_MOTO',
    connectionProtocol: 'RETE',
  },
  {
    type: 'OTHER',
    name: 'RT Posteriore',
    rtType: 'POSTERIORE',
    vehicleCapability: 'AUTO',
    connectionProtocol: 'RETE',
  },
  {
    type: 'OTHER',
    name: 'Decelerometro',
    vehicleCapability: 'UNIVERSAL',
    connectionProtocol: 'RS',
  },
  {
    type: 'RPM_COUNTER',
    name: 'Contagiri Esterno',
    vehicleCapability: 'UNIVERSAL',
    connectionProtocol: 'RS',
  },
];
