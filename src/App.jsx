import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://sqxzahgthhufgbvsglb.supabase.co";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY";

const supabase = createClient(supabaseUrl, supabaseKey);

const categories = ["All", "Coding", "Music", "Tech", "Gaming", "AI", "Space"];

export default function App() {
  const [videos, setVideos] = useState([]);
  const [selected, setSelected] = useState(null);

  const [page, setPage] = useState("Home");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [subs, setSubs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("playvideo_subs") || "[]");
    } catch {
      return [];
    }
  });

  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("playvideo_history") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    localStorage.setItem("playvideo_subs", JSON.stringify(subs));
  }, [subs]);

  useEffect(() => {
    localStorage.setItem("playvideo_history", JSON.stringify(history));
  }, [history]);

  async function loadVideos() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setError(error.message);
      setVideos([]);
    } else {
      setVideos(data || []);
    }

    setLoading(false);
  }

  async function openVideo(video) {
    setSelected(video);
    setPage("Watch");

    // History
    setHistory((old) => {
      const without = old.filter((id) => id !== video.id);
      return [video.id, ...without].slice(0, 50);
    });

    // View count
    const newViews = Number(video.views || 0) + 1;

    await supabase
      .from("videos")
      .update({ views: newViews })
      .eq("id", video.id);

    setVideos((old) =>
      old.map((v) =>
        v.id === video.id ? { ...v, views: newViews } : v
      )
    );

    setSelected((old) =>
      old ? { ...old, views: newViews } : old
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadVideo() {
    if (!title.trim() || !file) {
      alert("Video title এবং video file দিন!");
      return;
    }

    if (!file.type.startsWith("video/")) {
      alert("শুধু video file upload করুন!");
      return;
    }

    setUploading(true);

    try {
      const safeName = file.name
        .replace(/[^a-zA-Z0-9._-]/g, "_")
        .replace(/\s+/g, "_");

      const fileName = `${Date.now()}-${safeName}`;

      // Upload video
      const { error: uploadError } = await supabase.storage
        .from("videos")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Public URL
      const { data: publicData } = supabase.storage
        .from("videos")
        .getPublicUrl(fileName);

      const publicUrl = publicData.publicUrl;

      // Database
      const { data, error: insertError } = await supabase
        .from("videos")
        .insert([
          {
            title: title.trim(),
            video_url: publicUrl,
            views: 0,
          },
        ])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      setVideos((old) => [data, ...old]);

      setTitle("");
      setFile(null);
      setShowUpload(false);

      alert("🎉 Video Upload Successful!");

      setPage("Home");
    } catch (err) {
      console.error(err);
      alert("Upload failed: " + err.message);
    }

    setUploading(false);
  }

  function toggleSubscribe(id) {
    setSubs((old) => {
      if (old.includes(id)) {
        return old.filter((x) => x !== id);
      }

      return [...old, id];
    });
  }

  function getCategory(video) {
    const text = (video.title || "").toLowerCase();

    if (text.includes("coding") || text.includes("code")) {
      return "Coding";
    }

    if (
      text.includes("music") ||
      text.includes("song") ||
      text.includes("gaan")
    ) {
      return "Music";
    }

    if (
      text.includes("gaming") ||
      text.includes("game") ||
      text.includes("free fire")
    ) {
      return "Gaming";
    }

    if (text.includes("ai") || text.includes("artificial")) {
      return "AI";
    }

    if (
      text.includes("space") ||
      text.includes("nasa") ||
      text.includes("planet")
    ) {
      return "Space";
    }

    return "Tech";
  }

  const filteredVideos = useMemo(() => {
    let result = [...videos];

    if (search.trim()) {
      const q = search.toLowerCase();

      result = result.filter((video) =>
        (video.title || "").toLowerCase().includes(q)
      );
    }

    if (category !== "All") {
      result = result.filter(
        (video) => getCategory(video) === category
      );
    }

    return result;
  }, [videos, search, category]);

  function timeAgo(date) {
    if (!date) return "";

    const diff = Date.now() - new Date(date).getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} min ago`;

    return "Just now";
  }

  function goHome() {
    setPage("Home");
    setSelected(null);
  }

  const pageTitle = page === "Home"
    ? "Home"
    : page === "Shorts"
    ? "Shorts"
    : page === "Subs"
    ? "Subscriptions"
    : "Library";

  return (
    <div
      style={{
        background: "#0f0f0f",
        color: "#fff",
        minHeight: "100vh",
        paddingBottom: 85,
        fontFamily: "Arial, sans-serif",
      }}
    >

      {/* HEADER */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "#0f0f0f",
          borderBottom: "1px solid #222",
          padding: "10px 12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 25 }}>☰</span>

          <div
            onClick={goHome}
            style={{
              fontSize: 19,
              fontWeight: "bold",
              whiteSpace: "nowrap",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                background: "red",
                padding: "2px 6px",
                borderRadius: 5,
                marginRight: 4,
              }}
            >
              ▶
            </span>

            Play<span style={{ color: "red" }}>Video</span>
          </div>

          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage("Home");
              setSelected(null);
            }}
            placeholder="Search video..."
            style={{
              flex: 1,
              minWidth: 0,
              background: "#121212",
              border: "1px solid #303030",
              color: "#fff",
              borderRadius: 25,
              padding: "10px 14px",
              outline: "none",
            }}
          />

          <button
            onClick={() => setShowUpload((x) => !x)}
            style={{
              background: "red",
              color: "#fff",
              border: 0,
              borderRadius: 22,
              padding: "9px 12px",
              fontWeight: "bold",
              whiteSpace: "nowrap",
            }}
          >
            + Upload
          </button>
        </div>
      </header>

      {/* CATEGORY */}
      {page === "Home" && !selected && (
        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            padding: "10px 12px",
            borderBottom: "1px solid #222",
          }}
        >
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{
                background:
                  category === c ? "#fff" : "#272727",
                color:
                  category === c ? "#000" : "#fff",
                border: 0,
                borderRadius: 9,
                padding: "7px 15px",
                fontWeight:
                  category === c ? "bold" : "normal",
                whiteSpace: "nowrap",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* UPLOAD */}
      {showUpload && (
        <div
          style={{
            background: "#212121",
            margin: 12,
            padding: 15,
            borderRadius: 12,
          }}
        >
          <h3 style={{ marginTop: 0 }}>
            📤 Upload Video
          </h3>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Video title"
            style={{
              width: "100%",
              boxSizing: "border-box",
              background: "#303030",
              color: "#fff",
              border: 0,
              borderRadius: 8,
              padding: 12,
              marginBottom: 10,
            }}
          />

          <input
            type="file"
            accept="video/*"
            onChange={(e) =>
              setFile(e.target.files?.[0] || null)
            }
            style={{
              width: "100%",
              marginBottom: 12,
            }}
          />

          {file && (
            <p style={{ color: "#aaa", fontSize: 13 }}>
              Selected: {file.name}
            </p>
          )}

          <button
            onClick={uploadVideo}
            disabled={uploading}
            style={{
              width: "100%",
              padding: 12,
              background: uploading ? "#555" : "red",
              color: "#fff",
              border: 0,
              borderRadius: 8,
              fontWeight: "bold",
            }}
          >
            {uploading
              ? "Uploading..."
              : "PUBLISH VIDEO 🚀"}
          </button>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div
          style={{
            margin: 12,
            padding: 15,
            background: "#351515",
            borderRadius: 10,
          }}
        >
          <b>⚠️ Supabase Error</b>
          <p style={{ color: "#ffb3b3" }}>{error}</p>

          <button
            onClick={loadVideos}
            style={{
              background: "red",
              color: "#fff",
              border: 0,
              borderRadius: 8,
              padding: "8px 15px",
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div
          style={{
            textAlign: "center",
            padding: 50,
            color: "#aaa",
          }}
        >
          Loading PlayVideo...
        </div>
      )}

      {/* WATCH */}
      {!loading && page === "Watch" && selected && (
        <div>
          <video
            src={selected.video_url}
            controls
            autoPlay
            playsInline
            style={{
              width: "100%",
              maxHeight: "65vh",
              background: "#000",
              display: "block",
            }}
          />

          <div style={{ padding: 12 }}>
            <h2
              style={{
                fontSize: 19,
                lineHeight: "26px",
              }}
            >
              {selected.title}
            </h2>

            <div
              style={{
                color: "#aaa",
                fontSize: 13,
              }}
            >
              {Number(selected.views || 0)} views
              {" • "}
              {timeAgo(selected.created_at)}
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 14,
              }}
            >
              <button
                style={{
                  background: "#272727",
                  color: "#fff",
                  border: 0,
                  borderRadius: 20,
                  padding: "9px 15px",
                }}
              >
                👍 Like
              </button>

              <button
                style={{
                  background: "#272727",
                  color: "#fff",
                  border: 0,
                  borderRadius: 20,
                  padding: "9px 15px",
                }}
              >
                ↗ Share
              </button>

              <button
                onClick={() =>
                  toggleSubscribe(selected.id)
                }
                style={{
                  marginLeft: "auto",
                  background: subs.includes(selected.id)
                    ? "#303030"
                    : "red",
                  color: "#fff",
                  border: 0,
                  borderRadius: 20,
                  padding: "9px 15px",
                  fontWeight: "bold",
                }}
              >
                {subs.includes(selected.id)
                  ? "Subscribed ✓"
                  : "Subscribe"}
              </button>
            </div>

            {/* AD AREA */}
            <div
              style={{
                background: "#1c1c1c",
                border: "1px dashed #555",
                borderRadius: 10,
                padding: 20,
                textAlign: "center",
                color: "#888",
                marginTop: 15,
              }}
            >
              Advertisement
            </div>

            <button
              onClick={goHome}
              style={{
                marginTop: 15,
                background: "#272727",
                color: "#fff",
                border: 0,
                borderRadius: 20,
                padding: "9px 16px",
              }}
            >
              ← Back
            </button>

            {/* UP NEXT */}
            <h3 style={{ marginTop: 25 }}>
              Up next
            </h3>

            {videos
              .filter((v) => v.id !== selected.id)
              .slice(0, 8)
              .map((v) => (
                <div
                  key={v.id}
                  onClick={() => openVideo(v)}
                  style={{
                    display: "flex",
                    gap: 10,
                    marginBottom: 12,
                    cursor: "pointer",
                  }}
                >
                  <video
                    src={v.video_url}
                    muted
                    preload="metadata"
                    style={{
                      width: 145,
                      height: 82,
                      objectFit: "cover",
                      borderRadius: 7,
                      background: "#000",
                    }}
                  />

                  <div>
                    <b style={{ fontSize: 14 }}>
                      {v.title}
                    </b>

                    <div
                      style={{
                        color: "#aaa",
                        fontSize: 12,
                        marginTop: 5,
                      }}
                    >
                      {v.views || 0} views
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* HOME */}
      {!loading &&
        page === "Home" &&
        !selected && (
          <div>
            {filteredVideos.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: 70,
                  color: "#aaa",
                }}
              >
                <div style={{ fontSize: 45 }}>
                  🎬
                </div>

                <h3>
                  {search || category !== "All"
                    ? "No video found"
                    : "Kono video nei"}
                </h3>

                <p>
                  {search
                    ? `Search: ${search}`
                    : "First video upload korun!"}
                </p>
              </div>
            ) : (
              filteredVideos.map((v, index) => (
                <div
                  key={v.id}
                  style={{
                    marginBottom: 10,
                  }}
                >
                  <div
                    onClick={() => openVideo(v)}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <video
                      src={v.video_url}
                      muted
                      preload="metadata"
                      playsInline
                      style={{
                        width: "100%",
                        aspectRatio: "16/9",
                        objectFit: "cover",
                        background: "#000",
                        display: "block",
                      }}
                    />

                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        padding: "10px 12px",
                      }}
                    >
                      <img
                        src={`https://i.pravatar.cc/100?img=${
                          (index % 30) + 1
                        }`}
                        alt=""
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: "50%",
                        }}
                      />

                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: "bold",
                            lineHeight: "21px",
                          }}
                        >
                          {v.title}
                        </div>

                        <div
                          style={{
                            color: "#aaa",
                            fontSize: 13,
                            marginTop: 4,
                          }}
                        >
                          PlayVideo Creator
                          {" • "}
                          {v.views || 0} views
                          {" • "}
                          {timeAgo(v.created_at)}
                        </div>
                      </div>

                      <span
                        style={{
                          color: "#aaa",
                          fontSize: 20,
                        }}
                      >
                        ⋮
                      </span>
                    </div>
                  </div>

                  {index === 2 && (
                    <div
                      style={{
                        margin: "5px 12px 15px",
                        padding: 18,
                        background: "#1a1a1a",
                        borderRadius: 10,
                        textAlign: "center",
                        color: "#777",
                      }}
                    >
                      Advertisement
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

      {/* SHORTS */}
      {!loading && page === "Shorts" && (
        <div style={{ padding: 15 }}>
          <h2>🔥 Shorts</h2>

          {videos.length === 0 ? (
            <p style={{ color: "#aaa" }}>
              এখনো কোনো video নেই।
            </p>
          ) : (
            videos.slice(0, 10).map((v) => (
              <div
                key={v.id}
                onClick={() => openVideo(v)}
                style={{
                  maxWidth: 400,
                  margin: "15px auto",
                  background: "#181818",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                <video
                  src={v.video_url}
                  muted
                  playsInline
                  style={{
                    width: "100%",
                    height: 500,
                    objectFit: "cover",
                    background: "#000",
                  }}
                />

                <div style={{ padding: 12 }}>
                  <b>{v.title}</b>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* SUBSCRIPTIONS */}
      {!loading && page === "Subs" && (
        <div style={{ padding: 15 }}>
          <h2>📺 Subscriptions</h2>

          {subs.length === 0 ? (
            <p style={{ color: "#aaa" }}>
              এখনো কোনো channel subscribe করেননি।
            </p>
          ) : (
            videos
              .filter((v) => subs.includes(v.id))
              .map((v) => (
                <div
                  key={v.id}
                  onClick={() => openVideo(v)}
                  style={{
                    display: "flex",
                    gap: 10,
                    padding: 10,
                    background: "#212121",
                    marginBottom: 10,
                    borderRadius: 10,
                  }}
                >
                  <video
                    src={v.video_url}
                    muted
                    style={{
                      width: 120,
                      height: 70,
                      objectFit: "cover",
                      borderRadius: 7,
                    }}
                  />

                  <div>
                    <b>{v.title}</b>

                    <p
                      style={{
                        color: "#aaa",
                        margin: "5px 0",
                        fontSize: 12,
                      }}
                    >
                      {v.views || 0} views
                    </p>
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {/* LIBRARY */}
      {!loading && page === "Library" && (
        <div style={{ padding: 15 }}>
          <h2>📚 Library</h2>

          <div
            style={{
              background: "#212121",
              padding: 15,
              borderRadius: 10,
              marginBottom: 10,
            }}
          >
            🕒 Watch History: {history.length}
          </div>

          <h3>Recent Videos</h3>

          {videos.slice(0, 10).map((v) => (
            <div
              key={v.id}
              onClick={() => openVideo(v)}
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 12,
              }}
            >
              <video
                src={v.video_url}
                muted
                style={{
                  width: 120,
                  height: 70,
                  objectFit: "cover",
                  borderRadius: 7,
                }}
              />

              <div>
                <b>{v.title}</b>

                <div
                  style={{
                    color: "#aaa",
                    fontSize: 12,
                    marginTop: 5,
                  }}
                >
                  {v.views || 0} views
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BOTTOM NAV */}
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 68,
          background: "#0f0f0f",
          borderTop: "1px solid #252525",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          zIndex: 999,
        }}
      >
        <NavButton
          icon="🏠"
          text="Home"
          active={page === "Home"}
          onClick={goHome}
        />

        <NavButton
          icon="🎬"
          text="Shorts"
          active={page === "Shorts"}
          onClick={() => {
            setPage("Shorts");
            setSelected(null);
          }}
        />

        <button
          onClick={() => setShowUpload((x) => !x)}
          style={{
            width: 50,
            height: 50,
            marginTop: -20,
            borderRadius: "50%",
            border: 0,
            background: "red",
            color: "#fff",
            fontSize: 30,
            boxShadow: "0 0 15px rgba(255,0,0,.5)",
          }}
        >
          +
        </button>

        <NavButton
          icon="📺"
          text="Subs"
          active={page === "Subs"}
          onClick={() => {
            setPage("Subs");
            setSelected(null);
          }}
        />

        <NavButton
          icon="📚"
          text="Library"
          active={page === "Library"}
          onClick={() => {
            setPage("Library");
            setSelected(null);
          }}
        />
      </nav>
    </div>
  );
}

function NavButton({ icon, text, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        border: 0,
        color: active ? "#fff" : "#888",
        textAlign: "center",
        fontSize: 11,
      }}
    >
      <div style={{ fontSize: 21 }}>{icon}</div>
      {text}
    </button>
  );
}
