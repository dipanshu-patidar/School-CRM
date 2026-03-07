import React from 'react';
import { Info, Star } from 'lucide-react';

const WorkshopRuleCard = () => {
    return (
        <div className="flex items-start gap-4 bg-primary/5 border border-primary/10 rounded-xl px-5 py-4">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                <Star size={18} className="text-primary" />
            </div>
            <div>
                <h3 className="text-sm font-bold text-primary">Workshop Points Rule</h3>
                <p className="text-sm text-gray-600 font-medium mt-0.5">
                    Each workshop attended by a student gives{' '}
                    <span className="font-bold text-primary">+1 Point</span>{' '}
                    toward program completion.
                </p>
            </div>
        </div>
    );
};

export default WorkshopRuleCard;
