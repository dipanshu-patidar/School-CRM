import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { getSettings } from '../api/settingApi';

const CompletionRules = () => {
    const [threshold, setThreshold] = useState(250);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await getSettings();
                if (response.success) {
                    setThreshold(response.data.completionPointsThreshold);
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 size={32} className="animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-2 mb-8">
                <div className="w-1 h-6 bg-primary rounded-full"></div>
                <h2 className="text-xl font-bold text-gray-900">Completion Logic</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Primary Rule */}
                <div className="border border-emerald-100 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-emerald-50 px-5 py-3 border-b border-emerald-100 flex items-center gap-2">
                        <ShieldCheck size={18} className="text-emerald-600" />
                        <h3 className="font-bold text-emerald-900">Primary Completion</h3>
                    </div>
                    <div className="p-6 bg-white flex flex-col items-center text-center space-y-4">
                        <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-100 w-full font-bold text-gray-700">
                            Points &gt;= {threshold}
                        </div>
                        <div className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-black rounded-md">AND</div>
                        <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-100 w-full font-bold text-gray-700">
                            Housing Document Uploaded
                        </div>
                    </div>
                </div>

                {/* Secondary Rule */}
                <div className="border border-primary/20 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-primary/5 px-5 py-3 border-b border-primary/10 flex items-center gap-2">
                        <ShieldCheck size={18} className="text-primary" />
                        <h3 className="font-bold text-gray-900">Secondary Completion</h3>
                    </div>
                    <div className="p-6 bg-white flex flex-col items-center text-center space-y-4">
                        <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-100 w-full font-bold text-gray-700">
                            Housing Document Uploaded
                        </div>
                        <div className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-black rounded-md">BUT</div>
                        <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-100 w-full font-bold text-gray-700 flex items-center justify-center gap-2">
                            Points &lt; {threshold}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-gray-50 rounded-xl p-5 border border-gray-100 flex items-start gap-3">
                <ArrowRight size={20} className="text-gray-400 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    The completion logic determines how students are marked as "Completed" in the system. The system automatically awards Primary Completion when points reach the configured threshold ({threshold}) and the housing document is verified. Secondary completion acts as a fallback for missing point milestones.
                </p>
            </div>
        </div>
    );
};

export default CompletionRules;
