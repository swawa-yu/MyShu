import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch } from 'react-redux';
import { addEvent } from '../store/scheduleSlice';
import { v4 as uuidv4 } from 'uuid';

import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';

const formSchema = z.object({
  name: z.string().min(2, { message: "イベント名は2文字以上で入力してください。" }),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "開始時刻はHH:MM形式で入力してください。" }),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "終了時刻はHH:MM形式で入力してください。" }),
  dayOfWeek: z.string().regex(/^[0-6]$/, { message: "曜日を選択してください。" }),
  color: z.string().min(1, { message: "色を選択してください。" }),
  details: z.string().optional(),
});

interface ScheduleFormProps {
  children: React.ReactNode;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ children }) => {
  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      startTime: "",
      endTime: "",
      dayOfWeek: "0",
      color: "#007bff",
      details: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newEvent = {
      id: uuidv4(),
      name: values.name,
      startTime: values.startTime,
      endTime: values.endTime,
      dayOfWeek: parseInt(values.dayOfWeek),
      color: values.color,
      details: values.details,
    };
    dispatch(addEvent(newEvent));
    form.reset();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>スケジュールを追加</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <Button type="submit">追加</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleForm;
