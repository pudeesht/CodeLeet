import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="fixed bottom-10 right-10 z-[9999] bg-black text-white p-4 rounded-xl border border-gray-600 shadow-2xl">
      <h1 className="text-xl font-bold text-green-400">Detective Mode</h1>
      <p className="text-sm text-gray-300 mb-2">Build #1 Working!</p>
      
      <button 
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded transition-all"
        onClick={() => setCount(count + 1)}
      >
        Cheaters Caught: {count}
      </button>
    </div>
  );
}

export default App;


