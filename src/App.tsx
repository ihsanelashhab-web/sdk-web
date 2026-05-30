import { useState } from "react";
import Landing from "./Landing";

interface SDKResult {
  title: string;
  version: string;
  endpoints: number;
  files: Record<string, string>;
}

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  if (showLanding) return <Landing onStart={() => setShowLanding(false)} />;
  const [file, setFile] = useState<File | null>(null);
  const [langs, setLangs] = useState<string[]>(["typescript"]);
  const [retries, setRetries] = useState(true);
  const [pagination, setPagination] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<SDKResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<{name: string, content: string} | null>(null);

  const allLangs = [
    { id: "typescript", label: "TypeScript", short: "TS" },
    { id: "python", label: "Python", short: "PY" },
    { id: "dart", label: "Dart", short: "DT" },
    { id: "go", label: "Go", short: "GO" },
    { id: "java", label: "Java", short: "JV" },
  ];

  const toggleLang = (id: string) => {
    setLangs(prev =>
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (!file) return alert("Please upload an OpenAPI file first!");
    if (langs.length === 0) return alert("Please select at least one language!");

    setGenerating(true);
    setResult(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("langs", JSON.stringify(langs));

      const res = await fetch("https://api-to-sdk-production.up.railway.app/generate", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Generation failed");

      setResult(data);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      if (error.message === "Failed to fetch") {
        setError("Cannot connect to server. Please check your internet connection and try again.");
      } else if (error.message.includes("Generation failed")) {
        setError("SDK generation failed. Make sure your OpenAPI file is valid (JSON or YAML).");
      } else {
        setError(error.message || "An unexpected error occurred. Please try again.");
      }
    } finally {
      setGenerating(false);
    }
  };

  const downloadFile = (filename: string, content: string) => {
    const mime = filename.endsWith(".ts") ? "text/plain" : "text/plain";
    const blob = new Blob([content], { type: mime });
    const safeFilename = filename.replace(/\//g, "_") + ".txt";
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = safeFilename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a", color: "#fff",
      fontFamily: "'Inter', sans-serif", padding: "0"
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #1f1f1f", padding: "16px 32px",
        display: "flex", alignItems: "center", gap: "10px"
      }}>
        <span style={{ color: "#22c55e", fontSize: "20px" }}>&lt;/&gt;</span>
        <span style={{ fontWeight: 700, fontSize: "18px" }}>SDKCraft</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px" }}>
  
<a
    href="https://github.com/ihsanelashhab-web/api-to-sdk/issues/new"
    target="_blank"
    rel="noreferrer"
    style={{
      background: "#1a1a1a",
      color: "#aaa",
      padding: "6px 14px",
      borderRadius: "8px",
      fontSize: "13px",
      textDecoration: "none",
      border: "1px solid #333",
      display: "flex",
      alignItems: "center",
      gap: "6px"
    }}
  >
    <span>🐛</span> Report a Bug
  </a>
  <span style={{
    background: "#16a34a22", color: "#22c55e",
    padding: "4px 12px", borderRadius: "999px", fontSize: "13px"
  }}>● System Online</span>
</div>
      </div>

      {/* Main */}
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontSize: "40px", fontWeight: 800, textAlign: "center", marginBottom: "8px" }}>
          SDKCraft — AI-Ready SDK Generation
        </h1>
        <p style={{ textAlign: "center", color: "#888", marginBottom: "48px" }}>
          Transform your OpenAPI specifications into production-ready SDKs with a single click.
        </p>

        {/* Upload */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ color: "#aaa", marginBottom: "12px", fontSize: "14px" }}>
            📄 OpenAPI Specification
          </div>
          <label style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", border: "2px dashed #333", borderRadius: "12px",
            padding: "48px", cursor: "pointer", background: file ? "#0f1f0f" : "#111",
            transition: "all 0.2s"
          }}>
            <input type="file" accept=".json,.yaml,.yml" style={{ display: "none" }}
              onChange={e => { setFile(e.target.files?.[0] || null); setResult(null); }} />
            <span style={{ fontSize: "32px", marginBottom: "12px" }}>⬆️</span>
            <span style={{ fontWeight: 600 }}>
              {file ? `✅ ${file.name}` : "Drop your OpenAPI file here"}
            </span>
            <span style={{ color: "#666", fontSize: "13px", marginTop: "4px" }}>
              Supports JSON and YAML formats
            </span>
          </label>
        </div>

        {/* Languages + Config */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
          <div style={{ background: "#111", border: "1px solid #222", borderRadius: "12px", padding: "20px" }}>
            <div style={{ fontWeight: 600, marginBottom: "16px" }}>⌨️ Target Languages</div>
            {allLangs.map(lang => (
              <div key={lang.id} onClick={() => toggleLang(lang.id)} style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "10px", borderRadius: "8px", cursor: "pointer",
                background: langs.includes(lang.id) ? "#0f1f0f" : "transparent",
                marginBottom: "6px", transition: "all 0.2s"
              }}>
                <span style={{
                  width: "28px", height: "28px", borderRadius: "6px",
                  background: "#1a1a1a", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "11px", color: "#22c55e", fontWeight: 700
                }}>{lang.short}</span>
                <span>{lang.label}</span>
                {langs.includes(lang.id) && <span style={{ marginLeft: "auto", color: "#22c55e" }}>✓</span>}
              </div>
            ))}
          </div>

          <div style={{ background: "#111", border: "1px solid #222", borderRadius: "12px", padding: "20px" }}>
            <div style={{ fontWeight: 600, marginBottom: "16px" }}>⚡ Configuration</div>
            {[
              { label: "Enable Auto-Retries", desc: "Automatic retry on network failures", val: retries, set: setRetries },
              { label: "Include Pagination", desc: "Built-in helpers for paginated endpoints", val: pagination, set: setPagination },
            ].map(item => (
              <div key={item.label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "14px 0", borderBottom: "1px solid #1f1f1f"
              }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: "14px" }}>{item.label}</div>
                  <div style={{ color: "#666", fontSize: "12px" }}>{item.desc}</div>
                </div>
                <div onClick={() => item.set(!item.val)} style={{
                  width: "44px", height: "24px", borderRadius: "999px",
                  background: item.val ? "#22c55e" : "#333", cursor: "pointer",
                  position: "relative", transition: "all 0.2s"
                }}>
                  <div style={{
                    position: "absolute", top: "3px",
                    left: item.val ? "22px" : "3px",
                    width: "18px", height: "18px", borderRadius: "50%",
                    background: "#fff", transition: "all 0.2s"
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button onClick={handleGenerate} disabled={generating} style={{
          width: "100%", padding: "16px", borderRadius: "12px", border: "none",
          background: generating ? "#1a1a1a" : "#22c55e", color: generating ? "#666" : "#000",
          fontWeight: 700, fontSize: "16px", cursor: generating ? "not-allowed" : "pointer",
          transition: "all 0.2s"
        }}>
          {generating ? "⚡ Generating..." : result ? "⚡ Generate Again" : "⚡ Generate SDK"}
        </button>

        {/* Error */}
        {error && (
          <div style={{
            marginTop: "16px", background: "#1f0f0f", border: "1px solid #ef444433",
            borderRadius: "12px", padding: "20px", textAlign: "center", color: "#ef4444"
          }}>
            ❌ {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={{
            marginTop: "16px", background: "#0f1f0f", border: "1px solid #22c55e33",
            borderRadius: "12px", padding: "20px"
          }}>
            <div style={{ color: "#22c55e", fontWeight: 700, fontSize: "18px", marginBottom: "8px" }}>
              ✅ SDK Generated Successfully!
            </div>
            <div style={{ color: "#888", marginBottom: "16px" }}>
              {result.title} v{result.version} • {result.endpoints} endpoints
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
              {Object.entries(result.files).map(([filename, content]) => (
                <div key={filename} style={{ display: "flex" }}>
                  <button onClick={() => setPreviewFile(previewFile?.name === filename ? null : {name: filename, content: content as string})} style={{
                    padding: "8px 12px", borderRadius: "8px 0 0 8px", border: "1px solid #22c55e44",
                    background: previewFile?.name === filename ? "#22c55e22" : "#111",
                    color: "#22c55e", cursor: "pointer", fontSize: "13px"
                  }}>👁️ {filename}</button>
                  <button onClick={() => downloadFile(filename, content as string)} style={{
                    padding: "8px 12px", borderRadius: "0 8px 8px 0", border: "1px solid #22c55e44",
                    borderLeft: "none", background: "#111", color: "#22c55e", cursor: "pointer", fontSize: "13px"
                  }}>⬇️</button>
                </div>
              ))}
            </div>
            {previewFile && (
              <div style={{ marginTop: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ color: "#888", fontSize: "13px" }}>📄 {previewFile.name}</span>
                  <button onClick={() => setPreviewFile(null)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: "18px" }}>✕</button>
                </div>
                <pre style={{
                  background: "#0a0a0a", border: "1px solid #1f1f1f", borderRadius: "8px",
                  padding: "16px", overflowX: "auto", fontSize: "12px", color: "#ccc",
                  maxHeight: "400px", overflowY: "auto", textAlign: "left", whiteSpace: "pre-wrap"
                }}>{previewFile.content.slice(0, 3000)}{previewFile.content.length > 3000 ? "\n\n... (truncated, download to see full file)" : ""}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}