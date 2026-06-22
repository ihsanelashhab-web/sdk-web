import { useEffect, useState } from "react";
import JSZip from "jszip";
import Prism from "prismjs";
import ReactMarkdown from "react-markdown";
import "prismjs/components/prism-dart";
import "prismjs/components/prism-go";
import "prismjs/components/prism-java";
import "prismjs/components/prism-python";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-swift";
import "prismjs/themes/prism-tomorrow.css";
import Landing from "./Landing";
import Pricing from "./Pricing";
import { supabase } from "./supabase";
import { saveSDKHistory, getSDKHistory, deleteSDKHistory, checkAndRegisterProject } from "./lib/sdkHistory";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://api-to-sdk-production.up.railway.app";

interface SDKResult {
  title: string;
  version: string;
  endpoints: number;
  files: Record<string, string>;
}

interface HistoryItem extends SDKResult {
  id: string;
  created_at: string;
  languages?: string[];
}

const allLangs = [
  { id: "typescript", label: "TypeScript", short: "TS" },
  { id: "python", label: "Python", short: "PY" },
  { id: "dart", label: "Dart", short: "DT" },
  { id: "go", label: "Go", short: "GO" },
  { id: "java", label: "Java", short: "JV" },
  { id: "kotlin", label: "Kotlin", short: "KT" },
  { id: "csharp", label: "C#", short: "C#" },
  { id: "swift", label: "Swift", short: "SW" },
];

function getRedirectUrl() {
  return window.location.origin;
}

async function readJsonResponse(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || "Request failed");
  }
  return data;
}

function getLanguage(filename: string) {
  if (filename.endsWith(".py")) return "python";
  if (filename.endsWith(".go")) return "go";
  if (filename.endsWith(".java")) return "java";
  if (filename.endsWith(".dart")) return "dart";
  if (filename.endsWith(".cs")) return "csharp";
  if (filename.endsWith(".swift")) return "swift";
  return "typescript";
}

function sanitizeDownloadName(filename: string) {
  return filename.replace(/[\\/:*?"<>|]/g, "_");
}

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [showPricing, setShowPricing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [langs, setLangs] = useState<string[]>(["typescript"]);
  const [isPro, setIsPro] = useState<boolean>(false); // 💡 غيرها إلى true لتجربة شكل المشترك المدفوع
const [showPricingModal, setShowPricingModal] = useState<boolean>(false);
const [freeBatchAttempts, setFreeBatchAttempts] = useState<number>(0); // عداد محاولات الرفع الجماعي للمستخدم المجاني
  const [freeDocsAttempts, setFreeDocsAttempts] = useState<number>(0);
  const [freeDocsAttempts, setFreeDocsAttempts] = useState<number>(0);
const [freeDiffAttempts, setFreeDiffAttempts] = useState<number>(0); // 👈 أضف هذا السطر هنا فقط
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<SDKResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatingDocs, setGeneratingDocs] = useState(false);
  const [docsResult, setDocsResult] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<{ name: string; content: string } | null>(null);
  const [batchFiles, setBatchFiles] = useState<File[]>([]);
  const [batchResults, setBatchResults] = useState<any[]>([]);
  const [generatingBatch, setGeneratingBatch] = useState(false);
  const [oldFile, setOldFile] = useState<File | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [changeReport, setChangeReport] = useState<any>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [detectingChanges, setDetectingChanges] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      getSDKHistory().then(setHistory).catch(console.error);
    } else {
      setHistory([]);
      setShowHistory(false);
    }
  }, [user]);

  const toggleLang = (id: string) => {
    setLangs((prev) => (prev.includes(id) ? prev.filter((lang) => lang !== id) : [...prev, id]));
  };

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: getRedirectUrl(),
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (showPricing) {
    return <Pricing onStart={() => { setShowPricing(false); setShowLanding(false); }} />;
  }

  if (showLanding) {
    return (
      <Landing
        onStart={() => setShowLanding(false)}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onPricing={() => setShowPricing(true)}
      />
    );
  }

  const downloadZip = async (files: Record<string, string>, title: string) => {
    const zip = new JSZip();

    Object.entries(files).forEach(([filename, content]) => {
      zip.file(filename, content);
    });

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.replace(/\s+/g, "-").toLowerCase()}-sdk.zip`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = sanitizeDownloadName(filename);
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileSelect = async (selectedFile: File | null) => {
    if (!selectedFile) {
      setFile(null);
      return;
    }

    const text = await selectedFile.text();
    let isValid = false;

    if (selectedFile.name.endsWith(".json")) {
      try {
        const parsed = JSON.parse(text);
        isValid = Boolean(parsed.openapi || parsed.swagger);
      } catch {
        isValid = false;
      }
    } else {
      isValid = text.includes("openapi:") || text.includes("swagger:");
    }

    if (!isValid) {
      setError("This file does not look like an OpenAPI spec. Use a JSON or YAML file with an openapi or swagger field.");
      setFile(null);
      return;
    }

    setError(null);
    setFile(selectedFile);
    setResult(null);
    setDocsResult(null);
    setPreviewFile(null);
  };

  const handleGenerate = async () => {
    if (!file) {
      setError("Upload an OpenAPI file first.");
      return;
    }

    if (langs.length === 0) {
      setError("Select at least one target language.");
      return;
    }

    setGenerating(true);
    setResult(null);
    setError(null);
// تحقق من الحد المجاني
if (file) {
  const check = await checkAndRegisterProject(file);
  if (!check.allowed) {
    setError(check.reason || "Upgrade to Pro to generate more SDKs.");
    setGenerating(false);
    return;
  }
}
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("langs", JSON.stringify(langs));

      const res = await fetch(`${API_BASE_URL}/generate`, {
        method: "POST",
        body: formData,
      });

      const data = await readJsonResponse(res);
      setResult(data);

      await saveSDKHistory({
        title: data.title,
        version: data.version,
        endpoints: data.endpoints,
        files: data.files,
        languages: langs,
      });

      if (user) {
        getSDKHistory().then(setHistory).catch(console.error);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(
        message === "Failed to fetch"
          ? "Cannot connect to the generation server. Please try again in a moment."
          : message
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateDocs = async () => {
    if (!isPro && freeDocsAttempts >= 1) {
      setShowPricingModal(true);
      return;
    }

    if (!isPro) {
      setFreeDocsAttempts(prev => prev + 1);
    }
    if (!file) {
      setError("Upload an OpenAPI file first.");
      return;
    }

    setGeneratingDocs(true);
    setDocsResult(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_BASE_URL}/generate-docs`, {
        method: "POST",
        body: formData,
      });

      const data = await readJsonResponse(res);
      setDocsResult(data.docs);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate docs.");
    } finally {
      setGeneratingDocs(false);
    }
  };

 const handleBatchGenerate = async () => {
  if (batchFiles.length === 0) {
    setError("Upload at least one OpenAPI file for batch generation.");
    return;
  }

  // منع المستخدم المجاني إذا استهلك الـ 3 محاولات وإظهار نافذة الترقية
  if (!isPro && freeBatchAttempts >= 3) {
  const [freeDocsAttempts, setFreeDocsAttempts] = useState<number>(0);
    setShowPricingModal(true);
    return;
  }

  setGeneratingBatch(true);
  setBatchResults([]);
  setError(null);

  // خصم محاولة من العداد للمستخدم المجاني عند بدء المعالجة
  if (!isPro) {
    setFreeBatchAttempts(prev => prev + 1);
  }

    try {
      const formData = new FormData();
      batchFiles.forEach((batchFile) => formData.append("files", batchFile));
      formData.append("langs", JSON.stringify(langs));

      const res = await fetch(`${API_BASE_URL}/generate-batch`, {
        method: "POST",
        body: formData,
      });

      const data = await readJsonResponse(res);
      setBatchResults(data.results || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Batch generation failed.");
    } finally {
      setGeneratingBatch(false);
    }
  };

  const handleDetectChanges = async () => {
    if (!isPro && freeDiffAttempts >= 1) {
      setShowPricingModal(true);
      return;
    }
    if (!isPro) {
      setFreeDiffAttempts(prev => prev + 1);
    }
    if (!oldFile || !newFile) {
      setError("Upload both the old and new OpenAPI files.");
      return;
    }

    setDetectingChanges(true);
    setChangeReport(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("oldFile", oldFile);
      formData.append("newFile", newFile);

      const res = await fetch(`${API_BASE_URL}/detect-changes`, {
        method: "POST",
        body: formData,
      });

      const data = await readJsonResponse(res);
      setChangeReport(data.report);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Change detection failed.");
    } finally {
      setDetectingChanges(false);
    }
  };

  const exportToGitHub = async () => {
    if (!result) {
      setError("Generate an SDK first.");
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.provider_token) {
      await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          scopes: "repo",
          redirectTo: getRedirectUrl(),
        },
      });
      return;
    }

    const timestamp = Date.now();
    const repoName = `${result.title.toLowerCase().replace(/\s+/g, "-")}-sdk-${timestamp}`;

    try {
      const createRes = await fetch("https://api.github.com/user/repos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.provider_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: repoName,
          description: `SDK generated by SDKCraft for ${result.title}`,
          private: false,
          auto_init: true,
        }),
      });

      const repo = await readJsonResponse(createRes);

      for (const [filename, content] of Object.entries(result.files)) {
        const safeName = filename.replace(/\//g, "_");
        const encoded = btoa(unescape(encodeURIComponent(content)));

        const fileRes = await fetch(`https://api.github.com/repos/${repo.full_name}/contents/${safeName}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session.provider_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `Add ${safeName}`,
            content: encoded,
          }),
        });

        await readJsonResponse(fileRes);
      }

      window.open(repo.html_url, "_blank", "noopener,noreferrer");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "GitHub export failed.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "Inter, system-ui, sans-serif" }}>
      <header style={{ borderBottom: "1px solid #1f1f1f", padding: "16px 32px", display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ color: "#22c55e", fontSize: "20px" }}>&lt;/&gt;</span>
        <span 
  style={{ fontWeight: 700, fontSize: "18px", cursor: "pointer" }}
  onClick={() => setShowLanding(true)}
>SDKCraft</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <a
            href="https://github.com/ihsanelashhab-web/api-to-sdk/issues/new"
            target="_blank"
            rel="noreferrer"
            style={{ background: "#1a1a1a", color: "#aaa", padding: "6px 14px", borderRadius: "8px", fontSize: "13px", textDecoration: "none", border: "1px solid #333" }}
          >
            Report a bug
          </a>
          <span style={{ background: "#16a34a22", color: "#22c55e", padding: "4px 12px", borderRadius: "999px", fontSize: "13px" }}>System online</span>
        </div>
      </header>

      <main style={{ maxWidth: "920px", margin: "0 auto", padding: "48px 24px" }}>
        <section style={{ textAlign: "center", marginBottom: "36px" }}>
          <h1 style={{ fontSize: "40px", fontWeight: 800, margin: "0 0 8px" }}>SDKCraft Developer Console</h1>
          <p style={{ color: "#888", margin: 0 }}>
            Transform OpenAPI specifications into production-ready SDKs, docs, and change reports.
          </p>
        </section>

        <section style={{ marginBottom: "24px" }}>
          <div style={{ color: "#aaa", marginBottom: "12px", fontSize: "14px" }}>OpenAPI specification</div>
          <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "2px dashed #333", borderRadius: "12px", padding: "48px", cursor: "pointer", background: file ? "#0f1f0f" : "#111", transition: "all 0.2s" }}>
            <input
              type="file"
              accept=".json,.yaml,.yml"
              style={{ display: "none" }}
              onChange={(event) => handleFileSelect(event.target.files?.[0] || null)}
            />
            <span style={{ fontWeight: 700, fontSize: "16px" }}>{file ? file.name : "Drop your OpenAPI file here"}</span>
            <span style={{ color: "#666", fontSize: "13px", marginTop: "6px" }}>JSON and YAML are supported</span>
          </label>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          <div style={{ background: "#111", border: "1px solid #222", borderRadius: "12px", padding: "20px" }}>
            <div style={{ fontWeight: 700, marginBottom: "16px" }}>Target languages</div>
            {allLangs.map((lang) => (
              <button
                key={lang.id}
                onClick={() => toggleLang(lang.id)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "10px", borderRadius: "8px", cursor: "pointer", background: langs.includes(lang.id) ? "#0f1f0f" : "transparent", marginBottom: "6px", border: "none", color: "#fff", textAlign: "left" }}
              >
                <span style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "#22c55e", fontWeight: 700 }}>{lang.short}</span>
                <span>{lang.label}</span>
                {langs.includes(lang.id) && <span style={{ marginLeft: "auto", color: "#22c55e" }}>Selected</span>}
              </button>
            ))}
          </div>

          <div style={{ background: "#111", border: "1px solid #222", borderRadius: "12px", padding: "20px" }}>
            <div style={{ fontWeight: 700, marginBottom: "16px" }}>Launch-ready extras</div>
            <p style={{ color: "#777", fontSize: "14px", lineHeight: 1.7, marginTop: 0 }}>
              Generate SDKs first, then add AI docs, export to GitHub, or compare API versions.
            </p>
            <div style={{ display: "grid", gap: "10px", color: "#aaa", fontSize: "14px" }}>
              <span>Works without signup</span>
              <span>Optional GitHub login for history and export</span>
              <span>OpenAPI JSON and YAML support</span>
            </div>
          </div>
        </section>

     <section style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
  <button onClick={handleGenerate} disabled={generating} style={{ flex: "1 1 260px", padding: "16px", borderRadius: "12px", border: "none", background: generating ? "#1a1a1a" : "#22c55e", color: generating ? "#666" : "#000", fontWeight: 800, fontSize: "16px", cursor: generating ? "not-allowed" : "pointer" }}>
    {generating ? "Generating..." : "Generate SDK"}
  </button>
  
  <button 
    onClick={() => isPro ? handleGenerateDocs() : setShowPricingModal(true)} 
    disabled={generatingDocs} 
    style={{ 
      flex: "1 1 260px", 
      padding: "16px", 
      borderRadius: "12px", 
      border: "1px solid #3b82f6", 
      background: generatingDocs ? "#1a1a1a" : (isPro ? "#0f172a" : "#111"), 
      color: generatingDocs ? "#666" : (isPro ? "#93c5fd" : "#666"), 
      fontWeight: 800, 
      fontSize: "16px", 
      cursor: generatingDocs ? "not-allowed" : "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px"
    }}
  >
    {generatingDocs ? "Generating docs..." : "Generate AI docs"}
    {!isPro && <span style={{ fontSize: "14px" }}>🔒</span>}
  </button>
</section>

        {error && (
          <div style={{ marginTop: "16px", background: "#1f0f0f", border: "1px solid #ef444433", borderRadius: "12px", padding: "18px", textAlign: "center", color: "#ef4444" }}>
            {error}
          </div>
        )}

        {docsResult && (
          <section style={{ marginTop: "16px", background: "#0f0f1f", border: "1px solid #3b82f633", borderRadius: "12px", padding: "20px" }}>
            <div style={{ color: "#93c5fd", fontWeight: 800, fontSize: "18px", marginBottom: "16px" }}>AI generated documentation</div>
            <div style={{ background: "#1a1a1a", borderRadius: "8px", padding: "16px", maxHeight: "500px", overflowY: "auto", color: "#ddd" }}>
              <ReactMarkdown>{docsResult}</ReactMarkdown>
            </div>
            <button
              onClick={() => downloadFile("README.md", docsResult)}
              style={{ marginTop: "12px", padding: "10px 20px", borderRadius: "8px", border: "1px solid #3b82f6", background: "transparent", color: "#93c5fd", cursor: "pointer", fontWeight: 700 }}
            >
              Download README.md
            </button>
          </section>
        )}

        {result && (
          <section style={{ marginTop: "16px", background: "#0f1f0f", border: "1px solid #22c55e33", borderRadius: "12px", padding: "20px" }}>
            <div style={{ color: "#22c55e", fontWeight: 800, fontSize: "18px", marginBottom: "8px" }}>SDK generated successfully</div>
            <div style={{ color: "#888", marginBottom: "16px" }}>
              {result.title} v{result.version} - {result.endpoints} endpoints
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
              {Object.entries(result.files).map(([filename, content]) => (
                <div key={filename} style={{ display: "flex" }}>
                  <button onClick={() => setPreviewFile(previewFile?.name === filename ? null : { name: filename, content })} style={{ padding: "8px 12px", borderRadius: "8px 0 0 8px", border: "1px solid #22c55e44", background: previewFile?.name === filename ? "#22c55e22" : "#111", color: "#22c55e", cursor: "pointer", fontSize: "13px" }}>
                    {previewFile?.name === filename ? "Hide" : "Preview"} {filename}
                  </button>
                  <button onClick={() => downloadFile(filename, content)} style={{ padding: "8px 12px", borderRadius: "0 8px 8px 0", border: "1px solid #22c55e44", borderLeft: "none", background: "#111", color: "#22c55e", cursor: "pointer", fontSize: "13px" }}>
                    Download
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button onClick={() => downloadZip(result.files, result.title)} style={{ flex: "1 1 240px", padding: "12px", borderRadius: "8px", background: "#22c55e", color: "#000", border: "none", fontWeight: 800, cursor: "pointer" }}>
                Download ZIP
              </button>
              <button onClick={exportToGitHub} style={{ flex: "1 1 240px", padding: "12px", borderRadius: "8px", border: "1px solid #333", background: "#111", color: "#fff", fontWeight: 800, cursor: "pointer" }}>
                Export to GitHub
              </button>
            </div>

            {previewFile && (
              <div style={{ marginTop: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ color: "#888", fontSize: "13px" }}>{previewFile.name}</span>
                  <button onClick={() => setPreviewFile(null)} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: "14px" }}>Close</button>
                </div>
                <pre style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "16px", overflowX: "auto", fontSize: "12px", maxHeight: "400px", overflowY: "auto", textAlign: "left", margin: 0 }}>
                  <code
                    className={`language-${getLanguage(previewFile.name)}`}
                    dangerouslySetInnerHTML={{
                      __html: Prism.highlight(
                        previewFile.content.slice(0, 3000) + (previewFile.content.length > 3000 ? "\n\n// ... truncated" : ""),
                        Prism.languages[getLanguage(previewFile.name)] || Prism.languages.typescript,
                        getLanguage(previewFile.name)
                      ),
                    }}
                  />
                </pre>
              </div>
            )}
          </section>
        )}

        {isPro {user && ({user && ( (
          <section style={{ marginTop: "24px", textAlign: "center" }}>
            <button onClick={isPro && (
              {isPro && (
            </button>
          </section>
        )}

        {isPro && (
          <section style={{ marginTop: "16px", background: "#111", border: "1px solid #222", borderRadius: "12px", padding: "20px" }}>
            <div style={{ fontWeight: 800, fontSize: "16px", marginBottom: "16px" }}>SDK history</div>
            {history.length === 0 ? (
              <p style={{ color: "#555", textAlign: "center" }}>No history yet. Generate your first SDK.</p>
            ) : (
              history.map((item) => (
                <div key={item.id} style={{ padding: "14px", borderRadius: "10px", marginBottom: "10px", background: "#0a0a0a", border: "1px solid #1f1f1f", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontWeight: 700, color: "#22c55e" }}>{item.title}</div>
                    <div style={{ color: "#666", fontSize: "13px", marginTop: "4px" }}>
                      v{item.version} - {item.endpoints} endpoints - {item.languages?.join(", ")}
                    </div>
                    <div style={{ color: "#444", fontSize: "12px", marginTop: "2px" }}>
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => setResult(item)} style={{ padding: "6px 14px", borderRadius: "8px", border: "1px solid #22c55e44", background: "transparent", color: "#22c55e", cursor: "pointer", fontSize: "13px" }}>Restore</button>
                    <button onClick={async () => { await deleteSDKHistory(item.id); setHistory((prev) => prev.filter((entry) => entry.id !== item.id)); }} style={{ padding: "6px 14px", borderRadius: "8px", border: "1px solid #ef444433", background: "transparent", color: "#ef4444", cursor: "pointer", fontSize: "13px" }}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </section>
        )}

       <section style={{ marginTop: "32px", background: "#111", border: "1px solid #222", borderRadius: "12px", padding: "20px" }}>
          <div style={{ fontWeight: 800, marginBottom: "16px", fontSize: "16px" }}>Batch upload</div>
          <label 
            onClick={(e) => {
              if (!isPro && freeBatchAttempts >= 3) {
  const [freeDocsAttempts, setFreeDocsAttempts] = useState<number>(0);
                e.preventDefault(); // منع فتح نافذة اختيار الملفات بعد استهلاك الـ 3 محاولات
                setShowPricingModal(true); // إظهار نافذة الترقية فوراً
              }
            }}
            style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              justifyContent: "center", 
              padding: "24px", 
              border: "2px dashed #333", 
              borderRadius: "8px", 
              cursor: (isPro || freeBatchAttempts < 3) ? "pointer" : "not-allowed", 
  const [freeDocsAttempts, setFreeDocsAttempts] = useState<number>(0);
              background: (isPro || freeBatchAttempts < 3) ? "#0a0a0a" : "#111",
  const [freeDocsAttempts, setFreeDocsAttempts] = useState<number>(0);
              marginBottom: "12px",
              opacity: (isPro || freeBatchAttempts < 3) ? 1 : 0.6
  const [freeDocsAttempts, setFreeDocsAttempts] = useState<number>(0);
            }}
          >
            <span style={{ fontWeight: 600, color: (isPro || freeBatchAttempts < 3) ? "#fff" : "#555" }}>
  const [freeDocsAttempts, setFreeDocsAttempts] = useState<number>(0);
              {batchFiles.length > 0 
                ? `${batchFiles.length} files selected` 
                : ((isPro || freeBatchAttempts < 3) ? "Select multiple OpenAPI files" : "Select multiple OpenAPI files (Pro only)")}
  const [freeDocsAttempts, setFreeDocsAttempts] = useState<number>(0);
            </span>
            
            {(isPro || freeBatchAttempts < 3) && (
  const [freeDocsAttempts, setFreeDocsAttempts] = useState<number>(0);
              <input 
                type="file" 
                accept=".json,.yaml,.yml" 
                multiple 
                style={{ display: "none" }} 
                onChange={(event) => {
                  setBatchFiles(Array.from(event.target.files || []));
                  if (!isPro) {
                    setFreeBatchAttempts(prev => prev + 1); // زيادة عداد المحاولات للمستخدم المجاني عند اختيار الملفات
                  }
                }} 
              />
            )}
          </label>

          {/* نص توضيحي سفلي شفاف لإعلام المستخدم بحالة محاولاته الشهرية من دون إيموجي */}
          <p style={{ 
            textAlign: "center", 
            fontSize: "12px", 
            color: isPro ? "#22c55e" : (freeBatchAttempts < 3 ? "#3b82f6" : "#ef4444"), 
  const [freeDocsAttempts, setFreeDocsAttempts] = useState<number>(0);
            marginTop: "4px",
            marginBottom: "12px",
            fontWeight: 600
          }}>
            {isPro ? "Unlimited batch access active" : `${3 - freeBatchAttempts} of 3 free monthly batch uploads remaining`}
  const [freeDocsAttempts, setFreeDocsAttempts] = useState<number>(0);
          </p>
        <button 
  onClick={() => isPro ? handleBatchGenerate() : setShowPricingModal(true)} 
  disabled={generatingBatch} 
  style={{ 
    width: "100%", 
    padding: "12px", 
    borderRadius: "8px", 
    border: "none", 
    background: generatingBatch ? "#1a1a1a" : (isPro ? "#7c3aed" : "#222"), 
    color: generatingBatch ? "#666" : (isPro ? "#fff" : "#888"), 
    fontWeight: 800, 
    fontSize: "15px", 
    cursor: generatingBatch ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px"
  }}
>
  {generatingBatch ? "Processing..." : "Generate all SDKs"}
  {!isPro && <span>🔒</span>}
</button>

          {batchResults.length > 0 && (
            <div style={{ marginTop: "16px" }}>
              {batchResults.map((batchResult, index) => (
                <div key={index} style={{ padding: "12px", borderRadius: "8px", marginBottom: "8px", background: batchResult.success ? "#0f1f0f" : "#1f0f0f", border: `1px solid ${batchResult.success ? "#22c55e33" : "#ef444433"}` }}>
                  <div style={{ fontWeight: 700, color: batchResult.success ? "#22c55e" : "#ef4444" }}>
                    {batchResult.success ? "Success" : "Failed"}: {batchResult.filename}
                  </div>
                  {batchResult.success && (
                    <div style={{ color: "#888", fontSize: "13px", marginTop: "4px" }}>
                      {batchResult.title} v{batchResult.version} - {batchResult.endpoints} endpoints
                    </div>
                  )}
                  {batchResult.success && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                      {Object.entries(batchResult.files).map(([filename, content]) => (
                        <button key={filename} onClick={() => downloadFile(filename, content as string)} style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid #22c55e44", background: "#111", color: "#22c55e", cursor: "pointer", fontSize: "12px" }}>
                          Download {filename}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section style={{ marginTop: "32px", background: "#111", border: "1px solid #222", borderRadius: "12px", padding: "20px" }}>
          <div style={{ fontWeight: 800, marginBottom: "16px", fontSize: "16px" }}>API change detection</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", marginBottom: "12px" }}>
            <label style={{ border: "2px dashed #333", borderRadius: "8px", padding: "16px", cursor: "pointer", background: "#0a0a0a", textAlign: "center" }}>
              <input type="file" accept=".json,.yaml,.yml" style={{ display: "none" }} onChange={(event) => setOldFile(event.target.files?.[0] || null)} />
              <div>{oldFile ? oldFile.name : "Old API version"}</div>
            </label>
            <label style={{ border: "2px dashed #333", borderRadius: "8px", padding: "16px", cursor: "pointer", background: "#0a0a0a", textAlign: "center" }}>
              <input type="file" accept=".json,.yaml,.yml" style={{ display: "none" }} onChange={(event) => setNewFile(event.target.files?.[0] || null)} />
              <div>{newFile ? newFile.name : "New API version"}</div>
            </label>
          </div>
         <button 
 onClick={() => handleDetectChanges()}
  disabled={detectingChanges} 
  style={{ 
    width: "100%", 
    padding: "12px", 
    borderRadius: "8px", 
    border: "none", 
    background: detectingChanges ? "#1a1a1a" : (isPro ? "#0369a1" : "#222"), 
    color: detectingChanges ? "#666" : (isPro ? "#fff" : "#888"), 
    fontWeight: 800, 
    fontSize: "15px", 
    cursor: detectingChanges ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px"
  }}
>
  {detectingChanges ? "Detecting..." : "Detect changes"}
  {!isPro && <span>🔒</span>}
</button>

          {changeReport && (
            <div style={{ marginTop: "16px" }}>
              <div style={{ background: "#0a0a0a", borderRadius: "8px", padding: "16px", marginBottom: "12px", color: "#aaa", fontSize: "14px", whiteSpace: "pre-line" }}>
                {changeReport.summary}
              </div>
              {changeReport.breakingChanges?.length > 0 && (
                <div style={{ background: "#1f0f0f", border: "1px solid #ef444433", borderRadius: "8px", padding: "12px" }}>
                  <div style={{ color: "#ef4444", fontWeight: 700, marginBottom: "8px" }}>Breaking changes</div>
                  {changeReport.breakingChanges.map((change: string, index: number) => (
                    <div key={index} style={{ color: "#fca5a5", fontSize: "13px", marginBottom: "4px" }}>{change}</div>
                  ))}
                </div>
              )}
              {changeReport.newEndpoints?.length > 0 && (
                <div style={{ background: "#0f1f0f", border: "1px solid #22c55e33", borderRadius: "8px", padding: "12px", marginTop: "8px" }}>
                  <div style={{ color: "#22c55e", fontWeight: 700, marginBottom: "8px" }}>New endpoints</div>
                  {changeReport.newEndpoints.map((endpoint: any, index: number) => (
                    <div key={index} style={{ color: "#86efac", fontSize: "13px", marginBottom: "4px" }}>{endpoint.method} {endpoint.route}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </main>
{showPricingModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#0d0d0d", border: "1px solid #222", padding: "32px", borderRadius: "16px", maxWidth: "450px", width: "90%", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
            <h3 style={{ color: "#fff", fontSize: "22px", fontWeight: 800, marginBottom: "12px" }}>Unlock Premium Features</h3>
            <p style={{ color: "#aaa", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
              Take your developer workflow to the next level. Get unlimited AI-generated documentation, batch processing, and instant API diff tracking with **SDKCraft Pro**.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button onClick={() => alert("Redirecting to Stripe...")} style={{ background: "#22c55e", color: "#000", border: "none", padding: "12px", borderRadius: "8px", fontWeight: 800, fontSize: "15px", cursor: "pointer" }}>
                Upgrade Now - $15/mo
              </button>
              <button onClick={() => setShowPricingModal(false)} style={{ background: "none", color: "#666", border: "none", padding: "8px", fontSize: "14px", cursor: "pointer" }}>
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
)}
    </div>
  </div>
)}
    </div>
  );
}
