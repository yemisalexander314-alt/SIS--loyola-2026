import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Calendar, 
  Check, 
  Clock, 
  AlertCircle, 
  Save, 
  CheckCircle2, 
  Filter,
  Printer
} from 'lucide-react';
import { Student } from '../../types';

interface AttendanceViewProps {
  students: Student[];
}

type AttendanceStatus = 'P' | 'FJ' | 'FI' | 'T';

interface AttendanceDayRecord {
  [studentId: string]: {
    status: AttendanceStatus;
    note?: string;
  };
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({ students }) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Initial map of attendance for today
  const [attendanceMap, setAttendanceMap] = useState<AttendanceDayRecord>(() => {
    const initial: AttendanceDayRecord = {};
    students.forEach((s) => {
      // Default initial state: Presente
      initial[s.id] = { status: s.attendanceRate < 85 ? 'FI' : 'P' };
    });
    return initial;
  });

  const filteredStudents = students.filter(s => {
    return selectedTrack === 'all' || s.track === selectedTrack;
  });

  const setStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }));
    setIsSaved(false);
  };

  const markAllPresent = () => {
    setAttendanceMap(prev => {
      const updated = { ...prev };
      filteredStudents.forEach(s => {
        updated[s.id] = { ...updated[s.id], status: 'P' };
      });
      return updated;
    });
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Metrics for current sheet
  const total = filteredStudents.length || 1;
  const countP = filteredStudents.filter(s => attendanceMap[s.id]?.status === 'P').length;
  const countFJ = filteredStudents.filter(s => attendanceMap[s.id]?.status === 'FJ').length;
  const countFI = filteredStudents.filter(s => attendanceMap[s.id]?.status === 'FI').length;
  const countT = filteredStudents.filter(s => attendanceMap[s.id]?.status === 'T').length;
  const dayRate = Math.round(((countP + countT) / total) * 100);

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="bg-white p-4 rounded border border-[#E2E8F0] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Picker */}
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] mb-0.5">Fecha del Registro</label>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs">
              <Calendar className="w-3.5 h-3.5 text-[#1D4ED8]" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-[#0F172A] font-tabular outline-hidden font-semibold"
              />
            </div>
          </div>

          {/* Track Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] mb-0.5">Modalidad / Grado</label>
            <select
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded text-xs text-[#334155] focus:border-[#1D4ED8] outline-hidden font-medium"
            >
              <option value="all">Todas las Secciones del Instituto</option>
              <option value="BTP en Informática">BTP en Informática</option>
              <option value="BTP en Electricidad">BTP en Electricidad</option>
              <option value="BTP en Contaduría y Finanzas">BTP en Contaduría y Finanzas</option>
              <option value="Ciclo Básico Técnico">Ciclo Básico Técnico</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 md:pt-0">
          <button
            onClick={markAllPresent}
            className="px-3 py-1.5 bg-[#EFF4FF] hover:bg-[#DBEAFE] text-[#1D4ED8] border border-[#BFDBFE] rounded text-xs font-semibold transition-colors"
          >
            Marcar Todos Presentes
          </button>

          <button
            onClick={handleSave}
            className="px-3.5 py-1.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaved ? '¡Guardado!' : 'Guardar Asistencia'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="p-1.5 bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded text-[#64748B]"
            title="Imprimir Hoja de Asistencia"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Daily Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-white p-3.5 rounded border border-[#E2E8F0] shadow-2xs text-xs">
        <div>
          <span className="text-[#64748B] block text-[11px]">Asistencia Global:</span>
          <span className="font-bold text-[#1D4ED8] font-tabular text-lg">{dayRate}%</span>
        </div>
        <div>
          <span className="text-[#64748B] block text-[11px]">Presentes (P):</span>
          <span className="font-bold text-[#059669] font-tabular text-lg">{countP}</span>
        </div>
        <div>
          <span className="text-[#64748B] block text-[11px]">Faltas Justif. (FJ):</span>
          <span className="font-bold text-[#D97706] font-tabular text-lg">{countFJ}</span>
        </div>
        <div>
          <span className="text-[#64748B] block text-[11px]">Faltas Injustif. (FI):</span>
          <span className="font-bold text-[#DC2626] font-tabular text-lg">{countFI}</span>
        </div>
        <div>
          <span className="text-[#64748B] block text-[11px]">Tardanzas (T):</span>
          <span className="font-bold text-[#2563EB] font-tabular text-lg">{countT}</span>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded border border-[#E2E8F0] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-[#64748B] border-b border-[#E2E8F0] text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-4 min-w-[200px]">Estudiante / RNE</th>
                <th className="py-2.5 px-3 min-w-[130px]">Modalidad y Grado</th>
                <th className="py-2.5 px-3 text-right">Asistencia Acumulada</th>
                <th className="py-2.5 px-4 text-center">Estado de Hoy</th>
                <th className="py-2.5 px-4">Alerta de Inasistencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredStudents.map((student) => {
                const currentStatus = attendanceMap[student.id]?.status || 'P';
                const hasHighAbsence = student.attendanceRate < 85;

                return (
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
                      <span className={student.attendanceRate < 85 ? 'text-[#DC2626]' : 'text-[#059669]'}>
                        {student.attendanceRate}%
                      </span>
                    </td>

                    {/* Attendance Status Selector Buttons */}
                    <td className="py-2 px-4 text-center">
                      <div className="inline-flex rounded-sm p-0.5 bg-[#F1F5F9] border border-[#E2E8F0] gap-1">
                        <button
                          type="button"
                          onClick={() => setStatus(student.id, 'P')}
                          className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                            currentStatus === 'P'
                              ? 'bg-[#059669] text-white shadow-xs'
                              : 'text-[#64748B] hover:text-[#0F172A]'
                          }`}
                          title="Presente"
                        >
                          P
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatus(student.id, 'FJ')}
                          className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                            currentStatus === 'FJ'
                              ? 'bg-[#D97706] text-white shadow-xs'
                              : 'text-[#64748B] hover:text-[#0F172A]'
                          }`}
                          title="Falta Justificada (Excusa médica / laboral)"
                        >
                          FJ
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatus(student.id, 'FI')}
                          className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                            currentStatus === 'FI'
                              ? 'bg-[#DC2626] text-white shadow-xs'
                              : 'text-[#64748B] hover:text-[#0F172A]'
                          }`}
                          title="Falta Injustificada"
                        >
                          FI
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatus(student.id, 'T')}
                          className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                            currentStatus === 'T'
                              ? 'bg-[#2563EB] text-white shadow-xs'
                              : 'text-[#64748B] hover:text-[#0F172A]'
                          }`}
                          title="Tardanza"
                        >
                          T
                        </button>
                      </div>
                    </td>

                    {/* Status note */}
                    <td className="py-2.5 px-4 text-xs">
                      {hasHighAbsence ? (
                        <div className="flex items-center gap-1.5 text-[#DC2626] font-medium">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Citatorio a tutor requerido (&gt;15% inasistencias)</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-[#059669]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Asistencia regular normal</span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-[#F8FAFC] border-t border-[#E2E8F0] text-[11px] text-[#64748B] flex items-center justify-between">
          <span>P = Presente • FJ = Falta Justificada • FI = Falta Injustificada • T = Tardanza</span>
          <span className="font-semibold text-[#0B1E36]">Registro Diario de Asistencia • SIS Loyola</span>
        </div>
      </div>
    </div>
  );
};
