import React from 'react';
import { Info, Star } from 'lucide-react';

const WorkshopRuleCard = () => {
    return (
        <div className="flex items-start gap-4 bg-indigo-50 border border-indigo-100 rounded-xl px-5 py-4">
            <div className="p-2 bg-indigo-100 rounded-lg shrink-0">
                <Star size={18} className="text-indigo-600" />
            </div>
            <div>
                <h3 className="text-sm font-bold text-indigo-800">Workshop Points Rule</h3>
                <p className="text-sm text-indigo-600 mt-0.5">
                    Each workshop attended by a student gives{' '}
                    <span className="font-bold text-indigo-800">+1 Point</span>{' '}
                    toward program completion.
                </p>
            </div>
        </div>
    );
};

export default WorkshopRuleCard;
