import React, { useState, useEffect } from 'react';
import { Schedule, Day } from '../types';
import ColorPalette from './ColorPalette';

interface ScheduleFormProps {
    schedule: Schedule | null;
    initialDay: Day;
    initialHour: number;
    initialMinute: number;
    onSave: (schedule: Schedule) => void;
    onClose: () => void;
    onDelete: (id: string) => void;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ schedule, initialDay, initialHour, initialMinute, onSave, onClose, onDelete }) => {
    const [title, setTitle] = useState(schedule?.title || '');
    const [startDay, setStartDay] = useState<Day>(schedule?.start.day || initialDay);
    const [startHour, setStartHour] = useState<number>(schedule?.start.hour || initialHour);
    const [startMinute, setStartMinute] = useState<number>(schedule?.start.minute || initialMinute);
    const [endDay, setEndDay] = useState<Day>(schedule?.end.day || initialDay);
    const [endHour, setEndHour] = useState<number>(schedule?.end.hour || initialHour + 1);
    const [endMinute, setEndMinute] = useState<number>(schedule?.end.minute || initialMinute);
    const [color, setColor] = useState(schedule?.color || '#4299e1'); // デフォルトの青色

    useEffect(() => {
        if (!schedule) {
            setStartDay(initialDay);
            setStartHour(initialHour);
            setStartMinute(initialMinute);
            setEndDay(initialDay);
            setEndHour(initialHour + 1);
            setEndMinute(initialMinute);
        }
    }, [schedule, initialDay, initialHour, initialMinute]);

    const handleSubmit = () => {
        const newSchedule: Schedule = {
            id: schedule ? schedule.id : Date.now().toString(),
            title,
            start: { day: startDay, hour: startHour, minute: startMinute },
            end: { day: endDay, hour: endHour, minute: endMinute },
            color,
        };
        onSave(newSchedule);
        onClose();
    };

    const handleDelete = () => {
        onDelete(schedule?.id || '');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded">
                <h2 className="text-lg font-bold mb-2">{schedule ? 'スケジュールを編集' : 'スケジュールを追加'}</h2>
                <div className="mb-2">
                    <label className="block">タイトル</label>
                    <input
                        type="text"
                        className="form-input mt-1 block w-full"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </div>
                <div className="mb-2">
                    <label className="block">開始時刻</label>
                    <select
                        className="form-select mt-1 mr-2"
                        value={startDay}
                        onChange={e => setStartDay(e.target.value as Day)}
                    >
                        {['日', '月', '火', '水', '木', '金', '土'].map(day => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        className="form-input mt-1 mr-2"
                        value={startHour}
                        onChange={e => setStartHour(Number(e.target.value))}
                    />:
                    <input
                        type="number"
                        className="form-input mt-1"
                        value={startMinute}
                        onChange={e => setStartMinute(Number(e.target.value))}
                    />
                </div>
                <div className="mb-2">
                    <label className="block">終了時刻</label>
                    <select
                        className="form-select mt-1 mr-2"
                        value={endDay}
                        onChange={e => setEndDay(e.target.value as Day)}
                    >
                        {['日', '月', '火', '水', '木', '金', '土'].map(day => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        className="form-input mt-1 mr-2"
                        value={endHour}
                        onChange={e => setEndHour(Number(e.target.value))}
                    />:
                    <input
                        type="number"
                        className="form-input mt-1"
                        value={endMinute}
                        onChange={e => setEndMinute(Number(e.target.value))}
                    />
                </div>
                <div className="mb-2">
                    <label className="block">色</label>
                    <ColorPalette selectedColor={color} onSelectColor={setColor} />
                </div>
                <div className="flex justify-end">
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                        onClick={handleDelete}
                    >
                        削除
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                        onClick={onClose}
                    >
                        キャンセル
                    </button>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={handleSubmit}
                    >
                        保存
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleForm;
