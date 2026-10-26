import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SubjectEvaluation, Transaction } from '../types';
import { INSTITUTIONAL_INFO } from '../data/mockData';

// --- GRADES REPORT EXPORTS ---

export function exportGradesPDF(
  evaluations: SubjectEvaluation[],
  subjectName: string,
  trackFilter: string
) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const currentDate = new Date().toLocaleDateString('es-HN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate metrics
  const totalStudents = evaluations.length;
  const avg = totalStudents > 0 
    ? (evaluations.reduce((acc, e) => acc + e.finalAverage, 0) / totalStudents).toFixed(1)
    : '0';
  const passedCount = evaluations.filter(e => e.passed).length;
  const failedCount = totalStudents - passedCount;
  const passRate = totalStudents > 0 ? Math.round((passedCount / totalStudents) * 100) : 0;

  // Header Banner
  doc.setFillColor(11, 30, 54); // #0B1E36 (Institutional Navy)
  doc.rect(0, 0, 297, 26, 'F');

  // Title & Subtitle
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('INSTITUTO TÉCNICO SAN IGNACIO DE LOYOLA F.M.', 14, 10);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`ACTA OFICIAL DE EVALUACIÓN Y CALIFICACIONES • ${INSTITUTIONAL_INFO.academicCycle.toUpperCase()}`, 14, 16);
  doc.text(`San Ignacio, Francisco Morazán • Fundado en 1970 • Lema: "${INSTITUTIONAL_INFO.motto}"`, 14, 21);

  // Meta details bar
  doc.setTextColor(15, 23, 42); // #0F172A
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`Asignatura:`, 14, 33);
  doc.setFont('helvetica', 'normal');
  doc.text(subjectName === 'all' ? 'Todas las Asignaturas' : subjectName, 35, 33);

  doc.setFont('helvetica', 'bold');
  doc.text(`Modalidad:`, 120, 33);
  doc.setFont('helvetica', 'normal');
  doc.text(trackFilter === 'all' ? 'Todas las Especialidades Técnicas' : trackFilter, 140, 33);

  doc.setFont('helvetica', 'bold');
  doc.text(`Fecha de Emisión:`, 220, 33);
  doc.setFont('helvetica', 'normal');
  doc.text(currentDate, 250, 33);

  // Metric summaries row
  doc.setFillColor(241, 245, 249); // #F1F5F9
  doc.roundedRect(14, 37, 269, 10, 1.5, 1.5, 'F');
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text(`Total Alumnos: ${totalStudents}`, 20, 43.5);
  doc.text(`Promedio Grupal: ${avg}%`, 80, 43.5);
  doc.setTextColor(4, 120, 87);
  doc.text(`Aprobados (>= 70%): ${passedCount} (${passRate}%)`, 140, 43.5);
  doc.setTextColor(185, 28, 28);
  doc.text(`Reprobados / En Riesgo: ${failedCount}`, 215, 43.5);

  // Table Data
  const tableRows = evaluations.map((item, index) => [
    (index + 1).toString(),
    item.studentName,
    item.rne,
    item.track,
    `${item.grade} - ${item.section}`,
    item.p1.toString(),
    item.p2.toString(),
    item.p3.toString(),
    item.p4.toString(),
    `${item.finalAverage}%`,
    item.recovery !== undefined && item.recovery > 0 ? `${item.recovery}%` : '-',
    item.passed ? 'APROBADO' : 'REPROBADO'
  ]);

  autoTable(doc, {
    startY: 50,
    head: [[
      '#',
      'Estudiante',
      'RNE',
      'Modalidad Técnica',
      'Grado y Sección',
      'I Parcial',
      'II Parcial',
      'III Parcial',
      'IV Parcial',
      'Promedio',
      'Nivelación',
      'Condición'
    ]],
    body: tableRows,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
      textColor: [15, 23, 42],
      lineColor: [226, 232, 240],
      lineWidth: 0.2
    },
    headStyles: {
      fillColor: [11, 30, 54],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { cellWidth: 50 },
      2: { cellWidth: 30, fontStyle: 'bold' },
      3: { cellWidth: 42 },
      4: { cellWidth: 28 },
      5: { halign: 'center', cellWidth: 16 },
      6: { halign: 'center', cellWidth: 16 },
      7: { halign: 'center', cellWidth: 16 },
      8: { halign: 'center', cellWidth: 16 },
      9: { halign: 'center', fontStyle: 'bold', cellWidth: 18 },
      10: { halign: 'center', cellWidth: 16 },
      11: { halign: 'center', fontStyle: 'bold', cellWidth: 23 }
    },
    didParseCell: (data) => {
      // Style Condition Column (Column index 11)
      if (data.section === 'body' && data.column.index === 11) {
        if (data.cell.raw === 'APROBADO') {
          data.cell.styles.textColor = [4, 120, 87]; // #047857
          data.cell.styles.fillColor = [236, 253, 245]; // #ECFDF5
        } else {
          data.cell.styles.textColor = [185, 28, 28]; // #B91C1C
          data.cell.styles.fillColor = [254, 242, 242]; // #FEF2F2
        }
      }
    }
  });

  // Signatures at bottom
  const finalY = (doc as any).lastAutoTable?.finalY || 160;
  const signatureY = Math.min(finalY + 22, 185);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);

  // Line 1: Docente
  doc.line(20, signatureY, 85, signatureY);
  doc.text('Firma del Docente Titular', 33, signatureY + 4);

  // Line 2: Secretaría
  doc.line(115, signatureY, 180, signatureY);
  doc.text('Secretaría Académica General', 128, signatureY + 4);

  // Line 3: Dirección
  doc.line(210, signatureY, 275, signatureY);
  doc.text('Dirección y Sello Institucional', 223, signatureY + 4);

  const cleanSubject = subjectName.replace(/\s+/g, '_');
  doc.save(`Acta_Oficial_Calificaciones_${cleanSubject}_${new Date().toISOString().slice(0, 10)}.pdf`);
}

export function exportGradesCSV(
  evaluations: SubjectEvaluation[],
  subjectName: string
) {
  const headers = [
    'No',
    'Estudiante',
    'RNE',
    'Modalidad_Tecnica',
    'Grado',
    'Seccion',
    'Asignatura',
    'I_Parcial',
    'II_Parcial',
    'III_Parcial',
    'IV_Parcial',
    'Promedio_Final',
    'Nivelacion',
    'Condicion'
  ];

  const rows = evaluations.map((item, index) => [
    index + 1,
    `"${item.studentName}"`,
    `"${item.rne}"`,
    `"${item.track}"`,
    `"${item.grade}"`,
    `"${item.section}"`,
    `"${item.subjectName}"`,
    item.p1,
    item.p2,
    item.p3,
    item.p4,
    item.finalAverage,
    item.recovery ?? '',
    item.passed ? 'APROBADO' : 'REPROBADO'
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const cleanSubject = subjectName.replace(/\s+/g, '_');
  link.setAttribute('download', `SabanadeNotas_${cleanSubject}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// --- FINANCE REPORT EXPORTS ---

export function exportFinancePDF(transactions: Transaction[]) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const currentDate = new Date().toLocaleDateString('es-HN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const totalAmount = transactions
    .filter(t => t.status === 'Completado')
    .reduce((acc, t) => acc + t.amount, 0);

  // Header Banner
  doc.setFillColor(11, 30, 54); // #0B1E36
  doc.rect(0, 0, 210, 26, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('INSTITUTO TÉCNICO SAN IGNACIO DE LOYOLA F.M.', 14, 10);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('INFORME OFICIAL DE CAJA Y RECAUDACIÓN ESCOLAR', 14, 16);
  doc.text(`San Ignacio, Francisco Morazán • Código Municipal: 0818 • Ciclo ${INSTITUTIONAL_INFO.academicCycle}`, 14, 21);

  // Meta row
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`Período de Caja:`, 14, 33);
  doc.setFont('helvetica', 'normal');
  doc.text('I Semestre 2026', 42, 33);

  doc.setFont('helvetica', 'bold');
  doc.text(`Fecha de Emisión:`, 130, 33);
  doc.setFont('helvetica', 'normal');
  doc.text(currentDate, 160, 33);

  // Financial summary card
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, 37, 182, 14, 1.5, 1.5, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text(`Total Comprobantes: ${transactions.length}`, 20, 45);

  doc.setTextColor(15, 23, 42);
  doc.text('MONTO TOTAL RECAUDADO (HNL):', 90, 45);
  doc.setTextColor(4, 120, 87);
  doc.setFontSize(11);
  doc.text(`L. ${totalAmount.toLocaleString('es-HN', { minimumFractionDigits: 2 })}`, 155, 45);

  // Table rows
  const tableRows = transactions.map((t) => [
    t.receiptNumber,
    t.studentName,
    t.rne,
    t.concept,
    t.paymentMethod,
    t.date,
    `L. ${t.amount.toFixed(2)}`,
    t.status
  ]);

  autoTable(doc, {
    startY: 55,
    head: [[
      'No. Recibo',
      'Estudiante',
      'RNE',
      'Concepto',
      'Método',
      'Fecha',
      'Monto (HNL)',
      'Estado'
    ]],
    body: tableRows,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
      textColor: [15, 23, 42],
      lineColor: [226, 232, 240],
      lineWidth: 0.2
    },
    headStyles: {
      fillColor: [11, 30, 54],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { fontStyle: 'bold', halign: 'center', cellWidth: 26 },
      1: { cellWidth: 40 },
      2: { cellWidth: 28 },
      3: { cellWidth: 38 },
      4: { cellWidth: 20 },
      5: { cellWidth: 25, halign: 'center' },
      6: { halign: 'right', fontStyle: 'bold', cellWidth: 24 },
      7: { halign: 'center', cellWidth: 18 }
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 6) {
        data.cell.styles.textColor = [4, 120, 87];
      }
    }
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 180;
  const signatureY = Math.min(finalY + 25, 260);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);

  doc.line(30, signatureY, 85, signatureY);
  doc.text('Caja y Recaudación Escolar', 38, signatureY + 4);

  doc.line(125, signatureY, 180, signatureY);
  doc.text('Auditoría y Secretaría General', 133, signatureY + 4);

  doc.save(`Informe_Caja_SIS_Loyola_${new Date().toISOString().slice(0, 10)}.pdf`);
}

export function exportFinanceCSV(transactions: Transaction[]) {
  const headers = [
    'No_Recibo',
    'Estudiante',
    'RNE',
    'Concepto',
    'Metodo_Pago',
    'Fecha',
    'Monto_HNL',
    'Estado',
    'Recibido_Por'
  ];

  const rows = transactions.map((t) => [
    `"${t.receiptNumber}"`,
    `"${t.studentName}"`,
    `"${t.rne}"`,
    `"${t.concept}"`,
    `"${t.paymentMethod}"`,
    `"${t.date}"`,
    t.amount.toFixed(2),
    `"${t.status}"`,
    `"${t.receivedBy}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Reporte_Caja_SIS_Loyola_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
