export type TabType = 
  | 'dashboard' 
  | 'students' 
  | 'grades' 
  | 'attendance' 
  | 'finance' 
  | 'teachers' 
  | 'assistant' 
  | 'institution';

export type StudentStatus = 'Matriculado' | 'Pendiente' | 'Condicionado' | 'Inactivo';

export type TechnicalTrack = 
  | 'BTP en Informática' 
  | 'BTP en Electricidad' 
  | 'BTP en Contaduría y Finanzas' 
  | 'Ciclo Básico Técnico';

export interface Student {
  id: string;
  rne: string; // Registro Nacional de Estudiantes (Identidad Hondureña: 0818-XXXX-XXXXX)
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  grade: string; // e.g. "10mo Grado", "11mo Grado", "12mo Grado", "8vo Grado"
  section: string; // e.g. "Sección A", "Sección B"
  track: TechnicalTrack;
  status: StudentStatus;
  guardianName: string;
  guardianPhone: string;
  address: string;
  enrollmentDate: string;
  overallAverage: number;
  attendanceRate: number;
  financialSolvency: 'Solvente' | 'Pendiente' | 'En Mora';
  pendingDocuments?: string[];
  photoUrl?: string;
  notes?: string;
}

export interface SubjectEvaluation {
  id: string;
  studentId: string;
  studentName: string;
  rne: string;
  subjectName: string;
  track: TechnicalTrack;
  grade: string;
  section: string;
  p1: number; // Parcial 1 (0-100)
  p2: number; // Parcial 2 (0-100)
  p3: number; // Parcial 3 (0-100)
  p4: number; // Parcial 4 (0-100)
  finalAverage: number;
  recovery?: number; // Examen de nivelación/recuperación
  passed: boolean;
}

export interface AttendanceEntry {
  studentId: string;
  studentName: string;
  rne: string;
  status: 'P' | 'FJ' | 'FI' | 'T'; // Presente, Falta Justificada, Falta Injustificada, Tardanza
  comment?: string;
}

export interface Transaction {
  id: string;
  receiptNumber: string; // Correlativo fiscal e.g. "REC-2026-00412"
  studentId: string;
  studentName: string;
  rne: string;
  concept: string; // "Matrícula Anual 2026", "Aporte de Taller Eléctrico", "Carnet Institucional", etc.
  amount: number; // En Lempiras (L.)
  date: string;
  paymentMethod: 'Efectivo' | 'Depósito Bancario' | 'Transferencia';
  status: 'Completado' | 'Anulado';
  receivedBy: string;
}

export interface Teacher {
  id: string;
  name: string;
  title: string;
  specialty: string;
  email: string;
  phone: string;
  assignedClasses: string[];
  workshop: string;
  status: 'Activo' | 'Licencia';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  isThinking?: boolean;
}
