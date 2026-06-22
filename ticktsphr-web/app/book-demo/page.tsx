"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { createDemoRequest } from "@/lib/demoRequests";

export default function BookDemoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    teamSize: "",
    message: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  const success = await createDemoRequest(formData);

  if (success) {
    alert("Demo request submitted successfully!");

    setFormData({
      name: "",
      email: "",
      company: "",
      role: "",
      teamSize: "",
      message: "",
    });
  } else {
    alert("Unable to submit request.");
  }
}

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 text-white px-8 py-16">
        <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          
          {/* Left Side Content */}
          <div>
            <p className="text-cyan-400 font-semibold mb-3">
              Book Demo
            </p>

            <h1 className="text-5xl font-bold mb-6">
              See Ticktsphr AI in Action
            </h1>

            <p className="text-slate-400 text-lg mb-8">
              Discover how Ticktsphr AI helps IT teams reduce MTTR,
              improve routing accuracy, reuse knowledge and lower support costs.
            </p>

            <div className="grid gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h3 className="font-semibold mb-1">
                  Predict Faster
                </h3>
                <p className="text-slate-400">
                  Identify probable RCA and similar incidents instantly.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h3 className="font-semibold mb-1">
                  Route Smarter
                </h3>
                <p className="text-slate-400">
                  Send tickets to the right resolver group automatically.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h3 className="font-semibold mb-1">
                  Resolve Better
                </h3>
                <p className="text-slate-400">
                  Generate AI-powered resolution recommendations.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6">
              Request a Demo
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
                required
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
              />

              <input
                name="role"
                type="text"
                placeholder="Your Role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
              />

              <select
                name="teamSize"
                value={formData.teamSize}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
              >
                <option value="">Team Size</option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="200+">200+</option>
              </select>

              <textarea
                name="message"
                placeholder="Tell us about your incident management needs"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
              />

              <button
                type="submit"
                className="w-full bg-cyan-500 text-black py-3 rounded-lg font-semibold hover:bg-cyan-400 transition"
              >
                Book My Demo
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}