import React, { useState } from 'react';
import ScheduleTable from './components/ScheduleTable';
import ScheduleForm from './components/ScheduleForm';
import { Day, Schedule } from './types';

const App: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [initialDay, setInitialDay] = useState<Day>('月');
  const [initialHour, setInitialHour] = useState(0);
  const [initialMinute, setInitialMinute] = useState(0);

  const addSchedule = (schedule: Schedule) => {
    setSchedules([...schedules, schedule]);
  };

  const updateSchedule = (updatedSchedule: Schedule) => {
    setSchedules(schedules.map(schedule =>
      schedule.id === updatedSchedule.id ? updatedSchedule : schedule
    ));
  };

  const deleteSchedule = (id: string) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
  };

  const openForm = (day: Day, hour: number, minute: number) => {
    setInitialDay(day);
    setInitialHour(hour);
    setInitialMinute(minute);
    setSelectedSchedule(null);
    setIsFormOpen(true);
  };

  const openEditForm = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setSelectedSchedule(null);
    setIsFormOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">MyShu - 週間スケジュールエディタ</h1>
      <ScheduleTable
        schedules={schedules}
        onScheduleClick={openForm}
        onScheduleEdit={openEditForm}
      />
      {isFormOpen && (
        <ScheduleForm
          schedule={selectedSchedule}
          initialDay={initialDay}
          initialHour={initialHour}
          initialMinute={initialMinute}
          onSave={selectedSchedule ? updateSchedule : addSchedule}
          onClose={closeForm}
          onDelete={deleteSchedule}
        />
      )}
    </div>
  );
};

export default App;
