import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { updateMeta } from "../../utils/seo";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Order Query",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    updateMeta({
      title: "Contact Us | WeatherCart Support & Helpdesk",
      description: "Get in touch with WeatherCart customer support for order tracking, returns, product inquiries, and weather data feedback.",
      canonical: `${window.location.origin}/contact`,
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "Order Query", message: "" });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3">
              <MessageSquare size={13} /> We're here to help
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Get in Touch with WeatherCart
            </h1>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Have a question about sizing, delayed shipments, or how our weather recommendation engine works? Our support team responds within 24 business hours.
            </p>
          </div>

          <div className="grid md:grid-cols-12 gap-8 items-start">
            
            {/* Contact Info Cards */}
            <div className="md:col-span-5 space-y-4">
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                  <Mail size={20} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Email Inquiries</h3>
                <p className="text-xs text-slate-500 mt-1">General & Order Support:</p>
                <a href="mailto:support@weathercart.example.com" className="text-xs font-semibold text-indigo-600 hover:underline">
                  support@weathercart.example.com
                </a>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <Phone size={20} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Telephone Helpline</h3>
                <p className="text-xs text-slate-500 mt-1">Toll-free (Mon–Sat, 9AM to 7PM IST):</p>
                <div className="text-xs font-bold text-slate-800 mt-0.5">+91 (079) 4800-9281</div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <MapPin size={20} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Technology & Operations Hub</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  WeatherCart HQ, Floor 4, Cyber City Tower, SG Highway, Ahmedabad, Gujarat 380054, India
                </p>
              </div>
            </div>

            {/* Interactive Contact Form */}
            <div className="md:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Send a Message</h2>
              <p className="text-xs text-slate-500 mb-6">Fill in the form below and our team will get back to you promptly.</p>

              {submitted ? (
                <div className="p-8 text-center bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                  <CheckCircle2 size={40} className="text-emerald-600 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-900">Message Received!</h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                    Thank you for reaching out. We have logged your ticket and a support representative will reply to your email shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@domain.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Query Category</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="Order Query">Order Status & Tracking</option>
                      <option value="Return / Refund">Returns, Exchanges & Refunds</option>
                      <option value="Weather Recommendation">Weather Recommendation Feedback</option>
                      <option value="Product Sizing">Product Sizing & Technical Fabric Details</option>
                      <option value="Partnership">Commercial Partnerships & Brand Inquiries</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Message</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please provide order number or product details..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-indigo-600/20 disabled:opacity-50"
                  >
                    {submitting ? (
                      "Transmitting..."
                    ) : (
                      <>
                        <Send size={14} /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
