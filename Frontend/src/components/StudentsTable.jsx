import React from 'react';
import StudentRow from './StudentRow';
import { UserPlus } from 'lucide-react';

const StudentsTable = ({ students, onAddStudent, onDeleteStudent, onEditStudent }) => {
    if (!students || students.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 flex flex-col items-center justify-center text-center px-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                    <UserPlus size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No students found</h3>
                <p className="text-gray-500 max-w-xs mb-8">Try adjusting your search filters or add a new student.</p>
                <button onClick={onAddStudent} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-indigo-100 cursor-pointer active:scale-95">
                    <UserPlus size={18} />
                    Add First Student
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Points</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {students.map((student) => (
                            <StudentRow
                                key={student.id}
                                student={student}
                                onDelete={onDeleteStudent}
                                onEdit={onEditStudent}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden p-4 bg-gray-50/30">
                {students.map((student) => (
                    <StudentRow
                        key={student.id}
                        student={student}
                        onDelete={onDeleteStudent}
                        onEdit={onEditStudent}
                    />
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
                <p className="text-sm text-gray-500 hidden sm:block">
                    Showing <span className="font-semibold text-gray-900">1</span> to <span className="font-semibold text-gray-900">{students.length}</span> of <span className="font-semibold text-gray-900">{students.length}</span> results
                </p>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                    <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all cursor-pointer">Previous</button>
                    <div className="flex items-center gap-1">
                        <button className="w-10 h-10 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-md shadow-indigo-100 cursor-pointer">1</button>
                        <button className="w-10 h-10 hover:bg-gray-50 text-gray-600 rounded-lg text-sm font-bold transition-colors cursor-pointer">2</button>
                        <button className="w-10 h-10 hover:bg-gray-50 text-gray-600 rounded-lg text-sm font-bold transition-colors cursor-pointer">3</button>
                    </div>
                    <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all cursor-pointer">Next</button>
                </div>
            </div>
        </div>
    );
};

export default StudentsTable;
