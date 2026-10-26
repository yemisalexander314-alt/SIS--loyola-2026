import React, { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Printer, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  FileSpreadsheet,
  Download,
  Info,
  Save,
  RotateCcw
} from 'lucide-react';
import { SubjectEvaluation, TechnicalTrack } from '../../types';
import { INSTITUTIONAL_INFO } from '../../data/mockData';
import { exportGradesPDF, exportGradesCSV } from '../../utils/reportExport';

interface GradesViewProps {
  evaluations: SubjectEvaluation[];
  onUpdateEvaluations: (evals: SubjectEvaluation[]) => void;
}

export const GradesView: React.FC<GradesViewProps> = ({
  evaluations,
  onUpdateEvaluations
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('Programación I');
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [localEvals, setLocalEvals] = useState<SubjectEvaluation[]>(evaluations);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  
  // Gemini AI analysis state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  // Available subjects from list
  const subjectsList = Array.from(new Set(evaluations.map(e => e.subjectName)));

  // Filtered evaluations
  const currentEvals = localEvals.filter(e => {
    const matchesSubject = selectedSubject === 'all' || e.subjectName === selectedSubject;
    const matchesTrack = selectedTrack === 'all' || e.track === selectedTrack;
    return matchesSubject && matchesTrack;
  });

  // Calculate class metrics
  const classAvg = currentEvals.length > 0 
    ? (currentEvals.reduce((acc, e) => acc + e.finalAverage, 0) / currentEvals.length).toFixed(1)
    : '0';
  const passedCount = currentEvals.filter(e => e.finalAverage >= 70 || (e.recovery && e.recovery >= 70)).length;
  const failedCount = currentEvals.length - passedCount;

  // Handle score change
  const handleScoreChange = (id: string, field: 'p1' | 'p2' | 'p3' | 'p4' | 'recovery', val: number) => {
    if (isLocked) return;
    const clampedVal = Math.min(100, Math.max(0, isNaN(val) ? 0 : val));

    const updated = localEvals.map(item => {
      if (item.id === id) {
        const next = { ...item, [field]: clampedVal };
        // Recalculate average: (p1 + p2 + p3 + p4) / 4
        const avg = Math.round(((next.p1 + next.p2 + next.p3 + next.p4) / 4) * 10) / 10;
        next.finalAverage = avg;
        const isPassed = avg >= 70 || (next.recovery !== undefined && next.recovery >= 70);
        next.passed = isPassed;
        return next;
      }
      return item;
    });

    setLocalEvals(updated);
    setHasUnsavedChanges(true);
  };

  const handleSaveGrades = () => {
    onUpdateEvaluations(localEvals);
    setHasUnsavedChanges(false);
  };

  // Run Gemini analysis on this group's evaluations
  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    setAiReport(null);

    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentData: currentEvals.map(e => ({
            alumno: e.studentName,
            rne: e.rne,
            materia: e.subjectName,
            parciales: [e.p1, e.p2, e.p3, e.p4],
            promedio: e.finalAverage,
            estado: e.passed ? 'Aprobado' : 'Reprobado'
          })),
          analysisType: `Rendimiento Académico en ${selectedSubject} - SIS Loyola`
        })
      });

      const data = await response.json();
      setAiReport(data.analysis || 'No se pudo generar el análisis en este momento.');
    } catch (err: any) {
      setAiReport('Error al conectar con el servidor de análisis pedagógico Gemini: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter & Toolbar */}
      <div className="bg-white p-4 rounded border border-[#E2E8F0] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Subject selector */}
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] mb-0.5">Asignatura</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-2.5 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs font-semibold text-[#0F172A] focus:border-[#1D4ED8] outline-hidden"
            >
              <option value="all">Todas las Asignaturas</option>
              {subjectsList.map(subj => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>
          </div>

          {/* Track selector */}
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] mb-0.5">Modalidad</label>
            <select
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded text-xs text-[#334155] focus:border-[#1D4ED8] outline-hidden"
            >
              <option value="all">Todas las Modalidades</option>
              <option value="BTP en Informática">BTP en Informática</option>
              <option value="BTP en Electricidad">BTP en Electricidad</option>
              <option value="BTP en Contaduría y Finanzas">BTP en Contaduría y Finanzas</option>
            </select>
          </div>

          {/* Status badge */}
          <div className="pt-4">
            <span className={`px-2.5 py-1 rounded text-[11px] font-semibold border ${
              isLocked 
                ? 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]' 
                : 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]'
            }`}>
              {isLocked ? 'Acta Oficial Cerrada' : 'Período de Calificación Abierto'}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-2 md:pt-0">
          {hasUnsavedChanges && (
            <button
              onClick={handleSaveGrades}
              className="px-3 py-1.5 bg-[#059669] hover:bg-[#047857] text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar Notas</span>
            </button>
          )}

          <button
            onClick={handleRunAiAnalysis}
            disabled={isAnalyzing}
            className="px-3 py-1.5 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1D4ED8] border border-[#BFDBFE] rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>{isAnalyzing ? 'Analizando...' : 'Analizar con Gemini'}</span>
          </button>

          <button
            onClick={() => exportGradesPDF(currentEvals, selectedSubject, selectedTrack)}
            className="px-2.5 py-1.5 bg-white hover:bg-[#FEE2E2] text-[#B91C1C] border border-[#FECACA] rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Descargar Acta Oficial en formato PDF"
          >
            <Download className="w-3.5 h-3.5 text-[#DC2626]" />
            <span>Acta PDF</span>
          </button>

          <button
            onClick={() => exportGradesCSV(currentEvals, selectedSubject)}
            className="px-2.5 py-1.5 bg-white hover:bg-[#F1F5F9] text-[#334155] border border-[#CBD5E1] rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Exportar sábana de calificaciones a CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#059669]" />
            <span>CSV</span>
          </button>

          <button
            onClick={() => setIsLocked(!isLocked)}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
              isLocked 
                ? 'bg-white hover:bg-[#F1F5F9] border-[#CBD5E1] text-[#334155]' 
                : 'bg-[#0B1E36] hover:bg-[#132A4A] text-white border-transparent'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isLocked ? 'Reabrir Edición' : 'Cerrar Acta'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="p-1.5 bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded text-[#334155]"
            title="Imprimir Acta Oficial"
          >
            <Printer className="w-4 h-4 text-[#64748B]" />
          </button>
        </div>
      </div>

      {/* Class KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3 rounded border border-[#E2E8F0] shadow-2xs text-xs">
        <div>
          <span className="text-[#64748B] block text-[11px]">Estudiantes Evaluados:</span>
          <span className="font-bold text-[#0F172A] font-tabular text-base">{currentEvals.length}</span>
        </div>
        <div>
          <span className="text-[#64748B] block text-[11px]">Promedio del Grupo:</span>
          <span className="font-bold text-[#1D4ED8] font-tabular text-base">{classAvg}%</span>
        </div>
        <div>
          <span className="text-[#64748B] block text-[11px]">Aprobados (&gt;= 70%):</span>
          <span className="font-bold text-[#059669] font-tabular text-base">{passedCount} alumnos</span>
        </div>
        <div>
          <span className="text-[#64748B] block text-[11px]">En Riesgo / Reprobados:</span>
          <span className="font-bold text-[#DC2626] font-tabular text-base">{failedCount} alumnos</span>
        </div>
      </div>

      {/* AI Analysis Box (if generated) */}
      {aiReport && (
        <div className="p-4 bg-[#F8FAFC] border border-[#BFDBFE] rounded shadow-xs text-xs space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
            <div className="flex items-center gap-2 text-[#1D4ED8] font-bold text-xs">
              <Sparkles className="w-4 h-4 text-[#2563EB]" />
              <span>Informe de Evaluación Pedagógica Asistida por Gemini</span>
            </div>
            <button
              onClick={() => setAiReport(null)}
              className="text-[#94A3B8] hover:text-[#0F172A] text-xs font-semibold"
            >
              Cerrar informe
            </button>
          </div>
          <div className="text-[#334155] leading-relaxed whitespace-pre-line font-normal">
            {aiReport}
          </div>
        </div>
      )}

      {/* Main Dense Spreadsheet Table */}
      <div className="bg-white rounded border border-[#E2E8F0] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-[#64748B] border-b border-[#E2E8F0] text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3 w-8 text-center">#</th>
                <th className="py-2.5 px-4 min-w-[200px]">Estudiante / RNE</th>
                <th className="py-2.5 px-3 min-w-[130px]">Asignatura</th>
                <th className="py-2.5 px-2 text-center w-20">I Parcial</th>
                <th className="py-2.5 px-2 text-center w-20">II Parcial</th>
                <th className="py-2.5 px-2 text-center w-20">III Parcial</th>
                <th className="py-2.5 px-2 text-center w-20">IV Parcial</th>
                <th className="py-2.5 px-3 text-right w-24">Promedio</th>
                <th className="py-2.5 px-2 text-center w-24">Nivelación</th>
                <th className="py-2.5 px-4 text-center w-28">Condición</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {currentEvals.map((record, index) => {
                const isPassed = record.passed;
                return (
                  <tr key={record.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-2.5 px-3 text-center text-[#94A3B8] font-tabular">
                      {index + 1}
                    </td>

                    <td className="py-2.5 px-4">
                      <div className="font-semibold text-[#0F172A]">{record.studentName}</div>
                      <div className="text-[10px] text-[#64748B] font-tabular">
                        RNE: {record.rne} • {record.grade}
                      </div>
                    </td>

                    <td className="py-2.5 px-3 text-[#334155]">
                      <div className="font-medium">{record.subjectName}</div>
                      <div className="text-[10px] text-[#64748B]">{record.track}</div>
                    </td>

                    {/* I Parcial */}
                    <td className="py-1.5 px-1 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        disabled={isLocked}
                        value={record.p1}
                        onChange={(e) => handleScoreChange(record.id, 'p1', parseInt(e.target.value, 10))}
                        className="w-14 text-center py-1 border border-[#CBD5E1] rounded text-xs font-tabular font-semibold focus:border-[#1D4ED8] disabled:bg-[#F8FAFC] disabled:text-[#64748B]"
                      />
                    </td>

                    {/* II Parcial */}
                    <td className="py-1.5 px-1 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        disabled={isLocked}
                        value={record.p2}
                        onChange={(e) => handleScoreChange(record.id, 'p2', parseInt(e.target.value, 10))}
                        className="w-14 text-center py-1 border border-[#CBD5E1] rounded text-xs font-tabular font-semibold focus:border-[#1D4ED8] disabled:bg-[#F8FAFC] disabled:text-[#64748B]"
                      />
                    </td>

                    {/* III Parcial */}
                    <td className="py-1.5 px-1 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        disabled={isLocked}
                        value={record.p3}
                        onChange={(e) => handleScoreChange(record.id, 'p3', parseInt(e.target.value, 10))}
                        className="w-14 text-center py-1 border border-[#CBD5E1] rounded text-xs font-tabular font-semibold focus:border-[#1D4ED8] disabled:bg-[#F8FAFC] disabled:text-[#64748B]"
                      />
                    </td>

                    {/* IV Parcial */}
                    <td className="py-1.5 px-1 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        disabled={isLocked}
                        value={record.p4}
                        onChange={(e) => handleScoreChange(record.id, 'p4', parseInt(e.target.value, 10))}
                        className="w-14 text-center py-1 border border-[#CBD5E1] rounded text-xs font-tabular font-semibold focus:border-[#1D4ED8] disabled:bg-[#F8FAFC] disabled:text-[#64748B]"
                      />
                    </td>

                    {/* Final Average */}
                    <td className="py-2.5 px-3 text-right font-tabular font-bold">
                      <span className={`text-sm ${record.finalAverage < 70 ? 'text-[#DC2626]' : 'text-[#059669]'}`}>
                        {record.finalAverage}%
                      </span>
                    </td>

                    {/* Recovery Exam */}
                    <td className="py-1.5 px-1 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        disabled={isLocked}
                        placeholder="-"
                        value={record.recovery ?? ''}
                        onChange={(e) => handleScoreChange(record.id, 'recovery', parseInt(e.target.value, 10))}
                        className="w-14 text-center py-1 border border-[#CBD5E1] rounded text-xs font-tabular font-semibold focus:border-[#1D4ED8] disabled:bg-[#F8FAFC]"
                      />
                    </td>

                    {/* Passed / Failed badge */}
                    <td className="py-2.5 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        isPassed 
                          ? 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]' 
                          : 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]'
                      }`}>
                        {isPassed ? 'Aprobado' : 'Reprobado'}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {currentEvals.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-[#64748B]">
                    No se encontraron registros de calificaciones para esta combinación de asignatura y modalidad.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Legal Footer Note */}
        <div className="p-3 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#64748B] font-tabular">
          <span>Escala Oficial de Evaluación: 0 a 100% • Mínimo Aprobatorio: 70% (Reglamento General de Educación Técnica)</span>
          <span className="font-semibold text-[#0B1E36]">Instituto Técnico San Ignacio de Loyola F.M.</span>
        </div>
      </div>
    </div>
  );
};
