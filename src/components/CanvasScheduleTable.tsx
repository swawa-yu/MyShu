import React, { useRef, useEffect } from 'react';
import { Schedule, Day } from '../types';

interface CanvasScheduleTableProps {
    schedules: Schedule[];
    onScheduleClick: (day: Day, hour: number, minute: number) => void;
    onScheduleEdit: (schedule: Schedule) => void;
}

const CanvasScheduleTable: React.FC<CanvasScheduleTableProps> = ({ schedules, onScheduleClick, onScheduleEdit }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const days: Day[] = ['日', '月', '火', '水', '木', '金', '土'];

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (canvas && ctx) {
            canvas.width = canvas.parentElement?.clientWidth || 0;
            canvas.height = canvas.parentElement?.clientHeight || 0;
            drawGrid(ctx, canvas.width, canvas.height);
            drawSchedules(ctx, canvas.width, canvas.height);
        }
    }, [schedules]);

    const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.strokeStyle = '#e0e0e0';
        const cellHeight = height / 24;
        const cellWidth = width / 8;

        // Draw horizontal lines
        for (let i = 0; i <= 24; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * cellHeight);
            ctx.lineTo(width, i * cellHeight);
            ctx.stroke();
            ctx.closePath();
        }

        // Draw vertical lines
        for (let i = 0; i <= 8; i++) {
            ctx.beginPath();
            ctx.moveTo(i * cellWidth, 0);
            ctx.lineTo(i * cellWidth, height);
            ctx.stroke();
            ctx.closePath();
        }

        // Draw time labels
        ctx.fillStyle = '#000';
        for (let i = 0; i < 24; i++) {
            ctx.fillText(`${i}:00`, 5, i * cellHeight + 15);
        }

        // Draw day labels
        for (let i = 0; i < 7; i++) {
            ctx.fillText(days[i], (i + 1) * cellWidth + 5, 15);
        }
    };

    const drawSchedules = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        const cellHeight = height / 24;
        const cellWidth = width / 8;

        schedules.forEach(schedule => {
            const startMinutes = schedule.start.hour * 60 + schedule.start.minute;
            const endMinutes = schedule.end.hour * 60 + schedule.end.minute;
            const top = (startMinutes / (24 * 60)) * height;
            const scheduleHeight = ((endMinutes - startMinutes) / (24 * 60)) * height;

            ctx.fillStyle = schedule.color;
            ctx.fillRect((days.indexOf(schedule.start.day) + 1) * cellWidth, top, cellWidth, scheduleHeight);
            ctx.fillStyle = '#fff';
            ctx.fillText(schedule.title, (days.indexOf(schedule.start.day) + 1) * cellWidth + 5, top + 15);
        });
    };

    return (
        <div className="relative h-full">
            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    );
};

export default CanvasScheduleTable;