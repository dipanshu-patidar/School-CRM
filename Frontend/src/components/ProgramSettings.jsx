import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../api/settingApi';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const ProgramSettings = () => {
    const [config, setConfig] = useState({
        programName: '',
        completionPointsThreshold: 250
    });
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
                setConfig({
                    programName: response.data.programName,
                    completionPointsThreshold: response.data.completionPointsThreshold
                });
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            setStatus({ type: 'error', message: 'Failed to load configuration' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const response = await updateSettings({
                programName: config.programName,
                completionPointsThreshold: config.completionPointsThreshold
            });
            if (response.success) {
                setStatus({ type: 'success', message: 'Configuration saved successfully!' });
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
                    <h2 className="text-xl font-bold text-gray-900">Program Configuration</h2>
                </div>
                {status.message && (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                        }`}>
                        {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                        {status.message}
                    </div>
                )}
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
                        value={config.completionPointsThreshold}
                        onChange={(e) => setConfig({ ...config, completionPointsThreshold: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                    />
                    <p className="text-xs text-gray-500 mt-2 font-medium">Students must reach this point level to complete the program.</p>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-8 py-3 bg-primary hover:bg-primary-hover text-black font-bold rounded-xl transition-all shadow-lg shadow-primary/20 cursor-pointer active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                    {isSaving && <Loader2 size={18} className="animate-spin" />}
                    {isSaving ? 'Saving...' : 'Save Configuration'}
                </button>
            </div>
        </div>
    );
};

export default ProgramSettings;
