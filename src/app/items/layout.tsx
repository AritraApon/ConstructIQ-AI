import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function ItemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const session = await auth.api.getSession({
    headers: await import("next/headers").then((h) => h.headers()),
  });


  if (!session) {
    redirect("/login?callbackUrl=/items/add");
    // অথবা তুমি চাইলে redirect("/unauthorized") দিতে পারো
  }

  // ৩. ইউজার লগইন করা থাকলে পেজ দেখতে পারবে
  return <>{children}</>;
}