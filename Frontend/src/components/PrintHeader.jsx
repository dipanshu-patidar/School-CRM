import React from 'react';
import logo from '../assets/login/logo.png';

const PrintHeader = ({ forceVisible = false }) => {
    return (
        <div
            className={`${forceVisible ? 'flex' : 'hidden print:flex'} items-center justify-between w-full border-b-4 border-gray-900 pb-8 mb-10`}
        >
            <div className="flex items-center gap-6">
                <img src={logo} alt="Company Logo" className="w-16 h-16 object-contain" />
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">SHINING LIGHT</h2>
                    <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] leading-none">Service Documentation System</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider italic">Official Document</p>
            </div>
        </div>
    );
};

export default PrintHeader;
