import React, { useState } from 'react';
import ProjectInformation from './ProjectInformation';
import LiveChat from '../LiveChat';
import CodeEditor from './CodeEditor';
import DashboardLayout from '../DashboadLayouts/DashbordLayout';
import Breadcrumb from '../Breadcrump';

function ViewProject() {
  const [activeTab, setActiveTab] = useState('tab-1');
  const [isChatOpen, setIsChatOpen] = useState(false);
  return (
    <DashboardLayout>
      {/* Breadcrumb */}

      <main className="p-4 h-full md:ml-64 bg-gray-100 dark:bg-gray-900">
        <div className="my-5" >
          <Breadcrumb pageTitle="View Project Information" />
        </div>
        {/* Chat Toggle Button */}
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 shadow-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Open Chat
        </button>

        {/* Tabs for Project Information and Code IDE */}
        <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700 mb-4">
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'tab-1'
              ? 'bg-blue-500 text-white dark:bg-blue-700'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            onClick={() => setActiveTab('tab-1')}
          >
            Project Information
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'tab-2'
              ? 'bg-blue-500 text-white dark:bg-blue-700'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            onClick={() => setActiveTab('tab-2')}
          >
            Code IDE
          </button>
        </div>

        {/* Tab Content */}
        <div className="container mx-auto">
          {activeTab === 'tab-1' && (
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
              <ProjectInformation />
            </div>
          )}
          {activeTab === 'tab-2' && <CodeEditor />}
        </div>

        {/* Off-Canvas LiveChat */}
        <LiveChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </main>
    </DashboardLayout>
  );
}

export default ViewProject;
