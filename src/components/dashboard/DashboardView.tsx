import React from 'react';
import { 
  Users, 
  GraduationCap, 
  ClipboardCheck, 
  Wallet, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight,
  Sparkles,
  BookOpen,
  Calendar,
  Building
} from 'lucide-react';
import { Student, SubjectEvaluation, TabType, Transaction } from '../../types';
import { INSTITUTIONAL_INFO } from '../../data/mockData';

interface DashboardViewProps {
  students: Student[];
  evaluations: SubjectEvaluation[];
  transactions: Transaction[];
  onNavigate: (tab: TabType) => void;
  onOpenNewEnrollment: () => void;
  onSelectStudent: (student: Student) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  evaluations,
  transactions,
  onNavigate,
  onOpenNewEnrollment,
  onSelectStudent
}) => {
  // Compute KPIs
  const totalEnrolled = students.filter(s => s.status === 'Matriculado').length;
  const pendingDocsCount = students.filter(s => s.status === 'Pendiente' || (s.pendingDocuments && s.pendingDocuments.length > 0)).length;
  const averageAttendance = (students.reduce((acc, s) => acc + s.attendanceRate, 0) / (students.length || 1)).toFixed(1);
  const globalAverage = (students.reduce((acc, s) => acc + s.overallAverage, 0) / (students.length || 1)).toFixed(1);
  const totalRevenue = transactions
    .filter(t => t.status === 'Completado')
    .reduce((acc, t) => acc + t.amount, 0);

  // Group by technical track
  const trackCounts = {
    'BTP en Informática': students.filter(s => s.track === 'BTP en Informática').length,
    'BTP en Electricidad': students.filter(s => s.track === 'BTP en Electricidad').length,
    'BTP en Contaduría y Finanzas': students.filter(s => s.track === 'BTP en Contaduría y Finanzas').length,
    'Ciclo Básico Técnico': students.filter(s => s.track === 'Ciclo Básico Técnico').length,
  };

  // Critical alerts (students needing attention: <70 average or attendance < 85%)
  const atRiskStudents = students.filter(s => s.overallAverage < 70 || s.attendanceRate < 85);

  return (
    <div className="space-y-6">
      {/* Institutional Banner */}
      <div className="bg-[#0B1E36] rounded-md p-5 text-white border border-[#1E3A5F] shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
          <img 
            src={INSTITUTIONAL_INFO.crestPath} 
            alt="Crest watermark" 
            className="w-48 h-48 object-contain"
          />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#1D4ED8] text-white text-[10px] font-bold tracking-wider uppercase rounded-xs">
                San Ignacio, F.M. • Fundado en 1970
              </span>
              <span className="text-xs text-[#93C5FD] font-medium">
                {INSTITUTIONAL_INFO.academicCycle}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              {INSTITUTIONAL_INFO.name}
            </h2>
            <p className="text-xs text-[#CBD5E1] max-w-2xl">
              Lema Oficial: <span className="text-[#38BDF8] font-semibold italic">"{INSTITUTIONAL_INFO.motto}"</span>. Sistema Integrado de Información y Control Escolar (SIS Loyola).
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenNewEnrollment}
              className="px-3.5 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold rounded shadow-xs transition-colors flex items-center gap-2"
            >
              <span>+ Nueva Matrícula</span>
            </button>
            <button
              onClick={() => onNavigate('assistant')}
              className="px-3 py-2 bg-[#1E3A5F] hover:bg-[#254A78] text-[#93C5FD] hover:text-white text-xs font-semibold rounded border border-[#3B82F6]/30 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#60A5FA]" />
              <span>Copiloto IA</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Total Enrolled */}
        <div className="bg-white p-4 rounded border border-[#E2E8F0] shadow-2xs hover:border-[#CBD5E1] transition-all">
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Matrícula Activa</span>
            <div className="w-7 h-7 rounded bg-[#EFF4FF] flex items-center justify-center text-[#1D4ED8]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#0F172A] font-tabular">{totalEnrolled}</div>
          <div className="text-[11px] text-[#059669] flex items-center gap-1 mt-1 font-medium">
            <CheckCircle2 className="w-3 h-3" />
            <span>Padrón oficial 2026</span>
          </div>
        </div>

        {/* Global Academic Average */}
        <div className="bg-white p-4 rounded border border-[#E2E8F0] shadow-2xs hover:border-[#CBD5E1] transition-all">
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Índice Promedio</span>
            <div className="w-7 h-7 rounded bg-[#ECFDF5] flex items-center justify-center text-[#059669]">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#0F172A] font-tabular">{globalAverage}%</div>
          <div className="text-[11px] text-[#64748B] mt-1">
            Meta mínima SEP: 70.0%
          </div>
        </div>

        {/* Average Attendance */}
        <div className="bg-white p-4 rounded border border-[#E2E8F0] shadow-2xs hover:border-[#CBD5E1] transition-all">
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Asistencia Media</span>
            <div className="w-7 h-7 rounded bg-[#EFF6FF] flex items-center justify-center text-[#2563EB]">
              <ClipboardCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#0F172A] font-tabular">{averageAttendance}%</div>
          <div className="text-[11px] text-[#059669] mt-1 font-medium">
            Por encima del 85% normativo
          </div>
        </div>

        {/* Cash Register / Total Collected */}
        <div className="bg-white p-4 rounded border border-[#E2E8F0] shadow-2xs hover:border-[#CBD5E1] transition-all">
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Recaudación (HNL)</span>
            <div className="w-7 h-7 rounded bg-[#FEF3C7] flex items-center justify-center text-[#D97706]">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#0F172A] font-tabular">
            L. {totalRevenue.toLocaleString('es-HN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">
            {transactions.length} recibos procesados
          </div>
        </div>

        {/* Pending Review / Alerts */}
        <div className="bg-white p-4 rounded border border-[#E2E8F0] shadow-2xs hover:border-[#CBD5E1] transition-all">
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Expedientes x Revisar</span>
            <div className="w-7 h-7 rounded bg-[#FEE2E2] flex items-center justify-center text-[#DC2626]">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#DC2626] font-tabular">{pendingDocsCount}</div>
          <div className="text-[11px] text-[#64748B] mt-1">
            Papelería pendiente en secretaría
          </div>
        </div>
      </div>

      {/* Main Content Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Distribution by Track + Critical Academic Alerts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Technical Tracks Breakdown */}
          <div className="bg-white rounded border border-[#E2E8F0] shadow-2xs p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F1F5F9]">
              <div>
                <h3 className="text-sm font-semibold text-[#0F172A]">
                  Distribución por Modalidad Técnica
                </h3>
                <p className="text-xs text-[#64748B]">
                  Especialidades aprobadas para el Instituto Técnico San Ignacio de Loyola F.M.
                </p>
              </div>
              <button 
                onClick={() => onNavigate('students')}
                className="text-xs font-semibold text-[#1D4ED8] hover:text-[#1E40AF] flex items-center gap-1"
              >
                <span>Ver Padrón</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {Object.entries(trackCounts).map(([trackName, count]) => {
                const percentage = Math.round((count / (students.length || 1)) * 100);
                return (
                  <div key={trackName} className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-sm">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-semibold text-[#0F172A]">{trackName}</span>
                      <span className="text-xs font-bold text-[#1D4ED8] font-tabular">{count} alumnos</span>
                    </div>
                    <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#1D4ED8] h-full rounded-full transition-all duration-300" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-[#64748B] mt-1 font-tabular">
                      <span>{percentage}% del total escolar</span>
                      <span>Capacidad regular</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Academic & Attendance Alerts Table */}
          <div className="bg-white rounded border border-[#E2E8F0] shadow-2xs overflow-hidden">
            <div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#D97706]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                  Casos de Atención Prioritaria y Alertas Académicas
                </h3>
              </div>
              <span className="text-[11px] bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A] px-2 py-0.5 rounded-full font-semibold">
                {atRiskStudents.length} alertas detectadas
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F8FAFC] text-[#64748B] border-b border-[#E2E8F0] text-[11px] font-semibold uppercase tracking-wider">
                    <th className="py-2.5 px-4">Estudiante / RNE</th>
                    <th className="py-2.5 px-3">Modalidad</th>
                    <th className="py-2.5 px-3 text-right">Promedio</th>
                    <th className="py-2.5 px-3 text-right">Asistencia</th>
                    <th className="py-2.5 px-3">Motivo de Alerta</th>
                    <th className="py-2.5 px-4 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {atRiskStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-2.5 px-4">
                        <div className="font-semibold text-[#0F172A]">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-[10px] text-[#64748B] font-tabular">
                          RNE: {student.rne}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-[#334155]">
                        <div>{student.track}</div>
                        <div className="text-[10px] text-[#64748B]">{student.grade} - {student.section}</div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-tabular font-bold">
                        <span className={student.overallAverage < 70 ? 'text-[#DC2626]' : 'text-[#059669]'}>
                          {student.overallAverage}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-tabular font-bold">
                        <span className={student.attendanceRate < 85 ? 'text-[#DC2626]' : 'text-[#059669]'}>
                          {student.attendanceRate}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        {student.overallAverage < 70 && (
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA] mr-1">
                            Reprobación ({student.overallAverage}%)
                          </span>
                        )}
                        {student.attendanceRate < 85 && (
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
                            Faltas &gt; 15%
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <button
                          onClick={() => onSelectStudent(student)}
                          className="px-2 py-1 bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded text-[11px] font-semibold text-[#1D4ED8]"
                        >
                          Ver Expediente
                        </button>
                      </td>
                    </tr>
                  ))}
                  {atRiskStudents.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-[#64748B]">
                        No se registran alumnos en condición crítica o riesgo de reprobación actualmente.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Quick Administrative Triggers & Institutional Calendar */}
        <div className="space-y-6">
          {/* Quick Triggers */}
          <div className="bg-white rounded border border-[#E2E8F0] shadow-2xs p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-3 pb-2 border-b border-[#F1F5F9]">
              Accesos Directos de Secretaría
            </h3>

            <div className="space-y-2">
              <button
                onClick={onOpenNewEnrollment}
                className="w-full p-2.5 text-left rounded border border-[#E2E8F0] hover:border-[#1D4ED8] hover:bg-[#EFF4FF] transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-semibold text-[#0F172A] group-hover:text-[#1D4ED8]">
                    Inscribir Estudiante
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    Generar ficha oficial y carnet
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1D4ED8]" />
              </button>

              <button
                onClick={() => onNavigate('grades')}
                className="w-full p-2.5 text-left rounded border border-[#E2E8F0] hover:border-[#1D4ED8] hover:bg-[#EFF4FF] transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-semibold text-[#0F172A] group-hover:text-[#1D4ED8]">
                    Sábana de Calificaciones
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    Registrar o nivelar notas del parcial
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1D4ED8]" />
              </button>

              <button
                onClick={() => onNavigate('finance')}
                className="w-full p-2.5 text-left rounded border border-[#E2E8F0] hover:border-[#1D4ED8] hover:bg-[#EFF4FF] transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-semibold text-[#0F172A] group-hover:text-[#1D4ED8]">
                    Emitir Recibo de Pago
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    Caja escolar en Lempiras (HNL)
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1D4ED8]" />
              </button>

              <button
                onClick={() => onNavigate('assistant')}
                className="w-full p-2.5 text-left rounded bg-[#F0FDF4] border border-[#BBF7D0] hover:bg-[#DCFCE7] transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-semibold text-[#059669]">
                    Consultar Copiloto Gemini
                  </div>
                  <div className="text-[11px] text-[#065F46]">
                    Normativa de SEP y apoyo pedagógico
                  </div>
                </div>
                <Sparkles className="w-4 h-4 text-[#059669]" />
              </button>
            </div>
          </div>

          {/* Institutional Calendar / Academic Schedule */}
          <div className="bg-white rounded border border-[#E2E8F0] shadow-2xs p-4">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#F1F5F9]">
              <Calendar className="w-4 h-4 text-[#1D4ED8]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                Calendario Institucional 2026
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-10 text-center py-1 bg-[#F1F5F9] rounded text-[10px] font-bold text-[#0B1E36] shrink-0 font-tabular">
                  15 FEB
                </div>
                <div>
                  <div className="font-semibold text-[#0F172A]">Cierre de Matrícula Ordinaria</div>
                  <div className="text-[11px] text-[#64748B]">Secretaría General y Dirección</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-10 text-center py-1 bg-[#EFF4FF] rounded text-[10px] font-bold text-[#1D4ED8] shrink-0 font-tabular">
                  28 MAR
                </div>
                <div>
                  <div className="font-semibold text-[#0F172A]">Evaluaciones de I Parcial</div>
                  <div className="text-[11px] text-[#64748B]">Talleres técnicos y materias académicas</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-10 text-center py-1 bg-[#ECFDF5] rounded text-[10px] font-bold text-[#059669] shrink-0 font-tabular">
                  12 ABR
                </div>
                <div>
                  <div className="font-semibold text-[#0F172A]">Entrega de Boletas a Tutores</div>
                  <div className="text-[11px] text-[#64748B]">Asamblea de padres de familia</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
