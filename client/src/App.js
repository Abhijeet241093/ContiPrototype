import React from "react";
import { BrowserRouter,HashRouter, Routes, Route } from "react-router-dom";
import Loader from "./components/loader/Loader";
import ActivityPage from "./components/pages/Activity.page";
import CreateTask from "./components/pages/CreateTask.page";
import DashboardPage from "./components/pages/Dashboard.page";
import LoginPage from "./components/pages/Login.page";
import NoPage from "./components/pages/No.page";
import ProjectPage from "./components/pages/Project.page";
import RequestProjectPage from "./components/pages/RequestProject.page";
import SafetyReport from "./components/pages/SafetyReport.page";
import SafetyReportDetailPage from "./components/pages/SafetyReportDetail.page";
import SignupPage from "./components/pages/Signup.page";
import TaskInfoPage from "./components/pages/TaskInfo.page";
import TaskManagementPage from "./components/pages/TaskManagement.page";
import TaskPicturePage from "./components/pages/TaskPicture.page";
import TasksPage from "./components/pages/Tasks.page";
import UploadPicturePage from "./components/pages/UploadPicture.page";
import AdminRoute from "./routes/Admin.routes";
import AuthRoute from "./routes/Auth.routes";
import BlockchainRoutes from "./routes/Blockchain.routes";
import LoginRoute from "./routes/Login.routes";
import ProjectRoute from "./routes/Project.routes";
import { appStore } from "./store/App.store";

const App = () => {
  const { isLoading } = appStore()

  return (

    <BrowserRouter>
      {isLoading && <Loader />}
      <Routes>

        <Route element={<LoginRoute />} >
          <Route path="/" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignupPage />} />
        </Route>

        <Route element={<AuthRoute />} >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route element={<ProjectRoute />} >
            <Route path="/project" element={<ProjectPage />} />
            <Route element={<BlockchainRoutes />} >
            <Route path="/create-task" element={<CreateTask />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/task-info" element={<TaskInfoPage />} />
            <Route path="/task-picture" element={<TaskPicturePage />} />
            <Route path="/task-management" element={<TaskManagementPage />} />
            </Route>
 
            <Route path="/upload-picture" element={<UploadPicturePage />} />
   
            <Route path="/safety-report" exact element={<SafetyReport />} />
            <Route path="/safety-report-detail" element={<SafetyReportDetailPage />} />
            <Route element={<AdminRoute />} >
              <Route path="/activity" element={<ActivityPage />} />
              <Route path="/request" element={<RequestProjectPage />} />
            </Route>
          </Route>

        </Route>
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;