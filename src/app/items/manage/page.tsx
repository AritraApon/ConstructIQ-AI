"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { authClient } from "@/lib/auth-client";
import { deleteProject, getProjects } from '@/lib/core/server';


interface Project {
  _id: string;
  title: string;
  buildingType: string;
  area: number | string;
  location: string;
  image: string;
  userId: string;
}

export default function ManageProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --------------------------------------------------------
  // ফ্রন্টএন্ড সার্চ, ফিল্টার এবং পেজিনেশন স্টেট
  // --------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // প্রতি পেজে ৫টি করে আইটেম দেখাবে

  const { data: session, isPending: isAuthPending } = authClient.useSession();

  useEffect(() => {
    if (!isAuthPending && session?.user) {
      fetchProjects();
    } else if (!isAuthPending && !session?.user) {
      setIsLoading(false);
    }
  }, [session, isAuthPending]);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await getProjects();
      if (response && response.success && Array.isArray(response.data)) {
        const myProjects = response.data.filter(
          (project: Project) => project.userId === session?.user?.id
        );
        setProjects(myProjects);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error("Failed to fetch projects", error);
      showToast("Error loading projects.");
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const confirmDelete = (id: string) => {
    setProjectToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    try {
      const success = await deleteProject(projectToDelete);
      if (success) {
        setProjects(projects.filter(p => p._id !== projectToDelete));
        showToast("Project permanently deleted.");
      } else {
        showToast("Failed to delete project.");
      }
    } catch (error) {
      console.error("Delete error", error);
      showToast("Error deleting project.");
    } finally {
      setDeleteModalOpen(false);
      setProjectToDelete(null);
    }
  };

  // --------------------------------------------------------
  // ফ্রন্টএন্ড ফিল্টারিং ও সার্চ লজিক (Pure Client Side)
  // --------------------------------------------------------
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === "All" || project.buildingType === selectedType;

    return matchesSearch && matchesType;
  });

  // সার্চ বা ফিল্টার চেঞ্জ হলে পেজিনেশন আবার ১ নম্বর পেজে চলে যাবে
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedType]);

  // পেজিনেশন ক্যালকুলেশন
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  // Icons Component
  const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
  );
  const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
  );
  const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
  );

  if (!isAuthPending && !session?.user) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col items-center justify-center p-6">
        <p className="text-rose-400 mb-4">Please log in to manage your construction projects.</p>
        <Link href="/login" className="bg-[#10B981] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#059669] transition">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-12 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-800 border border-slate-700 text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center space-x-3">
          <div className="h-2 w-2 bg-[#10B981] rounded-full"></div>
          <p className="font-medium">{toastMessage}</p>
        </div>
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Manage Projects</h1>
          <p className="text-slate-400 mt-1">View, edit, and organize your construction projects.</p>
        </div>
        <Link href="/items/add" className="inline-flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <PlusIcon />
          <span>Create New Project</span>
        </Link>
      </div>

      {/* --------------------------------------------------------
          সার্চ এবং ফিল্টার বার (UI controls)
         -------------------------------------------------------- */}
      <div className="max-w-7xl mx-auto mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* সার্চ ইনপুট */}
        <div className="sm:col-span-2 relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </span>
          <input
            type="text"
            placeholder="Search by project name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0F172A] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#10B981] transition-colors"
          />
        </div>

        {/* টাইপ ফিল্টার ড্রপডাউন */}
        <div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full bg-[#0F172A] border border-slate-800 rounded-xl px-4 py-2.5 text-slate-300 focus:outline-none focus:border-[#10B981] transition-colors"
          >
            <option value="All">All Building Types</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Industrial">Industrial</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 text-slate-400 text-sm uppercase tracking-wider border-b border-slate-800">
                  <th className="px-6 py-4 font-medium">Project</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Area (Sqft)</th>
                  <th className="px-6 py-4 font-medium">Location</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {isLoading || isAuthPending ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-8 h-8 border-2 border-t-[#10B981] border-r-[#10B981] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                        <p>Loading your projects...</p>
                      </div>
                    </td>
                  </tr>
                ) : currentItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      <p>No projects match your search criteria.</p>
                    </td>
                  </tr>
                ) : (
                  currentItems.map((project) => (
                    <tr key={project._id} className="hover:bg-slate-800/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-slate-700 group-hover:border-slate-500 transition-colors">
                            <img
                              src={project.image || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600"}
                              alt={project.title}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <span className="font-semibold text-slate-200">{project.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300">
                          {project.buildingType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-medium">{project.area}</td>
                      <td className="px-6 py-4 text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                          {project.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/explore/${project._id}`}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
                            title="View Details"
                          >
                            <EyeIcon />
                          </Link>
                          <button
                            onClick={() => confirmDelete(project._id)}
                            className="p-2 text-rose-400 hover:text-rose-100 hover:bg-rose-900/30 rounded-md transition-colors cursor-pointer"
                            title="Delete Project"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* --------------------------------------------------------
              ফ্রন্টএন্ড পেজিনেশন কন্ট্রোল (UI Footer)
             -------------------------------------------------------- */}
          {!isLoading && filteredProjects.length > 0 && (
            <div className="bg-slate-900/30 px-6 py-4 border-t border-slate-800 flex items-center justify-between text-sm">
              <div className="text-slate-400">
                Showing <span className="text-slate-200 font-medium">{indexOfFirstItem + 1}</span> to{" "}
                <span className="text-slate-200 font-medium">
                  {indexOfLastItem > filteredProjects.length ? filteredProjects.length : indexOfLastItem}
                </span>{" "}
                of <span className="text-slate-200 font-medium">{filteredProjects.length}</span> projects
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg border transition-all ${
                        currentPage === page
                          ? "bg-[#10B981] border-[#10B981] text-white font-medium"
                          : "border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020617]/80 backdrop-blur-sm">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mb-5 border border-rose-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Delete Project?</h3>
            <p className="text-slate-400 mb-6">
              Are you sure you want to delete this project? This action cannot be undone and will permanently remove all data.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white transition-colors shadow-[0_0_15px_rgba(244,63,94,0.3)] font-medium cursor-pointer"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}