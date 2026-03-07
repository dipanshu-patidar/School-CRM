import React from 'react';

const ReportStatusBadge = ({ status }) => {
    const isCompleted = status === 'Completed';

    return (
        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border whitespace-nowrap uppercase tracking-wider ${isCompleted
            ? 'bg-primary-light text-[#5C4300] border-primary/20'
            : 'bg-white text-gray-500 border-gray-200'
            }`}>
            {status}
        </span>
    );
};

export default ReportStatusBadge;
