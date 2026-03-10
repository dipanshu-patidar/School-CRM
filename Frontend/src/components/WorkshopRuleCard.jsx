import React from 'react';
import { Info, Star } from 'lucide-react';

const WorkshopRuleCard = () => {
    return (
        <div className="flex items-center gap-5 bg-[#FDFCF6] border border-primary/20 rounded-2xl px-6 py-5 shadow-sm">
            <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm shrink-0">
                <Star size={20} className="text-amber-500 mb-1" />
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-tighter leading-none">Points</span>
            </div>
            <div>
                <h3 className="text-sm font-bold text-gray-900">Workshop Points Rule</h3>
                <p className="text-sm text-gray-600 font-medium mt-1 leading-relaxed">
                    Each workshop has a <strong className="text-primary font-bold">Custom Points Reward</strong> assigned by admins, which is granted to students upon attendance.
                </p>
            </div>
        </div>
    );
};

export default WorkshopRuleCard;
