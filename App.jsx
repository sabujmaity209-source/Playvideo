
import React, { useState, useEffect, useRef } from 'react';

// --- TUMAR LOGO - SAME ---
const PlayVideoLogo = ({ className = "w-8 h-8" }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <svg viewBox="0 0 500 400" className="w-full h-full">
      <defs>
        <linearGradient id="pvRedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff4d4d" />
          <stop offset="100%" stopColor="#cc0000" />
        </linearGradient>
      </defs>
      <path d="M200 60 C170 60 160 85 160 115 L160 280 C160 315 185 330 210 315 L360 235 C385 220 385 190 360 175 L210 75 C200 68 200 60 200 60 Z" fill="url(#pvRedGrad)" />
      <path d="M232 125 L312 180 L232 235 Z" fill="#FFFFFF" />
    </svg>
    <span className="font-black text-xl tracking-tighter">Playvideo</span>
  </div>
);

// --- MOCK DATA ---
const videos = [
  { id: 1, title: "Learn React in 30 Minutes", channel: "Code Boss", views: "1.2M", thumb: "https://i.ytimg.com/vi/w7ejDZ8SWv8/mqdefault.jpg" },
  { id: 2, title: "Build Youtube Clone", channel: "Sabuj Maity", views: "500K", thumb: "https://i.ytimg.com/vi/dGcsHMXbSOA/mqdefault.jpg" },
  { id: 3, title: "Tailwind CSS Full Course", channel: "Design Pro", views: "800K", thumb: "https://i.ytimg.com/vi/lCxcTsOHrjo/mqdefault.jpg" },
];

const shortsData = [
  { id: 1, url: "https://www.w3schools.com/html/mov_bbb.mp4", title: "Amazing Nature #shorts", likes: "12K", channel: "@nature" },
  { id: 2, url: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4", title: "Funny Moment 😂 #funny", likes: "45K", channel: "@funnyclip" },
  { id: 3, url: "https://www.w3schools.com/html/movie.mp4", title: "Coding in 10s #coding", likes: "89K", channel: "@coders" },
];

// --- YOUTUBE LIKE SHORTS - FIXED ---
const ShortsPage = () => {
  const videoRefs = useRef([]);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.play().catch(()=>{});
        else e.target.pause();
      });
    }, { threshold: 0.7 });
    videoRefs.current.forEach(v => v && observer.observe(v));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="h-[calc(100vh-64px)] bg-black overflow-y-scroll snap-y snap-mandatory flex flex-col items-center">
      {shortsData.map((s, i) => (
        <div key={s.id} className="h-full w-full max-w-[360px] snap-start relative flex-shrink-0 bg-zinc-900 flex items-center justify-center">
          <video ref={el => videoRefs.current[i]=el} src={s.url} loop muted playsInline className="h-full w-full object-cover" />
          <div className="absolute right-3 bottom-24 flex flex-col gap-6 text-white items-center">
            <button className="flex flex-col items-center"><span className="text-2xl">❤️</span><span className="text-xs">{s.likes}</span></button>
            <button className="flex flex-col items-center"><span className="text-2xl">💬</span><span>1K</span></button>
            <button className="flex flex-col items-center"><span className="text-2xl">↗️</span></button>
          </div>
          <div className="absolute left-3 bottom-5 text-white">
            <p className="font-bold text-sm">{s.channel}</p>
            <p className="text-sm">{s.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- HOME PAGE ---
const HomePage = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
    {videos.map(v => (
      <div key={v.id} className="cursor-pointer">
        <img src={v.thumb} className="w-full rounded-xl aspect-video object-cover" />
        <h3 className="font-bold mt-2 text-sm line-clamp-2">{v.title}</h3>
        <p className="text-xs text-zinc-500">{v.channel} • {v.views} views</p>
      </div>
    ))}
  </div>
);

// --- MAIN APP ---
export default function App() {
  const [page, setPage] = useState("shorts");
  return (
    <div className="min-h-screen bg-white text-black">
      <header className="h-16 border-b flex items-center justify-between px-4 sticky top-0 bg-white z-50">
        <PlayVideoLogo />
        <div className="flex gap-2">
          <button onClick={()=>setPage('home')} className={`px-4 py-1.5 rounded-full ${page==='home'?'bg-black text-white':'bg-zinc-100'}`}>Home</button>
          <button onClick={()=>setPage('shorts')} className={`px-4 py-1.5 rounded-full ${page==='shorts'?'bg-black text-white':'bg-zinc-100'}`}>Shorts</button>
        </div>
      </header>
      <main>
        {page === 'shorts' ? <ShortsPage /> : <HomePage />}
      </main>
    </div>
  );
}
