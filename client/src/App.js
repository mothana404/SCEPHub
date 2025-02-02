// src/App.js
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import HomePage from './pages/HomePage';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import NotFound from './pages/NotFound';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import EnrolledProjects from './pages/Student/Projects/EnrolledProjects';
import ViewProject from './components/Projects/ViewProject';
import AllCourses from './pages/Student/Courses/AllCourses';
import EnrolledCourses from './pages/Student/Courses/EnrolledCourses';
import CourseDetails from './pages/Student/Courses/CourseDetails';
import InstructorCourses from './pages/Instructor/Courses/Index';
import CreateCourse from './pages/Instructor/Courses/Create';
import InstructorProjects from './pages/Instructor/Projects/Index';
import EditCourse from './pages/Instructor/Courses/Edit';
import SubCourseDetails from './pages/Student/MyList/SubCourseDetails';
// admin
import Instructors from './pages/Admin/Instructors';
import Projects from './pages/Admin/Projects';
import Courses from './pages/Admin/Courses';
import Reports from './pages/Admin/Reports';
import Categories from './pages/Admin/Categories';
import Students from './pages/Admin/Students';
import Admins from './pages/Admin/Admins';
import Profile from './pages/Profile';
import Developers from './pages/Developers';
import MemberCVHome from './pages/MemberCVHome';
import HomeCourseDetails from './pages/HomeCourseDetails';
import HomeProjectDetails from './pages/HomeProjectDetails';
import ProjectManagement from './pages/Instructor/projectsManagment/ProjectsManagement';
import TasksWorkSpace from './pages/Instructor/projectsManagment/TasksWorkSpace';
import AvailableProjects from './components/Projects/AvailableProjects';
import ProjectInformation from './components/Projects/ProjectInformation';
import PrivateMessages from './pages/Messages';
import ProjectTasks from './pages/Student/Projects/ProjectTasks';
import UpdateStudentProfile from './components/Student/UpdateStudentProfile';
import UpdateInstructorProfile from './components/Instructor/UpdateInstructorProfile';
import UpdateAdminProfile from './components/Admin/UpdateAdminProfile';
import CreateProject from './components/Instructor/Projects/CreateProject';
import CreateTask from './pages/Instructor/projectsManagment/CreateTask';
import EditProject from './components/Instructor/Projects/EditProject';
import CvStudentsRequests from './pages/Instructor/projectsManagment/CvStudentsRequests';
import ViewSubscribedCourse from './pages/Student/MyList/ViewSubscripedCourse';
import ViewCourse from './pages/Student/MyList/ViewCourse';
import InstructorViewCourse from './pages/Instructor/Courses/InstructorViewCourse';
import ViewProjectStatistics from './components/Instructor/Projects/ViewProjectStatistics';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/Developers" element={<Developers />} />
        <Route path="/MemberCV/:id" element={<MemberCVHome />} />
        <Route path="/CourseDetails/:id" element={<HomeCourseDetails />} />
        <Route path="/ProjectDetails/:id" element={<HomeProjectDetails />} />
        {/* Private Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>

          }
        />
        <Route
          path="/enrolled-projects"
          element={
            <PrivateRoute>
              <EnrolledProjects />
            </PrivateRoute>

          }
        />
        <Route
          path="/enrolled-projects/:id"
          element={
            <PrivateRoute>
              <ViewProject />
            </PrivateRoute>
          }
        />

        {/* Courses Routes */}
        <Route
          path="/available-courses"
          element={
            <PrivateRoute>

              <AllCourses />
            </PrivateRoute>

          }
        />
        <Route
          path="/enrolled-courses"
          element={
            <PrivateRoute>

              <EnrolledCourses />
            </PrivateRoute>

          }
        />
        <Route
          path="/course/:courseId"
          element={
            <PrivateRoute>

              <CourseDetails />
            </PrivateRoute>

          }
        />
        <Route
          path="/course/view/:courseId"
          element={
            <PrivateRoute>

              <SubCourseDetails />
            </PrivateRoute>

          }
        />
        <Route
          path="/course/view-subscriped/:courseId"
          element={
            <PrivateRoute>
              <ViewSubscribedCourse />
            </PrivateRoute>

          }
        />
        {/* insryuctor routes */}
        <Route
          path="/instructor/projects"
          element={
            <PrivateRoute>

              <InstructorProjects />
            </PrivateRoute>

          }
        />
        <Route
          path="/instructor/courses"
          element={
            <PrivateRoute>

              <InstructorCourses />
            </PrivateRoute>

          }
        />
        <Route
          path="/instructor/create/course"
          element={
            <PrivateRoute>

              <CreateCourse />
            </PrivateRoute>

          }
        />
        <Route
          path="/Instructor/Courses/Edit/:courseId"
          element={
            <PrivateRoute>
              <EditCourse />
            </PrivateRoute>

          }
        />
        <Route
          path="/Instructor/Courses/View/:courseId"
          element={
            <PrivateRoute>
              <InstructorViewCourse />
            </PrivateRoute>

          }
        />
        <Route
          path="/Instructor/Project/statistics/View/:projectId"
          element={
            <PrivateRoute>
              <ViewProjectStatistics />
            </PrivateRoute>

          }
        />
        <Route
          path="/admin/instructors"
          element={
            <PrivateRoute>

              <Instructors />
            </PrivateRoute>

          }
        />
        <Route
          path="/admin/students"
          element={
            <PrivateRoute>

              <Students />
            </PrivateRoute>

          }
        />
        <Route
          path="/admin/admins"
          element={
            <PrivateRoute>

              <Admins />
            </PrivateRoute>

          }
        />
        <Route
          path="/admin/projects"
          element={
            <PrivateRoute>

              <Projects />
            </PrivateRoute>

          }
        />
        <Route
          path="/admin/courses"
          element={
            <PrivateRoute>

              <Courses />
            </PrivateRoute>

          }
        />
        <Route
          path="/admin/reports"
          element={
            <PrivateRoute>

              <Reports />
            </PrivateRoute>

          }
        />
        <Route
          path="/private/messages"
          element={
            <PrivateRoute>
              <PrivateMessages />
            </PrivateRoute>

          }
        />
        <Route
          path="/admin/categories"
          element={
            <PrivateRoute>

              <Categories />
            </PrivateRoute>

          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>

          }
        />
        <Route
          path="/instructor/ProjectManagement"
          element={
            <PrivateRoute>
              <ProjectManagement />
            </PrivateRoute>

          }
        />
        <Route
          path="/instructor/project/workSpace/:id"
          element={
            <PrivateRoute>

              <TasksWorkSpace />
            </PrivateRoute>

          }
        />
        <Route
          path="/student/available-projects"
          element={
            <PrivateRoute>

              <AvailableProjects />
            </PrivateRoute>

          }
        />
        <Route
          path="/theProjectDetails/:projectId"
          element={
            <PrivateRoute>
              <ProjectInformation />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/project/tasks/:id"
          element={
            <PrivateRoute>
              <ProjectTasks />
            </PrivateRoute>
          }
        />
        <Route
          path="/updateStudentProfile/:id"
          element={
            <PrivateRoute>
              <UpdateStudentProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/updateInstructorProfile/:id"
          element={
            <PrivateRoute>
              <UpdateInstructorProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/updateAdminProfile/:id"
          element={
            <PrivateRoute>
              <UpdateAdminProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/instructor/create/project"
          element={
            <PrivateRoute>
              <CreateProject />
            </PrivateRoute>
          }
        />
        <Route
          path="/instructor/edit/project/:projectId"
          element={
            <PrivateRoute>
              <EditProject />
            </PrivateRoute>
          }
        />
        <Route
          path="/instructor/project/requests/cv/:id/:projectID"
          element={
            <PrivateRoute>
              <CvStudentsRequests />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;