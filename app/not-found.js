"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)" }}>
      <div style={{ background: "#fff", padding: "48px 32px", borderRadius: 16, boxShadow: "0 8px 32px rgba(60,72,100,0.12)", maxWidth: 400, width: "100%", textAlign: "center" }}>
        <svg width="48" height="48" fill="none" viewBox="0 0 24 24" style={{ marginBottom: 24 }}>
          <circle cx="12" cy="12" r="12" fill="#60a5fa" fillOpacity="0.15" />
          <path d="M9.172 9.172a4 4 0 015.656 5.656m-5.656 0a4 4 0 015.656-5.656" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1e293b", marginBottom: 12 }}>404 - Page Not Found</h1>
        <p style={{ color: "#64748b", fontSize: 16, marginBottom: 28 }}>The page you are looking for does not exist or has been moved.</p>
        <Link href="/">
          <button style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "12px 32px", fontSize: 16, fontWeight: 600, cursor: "pointer", boxShadow: "0 2px 8px rgba(37,99,235,0.08)" }}>
            Go to Homepage
          </button>
        </Link>
      </div>
    </div>
  );
}
