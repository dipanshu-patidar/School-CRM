import React from 'react';

const ReportStatusBadge = ({ status }) => {
    const isCompleted = status === 'Completed';

    return (
        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border whitespace-nowrap uppercase tracking-wider ${isCompleted
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                : 'bg-amber-50 text-amber-700 border-amber-100'
            }`}>
            {status}
        </span>
    );
};

export default ReportStatusBadge;
