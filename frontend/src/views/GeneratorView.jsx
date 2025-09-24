// src/views/GeneratorView.jsx
import React, { useState } from 'react';

function GeneratorView({ state, setState, onGenerateByTheme, onGenerateCustom }) {
  const [mode, setMode] = useState('ia');
  const themes = ['filosofia', 'ciencia', 'arte', 'tecnologia', 'sabiduria', 'historia', 'naturaleza'];

  const handleThemeChange = (e) => setState(prev => ({ ...prev, ia: { ...prev.ia, theme: e.target.value } }));
  const handleCustomTextChange = (e) => setState(prev => ({ ...prev, custom: { ...prev.custom, text: e.target.value } }));
  
  const handleShowAnswer = () => setState(prev => ({ ...prev, ia: { ...prev.ia, isAnswerVisible: true } }));
  
  const handleSubmitTheme = (e) => { 
    e.preventDefault(); 
    setState(prev => ({ ...prev, ia: { ...prev.ia, isAnswerVisible: false } }));
    onGenerateByTheme(); 
  };
  const handleSubmitCustom = (e) => { e.preventDefault(); onGenerateCustom(); };

  const commonTabStyles = "px-6 py-2 font-semibold rounded-t-lg transition-colors focus:outline-none";
  const activeTabStyles = "bg-slate-700/50 text-white";
  const inactiveTabStyles = "bg-black/20 text-gray-400 hover:bg-slate-800/40";

  const resultDataIA = state.ia.generatedData;
  const resultDataCustom = state.custom.generatedData;
  const errorIA = state.ia.error;
  const errorCustom = state.custom.error;

  return (
    <div>
      <div className="flex justify-center border-b border-slate-600 -mb-px">
        <button onClick={() => setMode('ia')} className={`${commonTabStyles} ${mode === 'ia' ? activeTabStyles : inactiveTabStyles}`}>Generar con IA</button>
        <button onClick={() => setMode('custom')} className={`${commonTabStyles} ${mode === 'custom' ? activeTabStyles : inactiveTabStyles}`}>Crear el Mío</button>
      </div>

      <div className="pt-8 bg-slate-700/30 p-6 rounded-b-lg">
        {mode === 'ia' && (
          <form onSubmit={handleSubmitTheme}>
            <div className="mb-4">
              <label htmlFor="theme-select" className="block text-gray-300 font-bold mb-2">Elige un Tema</label>
              <select 
                id="theme-select" 
                className="w-full p-3 border border-slate-600 bg-slate-800/50 text-white rounded-md" 
                value={state.ia.theme} 
                onChange={handleThemeChange}
              >
                {themes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <button type="submit" disabled={state.ia.isLoading} className="w-full px-6 py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 disabled:bg-green-300 transition-all">
              {state.ia.isLoading ? 'Generando...' : 'Generar Criptograma con IA'}
            </button>
          </form>
        )}

        {mode === 'custom' && (
          <form onSubmit={handleSubmitCustom}>
            <div className="mb-4">
              <label htmlFor="custom-text" className="block text-gray-300 font-bold mb-2">Escribe tu Frase</label>
              <textarea 
                id="custom-text" 
                className="w-full p-3 bg-slate-800/50 text-white placeholder-gray-400 border border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 transition" 
                rows="4" 
                value={state.custom.text} 
                onChange={handleCustomTextChange} 
                placeholder="La vida es como una bicicleta, para mantener el equilibrio debes seguir adelante..." 
              />
            </div>
            <button type="submit" disabled={state.custom.isLoading} className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-all">
              {state.custom.isLoading ? 'Creando...' : 'Crear mi Criptograma'}
            </button>
          </form>
        )}
      </div>

      <div className="mt-8">
        {mode === 'ia' && errorIA && <div className="p-4 bg-red-500/20 text-red-300 rounded-md">{errorIA}</div>}
        {mode === 'ia' && resultDataIA && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h3 className="font-bold text-gray-300">Frase Original:</h3>
              {state.ia.isAnswerVisible ? (
                <p className="p-2 bg-slate-800/50 rounded-md italic">"{resultDataIA.original_phrase}"</p>
              ) : (
                // --- CORRECCIÓN --- Se añade el onClick
                <button 
                  onClick={handleShowAnswer} 
                  className="w-full p-2 bg-yellow-500/20 text-yellow-300 rounded-md hover:bg-yellow-500/30"
                >
                  Mostrar Respuesta
                </button>
              )}
            </div>
            <div>
              <h3 className="font-bold text-gray-300">Criptograma Generado:</h3>
              <p className="p-4 bg-green-500/10 text-green-300 rounded-md font-mono break-words">{resultDataIA.cryptogram}</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-300">Pistas:</h3>
              <p className="p-4 bg-green-500/10 text-green-300 rounded-md font-mono">
                {JSON.stringify(resultDataIA.clues)}
              </p>
            </div>
          </div>
        )}

        {mode === 'custom' && errorCustom && <div className="p-4 bg-red-500/20 text-red-300 rounded-md">{errorCustom}</div>}
        {mode === 'custom' && resultDataCustom && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h3 className="font-bold text-gray-300">Tu Frase Original:</h3>
              <p className="p-2 bg-slate-800/50 rounded-md italic">"{resultDataCustom.original_phrase}"</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-300">Tu Criptograma:</h3>
              <p className="p-4 bg-green-500/10 text-green-300 rounded-md font-mono break-words">{resultDataCustom.cryptogram}</p>
            </div>
             <div>
              <h3 className="font-bold text-gray-300">Clave de Solución:</h3>
              <p className="p-2 mt-1 bg-black/20 rounded-md font-mono break-words">
                {JSON.stringify(resultDataCustom.solution_key)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GeneratorView;