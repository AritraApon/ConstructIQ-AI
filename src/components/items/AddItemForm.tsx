"use client";

import { postMutation } from "@/lib/core/server";
import React, { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

interface ProjectResponse {
  success: boolean;
  message: string;
  data: {
    aiEstimate: string;
  };
}

export default function AddItemForm({ userId }: { userId: string }) {
  const [formData, setFormData] = useState({
    title: "",
    area: "",
    buildingType: "Commercial",
    location: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [aiRawEstimate, setAiRawEstimate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

// 🧠 Ultra-Stable Multi-Format Dynamic Markdown Parser for Construction Estimates
  const parsedData = useMemo(() => {
    if (!aiRawEstimate) return null;

    const lines = aiRawEstimate.split("\n");

    // ১. স্ট্যাটিক ফলব্যাক ভ্যালু (যদি কোনো কিছুই টেক্সট থেকে এক্সট্র্যাক্ট করা না যায়)
    let cementBags = 500, cementCost = 275000;
    let steelTons = 5.4, steelCost = 513000;
    let sandCft = 1200, sandCost = 66000;
    let bricksPcs = 15000, bricksCost = 180000;
    let laborCost = 350000; // স্ট্যান্ডার্ড লেবার কস্ট ফলব্যাক
    let totalCost = 0;

    // একটি লাইন থেকে ক্রমানুসারে সব সংখ্যা বের করার হেল্পার ফাংশন
    const extractNumbers = (text: string): number[] => {
      const matches = text.match(/[\d,.]+/g);
      if (!matches) return [];
      // কমা বাদ দিয়ে পিওর ফ্লোট নম্বরে কনভার্ট করা এবং ০ বা নেগেটিভ ভ্যালু ফিল্টার করা
      return matches
        .map(m => parseFloat(m.replace(/,/g, "")) || 0)
        .filter(n => n > 0);
    };

    // 🚀 ১ম পাস: শুধুমাত্র টোটাল পরিমাণ (Total Quantity) খোঁজা (ব্রেকডাউন লাইনগুলো স্কিপ করে)
    lines.forEach((line) => {
      const lowerLine = line.toLowerCase();
      const nums = extractNumbers(line);
      if (nums.length === 0) return;

      // ফাউন্ডেশন, স্ল্যাব, ফ্লোর ইত্যাদির ব্রেকডাউন লাইনগুলো স্কিপ করার জন্য সেফটি গার্ড
      const isBreakdown =
        lowerLine.includes("foundation") ||
        lowerLine.includes("slab") ||
        lowerLine.includes("column") ||
        lowerLine.includes("beam") ||
        lowerLine.includes("wall") ||
        lowerLine.includes("floor") ||
        lowerLine.includes("roof") ||
        lowerLine.includes("partition");

      if (!isBreakdown) {
        if (lowerLine.includes("cement") && lowerLine.includes("bag")) {
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

    // 🚀 ২য় পাস: খরচ (Costs) এবং ফাইনাল বাজেট স্ক্যান করা
    lines.forEach((line) => {
      const lowerLine = line.toLowerCase();
      const nums = extractNumbers(line);
      if (nums.length === 0) return;

      // ক্যালকুলেশন লাইনে (যেমন: 420 x 420 = 176400) সবচেয়ে বড় সংখ্যাটাই সাধারণত ফাইনাল কস্ট হয়
      const possibleCost = Math.max(...nums);

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
      else if ((lowerLine.includes("labor") || lowerLine.includes("workforce")) && (lowerLine.includes("cost") || lowerLine.includes("bdt") || lowerLine.includes("taka"))) {
        if (possibleCost > 1000) laborCost = Math.round(possibleCost);
      }
      else if (
        (lowerLine.includes("total") || lowerLine.includes("budget") || lowerLine.includes("final")) &&
        (lowerLine.includes("bdt") || lowerLine.includes("taka") || lowerLine.includes("estimate") || lowerLine.includes("cost"))
      ) {
        if (possibleCost > 50000) totalCost = Math.round(possibleCost);
      }
    });

    // 🚀 ৩য় পাস: লজিক্যাল ব্যালেন্সিং এবং সেফটি ফিক্স
    const materialsSum = cementCost + steelCost + sandCost + bricksCost;

    // যদি AI টোটাল কস্ট আলাদা করে জেনারেট না করে, তাহলে সব খরচের যোগফলই হবে টোটাল
    if (totalCost === 0) {
      totalCost = materialsSum + laborCost;
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
  }, [aiRawEstimate]);

  const materialData = parsedData?.materials.map(m => ({ name: m.name, quantity: m.quantity })) || [];

  const costData = parsedData ? [
    { name: "Cement", value: parsedData.materials[0].cost, color: "#10B981" },
    { name: "Steel", value: parsedData.materials[1].cost, color: "#38BDF8" },
    { name: "Sand", value: parsedData.materials[2].cost, color: "#FBBF24" },
    { name: "Bricks", value: parsedData.materials[3].cost, color: "#F87171" },
    { name: "Labor & Others", value: parsedData.laborCost, color: "#A78BFA" },
  ].filter(c => c.value > 0) : [];

  const uploadToImgBB = async (file: File): Promise<string | null> => {
    setUploadingImage(true);
    const formDataBody = new FormData();
    formDataBody.append("image", file);

    try {
      const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY as string;
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formDataBody,
      });
      const data = await res.json();
      if (data.success) {
        return data.data.url;
      } else {
        throw new Error("ImgBB upload failed");
      }
    } catch (err) {
      toast.error("Image upload failed!");
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleReset = () => {
    setFormData({ title: "", area: "", buildingType: "Commercial", location: "" });
    setImageFile(null);
    setAiRawEstimate("");
    toast.success("Form cleared!");
  };

  const handleDownloadPDF = () => {
    const projectLabel = formData.title.trim() || "Estimate";
    const dateStr = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const styleEl = document.createElement("style");
    styleEl.id = "__pdf-print-override";
    styleEl.innerHTML = `
      @media print {
        body > * { display: none !important; }
        body > main { display: block !important; }
        body > main > * { display: none !important; }
        body > main #estimate-print-section {
          display: block !important;
          visibility: visible !important;
        }
        #estimate-print-section * {
          visibility: visible !important;
        }
        #estimate-print-section::before {
          content: "ConstructIQ AI — Cost Estimate Report\\A ${projectLabel}  •  ${dateStr}";
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
    document.title = `ConstructIQ — ${projectLabel} — Estimate (${dateStr})`;

    window.print();

    document.title = prevTitle;
    document.head.removeChild(styleEl);
  };

  const handleGenerateAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error("Please select a project image!");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Uploading image and calculating budget with AI...");

    const imageUrl = await uploadToImgBB(imageFile);
    if (!imageUrl) {
      setLoading(false);
      toast.dismiss(toastId);
      return;
    }

    const payload = {
      ...formData,
      image: imageUrl,
      area: Number(formData.area),
      userId,
    };

    const result = await postMutation<ProjectResponse, typeof payload>("/api/projects/add", payload);
    setLoading(false);
    toast.dismiss(toastId);

    if ("error" in result) {
      toast.error(result.message || "Failed to generate estimate!");
    } else if (result.success) {
      toast.success("Estimate successfully generated & saved!");
      setAiRawEstimate(result.data.aiEstimate);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-[#F8FAFC] p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl bg-[#0F172A] border border-slate-800 rounded-2xl shadow-xl p-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#10B981] to-[#38BDF8] bg-clip-text text-transparent">
            Civil Engineering Cost Estimator
          </h2>
        </div>

        <div className="bg-[#0F172A] border my-2 border-slate-800/80 p-5 rounded-2xl shadow-xl flex gap-3 text-slate-400 print:bg-slate-50 print:border-slate-300 print:text-slate-600">
          <span className="text-xl flex-shrink-0 text-amber-500">⚠️</span>
          <p className="text-xs sm:text-sm leading-relaxed">
            <strong>Note:</strong> This estimation is generated by an AI model and serves as an approximate guideline only. Original real-world values may vary depending on local market conditions and final engineering blueprints.
          </p>
        </div>

        <form onSubmit={handleGenerateAndSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Project Title</label>
              <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="e.g., Rangpur Commercial Hub" className="w-full px-4 py-3 bg-[#020617] border border-slate-700 rounded-lg text-white" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Project Image</label>
              <input type="file" accept="image/*" required onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full px-4 py-2 bg-[#020617] border border-slate-700 rounded-lg text-slate-400 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#10B981] file:text-[#020617] hover:file:opacity-90 cursor-pointer" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Area (Sq. Ft.)</label>
              <input type="number" name="area" required value={formData.area} onChange={handleChange} placeholder="e.g., 1500" className="w-full px-4 py-3 bg-[#020617] border border-slate-700 rounded-lg text-white" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Building Type</label>
              <select name="buildingType" value={formData.buildingType} onChange={handleChange} className="w-full px-4 py-3 bg-[#020617] border border-slate-700 rounded-lg text-white">
                <option value="Commercial">Commercial</option>
                <option value="Residential">Residential</option>
                <option value="Industrial">Industrial</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
            <input type="text" name="location" required value={formData.location} onChange={handleChange} placeholder="e.g., Rangpur" className="w-full px-4 py-3 bg-[#020617] border border-slate-700 rounded-lg text-white" />
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={handleReset} className="w-1/4 py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition">
              Reset Form
            </button>
            <button type="submit" disabled={loading || uploadingImage} className="w-3/4 py-4 bg-gradient-to-r from-[#10B981] to-[#38BDF8] text-[#020617] font-bold rounded-xl shadow-lg disabled:opacity-50 transition flex items-center justify-center gap-2">
              {loading ? "Processing..." : "Generate with AI & Submit"}
            </button>
          </div>
        </form>

        {/* 📊 Visualized Structural Analytics and Dynamic Data Table */}
        {aiRawEstimate && parsedData && (
          <div id="estimate-print-section" className="mt-10 pt-8 border-t border-slate-800 space-y-8 animate-fadeIn print:bg-white print:border-slate-300 print:mt-0 print:pt-0">

            {/* 🌟 NEW: Smart Raw AI Text Preview Card (No code break, perfectly safe) */}
            <div className="bg-[#020617] border border-slate-800 p-6 rounded-xl space-y-4 print:border-slate-300">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 print:border-slate-200">
                <span className="text-xl">🤖</span>
                <h4 className="text-lg font-bold text-[#38BDF8]">AI Raw Generated Analysis Report</h4>
              </div>
              <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans max-h-96 overflow-y-auto pr-2 print:max-h-none print:overflow-visible print:text-black">
                {aiRawEstimate}
              </div>
            </div>

            <h3 className="text-2xl font-bold text-[#38BDF8] text-center">Visualized Structural Analytics</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#020617] p-4 rounded-xl border border-slate-800">
                <h4 className="text-sm font-semibold text-slate-400 mb-4 text-center">Material Quantity Breakdown</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={materialData}>
                      <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                      <YAxis stroke="#64748B" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155" }} />
                      <Bar dataKey="quantity" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-[#020617] p-4 rounded-xl border border-slate-800">
                <h4 className="text-sm font-semibold text-slate-400 mb-4 text-center">Cost Distribution</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={costData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                        {costData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${Number(value).toLocaleString()} BDT`} contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155" }} />
                      <Legend verticalAlign="bottom" height={36} iconSize={10} fontSize={10} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-[#020617] p-6 rounded-xl border border-slate-800 space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <h4 className="text-lg font-bold text-[#10B981]">Detailed Estimation Table</h4>
                <span className="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full uppercase font-mono tracking-wider">
                  AI Generated
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-[#0F172A] text-slate-400 text-xs uppercase font-mono border-b border-slate-800">
                    <tr>
                      <th className="p-4 rounded-l-lg">Material / Item</th>
                      <th className="p-4">Estimated Quantity</th>
                      <th className="p-4 rounded-r-lg text-right">Estimated Cost (BDT)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {parsedData.materials.map((mat, i) => (
                      <tr key={i} className="hover:bg-slate-900/40 transition">
                        <td className="p-4 font-medium text-[#F8FAFC]">{mat.name.split(" ")[0]}</td>
                        <td className="p-4 text-slate-400">
                          {mat.quantity.toLocaleString()} {mat.name.includes("Bags") ? "Bags" : mat.name.includes("Tons") ? "Tons" : mat.name.includes("CFT") ? "CFT" : "Pcs"}
                        </td>
                        <td className="p-4 text-right text-[#10B981] font-mono">{mat.cost.toLocaleString()}</td>
                      </tr>
                    ))}
                    {parsedData.laborCost > 0 && (
                      <tr className="hover:bg-slate-900/40 transition">
                        <td className="p-4 font-medium text-[#F8FAFC]">Labor & Other Costs</td>
                        <td className="p-4 text-slate-400">Estimated scale</td>
                        <td className="p-4 text-right text-[#10B981] font-mono">{parsedData.laborCost.toLocaleString()}</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#0F172A]/50 font-bold border-t-2 border-slate-700">
                      <td colSpan={2} className="p-4 text-[#38BDF8] text-base">Total Estimated Budget</td>
                      <td className="p-4 text-right text-[#38BDF8] text-lg font-mono tracking-wide">
                        BDT {parsedData.totalCost.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <button
                type="button"
                onClick={() => window.location.href = '/items/manage'}
                className="w-full sm:w-auto px-6 py-3 bg-[#0F172A] border border-slate-700 text-[#F8FAFC] hover:bg-slate-800 transition rounded-xl font-medium text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 text-[#38BDF8]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Go to Manage Projects
              </button>

              <button
                type="button"
                onClick={handleDownloadPDF}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#38BDF8] to-[#10B981] text-[#020617] hover:opacity-90 transition rounded-xl font-bold text-sm flex items-center justify-center gap-2 print:hidden"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Report as PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}