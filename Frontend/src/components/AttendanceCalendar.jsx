import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const AttendanceCalendar = ({ records, onDateClick, onEventClick }) => {
    // Convert records to FullCalendar events
    const events = records.map(record => ({
        id: record.id.toString(),
        title: `${record.studentName} — ${record.workshop}`,
        date: record.date,
        extendedProps: {
            ...record
        }
    }));

    const renderEventContent = (eventInfo) => {
        return (
            <div className="flex flex-col p-1 w-full overflow-hidden text-xs truncate">
                <span className="font-semibold">{eventInfo.event.title}</span>
                <span className="font-bold opacity-90 mt-0.5">+1 Point</span>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 h-[700px] overflow-hidden calendar-container">
            {/* Custom styles to match the CRM theme */}
            <style>{`
        .calendar-container .fc {
          --fc-border-color: #f3f4f6;
          --fc-button-text-color: #374151;
          --fc-button-bg-color: #ffffff;
          --fc-button-border-color: #e5e7eb;
          --fc-button-hover-bg-color: #f9fafb;
          --fc-button-hover-border-color: #e5e7eb;
          --fc-button-active-bg-color: #f3f4f6;
          --fc-button-active-border-color: #e5e7eb;
          --fc-event-bg-color: #4F46E5;
          --fc-event-border-color: #4F46E5;
          --fc-event-text-color: #ffffff;
          --fc-event-selected-overlay-color: rgba(0, 0, 0, 0.25);
          --fc-page-bg-color: #ffffff;
          --fc-neutral-bg-color: rgba(208, 215, 222, 0.2);
          --fc-neutral-text-color: #6B7280;
          --fc-today-bg-color: rgba(79, 70, 229, 0.05);
          height: 100%;
          font-family: inherit;
        }
        
        .fc .fc-toolbar-title {
          font-size: 1.25rem !important;
          font-weight: 700 !important;
          color: #111827;
        }

        .fc .fc-button-primary {
          border-radius: 0.5rem !important;
          font-weight: 600 !important;
          text-transform: capitalize !important;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          transition: all 0.2s;
        }
        
        .fc .fc-button-primary:focus {
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2) !important;
        }

        .fc .fc-button-active {
          background-color: #4F46E5 !important;
          border-color: #4F46E5 !important;
          color: white !important;
        }

        .fc-theme-standard th {
          border: none !important;
          padding: 12px 0 !important;
          font-weight: 700 !important;
          color: #6B7280 !important;
          font-size: 0.75rem !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em;
        }

        .fc-theme-standard td, .fc-theme-standard th {
          border-color: #f3f4f6;
        }

        .fc-daygrid-event {
          border-radius: 6px !important;
          padding: 2px 4px !important;
          margin-top: 2px !important;
          box-shadow: 0 1px 2px rgba(79, 70, 229, 0.1);
          border: none !important;
          transition: transform 0.1s;
          cursor: pointer !important;
        }

        .fc-daygrid-event:hover {
          transform: scale(1.02);
          z-index: 5;
        }

        .fc-daygrid-day-number {
          font-size: 0.875rem !important;
          font-weight: 500 !important;
          color: #4b5563 !important;
          padding: 8px !important;
        }
        
        .fc-day-today .fc-daygrid-day-number {
          color: #4F46E5 !important;
          font-weight: 700 !important;
        }
      `}</style>

            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek'
                }}
                events={events}
                dateClick={(info) => onDateClick(info.dateStr)}
                eventClick={(info) => onEventClick(info.event.extendedProps)}
                eventContent={renderEventContent}
                height="100%"
                dayMaxEvents={3}
            />
        </div>
    );
};

export default AttendanceCalendar;
