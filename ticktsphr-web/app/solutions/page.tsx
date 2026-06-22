import Navbar from "@/components/Navbar";

export default function SolutionsPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 text-white px-8 py-16">

        <h1 className="text-5xl font-bold mb-6">
          Solutions
        </h1>

        <div className="grid md:grid-cols-2 gap-8">

          <div className="bg-slate-900 p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-3">
              IT Service Management
            </h2>

            <p>
              Reduce ticket volume and accelerate incident resolution.
            </p>
          </div>

          <div className="bg-slate-900 p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-3">
              Healthcare Operations
            </h2>

            <p>
              Resolve critical operational issues faster.
            </p>
          </div>

        </div>

      </main>
    </>
  );
}