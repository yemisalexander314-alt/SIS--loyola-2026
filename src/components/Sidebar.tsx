import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  ClipboardCheck, 
  Wallet, 
  Briefcase, 
  Sparkles, 
  School, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { TabType } from '../types';
import { INSTITUTIONAL_INFO } from '../data/mockData';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onCloseMobile
}) => {
  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Tablero Institucional',
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />
    },
    {
      id: 'students',
      label: 'Matrícula y Expedientes',
      icon: <Users className="w-4 h-4 shrink-0" />,
      badge: '8',
      badgeColor: 'bg-[#1D4ED8]'
    },
    {
      id: 'grades',
      label: 'Control de Calificaciones',
      icon: <GraduationCap className="w-4 h-4 shrink-0" />
    },
    {
      id: 'attendance',
      label: 'Asistencia Diaria',
      icon: <ClipboardCheck className="w-4 h-4 shrink-0" />
    },
    {
      id: 'finance',
      label: 'Caja y Finanzas (HNL)',
      icon: <Wallet className="w-4 h-4 shrink-0" />
    },
    {
      id: 'teachers',
      label: 'Docentes y Talleres',
      icon: <Briefcase className="w-4 h-4 shrink-0" />
    },
    {
      id: 'assistant',
      label: 'Asistente SIS Gemini',
      icon: <Sparkles className="w-4 h-4 shrink-0 text-[#60A5FA]" />,
      badge: 'IA',
      badgeColor: 'bg-[#059669]'
    },
    {
      id: 'institution',
      label: 'Identidad y Sistema',
      icon: <Building2 className="w-4 h-4 shrink-0" />
    }
  ];

  const handleTabClick = (tab: TabType) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-[#0B1E36]/60 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-50 md:z-20 bg-[#0B1E36] text-white flex flex-col transition-all duration-200 ease-in-out border-r border-[#1E293B] ${
          collapsed ? 'w-[68px]' : 'w-[260px]'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Header / Institutional Branding */}
        <div className="h-16 flex items-center px-3.5 border-b border-[#1E3A5F] justify-between overflow-hidden">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Crest Image */}
            <div className="w-10 h-10 rounded-full bg-white p-0.5 shrink-0 shadow-md flex items-center justify-center overflow-hidden border border-[#93C5FD]">
              <img 
                src={INSTITUTIONAL_INFO.crestPath} 
                alt="Escudo Oficial Instituto Técnico San Ignacio de Loyola" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback icon if image path failed
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            
            {!collapsed && (
              <div className="truncate">
                <div className="text-xs font-bold tracking-wider uppercase text-white truncate">
                  SIS LOYOLA
                </div>
                <div className="text-[10px] text-[#94A3B8] truncate leading-tight font-medium">
                  I.T. San Ignacio de Loyola
                </div>
                <div className="text-[9px] text-[#38BDF8] font-semibold tracking-wide">
                  F.M. • Fundado 1970
                </div>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={onToggleCollapsed}
            className="hidden md:flex p-1 rounded text-[#94A3B8] hover:text-white hover:bg-[#1E3A5F] transition-colors"
            title={collapsed ? 'Expandir menú' : 'Contraer menú'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Section Label */}
        {!collapsed && (
          <div className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
            Módulos del Sistema
          </div>
        )}

        {/* Navigation list */}
        <nav className="flex-1 px-2 py-1.5 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-2.5 py-2 rounded text-left transition-colors relative group ${
                  isActive
                    ? 'bg-[#1D4ED8] text-white font-medium shadow-xs'
                    : 'text-[#94A3B8] hover:bg-[#132A4A] hover:text-white'
                }`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-white rounded-r"></span>
                )}
                
                <span className={isActive ? 'text-white' : 'text-[#94A3B8] group-hover:text-white'}>
                  {item.icon}
                </span>

                {!collapsed && (
                  <span className="flex-1 text-[13px] truncate">
                    {item.label}
                  </span>
                )}

                {!collapsed && item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white ${item.badgeColor || 'bg-[#1E3A5F]'}`}>
                    {item.badge}
                  </span>
                )}

                {/* Tooltip in collapsed mode */}
                {collapsed && (
                  <div className="hidden group-hover:block absolute left-full ml-2 px-2 py-1 bg-[#0F172A] text-white text-xs rounded whitespace-nowrap z-50 shadow-lg border border-[#334155]">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer / Institutional Motto */}
        <div className="p-3 border-t border-[#1E3A5F] bg-[#071322]">
          {!collapsed ? (
            <div className="space-y-1 text-center">
              <div className="text-[10px] uppercase font-bold text-[#38BDF8] tracking-widest">
                {INSTITUTIONAL_INFO.motto}
              </div>
              <div className="text-[10px] text-[#64748B]">
                San Ignacio, Francisco Morazán
              </div>
            </div>
          ) : (
            <div className="flex justify-center" title="Estudio | Disciplina | Sabiduría • 1970">
              <School className="w-4 h-4 text-[#38BDF8]" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
