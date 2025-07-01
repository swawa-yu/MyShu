import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { updateEvent, removeEvent } from '../store/scheduleSlice';

interface ScheduleEvent {
  id: string;
  name: string;
  startTime: string; // e.g., "09:00"
  endTime: string;   // e.g., "10:00"
  dayOfWeek: number; // 0 for Monday, 6 for Sunday
  color: string;
  details?: string;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "イベント名は2文字以上で入力してください。" }),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "開始時刻はHH:MM形式で入力してください。" }),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "終了時刻はHH:MM形式で入力してください。" }),
  dayOfWeek: z.string().regex(/^[0-6]$/, { message: "曜日を選択してください。" }),
  color: z.string().min(1, { message: "色を選択してください。" }),
  details: z.string().optional(),
});

const daysOfWeek = ['月', '火', '水', '木', '金', '土', '日'];
const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

const WeeklySchedule: React.FC = () => {
  const events = useSelector((state: RootState) => state.schedule.events);
  const dispatch = useDispatch();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleEventClick = (event: ScheduleEvent) => {
    setSelectedEvent(event);
    form.reset(event);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (values: z.infer<typeof formSchema>) => {
    if (selectedEvent) {
      const updatedEvent = {
        ...selectedEvent,
        name: values.name,
        startTime: values.startTime,
        endTime: values.endTime,
        dayOfWeek: parseInt(values.dayOfWeek),
        color: values.color,
        details: values.details,
      };
      dispatch(updateEvent(updatedEvent));
      setIsEditDialogOpen(false);
    }
  };

  const handleDelete = () => {
    if (selectedEvent) {
      dispatch(removeEvent(selectedEvent.id));
      setIsEditDialogOpen(false);
    }
  };

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
                    className="absolute inset-0 flex items-center justify-center text-white cursor-pointer"
                    style={{ backgroundColor: event.color }}
                    onClick={() => handleEventClick(event)}
                  >
                    {event.name}
                  </div>
                ))}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      {selectedEvent && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>スケジュールを編集</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleEditSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>イベント名</FormLabel>
                      <FormControl>
                        <Input placeholder="ミーティング" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>開始時刻</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>終了時刻</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dayOfWeek"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>曜日</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="6" placeholder="0-6 (0:月, 6:日)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>色</FormLabel>
                      <FormControl>
                        <Input type="color" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>詳細 (任意)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between">
                  <Button type="submit">更新</Button>
                  <Button type="button" variant="destructive" onClick={handleDelete}>削除</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default WeeklySchedule;
