import Link from "next/link";
export const dynamic = "force-dynamic";
export default function NotFound() {
  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center px-6 relative overflow-hidden">

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-[#10B981]/5 to-[#38BDF8]/5 blur-[120px] rounded-full pointer-events-none" />


      <div className="relative z-10 max-w-md w-full text-center border border-slate-800/80 bg-[#0F172A]/40 backdrop-blur-xl p-8 rounded-2xl shadow-[0_0_50px_rgba(2,6,23,0.5)]">


        <div className="inline-flex items-center justify-center w-20 h-20 rounded-xl bg-slate-900/80 border border-slate-800 mb-6 text-slate-400 relative group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-10 h-10 text-[#38BDF8] animate-pulse"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>


        <h1 className="text-6xl font-black tracking-tight text-white mb-2">
          40<span className="text-[#10B981]">4</span>
        </h1>
        <h2 className="text-lg font-bold text-slate-200 uppercase tracking-wide mb-3">
          Blueprint Missing
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed mb-8">
          The structural coordinate or item profile path you are attempting to audit does not exist in our dataset pipeline.
        </p>


        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#020617] font-bold text-sm tracking-wide transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] text-center"
          >
            Return Home
          </Link>
          <Link
            href="/support"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/40 text-slate-300 hover:text-white font-semibold text-sm transition-colors text-center"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}