import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1d1d1d] to-transparent" />
        <div className="relative z-10 px-4 sm:px-6 lg:px-12 xl:px-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block text-sm font-medium text-green-400 tracking-widest uppercase mb-4">
              Get In Touch
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              Contact <span className="gradient-text">Us</span>
            </h1>
            <p className="text-lg text-white/60">
              Have a question or need assistance? We&apos;re here to help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="px-4 sm:px-6 lg:px-12 xl:px-20 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
              <Mail className="w-6 h-6 text-green-400 mb-4" />
              <h3 className="text-white font-display font-semibold mb-2">Email</h3>
              <p className="text-white/60">support@rollon.bd</p>
              <p className="text-white/60">sales@rollon.bd</p>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
              <Phone className="w-6 h-6 text-green-400 mb-4" />
              <h3 className="text-white font-display font-semibold mb-2">Phone</h3>
              <p className="text-white/60">+880 1234-567890</p>
              <p className="text-white/60">+880 9876-543210</p>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
              <MapPin className="w-6 h-6 text-green-400 mb-4" />
              <h3 className="text-white font-display font-semibold mb-2">Address</h3>
              <p className="text-white/60">123 Gulshan Avenue</p>
              <p className="text-white/60">Dhaka 1212, Bangladesh</p>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
              <Clock className="w-6 h-6 text-green-400 mb-4" />
              <h3 className="text-white font-display font-semibold mb-2">Hours</h3>
              <p className="text-white/60">Mon - Sat: 9AM - 8PM</p>
              <p className="text-white/60">Sunday: 10AM - 6PM</p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="p-8 bg-white/5 rounded-2xl border border-white/5">
              <h2 className="text-2xl font-display font-semibold text-white mb-6">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact-name" className="block text-white/60 text-sm mb-2">Your Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/60 focus:outline-none focus:border-green-400/50"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-white/60 text-sm mb-2">Your Email</label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/60 focus:outline-none focus:border-green-400/50"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-subject" className="block text-white/60 text-sm mb-2">Subject</label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/60 focus:outline-none focus:border-green-400/50"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-white/60 text-sm mb-2">Message</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/60 focus:outline-none focus:border-green-400/50 resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full text-black font-semibold flex items-center gap-2"
                >
                  {isSubmitted ? 'Message Sent!' : 'Send Message'}
                  <Send className="w-4 h-4" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}