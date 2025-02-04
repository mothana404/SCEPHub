import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import DashboardLayout from "../DashboadLayouts/DashbordLayout";
import Swal from "sweetalert2";

const ProjectInformation = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [projectSkills, setProjectSkills] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/project/projectDetails/${projectId}`,
          { withCredentials: true }
        );
        const { projectDetails, participants } = response.data;

        setProject(projectDetails);
        setTeamMembers(participants);

        // Ensure required_skills is a string
        // let parsedSkills = projectDetails.required_skills;
        // let skills;

        // try {
        //   skills = JSON.parse(parsedSkills);
        //   if (typeof skills === "string") {
        //     skills = JSON.parse(skills);
        //   }
        // } catch (error) {
        //   skills = parsedSkills.split(",").map((skill) => skill.trim());
        // }
        console.log(projectDetails.required_skills);
        setProjectSkills(projectDetails.required_skills);
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const handleSendRequest = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/project/projectRequest/${projectId}`,
        {},
        { withCredentials: true }
      );
      Swal.fire({
        title: "Success!",
        text: response.data.message,
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Failed to send the request.");
    }
  };

  if (!project) {
    return (
      <p className="text-center text-gray-600 mt-8">
        Loading project details...
      </p>
    );
  }

  return (
    <DashboardLayout>
      <main className="p-4 md:ml-64 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto space-y-12">
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-indigo-500 to-blue-500 shadow-lg overflow-hidden">
            <img
              src={project.project_img}
              alt="Project"
              className="w-full h-64 object-cover opacity-40"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center animate-fadeIn">
              <h1 className="text-4xl font-bold text-white">
                {project.project_name}
              </h1>
              <p className="mt-2 text-lg text-white">
                {project.category.category_name}
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-wrap md:flex-nowrap space-y-6 md:space-y-0 md:space-x-4">
            {/* Timeline Section */}
            <section className="relative border-l-4 border-indigo-500 pl-8 space-y-8 flex-1 animate-slideInLeft">
              <div className="relative">
                <span className="absolute -left-6 w-8 h-8 bg-indigo-500 text-white text-center rounded-full flex items-center justify-center">
                  1
                </span>
                <h2 className="text-2xl font-bold text-gray-800 ml-10 dark:text-white mb-2">
                  Project Description
                </h2>
                <p
                  className="text-gray-600 dark:text-gray-400 ml-10 break-words max-w-[450px]"
                  dangerouslySetInnerHTML={{
                    __html: project.project_description.replace(/\n/g, "<br/>"),
                  }}
                />
              </div>

              <div className="relative">
                <span className="absolute -left-6 w-8 h-8 bg-indigo-500 text-white text-center rounded-full flex items-center justify-center">
                  2
                </span>
                <h2 className="text-2xl ml-8 font-bold text-gray-800 dark:text-white mb-2">
                  Required Skills
                </h2>
                <ul className="list-disc ml-8 list-inside text-gray-600 dark:text-gray-400">
                  {projectSkills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <span className="absolute -left-6 w-8 h-8 bg-indigo-500 text-white text-center rounded-full flex items-center justify-center">
                  3
                </span>
                <h2 className="text-2xl font-bold text-gray-800 ml-8 dark:text-white mb-2">
                  Timeline
                </h2>
                <p className="text-gray-600 ml-8 dark:text-gray-400">
                  Start Date:{" "}
                  {new Date(project.start_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-gray-600 ml-8 dark:text-gray-400 mt-2">
                  End Date:{" "}
                  {new Date(project.end_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </section>

            {/* Instructor Section */}
            <section className=" max-h-[250px] flex-1 bg-white dark:bg-gray-800 shadow-lg  p-6 animate-slideInRight">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Instructor Information
              </h2>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-gray-300 flex-shrink-0">
                  <img
                    src={project.instructor.user.user_img}
                    alt={project.instructor.user.user_img}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-300">
                    {project.instructor.user.user_name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {project.instructor.user.user_email}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Major: {project.instructor.major}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Team Members */}
          <div className="bg-gray-200 dark:bg-gray-800 p-6  shadow-lg animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Team Members
            </h2>
            <div className="flex space-x-6 overflow-x-auto">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="min-w-[200px] bg-white dark:bg-gray-700 p-4  shadow-lg hover:scale-105 transition transform"
                >
                  <img
                    src={member.user.user_img}
                    alt={member.user.user_img}
                    className="w-16 h-16 mx-auto rounded-full"
                  />
                  <h3 className="text-lg font-medium text-center mt-4 text-gray-800 dark:text-white">
                    {member.user.user_name || "Unknown"}
                  </h3>
                  <p className="text-center text-gray-600 dark:text-gray-400">
                    {member.major || "No Major"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Action Button */}
          <button
            onClick={handleSendRequest}
            className="fixed bottom-6 right-6 bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition transform hover:-translate-y-1"
          >
            Send Request
          </button>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default ProjectInformation;
