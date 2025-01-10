import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BiSend } from "react-icons/bi";
import { io } from "socket.io-client";
import DashboardLayout from "../components/DashboadLayouts/DashbordLayout";
import Cookies from "js-cookie";
import Sidebar from "../components/DashboadLayouts/Sidebar";
import Header from "../components/DashboadLayouts/Header";

const PrivateMessages = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [socket, setSocket] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const getTokenFromCookies = () => {
    return Cookies.get("access_token") || "";
  };

  useEffect(() => {
    // Function to fetch contacts based on search query
    const fetchContacts = async () => {
      try {
        const apiUrl = searchQuery
          ? `http://localhost:8000/messages/search?query=${searchQuery}` // New API endpoint for search
          : "http://localhost:8000/messages/chats"; // Default API for all contacts

        const response = await axios.get(apiUrl, {
          withCredentials: true,
        });
        setContacts(response.data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, [searchQuery]);

  useEffect(() => {
    // Fetch messages when a contact is selected
    const fetchMessages = async () => {
      if (!selectedContact) return;
      setLoadingMessages(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/messages/history?userID2=${selectedContact.user_id}`,
          {
            withCredentials: true,
          }
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching message history:", error);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedContact]);

  useEffect(() => {
    const token = getTokenFromCookies();
    if (!token) {
      console.error("No token found, cannot establish WebSocket connection.");
      return;
    }

    // Establish a socket connection when component mounts
    const newSocket = io("ws://localhost:8000", {
      extraHeaders: { token: token },
    });

    // Set the socket instance in the state
    setSocket(newSocket);

    // Clean up the socket connection on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, []); // Empty dependency array to run this effect once

  // Listen for incoming messages directly from the socket
  useEffect(() => {
    if (!socket) return;

    socket.on("receiveMessage", (message) => {
      console.log("Received message: ", message); // For debugging
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage"); // Clean up the listener on unmount
    };
  }, [socket]);

  const handleSendMessage = () => {
    if (messageInput.trim() && socket && selectedContact) {
      const newMessage = {
        receiver_id: selectedContact.user_id,
        message: messageInput,
      };
      socket.emit("sendMessage", newMessage); // Emit message to the server
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...newMessage, sender: "You", isSent: true },
      ]);
      setMessageInput(""); // Reset message input after sending
    }
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Handler to toggle the drawer
  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  // Handler to close the drawer (used when clicking outside the sidebar)
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      <div className={`fixed z-40 flex ${isDrawerOpen ? "md:hidden" : ""}`}>
        {isDrawerOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={closeDrawer}
            aria-hidden="true"
          ></div>
        )}
        <Sidebar isDrawerOpen={isDrawerOpen} closeDrawer={closeDrawer} />
      </div>

      <div className="flex-1 flex flex-col">
        <Header toggleDrawer={toggleDrawer} />

        {/* Page Content */}
        <main className="flex-1 font-sans py-2 px-0 lg:px-8 mt-16 bg-gray-100">
          <main className="md:ml-64">
            <div className="flex h-[calc(100vh-80px)] bg-white rounded-2xl shadow-lg my-0 overflow-hidden">
              {/* Sidebar */}
              <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-white">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Chats
                  </h2>
                  <div className="relative mt-4">
                    <input
                      type="text"
                      placeholder="Search contacts..."
                      className="w-full p-3 pl-10 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="overflow-y-auto h-full">
                  {contacts.map((contact) => (
                    <div
                      key={contact.user_id}
                      className={`flex items-center p-4 hover:bg-gray-100 cursor-pointer transition-all duration-200 ${
                        selectedContact?.user_id === contact.user_id
                          ? "bg-blue-50 border-l-4 border-blue-500"
                          : ""
                      }`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <div className="relative">
                        <img
                          src={contact.user_img}
                          alt={contact.user_name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {contact.user_name}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Chat Section */}
              <div className="flex-1 flex flex-col bg-white">
                {selectedContact ? (
                  <>
                    {/* Chat Header */}
                    <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center">
                      <img
                        src={selectedContact.user_img}
                        alt={selectedContact.user_name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <div className="ml-4 flex-1">
                        <h2 className="text-lg font-semibold text-gray-900">
                          {selectedContact.user_name}
                        </h2>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                      {loadingMessages ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="animate-pulse text-gray-500">Loading...</div>
                        </div>
                      ) : messages.length ? (
                        messages.map((message, index) => (
                          <div
                            key={index}
                            className={`flex ${
                              message.receiver_id === selectedContact.user_id
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-4 ${
                                message.receiver_id === selectedContact.user_id
                                  ? "bg-blue-600 text-white"
                                  : "bg-white text-gray-800 shadow-sm"
                              }`}
                            >
                              <p className="text-sm leading-relaxed">
                                {message.message}
                              </p>
                              <p
                                className={`text-xs mt-2 ${
                                  message.receiver_id === selectedContact.user_id
                                    ? "text-blue-100"
                                    : "text-gray-400"
                                }`}
                              >
                                {message.sent_at
                                  ? new Date(message.sent_at).toLocaleString(
                                      "en-US",
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                        month: "short",
                                        day: "numeric",
                                      }
                                    )
                                  : "Just now"}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-gray-500">No messages yet.</p>
                        </div>
                      )}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 bg-white border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        <textarea
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          placeholder="Type a message..."
                          className="flex-1 resize-none rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 min-h-[44px] max-h-32"
                          rows="1"
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <button
                          onClick={handleSendMessage}
                          className="p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                        >
                          <BiSend size={20} />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-gray-50">
                    <p className="text-gray-500 text-lg">
                      Select a chat to start messaging
                    </p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </main>
      </div>
    </>
  );
};

export default PrivateMessages;
