"use client";
import { useState } from "react";
import { Mail, Github, Linkedin, Twitter, Send, CheckCircle } from "lucide-react";

const socials = [
  { label: "Email", value: "ferri@example.com", href: "mailto:ferri@example.com", icon: Mail, color: "#10b981" },
  { label: "GitHub", value: "github.com/ferriyusra", href: "https://github.com/ferriyusra", icon: Github, color: "#a1a1aa" },
  { label: "LinkedIn", value: "linkedin.com/in/ferriyusra", href: "https://linkedin.com/in/ferriyusra", icon: Linkedin, color: "#3b82f6" },
  { label: "Twitter", value: "@ferriyusra_dev", href: "https://twitter.com/ferriyusra_dev", icon: Twitter, color: "#0ea5e9" },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name: "", email: "", message: "" });
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 16px",
    background: "rgba(255,255,255,0.04)",
    border: "1.5px solid rgba(255,255,255,0.08)",
    borderRadius: 8, color: "#fafafa", fontSize: 14,
    fontFamily: "'Inter', sans-serif", outline: "none",
    transition: "border-color 0.2s ease",
  };

  return (
    <section id="contact" style={{ background: "#0f0f11" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#f97316", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>
          // 05. contact
        </div>
        <h2 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, marginBottom: 16, fontFamily: "'Inter', sans-serif", color: "#fafafa", letterSpacing: "-0.02em" }}>
          Let&apos;s{" "}
          <span style={{ background: "linear-gradient(135deg, #10b981, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Connect
          </span>
        </h2>
        <p style={{ color: "#a1a1aa", fontSize: 16, marginBottom: 48, maxWidth: 500, lineHeight: 1.7, fontFamily: "'Inter', sans-serif" }}>
          I&apos;m currently open to new opportunities. Whether you have a project, a question, or just want to say hi — my inbox is open.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
          {/* Contact form card */}
          <div style={{
            background: "#111113",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 16, padding: 32,
            boxShadow: "0 0 0 1px rgba(255,255,255,0.05)",
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, fontFamily: "'Inter', sans-serif", color: "#fafafa" }}>Send a message</h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, color: "#52525b", display: "block", marginBottom: 6, fontFamily: "'JetBrains Mono', monospace" }}>name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your Name"
                  required
                  style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#10b981"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, color: "#52525b", display: "block", marginBottom: 6, fontFamily: "'JetBrains Mono', monospace" }}>email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                  style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#10b981"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, color: "#52525b", display: "block", marginBottom: 6, fontFamily: "'JetBrains Mono', monospace" }}>message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell me about your project..."
                  rows={5}
                  required
                  style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#10b981"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                />
              </div>
              <button
                type="submit"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "14px 24px",
                  background: sent ? "rgba(16,185,129,0.12)" : "#10b981",
                  border: sent ? "1px solid rgba(16,185,129,0.3)" : "none",
                  borderRadius: 8,
                  color: sent ? "#10b981" : "white",
                  fontSize: 15, fontWeight: 700, cursor: "pointer",
                  fontFamily: "'Inter', sans-serif", transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => { if (!sent) e.currentTarget.style.background = "#059669"; }}
                onMouseLeave={(e) => { if (!sent) e.currentTarget.style.background = "#10b981"; }}
              >
                {sent ? <><CheckCircle size={16} /> Message Sent!</> : <><Send size={16} /> Send Message</>}
              </button>
            </form>
          </div>

          {/* Social links */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {socials.map(({ label, value, href, icon: Icon, color }) => (
              <a key={label} href={href}
                style={{
                  padding: "20px 24px", display: "flex", alignItems: "center", gap: 16,
                  textDecoration: "none",
                  background: "#111113",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 16,
                  borderLeft: `3px solid ${color}`,
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.05)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
                  e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.boxShadow = "0 0 0 1px rgba(255,255,255,0.05)";
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: `${color}15`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color, flexShrink: 0,
                }}>
                  <Icon size={18} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#52525b", fontFamily: "'JetBrains Mono', monospace", marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 14, color: "#fafafa", fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>{value}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
