import { Equipment, EquipmentType } from '../types/equipment';

const createEmptyEquipment = (
  type: EquipmentType, 
  name: string, 
  connectedTo: string, 
  capability: 'AUTO' | 'MOTO' | 'AUTO_MOTO' | 'AUTO_2_3_4' | 'MOTO_2_3_4' | 'UNIVERSAL' = 'UNIVERSAL'
): Equipment => ({
  id: crypto.randomUUID(),
  type,
  name,
  code: '',
  approval: '',
  serialNumber: '',
  status: 'active',
  manufacturer: '',
  softwareVersion: '',
  connectionProtocol: 'DIR',
  connectedTo,
  vehicleCapability: capability,
});

export const generateAutoLine = (): Equipment[] => {
  const pcpId = crypto.randomUUID();
  const pcsId = crypto.randomUUID();

  const pcp: Equipment = {
    id: pcpId,
    type: 'PC',
    name: 'PC Prenotazione (Server)',
    code: '',
    approval: '',
    serialNumber: '',
    status: 'active',
    isServer: true,
    connectionProtocol: 'RETE',
    manufacturer: '',
    softwareVersion: '',
  };

  const pcs: Equipment = {
    id: pcsId,
    type: 'PC',
    name: 'PC Stazione',
    code: '',
    approval: '',
    serialNumber: '',
    status: 'active',
    connectedTo: pcpId,
    connectionProtocol: 'RETE',
    manufacturer: '',
    softwareVersion: '',
  };

  const instruments = [
    createEmptyEquipment('BRAKE_TESTER', 'Banco Prova Freni', pcsId, 'AUTO'),
    createEmptyEquipment('GAS_ANALYZER', 'Analizzatore Gas', pcsId, 'UNIVERSAL'),
    createEmptyEquipment('SMOKE_METER', 'Opacimetro', pcsId, 'UNIVERSAL'),
    createEmptyEquipment('HEADLIGHT_TESTER', 'Centrafari', pcsId, 'AUTO'),
    createEmptyEquipment('PLAY_DETECTOR', 'Prova Giochi', pcsId, 'AUTO'),
    createEmptyEquipment('SOUND_LEVEL_METER', 'Fonometro', pcsId, 'UNIVERSAL'),
    createEmptyEquipment('OTHER', 'Contagiri', pcsId, 'UNIVERSAL'),
  ];

  return [pcp, pcs, ...instruments];
};

export const generateAutoMotoLine = (): Equipment[] => {
  const pcpId = crypto.randomUUID();
  const pcsId = crypto.randomUUID();

  const pcp: Equipment = {
    id: pcpId,
    type: 'PC',
    name: 'PC Prenotazione (Server)',
    code: '',
    approval: '',
    serialNumber: '',
    status: 'active',
    isServer: true,
    connectionProtocol: 'RETE',
    manufacturer: '',
    softwareVersion: '',
  };

  const pcs: Equipment = {
    id: pcsId,
    type: 'PC',
    name: 'PC Stazione',
    code: '',
    approval: '',
    serialNumber: '',
    status: 'active',
    connectedTo: pcpId,
    connectionProtocol: 'RETE',
    manufacturer: '',
    softwareVersion: '',
  };

  const instruments = [
    createEmptyEquipment('BRAKE_TESTER', 'Banco Prova Freni', pcsId, 'AUTO_MOTO'),
    createEmptyEquipment('SPEED_TESTER', 'Banco Prova Velocità', pcsId, 'MOTO'),
    createEmptyEquipment('GAS_ANALYZER', 'Analizzatore Gas', pcsId, 'UNIVERSAL'),
    createEmptyEquipment('SMOKE_METER', 'Opacimetro', pcsId, 'UNIVERSAL'),
    createEmptyEquipment('HEADLIGHT_TESTER', 'Centrafari', pcsId, 'AUTO_MOTO'),
    createEmptyEquipment('PLAY_DETECTOR', 'Prova Giochi', pcsId, 'AUTO_MOTO'),
    createEmptyEquipment('SOUND_LEVEL_METER', 'Fonometro', pcsId, 'UNIVERSAL'),
    createEmptyEquipment('OTHER', 'Contagiri', pcsId, 'UNIVERSAL'),
  ];

  return [pcp, pcs, ...instruments];
};

export const generateAutoMoto34Line = (): Equipment[] => {
  const pcpId = crypto.randomUUID();
  const pcsId = crypto.randomUUID();

  const pcp: Equipment = {
    id: pcpId,
    type: 'PC',
    name: 'PC Prenotazione (Server)',
    code: '',
    approval: '',
    serialNumber: '',
    status: 'active',
    isServer: true,
    connectionProtocol: 'RETE',
    manufacturer: '',
    softwareVersion: '',
  };

  const pcs: Equipment = {
    id: pcsId,
    type: 'PC',
    name: 'PC Stazione',
    code: '',
    approval: '',
    serialNumber: '',
    status: 'active',
    connectedTo: pcpId,
    connectionProtocol: 'RETE',
    manufacturer: '',
    softwareVersion: '',
  };

  const instruments = [
    createEmptyEquipment('BRAKE_TESTER', 'Banco Prova Freni', pcsId, 'AUTO_2_3_4'),
    createEmptyEquipment('SPEED_TESTER', 'Banco Prova Velocità', pcsId, 'MOTO_2_3_4'),
    createEmptyEquipment('GAS_ANALYZER', 'Analizzatore Gas', pcsId, 'UNIVERSAL'),
    createEmptyEquipment('SMOKE_METER', 'Opacimetro', pcsId, 'UNIVERSAL'),
    createEmptyEquipment('HEADLIGHT_TESTER', 'Centrafari', pcsId, 'AUTO_2_3_4'),
    createEmptyEquipment('PLAY_DETECTOR', 'Prova Giochi', pcsId, 'AUTO_2_3_4'),
    createEmptyEquipment('SOUND_LEVEL_METER', 'Fonometro', pcsId, 'UNIVERSAL'),
    createEmptyEquipment('OTHER', 'Contagiri', pcsId, 'UNIVERSAL'),
  ];

  return [pcp, pcs, ...instruments];
};
