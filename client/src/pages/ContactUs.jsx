import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';

function ContactUs() {
  const [formData, setFormData] = useState({
    contact_name: '',
    contact_email: '',
    contact_phoneNumber: '',
    contact_message: ''
  });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/contact-us', formData);

      setFormData({
        contact_name: '',
        contact_email: '',
        contact_phoneNumber: '',
        contact_message: ''
      });
      Swal.fire({
        title: 'Success',
        text: 'Your message has been sent successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error sending message:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to send message. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <>
      <NavBar />
      <section className="text-gray-600 body-font relative mt-8 mb-0 font-sans">
        <div className="container px-20 py-20 mx-auto flex sm:flex-nowrap flex-wrap">
          <div className="hidden sm:flex lg:w-2/3 md:w-1/2 bg-gray-300 rounded-lg overflow-hidden sm:mr-10 p-10 items-end justify-start relative">
            <iframe
              width="100%"
              height="100%"
              className="absolute inset-0"
            //   frameBorder="0"
              title="map"
            //   marginHeight="0"
            //   marginWidth="0"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3379.812915311947!2d36.186781656066934!3d32.10134161183142!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151b73b8f05b73b3%3A0xbb538a62e4116f2d!2z2YPZhNmK2Kkg2KfZhNij2YXZitixINin2YTYrdiz2YrZhiDYqNmGINi52KjYr9in2YTZhNmHINin2YTYq9in2YbZiiDZhNiq2YPYqtmI2YTZiNis2YrYpyDYp9mE2YXYudmE2YjZhdin2Ko!5e0!3m2!1sen!2sus!4v1727139732233!5m2!1sen!2sushttps://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6759.660586903011!2d36.184834!3d32.100872!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151b73d1eb51be21%3A0xc4daca834a1e6988!2sThe%20Hashemite%20University!5e0!3m2!1sen!2sus!4v1727140742247!5m2!1sen!2sus"
            ></iframe>
            <div className="bg-white relative flex flex-wrap py-6 rounded shadow-md">
              <div className="lg:w-1/2 px-6">
                <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">ADDRESS</h2>
                <p className="mt-1">The Hashemite University, Zarqa, Jordan</p>
              </div>
              <div className="lg:w-1/2 px-6 mt-4 lg:mt-0">
                <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">EMAIL</h2>
                <Link to="#" className="text-blue-600 leading-relaxed">contactme@scephub.com</Link>
                <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs mt-4">PHONE</h2>
                <p className="leading-relaxed">07 0771 1771</p>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="lg:w-1/3 md:w-1/2 bg-white flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0">
            <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">Contact Us</h2>
            <p className="leading-relaxed mb-5 text-gray-600">Feel free to contact us using the form below.</p>
            <div className="relative mb-4">
              <label htmlFor="contact_name" className="leading-7 text-sm text-gray-600">Name</label>
              <input
                type="text"
                id="contact_name"
                name="contact_name"
                value={formData.contact_name}
                onChange={handleChange}
                required
                className="w-full bg-white rounded border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="relative mb-4">
              <label htmlFor="contact_email" className="leading-7 text-sm text-gray-600">Email</label>
              <input
                type="email"
                id="contact_email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                required
                className="w-full bg-white rounded border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="relative mb-4">
              <label htmlFor="contact_phoneNumber" className="leading-7 text-sm text-gray-600">Phone Number</label>
              <input
                type="tel"
                id="contact_phoneNumber"
                name="contact_phoneNumber"
                value={formData.contact_phoneNumber}
                onChange={handleChange}
                required
                className="w-full bg-white rounded border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="relative mb-4">
              <label htmlFor="contact_message" className="leading-7 text-sm text-gray-600">Message</label>
              <textarea
                id="contact_message"
                name="contact_message"
                value={formData.contact_message}
                onChange={handleChange}
                className="w-full bg-white rounded border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
              ></textarea>
            </div>
            <button type="submit" className="text-white bg-blue-600 border-0 py-2 px-6 focus:outline-none hover:bg-blue-800 rounded text-lg">Send</button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default ContactUs;
