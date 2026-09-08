import React, { useState, useEffect, useRef } from 'react';

const initialVideos = [
  { id: 1, title: "Building PlayVideo - The Ultimate Video Streaming Platform (2026)", channel: "TechVision Code", views: "842,000", time: "2 hours ago", duration: "09:56", thumb: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600", avatar: "https://i.pravatar.cc/40?img=11", verified: true, videoUrl: "" },
  { id: 2, title: "Cyberpunk Nightscape Lo-Fi Chill Beats", channel: "Lofi Beats Station", views: "1,250,000", time: "1 day ago", duration: "15:40", thumb: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600", avatar: "https://i.pravatar.cc/40?img=12", verified: true, videoUrl: "" },
];

const shortsData = [
  { id: 1, url: "https://www.w3schools.com/html/mov_bbb.mp4", title: "This is PlayVideo Shorts 🔥" },
  { id: 2, url: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4", title: "Coding Hack #shorts" },
];

const categories = ["All", "Coding", "Music", "Tech", "Gaming", "AI", "Space"];

// INSTAGRAM ER MOTO CHAT USERS
const chatUsersList = [
  { id: 1, name: "Sabuj Maity", username: "sabuj_coder", avatar: "https://i.pravatar.cc/100?img=11", online: true },
  { id: 2, name: "Rahul Gaming", username: "rahul_gamer", avatar: "https://i.pravatar.cc/100?img=12", online: true },
  { id: 3, name: "Priya Music", username: "priya_music", avatar: "https://i.pravatar.cc/100?img=5", online: false },
  { id: 4, name: "Code Boss", username: "code_boss", avatar: "https://i.pravatar.cc/100?img=15", online: true },
  { id: 5, name: "Tech Vision", username: "tech_vision", avatar: "https://i.pravatar.cc/100?img=20", online: false },
];

export default function App() {
  const [page, setPage] = useState("home");
  const [activeCat, setActiveCat] = useState("All");
  const [videos, setVideos] = useState(initialVideos);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");

  // INSTAGRAM CHAT SYSTEM
  const [showChat, setShowChat] = useState(false);
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [chatMessages, setChatMessages] = useState({
    1: [{ from: "them", text: "Hey Boss! PlayVideo kemon lagche?" }],
    2: [{ from: "them", text: "Shorts ta dekhecho? 🔥" }],
    3: [{ from: "them", text: "New song upload korechi!" }],
    4: [{ from: "them", text: "Coding help lagbe?" }],
    5: [{ from: "them", text: "Welcome to PlayVideo!" }],
  });
  const [chatInput, setChatInput] = useState("");
  const fileInputRef = useRef(null);
  const shortsRefs = useRef([]);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => e.isIntersecting? e.target.play().catch(()=>{}) : e.target.pause());
    }, { threshold: 0.7 });
    shortsRefs.current.forEach(v => v && obs.observe(v));
    return () => obs.disconnect();
  }, [page]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const url = URL.createObjectURL(file);
    const newVideo = {
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
    setVideos([newVideo,...videos]);
    setShowUpload(false);
    setUploadTitle("");
    setPage("library");
  };

  const sendChatMsg = () => {
    if(!chatInput.trim() ||!selectedChatUser) return;
    const userId = selectedChatUser.id;
    setChatMessages(prev => ({
     ...prev,
      [userId]: [...(prev[userId]||[]), { from: "me", text: chatInput }]
    }));
    setChatInput("");
    // Instagram er moto auto reply - mone hobe samner jon reply dicche
    setTimeout(()=>{
      const replies = ["Haa Boss! 😊", "Ekdom thik bolecho!", "PlayVideo te dekha hobe!", "🔥🔥", "Nice! Ami o upload korbo"];
      setChatMessages(prev => ({
       ...prev,
        [userId]: [...prev[userId], { from: "them", text: replies[Math.floor(Math.random()*replies.length)] }]
      }));
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col">
      <header className="h-[56px] flex items-center justify-between px-4 sticky top-0 bg-[#0f0f0f] z-50">
        <div className="flex items-center gap-4">
          <span className="text-xl">☰</span>
          <div className="flex items-center gap-1">
            <div className="w-7 h-7 bg-red-600 rounded flex items-center justify-center">▶</div>
            <span className="font-bold text-[20px]">Play<span className="text-red-600">Video</span></span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={()=>setShowUpload(true)} className="w-9 h-9 bg-[#272727] rounded-full">📹</button>
          <button className="w-9 h-9 bg-[#272727] rounded-full">🔔</button>
          <img src="https://i.pravatar.cc/40?img=20" className="w-8 h-8 rounded-full" />
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto px-3 py-3 bg-[#0f0f0f] sticky top-[56px] z-40 no-scrollbar border-b border-zinc-800">
        {categories.map(c => (
          <button key={c} onClick={()=>setActiveCat(c)} className={`px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap ${activeCat===c? 'bg-white text-black' : 'bg-[#272727]'}`}>{c}</button>
        ))}
      </div>

      <main className="flex-1 pb-[70px]">
        {page==="home" && (
          <div>
            {videos.map(v => (
              <div key={v.id} className="mb-4">
                <div className="relative bg-zinc-900">
                  {v.videoUrl? <video src={v.videoUrl} controls className="w-full aspect-video" /> : <img src={v.thumb} className="w-full aspect-video object-cover" />}
                  <span className="absolute bottom-2 right-2 bg-black/80 text-xs px-1.5 py-0.5 rounded">{v.duration}</span>
                </div>
                <div className="flex gap-3 p-3">
                  <img src={v.avatar} className="w-9 h-9 rounded-full" />
                  <div><h3 className="font-bold text-[16px] line-clamp-2">{v.title}</h3><p className="text-[14px] text-zinc-400">{v.channel}</p></div>
                </div>
              </div>
            ))}
          </div>
        )}
        {page==="shorts" && (
          <div className="h-[calc(100vh-126px)] bg-black overflow-y-scroll snap-y snap-mandatory flex flex-col items-center">
            {shortsData.map((s,i)=>(<div key={s.id} className="h-full w-full max-w-[380px] snap-start relative bg-zinc-900"><video ref={el=>shortsRefs.current[i]=el} src={s.url} loop muted playsInline className="h-full w-full object-cover" /><div className="absolute left-3 bottom-6 font-bold text-sm">{s.title}</div></div>))}
          </div>
        )}
        {page==="library" && (
          <div className="p-4"><h2 className="text-xl font-bold mb-4">📚 Library</h2>{videos.filter(v=>v.channel==="You").length===0? <p className="text-zinc-400">Kono video upload koroni! + diye koro.</p> : videos.filter(v=>v.channel==="You").map(v=>(<div key={v.id} className="flex gap-3 mb-3 bg-[#272727] p-2 rounded-xl"><img src={v.thumb} className="w-24 h-16 rounded-lg object-cover" /><div><p className="font-bold text-sm">{v.title}</p><p className="text-xs text-zinc-400">{v.time}</p></div></div>))}</div>
        )}
        {page==="subs" && (
          <div className="p-4"><h2 className="text-xl font-bold mb-4">📺 Subscriptions</h2><div className="flex gap-4 overflow-x-auto">{chatUsersList.map(c=>(<div key={c.id} className="flex flex-col items-center shrink-0"><img src={c.avatar} className="w-14 h-14 rounded-full" /><span className="text-xs mt-1">{c.name.split(" ")[0]}</span></div>))}</div></div>
        )}
      </main>

      {/* UPLOAD MODAL */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] p-4">
          <div className="bg-[#212121] w-full max-w-sm rounded-2xl p-5">
            <div className="flex justify-between mb-4"><h3 className="font-bold">Upload Video</h3><button onClick={()=>setShowUpload(false)}>✕</button></div>
            <input value={uploadTitle} onChange={e=>setUploadTitle(e.target.value)} placeholder="Title" className="w-full bg-[#3f3f3f] rounded-lg px-4 py-2 mb-4 outline-none" />
            <input type="file" accept="video/*" ref={fileInputRef} onChange={handleUpload} className="hidden" />
            <button onClick={()=>fileInputRef.current.click()} className="w-full bg-red-600 py-3 rounded-full font-bold">📁 Select Video</button>
          </div>
        </div>
      )}

      {/* INSTAGRAM STYLE CHAT BUTTON */}
      <button onClick={()=>setShowChat(true)} className="fixed bottom-[80px] right-4 w-14 h-14 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-full flex items-center justify-center text-xl shadow-lg z-50">💬</button>

      {/* INSTAGRAM DM STYLE CHAT - SOBAI SOBAI KE */}
      {showChat && (
        <div className="fixed inset-0 bg-[#0f0f0f] z-[100] flex flex-col">
          {/* CHAT HEADER */}
          <div className="h-[56px] flex items-center gap-3 px-4 border-b border-zinc-800 bg-[#0f0f0f]">
            <button onClick={()=> selectedChatUser? setSelectedChatUser(null) : setShowChat(false)} className="text-xl">←</button>
            {selectedChatUser? (
              <><img src={selectedChatUser.avatar} className="w-8 h-8 rounded-full" /><div><p className="font-bold text-sm">{selectedChatUser.name}</p><p className="text-xs text-zinc-400">{selectedChatUser.online? 'Active now': 'Offline'}</p></div></>
            ) : (
              <p className="font-bold">Chats - Instagram Style</p>
            )}
          </div>

          {!selectedChatUser? (
            // USER LIST - JAKE KHUSI
