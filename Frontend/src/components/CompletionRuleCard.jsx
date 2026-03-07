import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

const CompletionRuleCard = () => {
    return (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 md:p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
                <ShieldCheck size={20} className="text-indigo-600" />
                <h3 className="text-lg font-bold text-indigo-900">Program Completion Rules</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-indigo-50">
                    <p className="text-sm font-bold text-gray-900 mb-1">Primary Completion</p>
                    <p className="text-sm text-gray-600">
                        Student reaches <strong className="text-indigo-600">250 points</strong><br />
                        <span className="font-semibold text-gray-400 text-xs">AND</span><br />
                        Housing document is uploaded
                    </p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-indigo-50">
                    <p className="text-sm font-bold text-gray-900 mb-1">Secondary Completion</p>
                    <p className="text-sm text-gray-600">
                        Housing document uploaded<br />
                        <span className="font-semibold text-amber-500 text-xs">BUT</span><br />
                        Points are less than <strong className="text-indigo-600">250</strong>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CompletionRuleCard;
