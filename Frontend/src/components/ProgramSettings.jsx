import React, { useState } from 'react';

const ProgramSettings = () => {
    const [config, setConfig] = useState({
        programName: 'RIDSS Program',
        completionPoints: 250
    });

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-2 mb-8">
                <div className="w-1 h-6 bg-primary rounded-full"></div>
                <h2 className="text-xl font-bold text-gray-900">Program Configuration</h2>
            </div>

            <div className="space-y-6 max-w-xl">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Program Name</label>
                    <input
                        type="text"
                        value={config.programName}
                        onChange={(e) => setConfig({ ...config, programName: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Completion Points Threshold</label>
                    <input
                        type="number"
                        value={config.completionPoints}
                        onChange={(e) => setConfig({ ...config, completionPoints: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                    />
                    <p className="text-xs text-gray-500 mt-2 font-medium">Students must reach this point level to complete the program.</p>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                <button className="px-8 py-3 bg-primary hover:bg-primary-hover text-black font-bold rounded-xl transition-all shadow-lg shadow-primary/20 cursor-pointer active:scale-95">
                    Save Configuration
                </button>
            </div>
        </div>
    );
};

export default ProgramSettings;
