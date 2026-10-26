import React from 'react';
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Award, 
  Compass, 
  ShieldCheck, 
  Database, 
  Server, 
  ExternalLink,
  Layers,
  School
} from 'lucide-react';
import { INSTITUTIONAL_INFO } from '../../data/mockData';

interface InstitutionViewProps {
  onOpenStatusModal: () => void;
}

export const InstitutionView: React.FC<InstitutionViewProps> = ({ onOpenStatusModal }) => {
  return (
    <div className="space-y-6">
      {/* Official Institutional Heritage Banner */}
      <div className="bg-white rounded border border-[#E2E8F0] shadow-2xs overflow-hidden">
        <div className="bg-[#0B1E36] text-white p-6 relative">
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            {/* Crest Emblem */}
            <div className="w-28 h-28 rounded-full bg-white p-1 shrink-0 shadow-lg border-2 border-[#93C5FD] flex items-center justify-center overflow-hidden">
              <img 
                src={INSTITUTIONAL_INFO.crestPath} 
                alt="Escudo Oficial Instituto Técnico San Ignacio de Loyola" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-center md:text-left space-y-1.5 flex-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#1D4ED8] text-white text-[11px] font-bold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" />
                <span>56 Años de Excelencia Técnica • Fundado en 1970</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                {INSTITUTIONAL_INFO.name}
              </h2>
              <p className="text-sm text-[#93C5FD] font-semibold italic">
                "{INSTITUTIONAL_INFO.motto}"
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1 text-xs text-[#CBD5E1]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>San Ignacio, Francisco Morazán, Honduras</span>
                </span>
                <span>•</span>
                <span>Código Municipal SEP: <strong>0818</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Heraldry and Crest Symbology */}
        <div className="p-5 bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs text-[#334155] leading-relaxed">
          <h4 className="font-bold text-[#0B1E36] uppercase text-[11px] tracking-wider mb-2">
            Heráldica e Identidad del Escudo Institucional:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-2.5 bg-white rounded border border-[#E2E8F0]">
              <strong className="text-[#0F172A] block mb-0.5">La Antorcha Olímpica:</strong>
              Llama perpetua del estudio, la verdad y la iluminación que guía a la juventud hondureña.
            </div>
            <div className="p-2.5 bg-white rounded border border-[#E2E8F0]">
              <strong className="text-[#0F172A] block mb-0.5">Los Engranajes Mecánicos:</strong>
              La vocación técnica industrial, el esfuerzo productivo y la disciplina del trabajo.
            </div>
            <div className="p-2.5 bg-white rounded border border-[#E2E8F0]">
              <strong className="text-[#0F172A] block mb-0.5">La Hélice del ADN:</strong>
              Las ciencias biológicas, la exactitud de la investigación y la vida humana digna.
            </div>
            <div className="p-2.5 bg-white rounded border border-[#E2E8F0]">
              <strong className="text-[#0F172A] block mb-0.5">Libros y Computadora:</strong>
              La unión indispensable entre la sabiduría clásica de los libros y la vanguardia tecnológica moderna.
            </div>
          </div>
        </div>

        {/* Official Directory */}
        <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-[#64748B] text-[11px] block">Dirección General:</span>
            <span className="font-bold text-[#0F172A] text-sm">{INSTITUTIONAL_INFO.director}</span>
          </div>
          <div>
            <span className="text-[#64748B] text-[11px] block">Secretaría Académica:</span>
            <span className="font-bold text-[#0F172A] text-sm">{INSTITUTIONAL_INFO.secretary}</span>
          </div>
          <div>
            <span className="text-[#64748B] text-[11px] block">Contacto Oficial:</span>
            <span className="font-medium text-[#0F172A] block font-tabular">{INSTITUTIONAL_INFO.phone}</span>
            <span className="text-[#1D4ED8] font-tabular">{INSTITUTIONAL_INFO.email}</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Geographic Location & Technical System Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Maps Grounding */}
        <div className="bg-white rounded border border-[#E2E8F0] shadow-2xs p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#1D4ED8]" />
              <h3 className="text-sm font-semibold text-[#0F172A]">
                Ubicación Geográfica en San Ignacio, F.M.
              </h3>
            </div>
            <span className="text-[11px] bg-[#EFF4FF] text-[#1D4ED8] font-semibold px-2 py-0.5 rounded">
              Honduras • Centroamérica
            </span>
          </div>

          <p className="text-xs text-[#475569] leading-relaxed">
            El Instituto Técnico San Ignacio de Loyola se encuentra ubicado en el casco urbano de San Ignacio, Francisco Morazán, centro neurálgico de la formación técnica y científica de la zona norte del departamento.
          </p>

          {/* Interactive Simulated Map Frame with Google Maps links */}
          <div className="rounded border border-[#CBD5E1] bg-[#F1F5F9] p-4 text-center space-y-3 relative overflow-hidden">
            <div className="space-y-1">
              <div className="text-xs font-bold text-[#0B1E36]">
                Coordenadas Oficiales del Municipio:
              </div>
              <div className="text-xs font-tabular text-[#64748B]">
                Latitud: 14.6592° N • Longitud: -87.0375° W
              </div>
              <div className="text-[11px] text-[#059669] font-medium">
                Distrito Escolar 08-18 • Dirección Departamental de Educación
              </div>
            </div>

            <div className="flex justify-center gap-2 pt-1">
              <a
                href="https://www.google.com/maps/search/?api=1&query=San+Ignacio+Francisco+Morazan+Honduras"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Abrir en Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* System Architecture and Integrations (Realism Requirement) */}
        <div className="bg-white rounded border border-[#E2E8F0] shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0B1E36]" />
              <h3 className="text-sm font-semibold text-[#0F172A]">
                Arquitectura y Estado de Conectividad
              </h3>
            </div>
            <button
              onClick={onOpenStatusModal}
              className="text-xs text-[#1D4ED8] hover:underline font-semibold"
            >
              Ver Detalle Técnico
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
              <Database className="w-4 h-4 text-[#1D4ED8] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#0F172A] block">Persistencia de Datos:</strong>
                <span className="text-[#64748B]">
                  Actualmente en modo local. Los registros de matrícula y notas persisten en el estado de la estación. Para conectar PostgreSQL multi-usuario, está disponible la herramienta <code>cloudsql-setup</code>.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
              <Server className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#0F172A] block">Servidor Full-Stack:</strong>
                <span className="text-[#64748B]">
                  Express (Node.js) con proxy en <code>/api/*</code> para llamadas seguras de Gemini sin exponer claves de API en el cliente.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
              <ShieldCheck className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#0F172A] block">Autenticación de Usuarios:</strong>
                <span className="text-[#64748B]">
                  Sesión institucional única de secretaría. Para implementar portales separados para padres de familia y docentes se requiere Firebase Auth.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
