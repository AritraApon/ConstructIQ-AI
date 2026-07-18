"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getMutation } from "@/lib/core/server";

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

interface ProjectsResponse {
  success: boolean;
  data: Project[];
}

export default function ExplorePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [search, setSearch] = useState("");
  const [buildingType, setBuildingType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const itemsPerPage = 12;

  // Fetch projects from backend using getMutation
  const fetchProjects = async (searchVal: string, typeVal: string) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const typeQuery = typeVal === "All" ? "" : typeVal;
      const url = `/api/projects?search=${encodeURIComponent(searchVal)}&buildingType=${encodeURIComponent(typeQuery)}`;

      const res = await getMutation<ProjectsResponse>(url);

      if ("error" in res) {
        setErrorMsg(res.message || "Failed to load projects.");
        setProjects([]);
      } else if (res.success && Array.isArray(res.data)) {
        setProjects(res.data);
      } else {
        setErrorMsg("Failed to load projects.");
        setProjects([]);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when search query or building type changes (with transition for smooth state updates)
  useEffect(() => {
    const handler = setTimeout(() => {
      startTransition(() => {
        fetchProjects(search, buildingType);
        setCurrentPage(1); // Reset page on filter change
      });
    }, 300); // 300ms debounce for typing search

    return () => clearTimeout(handler);
  }, [search, buildingType]);

  // Pagination calculation
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const displayedProjects = projects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Get badge color based on building type
  const getBadgeStyle = (type: string) => {
    switch (type.toLowerCase()) {
      case "commercial":
        return "bg-sky-500/10 text-sky-400 border-sky-500/20";
      case "residential":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "industrial":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header Section */}
        <div className="text-center space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#10B981] via-[#34D399] to-[#38BDF8] bg-clip-text text-transparent"
          >
            Explore Estimates & Projects
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto"
          >
            Discover real-time cost estimations, material requirements, and detailed construction insights for various building designs.
          </motion.p>
        </div>

        {/* Search & Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 p-5 rounded-2xl bg-[#0F172A]/50 border border-slate-800 backdrop-blur-xl shadow-xl"
        >
          {/* Search Field */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search projects by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0F172A] border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-[#F8FAFC] placeholder-slate-500 outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all duration-300 shadow-inner"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="w-full md:w-64">
            <select
              value={buildingType}
              onChange={(e) => setBuildingType(e.target.value)}
              className="w-full bg-[#0F172A] border border-slate-800 rounded-xl px-4 py-3 text-[#F8FAFC] outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all duration-300 cursor-pointer shadow-inner appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '1.25rem',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <option value="All">All Types</option>
              <option value="Commercial">Commercial</option>
              <option value="Residential">Residential</option>
              <option value="Industrial">Industrial</option>
            </select>
          </div>
        </motion.div>

        {/* Main Grid & States */}
        {loading ? (
          /* Skeleton Loader Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-[#0F172A] border border-slate-800 rounded-2xl overflow-hidden h-[380px] animate-pulse flex flex-col justify-between p-4"
              >
                <div className="w-full h-48 bg-slate-800 rounded-xl mb-4" />
                <div className="space-y-3 flex-1">
                  <div className="h-6 bg-slate-800 rounded-md w-3/4" />
                  <div className="h-4 bg-slate-800 rounded-md w-1/2" />
                  <div className="h-4 bg-slate-800 rounded-md w-2/3" />
                </div>
                <div className="h-10 bg-slate-800 rounded-xl w-full mt-4" />
              </div>
            ))}
          </div>
        ) : errorMsg ? (
          <div className="text-center py-16 bg-[#0F172A]/30 border border-slate-800/50 rounded-2xl">
            <p className="text-red-400 text-lg mb-2">⚠️ {errorMsg}</p>
            <button
              onClick={() => fetchProjects(search, buildingType)}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-sm font-semibold rounded-xl transition-all"
            >
              Try Again
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 bg-[#0F172A]/30 border border-slate-800/50 rounded-2xl space-y-3">
            <svg className="mx-auto h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-slate-400 text-lg">No projects match your search criteria.</p>
          </div>
        ) : (
          /* Project Grid */
          <>
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {displayedProjects.map((project, idx) => (
                  <motion.div
                    key={project._id}
                    layoutId={project._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: (idx % 4) * 0.05 }}
                    whileHover={{ scale: 1.03 }}
                    className="group relative bg-[#0F172A] border border-slate-800/80 hover:border-emerald-500/30 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Entire Card acts as Link */}
                    <Link href={`/explore/${project._id}`} className="block flex-grow">
                      {/* Image section */}
                      <div className="relative aspect-video w-full overflow-hidden bg-slate-900 border-b border-slate-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={project.image}
                          alt={project.title}
                          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Type Tag */}
                        <span className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full border backdrop-blur-md ${getBadgeStyle(project.buildingType)}`}>
                          {project.buildingType}
                        </span>
                      </div>

                      {/* Card Info */}
                      <div className="p-5 space-y-4">
                        <div className="space-y-1.5">
                          <h3 className="font-bold text-lg text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1">
                            {project.title}
                          </h3>
                          <div className="flex items-center text-sm text-slate-400 gap-1.5">
                            {/* Location Icon */}
                            <svg className="h-4 w-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate">{project.location}</span>
                          </div>
                        </div>

                        {/* Additional stats */}
                        <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-800/60">
                          <span>Area: <strong className="text-slate-300">{project.area.toLocaleString()} sqft</strong></span>
                          <span>{new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </Link>

                    {/* View Details Button */}
                    <div className="px-5 pb-5 pt-0">
                      <Link
                        href={`/explore/${project._id}`}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-[#10B981] hover:text-[#020617] text-sm font-bold text-[#F8FAFC] transition-all duration-300 shadow-md group-hover:shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                      >
                        <span>View Details</span>
                        <svg className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>

                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-10">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center p-2.5 rounded-xl bg-[#0F172A] border border-slate-800 text-slate-400 hover:text-[#10B981] hover:border-[#10B981] disabled:opacity-50 disabled:hover:text-slate-400 disabled:hover:border-slate-800 disabled:cursor-not-allowed transition-all duration-200"
                  aria-label="Previous Page"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const isCurrent = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`min-w-[40px] h-10 px-3 flex items-center justify-center rounded-xl border font-semibold text-sm transition-all duration-200 ${
                        isCurrent
                          ? "bg-[#10B981] border-[#10B981] text-[#020617] shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                          : "bg-[#0F172A] border-slate-800 text-slate-400 hover:text-[#10B981] hover:border-[#10B981]"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center p-2.5 rounded-xl bg-[#0F172A] border border-slate-800 text-slate-400 hover:text-[#10B981] hover:border-[#10B981] disabled:opacity-50 disabled:hover:text-slate-400 disabled:hover:border-slate-800 disabled:cursor-not-allowed transition-all duration-200"
                  aria-label="Next Page"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}