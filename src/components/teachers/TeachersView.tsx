import React, { useState } from 'react';
import { 
  Briefcase, 
  Mail, 
  Phone, 
  Layers, 
  Clock, 
  Building2, 
  CheckCircle2, 
  Search,
  BookOpen
} from 'lucide-react';
import { Teacher } from '../../types';
import { INITIAL_TEACHERS } from '../../data/mockData';

export const TeachersView: React.FC = () => {
  const [teachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const filtered = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.workshop.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="bg-white p-3.5 rounded border border-[#E2E8F0] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar docente, especialidad o taller..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs text-[#0F172A] focus:bg-white focus:border-[#1D4ED8] outline-hidden"
          />
        </div>
        <div className="text-xs text-[#64748B]">
          <span className="font-bold text-[#0F172A] font-tabular">{teachers.length}</span> docentes técnicos activos
        </div>
      </div>

      {/* Teachers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((t) => (
          <div 
            key={t.id} 
            className="bg-white rounded border border-[#E2E8F0] p-4 shadow-2xs hover:border-[#CBD5E1] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">{t.name}</h3>
                  <div className="text-xs text-[#1D4ED8] font-medium">{t.title}</div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">
                  {t.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-[#475569] my-3">
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                  <span>Especialidad: <strong className="text-[#0F172A]">{t.specialty}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                  <span>Taller / Laboratorio: <strong className="text-[#0F172A]">{t.workshop}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                  <span className="font-tabular">{t.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                  <span className="font-tabular">{t.phone}</span>
                </div>
              </div>

              {/* Classes Badges */}
              <div className="pt-2 border-t border-[#F1F5F9]">
                <div className="text-[11px] font-semibold text-[#64748B] mb-1.5">Carga Académica Asignada:</div>
                <div className="flex flex-wrap gap-1">
                  {t.assignedClasses.map((cls, i) => (
                    <span key={i} className="px-2 py-0.5 bg-[#F1F5F9] text-[#334155] rounded text-[10px] font-medium border border-[#E2E8F0]">
                      {cls}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex justify-end">
              <button
                onClick={() => setSelectedTeacher(t)}
                className="px-2.5 py-1 bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#1D4ED8] rounded text-xs font-semibold"
              >
                Ver Carga Completa
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Teacher Detail Modal */}
      {selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1E36]/60 backdrop-blur-xs">
          <div className="bg-white rounded border border-[#CBD5E1] max-w-md w-full p-5 space-y-4 shadow-xl">
            <div className="flex justify-between items-start border-b border-[#E2E8F0] pb-2">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">{selectedTeacher.name}</h3>
                <p className="text-xs text-[#1D4ED8] font-medium">{selectedTeacher.specialty}</p>
              </div>
              <button
                onClick={() => setSelectedTeacher(null)}
                className="text-xs text-[#64748B] hover:text-[#0F172A] font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                <div className="font-semibold text-[#0B1E36] mb-1">Horario y Taller Asignado:</div>
                <div className="text-[#334155]">{selectedTeacher.workshop}</div>
                <div className="text-[11px] text-[#64748B] mt-1 font-tabular">Jornada Matutina y Vespertina (36 Horas Clase Semanales)</div>
              </div>

              <div>
                <div className="font-semibold text-[#0F172A] mb-1">Materias a Cargo:</div>
                <ul className="list-disc list-inside text-[#334155] space-y-1">
                  {selectedTeacher.assignedClasses.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedTeacher(null)}
                className="px-3.5 py-1.5 bg-[#1D4ED8] text-white text-xs font-semibold rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
