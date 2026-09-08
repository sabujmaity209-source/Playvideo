import React, { useState, useEffect, useRef } from 'react';

const initialVideos = [
  { id: 1, title: "Building PlayVideo - The Ultimate Platform (2026)", channel: "TechVision Code", views: "842K", time: "2 hours ago", duration: "09:56", thumb: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600", avatar: "https://i.pravatar.cc/40?img=11", verified: true, videoUrl: "" },
  { id: 2, title: "Cyberpunk Lo-Fi Chill Beats - Live", channel: "Lofi Beats Station", views: "1.2M", time: "1 day ago", duration: "15:40", thumb: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600", avatar: "https://i.pravatar.cc/40?img=12", verified: true, videoUrl: "" },
];

const shortsData = [
  { id: 1, url: "https://www.w3schools.com/html/mov_bbb.mp4", title: "PlayVideo Shorts 🔥 #shorts" },
  { id: 2, url: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4", title: "Funny Moment 😂 #funny" },
];

const categories = ["All", "Coding", "Music", "Tech", "Gaming", "AI", "Space"];

const chatUsers = [
  { id: 1, name: "Sabuj Maity", username: "sabuj_coder", avatar: "https://i.pravatar.cc/100?img=11", online: true },
  { id: 2, name: "Rahul Gaming", username: "rahul_gamer", avatar: "https://i.pravatar.cc/100?img=12", online: true },
  { id: 3, name: "Priya Music", username: "priya_music", avatar: "https://i.pravatar.cc/100?img=5", online: false },
  { id: 4, name: "Code Boss", username: "code_boss", avatar: "https://i.pravatar.cc/100?img=15", online: true },
];

export default function App() {
  const [page, setPage] = useState("home");
  const [activeCat, setActiveCat] = useState("All");
  const [videos, setVideos] = useState(initialVideos);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [chats, setChats] = useState({
    1: [{ from: "them", text: "Hey Boss! PlayVideo kemon lagche?" }],
    2: [{ from: "them", text: "Shorts ta dekhecho? 🔥" }],
    3: [{ from: "them", text: "New song upload korechi!" }],
    4: [{ from: "them", text: "Coding help lagbe?" }],
  });
  const fileRef = useRef(null);
  const shortsRefs = useRef([]);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.play().catch(()=>{});
        else e.target.pause();
      });
    }, { threshold: 0.7 });
    shortsRefs.current.forEach(v => v && obs.observe(v));
    return () => obs.disconnect();
  }, [page]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const newVid = {
      id: Date.now(),
      title: uploadTitle || file.name,
      channel: "You",
      views: "0",
      time: "Just now",
      duration: "00:30",
      thumb: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600",
      avatar: "https://i.pravatar.cc/40?img=20",
      verified: false,
      videoUrl: url
    };
    setVideos([newVid,...videos]);
    setShowUpload(false);
    setUploadTitle("");
    setPage("library");
  };

  const sendMsg = () => {
    if (!chatInput.trim() ||!selectedUser) return;
    const id = selectedUser.id;
    setChats(prev => ({...prev, [id]: [...(prev[id]||[]), { from: "me", text: chatInput }] }));
    setChatInput("");
    setTimeout(() => {
      const replies = ["Haa Boss! 😊", "Ekdom thik!", "PlayVideo te dekha hobe!", "🔥🔥", "Nice!"];
      const r = replies[Math.floor(Math.random()*replies.length)];
      setChats(prev => ({...prev, [id]: [...prev[id], { from: "them", text: r }] }));
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <header className="h-14 flex items-center justify-between px-4 sticky top-0 bg-[#0f0f0f] z-50 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span>☰</span>
          <div className="flex items-center gap-1">
            <div className="w-7 h-7 bg-red-600 rounded flex items-center justify-center text-xs">▶</div>
            <span className="font-bold text-lg">Play<span className="text-red-600">Video</span></span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={()=>setShowUpload(true)} className="w-8 h-8 bg-[#272727] rounded-full text-sm">📹</button>
          <img src="https://i.pravatar.cc/40?img=20" className="w-8 h-8 rounded-full" alt="profile" />
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto px-3 py-3 bg-[#0f0f0f] sticky top-14 z-40 border-b border-zinc-800">
        {categories.map(c => (
          <button key={c} onClick={()=>setActiveCat(c)} className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${activeCat===c? 'bg-white text-black' : 'bg-[#272727]'}`}>{c}</button>
        ))}
      </div>

      <main className="pb-20">
        {page==="home" && videos.map(v => (
          <div key={v.id} className="mb-4">
            <div className="relative bg-zinc-900">
              {v.videoUrl? <video src={v.videoUrl} controls className="w-full aspect-video" /> : <img src={v.thumb} alt="thumb" className="w-full aspect-video object-cover" />}
              <span className="absolute bottom-2 right-2 bg-black/80 text-xs px-1.5 py-0.5 rounded">{v.duration}</span>
            </div>
            <div className="flex gap-3 p-3">
              <img src={v.avatar} className="w-9 h-9 rounded-full" alt="avatar" />
              <div><h3 className="font-bold text-[15px] leading-5 line-clamp-2">{v.title}</h3><p className="text-sm text-zinc-400">{v.channel} {v.verified?"✓":""}</p><p className="text-xs text-zinc-400">{v.views} views • {v.time}</p></div>
            </div>
          </div>
        ))}

        {page==="shorts" && (
          <div className="h-[calc(100vh-120px)] bg-black overflow-y-scroll snap-y snap-mandatory flex flex-col items-center">
            {shortsData.map((s,i)=>(
              <div key={s.id} className="h-full w-full max-w-[380px] snap-start relative bg-zinc-900 shrink-0">
                <video ref={el=>shortsRefs.current[i]=el} src={s.url} loop muted playsInline className="h-full w-full object-cover" />
                <div className="absolute left-3 bottom-6 font-bold text-sm">{s.title}</div>
              </div>
            ))}
          </div>
        )}

        {page==="library" && (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">📚 Library</h2>
            {videos.filter(v=>v.channel==="You").length===0? <p className="text-zinc-400 text-sm">Kono video upload koroni Boss! Niche + diye upload koro.</p> :
              videos.filter(v=>v.channel==="You").map(v=>(
                <div key={v.id} className="flex gap-3 mb-3 bg-[#272727] p-2 rounded-xl"><img src={v.thumb} className="w-20 h-14 rounded-lg object-cover" alt="thumb" /><div><p className="text-sm font-bold line-clamp-2">{v.title}</p><p className="text-xs text-zinc-400">{v.time}</p></div></div>
              ))
            }
          </div>
        )}

        {page==="subs" && (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">📺 Subscriptions</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {chatUsers.map(u=>(<div key={u.id} className="flex flex-col items-center shrink-0"><img src={u.avatar} className="w-14 h-14 rounded-full" alt="avatar" /><span className="text-xs mt-1">{u.name.split(" ")[0]}</span></div>))}
            </div>
            {videos.map(v=>(<div key={v.id} className="flex gap-3 mb-4"><img src={v.thumb} className="w-28 h-16 rounded-xl object-cover" alt="thumb" /><div><p className="text-sm font-bold line-clamp-2">{v.title}</p><p className="text-xs text-zinc-400">{v.channel}</p></div></div>))}
          </div>
        )}
      </main>

      {showUpload && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] p-4">
          <div className="bg-[#212121] w-full max-w-sm rounded-2xl p-5">
            <div className="flex justify-between mb-4"><h3 className="font-bold">Upload Video</h3><button onClick={()=>setShowUpload(false)}>✕</button></div>
            <input value={uploadTitle} onChange={e=>setUploadTitle(e.target.value)} placeholder="Video Title" className="w-full bg-[#3f3f3f] rounded-lg px-4 py-2 mb-4 outline-none text-sm" />
            <input type="file" accept="video/*" ref={fileRef} onChange={handleUpload} className="hidden" />
            <button onClick={()=>fileRef.current.click()} className="w-full bg-red-600 py-3 rounded-full font-bold text-sm">📁 Video Select Koro</button>
            <p className="text-xs text-zinc-400 mt-3 text-center">Select korle Library te chole jabe</p>
          </div>
        </div>
      )}

      <button onClick={()=>setShowChat(true)} className="fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-full flex items-center justify-center text-xl shadow-lg z-50">💬</button>

      {showChat && (
        <div className="fixed inset-0 bg-[#0f0f0f] z-[100] flex flex-col">
          <div className="h-14 flex items-center gap-3 px-4 border-b border-zinc-800">
            <button onClick={()=> selectedUser? setSelectedUser(null) : setShowChat(false)} className="text-xl">←</button>
            {selectedUser? <><img src={selectedUser.avatar} className="w-8 h-8 rounded-full" alt="avatar" /><div><p className="font-bold text-sm">{selectedUser.name}</p><p className="text-xs text-zinc-400">{selectedUser.online?"Active now":"Offline"}</p></div></> : <p className="font-bold">Chats</p>}
          </div>
          {!selectedUser? (
            <div className="flex-1 overflow-y-auto">
              <div className="p-3"><input placeholder="Search" className="w-full bg-[#272727] rounded-full px-4 py-2 text-sm outline-none" /></div>
              {chatUsers.map(u=>(
                <div key={u.id} onClick={()=>setSelectedUser(u)} className="flex items-center gap-3 px-4 py-3 hover:bg-[#272727] cursor-pointer">
                  <div className="relative"><img src={u.avatar} className="w-12 h-12 rounded-full" alt="avatar" />{u.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>}</div>
                  <div className="flex-1"><p className="font-semibold text-sm">{u.name}</p><p className="text-xs text-zinc-400 truncate">{chats[u.id]?.slice(-1)[0]?.text}</p></div>
                  <span className="text-zinc-500">›</span>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {(chats[selectedUser.id]||[]).map((m,i)=>(
                  <div key={i} className={`flex ${m.from==='me'?'justify-end':'justify-start'}`}><div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${m.from==='me'?'bg-[#0095f6] rounded-br-sm':'bg-[#262626] rounded-bl-sm'}`}>{m.text}</div></div>
                ))}
              </div>
              <div className="p-3 flex gap-2 border-t border-zinc-800"><input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMsg()} placeholder={`Message ${selectedUser.name}...`} className="flex-1 bg-[#262626] rounded-full px-4 py-2.5 text-sm outline-none" /><button onClick={sendMsg} className="text-[#0095f6] font-bold text-sm px-2">Send</button></div>
            </>
          )}
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 h-16 bg-[#0f0f0f] border-t border-zinc-800 flex justify-around items-center z-40">
        <button onClick={()=>setPage("home")} className={`flex flex-col items-center ${page==='home'?'text-white':'text-zinc-400'}`}><span className="text-xl">🏠</span><span className="text-[10px]">Home</span></button>
        <button onClick={()=>setPage("shorts")} className={`flex flex-col items-center ${page==='shorts'?'text-white':'text-zinc-400'}`}><span className="text-xl">🎬</span><span className="text-[10px]">Shorts</span></button>
        <button onClick={()=>setShowUpload(true)} className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center -mt-2 text-xl">＋</button>
        <button onClick={()=>setPage("subs")} className={`flex flex-col items-center ${page==='subs'?'text-white':'text-zinc-400'}`}><span className="text-xl">📺</span><span className="text-[10px]">Subs</span></button>
        <button onClick={()=>setPage("library")} className={`flex flex-col items-center ${page==='library'?'text-white':'text-zinc-400'}`}><span className="text-xl">📚</span><span className="text-[10px]">Library</span></button>
      </div>
    </div>
  );
}
