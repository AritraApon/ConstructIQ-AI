'use server';

import { cookies } from "next/headers";

/**
 * Better Auth সেশন টোকেন কুকি থেকে রিড করে হেডার অবজেক্ট তৈরি করে।
 * এটি সরাসরি ব্যাকএন্ডের Authorization হেডার হিসেবে পাস হবে।
 */
export const authHeader = async (): Promise<HeadersInit> => {
  const cookieStore = await cookies();
  // Better Auth-এর ডিফল্ট সেশন কুকি নাম
  const token = cookieStore.get("better-auth.session_token")?.value;

  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ব্যাকএন্ডের বেস ইউআরএল (ডিফল্ট: http://localhost:5000)
const getBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
};

/**
 * ১. GET Mutation (ডাটা রিড করার জন্য)
 */
export const getMutation = async <T>(url: string): Promise<T | { error: true; message: string }> => {
  const baseUrl = getBaseUrl();

  try {
    const authHeadersObj = await authHeader();

    const res = await fetch(`${baseUrl}${url}`, {
      method: "GET",
      cache: "no-store",
      headers: {
        ...authHeadersObj,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! Status: ${res.status}`);
    }

    return await res.json() as T;
  } catch (error: any) {
    console.error("GET Error:", error);
    return { error: true, message: error.message || "Server connection failed!" };
  }
};

/**
 * ২. POST Mutation (নতুন ডাটা ক্রিয়েট/অ্যাড করার জন্য)
 */
export const postMutation = async <T, D>(url: string, data: D): Promise<T | { error: true; message: string }> => {
  const baseUrl = getBaseUrl();

  try {
    const authHeadersObj = await authHeader();

    const res = await fetch(`${baseUrl}${url}`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...authHeadersObj,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! Status: ${res.status}`);
    }

    return await res.json() as T;
  } catch (error: any) {
    console.error("POST Error:", error);
    return { error: true, message: error.message || "Server connection failed!" };
  }
};

/**
 * ৩. PATCH Mutation (ডাটা আপডেট করার জন্য)
 */
export const patchMutation = async <T, D>(url: string, data: D): Promise<T | { error: true; message: string }> => {
  const baseUrl = getBaseUrl();

  try {
    const authHeadersObj = await authHeader();

    const res = await fetch(`${baseUrl}${url}`, {
      method: "PATCH",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...authHeadersObj,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! Status: ${res.status}`);
    }

    return await res.json() as T;
  } catch (error: any) {
    console.error("PATCH Error:", error);
    return { error: true, message: error.message || "Server connection failed!" };
  }
};

/**
 * ৪. DELETE Mutation (ডাটা ডিলিট করার জন্য)
 */
export const deleteMutation = async <T>(url: string): Promise<T | { error: true; message: string }> => {
  const baseUrl = getBaseUrl();

  try {
    const authHeadersObj = await authHeader();

    const res = await fetch(`${baseUrl}${url}`, {
      method: "DELETE",
      cache: "no-store",
      headers: {
        ...authHeadersObj,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! Status: ${res.status}`);
    }

    return await res.json() as T;
  } catch (error: any) {
    console.error("DELETE Error:", error);
    return { error: true, message: error.message || "Server connection failed!" };
  }
};



export const getProjects = async (): Promise<any> => {

  const res = await getMutation<any>('/api/projects');
  if (res && 'error' in res) {
    throw new Error(res.message);
  }
  return res; // এটি পুরো অবজেক্ট { success: true, data: [...] } রিটার্ন করবে
};

export const deleteProject = async (id: string): Promise<boolean> => {

  const res = await deleteMutation<any>(`/api/projects/${id}`);
  if (res && 'error' in res) {
    return false;
  }
  return res?.success === true;
};