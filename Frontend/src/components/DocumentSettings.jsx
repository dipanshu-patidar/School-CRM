import React, { useState } from 'react';
import { Check } from 'lucide-react';

const DOCUMENT_TYPES = ['PDF', 'DOC', 'DOCX', 'JPG', 'PNG', 'XLSX', 'CSV'];

const DocumentSettings = () => {
    const [types, setTypes] = useState(['PDF', 'DOC', 'DOCX', 'JPG', 'PNG']);
    const [maxSize, setMaxSize] = useState(10);

    const toggleType = (type) => {
        if (types.includes(type)) {
            setTypes(types.filter(t => t !== type));
        } else {
            setTypes([...types, type]);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-2 mb-8">
                <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
                <h2 className="text-xl font-bold text-gray-900">Document Upload Settings</h2>
            </div>

            <div className="space-y-8 max-w-2xl">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-4">Allowed File Types</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {DOCUMENT_TYPES.map(type => {
                            const isSelected = types.includes(type);
                            return (
                                <button
                                    key={type}
                                    onClick={() => toggleType(type)}
                                    className={`
                                        flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-bold transition-all cursor-pointer
                                        ${isSelected
                                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300'
                                        }
                                    `}
                                >
                                    <div className={`w-4 h-4 rounded mt-0.5 border flex justify-center items-center shrink-0 ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 bg-white'}`}>
                                        {isSelected && <Check size={12} className="text-white" />}
                                    </div>
                                    {type}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Max File Size (MB)</label>
                    <div className="relative max-w-xs">
                        <input
                            type="number"
                            value={maxSize}
                            onChange={(e) => setMaxSize(parseInt(e.target.value) || 0)}
                            className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">MB</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-100 cursor-pointer active:scale-95">
                    Save Document Settings
                </button>
            </div>
        </div>
    );
};

export default DocumentSettings;
