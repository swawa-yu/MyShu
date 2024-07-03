import React, { useRef, useEffect, useState } from 'react';
import { Schedule, Day } from '../types';

interface ScheduleTableProps {
    schedules: Schedule[];
    onScheduleClick: (day: Day, hour: number, minute: number) => void;
    onScheduleEdit: (schedule: Schedule) => void;
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ schedules, onScheduleClick, onScheduleEdit }) => {
    const days: Day[] = ['日', '月', '火', '水', '木', '金', '土'];
    const [headerHeight, setHeaderHeight] = useState(0);
    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (headerRef.current) {
            setHeaderHeight(headerRef.current.clientHeight);
        }
    }, []);

    return (
        <div className="relative">
            <div ref={headerRef} className="grid grid-cols-8">
                <div></div>
                {days.map(day => (
                    <div key={day} className="text-center font-bold">{day}</div>
                ))}
            </div>
            <div className="grid grid-cols-8">
                <div></div>
                {days.map(day => (
                    <div key={day} className="text-center font-bold"></div>
                ))}
                {[...Array(24)].map((_, hour) => (
                    <React.Fragment key={hour}>
                        <div className={`relative h-24 border-b ${hour === 0 ? 'border-t' : ''}`}>
                            <div className="absolute top-0 left-0">{hour}:00</div>
                        </div>
                        {days.map(day => (
                            <div
                                key={`${day}-${hour}`}
                                className={`relative h-24 border-b ${hour === 0 ? 'border-t' : ''} border-r ${day === days[0] ? 'border-l' : ''}`}
                                onClick={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const clickY = e.clientY - rect.top;
                                    const minute = Math.floor((clickY / rect.height) * 60);
                                    onScheduleClick(day, hour, minute);
                                }}
                            >
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>
            <div className="absolute inset-0 pointer-events-none">
                {schedules.map(schedule => {
                    const startMinutes = schedule.start.hour * 60 + schedule.start.minute;
                    const endMinutes = schedule.end.hour * 60 + schedule.end.minute;
                    // TODO: なぜ +15するとよいのかは謎
                    const topPosition = `calc(${`${(startMinutes / (24 * 60 + 15)) * 100}%`} + ${headerHeight}px)`;
                    const bottomPosition = `calc(${`${(endMinutes / (24 * 60 + 15)) * 100}%`} + ${headerHeight}px)`;
                    const height = `calc(${bottomPosition} - ${topPosition}) - 1px`;
                    console.log(topPosition, bottomPosition, height);

                    return (
                        <div
                            key={schedule.id}
                            className="absolute text-white p-1 cursor-pointer hover:opacity-80 pointer-events-auto rounded"
                            style={{
                                top: topPosition,
                                height: `calc(${height} - 6px)`,
                                left: `${(days.indexOf(schedule.start.day) + 1) / (days.length + 1) * 100}%`,
                                right: `calc(${(days.length - days.indexOf(schedule.start.day) - 1) / (days.length + 1) * 100}% + 1px)`,
                                margin: `3px`,
                                backgroundColor: schedule.color,
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onScheduleEdit(schedule);
                            }}
                        >
                            {schedule.title}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ScheduleTable;
