import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../api/settingApi';
import { Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const DOCUMENT_TYPES = ['PDF', 'DOC', 'DOCX', 'JPG', 'PNG', 'XLSX', 'CSV'];

const DocumentSettings = () => {
    const [types, setTypes] = useState([]);
    const [maxSize, setMaxSize] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

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
            toast.error('Failed to load configuration');
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
        setIsSaving(true);
        const savePromise = updateSettings({
            allowedDocumentTypes: types,
            maxFileSizeMB: maxSize
        });

        toast.promise(savePromise, {
            loading: 'Saving settings...',
            success: 'Settings saved successfully!',
            error: 'Failed to save configuration'
        }).catch((error) => console.error('Error saving settings:', error))
            .finally(() => setIsSaving(false));
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
