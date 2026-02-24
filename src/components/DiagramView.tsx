import React, { useMemo, useState, useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  Node, 
  Edge, 
  MarkerType,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  EdgeProps,
  getSmoothStepPath,
  BaseEdge,
  Panel,
  OnConnect,
  Connection,
  NodeMouseHandler
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Equipment, EQUIPMENT_LABELS } from '../types/equipment';
import { EquipmentDetailsPanel } from './EquipmentDetailsPanel';
import { EquipmentLibrary } from './EquipmentLibrary';
import { 
  ArrowRight, ArrowDown, Eye, EyeOff,
  Monitor, Server, Wind, CloudFog, Activity, Gauge, Mic, Lightbulb, Vibrate, Cable, TrendingDown, Box, Disc, Cloud, Camera
} from 'lucide-react';

// --- Custom Components for MCTC Net2 Representation ---

const MufflerIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="4" y="6" width="13" height="12" rx="2" />
    <path d="M2 12h2" />
    <path d="M17 12h2c1 0 2-.5 2-2V8" />
    <line x1="8" y1="10" x2="11" y2="10" />
    <line x1="13" y1="10" x2="14" y2="10" />
  </svg>
);

// Helper to get icon
const getEquipmentIcon = (data: Equipment) => {
  const className = "text-carbon-gray-100"; // Carbon gray
  
  if (data.isServer) return <Server size={20} className={className} />;
  if (data.type === 'PC') return <Monitor size={20} className={className} />;
  
  const name = data.name.toLowerCase();
  if (name.includes('gas')) return <MufflerIcon size={20} className={className} />;
  if (name.includes('opacimetro')) return <Cloud size={20} className={className} />;
  if (name.includes('freni') || data.type === 'BRAKE_TESTER') return <Disc size={20} className={className} />;
  if (name.includes('velocità') || name.includes('velocita')) return <Gauge size={20} className={className} />;
  if (name.includes('fonometro')) return <Mic size={20} className={className} />;
  if (name.includes('centrafari')) return <Lightbulb size={20} className={className} />;
  if (name.includes('giochi')) return null;
  if (name.includes('scantool') || name.includes('obd')) return <Cable size={20} className={className} />;
  if (name.includes('decelerometro')) return <TrendingDown size={20} className={className} />;
  if (name.includes('contagiri') || data.type === 'RPM_COUNTER') return <Gauge size={20} className={className} />;
  if (name.includes('rt') || name.includes('targhe')) return <Camera size={20} className={className} />;
  
  return <Box size={20} className={className} />;
};

// 1. Custom Edge with Specific MCTC Styles and Manual Routing
const CustomEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) => {
  const offset = data?.channelOffset || 0;
  const midX = sourceX + (targetX - sourceX) / 2;
  const channelX = midX + offset;
  const path = `M ${sourceX} ${sourceY} L ${channelX} ${sourceY} L ${channelX} ${targetY} L ${targetX} ${targetY}`;

  const protocol = data?.protocol || 'RETE';
  
  if (protocol === 'RETE') {
    return (
      <>
        <path
          d={path}
          fill="none"
          stroke="#000000"
          style={{ ...style, strokeWidth: 8, stroke: '#000000' }}
        />
        <path
          d={path}
          fill="none"
          stroke="#fff"
          style={{ ...style, strokeWidth: 4, stroke: '#fff', strokeDasharray: 'none' }}
        />
      </>
    );
  }

  if (protocol === 'RS') {
    return (
      <path
        d={path}
        fill="none"
        stroke="#000000"
        strokeWidth={1.5}
        strokeDasharray="5 5"
        style={style}
        markerEnd={markerEnd}
      />
    );
  }

  return (
    <path
      d={path}
      fill="none"
      stroke="#000000"
      strokeWidth={1.5}
      style={style}
      markerEnd={markerEnd}
    />
  );
};

// 2. Custom Node (Technical Block)
const EquipmentNode = ({ data }: { data: Equipment & { layout?: 'horizontal' | 'vertical', showDetails?: boolean, pcNumber?: number } }) => {
  const isPC = data.type === 'PC';
  const isDecelerometer = data.name.toLowerCase().includes('decelerometro');
  const isPlayDetector = data.type === 'PLAY_DETECTOR';
  const isBrakeTester = data.type === 'BRAKE_TESTER';
  const isServer = data.isServer;
  const cap = data.vehicleCapability;
  
  const hasVerticalLines = [
    'AUTO_MOTO', 
    'AUTO_2_3_4', 
    'AUTO_3_4', 
    'MOTO_3_4', 
    'MOTO_2_3_4'
  ].includes(cap || '');

  const hasBottomBar = isBrakeTester && cap === 'AUTO_2_3_4';
  const isRT = data.name.includes('RT') || data.name.includes('Targhe');
  const hasLeftLineOnly = isRT && data.rtType === 'POSTERIORE' && cap === 'AUTO';
  const isIntegrated = data.isIntegrated;

  // Base Shape
  let containerClass = "relative flex flex-col items-center justify-center w-[200px] min-h-[90px] bg-white transition-all hover:border-carbon-blue-60";
  let borderClass = "border border-carbon-gray-100"; 
  let skewClass = "";

  if (isPC) {
    if (isServer) {
      borderClass = "border-2 border-carbon-blue-60";
    } else {
      borderClass = "border border-carbon-gray-100";
    }
  } else if (isDecelerometer) {
    skewClass = "-skew-x-12";
  } else if (isPlayDetector) {
    borderClass = "border-2 border-carbon-gray-100";
  }

  const showDetails = data.showDetails !== false;

  const renderPCHandles = () => {
    if (!isPC) return null;
    const handles = [];
    for (let i = 0; i < 5; i++) {
      const top = 20 + (i * 15);
      handles.push(
        <React.Fragment key={`h-${i}`}>
          <Handle type="target" position={Position.Left} id={`t-left-${i}`} style={{ top: `${top}%` }} className="!w-2 !h-2 !bg-carbon-gray-100 !-ml-1 z-10 !rounded-none" />
          <Handle type="source" position={Position.Left} id={`s-left-${i}`} style={{ top: `${top}%` }} className="!w-2 !h-2 !bg-carbon-blue-60 !-ml-1 z-20 opacity-0 hover:opacity-100 !rounded-none" />
          
          <Handle type="source" position={Position.Right} id={`s-right-${i}`} style={{ top: `${top}%` }} className="!w-2 !h-2 !bg-carbon-blue-60 !-mr-1 z-20 !rounded-none" />
          <Handle type="target" position={Position.Right} id={`t-right-${i}`} style={{ top: `${top}%` }} className="!w-2 !h-2 !bg-carbon-gray-100 !-mr-1 z-10 opacity-0 hover:opacity-100 !rounded-none" />
        </React.Fragment>
      );
    }
    return handles;
  };

  return (
    <div className={`${containerClass} ${borderClass} ${skewClass}`}>
      {/* PC Number Badge */}
      {isPC && data.pcNumber && (
        <div className="absolute -top-3 -left-3 w-6 h-6 bg-carbon-gray-100 text-white flex items-center justify-center text-[10px] font-bold z-20 border border-white shadow-sm">
          {data.pcNumber}
        </div>
      )}

      {/* Connection Points */}
      {isPC ? renderPCHandles() : (
        <>
          <Handle type="target" position={Position.Left} id="t-left" className="!w-2 !h-2 !bg-carbon-gray-100 !-ml-1 z-10 !rounded-none" />
          <Handle type="source" position={Position.Left} id="s-left" className="!w-2 !h-2 !bg-carbon-blue-60 !-ml-1 z-20 opacity-0 hover:opacity-100 !rounded-none" />
          
          <Handle type="source" position={Position.Right} id="s-right" className="!w-2 !h-2 !bg-carbon-blue-60 !-mr-1 z-20 !rounded-none" />
          <Handle type="target" position={Position.Right} id="t-right" className="!w-2 !h-2 !bg-carbon-gray-100 !-mr-1 z-10 opacity-0 hover:opacity-100 !rounded-none" />
        </>
      )}
      
      <Handle type="target" position={Position.Top} id="t-top" className="!w-2 !h-2 !bg-carbon-gray-100 !-mt-1 z-10 !rounded-none" />
      <Handle type="source" position={Position.Top} id="s-top" className="!w-2 !h-2 !bg-carbon-blue-60 !-mt-1 z-20 opacity-0 hover:opacity-100 !rounded-none" />
      
      <Handle type="source" position={Position.Bottom} id="s-bottom" className="!w-2 !h-2 !bg-carbon-blue-60 !-mb-1 z-20 !rounded-none" />
      <Handle type="target" position={Position.Bottom} id="t-bottom" className="!w-2 !h-2 !bg-carbon-gray-100 !-mb-1 z-10 opacity-0 hover:opacity-100 !rounded-none" />

      {/* VISUAL INDICATORS */}
      {hasVerticalLines && (
        <>
          <div className={`absolute top-0 left-3 w-0.5 bg-carbon-gray-100 ${isIntegrated || hasBottomBar ? 'bottom-2' : 'bottom-0'}`}></div>
          <div className={`absolute top-0 right-3 w-0.5 bg-carbon-gray-100 ${isIntegrated || hasBottomBar ? 'bottom-2' : 'bottom-0'}`}></div>
        </>
      )}

      {hasLeftLineOnly && (
        <div className={`absolute top-0 left-3 w-0.5 bg-carbon-gray-100 ${isIntegrated ? 'bottom-2' : 'bottom-0'}`}></div>
      )}
      
      {(isIntegrated || hasBottomBar) && (
        <div className="absolute left-0 right-0 bottom-2 h-0.5 bg-carbon-gray-100"></div>
      )}

      {/* Content Container */}
      <div className={`w-full h-full flex flex-col z-10 ${isDecelerometer ? 'skew-x-12' : ''} ${hasVerticalLines ? 'px-5' : 'px-2'} ${isIntegrated || hasBottomBar ? 'pb-3' : 'pb-1'}`}>
        <div className={`w-full text-center py-1 text-[10px] font-bold uppercase flex flex-col items-center gap-1 ${showDetails ? 'border-b border-carbon-gray-20 bg-carbon-gray-10' : 'flex-1 flex items-center justify-center'}`}>
          {showDetails && getEquipmentIcon(data)}
          <span className="text-carbon-gray-100">{data.name}</span>
        </div>

        {showDetails && (
          <div className="flex-1 w-full flex flex-col gap-0.5 text-[9px] font-mono text-carbon-gray-80 p-1">
            <div className="flex justify-between">
              <span className="font-bold">OMOL:</span>
              <span className="truncate">{data.approval}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">S/N:</span>
              <span className="truncate">{data.serialNumber}</span>
            </div>
            {data.expirationDate && (
              <div className="flex justify-between text-red-600">
                <span className="font-bold">SCAD:</span>
                <span>{data.expirationDate}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const nodeTypes = {
  equipment: EquipmentNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

interface DiagramViewProps {
  equipment: Equipment[];
  layoutDirection: 'horizontal' | 'vertical';
  onLayoutChange: (direction: 'horizontal' | 'vertical') => void;
  showDetails: boolean;
  onShowDetailsChange: (show: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
  onEquipmentUpdate?: (updatedEquipment: Equipment[]) => void;
  readOnly?: boolean;
}

export function DiagramView({ 
  equipment, 
  layoutDirection, 
  onLayoutChange, 
  showDetails, 
  onShowDetailsChange,
  className,
  style,
  onEquipmentUpdate,
  readOnly = false
}: DiagramViewProps) {
  
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    const CENTER_X = 0;
    const LEFT_X = -350;
    const RIGHT_X = 350;
    const START_Y = 50;
    const ITEM_HEIGHT = 150; 
    const CLIENT_OFFSET = 300; 
    
    const processedNodes = new Set<string>();

    const addNode = (node: Equipment, x: number, y: number) => {
      if (processedNodes.has(node.id)) return;
      processedNodes.add(node.id);
      
      let pcNumber: number | undefined;
      if (node.type === 'PC') {
        const pcs = equipment.filter(e => e.type === 'PC');
        pcs.sort((a, b) => (a.isServer ? -1 : 1));
        const idx = pcs.findIndex(p => p.id === node.id);
        if (idx >= 0) pcNumber = idx + 1;
      }

      nodes.push({
        id: node.id,
        type: 'equipment',
        position: { x, y },
        data: { ...node, layout: layoutDirection, showDetails, pcNumber },
      });
    };

    const addEdge = (source: Equipment, target: Equipment, sourceHandle: string, targetHandle: string, channelOffset: number = 0) => {
      const protocol = target.connectionProtocol || 'RS';
      
      edges.push({
        id: `e-${source.id}-${target.id}`,
        source: source.id,
        target: target.id,
        sourceHandle,
        targetHandle,
        type: 'custom',
        data: { protocol, channelOffset },
        style: { stroke: '#000000' }, 
      });
    };

    const server = equipment.find(e => e.isServer);
    const clients = equipment.filter(e => e.type === 'PC' && !e.isServer && e.connectedTo === server?.id && e.name.toLowerCase().includes('client'));
    const pcs = equipment.filter(e => e.type === 'PC' && !e.isServer && e.id !== server?.id && !clients.find(c => c.id === e.id));
    const playDetectors = equipment.filter(e => e.type === 'PLAY_DETECTOR' || e.name.toLowerCase().includes('giochi'));
    const instruments = equipment.filter(e => e.type !== 'PC' && e.type !== 'PLAY_DETECTOR' && !e.name.toLowerCase().includes('giochi'));

    let currentY = START_Y;

    if (server) {
      addNode(server, CENTER_X, currentY);
      clients.forEach((client, idx) => {
        const isLeft = idx % 2 === 0;
        const xPos = isLeft ? -CLIENT_OFFSET - (Math.floor(idx/2) * 250) : CLIENT_OFFSET + (Math.floor(idx/2) * 250);
        addNode(client, xPos, currentY);
        if (isLeft) {
             addEdge(server, client, 's-left-2', 't-right-2');
        } else {
             addEdge(server, client, 's-right-2', 't-left-2');
        }
      });
      currentY += ITEM_HEIGHT + 50;
    }

    pcs.forEach(pc => {
      addNode(pc, CENTER_X, currentY);
      if (server && pc.connectedTo === server.id) {
        addEdge(server, pc, 's-bottom', 't-top');
      }
      const pcInstruments = instruments.filter(inst => inst.connectedTo === pc.id);
      const leftInsts = pcInstruments.filter((_, i) => i % 2 === 0);
      const rightInsts = pcInstruments.filter((_, i) => i % 2 !== 0);
      let maxInstY = currentY;
      let leftY = currentY + ITEM_HEIGHT;
      leftInsts.forEach((inst, idx) => {
        addNode(inst, LEFT_X, leftY);
        const handleIdx = Math.min(idx, 4); 
        const offset = -20 - (idx * 20); 
        addEdge(pc, inst, `s-left-${handleIdx}`, 't-right', offset);
        const subInsts = instruments.filter(sub => sub.connectedTo === inst.id);
        let subY = leftY + ITEM_HEIGHT;
        subInsts.forEach(sub => {
           addNode(sub, LEFT_X, subY);
           addEdge(inst, sub, 's-bottom', 't-top');
           subY += ITEM_HEIGHT;
        });
        leftY = Math.max(leftY + ITEM_HEIGHT, subY);
      });
      let rightY = currentY + ITEM_HEIGHT;
      rightInsts.forEach((inst, idx) => {
        addNode(inst, RIGHT_X, rightY);
        const handleIdx = Math.min(idx, 4);
        const offset = 20 + (idx * 20);
        addEdge(pc, inst, `s-right-${handleIdx}`, 't-left', offset);
        const subInsts = instruments.filter(sub => sub.connectedTo === inst.id);
        let subY = rightY + ITEM_HEIGHT;
        subInsts.forEach(sub => {
           addNode(sub, RIGHT_X, subY);
           addEdge(inst, sub, 's-bottom', 't-top');
           subY += ITEM_HEIGHT;
        });
        rightY = Math.max(rightY + ITEM_HEIGHT, subY);
      });
      maxInstY = Math.max(leftY, rightY);
      currentY = maxInstY + 50; 
    });

    if (playDetectors.length > 0) {
      currentY += 50; 
      playDetectors.forEach(pd => {
        addNode(pd, CENTER_X, currentY);
        if (pd.connectedTo) {
           const parent = nodes.find(n => n.id === pd.connectedTo);
           if (parent) {
             addEdge({ id: parent.id } as any, pd, 's-bottom', 't-top');
           }
        }
        currentY += ITEM_HEIGHT;
      });
    }

    equipment.forEach(eq => {
      if (!processedNodes.has(eq.id)) {
        addNode(eq, CENTER_X, currentY);
        currentY += ITEM_HEIGHT;
      }
    });

    return { nodes, edges };
  }, [equipment, layoutDirection, showDetails]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
    if (!readOnly) {
      setSelectedNodeId(node.id);
    }
  }, [readOnly]);

  const handleEquipmentUpdate = useCallback((id: string, updates: Partial<Equipment>) => {
    if (!onEquipmentUpdate) return;
    
    const updatedEquipment = equipment.map(eq => 
      eq.id === id ? { ...eq, ...updates } : eq
    );
    onEquipmentUpdate(updatedEquipment);
  }, [equipment, onEquipmentUpdate]);

  const handleDelete = useCallback((id: string) => {
    if (!onEquipmentUpdate) return;
    
    const updatedEquipment = equipment.filter(eq => eq.id !== id);
    onEquipmentUpdate(updatedEquipment);
    if (selectedNodeId === id) {
      setSelectedNodeId(null);
    }
  }, [equipment, onEquipmentUpdate, selectedNodeId]);

  const handleAdd = useCallback((template: Partial<Equipment>) => {
    if (!onEquipmentUpdate) return;

    const newId = `eq-${Date.now()}`;
    
    // Auto-connect logic:
    let connectedTo = template.connectedTo;
    let connectionProtocol = template.connectionProtocol || 'DIR';
    let isServer = template.isServer;
    let name = template.name;

    const server = equipment.find(e => e.isServer);
    const pcStation = equipment.find(e => e.type === 'PC' && !e.isServer && e.name === 'PC Stazione');
    
    if (template.type === 'PC') {
      connectionProtocol = 'RETE'; 
      
      if (template.name === 'PC Prenotazione') {
        if (!server) {
          isServer = true;
          name = 'PCP Server';
        } else {
          isServer = false;
          name = 'PCP Client';
          connectedTo = server.id;
        }
      } else if (template.name === 'PC Stazione') {
        isServer = false;
        if (server) {
          connectedTo = server.id;
        }
      }
    } else {
      if (template.type === 'PLAY_DETECTOR') {
        connectedTo = undefined;
      } else if (pcStation) {
        connectedTo = pcStation.id;
      } else if (server) {
        connectedTo = server.id;
      }
      connectionProtocol = 'DIR';
    }

    const newItem: Equipment = {
      ...template,
      id: newId,
      type: template.type || 'OTHER',
      name: name || template.name || 'Nuovo Strumento',
      code: template.code || '',
      approval: template.approval || 'OM-XXX',
      serialNumber: template.serialNumber || 'SN-000',
      location: 'Linea 1',
      status: 'active',
      manufacturer: 'Produttore',
      vehicleCapability: template.vehicleCapability || 'UNIVERSAL',
      isServer: isServer,
      isIntegrated: template.isIntegrated,
      rtType: template.rtType,
      connectionProtocol: connectionProtocol, 
      connectedTo: connectedTo,
    };

    onEquipmentUpdate([...equipment, newItem]);
    setSelectedNodeId(newId);
  }, [equipment, onEquipmentUpdate]);

  const onConnect: OnConnect = useCallback((connection: Connection) => {
    if (!onEquipmentUpdate || !connection.source || !connection.target) return;
    const sourceId = connection.source;
    const targetId = connection.target;
    if (sourceId === targetId) return;
    let parentId = sourceId;
    let childId = targetId;
    const sourceNode = equipment.find(e => e.id === sourceId);
    const targetNode = equipment.find(e => e.id === targetId);
    if (sourceNode && targetNode) {
      if (targetNode.isServer) {
        parentId = targetId;
        childId = sourceId;
      } else if (sourceNode.isServer) {
        parentId = sourceId;
        childId = targetId;
      }
      else if (targetNode.type === 'PC' && sourceNode.type !== 'PC') {
        parentId = targetId;
        childId = sourceId;
      } else if (sourceNode.type === 'PC' && targetNode.type !== 'PC') {
        parentId = sourceId;
        childId = targetId;
      }
    }
    let currentId: string | undefined = parentId;
    let isCycle = false;
    while (currentId) {
      if (currentId === childId) {
        isCycle = true;
        break;
      }
      const parent = equipment.find(e => e.id === currentId)?.connectedTo;
      currentId = parent;
    }
    if (isCycle) {
      alert("Impossibile collegare: verrebbe creato un ciclo.");
      return;
    }
    const updatedEquipment = equipment.map(eq => {
      if (eq.id === childId) {
        return { ...eq, connectedTo: parentId };
      }
      return eq;
    });
    onEquipmentUpdate(updatedEquipment);
  }, [equipment, onEquipmentUpdate]);

  return (
    <div 
      className={`bg-white border border-carbon-gray-20 overflow-hidden relative ${className || 'w-full h-[800px]'}`}
      style={style}
    >
      {/* Controls */}
      {!readOnly && (
        <div className={`absolute top-4 z-10 flex gap-2 ${onEquipmentUpdate ? 'left-[270px]' : 'left-4'}`}>
          <div className="bg-white p-1 border border-carbon-gray-20 shadow-sm flex gap-1">
            <button
              onClick={() => onShowDetailsChange(!showDetails)}
              className={`p-2 transition-colors ${showDetails ? 'bg-carbon-blue-60 text-white' : 'hover:bg-carbon-gray-10 text-carbon-gray-100'}`}
              title={showDetails ? "Nascondi Dettagli" : "Mostra Dettagli"}
            >
              {showDetails ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
        </div>
      )}

      {/* Equipment Library Sidebar */}
      {!readOnly && onEquipmentUpdate && (
        <div className="absolute top-0 left-0 bottom-0 z-20 bg-white border-r border-carbon-gray-20 shadow-lg transform transition-transform duration-300 ease-in-out">
           <EquipmentLibrary onAdd={handleAdd} />
        </div>
      )}

      {/* MCTC Net2 Legend */}
      <div className="absolute top-4 right-4 z-10 bg-white p-4 border border-carbon-gray-100 shadow-lg text-[10px] font-mono">
        <h4 className="font-bold mb-3 border-b border-carbon-gray-20 pb-1 uppercase tracking-widest text-carbon-gray-100">LEGENDA</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-2 flex flex-col justify-between">
              <div className="w-full h-0.5 bg-black"></div>
              <div className="w-full h-0.5 bg-black"></div>
            </div>
            <span className="text-carbon-gray-80 uppercase">RETE (LAN)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-0.5 border-t-2 border-dashed border-black"></div>
            <span className="text-carbon-gray-80 uppercase">RS (SERIALE)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-0.5 bg-black"></div>
            <span className="text-carbon-gray-80 uppercase">DIR (DIRETTO)</span>
          </div>
        </div>
      </div>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        attributionPosition="bottom-right"
      >
        <Background gap={20} size={1} color="#e0e0e0" variant={Background.Lines} />
        <Controls className="!bg-white !border-carbon-gray-20 !shadow-none !rounded-none" />
        
        {equipment.length === 0 && !readOnly && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/90 p-8 border border-carbon-gray-20 shadow-xl max-w-md text-center pointer-events-auto">
              <div className="mb-4 flex justify-center text-carbon-gray-30">
                <Box size={48} strokeWidth={1} />
              </div>
              <h3 className="text-xl font-light text-carbon-gray-100 mb-2">Schema Vuoto</h3>
              <p className="text-sm text-carbon-gray-60 mb-6">
                Non sono presenti attrezzature nello schema. Utilizza la libreria a sinistra per aggiungere nuovi componenti o carica una configurazione esistente.
              </p>
            </div>
          </div>
        )}
      </ReactFlow>

      {selectedNodeId && !readOnly && onEquipmentUpdate && (
        <EquipmentDetailsPanel 
          equipment={equipment.find(e => e.id === selectedNodeId)!}
          allEquipment={equipment}
          onUpdate={handleEquipmentUpdate}
          onDelete={handleDelete}
          onClose={() => setSelectedNodeId(null)}
        />
      )}
    </div>
  );
}
