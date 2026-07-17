export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#020617]/80 backdrop-blur-md">
      
      <div className="absolute w-72 h-72 rounded-full bg-[#10B981]/10 blur-[80px] animate-pulse" />

      <div className="relative flex flex-col items-center gap-4">

        <div className="relative w-16 h-16">

          <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#38BDF8]/40 animate-[spin_8s_linear_infinite]" />


          <div className="absolute inset-0 rounded-full border-4 border-slate-800 border-t-[#10B981] animate-spin" />
        </div>


        <div className="flex flex-col items-center">
          <p className="text-sm font-bold tracking-widest uppercase text-[#F8FAFC]/90">
            Construct<span className="text-[#10B981]">IQ</span> Engine
          </p>
          <span className="text-[11px] text-slate-400 mt-1 animate-pulse">
            Analyzing blueprints & cost vectors...
          </span>
        </div>
      </div>
    </div>
  );
}