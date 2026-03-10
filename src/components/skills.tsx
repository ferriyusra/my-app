"use client";

import { useState } from "react";

type Category = "All" | "Frontend" | "Backend" | "Database" | "Tools" | "AI Tools";

const categories: Category[] = ["All", "Frontend", "Backend", "Database", "Tools", "AI Tools"];

const skills = [
  // Frontend
  { name: "JavaScript", category: "Frontend" as Category, color: "#eab308", bg: "#fef9c318", icon: "https://cdn.simpleicons.org/javascript/eab308", description: "ES2022+, async/await, DOM manipulation" },
  { name: "TypeScript", category: "Frontend" as Category, color: "#3178C6", bg: "#3178C618", icon: "https://cdn.simpleicons.org/typescript/3178C6", description: "Strict typing, generics, utility types" },
  { name: "React", category: "Frontend" as Category, color: "#0ea5e9", bg: "#0ea5e918", icon: "https://cdn.simpleicons.org/react/0ea5e9", description: "Hooks, context, performance patterns" },
  { name: "Next.js", category: "Frontend" as Category, color: "#a1a1aa", bg: "#a1a1aa10", icon: "https://cdn.simpleicons.org/nextdotjs/a1a1aa", description: "App Router, SSR, ISR, Edge runtime" },
  { name: "TailwindCSS", category: "Frontend" as Category, color: "#06B6D4", bg: "#06B6D418", icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4", description: "Utility-first, responsive, dark mode" },
  // Backend
  { name: "Node.js", category: "Backend" as Category, color: "#16a34a", bg: "#16a34a18", icon: "https://cdn.simpleicons.org/nodedotjs/16a34a", description: "Event loop, streams, REST & WebSocket APIs" },
  { name: "Express.js", category: "Backend" as Category, color: "#a1a1aa", bg: "#a1a1aa10", icon: "https://cdn.simpleicons.org/express/a1a1aa", description: "Middleware, routing, REST API patterns" },
  { name: "NestJS", category: "Backend" as Category, color: "#E0234E", bg: "#E0234E18", icon: "https://cdn.simpleicons.org/nestjs/E0234E", description: "Decorators, DI, modules, microservices" },
  { name: "Golang", category: "Backend" as Category, color: "#00ADD8", bg: "#00ADD818", icon: "https://cdn.simpleicons.org/go/00ADD8", description: "Goroutines, channels, high-performance APIs" },
  // Database
  { name: "PostgreSQL", category: "Database" as Category, color: "#4169E1", bg: "#4169E118", icon: "https://cdn.simpleicons.org/postgresql/4169E1", description: "ACID, indexes, JSON, full-text search" },
  { name: "MySQL", category: "Database" as Category, color: "#4479A1", bg: "#4479A118", icon: "https://cdn.simpleicons.org/mysql/4479A1", description: "Relational, query optimization, replication" },
  { name: "MongoDB", category: "Database" as Category, color: "#47A248", bg: "#47A24818", icon: "https://cdn.simpleicons.org/mongodb/47A248", description: "Documents, aggregation pipeline, Atlas" },
  { name: "Redis", category: "Database" as Category, color: "#DC382D", bg: "#DC382D18", icon: "https://cdn.simpleicons.org/redis/DC382D", description: "Caching, pub/sub, sessions, queues" },
  // Tools
  { name: "Docker", category: "Tools" as Category, color: "#2496ED", bg: "#2496ED18", icon: "https://cdn.simpleicons.org/docker/2496ED", description: "Containers, compose, multi-stage builds" },
  { name: "Git", category: "Tools" as Category, color: "#F05032", bg: "#F0503218", icon: "https://cdn.simpleicons.org/git/F05032", description: "Branching strategies, CI/CD workflows" },
  { name: "AWS", category: "Tools" as Category, color: "#FF9900", bg: "#FF990018", icon: "https://cdn.simpleicons.org/amazonaws/FF9900", description: "EC2, S3, Lambda, RDS, CloudFront" },
  { name: "GCP", category: "Tools" as Category, color: "#4285F4", bg: "#4285F418", icon: "https://cdn.simpleicons.org/googlecloud/4285F4", description: "Cloud Run, GKE, BigQuery, Cloud Storage" },
  { name: "Google Pub/Sub", category: "Tools" as Category, color: "#FBBC04", bg: "#FBBC0418", icon: "https://cdn.simpleicons.org/googlepubsub/FBBC04", description: "Async messaging, event streaming, decoupling" },
  // AI Tools
  { name: "Claude", category: "AI Tools" as Category, color: "#D97706", bg: "#D9770618", icon: "https://cdn.simpleicons.org/anthropic/D97706", description: "Claude Code, API integration, agentic workflows" },
  { name: "ChatGPT", category: "AI Tools" as Category, color: "#10a37f", bg: "#10a37f18", icon: "https://cdn.simpleicons.org/openai/10a37f", description: "GPT-4o, function calling, prompt engineering" },
  { name: "GitHub Copilot", category: "AI Tools" as Category, color: "#a1a1aa", bg: "#a1a1aa10", icon: "https://cdn.simpleicons.org/githubcopilot/a1a1aa", description: "AI pair programming, code completion, chat" },
  { name: "Cursor", category: "AI Tools" as Category, color: "#7c3aed", bg: "#7c3aed18", icon: "https://cdn.simpleicons.org/cursor/7c3aed", description: "AI-native editor, codebase context, agent mode" },
  { name: "Hugging Face", category: "AI Tools" as Category, color: "#FFD21E", bg: "#FFD21E18", icon: "https://cdn.simpleicons.org/huggingface/FFD21E", description: "Open-source models, Spaces, Inference API" },
  { name: "LangChain", category: "AI Tools" as Category, color: "#a1a1aa", bg: "#a1a1aa10", icon: "https://cdn.simpleicons.org/langchain/a1a1aa", description: "LLM chains, agents, RAG pipelines" },
];

export default function Skills() {
  const [active, setActive] = useState<Category>("All");
  const filtered = active === "All" ? skills : skills.filter((s) => s.category === active);

  return (
    <section id="skills" style={{ background: "#09090b", padding: "80px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#7c3aed", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>
          // 02. skills
        </div>
        <h2 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, marginBottom: 12, fontFamily: "'Inter', sans-serif", color: "#fafafa", letterSpacing: "-0.02em" }}>
          Tech{" "}
          <span style={{ background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Stack
          </span>
        </h2>
        <p style={{ color: "#a1a1aa", fontSize: 16, marginBottom: 48, maxWidth: 480, lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>
          Tools and technologies I use to ship production-grade software.
        </p>

        {/* Category filter tabs */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 48, padding: "6px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, width: "fit-content" }}>
          {categories.map((cat) => {
            const isActive = active === cat;
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                style={{
                  padding: "8px 20px", borderRadius: 10, border: "none", cursor: "pointer",
                  fontSize: 13, fontWeight: 600, fontFamily: "'Inter', sans-serif",
                  transition: "all 0.2s ease",
                  background: isActive ? "linear-gradient(135deg, #10b981, #3b82f6)" : "transparent",
                  color: isActive ? "#ffffff" : "#71717a",
                  boxShadow: isActive ? "0 4px 15px rgba(16,185,129,0.25)" : "none",
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = "#fafafa"; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = "#71717a"; }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Skills grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
          {filtered.map((skill) => (
            <div
              key={skill.name}
              style={{
                padding: "28px 20px 24px",
                background: "#111113",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16,
                boxShadow: "0 0 0 1px rgba(255,255,255,0.05)",
                display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 14,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 0 0 1px rgba(255,255,255,0.05)";
              }}
            >
              {/* Icon */}
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: "#18181b",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={skill.icon} alt={skill.name} width={28} height={28} />
              </div>

              {/* Name */}
              <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "'Inter', sans-serif", color: "#fafafa" }}>
                {skill.name}
              </div>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div style={{
          marginTop: 56,
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 1,
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16, overflow: "hidden",
        }}>
          {[
            { label: "Frontend", count: skills.filter(s => s.category === "Frontend").length, color: "#10b981" },
            { label: "Backend", count: skills.filter(s => s.category === "Backend").length, color: "#7c3aed" },
            { label: "Database", count: skills.filter(s => s.category === "Database").length, color: "#3b82f6" },
            { label: "Tools", count: skills.filter(s => s.category === "Tools").length, color: "#f59e0b" },
            { label: "AI Tools", count: skills.filter(s => s.category === "AI Tools").length, color: "#D97706" },
          ].map(({ label, count, color }, i) => (
            <div key={label} style={{
              padding: "20px 24px", background: "#111113",
              display: "flex", flexDirection: "column", gap: 4,
              borderRight: i < 4 ? "1px solid rgba(255,255,255,0.07)" : "none",
            }}>
              <div style={{
                fontSize: 28, fontWeight: 800, fontFamily: "'Inter', sans-serif",
                background: `linear-gradient(135deg, ${color}, ${color}99)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                {count}
              </div>
              <div style={{ fontSize: 12, color: "#52525b", fontFamily: "'JetBrains Mono', monospace" }}>
                {label.toLowerCase()} tools
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
