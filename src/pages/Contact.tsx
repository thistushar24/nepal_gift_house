import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { CONTACT_INFO, openWhatsApp } from '../utils/whatsapp';

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Contact Us</h1>
          <p className="text-gray-600">Get in touch with us for any inquiries</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-rose-100 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                  <a
                    href={`tel:${CONTACT_INFO.phone}`}
                    className="text-gray-600 hover:text-rose-600 transition-colors"
                  >
                    {CONTACT_INFO.displayPhone}
                  </a>
                  <p className="text-sm text-gray-500 mt-1">Available 7 days a week</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
                  <button
                    onClick={() => openWhatsApp()}
                    className="text-gray-600 hover:text-green-600 transition-colors"
                  >
                    Chat with us on WhatsApp
                  </button>
                  <p className="text-sm text-gray-500 mt-1">Quick response guaranteed</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                  <a
                    href={CONTACT_INFO.googleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    View on Google Maps
                  </a>
                  <p className="text-sm text-gray-500 mt-1">Nepal Gift House, Nepal</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Working Hours</h3>
                  <p className="text-gray-600">Monday - Sunday</p>
                  <p className="text-gray-600">10:00 AM - 8:00 PM</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border border-rose-200">
              <h3 className="font-semibold text-gray-900 mb-2">Visit Our Physical Shop</h3>
              <p className="text-gray-700 text-sm mb-3">
                We are a real shop with a physical location. Come visit us to see our products
                in person before making a decision!
              </p>
              <a
                href={CONTACT_INFO.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors"
              >
                Get Directions
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>

            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-600 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-600 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-600 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="What would you like to know?"
                ></textarea>
              </div>

              <button
                type="button"
                onClick={() => openWhatsApp()}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Send via WhatsApp
              </button>

              <p className="text-sm text-gray-500 text-center">
                Click above to send your message directly on WhatsApp for faster response
              </p>
            </form>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.7348474534587!2d85.31428931506197!3d27.700769782791575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQyJzAyLjgiTiA4NcKwMTgnNTkuMiJF!5e0!3m2!1sen!2snp!4v1234567890123!5m2!1sen!2snp"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Nepal Gift House Location"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
