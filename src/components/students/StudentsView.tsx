import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  UserPlus, 
  Download, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Phone, 
  MapPin, 
  X,
  Printer,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Edit2
} from 'lucide-react';
import { Student, StudentStatus, TechnicalTrack } from '../../types';
import { INSTITUTIONAL_INFO } from '../../data/mockData';

interface StudentsViewProps {
  students: Student[];
  onAddStudent: (student: Student) => void;
  selectedStudent: Student | null;
  onSelectStudent: (student: Student | null) => void;
  onOpenNewEnrollment: () => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  onAddStudent,
  selectedStudent,
  onSelectStudent,
  onOpenNewEnrollment
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTrack, setFilterTrack] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch = 
      s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rne.includes(searchTerm) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTrack = filterTrack === 'all' || s.track === filterTrack;
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;

    return matchesSearch && matchesTrack && matchesStatus;
  });

  // Export students to CSV
  const handleExportCSV = () => {
    const headers = ['ID,RNE,Nombres,Apellidos,Modalidad,Grado,Sección,Estado,Promedio,Asistencia,Solvencia'];
    const rows = filteredStudents.map(s => 
      `"${s.id}","${s.rne}","${s.firstName}","${s.lastName}","${s.track}","${s.grade}","${s.section}","${s.status}","${s.overallAverage}%","${s.attendanceRate}%","${s.financialSolvency}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `padron_estudiantes_sis_loyola_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: StudentStatus) => {
    switch (status) {
      case 'Matriculado':
        return 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]';
      case 'Pendiente':
        return 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]';
      case 'Condicionado':
        return 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]';
      default:
        return 'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]';
    }
  };

  const getSolvencyBadge = (solvency: Student['financialSolvency']) => {
    switch (solvency) {
      case 'Solvente':
        return 'text-[#059669] bg-[#ECFDF5] border-[#A7F3D0]';
      case 'Pendiente':
        return 'text-[#D97706] bg-[#FFFBEB] border-[#FDE68A]';
      case 'En Mora':
        return 'text-[#DC2626] bg-[#FEF2F2] border-[#FECACA]';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top action toolbar */}
      <div className="bg-white p-3.5 rounded border border-[#E2E8F0] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="flex-1 relative max-w-md">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por RNE (0818-...), nombre o carnet..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs text-[#0F172A] focus:bg-white focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8] outline-hidden font-tabular"
          />
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Track Filter */}
          <select
            value={filterTrack}
            onChange={(e) => setFilterTrack(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded text-xs text-[#334155] focus:border-[#1D4ED8] outline-hidden"
          >
            <option value="all">Todas las Modalidades</option>
            <option value="BTP en Informática">BTP en Informática</option>
            <option value="BTP en Electricidad">BTP en Electricidad</option>
            <option value="BTP en Contaduría y Finanzas">BTP en Contaduría y Finanzas</option>
            <option value="Ciclo Básico Técnico">Ciclo Básico Técnico</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded text-xs text-[#334155] focus:border-[#1D4ED8] outline-hidden"
          >
            <option value="all">Todos los Estados</option>
            <option value="Matriculado">Matriculado</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Condicionado">Condicionado</option>
            <option value="Inactivo">Inactivo</option>
          </select>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="px-2.5 py-1.5 bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded text-xs font-semibold text-[#334155] flex items-center gap-1.5 transition-colors"
            title="Exportar padrón a CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#64748B]" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>

          {/* New Enrollment button */}
          <button
            onClick={onOpenNewEnrollment}
            className="px-3.5 py-1.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Nueva Matrícula</span>
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded border border-[#E2E8F0] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-[#64748B] border-b border-[#E2E8F0] text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-4">Estudiante / Identidad RNE</th>
                <th className="py-2.5 px-3">Modalidad Técnica</th>
                <th className="py-2.5 px-3">Grado y Sección</th>
                <th className="py-2.5 px-3 text-center">Estado</th>
                <th className="py-2.5 px-3 text-right">Promedio</th>
                <th className="py-2.5 px-3 text-right">Asistencia</th>
                <th className="py-2.5 px-3 text-center">Solvencia</th>
                <th className="py-2.5 px-4 text-center">Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredStudents.map((student) => {
                const isSelected = selectedStudent?.id === student.id;
                return (
                  <tr
                    key={student.id}
                    onClick={() => onSelectStudent(student)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#EFF4FF]' : 'hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#0F172A] flex items-center gap-2">
                        <span>{student.firstName} {student.lastName}</span>
                        {student.gender === 'F' ? (
                          <span className="text-[10px] text-pink-500 font-bold">F</span>
                        ) : (
                          <span className="text-[10px] text-blue-500 font-bold">M</span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#64748B] font-tabular">
                        RNE: <span className="font-medium text-[#0B1E36]">{student.rne}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-[#334155] font-medium">
                      {student.track}
                    </td>

                    <td className="py-3 px-3 text-[#334155]">
                      <div className="font-medium">{student.grade}</div>
                      <div className="text-[10px] text-[#64748B]">{student.section}</div>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(student.status)}`}>
                        {student.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-tabular font-bold">
                      <span className={student.overallAverage < 70 ? 'text-[#DC2626]' : 'text-[#059669]'}>
                        {student.overallAverage}%
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-tabular font-bold">
                      <span className={student.attendanceRate < 85 ? 'text-[#DC2626]' : 'text-[#0F172A]'}>
                        {student.attendanceRate}%
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${getSolvencyBadge(student.financialSolvency)}`}>
                        {student.financialSolvency}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStudent(student);
                        }}
                        className="p-1 rounded text-[#1D4ED8] hover:bg-[#DBEAFE] transition-colors"
                        title="Ver Expediente Completo"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#64748B]">
                    No se encontraron registros que coincidan con los criterios de búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer / count info */}
        <div className="px-4 py-2.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B] font-tabular">
          <span>Mostrando {filteredStudents.length} de {students.length} estudiantes registrados</span>
          <span>Padrón Oficial SIS Loyola • San Ignacio F.M.</span>
        </div>
      </div>

      {/* Slide-over / Dossier Drawer for Selected Student */}
      {selectedStudent && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white shadow-2xl z-50 border-l border-[#CBD5E1] flex flex-col animate-in slide-in-from-right duration-200">
          {/* Drawer Header */}
          <div className="bg-[#0B1E36] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#38BDF8]" />
              <div>
                <h3 className="text-sm font-semibold tracking-wide">
                  Expediente y Ficha del Estudiante
                </h3>
                <div className="text-[10px] text-[#94A3B8]">
                  Matrícula Institucional • SIS Loyola
                </div>
              </div>
            </div>
            <button
              onClick={() => onSelectStudent(null)}
              className="p-1 rounded hover:bg-[#1E3A5F] text-[#94A3B8] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {/* Student ID Card Header */}
            <div className="p-4 bg-[#F8FAFC] rounded border border-[#E2E8F0] flex items-start gap-3.5">
              <div className="w-14 h-14 rounded bg-[#0B1E36] text-white flex items-center justify-center font-bold text-lg shrink-0 border border-[#CBD5E1]">
                {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#0F172A]">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </h4>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadge(selectedStudent.status)}`}>
                    {selectedStudent.status}
                  </span>
                </div>
                <div className="text-xs text-[#1D4ED8] font-bold font-tabular mt-0.5">
                  RNE: {selectedStudent.rne}
                </div>
                <div className="text-[11px] text-[#64748B]">
                  Código: <span className="font-tabular font-medium text-[#0F172A]">{selectedStudent.id}</span>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="p-3.5 bg-white border border-[#E2E8F0] rounded space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#0B1E36] border-b border-[#F1F5F9] pb-1">
                Datos Académicos
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[#64748B] block text-[11px]">Modalidad:</span>
                  <span className="font-semibold text-[#0F172A]">{selectedStudent.track}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[11px]">Grado y Sección:</span>
                  <span className="font-semibold text-[#0F172A]">{selectedStudent.grade} - {selectedStudent.section}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[11px]">Índice General:</span>
                  <span className={`font-bold font-tabular text-sm ${selectedStudent.overallAverage < 70 ? 'text-[#DC2626]' : 'text-[#059669]'}`}>
                    {selectedStudent.overallAverage}%
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[11px]">Asistencia Registrada:</span>
                  <span className="font-bold font-tabular text-sm text-[#0F172A]">
                    {selectedStudent.attendanceRate}%
                  </span>
                </div>
              </div>
            </div>

            {/* Guardian & Contact Information */}
            <div className="p-3.5 bg-white border border-[#E2E8F0] rounded space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#0B1E36] border-b border-[#F1F5F9] pb-1">
                Tutor Legal y Contacto
              </div>
              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-[#64748B] text-[11px] block">Nombre del Tutor:</span>
                  <span className="font-semibold text-[#0F172A]">{selectedStudent.guardianName}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#334155]">
                  <Phone className="w-3.5 h-3.5 text-[#1D4ED8]" />
                  <span className="font-tabular font-medium">{selectedStudent.guardianPhone}</span>
                </div>
                <div className="flex items-start gap-1.5 text-[#334155]">
                  <MapPin className="w-3.5 h-3.5 text-[#64748B] shrink-0 mt-0.5" />
                  <span>{selectedStudent.address}</span>
                </div>
              </div>
            </div>

            {/* Financial Solvency Status */}
            <div className="p-3.5 bg-white border border-[#E2E8F0] rounded space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#0B1E36] border-b border-[#F1F5F9] pb-1 flex items-center justify-between">
                <span>Solvencia de Pagos (HNL)</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getSolvencyBadge(selectedStudent.financialSolvency)}`}>
                  {selectedStudent.financialSolvency}
                </span>
              </div>
              <p className="text-[11px] text-[#64748B]">
                {selectedStudent.financialSolvency === 'Solvente' 
                  ? 'El estudiante está al día con sus cuotas de matrícula y aportes de taller técnico.' 
                  : 'Registra aportes o comprobantes de pago pendientes en Caja Escolar.'}
              </p>
            </div>

            {/* Pending Documents Checklist */}
            <div className="p-3.5 bg-white border border-[#E2E8F0] rounded space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#0B1E36] border-b border-[#F1F5F9] pb-1">
                Papelería y Expediente en Secretaría
              </div>
              {selectedStudent.pendingDocuments && selectedStudent.pendingDocuments.length > 0 ? (
                <div className="space-y-1">
                  <div className="text-[11px] text-[#B45309] font-medium">Documentos Pendientes de Entrega:</div>
                  <ul className="list-disc list-inside text-xs text-[#DC2626] space-y-0.5">
                    {selectedStudent.pendingDocuments.map((doc, i) => (
                      <li key={i}>{doc}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-xs text-[#059669] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Expediente completo y verificado por Secretaría General.</span>
                </div>
              )}
            </div>

            {/* Notes */}
            {selectedStudent.notes && (
              <div className="p-3 bg-[#FFFBEB] border border-[#FDE68A] rounded text-xs text-[#92400E]">
                <span className="font-semibold block mb-0.5">Observación del Coordinador:</span>
                {selectedStudent.notes}
              </div>
            )}
          </div>

          {/* Drawer Actions Footer */}
          <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex gap-2">
            <button
              onClick={() => window.print()}
              className="flex-1 px-3 py-2 bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#0F172A] text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Imprimir Ficha</span>
            </button>
            <button
              onClick={() => onSelectStudent(null)}
              className="flex-1 px-3 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold rounded transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
