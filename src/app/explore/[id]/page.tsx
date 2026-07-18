"use client";

import { useEffect, useState, useMemo, use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getMutation } from "@/lib/core/server";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

interface Project {
  _id: string;
  title: string;
  image: string;
  area: number;
  buildingType: string;
  location: string;
  aiEstimate: string;
  userId: string;
  createdAt: string;
}

interface ProjectResponse {
  success: boolean;
  data: Project;
}

export default function ExploreDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const res = await getMutation<ProjectResponse>(`/api/projects/${id}`);
        if ("error" in res) {
          setErrorMsg(res.message || "Failed to load project details.");
        } else if (res.success && res.data) {
          setProject(res.data);
        } else {
          setErrorMsg("Project details not found.");
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id]);

// 🧠 Multi-Format Structural Blueprint Parser (Handles Rangpur, Dhaka & mixed Markdown patterns)
  const parsedData = useMemo(() => {
    if (!project?.aiEstimate) return null;

    const raw = project.aiEstimate;
    const lines = raw.split("\n");

    // ফলব্যাক ডিফোল্ট ভ্যালু (যদি কোনো কিছু এক্সট্র্যাক্ট করা না যায়)
    let cementBags = 500, cementCost = 275000;
    let steelTons = 5.4, steelCost = 513000;
    let sandCft = 1200, sandCost = 66000;
    let bricksPcs = 15000, bricksCost = 180000;
    let laborCost = Math.round((project.area || 1000) * 250);
    let totalCost = 0;

    // একটি লাইন থেকে ক্রমানুসারে সব সংখ্যা বের করার হেল্পার
    const extractNumbers = (text: string): number[] => {
      const matches = text.match(/[\d,.]+/g);
      if (!matches) return [];
      return matches.map(m => parseFloat(m.replace(/,/g, "")) || 0).filter(n => n > 0);
    };

    // ১ম পাস: শুধুমাত্র টোটাল পরিমাণ (Total Quantity) খোঁজা
    lines.forEach((line) => {
      const lowerLine = line.toLowerCase();
      const nums = extractNumbers(line);
      if (nums.length === 0) return;

      // সাব-ক্যালকুলেশন বা ব্রেকডাউন লাইনগুলো স্কিপ করতে (যা টোটাল নয়)
      const isBreakdown = lowerLine.includes("foundation") || lowerLine.includes("slab") || lowerLine.includes("column") || lowerLine.includes("beam") || lowerLine.includes("wall") || lowerLine.includes("floor") || lowerLine.includes("roof");

      if (!isBreakdown) {
        if (lowerLine.includes("cement") && lowerLine.includes("bag")) {
          // লাইনের ১ম সংখ্যাটাই কোয়ান্টিটি
          cementBags = Math.round(nums[0]);
        }
        else if (lowerLine.includes("steel") && (lowerLine.includes("ton") || lowerLine.includes("kg"))) {
          steelTons = nums[0];
        }
        else if (lowerLine.includes("sand") && lowerLine.includes("cft")) {
          sandCft = Math.round(nums[0]);
        }
        else if (lowerLine.includes("brick") && (lowerLine.includes("pc") || lowerLine.includes("piece"))) {
          bricksPcs = Math.round(nums[0]);
        }
      }
    });

    // ২য় পাস: শুধুমাত্র খরচ (Costs) এবং ফাইনাল বাজেট খোঁজা
    lines.forEach((line) => {
      const lowerLine = line.toLowerCase();
      const nums = extractNumbers(line);
      if (nums.length === 0) return;

      // কস্ট বা বিডিটি লাইনে একাধিক সংখ্যা থাকলে (যেমন: 420 bags x 420 BDT = 176400) শেষ সংখ্যাটিই বড় এবং আসল দাম
      const possibleCost = nums.length >= 1 ? Math.max(...nums) : 0;

      if (lowerLine.includes("cement") && (lowerLine.includes("cost") || lowerLine.includes("bdt") || lowerLine.includes("taka"))) {
        if (possibleCost > 1000) cementCost = Math.round(possibleCost);
      }
      else if (lowerLine.includes("steel") && (lowerLine.includes("cost") || lowerLine.includes("bdt") || lowerLine.includes("taka"))) {
        if (possibleCost > 1000) steelCost = Math.round(possibleCost);
      }
      else if (lowerLine.includes("sand") && (lowerLine.includes("cost") || lowerLine.includes("bdt") || lowerLine.includes("taka"))) {
        if (possibleCost > 100) sandCost = Math.round(possibleCost);
      }
      else if (lowerLine.includes("brick") && (lowerLine.includes("cost") || lowerLine.includes("bdt") || lowerLine.includes("taka"))) {
        if (possibleCost > 1000) bricksCost = Math.round(possibleCost);
      }
      else if (lowerLine.includes("labor") && (lowerLine.includes("cost") || lowerLine.includes("bdt") || lowerLine.includes("taka"))) {
        if (possibleCost > 1000) laborCost = Math.round(possibleCost);
      }
      else if (
        (lowerLine.includes("total") || lowerLine.includes("budget") || lowerLine.includes("final")) &&
        (lowerLine.includes("bdt") || lowerLine.includes("taka") || lowerLine.includes("estimate"))
      ) {
        if (possibleCost > 50000) totalCost = Math.round(possibleCost);
      }
    });

    // ৩য় পাস: যদি AI আলাদা করে টোটাল বা লেবার ফিগার ফিক্স না করে, লজিক্যাল ব্যালেন্স করা
    const materialsSum = cementCost + steelCost + sandCost + bricksCost;
    if (totalCost === 0) {
      totalCost = materialsSum + laborCost;
    } else if (laborCost === Math.round((project.area || 1000) * 250) && totalCost > materialsSum) {
      // যদি AI নিজেই টোটাল কস্ট দিয়ে দেয়, তবে লেবার কস্ট হবে অবশিষ্টাংশ
      laborCost = totalCost - materialsSum;
    }

    return {
      materials: [
        { name: "Cement (Bags)", quantity: cementBags, cost: cementCost },
        { name: "Steel (Tons)", quantity: steelTons, cost: steelCost },
        { name: "Sand (CFT)", quantity: sandCft, cost: sandCost },
        { name: "Bricks (Pcs)", quantity: bricksPcs, cost: bricksCost },
      ],
      laborCost,
      totalCost,
    };
  }, [project]);

  const materialData = useMemo(() => {
    return parsedData?.materials.map(m => ({ name: m.name.split(" ")[0], quantity: m.quantity })) || [];
  }, [parsedData]);

  const costData = useMemo(() => {
    if (!parsedData) return [];
    return [
      { name: "Cement", value: parsedData.materials[0].cost, color: "#10B981" },
      { name: "Steel", value: parsedData.materials[1].cost, color: "#38BDF8" },
      { name: "Sand", value: parsedData.materials[2].cost, color: "#FBBF24" },
      { name: "Bricks", value: parsedData.materials[3].cost, color: "#F87171" },
      { name: "Labor & Others", value: parsedData.laborCost, color: "#A78BFA" },
    ].filter(c => c.value > 0);
  }, [parsedData]);

  const handleExportPDF = () => {
    const projectTitle = project?.title?.trim() || "Project Estimate";
    const dateStr = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const styleEl = document.createElement("style");
    styleEl.id = "__pdf-explore-override";
    styleEl.innerHTML = `
      @media print {
        body > * { display: none !important; }
        body > main { display: block !important; }
        body > main > * { display: none !important; }
        body > main #explore-print-section {
          display: block !important;
          visibility: visible !important;
        }
        #explore-print-section * {
          visibility: visible !important;
        }
        #explore-print-section::before {
          content: "ConstructIQ AI — Cost Estimate Report\\A ${projectTitle}  •  ${dateStr}";
          white-space: pre;
          display: block;
          font-size: 14pt;
          font-weight: 700;
          color: #111827;
          margin-bottom: 16px;
          padding-bottom: 10px;
          border-bottom: 2px solid #10B981;
        }
      }
    `;
    document.head.appendChild(styleEl);

    const prevTitle = document.title;
    document.title = `ConstructIQ \u2014 ${projectTitle} \u2014 Report (${dateStr})`;

    window.print();

    document.title = prevTitle;
    document.head.removeChild(styleEl);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 border-4 border-t-[#10B981] border-slate-800 rounded-full animate-spin" />
          <p className="text-slate-400 font-medium">Retrieving real-time estimate data...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !project) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-5 p-8 bg-[#0F172A] border border-slate-800 rounded-2xl">
          <div className="text-red-400 text-5xl">⚠️</div>
          <h2 className="text-2xl font-bold">Failed to load details</h2>
          <p className="text-slate-400 text-sm">{errorMsg || "The requested estimate does not exist or has been deleted."}</p>
          <Link href="/explore" className="inline-block px-5 py-2.5 bg-[#10B981] text-[#020617] font-bold rounded-xl transition hover:opacity-90">
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      id="explore-print-section"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#020617] text-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 print:bg-white print:text-black print:py-4"
    >
      <div className="max-w-5xl mx-auto space-y-8 print:space-y-6">

        {/* Back Button */}
        <Link href="/explore" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#10B981] transition-colors group print:hidden">
          <svg className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-semibold text-sm">Back to Explore</span>
        </Link>

        {/* Hero Section */}
        <div className="relative h-[250px] sm:h-[400px] w-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl print:border-none print:shadow-none print:h-[220px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.image} alt={project.title} className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent print:from-black print:to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 space-y-2">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 uppercase tracking-wider print:border-black/30 print:text-white print:bg-black/40">
              {project.buildingType}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight drop-shadow-md print:text-2xl">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-300 print:text-white">
              <span className="flex items-center gap-1">
                📍 {project.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                📐 {project.area.toLocaleString()} sqft
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Warning disclaimer */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-3 text-slate-300 print:bg-slate-100 print:border-slate-300 print:text-slate-700">
          <span className="text-xl flex-shrink-0 text-amber-500 print:text-slate-800">💡</span>
          <div className="text-xs sm:text-sm">
            <h4 className="font-bold text-amber-400 mb-0.5 print:text-slate-800">AI Cost Guidance Concept</h4>
            <p>This layout and data represent an AI-generated structural blueprint design intended for concept verification. Use this estimation to guide early planning phases; refer to the structured details below for custom-scale parameters.</p>
          </div>
        </div>

        {/* 🌟 🆕 NEW ADDITION: AI Raw Generated Analysis Report Card */}
        {project.aiEstimate && (
          <div className="bg-[#0F172A] border border-slate-800/80 p-6 rounded-2xl shadow-xl space-y-4 print:bg-white print:border-slate-300 print:shadow-none">
            <div className="flex justify-between items-center border-b border-slate-800/60 pb-3 print:border-slate-300">
              <div>
                <h4 className="text-lg font-bold text-[#10B981] print:text-emerald-600">AI Raw Generated Analysis Report</h4>
                <p className="text-xs text-slate-400 print:text-slate-500">Direct structural blueprint breakdown from the LLM engine</p>
              </div>
              <span className="text-xs font-mono font-bold bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 px-3 py-1 rounded-full uppercase tracking-wider print:border-slate-300 print:text-slate-700">
                Live Stream Text
              </span>
            </div>

            {/* Clean Markdown Styling Container */}
            <div className="text-slate-300 print:text-black text-sm leading-relaxed space-y-2 whitespace-pre-line font-normal tracking-wide max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800 print:max-h-none print:overflow-visible">
              {project.aiEstimate}
            </div>
          </div>
        )}

        {/* Visual Analytics */}
        {parsedData && parsedData.totalCost > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4">
            {/* Bar Chart */}
            <div className="bg-[#0F172A] border border-slate-800/80 p-5 rounded-2xl shadow-xl print:bg-white print:border-slate-300 print:shadow-none">
              <h3 className="text-sm font-semibold text-slate-400 mb-4 text-center print:text-slate-600">Material Quantities Breakdown</h3>
              <div className="h-64 print:h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={materialData}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "12px" }} />
                    <Bar dataKey="quantity" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-[#0F172A] border border-slate-800/80 p-5 rounded-2xl shadow-xl print:bg-white print:border-slate-300 print:shadow-none">
              <h3 className="text-sm font-semibold text-slate-400 mb-4 text-center print:text-slate-600">Cost Distribution (BDT)</h3>
              <div className="h-64 print:h-52 flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={costData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4}>
                      {costData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${Number(value).toLocaleString()} BDT`} contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "12px" }} />
                    <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Structured SaaS Table */}
        {parsedData && (
          <div className="bg-[#0F172A] border border-slate-800/80 p-6 rounded-2xl shadow-xl space-y-6 print:bg-white print:border-slate-300 print:shadow-none">
            <div className="flex justify-between items-center border-b border-slate-800/60 pb-4 print:border-slate-300">
              <div>
                <h4 className="text-lg font-bold text-[#10B981] print:text-emerald-600">Detailed Estimation Table</h4>
                <p className="text-xs text-slate-400 print:text-slate-500">Resource quantities mapped to BDT rates</p>
              </div>
              <span className="text-xs font-mono font-bold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 px-3 py-1 rounded-full uppercase tracking-wider print:border-slate-300 print:text-slate-700">
                AI Generated
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300 print:text-black">
                <thead className="bg-[#020617] text-slate-400 text-xs uppercase font-mono border-b border-slate-800 print:bg-slate-100 print:text-slate-600 print:border-slate-350">
                  <tr>
                    <th className="p-4 rounded-l-lg">Material / Item</th>
                    <th className="p-4">Estimated Quantity</th>
                    <th className="p-4 rounded-r-lg text-right">Estimated Cost (BDT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 print:divide-slate-200">
                  {parsedData.materials.map((mat, i) => (
                    <tr key={i} className="hover:bg-slate-900/20 transition print:hover:bg-transparent">
                      <td className="p-4 font-semibold text-[#F8FAFC] print:text-slate-900">{mat.name.split(" ")[0]}</td>
                      <td className="p-4 text-slate-400 print:text-slate-600">
                        {mat.quantity.toLocaleString()} {mat.name.includes("Bags") ? "Bags" : mat.name.includes("Tons") ? "Tons" : mat.name.includes("CFT") ? "CFT" : "Pcs"}
                      </td>
                      <td className="p-4 text-right text-[#10B981] font-mono font-semibold print:text-emerald-700">{mat.cost.toLocaleString()} BDT</td>
                    </tr>
                  ))}
                  {parsedData.laborCost > 0 && (
                    <tr className="hover:bg-slate-900/20 transition print:hover:bg-transparent">
                      <td className="p-4 font-semibold text-[#F8FAFC] print:text-slate-900">Labor & Others</td>
                      <td className="p-4 text-slate-400 print:text-slate-600">Standard workforce rates</td>
                      <td className="p-4 text-right text-[#10B981] font-mono font-semibold print:text-emerald-700">{parsedData.laborCost.toLocaleString()} BDT</td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-[#020617]/50 font-bold border-t-2 border-slate-700 print:bg-slate-50 print:border-slate-350">
                    <td colSpan={2} className="p-4 text-[#38BDF8] text-base print:text-sky-700">Total Estimated Budget</td>
                    <td className="p-4 text-right text-[#38BDF8] text-lg font-mono tracking-wide print:text-sky-700">
                      BDT {parsedData.totalCost.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Important AI Note (Disclaimer box) */}
        <div className="bg-[#0F172A] border border-slate-800/80 p-5 rounded-2xl shadow-xl flex gap-3 text-slate-400 print:bg-slate-50 print:border-slate-300 print:text-slate-600">
          <span className="text-xl flex-shrink-0 text-amber-500">⚠️</span>
          <p className="text-xs sm:text-sm leading-relaxed">
            <strong>Note:</strong> This estimation is generated by an AI model and serves as an approximate guideline only. Original real-world values may vary depending on local market conditions and final engineering blueprints.
          </p>
        </div>

        {/* Action Buttons at the Bottom */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end items-center pt-4 print:hidden">
          {/* Export Report as PDF */}
          <button
            type="button"
            onClick={handleExportPDF}
            className="w-full sm:w-auto px-6 py-3.5 bg-transparent border border-[#38BDF8] text-[#38BDF8] hover:bg-[#38BDF8]/10 hover:shadow-[0_0_15px_rgba(56,189,248,0.25)] transition-all duration-300 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Report as PDF
          </button>

          {/* Add New Project / Create Button */}
          <Link
            href="/items/add"
            className="w-full sm:w-auto px-6 py-3.5 bg-[#10B981] text-[#020617] hover:bg-[#10B981]/90 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all duration-300 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create Estimate
          </Link>
        </div>

      </div>
    </motion.div>
  );
}