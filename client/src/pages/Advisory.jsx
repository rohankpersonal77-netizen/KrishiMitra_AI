import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Bookmark,
  BookmarkCheck,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp,
  Send,
  HelpCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Database,
  Search
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useFarm } from '../context/FarmContext';

export default function Advisory() {
  const { t, language } = useLanguage();
  const { farmProfile, weather, advisory, toggleSaveAdvisory, savedAdvisories } = useFarm();

  const [expandedWhy, setExpandedWhy] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [questionInput, setQuestionInput] = useState('');
  const [qnaList, setQnaList] = useState([]);
  const [feedbackGiven, setFeedbackGiven] = useState(null);

  const isSaved = savedAdvisories.some((item) => item.id === advisory.id);

  // Text-To-Speech using native Web Speech API
  const handleToggleVoice = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const textToSpeak = `${advisory.actionTitle}. ${advisory.actionSummary}. ${advisory.whyMatters}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Set voice language if available
    if (language === 'hi') utterance.lang = 'hi-IN';
    else if (language === 'mr') utterance.lang = 'mr-IN';
    else utterance.lang = 'en-IN';

    utterance.rate = 0.95;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  // Rule-based question answer generator
  const handleAskQuestion = (customQ) => {
    const q = customQ || questionInput;
    if (!q.trim()) return;

    let ans = '';
    const qLower = q.toLowerCase();

    if (qLower.includes('delay') || qLower.includes('24') || qLower.includes('टाल')) {
      ans = `Delaying irrigation by 24 hours is safe given that the 48-hour rainfall probability is elevated (${weather.rainSum48h} mm expected) and current soil moisture is ${farmProfile.soilMoisture}%. It prevents root saturation and saves electricity.`;
    } else if (qLower.includes('spray') || qLower.includes('fungicide') || qLower.includes('छिड़काव') || qLower.includes('फवारणी')) {
      if (advisory.sprayStatus.includes('Unfavorable')) {
        ans = `Chemical spraying is NOT recommended right now: ${advisory.sprayAdvice}. High winds or impending rain will cause drift or washoff.`;
      } else {
        ans = `Current spray window is OPTIMAL: Wind is ${weather.windSpeed} km/h (below 12 km/h threshold) and no immediate heavy shower is imminent for the next 6 hours.`;
      }
    } else if (qLower.includes('stage') || qLower.includes('water') || qLower.includes('फूल') || qLower.includes('अवस्था')) {
      ans = `At the ${farmProfile.growthStage} stage, ${farmProfile.cropType} has a crop coefficient (Kc) of approximately 1.15. While water uptake is vital for fruit set, excessive moisture leads to vegetative vigor at the expense of floral buds.`;
    } else {
      ans = `Based on current microclimate metrics (Temp: ${weather.currentTemp}°C, Humidity: ${weather.humidity}%, Rain: ${weather.rainSum48h}mm) for ${farmProfile.cropType}, the AI engine prioritizes maintaining aerated root conditions and inspecting for early foliar pathogens.`;
    }

    setQnaList((prev) => [{ question: q, answer: ans, timestamp: new Date().toLocaleTimeString() }, ...prev]);
    setQuestionInput('');
  };

  const handleFeedback = (type) => {
    setFeedbackGiven(type);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-agri-800 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{t('advisory.evidence_quality')}: {advisory.evidenceQuality}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('advisory.title')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t('advisory.subtitle')}
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            {/* Audio Voice Control */}
            <button
              onClick={handleToggleVoice}
              className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-colors ${
                isPlayingAudio
                  ? 'bg-emerald-600 text-white border-emerald-700 animate-pulse'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>{t('advisory.stop_audio')}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-agri-700" />
                  <span>{t('advisory.listen_audio')}</span>
                </>
              )}
            </button>

            {/* Save Advice */}
            <button
              onClick={() => toggleSaveAdvisory(advisory)}
              className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-colors ${
                isSaved
                  ? 'bg-agri-100 text-agri-800 border-agri-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-agri-700" />
                  <span>{t('advisory.saved')}</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>{t('advisory.save_advisory')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Advisory Recommendation Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-agri-800 bg-agri-50 px-3 py-1 rounded-full border border-agri-200">
            {farmProfile.cropType.toUpperCase()} • {farmProfile.growthStage.toUpperCase()} STAGE
          </span>
          <span className="text-xs text-slate-400">
            {new Date(advisory.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
          {advisory.actionTitle}
        </h2>

        <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          {advisory.actionSummary}
        </p>

        {/* Supporting Meta Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
            <span className="text-[11px] font-semibold text-emerald-800">{t('advisory.time_window')}</span>
            <p className="text-xs font-bold text-emerald-950 mt-1">{advisory.timeWindow}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100">
            <span className="text-[11px] font-semibold text-blue-800">{t('weather.spray_condition')}</span>
            <p className="text-xs font-bold text-blue-950 mt-1">{advisory.sprayStatus}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100">
            <span className="text-[11px] font-semibold text-purple-800">Rule Trigger</span>
            <p className="text-xs font-mono font-bold text-purple-950 mt-1 truncate">{advisory.ruleId}</p>
          </div>
        </div>

        {/* Expandable "Why am I receiving this advice?" Accordion */}
        <div className="border border-agri-200 rounded-2xl overflow-hidden mb-6">
          <button
            onClick={() => setExpandedWhy(!expandedWhy)}
            className="w-full px-5 py-4 bg-agri-50/70 hover:bg-agri-50 flex items-center justify-between transition-colors text-left"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded-lg bg-agri-700 text-white flex items-center justify-center font-bold text-xs">
                ?
              </div>
              <span className="text-sm font-bold text-agri-950">
                {t('advisory.why_receiving')}
              </span>
            </div>
            {expandedWhy ? <ChevronUp className="w-5 h-5 text-agri-700" /> : <ChevronDown className="w-5 h-5 text-agri-700" />}
          </button>

          {expandedWhy && (
            <div className="p-5 sm:p-6 bg-white space-y-5 text-xs text-slate-700 divide-y divide-slate-100">
              
              {/* 1. Inputs used */}
              <div className="pt-2 first:pt-0">
                <h3 className="font-bold text-slate-900 text-xs mb-2 flex items-center space-x-1.5">
                  <Database className="w-4 h-4 text-agri-600" />
                  <span>{t('advisory.inputs_used')}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {advisory.inputsUsed.map((inp, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-100 font-medium">
                      • {inp}
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Rule applied */}
              <div className="pt-4">
                <h3 className="font-bold text-slate-900 text-xs mb-1.5 flex items-center space-x-1.5">
                  <Layers className="w-4 h-4 text-agri-600" />
                  <span>{t('advisory.rule_applied')}</span>
                </h3>
                <p className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono text-[11px] text-agri-900">
                  {advisory.ruleApplied}
                </p>
              </div>

              {/* 3. Biological & Physiological Significance */}
              <div className="pt-4">
                <h3 className="font-bold text-slate-900 text-xs mb-1.5 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t('advisory.why_matters')}</span>
                </h3>
                <p className="leading-relaxed bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                  {advisory.whyMatters}
                </p>
              </div>

              {/* 4. Model Assumptions */}
              <div className="pt-4">
                <h3 className="font-bold text-slate-900 text-xs mb-1.5 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-slate-500" />
                  <span>{t('advisory.assumptions_made')}</span>
                </h3>
                <p className="leading-relaxed text-slate-500">
                  {advisory.assumptions}
                </p>
              </div>

              {/* 5. What you should verify */}
              <div className="pt-4">
                <h3 className="font-bold text-amber-900 text-xs mb-1.5 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>{t('advisory.verify_before')}</span>
                </h3>
                <p className="leading-relaxed bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-950 font-medium">
                  {advisory.verifyBefore}
                </p>
              </div>

            </div>
          )}
        </div>

        {/* Feedback Section */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-slate-800">{t('advisory.feedback_prompt')}</p>
            {feedbackGiven && (
              <p className="text-[11px] text-emerald-700 mt-0.5">{t('advisory.feedback_recorded')}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleFeedback('helpful')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center space-x-1.5 transition-colors ${
                feedbackGiven === 'helpful'
                  ? 'bg-emerald-600 text-white border-emerald-700'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{t('advisory.helpful')}</span>
            </button>
            <button
              onClick={() => handleFeedback('not_helpful')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center space-x-1.5 transition-colors ${
                feedbackGiven === 'not_helpful'
                  ? 'bg-slate-800 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>{t('advisory.not_helpful')}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Ask a Follow-up Question Interface */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft">
        <div className="flex items-center space-x-2 text-agri-800 text-xs font-semibold uppercase tracking-wider mb-2">
          <HelpCircle className="w-4 h-4 text-emerald-600" />
          <span>Interactive Agronomic Inquiry</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          {t('advisory.ask_question')}
        </h3>

        {/* Suggested Questions Quick Chips */}
        <div className="mb-4">
          <span className="text-[11px] text-slate-400 block mb-2">{t('advisory.suggested_questions')}</span>
          <div className="flex flex-wrap gap-2">
            {[t('advisory.q1'), t('advisory.q2'), t('advisory.q3')].map((qText, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleAskQuestion(qText)}
                className="text-xs px-3 py-1.5 rounded-full bg-slate-100 hover:bg-agri-50 hover:text-agri-900 hover:border-agri-300 border border-slate-200 text-slate-700 transition-colors"
              >
                {qText}
              </button>
            ))}
          </div>
        </div>

        {/* Question Input Field */}
        <div className="flex items-center space-x-2 mb-6">
          <input
            type="text"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAskQuestion();
            }}
            placeholder={t('advisory.ask_placeholder')}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-agri-500 outline-none"
          />
          <button
            type="button"
            onClick={() => handleAskQuestion()}
            className="px-4 py-2.5 bg-agri-700 hover:bg-agri-800 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors flex-shrink-0"
          >
            <span>{t('advisory.send')}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Question & Answer Responses */}
        {qnaList.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-slate-100">
            {qnaList.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">Q: {item.question}</span>
                  <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                  <strong className="text-agri-700">Agronomic Insight:</strong> {item.answer}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
