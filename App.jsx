import React, { useState, useEffect, useRef } from 'react';

const videos = [
  { id: 1, title: "Building PlayVideo - The Ultimate Video Streaming Platform (2026)", channel: "TechVision Code", views: "842,000 views", time: "2 hours ago", duration: "09:56", thumb: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600", avatar: "https://i.pravatar.cc/40?img=11", verified: true },
  { id: 2, title: "Cyberpunk Nightscape Lo-Fi Chill Beats [24/7 Live Stream]", channel: "Lofi Beats Station", views: "1,250,000 views", time: "1 day ago", duration: "15:40", thumb: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600", avatar: "https://i.pravatar.cc/40?img=12", verified: true },
  { id: 3, title: "Learn Tailwind CSS - Full Course for Beginners", channel: "Code Master", views: "500K views", time: "3 days ago", duration: "22:10", thumb: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600", avatar: "https://i.pravatar.cc/40?img=15", verified: false },
];

const shortsData = [
  { id: 1, url: "https://www.w3schools.com/html/mov_bbb.mp4", title: "This is PlayVideo Shorts 🔥" },
  { id: 2, url: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4", title: "Coding Hack #shorts" },
];

const categories = ["All", "Coding", "Music", "Tech", "Gaming", "AI", "Space", "Comedy", "News"];

export default function App() {
  const [page, setPage] = useState("home");
  const [activeCat, setActiveCat] = useState("All");
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([{ from: "bot", text: "Hi! PlayVideo Chat e welcome! 👋" }]);
  const [input, setInput] = useState("");
  const shortsRefs = useRef([]);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => e.isIntersecting? e.target.play().catch(()=>{}) : e.target.pause());
    }, { threshold: 0.7 });
    shortsRefs.current.forEach(v => v && obs.observe(v));
    return () => obs.disconnect();
  }, [page]);

  const sendMsg = () => {
    if(!input.trim()) return;
    setMessages([...messages, { from: "me", text: input }]);
    setInput("");
    setTimeout(()=> setMessages(m=>[...m, { from: "bot", text: "Nice! 😊" }]), 800);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col">
      {/* HEADER - PHOTO R MOTO */}
      <header className="h-[56px] flex items-center justify-between px-4 sticky top-0 bg-[#0f0f0f] z-50">
        <div className="flex items-center gap-4">
          <button className="text-xl">☰</button>
          <div className="flex items-center gap-1">
            <div className="w-7 h-7 bg-red-600 rounded flex items-center justify-center">▶</div>
            <span className="font-bold text-[20px]">Play<span className="text-red-600">Video</span></span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 bg-[#272727] rounded-full flex items-center justify-center">📹</button>
          <button className="w-9 h-9 bg-[#272727] rounded-full flex items-center justify-center">🔔</button>
          <img src="https://i.pravatar.cc/40?img=20" className="w-8 h-8 rounded-full" />
        </div>
      </header>

      {/* CATEGORY PILLS - PHOTO R MOTO */}
      <div className="flex gap-2 overflow-x-auto px-3 py-3 bg-[#0f0f0f] sticky top-[56px] z-40 no-scrollbar border-b border-zinc-800">
        {categories.map(c => (
          <button key={c} onClick={()=>setActiveCat(c)} className={`px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap shrink-0 ${activeCat===c? 'bg-white text-black' : 'bg-[#272727] text-white'}`}>{c}</button>
        ))}
      </div>

      <main className="flex-1 pb-[70px]">
        {page==="home" && (
          <div className="p-0">
            {videos.map(v => (
              <div key={v.id} className="mb-4">
                <div className="relative">
                  <img src={v.thumb} className="w-full aspect-video object-cover" />
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">{v.duration}</span>
                </div>
                <div className="flex gap-3 p-3">
                  <img src={v.avatar} className="w-9 h-9 rounded-full mt-1" />
                  <div className="flex-1">
                    <h3 className="font-bold text-[16px] leading-[20px] line-clamp-2">{v.title}</h3>
                    <p className="text-[14px] text-zinc-400 mt-1 flex items-center gap-1">{v.channel} {v.verified && "✓"}</p>
                    <p className="text-[13px] text-zinc-400">{v.views} • {v.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {page==="shorts" && (
          <div className="h-[calc(100vh-126px)] bg-black overflow-y-scroll snap-y snap-mandatory flex flex-col items-center">
            {shortsData.map((s,i)=>(
              <div key={s.id} className="h-full w-full max-w-[380px] snap-start relative shrink-0 bg-zinc-900">
                <video ref={el=>shortsRefs.current[i]=el} src={s.url} loop muted playsInline className="h-full w-full object-cover" />
                <div className="absolute left-3 bottom-6 text-white font-bold text-sm">{s.title}</div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* CHAT BUTTON - ALADA OPTION */}
      <button onClick={()=>setShowChat(true)} className="fixed bottom-[80px] right-4 w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-xl shadow-lg z-50">💬</button>

      {/* CHAT BOX */}
      {showChat && (
        <div className="fixed bottom-0 right-0 left-0 sm:left-auto sm:w-[350px] h-[420px] bg-[#212121] border-t sm:border border-zinc-700 rounded-t-2xl flex flex-col z-[100]">
          <div className="h-12 flex items-center justify-between px-4 border-b border-zinc-700">
            <span className="font-bold">PlayVideo Chat</span>
            <button onClick={()=>setShowChat(false)} className="text-xl">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((m,i)=>(
              <div key={i} className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${m.from==='me'?'bg-red-600 ml-auto':'bg-zinc-700'}`}>{m.text}</div>
            ))}
          </div>
          <div className="p-2 flex gap-2 border-t border-zinc-700">
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMsg()} placeholder="Type message..." className="flex-1 bg-[#3f3f3f] rounded-full px-4 py-2 text-sm outline-none" />
            <button onClick={sendMsg} className="bg-red-600 px-4 rounded-full">➤</button>
          </div>
        </div>
      )}

      {/* BOTTOM NAV - PHOTO R MOTO SAME */}
      <div className="fixed bottom-0 left-0 right-0 h-[64px] bg-[#0f0f0f] border-t border-zinc-800 flex justify-around items-center z-40">
        <button onClick={()=>setPage("home")} className={`flex flex-col items-center ${page==='home'?'text-white':'text-zinc-400'}`}><span className="text-[22px]">🏠</span><span className="text-[10px] mt-1">Home</span></button>
        <button onClick={()=>setPage("shorts")} className={`flex flex-col items-center ${page==='shorts'?'text-white':'text-zinc-400'}`}><span className="text-[22px]">🎬</span><span className="text-[10px] mt-1">Shorts</span></button>
        <button className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center -mt-2"><span className="text-xl">＋</span></button>
        <button className="flex flex-col items-center text-zinc-400"><span className="text-[22px]">📺</span><span className="text-[10px] mt-1">Subs</span></button>
        <button className="flex flex-col items-center text-zinc-400"><span className="text-[22px]">📚</span><span className="text-[10px] mt-1">Library</span></button>
      </div>
    </div>
  );
}
