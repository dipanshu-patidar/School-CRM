import React, { useState, useEffect } from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { getSettings } from '../api/settingApi';

const CompletionRuleCard = () => {
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
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-8 mb-6 flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-5 md:p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
                <ShieldCheck size={20} className="text-primary" />
                <h3 className="text-lg font-bold text-gray-900">Program Completion Rules</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-primary">
                    <p className="text-sm font-bold text-gray-900 mb-1">Primary Completion</p>
                    <p className="text-sm text-gray-600">
                        Student reaches <strong className="text-primary">{threshold} points</strong><br />
                        <span className="font-semibold text-gray-400 text-xs">AND</span><br />
                        Housing document is uploaded
                    </p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-primary">
                    <p className="text-sm font-bold text-gray-900 mb-1">Secondary Completion</p>
                    <p className="text-sm text-gray-600">
                        Housing document uploaded<br />
                        <span className="font-semibold text-amber-500 text-xs">BUT</span><br />
                        Points are less than <strong className="text-primary">{threshold}</strong>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CompletionRuleCard;
