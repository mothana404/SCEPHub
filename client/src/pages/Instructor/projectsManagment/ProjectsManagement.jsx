import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../../components/DashboadLayouts/DashbordLayout";
import { Link } from "react-router-dom";
import Breadcrumb from "../../../components/Breadcrump";

function ProjectManagement() {
  const [projects, setProjects] = useState([]);
  const [studentRequests, setStudentRequests] = useState({});
  const [flippedProjects, setFlippedProjects] = useState({});

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Fetch projects
        window.scrollTo(0, 0);
        const projectResponse = await axios.get(
          "http://localhost:8000/project/instructorWorkSpace",
          { withCredentials: true }
        );
        const fetchedProjects = projectResponse.data;
        setProjects(fetchedProjects);

        // Fetch requests for all projects
        const requestsPromises = fetchedProjects.map(async (project) => {
          const response = await axios.get(
            `http://localhost:8000/project/instructor/studentRequests/${project.id}`,
            { withCredentials: true }
          );
          return {
            projectId: project.id,
            requests: Array.isArray(response.data) ? response.data : [],
          };
        });

        const allRequests = await Promise.all(requestsPromises);
        const requestsMap = allRequests.reduce(
          (acc, { projectId, requests }) => {
            acc[projectId] = requests;
            return acc;
          },
          {}
        );

        setStudentRequests(requestsMap);
      } catch (error) {
        console.error("Error fetching projects or requests:", error.message);
      }
    };
    fetchProjects();
  }, []);
  const handleFlip = (projectId) => {
    setFlippedProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  return (
    <DashboardLayout>
      <main className="md:ml-64 h-full bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <div className="mt-5">
          <Breadcrumb pageTitle="Projects WorkSpace" />
        </div>

        <div className="px-4 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const isFlipped = !!flippedProjects[project.id];
            const requests = studentRequests[project.id] || [];
            const validRequests = requests.filter((req) => req && req.user);

            return (
              <div
                key={project.id}
                className="relative"
                style={{ perspective: "1000px" }}
              >
                <div
                  className="relative w-full transition-transform duration-700"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/** FRONT SIDE */}
                  <div
                    className="border bg-white px-4 shadow-md"
                    style={{
                      backfaceVisibility: "hidden",
                      position: "relative",
                      width: "100%",
                      minHeight: "300px",
                    }}
                  >
                    {/** Card Header */}
                    <div className="mb-2 flex flex-col gap-y-6 border-b py-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center">
                        <img
                          className="h-14 w-14 object-cover"
                          src={
                            project.image || "https://via.placeholder.com/56"
                          }
                          alt={project.name}
                        />
                        <div className="ml-4 w-56">
                          <p className="text-slate-800 text-lg font-bold break-words">
                            {project.name.length > 25
                              ? `${project.name.substring(0, 25)}...`
                              : project.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/** Stats */}
                    <div className="mb-2 flex justify-between border-b py-8 text-sm sm:text-base">
                      <div className="flex flex-col items-center">
                        <p className="text-slate-700 mb-1 text-xl font-semibold">
                          {project.completedTasks}
                        </p>
                        <p className="text-slate-500 text-sm font-medium">
                          Completed Tasks
                        </p>
                      </div>
                      <div className="flex flex-col items-center">
                        <p className="text-slate-700 mb-1 text-xl font-semibold">
                          {project.totalTasks}
                        </p>
                        <p className="text-slate-500 text-sm font-medium">
                          Total Tasks
                        </p>
                      </div>
                      <div className="flex flex-col items-center">
                        <p className="text-slate-700 mb-1 text-xl font-semibold">
                          {project.participantsCount}
                        </p>
                        <p className="text-slate-500 text-sm font-medium">
                          Students
                        </p>
                      </div>
                    </div>

                    {/** Buttons Row */}
                    <div className="flex justify-between py-5">
                      <button
                        onClick={() => handleFlip(project.id)}
                        className="relative text-slate-500 hover:bg-slate-100 border-2 px-4 py-2 font-medium focus:outline-none focus:ring text-sm"
                      >
                        Requests
                        <span
                          className={`absolute -top-2 -right-2 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white ${
                            validRequests.length > 0
                              ? "bg-green-600"
                              : "bg-red-600"
                          }`}
                        >
                          {validRequests.length}
                        </span>
                      </button>
                      <Link
                        className="border-2 border-transparent bg-blue-600 px-4 py-2 font-medium text-white focus:outline-none focus:ring text-sm hover:text-white"
                        to={`/instructor/project/workSpace/${project.id}`}
                      >
                        Work Space
                      </Link>
                    </div>
                  </div>

                  {/** BACK SIDE (Requests) */}
                  <div
                    className="border bg-white px-4 shadow-md absolute top-0 left-0 w-full"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      minHeight: "300px",
                    }}
                  >
                    <h2 className="text-lg font-semibold mb-4 mt-4">
                      Student Requests
                    </h2>
                    <div className="overflow-y-auto max-h-64 space-y-3 pr-2">
                      {validRequests.length > 0 ? (
                        validRequests.map((req) => (
                          <div
                            key={req.user_id}
                            className="flex items-center border p-2"
                          >
                            <img
                              src={
                                req.user?.user_img ||
                                "https://via.placeholder.com/60"
                              }
                              alt={req.user?.user_name}
                              className="h-16 w-16 object-cover bg-gray-200 mr-4"
                            />
                            <div className="flex-1">
                              <p className="text-slate-700 font-semibold">
                                {req.user?.user_name || "Unknown"}
                              </p>
                              <p className="text-slate-500 text-sm">
                                {req.major || "No Major"}
                              </p>
                            </div>
                            <Link
                              to={`/instructor/project/requests/cv/${req.user_id}/${project.id}`}
                              className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1 ml-2 text-sm font-medium"
                            >
                              View CV
                            </Link>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-500">No requests found.</p>
                      )}
                    </div>

                    {/** Footer Button to flip back */}
                    <div className="mt-4 mb-4 text-right">
                      <button
                        onClick={() => handleFlip(project.id)}
                        className="border-2 border-transparent bg-blue-600 px-4 py-2 font-medium text-white focus:outline-none focus:ring hover:bg-blue-700 text-sm"
                      >
                        Back to Project
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </DashboardLayout>
  );
}

export default ProjectManagement;
