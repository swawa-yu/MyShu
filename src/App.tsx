import WeeklySchedule from "./components/WeeklySchedule";
import ScheduleForm from "./components/ScheduleForm";
import { Button } from "./components/ui/button";

function App() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end mb-4">
        <ScheduleForm>
          <Button>スケジュールを追加</Button>
        </ScheduleForm>
      </div>
      <WeeklySchedule />
    </div>
  );
}

export default App;
