import React from 'react';
import { Info, Star } from 'lucide-react';

const WorkshopRuleCard = () => {
    return (
        <div className="flex items-center gap-5 bg-[#FDFCF6] border border-primary/20 rounded-2xl px-6 py-5 shadow-sm">
            <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-primary shadow-lg shadow-primary/30 shrink-0">
                <span className="text-sm font-black text-black leading-none">+1</span>
                <span className="text-[10px] font-black text-black/60 uppercase tracking-tighter leading-none mt-0.5">Point</span>
            </div>
            <div>
                <h3 className="text-sm font-bold text-gray-900">Workshop Points Rule</h3>
                <p className="text-sm text-gray-600 font-medium mt-1 leading-relaxed">
                    Each workshop attended by a student gives{' '}
                    <strong className="text-primary font-bold">+1 Point</strong>{' '}
                    toward program completion.
                </p>
            </div>
        </div>
    );
};

export default WorkshopRuleCard;
