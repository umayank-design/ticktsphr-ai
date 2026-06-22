"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createContactRequest } from "@/lib/contactRequests";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const success = await createContactRequest(formData);

    if (success) {
      alert("Contact request submitted successfully!");

      setFormData({
        name: "",
        email: "",
        company: "",
        message: "",
      });
    } else {
      alert("Unable to submit contact request.");
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 text-white px-8 py-16">
        <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-cyan-400 font-semibold mb-3">
              Contact Us
            </p>

            <h1 className="text-5xl font-bold mb-6">
              Let’s Talk About Incident Intelligence
            </h1>

            <p className="text-slate-400 text-lg mb-8">
              Have a question about Ticktsphr AI, pricing, integrations or enterprise deployment?
              Send us a message and we’ll get back to you.
            </p>

            <div className="grid gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h3 className="font-semibold mb-1">Sales & Demo</h3>
                <p className="text-slate-400">
                  Discuss your support operations and AI automation goals.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h3 className="font-semibold mb-1">Enterprise Deployment</h3>
                <p className="text-slate-400">
                  Explore integrations, security, SSO and SaaS architecture.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h3 className="font-semibold mb-1">Partnerships</h3>
                <p className="text-slate-400">
                  Partner with Ticktsphr for AI-powered IT service transformation.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6">
              Send Message
            </h2>

            <div className="grid gap-5">
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
              />

              <input
                name="email"
                type="email"
                placeholder="Work Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
              />

              <input
                name="company"
                type="text"
                placeholder="Company Name"
                value={formData.company}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
              />

              <textarea
                name="message"
                placeholder="How can we help?"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                required
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
              />

              <button
                type="submit"
                className="w-full bg-cyan-500 text-black py-3 rounded-lg font-semibold hover:bg-cyan-400 transition"
              >
                Submit Request
              </button>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
}