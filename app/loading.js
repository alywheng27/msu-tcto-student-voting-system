"use client";

export default function Loading() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "#fff", padding: "40px 32px", borderRadius: 16, boxShadow: "0 8px 32px rgba(60,72,100,0.10)", maxWidth: 340, width: "100%" }}>
        <div style={{ marginBottom: 24 }}>
          <span style={{ display: "inline-block", width: 48, height: 48 }}>
            <svg style={{ animation: "spin 1s linear infinite" }} width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="20" stroke="#2563eb" strokeWidth="4" opacity="0.15" />
              <path d="M44 24c0-11.046-8.954-20-20-20" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </span>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>Loading...</h2>
        <p style={{ color: "#64748b", fontSize: 15 }}>Please wait while we prepare your experience.</p>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
