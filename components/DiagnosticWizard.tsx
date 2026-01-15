import React, { useState, useRef } from 'react';
import { ViewState, AnalysisResult } from '../types';
import { AVAILABLE_TOOLS, PAIN_POINTS_SUGGESTIONS } from '../constants';
import { generateAnalysis } from '../services/geminiService';
import { 
  ChevronRight, 
  Mic, 
  StopCircle, 
  Sparkles,
  Briefcase,
  AlertCircle,
  Plus,
  Trash2,
  CheckCircle2
} from 'lucide-react';

interface WizardProps {
  onComplete: (result: AnalysisResult) => void;
  onCancel: () => void;
}

export const DiagnosticWizard: React.FC<WizardProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Audio State
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  // Form State
  const [clientName, setClientName] = useState('');
  const [industry, setIndustry] = useState('');
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [selectedPainPoints, setSelectedPainPoints] = useState<string[]>([]);
  const [customToolInput, setCustomToolInput] = useState('');
  
  // Error State
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    // Step 1 Validation
    if (step === 1) {
        if (!clientName.trim()) {
            setError('Por favor, ingresa el nombre de la empresa para continuar.');
            return;
        }
        if (!industry) {
            setError('Por favor, selecciona una industria.');
            return;
        }
    }
    
    setError(null);
    setStep(prev => prev + 1);
  };
  
  const handleBack = () => {
    setError(null);
    setStep(prev => prev - 1);
  };

  const toggleTool = (tool: string) => {
    setSelectedTools(prev => 
      prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]
    );
  };

  const addCustomTool = () => {
    if (customToolInput.trim() && !selectedTools.includes(customToolInput.trim())) {
      setSelectedTools(prev => [...prev, customToolInput.trim()]);
      setCustomToolInput('');
    }
  };

  const togglePainPoint = (point: string) => {
    setSelectedPainPoints(prev => 
      prev.includes(point) ? prev.filter(p => p !== point) : [...prev, point]
    );
  };

  // Audio Recording Logic
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setAudioBase64(reader.result);
          }
        };
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("No se pudo acceder al micrófono.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const deleteAudio = () => {
    setAudioBase64(null);
    chunksRef.current = [];
  };

  const handleFinish = async () => {
    setIsAnalyzing(true);
    try {
      const result = await generateAnalysis({
        clientName,
        industry,
        tools: selectedTools,
        painPoints: selectedPainPoints,
        audioBase64: audioBase64 || undefined
      });
      onComplete(result);
    } catch (e) {
      console.error("Analysis failed", e);
      setError("Hubo un error al generar el análisis.");
      setIsAnalyzing(false);
    }
  };

  // Render Step Content
  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Perfil del Cliente</h2>
              <p className="text-gray-500 dark:text-gray-400">¿A quién vamos a optimizar hoy?</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre de la Empresa</label>
                <div className="flex items-center bg-gray-50 dark:bg-surfaceHighlight rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700 focus-within:border-primary transition-colors">
                  <Briefcase size={18} className="text-gray-400 dark:text-gray-500 mr-3" />
                  <input 
                    type="text" 
                    value={clientName}
                    onChange={(e) => {
                        setClientName(e.target.value);
                        if (error) setError(null);
                    }}
                    placeholder="Ej. Acme Corp" 
                    className="bg-transparent border-none outline-none text-gray-900 dark:text-white w-full placeholder-gray-400 dark:placeholder-gray-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Industria</label>
                <select 
                  value={industry}
                  onChange={(e) => {
                      setIndustry(e.target.value);
                      if (error) setError(null);
                  }}
                  className="w-full bg-gray-50 dark:bg-surfaceHighlight border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-primary appearance-none"
                >
                  <option value="" disabled>Selecciona Industria</option>
                  <option value="SaaS">SaaS / Tecnología</option>
                  <option value="Ecommerce">E-commerce</option>
                  <option value="Legal">Servicios Legales</option>
                  <option value="Health">Salud</option>
                  <option value="Finance">Finanzas</option>
                </select>
              </div>

              {error && (
                  <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg flex items-center gap-2">
                      <AlertCircle size={16} />
                      {error}
                  </div>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Stack Tecnológico</h2>
              <p className="text-gray-500 dark:text-gray-400">¿Qué herramientas están usando actualmente?</p>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center">
              {AVAILABLE_TOOLS.map(tool => (
                <button
                  key={tool}
                  onClick={() => toggleTool(tool)}
                  className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    selectedTools.includes(tool)
                      ? 'bg-primary/10 border-primary text-primary dark:text-white'
                      : 'bg-gray-50 dark:bg-surfaceHighlight border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {tool}
                </button>
              ))}
              {/* Custom Tools that have been added */}
               {selectedTools.filter(t => !AVAILABLE_TOOLS.includes(t)).map(tool => (
                <button
                  key={tool}
                  onClick={() => toggleTool(tool)}
                  className="px-4 py-3 rounded-xl border text-sm font-medium transition-all bg-primary/10 border-primary text-primary dark:text-white flex items-center gap-1"
                >
                  {tool}
                </button>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
               <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block text-center">Agregar otra herramienta</label>
               <div className="flex gap-2 max-w-xs mx-auto">
                 <input 
                    type="text"
                    value={customToolInput}
                    onChange={(e) => setCustomToolInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCustomTool()}
                    placeholder="Ej. Trello"
                    className="flex-1 bg-gray-50 dark:bg-surfaceHighlight border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:border-primary"
                 />
                 <button 
                    onClick={addCustomTool}
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white px-3 py-2 rounded-lg transition-colors"
                 >
                    <Plus size={18} />
                 </button>
               </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Puntos de Dolor</h2>
              <p className="text-gray-500 dark:text-gray-400">¿Dónde les duele más?</p>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center">
              {PAIN_POINTS_SUGGESTIONS.map(point => (
                <button
                  key={point}
                  onClick={() => togglePainPoint(point)}
                  className={`px-4 py-2 rounded-full border text-sm transition-all flex items-center gap-2 ${
                    selectedPainPoints.includes(point)
                      ? 'bg-accent/10 border-accent text-accent dark:text-white'
                      : 'bg-gray-50 dark:bg-surfaceHighlight border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {selectedPainPoints.includes(point) && <AlertCircle size={14} />}
                  {point}
                </button>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
               <div className="text-center mb-4">
                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                   <Mic size={18} /> Contexto de Audio
                 </h3>
                 <p className="text-xs text-gray-500">Graba una breve descripción de sus problemas (Gemini 2.5)</p>
               </div>
               
               <div className="flex flex-col items-center">
                 {!audioBase64 ? (
                   <>
                     <button
                       onClick={isRecording ? stopRecording : startRecording}
                       className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${
                         isRecording 
                           ? 'bg-red-500 animate-pulse shadow-red-500/50' 
                           : 'bg-gray-100 dark:bg-surfaceHighlight hover:bg-gray-200 dark:hover:bg-gray-700'
                       }`}
                     >
                       {isRecording ? <StopCircle size={32} className="text-white" /> : <Mic size={24} className="text-primary" />}
                     </button>
                     {isRecording && <p className="text-center text-xs text-red-500 mt-2 font-medium">Grabando...</p>}
                   </>
                 ) : (
                   <div className="flex items-center gap-4 bg-green-500/10 border border-green-500/20 px-6 py-3 rounded-full animate-fade-in">
                     <div className="flex items-center gap-2 text-green-500 font-semibold">
                       <CheckCircle2 size={20} />
                       <span>Audio guardado</span>
                     </div>
                     <button 
                       onClick={deleteAudio}
                       className="p-2 hover:bg-red-500/20 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                     >
                       <Trash2 size={18} />
                     </button>
                   </div>
                 )}
               </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] animate-fade-in text-gray-900 dark:text-white">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gray-200 dark:border-surfaceHighlight border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="text-accent animate-pulse" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mt-8">Analizando Oportunidad</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-center max-w-md">
          Gemini 2.5 está analizando tu audio y datos para calcular el ROI...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto h-full flex flex-col justify-center">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Perfil</span>
          <span>Stack</span>
          <span>Análisis</span>
        </div>
        <div className="h-1 bg-gray-200 dark:bg-surfaceHighlight rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-surface border border-gray-200 dark:border-surfaceHighlight rounded-3xl p-6 md:p-10 shadow-xl dark:shadow-2xl min-h-[400px] flex flex-col transition-colors">
        <div className="flex-1">
          {renderStep()}
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-surfaceHighlight">
          <button 
            onClick={step === 1 ? onCancel : handleBack}
            className="text-gray-500 hover:text-gray-900 dark:hover:text-white px-4 py-2 text-sm font-medium transition-colors"
          >
            {step === 1 ? 'Cancelar' : 'Atrás'}
          </button>
          
          <button 
            onClick={step === 3 ? handleFinish : handleNext}
            className="bg-primary hover:bg-primaryDark text-white px-6 py-2.5 rounded-full font-medium shadow-lg shadow-primary/25 flex items-center gap-2 transition-all active:scale-95"
          >
            {step === 3 ? 'Generar Reporte' : 'Continuar'}
            {step !== 3 && <ChevronRight size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};