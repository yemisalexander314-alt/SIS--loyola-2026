import React, { useState } from 'react';
import { 
  Wallet, 
  Receipt, 
  PlusCircle, 
  Search, 
  Download, 
  Printer, 
  CheckCircle2, 
  AlertCircle,
  CreditCard,
  Building,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { Student, Transaction } from '../../types';
import { INSTITUTIONAL_INFO } from '../../data/mockData';
import { exportFinancePDF, exportFinanceCSV } from '../../utils/reportExport';

interface FinanceViewProps {
  transactions: Transaction[];
  students: Student[];
  onAddTransaction: (trx: Transaction) => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  transactions,
  students,
  onAddTransaction
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewReceiptModal, setShowNewReceiptModal] = useState(false);
  const [selectedReceiptForPrint, setSelectedReceiptForPrint] = useState<Transaction | null>(null);

  // New receipt form state
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [concept, setConcept] = useState('Aporte de Laboratorio y Taller Técnico');
  const [amount, setAmount] = useState('500.00');
  const [paymentMethod, setPaymentMethod] = useState<'Efectivo' | 'Depósito Bancario' | 'Transferencia'>('Efectivo');

  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    return (
      t.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.rne.includes(searchTerm) ||
      t.concept.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Calculate metrics
  const totalAmount = transactions
    .filter(t => t.status === 'Completado')
    .reduce((acc, t) => acc + t.amount, 0);

  const solventStudentsCount = students.filter(s => s.financialSolvency === 'Solvente').length;
  const overdueStudentsCount = students.filter(s => s.financialSolvency === 'En Mora').length;

  const handleCreateReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return;

    const receiptNum = `REC-2026-${String(transactions.length + 416).padStart(5, '0')}`;
    const newTrx: Transaction = {
      id: `TRX-${Date.now()}`,
      receiptNumber: receiptNum,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      rne: student.rne,
      concept,
      amount: parseFloat(amount) || 0,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      paymentMethod,
      status: 'Completado',
      receivedBy: 'Caja General SIS Loyola'
    };

    onAddTransaction(newTrx);
    setShowNewReceiptModal(false);
    setSelectedReceiptForPrint(newTrx);
  };

  return (
    <div className="space-y-4">
      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Recaudación Total</span>
            <div className="w-7 h-7 rounded bg-[#EFF6FF] flex items-center justify-center text-[#1D4ED8]">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#0F172A] font-tabular">
            L. {totalAmount.toLocaleString('es-HN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[#059669] mt-1 font-medium">
            Fondos auditados ciclo 2026
          </div>
        </div>

        <div className="bg-white p-4 rounded border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Recibos Emitidos</span>
            <div className="w-7 h-7 rounded bg-[#F8FAFC] flex items-center justify-center text-[#0B1E36]">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#0F172A] font-tabular">
            {transactions.length}
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">
            Correlativos fiscales consecutivos
          </div>
        </div>

        <div className="bg-white p-4 rounded border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Estudiantes Solventes</span>
            <div className="w-7 h-7 rounded bg-[#ECFDF5] flex items-center justify-center text-[#059669]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#059669] font-tabular">
            {solventStudentsCount} de {students.length}
          </div>
          <div className="text-[11px] text-[#059669] mt-1 font-medium">
            {Math.round((solventStudentsCount / (students.length || 1)) * 100)}% al día
          </div>
        </div>

        <div className="bg-white p-4 rounded border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">En Mora / Pendiente</span>
            <div className="w-7 h-7 rounded bg-[#FEF2F2] flex items-center justify-center text-[#DC2626]">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#DC2626] font-tabular">
            {overdueStudentsCount}
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">
            Pendiente de regularizar en caja
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-3.5 rounded border border-[#E2E8F0] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por recibo, estudiante, RNE o concepto..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs text-[#0F172A] focus:bg-white focus:border-[#1D4ED8] outline-hidden font-tabular"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportFinancePDF(filteredTransactions)}
            className="px-2.5 py-1.5 bg-white hover:bg-[#FEE2E2] text-[#B91C1C] border border-[#FECACA] rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Generar informe de caja oficial en PDF"
          >
            <Download className="w-3.5 h-3.5 text-[#DC2626]" />
            <span>Informe PDF</span>
          </button>

          <button
            onClick={() => exportFinanceCSV(filteredTransactions)}
            className="px-2.5 py-1.5 bg-white hover:bg-[#F1F5F9] text-[#334155] border border-[#CBD5E1] rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Exportar movimientos de caja a CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#059669]" />
            <span>CSV</span>
          </button>

          <button
            onClick={() => setShowNewReceiptModal(true)}
            className="px-3.5 py-1.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Emitir Recibo Oficial</span>
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded border border-[#E2E8F0] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-[#64748B] border-b border-[#E2E8F0] text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-4">No. Recibo</th>
                <th className="py-2.5 px-4 min-w-[200px]">Estudiante / RNE</th>
                <th className="py-2.5 px-3">Concepto Institucional</th>
                <th className="py-2.5 px-3">Método</th>
                <th className="py-2.5 px-3">Fecha y Hora</th>
                <th className="py-2.5 px-4 text-right">Monto (HNL)</th>
                <th className="py-2.5 px-3 text-center">Estado</th>
                <th className="py-2.5 px-4 text-center">Imprimir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredTransactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-2.5 px-4 font-tabular font-bold text-[#1D4ED8]">
                    {trx.receiptNumber}
                  </td>

                  <td className="py-2.5 px-4">
                    <div className="font-semibold text-[#0F172A]">{trx.studentName}</div>
                    <div className="text-[10px] text-[#64748B] font-tabular">RNE: {trx.rne}</div>
                  </td>

                  <td className="py-2.5 px-3 text-[#334155] font-medium">
                    {trx.concept}
                  </td>

                  <td className="py-2.5 px-3 text-[#64748B]">
                    {trx.paymentMethod}
                  </td>

                  <td className="py-2.5 px-3 text-[#64748B] font-tabular">
                    {trx.date}
                  </td>

                  <td className="py-2.5 px-4 text-right font-tabular font-bold text-[#0F172A]">
                    L. {trx.amount.toFixed(2)}
                  </td>

                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">
                      {trx.status}
                    </span>
                  </td>

                  <td className="py-2.5 px-4 text-center">
                    <button
                      onClick={() => setSelectedReceiptForPrint(trx)}
                      className="p-1 rounded text-[#1D4ED8] hover:bg-[#DBEAFE] transition-colors"
                      title="Ver e Imprimir Comprobante Oficial"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B] font-tabular">
          <span>Moneda Oficial: Lempiras Hondureños (HNL / L.) • Caja Escolar Centralizada</span>
          <span className="font-semibold text-[#0B1E36]">Instituto Técnico San Ignacio de Loyola F.M.</span>
        </div>
      </div>

      {/* Modal: Emit New Receipt */}
      {showNewReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1E36]/60 backdrop-blur-xs">
          <div className="bg-white rounded-md border border-[#CBD5E1] shadow-2xl max-w-lg w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#0B1E36] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#38BDF8]" />
                <h3 className="text-sm font-semibold tracking-wide">
                  Emisión de Recibo Oficial de Caja
                </h3>
              </div>
              <button
                onClick={() => setShowNewReceiptModal(false)}
                className="text-[#94A3B8] hover:text-white p-1 rounded hover:bg-[#1E3A5F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReceipt} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[#334155] font-semibold mb-1">
                  Estudiante Beneficiario
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded text-xs text-[#0F172A] focus:border-[#1D4ED8] outline-hidden"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} — RNE: {s.rne} ({s.track})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#334155] font-semibold mb-1">
                  Concepto del Pago
                </label>
                <select
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded text-xs text-[#0F172A] focus:border-[#1D4ED8] outline-hidden"
                >
                  <option value="Aporte de Laboratorio y Taller Técnico">Aporte de Laboratorio y Taller Técnico</option>
                  <option value="Matrícula Anual Ordinaria 2026">Matrícula Anual Ordinaria 2026</option>
                  <option value="Carnet Estudiantil Digital y Físico">Carnet Estudiantil Digital y Físico</option>
                  <option value="Seguro Escolar y Material de Seguridad">Seguro Escolar y Material de Seguridad</option>
                  <option value="Certificación y Constancia de Estudios">Certificación y Constancia de Estudios</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#334155] font-semibold mb-1">
                    Monto en Lempiras (L.)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs font-tabular font-bold text-[#0F172A] focus:bg-white focus:border-[#1D4ED8] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[#334155] font-semibold mb-1">
                    Método de Pago
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded text-xs text-[#0F172A] focus:border-[#1D4ED8] outline-hidden"
                  >
                    <option value="Efectivo">Efectivo (Caja)</option>
                    <option value="Depósito Bancario">Depósito Bancario</option>
                    <option value="Transferencia">Transferencia Electrónica</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewReceiptModal(false)}
                  className="px-3 py-1.5 bg-white border border-[#CBD5E1] rounded text-xs font-semibold text-[#334155]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded text-xs font-semibold shadow-xs"
                >
                  Registrar e Imprimir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Voucher Modal */}
      {selectedReceiptForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1E36]/60 backdrop-blur-xs">
          <div className="bg-white rounded-md border border-[#CBD5E1] shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="border-b-2 border-[#0B1E36] pb-3 text-center">
              <div className="text-[11px] font-bold uppercase tracking-widest text-[#1D4ED8]">
                {INSTITUTIONAL_INFO.name}
              </div>
              <div className="text-sm font-bold text-[#0F172A] mt-0.5">
                COMPROBANTE OFICIAL DE INGRESO
              </div>
              <div className="text-[10px] text-[#64748B]">
                San Ignacio, Francisco Morazán • Fundado en 1970
              </div>
              <div className="text-xs font-bold font-tabular text-[#1D4ED8] mt-1">
                {selectedReceiptForPrint.receiptNumber}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-[#F1F5F9] pb-1">
                <span className="text-[#64748B]">Fecha:</span>
                <span className="font-tabular font-medium text-[#0F172A]">{selectedReceiptForPrint.date}</span>
              </div>
              <div className="flex justify-between border-b border-[#F1F5F9] pb-1">
                <span className="text-[#64748B]">Estudiante:</span>
                <span className="font-semibold text-[#0F172A]">{selectedReceiptForPrint.studentName}</span>
              </div>
              <div className="flex justify-between border-b border-[#F1F5F9] pb-1">
                <span className="text-[#64748B]">RNE:</span>
                <span className="font-tabular font-medium text-[#0F172A]">{selectedReceiptForPrint.rne}</span>
              </div>
              <div className="flex justify-between border-b border-[#F1F5F9] pb-1">
                <span className="text-[#64748B]">Concepto:</span>
                <span className="font-medium text-[#0F172A]">{selectedReceiptForPrint.concept}</span>
              </div>
              <div className="flex justify-between border-b border-[#F1F5F9] pb-1">
                <span className="text-[#64748B]">Forma de Pago:</span>
                <span className="font-medium text-[#0F172A]">{selectedReceiptForPrint.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-bold text-[#0F172A]">TOTAL RECIBIDO:</span>
                <span className="text-lg font-bold font-tabular text-[#059669]">
                  L. {selectedReceiptForPrint.amount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="pt-6 border-t border-dashed border-[#CBD5E1] text-center text-[10px] text-[#64748B] space-y-4">
              <div>
                <div className="w-32 h-0.5 bg-[#CBD5E1] mx-auto mb-1"></div>
                <div>Firma y Sello de Secretaría / Caja</div>
              </div>
              <div className="italic">
                "{INSTITUTIONAL_INFO.motto}"
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 no-print">
              <button
                onClick={() => setSelectedReceiptForPrint(null)}
                className="px-3 py-1.5 bg-white border border-[#CBD5E1] rounded text-xs font-semibold text-[#334155]"
              >
                Cerrar
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-1.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded text-xs font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Recibo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
