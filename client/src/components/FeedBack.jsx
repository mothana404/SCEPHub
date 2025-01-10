import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

function Feedback() {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axios.get('http://localhost:8000/user/feedback');
        setFeedback(response.data);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      }
    };

    fetchFaqs();
  }, []);

  return (
    <>
  {/* Hero Section with Stats */}
  <section className="py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="grid items-center grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl transform rotate-3"></div>
          <div className="relative bg-white p-8 rounded-2xl shadow-xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              <span className="block text-blue-600">1 team.</span>
              <span className="block">7+ years.</span>
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                300+ projects.
              </span>
            </h2>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              At ScepHub, we partner with clients to deliver custom software solutions tailored to their needs. From project inception to completion, our team ensures high-quality, timely delivery.
            </p>
          </div>
        </div>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[...Array(12)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <img
                className="h-12 w-full object-contain"
                src={`https://cdn.rareblocks.xyz/collection/celebration/images/logos/3/logo-${index + 1}.png`}
                alt={`Partner ${index + 1}`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>

  {/* Why Choose Us Section */}
  <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 relative overflow-hidden">
    {/* Animated Background */}
    <div className="absolute inset-0 opacity-20">
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
        backgroundSize: `32px 32px`
      }}></div>
    </div>

    <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="grid items-center grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-blue-500/10 text-blue-300 text-sm font-medium">
              Why Choose Us?
            </span>
            <h2 className="text-4xl font-bold text-white">Get work done, fast!</h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              At ScepHub, we bring your ideas to life with efficiency and precision. Our team of experienced professionals works collaboratively to deliver high-quality software solutions.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="order-1 lg:order-2"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl transform rotate-6"></div>
            <img
              className="relative rounded-2xl shadow-2xl"
              src="https://images.unsplash.com/photo-1521898284481-a5ec348cb555?q=80&w=1887&auto=format&fit=crop"
              alt="Team at work"
            />
          </div>
        </motion.div>
      </div>
    </div>
  </section>

  {/* Feedback Section */}
  <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold text-gray-900">
          What Our Clients Say
        </h2>
        <div className="mt-4 h-1 w-24 bg-blue-600 mx-auto rounded-full"></div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {feedback.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <div className="text-blue-600 mb-4">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {item.feedbackParagraph.length > 180 
                    ? item.feedbackParagraph.slice(0, 180) + '...' 
                    : item.feedbackParagraph}
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.user.user_img}
                    alt={item.user.user_name}
                    className="w-12 h-12 rounded-full object-cover ring-4 ring-blue-50"
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {item.user.user_name}
                    </h4>
                    <p className="text-blue-600">{item.user.major}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
</>
  );
}

export default Feedback;
