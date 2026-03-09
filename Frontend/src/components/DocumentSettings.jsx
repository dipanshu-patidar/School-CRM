import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../api/settingApi';
import { Check, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const DOCUMENT_TYPES = ['PDF', 'DOC', 'DOCX', 'JPG', 'PNG', 'XLSX', 'CSV'];

const DocumentSettings = () => {
    const [types, setTypes] = useState([]);
    const [maxSize, setMaxSize] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setIsLoading(true);
            const response = await getSettings();
            if (response.success) {
                setTypes(response.data.allowedDocumentTypes || []);
                setMaxSize(response.data.maxFileSizeMB || 10);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            setStatus({ type: 'error', message: 'Failed to load configuration' });
        } finally {
            setIsLoading(false);
        }
    };

    const toggleType = (type) => {
        if (types.includes(type)) {
            setTypes(types.filter(t => t !== type));
        } else {
            setTypes([...types, type]);
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const response = await updateSettings({
                allowedDocumentTypes: types,
                maxFileSizeMB: maxSize
            });
            if (response.success) {
                setStatus({ type: 'success', message: 'Settings saved successfully!' });
                setTimeout(() => setStatus({ type: '', message: '' }), 3000);
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            setStatus({ type: 'error', message: 'Failed to save configuration' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 size={32} className="animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-primary rounded-full"></div>
                    <h2 className="text-xl font-bold text-gray-900">Document Upload Settings</h2>
                </div>
                {status.message && (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                        }`}>
                        {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                        {status.message}
                    </div>
                )}
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
                                        flex items-center gap-3 px-4 py-2.5 rounded-lg border text-sm font-bold transition-all cursor-pointer
                                        ${isSelected
                                            ? 'bg-primary/10 border-primary/20 text-primary'
                                            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300'
                                        }
                                    `}
                                >
                                    <div className={`w-4 h-4 rounded-md border flex justify-center items-center shrink-0 ${isSelected ? 'bg-primary border-primary' : 'border-gray-300 bg-white'}`}>
                                        {isSelected && <Check size={12} className="text-black" />}
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
                            className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">MB</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-8 py-3 bg-primary hover:bg-primary-hover text-black font-bold rounded-xl transition-all shadow-lg shadow-primary/20 cursor-pointer active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                    {isSaving && <Loader2 size={18} className="animate-spin" />}
                    {isSaving ? 'Saving...' : 'Save Document Settings'}
                </button>
            </div>
        </div>
    );
};

export default DocumentSettings;
