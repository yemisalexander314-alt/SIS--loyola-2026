import React from 'react';
import { Bell, ShieldCheck, Database, Calendar, School, Menu } from 'lucide-react';
import { INSTITUTIONAL_INFO } from '../data/mockData';
import { TabType } from '../types';

interface HeaderProps {
  currentTab: TabType;
  onOpenStatusModal: () => void;
  onToggleSidebar: () => void;
  pendingAlertsCount: number;
}

const TAB_TITLES: Record<TabType, { title: string; subtitle: string }> = {
  dashboard: { title: 'Tablero Institucional', subtitle: 'Vista ejecutiva y métricas operativas generales' },
  students: { title: 'Gestión de Matrícula y Expedientes', subtitle: 'Padrón estudiantil, datos del RNE y registro de tutores' },
  grades: { title: 'Control Académico y Calificaciones', subtitle: 'Sábana de notas oficial, promedios y evaluación por parcial' },
  attendance: { title: 'Registro de Asistencia Diaria', subtitle: 'Control de puntualidad e inasistencias por sección' },
  finance: { title: 'Caja y Control Financiero (HNL)', subtitle: 'Recaudación de colegiaturas, recibos oficiales y solvencias' },
  teachers: { title: 'Planta Docente y Talleres', subtitle: 'Asignación de cargas horarias y laboratorios técnicos' },
  assistant: { title: 'Asistente Institucional Inteligente', subtitle: 'Copiloto pedagógico y normativo con tecnología Gemini' },
  institution: { title: 'Identidad y Diagnóstico del Sistema', subtitle: 'Reseña histórica, ubicación y estado de servicios técnicos' }
};

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenStatusModal,
  onToggleSidebar,
  pendingAlertsCount
}) => {
  const current = TAB_TITLES[currentTab] || { title: 'SIS Loyola', subtitle: '' };

  return (
    <header className="h-14 bg-white border-b border-[#E2E8F0] px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left side: Hamburger on mobile + Title & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded md:hidden"
          title="Menú de Navegación"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
              {INSTITUTIONAL_INFO.shortName}
            </span>
            <span className="text-[#CBD5E1]">/</span>
            <h1 className="text-sm md:text-base font-semibold text-[#0F172A] leading-tight">
              {current.title}
            </h1>
          </div>
          <p className="hidden md:block text-[11px] text-[#64748B] leading-none mt-0.5">
            {current.subtitle}
          </p>
        </div>
      </div>

      {/* Right side: Period Badge, System Status, Alerts, User */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Academic Period pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-[12px] font-medium text-[#334155]">
          <Calendar className="w-3.5 h-3.5 text-[#1D4ED8]" />
          <span>{INSTITUTIONAL_INFO.academicCycle}</span>
          <span className="text-[#CBD5E1]">|</span>
          <span className="text-[#059669] font-semibold">{INSTITUTIONAL_INFO.currentPeriod}</span>
        </div>

        {/* Backend & DB Architecture Button (Priority 5) */}
        <button
          onClick={onOpenStatusModal}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-[#EFF4FF] hover:bg-[#DBEAFE] text-[#1D4ED8] border border-[#BFDBFE] rounded text-[11px] font-medium transition-colors"
          title="Ver estado de base de datos y backend"
        >
          <Database className="w-3.5 h-3.5 text-[#1D4ED8]" />
          <span className="hidden lg:inline">Modo: Local / Híbrido</span>
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
        </button>

        {/* Alerts count */}
        <button
          onClick={() => {}}
          className="relative p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded transition-colors"
          title="Notificaciones y Tareas de Revisión"
        >
          <Bell className="w-4 h-4" />
          {pendingAlertsCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#DC2626] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {pendingAlertsCount}
            </span>
          )}
        </button>

        {/* User profile identifier */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#E2E8F0]">
          <div className="w-7 h-7 rounded bg-[#0B1E36] text-white flex items-center justify-center text-xs font-semibold shadow-xs">
            SL
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-[12px] font-semibold text-[#0F172A] leading-tight">Admin. Académica</div>
            <div className="text-[10px] text-[#64748B]">San Ignacio, F.M.</div>
          </div>
        </div>
      </div>
    </header>
  );
};
