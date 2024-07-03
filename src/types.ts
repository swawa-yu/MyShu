export type Day = '日' | '月' | '火' | '水' | '木' | '金' | '土';

export interface Time {
    day: Day;
    hour: number;
    minute: number;
}

export interface Schedule {
    id: string;
    title: string;
    start: Time;
    end: Time;
    color: string;
}
