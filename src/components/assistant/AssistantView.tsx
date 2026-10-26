import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  RefreshCw, 
  BrainCircuit, 
  ShieldCheck, 
  School,
  CheckCircle2,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { ChatMessage } from '../../types';
import { INSTITUTIONAL_INFO } from '../../data/mockData';

export const AssistantView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'model',
      text: `¡Bienvenido al Asistente Institucional Inteligente de SIS Loyola!

Soy el copiloto pedagógico y administrativo del **Instituto Técnico San Ignacio de Loyola F.M.** (San Ignacio, Francisco Morazán • Fundado en 1970).

Puedo asistirle en:
• **Normativa Educativa de Honduras:** Escalas de evaluación (0-100%, aprobación mínima 70%), régimen de exámenes de recuperación y porcentaje límite de inasistencia (15%).
• **Modalidades Técnicas:** BTP en Informática, BTP en Electricidad, BTP en Contaduría y Finanzas, y Ciclo Básico Técnico.
• **Redacción Institucional:** Citatorios a padres de familia, actas de disciplina, observaciones en boletas de calificaciones y certificados de solvencia.
• **Orientación Administrativa:** Consultas sobre el lema *"Estudio | Disciplina | Sabiduría"* y directrices de secretaría.

¿En qué tarea docente o administrativa puedo colaborar hoy?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingMode, setThinkingMode] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickPrompts = [
    '¿Cuál es la escala oficial y nota mínima aprobatoria según la SEP?',
    'Redactar citatorio a tutor por acumulación de inasistencias (>15%)',
    'Estructura de asignaturas del BTP en Informática de 10mo a 12mo',
    'Redactar observación pedagógica para estudiante con bajo rendimiento en talleres',
    'Historia y lema del Instituto Técnico San Ignacio de Loyola (1970)'
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(1).map(m => ({
        role: m.role,
        text: m.text
      }));

      const modelToUse = thinkingMode ? 'gemini-4-argon' : 'gemini-3.8-flash';

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: historyPayload,
          model: modelToUse
        })
      });

      const data = await res.json();
      
      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: data.reply || data.error || 'No se recibió respuesta del modelo.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isThinking: thinkingMode
      };

      setMessages(prev => [...prev, botReply]);
    } catch (err: any) {
      const errorReply: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: `Error de conexión con el Asistente SIS Loyola: ${err.message}. Asegúrese de que el servidor Express esté activo.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([messages[0]]);
  };

  return (
    <div className="bg-white rounded border border-[#E2E8F0] shadow-2xs flex flex-col h-[calc(100vh-140px)] min-h-[550px] overflow-hidden">
      {/* Chat Header */}
      <div className="bg-[#0B1E36] text-white px-4 py-3 flex items-center justify-between border-b border-[#1E3A5F]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#1D4ED8] flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4 text-[#93C5FD]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Copiloto Pedagógico Institucional
              </h3>
              <span className="px-1.5 py-0.2 bg-[#059669] text-white text-[9px] font-bold rounded-full">
                Gemini 3.8 / 4
              </span>
            </div>
            <p className="text-[10px] text-[#94A3B8]">
              {INSTITUTIONAL_INFO.name} • San Ignacio, F.M.
            </p>
          </div>
        </div>

        {/* Options: Thinking mode toggle & Clear */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setThinkingMode(!thinkingMode)}
            className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1.5 border transition-all ${
              thinkingMode
                ? 'bg-[#1D4ED8] text-white border-[#3B82F6]'
                : 'bg-[#1E3A5F] text-[#94A3B8] border-transparent hover:text-white'
            }`}
            title="Activa pensamiento reflexivo profundo con gemini-4-argon para análisis complejos"
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Modo Pensamiento (gemini-4-argon)</span>
          </button>

          <button
            onClick={clearChat}
            className="p-1 rounded text-[#94A3B8] hover:text-white hover:bg-[#1E3A5F] transition-colors"
            title="Reiniciar conversación"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#F8FAFC]">
        {messages.map((msg) => {
          const isModel = msg.role === 'model';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isModel ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold ${
                  isModel 
                    ? 'bg-[#0B1E36] text-white border border-[#1E3A5F]' 
                    : 'bg-[#1D4ED8] text-white'
                }`}
              >
                {isModel ? <School className="w-3.5 h-3.5 text-[#38BDF8]" /> : <User className="w-3.5 h-3.5" />}
              </div>

              {/* Bubble */}
              <div
                className={`rounded p-3.5 text-xs shadow-2xs relative group ${
                  isModel
                    ? 'bg-white border border-[#E2E8F0] text-[#0F172A]'
                    : 'bg-[#1D4ED8] text-white'
                }`}
              >
                {/* Header inside bubble */}
                <div className="flex items-center justify-between gap-4 mb-1.5 pb-1 border-b border-black/5">
                  <span className="font-semibold text-[10px] uppercase tracking-wider opacity-75">
                    {isModel ? 'Asistente SIS Loyola' : 'Secretaría Académica'}
                  </span>
                  <span className="text-[10px] opacity-60 font-tabular">{msg.timestamp}</span>
                </div>

                {/* Text Content */}
                <div className="whitespace-pre-line leading-relaxed text-[12px]">
                  {msg.text}
                </div>

                {/* Copy button for model responses */}
                {isModel && (
                  <button
                    onClick={() => handleCopyText(msg.id, msg.text)}
                    className="absolute top-2 right-2 p-1 text-[#94A3B8] hover:text-[#0F172A] opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copiar texto"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3.5 h-3.5 text-[#059669]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3 max-w-md mr-auto">
            <div className="w-7 h-7 rounded-full bg-[#0B1E36] text-white flex items-center justify-center shrink-0 border border-[#1E3A5F]">
              <School className="w-3.5 h-3.5 text-[#38BDF8]" />
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded p-3 text-xs text-[#64748B] flex items-center gap-2 shadow-2xs">
              <Sparkles className="w-4 h-4 text-[#1D4ED8] animate-spin" />
              <span>
                {thinkingMode 
                  ? 'Razonando en profundidad con gemini-4-argon...' 
                  : 'Generando respuesta con Gemini 3.8...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 bg-white border-t border-[#E2E8F0] overflow-x-auto flex gap-1.5 no-scrollbar">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            className="px-2.5 py-1 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] hover:text-[#0F172A] rounded-full text-[11px] whitespace-nowrap transition-colors border border-[#E2E8F0]"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="p-3 bg-white border-t border-[#E2E8F0]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Consulte sobre reglamentos, redacción de documentos institucionales, cálculo de notas..."
            disabled={isLoading}
            className="flex-1 px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs text-[#0F172A] focus:bg-white focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8] outline-hidden"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] disabled:bg-[#CBD5E1] text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Enviar</span>
          </button>
        </form>
      </div>
    </div>
  );
};
