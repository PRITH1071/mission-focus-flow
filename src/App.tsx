import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Missions from "./pages/Missions";
import FocusMode from "./pages/FocusMode";
import HomeworkTimer from "./pages/HomeworkTimer";
import Leaderboard from "./pages/Leaderboard";
import SubmitHomework from "./pages/SubmitHomework";
import PracticeQuiz from "./pages/PracticeQuiz";
import Progress from "./pages/Progress";
import AICoach from "./pages/AICoach";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/missions" element={<Missions />} />
          <Route path="/focus" element={<FocusMode />} />
          <Route path="/homework" element={<HomeworkTimer />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/submit" element={<SubmitHomework />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/coach" element={<AICoach />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
