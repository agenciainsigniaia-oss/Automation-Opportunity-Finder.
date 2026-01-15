import React, { useState } from 'react';
import { ViewState } from '../types';
import { AVAILABLE_TOOLS, PAIN_POINTS_SUGGESTIONS } from '../constants';
import { 
  ChevronRight, 
  ChevronLeft, 
  Mic, 
  StopCircle, 
  CheckCircle2, 
  Sparkles,
  LayoutGrid,
  Briefcase,
  AlertCircle
} from 'lucide-react';

interface WizardProps {
  onComplete: () => void;
  onCancel: () => void;
}

export const DiagnosticWizard: React.FC<WizardProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Form State
  const [clientName, setClientName] = useState('');
  const [industry, setIndustry] = useState('');
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [selectedPainPoints, setSelectedPainPoints] = useState<string[]>([]);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const toggleTool = (tool: string) => {
    setSelectedTools(prev => 
      prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]
    );
  };

  const togglePainPoint = (point: string) => {
    setSelectedPainPoints(prev => 
      prev.includes(point) ? prev.filter(p => p !== point) : [...prev, point]
    );
  };

  const handleFinish = () => {
    setIsAnalyzing(true);
    // Simulate Gemini Analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      onComplete();
    }, 2500);
  };

  // Render Step Content
  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white">Client Profile</h2>
              <p className="text-gray-400">Who are we optimizing today?</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Company Name</label>
                <div className="flex items-center bg-surfaceHighlight rounded-xl px-4 py-3 border border-gray-700 focus-within:border-primary transition-colors">
                  <Briefcase size={18} className="text-gray-500 mr-3" />
                  <input 
                    type="text" 
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Acme Corp" 
                    className="bg-transparent border-none outline-none text-white w-full placeholder-gray-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Industry</label>
                <select 
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-surfaceHighlight border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-primary appearance-none"
                >
                  <option value="" disabled>Select Industry</option>
                  <option value="SaaS">SaaS / Technology</option>
                  <option value="Ecommerce">E-commerce</option>
                  <option value="Legal">Legal Services</option>
                  <option value="Health">Healthcare</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white">Tech Stack</h2>
              <p className="text-gray-400">What tools are they currently using?</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {AVAILABLE_TOOLS.map(tool => (
                <button
                  key={tool}
                  onClick={() => toggleTool(tool)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                    selectedTools.includes(tool)
                      ? 'bg-primary/20 border-primary text-white'
                      : 'bg-surfaceHighlight border-transparent text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  {tool}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white">Pain Points</h2>
              <p className="text-gray-400">Where does it hurt the most?</p>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center">
              {PAIN_POINTS_SUGGESTIONS.map(point => (
                <button
                  key={point}
                  onClick={() => togglePainPoint(point)}
                  className={`px-4 py-2 rounded-full border text-sm transition-all flex items-center gap-2 ${
                    selectedPainPoints.includes(point)
                      ? 'bg-accent/20 border-accent text-white'
                      : 'bg-surfaceHighlight border-transparent text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {selectedPainPoints.includes(point) && <AlertCircle size={14} />}
                  {point}
                </button>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-800">
               <div className="text-center mb-4">
                 <h3 className="text-lg font-semibold text-white flex items-center justify-center gap-2">
                   <Mic size={18} /> Audio Context
                 </h3>
                 <p className="text-xs text-gray-500">Record a brief description of their process issues (Gemini 2.5)</p>
               </div>
               
               <div className="flex justify-center">
                 <button
                   onClick={() => setIsRecording(!isRecording)}
                   className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                     isRecording ? 'bg-red-500 animate-pulse' : 'bg-surfaceHighlight hover:bg-gray-700'
                   }`}
                 >
                   {isRecording ? <StopCircle size={32} className="text-white" /> : <Mic size={24} className="text-primary" />}
                 </button>
               </div>
               {isRecording && <p className="text-center text-xs text-red-400 mt-2">Recording...</p>}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] animate-fade-in">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-surfaceHighlight border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="text-accent animate-pulse" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mt-8">Analyzing Opportunity</h2>
        <p className="text-gray-400 mt-2 text-center max-w-md">
          Gemini 2.5 is calculating ROI and matching automation workflows to {clientName}'s stack...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto h-full flex flex-col justify-center">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Profile</span>
          <span>Stack</span>
          <span>Analysis</span>
        </div>
        <div className="h-1 bg-surfaceHighlight rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-surface border border-surfaceHighlight rounded-3xl p-6 md:p-10 shadow-2xl min-h-[400px] flex flex-col">
        <div className="flex-1">
          {renderStep()}
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-surfaceHighlight">
          <button 
            onClick={step === 1 ? onCancel : handleBack}
            className="text-gray-500 hover:text-white px-4 py-2 text-sm font-medium transition-colors"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          
          <button 
            onClick={step === 3 ? handleFinish : handleNext}
            className="bg-primary hover:bg-primaryDark text-white px-6 py-2.5 rounded-full font-medium shadow-lg shadow-primary/25 flex items-center gap-2 transition-all active:scale-95"
          >
            {step === 3 ? 'Generate Report' : 'Continue'}
            {step !== 3 && <ChevronRight size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};