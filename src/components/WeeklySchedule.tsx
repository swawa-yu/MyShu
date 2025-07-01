import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const daysOfWeek = ['月', '火', '水', '木', '金', '土', '日'];
const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

const WeeklySchedule: React.FC = () => {
  const events = useSelector((state: RootState) => state.schedule.events);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">週次スケジュール</h2>
      <div className="grid grid-cols-8 gap-1">
        {/* Corner for time */} 
        <div className="col-span-1"></div>
        {/* Days of the week */} 
        {daysOfWeek.map(day => (
          <div key={day} className="col-span-1 text-center font-semibold border-b pb-2">
            {day}
          </div>
        ))}

        {/* Time slots and schedule cells */} 
        {timeSlots.map(time => (
          <React.Fragment key={time}>
            <div className="col-span-1 text-right pr-2 text-sm border-r pt-2">
              {time}
            </div>
            {daysOfWeek.map((day, dayIndex) => (
              <div key={`${day}-${time}`} className="col-span-1 border h-10 flex items-center justify-center text-xs relative">
                {events.filter(event => 
                  event.dayOfWeek === dayIndex && 
                  event.startTime <= time && 
                  event.endTime > time
                ).map(event => (
                  <div 
                    key={event.id} 
                    className="absolute inset-0 flex items-center justify-center text-white"
                    style={{ backgroundColor: event.color }}
                  >
                    {event.name}
                  </div>
                ))}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WeeklySchedule;
