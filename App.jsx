
import React, { useState, useEffect, useRef } from 'react';

// --- LOGO ---
const PlayVideoLogo = () => (
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-black">▶</div>
    <span className="font-black text-xl">Playvideo</span>
  </div>
);

// --- DATA ---
const categories = ["All", "Coding", "Music", "Tech", "Trending", "Gaming", "News", "Movies"];
const videos = [
  { id: 1, title: "The Last of Us Part II - Full Gameplay", channel: "GameWorld", views: "2.1M", time: "09:56", thumb: "https://i.ytimg.com/vi/W01L70IGBgE/mqdefault.jpg", avatar: "https://i.pravatar.cc/40?img=1" },
  { id: 2, title: "I Built Same App in 5 Languages", channel: "Sabuj Maity", views: "500K", time: "15:40", thumb: "https://i.ytimg.com/vi/dGcsHMXbSOA/mqdefault.jpg", avatar: "https://i.pravatar.cc/40?img=2" },
  { id: 3, title: "Learn Tailwind CSS Full Course", channel: "Design Pro", views: "800K", time: "22:10", thumb: "https://i.ytimg.com/vi/lCxcTsOHrjo/mqdefault.jpg", avatar: "https://i.pravatar.cc/40?img=3" },
  { id: 4, title: "React 19 New Features", channel: "Code Boss", views: "1.2M", time: "12:30", thumb: "https://i.ytimg.com/vi/w7ejDZ8SWv8/mqdefault.jpg", avatar: "https://i.pravatar.cc/40?img=4" },
];

const shortsData = [
  { id: 1, url: "https://www.w3schools.com/html/mov_bbb.mp4", title: "Amazing Nature #shorts" },
  { id: 2, url: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4", title: "Funny Moment 😂 #funny" },
  { id: 3, url: "https://www.w3schools.com/html/movie.mp4", title: "Coding in 10s #coding" },
];

// --- FIXED SHORTS (Ager moto lomba) ---
const ShortsPage = () => {
  const refs = useRef([]);
  useEffect(() => {
    const obs = new IntersectionObserver((es) => es.forEach(e => e.isIntersecting? e.target.play().catch(()=>{}) : e.target.pause()), {threshold:0.7});
    refs.current.forEach(v=>v&&obs.observe(v));
    return ()=>obs.disconnect();
  }, []);
  return (
    <div className="h-[calc(100vh-120px)] bg-black overflow-y-scroll snap-y snap-mandatory flex flex-col items-center">
      {shortsData.map((s,i)=>(
        <div key={s.id} className="h-full w-full max-w-[360px] snap-start relative flex-shrink-0 bg-zinc-900">
          <video ref={el=>refs.current[i]=el} src={s.url} loop muted playsInline className="h-full w-full object-cover" />
          <div className="absolute left-3 bottom-4 text-white text-sm font-bold">{s.title}</div>
        </div>
      ))}
    </div>
  );
};

// --- HOME (Ager moto) ---
const HomePage = ({ activeCat, setActiveCat }) => (
  <div className="pb-20">
    <div className="flex gap-2 overflow-x-auto p-3 sticky top-16 bg-white z-10 no-scrollbar">
      {categories.map(c => (
        <button key={c} onClick={()=>setActiveCat(c)} className={`px-4 py-1.5 rounded-lg text-sm whitespace-nowrap ${activeCat===c? 'bg-black text-white' : 'bg-zinc-100'}`}>{c}</button>
      ))}
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-3">
      {videos.map(v=>(
        <div key={v.id} className="cursor-pointer">
          <div className="relative">
            <img src={v.thumb} className="w-full rounded-xl aspect-video object-cover" />
            <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">{v.time}</span>
          </div>
          <div className="flex gap-2 mt-2">
            <img src={v.avatar} className="w-9 h-9 rounded-full" />
            <div>
              <h3 className="font-semibold text-[15px] leading-tight line-clamp-2">{v.title}</h3>
              <p className="text-xs text-zinc-500 mt-1">{v.channel}</p>
              <p className="text-xs text-zinc-500">{v.views} views • 2 days ago</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function App() {
  const [page, setPage] = useState("home");
  const [cat, setCat] = useState("All");
  return (
    <div className="min-h-screen bg-white text-black">
      <header className="h-16 border-b flex items-center justify-between px-4 sticky top-0 bg-white z-20">
        <PlayVideoLogo />
        <div className="flex-1 max-w-md mx-4 hidden sm:flex"><input placeholder="Search" className="w-full border rounded-full px-4 py-1.5 bg-zinc-100" /></div>
        <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
      </header>
      <main>
        {page==="home"? <HomePage activeCat={cat} setActiveCat={setCat} /> : <ShortsPage />}
      </main>
      {/* BOTTOM NAV - Ager moto */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex justify-around items-center z-30">
        <button onClick={()=>setPage("home")} className={`flex flex-col items-center ${page==='home'?'font-bold':''}`}><span>🏠</span><span className="text-[10px]">Home</span></button>
        <button onClick={()=>setPage("shorts")} className={`flex flex-col items-center ${page==='shorts'?'font-bold':''}`}><span>🎬</span><span className="text-[10px]">Shorts</span></button>
        <button className="flex flex-col items-center"><span>📺</span><span className="text-[10px]">Subs</span></button>
        <button className="flex flex-col items-center"><span>📚</span><span className="text-[10px]">Library</span></button>
      </div>
    </div>
  );
}
