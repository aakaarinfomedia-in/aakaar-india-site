import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        <h1 className="text-5xl font-semibold max-w-3xl leading-tight">
          Should You Make That Decision Today?
        </h1>

        <p className="text-gray-400 mt-6 max-w-2xl text-lg">
          Aakaar MindMeter measures decision stability and cognitive load 
          based on sleep, stress, and meeting intensity.
        </p>

        <Link
          href="/mindmeter"
          className="mt-10 bg-white text-black px-6 py-3 rounded-xl font-medium hover:opacity-90 transition"
        >
          Try MindMeter
        </Link>
      </section>

      {/* Problem Section */}
      <section className="px-6 py-20 bg-zinc-900 text-center">
        <h2 className="text-3xl font-semibold">
          Modern Work Is Mentally Overloaded
        </h2>

        <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
          Back-to-back meetings. Sleep debt. Constant decisions.
          Decision quality often declines long before burnout becomes visible.
        </p>
      </section>

      {/* Solution Section */}
      <section className="px-6 py-20 text-center">
        <h2 className="text-3xl font-semibold">
          Measure Your Decision Stability
        </h2>

        <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
          MindMeter provides a performance-focused index that helps you 
          understand when cognitive strain may impact important decisions.
        </p>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20 bg-zinc-900 text-center">
        <h2 className="text-3xl font-semibold">
          How It Works
        </h2>

        <div className="mt-10 space-y-6 text-gray-400 max-w-xl mx-auto">
          <p>1. Enter your sleep hours.</p>
          <p>2. Log meeting load and stress level.</p>
          <p>3. Receive a Decision Stability and Meeting Overload score.</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-24 text-center">
        <h2 className="text-3xl font-semibold">
          Make Better Decisions. Protect Your Mental Performance.
        </h2>

        <Link
          href="/mindmeter"
          className="mt-10 inline-block bg-white text-black px-6 py-3 rounded-xl font-medium hover:opacity-90 transition"
        >
          Check Your MindMeter
        </Link>
      </section>

    </main>
  );
}