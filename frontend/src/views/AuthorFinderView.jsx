import React from 'react';

function AuthorFinderView({ state, setState, onSubmit }) {
  const handlePhraseChange = (e) => setState(prev => ({ ...prev, phrase: e.target.value }));
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-200 mb-6 text-center">Buscador de Autor</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="phrase" className="block text-gray-300 font-bold mb-2">Frase Célebre</label>
          <textarea id="phrase" className="w-full p-3 bg-slate-800/50 text-white placeholder-gray-400 border border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 transition" rows="4" placeholder="Escribe aquí la frase cuyo autor quieres encontrar..." value={state.phrase} onChange={handlePhraseChange} />
        </div>
        <button type="submit" disabled={state.isLoading} className="w-full px-6 py-3 bg-teal-600 text-white font-bold rounded-md hover:bg-teal-700 disabled:bg-teal-300 transition-all">
          {state.isLoading ? 'Buscando...' : 'Encontrar Autor'}
        </button>
      </form>
      <div className="mt-8">
        {state.error && <div className="p-4 bg-red-500/20 text-red-300 rounded-md">{state.error}</div>}
        {state.author && (
          <div className="p-4 bg-green-500/10 text-green-300 rounded-md">
            <p className="font-bold text-lg">{state.author}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthorFinderView;