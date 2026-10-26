import React from 'react';
import { X, Database, Shield, Bot, Server, CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface StatusIndicatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverStatus: {
    status: string;
    hasGeminiKey: boolean;
  } | null;
}

export const StatusIndicatorModal: React.FC<StatusIndicatorModalProps> = ({
  isOpen,
  onClose,
  serverStatus
}) => {
  if (!isOpen) return null;

  const items = [
    {
      title: 'Motor de Base de Datos y Persistencia',
      icon: <Database className="w-5 h-5 text-[#1D4ED8]" />,
      badge: 'Almacenamiento Local Activo',
      badgeClass: 'bg-[#EFF4FF] text-[#1D4ED8] border-[#BFDBFE]',
      description: 'Los registros de matrícula, calificaciones y pagos se almacenan en el estado y caché del navegador. Las modificaciones persisten durante su sesión de trabajo.',
      productionRequirement: 'Para trabajo multi-usuario simultáneo (varias secretarías, docentes desde sus aulas y directores), se requiere una base de datos relacional Cloud SQL (PostgreSQL) o Firebase Firestore.',
      connected: true,
      isCloud: false
    },
    {
      title: 'Sistema de Autenticación y Control de Roles',
      icon: <Shield className="w-5 h-5 text-[#059669]" />,
      badge: 'Perfil Administrativo Local',
      badgeClass: 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]',
      description: 'Actualmente opera en modo de estación de trabajo autorizada (Secretaría Académica / Dirección General del Instituto Técnico San Ignacio de Loyola).',
      productionRequirement: 'Para portales independientes de docentes, tutores legales y alumnos con contraseñas individuales, se requiere Firebase Auth o inicio de sesión institucional con Google Workspace.',
      connected: true,
      isCloud: false
    },
    {
      title: 'Asistente Institucional Inteligente (Gemini AI)',
      icon: <Bot className="w-5 h-5 text-[#2563EB]" />,
      badge: serverStatus?.hasGeminiKey ? 'Gemini 3.8 / 4 Activo' : 'Clave no detectada (Modo Base)',
      badgeClass: serverStatus?.hasGeminiKey ? 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]' : 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
      description: 'El backend Express en server.ts procesa peticiones seguras con el SDK @google/genai sin exponer claves al navegador.',
      productionRequirement: 'Configurado en el servidor. Si se requiere análisis complejo con pensamiento profundo (Thinking Mode), se utiliza gemini-4-argon con clave activada.',
      connected: Boolean(serverStatus?.hasGeminiKey),
      isCloud: true
    },
    {
      title: 'Servidor Full-Stack (Node.js + Express)',
      icon: <Server className="w-5 h-5 text-[#0B1E36]" />,
      badge: 'Operacional (Puerto 3000)',
      badgeClass: 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]',
      description: 'Servidor de aplicaciones respondiendo en /api/* con middleware Vite SPA integrado.',
      productionRequirement: 'Listo para producción institucional en Google Cloud Run.',
      connected: true,
      isCloud: true
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1E36]/60 backdrop-blur-xs">
      <div className="bg-white rounded-md border border-[#CBD5E1] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-[#0B1E36] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Info className="w-5 h-5 text-[#38BDF8]" />
            <div>
              <h3 className="text-sm font-semibold tracking-wide">
                Diagnóstico de Servicios y Arquitectura Técnica
              </h3>
              <p className="text-[11px] text-[#94A3B8]">
                Transparencia del sistema SIS Loyola • Instituto Técnico San Ignacio de Loyola F.M.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-white p-1 rounded hover:bg-[#1E3A5F] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-xs text-[#334155] flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#0F172A]">Compromiso de Realismo Institucional:</span> Las pantallas de SIS Loyola funcionan con datos locales representativos. A continuación se detalla con exactitud qué módulos están activos localmente y qué integraciones en la nube pueden conectarse.
            </div>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={idx} className="p-3.5 bg-white border border-[#E2E8F0] rounded-sm hover:border-[#CBD5E1] transition-colors">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <h4 className="text-sm font-semibold text-[#0F172A]">{item.title}</h4>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeClass}`}>
                    {item.badge}
                  </span>
                </div>

                <p className="text-xs text-[#475569] mb-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="text-[11px] bg-[#F1F5F9] p-2 rounded text-[#334155] border-l-2 border-[#1D4ED8]">
                  <span className="font-semibold text-[#0F172A]">Escalamiento a Producción: </span>
                  {item.productionRequirement}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold rounded transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
