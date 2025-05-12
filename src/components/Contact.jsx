import { faAddressBook, faEnvelope, faLocation, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

function Contact() {
  return (
    <div className="bg-gray-50 py-24 font-jakarta">
      {/* Page Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl lg:text-5xl font-bold text-teal-600">Contact Us</h1>
        <p className="text-gray-600 mt-2">We'd love to hear from you! Reach out to us anytime.</p>
      </div>

      {/* Contact Section */}
      <div className="container mx-auto px-4 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact Form */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Send Us a Message</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Your Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Your Message</label>
              <textarea
                placeholder="Write your message here"
                rows="5"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Details */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-6">
            Feel free to contact us via the form or through the following details:
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-teal-600 text-xl mr-4">
              <FontAwesomeIcon icon={faPhone} />
              </span>
              <p className="text-gray-700">+1 234 567 890</p>
            </div>
            <div className="flex items-center">
              <span className="text-teal-600 text-xl mr-4">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              <p className="text-gray-700">support@buyin.com</p>
            </div>
            <div className="flex items-center">
              <span className="text-teal-600 text-xl mr-4">
              <FontAwesomeIcon icon={faLocationDot} />
              </span>
              <p className="text-gray-700">123 E-commerce St, New York, NY</p>
            </div>
          </div>

          {/* Google Maps Embed */}
          <div className="mt-6">
            <iframe
              title="Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509374!2d-122.4194154846815!3d37.77492977975971!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064f0b1b1b1%3A0x2c3f0b1b1b1b1b1b!2sE-commerce%20St!5e0!3m2!1sen!2sus!4v1633021234567!5m2!1sen!2sus"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;