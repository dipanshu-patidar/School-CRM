import React from 'react';
import { Calendar, Table } from 'lucide-react';

const AttendanceToggle = ({ view, setView }) => {
    return (
        <div className="inline-flex items-center bg-gray-100 rounded-lg p-1 gap-1">
            <button
                onClick={() => setView('calendar')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${view === 'calendar'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
            >
                <Calendar size={16} />
                Calendar View
            </button>
            <button
                onClick={() => setView('table')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${view === 'table'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
            >
                <Table size={16} />
                Table View
            </button>
        </div>
    );
};

export default AttendanceToggle;
