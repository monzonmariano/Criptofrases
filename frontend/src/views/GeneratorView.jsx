import React from 'react';

function GeneratorView({ state, setState, onSubmit }) {
  const themes = ['filosofia', 'ciencia', 'arte', 'tecnologia', 'sabiduria', 'historia', 'naturaleza', 'amor', 'amistad', 'motivacion', 'literatura', 'viajes'];
  
  const handleThemeChange = (e) => setState(prev => ({ ...prev, theme: e.target.value }));
  const handleShowAnswer = () => setState(prev => ({ ...prev, isAnswerVisible: true }));
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-200 mb-6 text-center">Generador de Criptofrases</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="theme-select" className="block text-gray-300 font-bold mb-2">Elige un Tema</label>
          <select id="theme-select" className="theme-select w-full p-3 border border-slate-600 bg-slate-800/50 text-white rounded-md focus:ring-2 focus:ring-blue-500" value={state.theme} onChange={handleThemeChange}>
            {themes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
        <button type="submit" disabled={state.isLoading} className="w-full px-6 py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 disabled:bg-green-300 transition-all">
          {state.isLoading ? 'Generando...' : 'Generar Nuevo Criptograma'}
        </button>
      </form>
      <div className="mt-8">
        {state.error && <div className="p-4 bg-red-500/20 text-red-300 rounded-md">{state.error}</div>}
        {state.generatedData && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-300">Frase Original:</h3>
              {state.isAnswerVisible ? ( <p className="p-2 bg-slate-800/50 rounded-md italic">"{state.generatedData.original_phrase}"</p> ) : ( <button onClick={handleShowAnswer} className="w-full p-2 bg-yellow-500/20 text-yellow-300 rounded-md hover:bg-yellow-500/30">Mostrar Respuesta</button> )}
            </div>
            <div>
              <h3 className="font-bold text-gray-300">Criptograma Generado:</h3>
              <p className="p-4 bg-green-500/10 text-green-300 rounded-md font-mono break-words">{state.generatedData.cryptogram}</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-300">Pistas:</h3>
              <p className="p-4 bg-green-500/10 text-green-300 rounded-md font-mono">{JSON.stringify(state.generatedData.clues)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GeneratorView;