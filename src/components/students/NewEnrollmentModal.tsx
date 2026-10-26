import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { Student, TechnicalTrack } from '../../types';

interface NewEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnrollStudent: (student: Student) => void;
  currentCount: number;
}

export const NewEnrollmentModal: React.FC<NewEnrollmentModalProps> = ({
  isOpen,
  onClose,
  onEnrollStudent,
  currentCount
}) => {
  if (!isOpen) return null;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [rne, setRne] = useState('0818-');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [track, setTrack] = useState<TechnicalTrack>('BTP en Informática');
  const [grade, setGrade] = useState('10mo Grado');
  const [section, setSection] = useState('Sección A');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('+504 ');
  const [address, setAddress] = useState('San Ignacio, F.M.');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];

    if (!firstName.trim()) newErrors.push('El nombre del estudiante es obligatorio.');
    if (!lastName.trim()) newErrors.push('Los apellidos son obligatorios.');
    if (!rne.trim() || rne.length < 10) newErrors.push('El RNE institucional debe tener formato válido (0818-YYYY-XXXXX).');
    if (!guardianName.trim()) newErrors.push('El nombre del tutor o encargado es obligatorio.');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const newId = `EST-2026-${String(currentCount + 1).padStart(3, '0')}`;
    const newStudent: Student = {
      id: newId,
      rne: rne.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      gender,
      grade,
      section,
      track,
      status: 'Matriculado',
      guardianName: guardianName.trim(),
      guardianPhone: guardianPhone.trim(),
      address: address.trim(),
      enrollmentDate: new Date().toISOString().slice(0, 10),
      overallAverage: 0,
      attendanceRate: 100,
      financialSolvency: 'Solvente',
      pendingDocuments: [],
      notes: notes.trim() || 'Matrícula ordinaria ciclo 2026.'
    };

    onEnrollStudent(newStudent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1E36]/60 backdrop-blur-xs">
      <div className="bg-white rounded-md border border-[#CBD5E1] shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#0B1E36] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#38BDF8]" />
            <div>
              <h3 className="text-sm font-semibold tracking-wide">
                Ficha Oficial de Matrícula 2026
              </h3>
              <p className="text-[11px] text-[#94A3B8]">
                Instituto Técnico San Ignacio de Loyola F.M.
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {errors.length > 0 && (
            <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded text-[#B91C1C] space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>Por favor corrija los siguientes campos:</span>
              </div>
              <ul className="list-disc list-inside text-[11px]">
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Student Identifiers */}
          <div className="space-y-3">
            <div className="font-bold uppercase tracking-wider text-[#0B1E36] text-[11px] border-b border-[#F1F5F9] pb-1">
              Datos Personales del Alumno
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#334155] font-semibold mb-1">
                  Nombres <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Ej. Juan Ramón"
                  className="w-full px-2.5 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs text-[#0F172A] focus:bg-white focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[#334155] font-semibold mb-1">
                  Apellidos <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Ej. Pineda Flores"
                  className="w-full px-2.5 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs text-[#0F172A] focus:bg-white focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8] outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#334155] font-semibold mb-1">
                  RNE / Cédula de Identidad <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={rne}
                  onChange={(e) => setRne(e.target.value)}
                  placeholder="0818-2009-XXXXX"
                  className="w-full px-2.5 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs font-tabular text-[#0F172A] focus:bg-white focus:border-[#1D4ED8] outline-hidden"
                />
                <span className="text-[10px] text-[#64748B]">Código 0818: San Ignacio, F.M.</span>
              </div>

              <div>
                <label className="block text-[#334155] font-semibold mb-1">
                  Sexo
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'M' | 'F')}
                  className="w-full px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded text-xs text-[#0F172A] focus:border-[#1D4ED8] outline-hidden"
                >
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
            </div>
          </div>

          {/* Academic Allocation */}
          <div className="space-y-3">
            <div className="font-bold uppercase tracking-wider text-[#0B1E36] text-[11px] border-b border-[#F1F5F9] pb-1">
              Asignación Académica
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[#334155] font-semibold mb-1">
                  Modalidad Técnica
                </label>
                <select
                  value={track}
                  onChange={(e) => setTrack(e.target.value as TechnicalTrack)}
                  className="w-full px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded text-xs text-[#0F172A] focus:border-[#1D4ED8] outline-hidden"
                >
                  <option value="BTP en Informática">BTP en Informática</option>
                  <option value="BTP en Electricidad">BTP en Electricidad</option>
                  <option value="BTP en Contaduría y Finanzas">BTP en Contaduría y Finanzas</option>
                  <option value="Ciclo Básico Técnico">Ciclo Básico Técnico</option>
                </select>
              </div>

              <div>
                <label className="block text-[#334155] font-semibold mb-1">
                  Grado
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded text-xs text-[#0F172A] focus:border-[#1D4ED8] outline-hidden"
                >
                  <option value="7mo Grado">7mo Grado</option>
                  <option value="8vo Grado">8vo Grado</option>
                  <option value="9no Grado">9no Grado</option>
                  <option value="10mo Grado">10mo Grado</option>
                  <option value="11mo Grado">11mo Grado</option>
                  <option value="12mo Grado">12mo Grado</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#334155] font-semibold mb-1">
                  Sección
                </label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded text-xs text-[#0F172A] focus:border-[#1D4ED8] outline-hidden"
                >
                  <option value="Sección A">Sección A</option>
                  <option value="Sección B">Sección B</option>
                  <option value="Sección Única">Sección Única</option>
                </select>
              </div>

              <div>
                <label className="block text-[#334155] font-semibold mb-1">
                  Ciclo Lectivo
                </label>
                <input
                  type="text"
                  disabled
                  value="2026 (I Semestre)"
                  className="w-full px-2.5 py-1.5 bg-[#F1F5F9] border border-[#CBD5E1] rounded text-xs text-[#64748B]"
                />
              </div>
            </div>
          </div>

          {/* Guardian Info */}
          <div className="space-y-3">
            <div className="font-bold uppercase tracking-wider text-[#0B1E36] text-[11px] border-b border-[#F1F5F9] pb-1">
              Datos del Tutor o Padre de Familia
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#334155] font-semibold mb-1">
                  Nombre del Tutor <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  placeholder="Ej. Carmen Flores"
                  className="w-full px-2.5 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs text-[#0F172A] focus:bg-white focus:border-[#1D4ED8] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[#334155] font-semibold mb-1">
                  Teléfono de Contacto
                </label>
                <input
                  type="text"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  placeholder="+504 9999-9999"
                  className="w-full px-2.5 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs font-tabular text-[#0F172A] focus:bg-white focus:border-[#1D4ED8] outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#334155] font-semibold mb-1">
                Dirección Residencial
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Barrio o aldea, San Ignacio, F.M."
                className="w-full px-2.5 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs text-[#0F172A] focus:bg-white focus:border-[#1D4ED8] outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[#334155] font-semibold mb-1">
                Observaciones de Matrícula
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anotaciones de secretaría académica..."
                className="w-full px-2.5 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs text-[#0F172A] focus:bg-white focus:border-[#1D4ED8] outline-hidden"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded text-xs font-semibold text-[#334155] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Registrar e Imprimir Boleta</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
