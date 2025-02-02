import React, { useState, useEffect, useRef } from "react";
import { Transition } from "@headlessui/react";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import axios from "axios";
import { motion } from "framer-motion";

function LiveChat({ isOpen, onClose, groupId, userID }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [project, setProject] = useState("");
  const [student, setStudent] = useState({});
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getTokenFromCookies = () => {
    return Cookies.get("access_token") || "";
  };
  const token = getTokenFromCookies();
  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/project/projectDetails/${groupId}`,
        { withCredentials: true }
      );
      console.log(response.data.projectDetails);
      setProject(response.data.projectDetails);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchStudent = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/user/info`, {
        withCredentials: true,
      });
      setStudent(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const newSocket = io("ws://localhost:8000", {
        extraHeaders: { token: token },
      });
      setSocket(newSocket);
      newSocket.emit("fetchGroupMessages", { group_id: groupId });
      newSocket.on("groupMessageHistory", (messageHistory) => {
        // console.log("Message history:", messageHistory);
        setMessages(messageHistory);
        // scrollToBottom();
      });

      newSocket.on("receiveGroupMessage", (message) => {
        // console.log("Received message:", message);
        setMessages((prevMessages) => {
          // Check if we already have this message (either temp or server version)
          const isDuplicate = prevMessages.some(
            (msg) =>
              msg.message === message.message &&
              msg.sender_id === message.sender_id &&
              Math.abs(new Date(msg.createdAt) - new Date(message.createdAt)) <
                1000
          );

          if (!isDuplicate) {
            return [...prevMessages, message];
          }
          return prevMessages;
        });
      });

      fetchProjects();
      fetchStudent();
      return () => {
        newSocket.disconnect();
      };
    }
  }, [isOpen, groupId, token, userID]);

  const handleSendMessage = () => {
    if (newMessage.trim() && socket) {
      const messageData = {
        group_id: groupId,
        name: student.user_name,
        message: newMessage,
        time: new Date().toLocaleTimeString(),
        token: token,
        sender_id: student.user_id,
      };
      socket.emit("sendGroupMessage", messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setNewMessage("");
      scrollToBottom();
    }
  };

  return (
    <Transition show={isOpen}>
      <div className="fixed inset-0 z-50 flex justify-end font-sans">
        <Transition.Child
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-50"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-50"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          ></div>
        </Transition.Child>

        <Transition.Child
          enter="transition-transform duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transition-transform duration-300"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="relative w-full max-w-md bg-gradient-to-b from-zinc-800 to-zinc-900 text-white flex flex-col shadow-2xl"
          >
            {/* Chat Header */}
            <div className="flex items-center px-6 py-4 bg-zinc-800/50 backdrop-blur-sm border-b border-zinc-700/50">
              <div className="relative">
                <img
                  src={project.project_img}
                  alt="avatar"
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-500/50"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-zinc-800"></div>
              </div>
              <div className="flex-1 ml-4">
                <h6 className="font-semibold text-lg">
                  {project.project_name}
                </h6>
                <p className="text-sm text-emerald-400">Online</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-full hover:bg-zinc-700/50 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
              {messages.map((msg, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  key={index}
                  className={`mb-6 max-w-[80%] ${
                    msg.sender_id === userID || msg.sender?.user_id === userID
                      ? "ml-auto"
                      : ""
                  }`}
                >
                  <div
                    className={`flex items-end gap-2 ${
                      msg.sender_id === userID || msg.sender?.user_id === userID
                        ? "flex-row-reverse"
                        : ""
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                        {(
                          msg.sender?.user_name?.[0] || student.user_name?.[0]
                        )?.toUpperCase()}
                      </div>
                    </div>
                    <div
                      className={`flex flex-col ${
                        msg.sender_id === userID ||
                        msg.sender?.user_id === userID
                          ? "items-end"
                          : ""
                      }`}
                    >
                      <span className="text-sm text-zinc-400 mb-1">
                        {msg.sender?.user_name || student.user_name}
                      </span>
                      <div
                        className={`p-3 rounded-2xl ${
                          msg.sender_id === userID ||
                          msg.sender?.user_id === userID
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-zinc-700/50 text-white rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                      </div>
                      <span className="text-xs text-zinc-500 mt-1">
                        {new Date(msg.createdAt || msg.sent_at).toLocaleString(
                          undefined,
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
               <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-zinc-800/50 backdrop-blur-sm border-t border-zinc-700/50">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="flex-1 px-4 py-3 bg-zinc-700/50 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-2"
                  onClick={handleSendMessage}
                >
                  <span>Send</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </Transition.Child>
      </div>
    </Transition>
  );
}

export default LiveChat;
