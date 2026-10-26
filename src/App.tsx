import React, { useState, useEffect } from 'react';
import { TabType, Student, SubjectEvaluation, Transaction } from './types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_EVALUATIONS, 
  INITIAL_TRANSACTIONS, 
  INSTITUTIONAL_INFO 
} from './data/mockData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { StatusIndicatorModal } from './components/StatusIndicatorModal';
import { DashboardView } from './components/dashboard/DashboardView';
import { StudentsView } from './components/students/StudentsView';
import { NewEnrollmentModal } from './components/students/NewEnrollmentModal';
import { GradesView } from './components/grades/GradesView';
import { AttendanceView } from './components/attendance/AttendanceView';
import { FinanceView } from './components/finance/FinanceView';
import { TeachersView } from './components/teachers/TeachersView';
import { AssistantView } from './components/assistant/AssistantView';
import { InstitutionView } from './components/institution/InstitutionView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('sis_loyola_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });
  const [evaluations, setEvaluations] = useState<SubjectEvaluation[]>(() => {
    const saved = localStorage.getItem('sis_loyola_evaluations');
    return saved ? JSON.parse(saved) : INITIAL_EVALUATIONS;
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('sis_loyola_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Server & AI status check
  const [serverStatus, setServerStatus] = useState<{ status: string; hasGeminiKey: boolean } | null>(null);

  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => setServerStatus(data))
      .catch(err => {
        console.warn('Backend status check returned local fallback:', err);
        setServerStatus({ status: 'local', hasGeminiKey: false });
      });
  }, []);

  // Save changes to localStorage for continuity
  useEffect(() => {
    localStorage.setItem('sis_loyola_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('sis_loyola_evaluations', JSON.stringify(evaluations));
  }, [evaluations]);

  useEffect(() => {
    localStorage.setItem('sis_loyola_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Handlers
  const handleAddStudent = (newStudent: Student) => {
    setStudents(prev => [newStudent, ...prev]);
    // Also create initial evaluation for new student if in BTP Informática
    const newEval: SubjectEvaluation = {
      id: `EVAL-${Date.now()}`,
      studentId: newStudent.id,
      studentName: `${newStudent.firstName} ${newStudent.lastName}`,
      rne: newStudent.rne,
      subjectName: newStudent.track === 'BTP en Informática' ? 'Programación I' : 'Taller Técnico Básico',
      track: newStudent.track,
      grade: newStudent.grade,
      section: newStudent.section,
      p1: 0,
      p2: 0,
      p3: 0,
      p4: 0,
      finalAverage: 0,
      passed: false
    };
    setEvaluations(prev => [newEval, ...prev]);
    setSelectedStudent(newStudent);
  };

  const handleAddTransaction = (newTrx: Transaction) => {
    setTransactions(prev => [newTrx, ...prev]);
    // If student was pending solvency, mark as solvente
    setStudents(prev => prev.map(s => {
      if (s.id === newTrx.studentId) {
        return { ...s, financialSolvency: 'Solvente' };
      }
      return s;
    }));
  };

  // Pending alerts count
  const pendingAlertsCount = students.filter(s => s.overallAverage < 70 || s.attendanceRate < 85).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-[#0F172A]">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          currentTab={currentTab}
          onOpenStatusModal={() => setIsStatusModalOpen(true)}
          onToggleSidebar={() => setMobileSidebarOpen(true)}
          pendingAlertsCount={pendingAlertsCount}
        />

        {/* Dynamic View Canvas */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              students={students}
              evaluations={evaluations}
              transactions={transactions}
              onNavigate={setCurrentTab}
              onOpenNewEnrollment={() => setIsEnrollmentModalOpen(true)}
              onSelectStudent={setSelectedStudent}
            />
          )}

          {currentTab === 'students' && (
            <StudentsView
              students={students}
              onAddStudent={handleAddStudent}
              selectedStudent={selectedStudent}
              onSelectStudent={setSelectedStudent}
              onOpenNewEnrollment={() => setIsEnrollmentModalOpen(true)}
            />
          )}

          {currentTab === 'grades' && (
            <GradesView
              evaluations={evaluations}
              onUpdateEvaluations={setEvaluations}
            />
          )}

          {currentTab === 'attendance' && (
            <AttendanceView
              students={students}
            />
          )}

          {currentTab === 'finance' && (
            <FinanceView
              transactions={transactions}
              students={students}
              onAddTransaction={handleAddTransaction}
            />
          )}

          {currentTab === 'teachers' && (
            <TeachersView />
          )}

          {currentTab === 'assistant' && (
            <AssistantView />
          )}

          {currentTab === 'institution' && (
            <InstitutionView
              onOpenStatusModal={() => setIsStatusModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* New Student Enrollment Modal */}
      <NewEnrollmentModal
        isOpen={isEnrollmentModalOpen}
        onClose={() => setIsEnrollmentModalOpen(false)}
        onEnrollStudent={handleAddStudent}
        currentCount={students.length}
      />

      {/* Backend & Architectural Transparency Modal */}
      <StatusIndicatorModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        serverStatus={serverStatus}
      />
    </div>
  );
}
