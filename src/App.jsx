import React, { useEffect, useMemo, useState } from "react";

const CATS = [
  "All",
  "Music",
  "Gaming",
  "Tech",
  "Comedy",
  "Live",
  "AI",
  "News",
  "Cricket",
  "Bangla",
  "Cooking",
  "Vlog",
  "Education",
  "Meme"
];

const DEMO_VIDEO =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const seedVideos = [
  {
    id: "v1",
    title: "Welcome to PlayVideo 2026",
    channel: "PlayVideo",
    category: "Tech",
    type: "long",
    views: 1240,
    likes: 128,
    dislikes: 7,
    src: DEMO_VIDEO
  },
  {
    id: "v2",
    title: "Amazing Short Video",
    channel: "PlayVideo",
    category: "Comedy",
    type: "short",
    views: 860,
    likes: 92,
    dislikes: 3,
    src: DEMO_VIDEO
  },
  {
    id: "v3",
    title: "Bangla AI Video Demo",
    channel: "PlayVideo",
    category: "AI",
    type: "long",
    views: 520,
    likes: 44,
    dislikes: 2,
    src: DEMO_VIDEO
  },
  {
    id: "v4",
    title: "Quick Tech Short",
    channel: "PlayVideo",
    category: "Tech",
    type: "short",
    views: 740,
    likes: 67,
    dislikes: 4,
    src: DEMO_VIDEO
  }
];

const KEY = "playvideo_clean_v2";

const defaultState = {
  videos: seedVideos,
  liked: {},
  disliked: {},
  saved: {},
  history: [],
  subscribed: {},
  bell: {},
  comments: {},
  chats: [],
  profile: {
    name: "You",
    handle: "@you",
    bio: "Welcome to my PlayVideo channel"
  },
  notifications: [],
  earnings: 0
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");

    if (!saved) {
      return defaultState;
    }

    return {
      ...defaultState,
      ...saved,
      videos: saved.videos?.length ? saved.videos : seedVideos,
      profile: {
        ...defaultState.profile,
        ...(saved.profile || {})
      }
    };
  } catch {
    return defaultState;
  }
}

const css = `
* {
  box-sizing: border-box;
}

html,
body,
#root {
  margin: 0;
  min-height: 100%;
  background: #0f0f0f;
  color: #fff;
  font-family: Arial, system-ui, sans-serif;
}

button {
  border: 0;
  cursor: pointer;
  color: #fff;
  background: #272727;
  border-radius: 22px;
  padding: 9px 14px;
}

button:hover {
  background: #383838;
}

.app {
  min-height: 100vh;
}

.top {
  position: sticky;
  top: 0;
  z-index: 30;
  background: #111;
  border-bottom: 1px solid #292929;
  padding: 10px 14px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.logo {
  font-size: 20px;
  font-weight: 800;
  white-space: nowrap;
  cursor: pointer;
}

.play {
  color: #fff;
}

.red {
  color: #ff3030;
}

.search {
  flex: 1;
  max-width: 650px;
  margin: auto;
  display: flex;
}

.search input {
  width: 100%;
  background: #181818;
  border: 1px solid #333;
  color: #fff;
  padding: 10px 14px;
  border-radius: 22px 0 0 22px;
  outline: 0;
}

.search button {
  border-radius: 0 22px 22px 0;
}

.layout {
  display: flex;
}

.side {
  width: 220px;
  padding: 14px;
  position: sticky;
  top: 61px;
  height: calc(100vh - 61px);
  border-right: 1px solid #222;
}

.side button {
  width: 100%;
  text-align: left;
  margin: 3px 0;
}

.main {
  flex: 1;
  padding: 16px;
  max-width: 1400px;
  margin: auto;
  min-width: 0;
}

.chips {
  display: flex;
  gap: 8px;
  overflow: auto;
  padding-bottom: 14px;
}

.chip {
  white-space: nowrap;
}

.active {
  background: #fff;
  color: #111;
}

.grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(250px, 1fr)
  );
  gap: 18px;
}

.card {
  background: #161616;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #242424;
}

.thumb {
  width: 100%;
  aspect-ratio: 16/9;
  background: #000;
  object-fit: cover;
  display: block;
  cursor: pointer;
}

.cardbody {
  padding: 10px;
}

.muted {
  color: #aaa;
  font-size: 13px;
}

.row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.grow {
  flex: 1;
}

.pageTitle {
  margin: 5px 0 16px;
}

.watch {
  max-width: 1000px;
  margin: auto;
}

.player {
  width: 100%;
  max-height: 62vh;
  background: #000;
  border-radius: 10px;
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 12px 0;
}

.panel {
  background: #171717;
  border: 1px solid #292929;
  border-radius: 12px;
  padding: 14px;
  margin-top: 14px;
}

.comment {
  padding: 12px 0;
  border-bottom: 1px solid #292929;
}

.input {
  background: #111;
  border: 1px solid #333;
  color: #fff;
  border-radius: 8px;
  padding: 10px;
  width: 100%;
  outline: 0;
}

.bottom {
  display: none;
}

.modalbg {
  position: fixed;
  inset: 0;
  background: #000b;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.modal {
  background: #171717;
  border: 1px solid #333;
  border-radius: 16px;
  width: min(620px, 100%);
  max-height: 90vh;
  overflow: auto;
  padding: 18px;
}

.file {
  border: 1px dashed #555;
  padding: 20px;
  border-radius: 10px;
}

.statgrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.stat {
  background: #202020;
  border-radius: 12px;
  padding: 18px;
}

.messages {
  height: 55vh;
  overflow: auto;
  padding: 10px;
  background: #101010;
  border-radius: 10px;
}

.bubble {
  max-width: 75%;
  padding: 10px 12px;
  border-radius: 14px;
  margin: 7px 0;
  background: #272727;
}

.mine {
  margin-left: auto;
  background: #075e54;
}

.success {
  background: #16834d;
}

.danger {
  background: #9b2020;
}

.shortCard {
  position: relative;
  width: min(100%, 430px);
  height: calc(100vh - 130px);
  min-height: 620px;
  margin: 0 auto 16px;
  background: #000;
  border-radius: 14px;
  overflow: hidden;
  scroll-snap-align: start;
}

.shortVideo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  background: #000;
}

.shortInfo {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 15px;
  z-index: 5;
  background: #0009;
  padding: 12px;
  border-radius: 12px;
}

.empty {
  padding: 30px;
  text-align: center;
  color: #aaa;
}

select.input {
  appearance: auto;
}

@media(max-width:800px) {

  .shortCard {
    width: 100%;
    height: calc(100vh - 125px);
    min-height: 0;
    margin: 0 auto 10px;
    border-radius: 12px;
  }

  .shortVideo {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .shortInfo {
    left: 10px;
    right: 10px;
    bottom: 10px;
    padding: 10px;
  }

  .side {
    display: none;
  }
    display: none;
  }

  .main {
    padding: 10px 10px 75px;
  }

  .grid {
    grid-template-columns: repeat(
      2,
      minmax(0, 1fr)
    );
    gap: 9px;
  }

  .cardbody {
    padding: 8px;
  }

  .bottom {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #111;
    border-top: 1px solid #292929;
    z-index: 50;
    justify-content: space-around;
    padding: 7px;
  }

  .bottom button {
    background: transparent;
    padding: 7px 9px;
    font-size: 11px;
  }

  .top {
    gap: 6px;
    padding: 9px;
  }

  .top .search {
    max-width: none;
  }

  .top .chatTop,
  .top .userTop {
    font-size: 16px;
    padding: 8px;
  }

  .statgrid {
    grid-template-columns: 1fr 1fr;
  }
}
`;

function makeId() {
  return crypto?.randomUUID?.() || String(
    Date.now() + Math.random()
  );
}

export default function App() {

  const [s, setS] = useState(loadState);

  const [page, setPage] = useState("home");
  const [cat, setCat] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  const [showUpload, setShowUpload] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCat, setUploadCat] = useState("Tech");
  const [uploadType, setUploadType] = useState("long");

  const [comment, setComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [reply, setReply] = useState("");

  const [chatUser, setChatUser] =
    useState("PlayVideo Creator");

  const [chatText, setChatText] = useState("");

  const [profileName, setProfileName] =
    useState(s.profile.name);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(s));
  }, [s]);

  const filtered = useMemo(() => {

    let list = [...s.videos];

    if (cat !== "All" && page !== "shorts") {
      list = list.filter(
        v => v.category === cat
      );
    }

    const q = query.trim().toLowerCase();

    if (q) {
      list = list.filter(v =>
        `${v.title} ${v.channel} ${v.category}`
          .toLowerCase()
          .includes(q)
      );
    }

    if (page === "shorts") {
      list = list.filter(
        v => v.type === "short"
      );
    }

    if (page === "saved") {
      list = list.filter(
        v => s.saved[v.id]
      );
    }

    if (page === "history") {
      list = list.filter(
        v => s.history.includes(v.id)
      );
    }

    if (page === "subscriptions") {
      list = list.filter(
        v => s.subscribed[v.channel]
      );
    }

    return list;

  }, [
    s,
    cat,
    query,
    page
  ]);

  function go(p) {
    setPage(p);
    setSelected(null);
  }

  function openVideo(v) {

    setSelected(v);
    setPage("watch");

    setS(x => ({
      ...x,

      history: [
        v.id,
        ...x.history.filter(
          id => id !== v.id
        )
      ].slice(0, 100),

      videos: x.videos.map(z =>
        z.id === v.id
          ? {
              ...z,
              views: (z.views || 0) + 1
            }
          : z
      )
    }));
  }

  function react(id, type) {

    setS(x => {

      const v = x.videos.find(
        z => z.id === id
      );

      if (!v) return x;

      const nl = { ...x.liked };
      const nd = { ...x.disliked };

      let likes = v.likes || 0;
      let dislikes = v.dislikes || 0;

      if (type === "like") {

        if (nl[id]) {

          delete nl[id];

          likes = Math.max(
            0,
            likes - 1
          );

        } else {

          nl[id] = true;

          likes++;

          if (nd[id]) {

            delete nd[id];

            dislikes = Math.max(
              0,
              dislikes - 1
            );
          }
        }

      } else {

        if (nd[id]) {

          delete nd[id];

          dislikes = Math.max(
            0,
            dislikes - 1
          );

        } else {

          nd[id] = true;

          dislikes++;

          if (nl[id]) {

            delete nl[id];

            likes = Math.max(
              0,
              likes - 1
            );
          }
        }
      }

      const videos = x.videos.map(z =>
        z.id === id
          ? {
              ...z,
              likes,
              dislikes
            }
          : z
      );

      return {
        ...x,
        videos,
        liked: nl,
        disliked: nd
      };
    });
  }

  function subscribe(v) {

    setS(x => ({
      ...x,

      subscribed: {
        ...x.subscribed,
        [v.channel]:
          !x.subscribed[v.channel]
      },

      bell: {
        ...x.bell,
        [v.channel]:
          x.bell[v.channel] || false
      }
    }));
  }

  function toggleBell(channel) {

    setS(x => ({
      ...x,

      bell: {
        ...x.bell,
        [channel]:
          !x.bell[channel]
      }
    }));
  }

  function addComment() {

    if (
      !selected ||
      !comment.trim()
    ) {
      return;
    }

    const c = {

      id: makeId(),

      user: s.profile.name,

      text: comment.trim(),

      time: "Just now",

      likes: 0,

      replies: []
    };

    setS(x => ({

      ...x,

      comments: {

        ...x.comments,

        [selected.id]: [
          ...(x.comments[selected.id] || []),
          c
        ]
      },

      notifications: [

        {
          id: makeId(),

          text:
            `${x.profile.name} commented on "${selected.title}"`,

          time: "now"
        },

        ...x.notifications
      ]
    }));

    setComment("");
  }

  function addReply(cid) {

    if (
      !selected ||
      !reply.trim()
    ) {
      return;
    }

    setS(x => ({

      ...x,

      comments: {

        ...x.comments,

        [selected.id]:
          (x.comments[selected.id] || [])
            .map(c =>
              c.id === cid
                ? {
                    ...c,

                    replies: [
                      ...(c.replies || []),

                      {
                        id: makeId(),

                        user:
                          x.profile.name,

                        text:
                          reply.trim()
                      }
                    ]
                  }
                : c
            )
      }
    }));

    setReply("");
    setReplyTo(null);
  }

  async function share(v) {

    const url =
      `${window.location.origin}${window.location.pathname}#video=${v.id}`;

    try {

      if (navigator.share) {

        await navigator.share({

          title: v.title,

          text: "Watch on PlayVideo",

          url
        });

      } else if (navigator.clipboard) {

        await navigator.clipboard.writeText(
          url
        );

        alert(
          "Video link copied!"
        );

      } else {

        alert(url);
      }

    } catch {}
  }

  function download(v) {

    const a =
      document.createElement("a");

    a.href = v.src;

    a.download =
      `${v.title || "PlayVideo"}.mp4`;

    a.target = "_blank";

    document.body.appendChild(a);

    a.click();

    a.remove();
  }

  function upload() {

    if (!uploadTitle.trim()) {

      alert(
        "Please enter a video title"
      );

      return;
    }

    const src =
      uploadFile
        ? URL.createObjectURL(uploadFile)
        : DEMO_VIDEO;

    const v = {

      id: "u" + Date.now(),

      title:
        uploadTitle.trim(),

      channel:
        s.profile.name,

      category:
        uploadCat,

      type:
        uploadType,

      views: 0,

      likes: 0,

      dislikes: 0,

      src
    };

    setS(x => ({

      ...x,

      videos: [
        v,
        ...x.videos
      ]
    }));

    setShowUpload(false);

    setUploadTitle("");

    setUploadFile(null);

    setPage("home");
  }

  function saveVideo(v) {

    setS(x => ({

      ...x,

      saved: {

        ...x.saved,

        [v.id]:
          !x.saved[v.id]
      }
    }));
  }

  function sendChat() {

    if (!chatText.trim()) {
      return;
    }

    setS(x => ({

      ...x,

      chats: [

        ...x.chats,

        {

          id: makeId(),

          user: chatUser,

          text:
            chatText.trim(),

          mine: true,

          time:
            new Date()
              .toLocaleTimeString()
        }
      ]
    }));

    setChatText("");
  }

  function updateProfile() {

    const clean =
      profileName.trim() || "You";

    setS(x => ({

      ...x,

      profile: {

        ...x.profile,

        name: clean,

        handle:
          "@" +
          clean
            .toLowerCase()
            .replace(
              /[^a-z0-9]+/g,
              ""
            )
      }
    }));

    alert(
      "Profile saved!"
    );

    setPage("profile");
  }

  function Header() {

    return (

      <header className="top">

        <div
          className="logo"
          onClick={() =>
            go("home")
          }
        >

          <span className="play">
            ▶
          </span>{" "}

          Play
          <span className="red">
            Video
          </span>

        </div>

        <div className="search">

          <input

            value={query}

            onChange={e =>
              setQuery(
                e.target.value
              )
            }

            onKeyDown={e =>
              e.key === "Enter" &&
              go("home")
            }

            placeholder="Search videos..."
          />

          <button
            onClick={() =>
              go("home")
            }
          >
            🔍
          </button>

        </div>

        <button
          className="chatTop"
          onClick={() =>
            setShowChat(true)
          }
        >
          💬
        </button>

        <button
          className="userTop"
          onClick={() =>
            setShowAuth(true)
          }
        >
          👤
        </button>

      </header>
    );
  }

  function Sidebar() {

    const items = [

      ["home", "🏠 Home"],

      ["shorts", "🎬 Shorts"],

      [
        "subscriptions",
        "📺 Subscriptions"
      ],

      ["saved", "💾 Saved"],

      ["history", "🕘 History"],

      ["profile", "👤 Profile"],

      [
        "creator",
        "💰 Creator Studio"
      ],

      ["chat", "💬 Chat"],

      [
        "notifications",
        "🔔 Notifications"
      ]
    ];

    return (

      <aside className="side">

        {items.map(
          ([p, label]) => (

            <button
              key={p}
              onClick={() =>
                go(p)
              }
            >
              {label}
            </button>

          )
        )}

        <button
          onClick={() =>
            setShowUpload(true)
          }
        >
          ⬆️ Upload
        </button>

      </aside>
    );
  }

  function Card({ v }) {

    return (

      <div className="card">

        <video

          className="thumb"

          src={v.src}

          muted

          preload="metadata"

          onClick={() =>
            openVideo(v)
          }
        />

        <div className="cardbody">

          <b
            onClick={() =>
              openVideo(v)
            }

            style={{
              cursor: "pointer"
            }}
          >
            {v.title}
          </b>

          <div className="muted">

            @{v.channel}
            {" • "}
            {v.views || 0}
            {" views"}

          </div>

          <div
            className="row"
            style={{
              marginTop: 8
            }}
          >

            <span className="muted">
              #{v.category}
            </span>

            <span className="grow" />

            <button
              onClick={() =>
                saveVideo(v)
              }
            >
              {s.saved[v.id]
                ? "✅"
                : "💾"}
            </button>

          </div>

        </div>

      </div>
    );
  }

  function Watch() {

    if (!selected) {
      return null;
    }

    const liveVideo =
      s.videos.find(
        v =>
          v.id === selected.id
      ) || selected;

    const comments =
      s.comments[selected.id] || [];

    return (

      <div className="watch">

        <button
          onClick={() =>
            go("home")
          }
        >
          ← Back
        </button>

        <video

          className="player"

          src={liveVideo.src}

          controls

          autoPlay

          playsInline
        />

        <h2>
          {liveVideo.title}
        </h2>

        <div className="muted">

          @{liveVideo.channel}
          {" • "}
          {liveVideo.views || 0}
          {" views"}
          {" • "}
          #{liveVideo.category}

        </div>

        <div className="actions">

          <button
            onClick={() =>
              react(
                liveVideo.id,
                "like"
              )
            }
          >
            {s.liked[liveVideo.id]
              ? "❤️"
              : "👍"}{" "}
            {liveVideo.likes || 0}
          </button>

          <button
            onClick={() =>
              react(
                liveVideo.id,
                "dislike"
              )
            }
          >
            {s.disliked[liveVideo.id]
              ? "👎"
              : "👎🏻"}{" "}
            {liveVideo.dislikes || 0}
          </button>

          <button
            onClick={() =>
              subscribe(liveVideo)
            }
          >
            📺{" "}
            {s.subscribed[
              liveVideo.channel
            ]
              ? "Subscribed"
              : "Subscribe"}
          </button>

          {s.subscribed[
            liveVideo.channel
          ] && (

            <button
              onClick={() =>
                toggleBell(
                  liveVideo.channel
                )
              }
            >
              {s.bell[
                liveVideo.channel
              ]
                ? "🔔 On"
                : "🔕 Off"}
            </button>

          )}

          <button
            onClick={() =>
              share(liveVideo)
            }
          >
            ↗️ Share
          </button>

          <button
            onClick={() =>
              download(liveVideo)
            }
          >
            ⬇️ Download
          </button>

          <button
            onClick={() =>
              saveVideo(liveVideo)
            }
          >
            {s.saved[liveVideo.id]
              ? "✅ Saved"
              : "💾 Save"}
          </button>

          <button
            onClick={() =>
              setShowChat(true)
            }
          >
            💬 Chat
          </button>

        </div>

        <div className="panel">

          <b>
            Comments ({comments.length})
          </b>

          <div
            className="row"
            style={{
              marginTop: 10
            }}
          >

            <input

              className="input"

              value={comment}

              onChange={e =>
                setComment(
                  e.target.value
                )
              }

              onKeyDown={e =>
                e.key === "Enter" &&
                addComment()
              }

              placeholder="Write a comment..."
            />

            <button
              className="success"
              onClick={
                addComment
              }
            >
              Post
            </button>

          </div>

          {comments.length === 0 && (

            <div className="empty">
              No comments yet.
              Be the first to comment!
            </div>

          )}

          {comments.map(c => (

            <div
              className="comment"
              key={c.id}
            >

              <b>
                @{c.user}
              </b>

              <div
                style={{
                  marginTop: 4
                }}
              >
                {c.text}
              </div>

              <div className="actions">

                <button>
                  👍 {c.likes || 0}
                </button>

                <button
                  onClick={() =>
                    setReplyTo(
                      replyTo === c.id
                        ? null
                        : c.id
                    )
                  }
                >
                  Reply
                </button>

              </div>

              {replyTo === c.id && (

                <div className="row">

                  <input

                    className="input"

                    value={reply}

                    onChange={e =>
                      setReply(
                        e.target.value
                      )
                    }

                    onKeyDown={e =>
                      e.key === "Enter" &&
                      addReply(c.id)
                    }

                    placeholder="Write reply..."
                  />

                  <button
                    onClick={() =>
                      addReply(c.id)
                    }
                  >
                    Reply
                  </button>

                </div>

              )}

              {(c.replies || [])
                .map(r => (

                  <div
                    className="panel"
                    style={{
                      marginLeft: 25
                    }}
                    key={r.id}
                  >

                    <b>
                      @{r.user}
                    </b>

                    <div>
                      {r.text}
                    </div>

                  </div>

                ))}

            </div>

          ))}

        </div>

      </div>
    );
  }

  function HomeList() {

    const title =
      page === "shorts"
        ? "🎬 Shorts"
        : page === "saved"
        ? "💾 Saved"
        : page === "history"
        ? "🕘 Watch History"
        : page === "subscriptions"
        ? "📺 Subscriptions"
        : "🏠 Home";

    return (

      <>

        <h2 className="pageTitle">
          {title}
        </h2>

        {page === "home" && (

          <div className="chips">

            {CATS.map(c => (

              <button

                className={
                  `chip ${
                    cat === c
                      ? "active"
                      : ""
                  }`
                }

                onClick={() =>
                  setCat(c)
                }

                key={c}
              >
                {c}
              </button>

            ))}

          </div>
        )}

        {page === "shorts" ? (

          <div
            style={{
              maxWidth: 520,
              margin: "auto"
            }}
          >

            {filtered.map(v => (

              <div
                className="shortCard"
                key={v.id}
                style={{
                  marginBottom: 18
                }}
              >

                <video

                  className="shortVideo"

                  src={v.src}

                  controls

                  playsInline

                  onDoubleClick={() =>
                    react(
                      v.id,
                      "like"
                    )
                  }
                />

                <div className="shortInfo">

                  <b>
                    {v.title}
                  </b>

                  <div className="muted">

                    @{v.channel}
                    {" • "}
                    {v.views}
                    {" views"}

                  </div>

                  <div className="actions">

                    <button
                      onClick={() =>
                        react(
                          v.id,
                          "like"
                        )
                      }
                    >
                      ❤️ {v.likes}
                    </button>

                    <button
                      onClick={() =>
                        share(v)
                      }
                    >
                      ↗️ Share
                    </button>

                    <button
                      onClick={() =>
                        saveVideo(v)
                      }
                    >
                      💾
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        ) : (

          <div className="grid">

            {filtered.map(v => (

              <Card
                v={v}
                key={v.id}
              />

            ))}

          </div>

        )}

        {!filtered.length && (

          <div className="panel empty">
            No videos found.
          </div>

        )}

      </>
    );
  }

  return (

    <>

      <style>
        {css}
      </style>

      <div className="app">

        <Header />

        <div className="layout">

          <Sidebar />

          <main className="main">

            {page === "watch" ? (

              <Watch />

            ) : page === "creator" ? (

              <Creator
                s={s}
                setPage={setPage}
              />

            ) : page === "profile" ? (

              <Profile
                s={s}
                profileName={
                  profileName
                }
                setProfileName={
                  setProfileName
                }
                updateProfile={
                  updateProfile
                }
              />

            ) : page === "chat" ? (

              <Chat
                s={s}
                chatUser={
                  chatUser
                }
                setChatUser={
                  setChatUser
                }
                chatText={
                  chatText
                }
                setChatText={
                  setChatText
                }
                sendChat={
                  sendChat
                }
              />

            ) : page ===
              "notifications" ? (

              <Notifications
                s={s}
              />

            ) : (

              <HomeList />

            )}

          </main>

        </div>

        <nav className="bottom">

          <button
            onClick={() =>
              go("home")
            }
          >
            🏠
            <br />
            Home
          </button>

          <button
            onClick={() =>
              go("shorts")
            }
          >
            🎬
            <br />
            Shorts
          </button>

          <button
            onClick={() =>
              setShowUpload(true)
            }
          >
            ⬆️
            <br />
            Upload
          </button>

          <button
            onClick={() =>
              go("chat")
            }
          >
            💬
            <br />
            Chat
          </button>

          <button
            onClick={() =>
              go("profile")
            }
          >
            👤
            <br />
            Profile
          </button>

        </nav>

        {showUpload && (

          <ModalUpload

            close={() =>
              setShowUpload(false)
            }

            uploadTitle={
              uploadTitle
            }

            setUploadTitle={
              setUploadTitle
            }

            uploadCat={
              uploadCat
            }

            setUploadCat={
              setUploadCat
            }

            uploadType={
              uploadType
            }

            setUploadType={
              setUploadType
            }

            uploadFile={
              uploadFile
            }

            setUploadFile={
              setUploadFile
            }

            upload={
              upload
            }

          />

        )}

        {showAuth && (

          <div
            className="modalbg"
            onClick={() =>
              setShowAuth(false)
            }
          >

            <div
              className="modal"
              onClick={e =>
                e.stopPropagation()
              }
            >

              <div className="row">

                <h2 className="grow">
                  🔐 Login / Signup
                </h2>

                <button
                  onClick={() =>
                    setShowAuth(false)
                  }
                >
                  ✕
                </button>

              </div>

              <p className="muted">

                This version uses
                a local demo account.
                Real multi-user login
                can be connected to
                Supabase Auth later.

              </p>

              <input
                className="input"
                placeholder="Email"
              />

              <br />
              <br />

              <input
                className="input"
                placeholder="Password"
                type="password"
              />

              <br />
              <br />

              <button
                className="success"
                onClick={() => {

                  setShowAuth(false);

                  alert(
                    "Demo login successful!"
                  );

                }}
              >
                Continue
              </button>

            </div>

          </div>

        )}

        {showChat && (

          <div
            className="modalbg"
            onClick={() =>
              setShowChat(false)
            }
          >

            <div
              className="modal"
              onClick={e =>
                e.stopPropagation()
              }
            >

              <Chat

                s={s}

                chatUser={
                  chatUser
                }

                setChatUser={
                  setChatUser
                }

                chatText={
                  chatText
                }

                setChatText={
                  setChatText
                }

                sendChat={
                  sendChat
                }

              />

            </div>

          </div>

        )}

      </div>

    </>
  );
}

function ModalUpload(p) {

  return (

    <div
      className="modalbg"
      onClick={p.close}
    >

      <div
        className="modal"
        onClick={e =>
          e.stopPropagation()
        }
      >

        <div className="row">

          <h2 className="grow">
            ⬆️ Upload Video
          </h2>

          <button
            onClick={p.close}
          >
            ✕
          </button>

        </div>

        <input

          className="input"

          value={
            p.uploadTitle
          }

          onChange={e =>
            p.setUploadTitle(
              e.target.value
            )
          }

          placeholder="Video title"
        />

        <div
          className="row"
          style={{
            marginTop: 10
          }}
        >

          <select

            className="input"

            value={
              p.uploadType
            }

            onChange={e =>
              p.setUploadType(
                e.target.value
              )
            }
          >

            <option value="long">
              Long Video
            </option>

            <option value="short">
              Shorts
            </option>

          </select>

          <select

            className="input"

            value={
              p.uploadCat
            }

            onChange={e =>
              p.setUploadCat(
                e.target.value
              )
            }
          >

            {CATS.slice(1).map(c => (

              <option key={c}>
                {c}
              </option>

            ))}

          </select>

        </div>

        <div
          className="file"
          style={{
            marginTop: 10
          }}
        >

          <input

            type="file"

            accept="video/*"

            onChange={e =>
              p.setUploadFile(
                e.target.files?.[0] ||
                null
              )
            }

          />

          {p.uploadFile && (

            <div
              className="muted"
              style={{
                marginTop: 8
              }}
            >
              Selected:
              {" "}
              {p.uploadFile.name}
            </div>

          )}

        </div>

        <p className="muted">

          Local demo upload:
          the selected video is
          stored temporarily in
          the browser. Online
          storage needs Supabase
          Storage.

        </p>

        <button
          className="success"
          onClick={p.upload}
        >
          Upload
        </button>

      </div>

    </div>
  );
}

function Creator({ s, setPage }) {

  const mine =
    s.videos.filter(
      v =>
        v.channel ===
        s.profile.name
    );

  const views =
    mine.reduce(
      (a, v) =>
        a + (v.views || 0),
      0
    );

  const likes =
    mine.reduce(
      (a, v) =>
        a + (v.likes || 0),
      0
    );

  return (

    <div>

      <div className="row">

        <h2>
          💰 Creator Studio
        </h2>

        <span className="grow" />

        <button
          onClick={() =>
            setPage("home")
          }
        >
          Home
        </button>

      </div>

      <div className="statgrid">

        <div className="stat">

          <b>
            {mine.length}
          </b>

          <div className="muted">
            Videos
          </div>

        </div>

        <div className="stat">

          <b>
            {views}
          </b>

          <div className="muted">
            Views
          </div>

        </div>

        <div className="stat">

          <b>
            {likes}
          </b>

          <div className="muted">
            Likes
          </div>

        </div>

      </div>

      <div className="panel">

        <h3>
          Estimated earnings
        </h3>

        <div
          style={{
            fontSize: 28
          }}
        >
          ₹
          {Number(
            s.earnings || 0
          ).toFixed(2)}
        </div>

        <p className="muted">

          Demo balance only.
          Real creator payouts
          require proper payment,
          identity/age verification
          and applicable legal
          requirements.

        </p>

      </div>

      <div className="panel">

        <h3>
          Your videos
        </h3>

        {mine.length === 0 && (

          <div className="empty">
            No uploaded videos yet.
          </div>

        )}

        {mine.map(v => (

          <div
            className="row panel"
            key={v.id}
          >

            <b className="grow">
              {v.title}
            </b>

            <span>
              {v.views} views
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}

function Profile({
  s,
  profileName,
  setProfileName,
  updateProfile
}) {

  return (

    <div>

      <h2>
        👤 Profile / Channel
      </h2>

      <div className="panel">

        <h3>
          Channel settings
        </h3>

        <input

          className="input"

          value={profileName}

          onChange={e =>
            setProfileName(
              e.target.value
            )
          }

          placeholder="Channel name"
        />

        <br />
        <br />

        <button
          className="success"
          onClick={
            updateProfile
          }
        >
          Save Profile
        </button>

        <p className="muted">

          {s.profile.handle}
          {" • "}
          {s.profile.bio}

        </p>

      </div>

      <div className="panel">

        <h3>
          Account
        </h3>

        <p>
          Channel:
          {" "}
          <b>
            {s.profile.name}
          </b>
        </p>

        <p>
          Subscribers:
          {" "}
          Demo mode
        </p>

      </div>

    </div>
  );
}

function Notifications({ s }) {

  return (

    <div>

      <h2>
        🔔 Notifications
      </h2>

      {s.notifications.length ? (

        s.notifications.map(n => (

          <div
            className="panel"
            key={n.id}
          >

            {n.text}

            <div className="muted">
              {n.time}
            </div>

          </div>

        ))

      ) : (

        <div className="panel empty">
          No notifications yet.
        </div>

      )}

    </div>
  );
}

function Chat({
  s,
  chatUser,
  setChatUser,
  chatText,
  setChatText,
  sendChat
}) {

  const messages =
    s.chats.filter(
      x =>
        x.user === chatUser ||
        x.mine
    );

  return (

    <div>

      <div className="row">

        <h2 className="grow">
          💬 Chat
        </h2>

      </div>

      <div className="row">

        <button

          className={
            chatUser ===
            "PlayVideo Creator"
              ? "active"
              : ""
          }

          onClick={() =>
            setChatUser(
              "PlayVideo Creator"
            )
          }
        >
          Creator
        </button>

        <button

          className={
            chatUser === "Friend"
              ? "active"
              : ""
          }

          onClick={() =>
            setChatUser(
              "Friend"
            )
          }
        >
          Friend
        </button>

      </div>

      <div className="messages">

        {messages.length === 0 && (

          <div className="empty">
            Start a conversation.
          </div>

        )}

        {messages.map(m => (

          <div
            className={
              `bubble ${
                m.mine
                  ? "mine"
                  : ""
              }`
            }
            key={m.id}
          >

            <b>
              {m.mine
                ? "You"
                : m.user}
            </b>

            <br />

            {m.text}

            <div className="muted">
              {m.time}
            </div>

          </div>

        ))}

      </div>

      <div
        className="row"
        style={{
          marginTop: 10
        }}
      >

        <input

          className="input"

          value={chatText}

          onChange={e =>
            setChatText(
              e.target.value
            )
          }

          onKeyDown={e =>
            e.key === "Enter" &&
            sendChat()
          }

          placeholder="Message..."
        />

        <button
          className="success"
          onClick={
            sendChat
          }
        >
          Send
        </button>

      </div>

      <p className="muted">

        Demo chat is stored only
        in this browser. Real
        user-to-user chat needs
        Supabase Realtime.

      </p>

    </div>
  );
}
