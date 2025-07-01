import React, { useEffect, useRef } from "react";
import WeeklySchedule from "./components/WeeklySchedule";
import ScheduleForm from "./components/ScheduleForm";
import { Button } from "./components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { addEvent } from "./store/scheduleSlice";
import html2canvas from "html2canvas";

function App() {
  const dispatch = useDispatch();
  const events = useSelector((state: RootState) => state.schedule.events);
  const scheduleRef = useRef<HTMLDivElement>(null);

  // Load schedule from URL on initial render
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const scheduleParam = params.get("schedule");
    if (scheduleParam) {
      try {
        const decodedSchedule = JSON.parse(decodeURIComponent(scheduleParam));
        decodedSchedule.forEach((event: any) => {
          dispatch(addEvent(event));
        });
      } catch (error) {
        console.error("Failed to parse schedule from URL:", error);
      }
    }
  }, [dispatch]);

  // Generate shareable URL
  const generateShareableUrl = () => {
    const serializedEvents = encodeURIComponent(JSON.stringify(events));
    const shareableUrl = `${window.location.origin}${window.location.pathname}?schedule=${serializedEvents}`;
    navigator.clipboard.writeText(shareableUrl);
    alert("共有URLをクリップボードにコピーしました！");
  };

  // Export schedule as image
  const exportScheduleAsImage = () => {
    if (scheduleRef.current) {
      html2canvas(scheduleRef.current).then(canvas => {
        const link = document.createElement('a');
        link.download = 'schedule.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end mb-4 space-x-2">
        <Button onClick={generateShareableUrl}>共有URLを生成</Button>
        <Button onClick={exportScheduleAsImage}>画像としてエクスポート</Button>
        <ScheduleForm>
          <Button>スケジュールを追加</Button>
        </ScheduleForm>
      </div>
      <div ref={scheduleRef}>
        <WeeklySchedule />
      </div>
    </div>
  );
}

export default App;
