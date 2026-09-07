import React, { useState, useEffect, useRef, useMemo } from 'react';


// High Quality SVG Logo replicating the PlayVideo logo artwork
const PlayVideoLogo = ({ className = "h-8" }) => (
  <div className={`flex items-center gap-2.5 select-none cursor-pointer ${className}`}>
    <svg viewBox="0 0 500 400" className="h-full w-auto drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pvRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff1e27" />
          <stop offset="50%" stopColor="#e60000" />
          <stop offset="100%" stopColor="#990000" />
        </linearGradient>
        <linearGradient id="pvRedInner" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff4d4d" />
          <stop offset="100%" stopColor="#cc0000" />
        </linearGradient>
      </defs>
      {/* Speed lines on left */}
      <rect x="70" y="155" width="45" height="18" rx="9" fill="url(#pvRedGrad)" />
      <rect x="100" y="185" width="60" height="18" rx="9" fill="url(#pvRedGrad)" />
      <rect x="85" y="215" width="68" height="18" rx="9" fill="url(#pvRedGrad)" />
      <rect x="110" y="245" width="48" height="18" rx="9" fill="url(#pvRedGrad)" />
      <rect x="130" y="275" width="38" height="18" rx="9" fill="url(#pvRedGrad)" />

      {/* Main Red Play Ribbon Container */}
      <path
        d="M200 60 C170 60 160 85 160 115 L160 280 C160 315 185 335 215 335 C235 335 250 325 265 310 L375 220 C405 195 405 165 375 140 L265 50 C240 30 220 60 200 60 Z"
        fill="url(#pvRedGrad)"
      />
      {/* Inner White Triangle */}
      <path
        d="M232 125 L312 180 L232 235 Z"
        fill="#FFFFFF"
      />
      {/* Dynamic Ribbon fold overlay effect */}
      <path
        d="M160 115 C160 85 180 60 210 60 C235 60 250 75 250 100 L250 200 C250 225 230 245 205 245 C180 245 160 225 160 200 Z"
        fill="url(#pvRedInner)"
        opacity="0.85"
      />
      <path
        d="M232 125 L312 180 L232 235 Z"
        fill="#FFFFFF"
      />
    </svg>
    <div className="flex items-center text-2xl font-black tracking-tight font-sans">
      <span className="text-white tracking-tight">Play</span>
      <span className="text-red-600 tracking-tight ml-0.5">Video</span>
    </div>
  </div>
);

// Custom SVG Icons
const Icons = {
  Menu: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  Search: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Mic: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
    </svg>
  ),
  VideoPlus: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m-3-3h6" />
    </svg>
  ),
  Bell: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9" />
    </svg>
  ),
  Home: () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  ),
  Shorts: () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.77 10.32l-1.2-.5L18 8.7a3.86 3.86 0 00-1.84-5.06 3.89 3.89 0 00-5.12 1.83l-1.12 2.47-1.22-.51a3.88 3.88 0 00-5.08 1.82 3.86 3.86 0 001.83 5.08l1.2.51L5 15.8a3.88 3.88 0 001.82 5.08 3.89 3.89 0 005.11-1.83l1.15-2.52 1.2.5a3.86 3.86 0 005.08-1.83 3.86 3.86 0 00-1.59-4.88zM10 14.5v-5l4.5 2.5-4.5 2.5z"/>
    </svg>
  ),
  Subscriptions: () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M4 6h16v2H4zm2-4h12v2H6zm14 8H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm-8 7.5v-5l4.5 2.5-4.5 2.5z"/>
    </svg>
  ),
  Library: () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-7l5.5 3.5-5.5 3.5z"/>
    </svg>
  ),
  History: () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M13 3a9 9 0 00-9 9H1l3.89 3.89.07.14L9 12H6a7 7 0 117 7 7.07 7.07 0 01-6-3.42l-1.42 1.42A8.93 8.93 0 0013 21a9 9 0 000-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
    </svg>
  ),
  Clock: () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
    </svg>
  ),
  ThumbsUp: ({ filled = false }) => (
    <svg className="w-5 h-5" fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2" />
    </svg>
  ),
  ThumbsDown: ({ filled = false }) => (
    <svg className="w-5 h-5" fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
    </svg>
  ),
  Share: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  ),
  Download: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  More: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
    </svg>
  ),
  X: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    </svg>
  ),
  Sparkles: () => (
    <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2L9.19 8.63 2 12l7.19 3.37L12 22l2.81-6.63L22 12l-7.19-3.37z" />
    </svg>
  )
};


// Initial Sample Video Collection
const INITIAL_VIDEOS = [
  {
    id: "v1",
    title: "Building PlayVideo - The Ultimate Video Streaming Platform (2026)",
    description: "In this full step-by-step tutorial, learn how to build PlayVideo from scratch using React, Tailwind CSS, HTML5 Video, and state persistence. Explore dark UI design, video custom streaming controls, search filters, and TikTok-style Shorts!",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    channelName: "TechVision Code",
    channelId: "c1",
    channelAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    subscribers: "1.42M",
    views: 842000,
    timestamp: "2 hours ago",
    duration: "09:56",
    category: "Coding",
    likes: 45200,
    dislikes: 120,
    isVerified: true,
    tags: ["#react", "#playvideo", "#webdev", "#frontend"]
  },
  {
    id: "v2",
    title: "Cyberpunk Nightscape Lo-Fi Chill Beats [24/7 Live Stream]",
    description: "Relax, study, or code to relaxing cyberpunk lo-fi soundscapes. Smooth basslines and retro synthesizer melodies recorded live in Neo Tokyo.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    channelName: "Lofi Beats Station",
    channelId: "c2",
    channelAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    subscribers: "890K",
    views: 1250000,
    timestamp: "1 day ago",
    duration: "15:40",
    category: "Music",
    likes: 92100,
    dislikes: 310,
    isVerified: true,
    tags: ["#lofi", "#chill", "#music", "#study"]
  },
  {
    id: "v3",
    title: "Unboxing the Next-Gen Quantum Laptop & Speed Benchmark!",
    description: "We got our hands on the revolutionary M4 Quantum Chip laptop! Let's test render speeds, 8K video playback, and ray-traced gaming benchmark scores.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnail: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1200&q=80",
    channelName: "Gizmo Pulse",
    channelId: "c3",
    channelAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    subscribers: "3.1M",
    views: 430000,
    timestamp: "3 days ago",
    duration: "12:15",
    category: "Tech",
    likes: 31200,
    dislikes: 450,
    isVerified: true,
    tags: ["#tech", "#quantum", "#hardware", "#laptop"]
  },
  {
    id: "v4",
    title: "Unreal Engine 5.5 Photorealistic City Walkthrough in 8K",
    description: "Experience hyper-realistic nanite geometry and lumen reflections in this new real-time graphics demonstration running on PlayVideo High-Bitrate HDR.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
    channelName: "Graphics World 3D",
    channelId: "c4",
    channelAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    subscribers: "650K",
    views: 2100000,
    timestamp: "5 days ago",
    duration: "18:02",
    category: "Gaming",
    likes: 145000,
    dislikes: 980,
    isVerified: true,
    tags: ["#unrealengine", "#3d", "#gaming", "#graphics"]
  },
  {
    id: "v5",
    title: "10 AI Tools Every Developer MUST Use in 2026",
    description: "Boost your software engineering productivity tenfold with these brand new artificial intelligence assistants, auto-code generators, and visual design synthesis tools.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    channelName: "AI Nexus",
    channelId: "c5",
    channelAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
    subscribers: "2.8M",
    views: 980000,
    timestamp: "1 week ago",
    duration: "14:50",
    category: "AI",
    likes: 68000,
    dislikes: 410,
    isVerified: true,
    tags: ["#ai", "#productivity", "#coding", "#future"]
  },
  {
    id: "v6",
    title: "Deep Space Exploration: Secrets of James Webb Telescope",
    description: "Journey to distant galaxies and cosmic nebulae. Discover how astronomers analyze atmospheric spectra of exoplanets millions of light-years away.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    channelName: "Cosmos Horizon",
    channelId: "c6",
    channelAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80",
    subscribers: "5.2M",
    views: 3400000,
    timestamp: "2 weeks ago",
    duration: "22:10",
    category: "Space",
    likes: 240000,
    dislikes: 1100,
    isVerified: true,
    tags: ["#space", "#astronomy", "#science", "#jwst"]
  },
  {
    id: "v7",
    title: "Gourmet Italian Carbonara Recipe in Under 15 Minutes",
    description: "No cream needed! Master the authentic traditional Italian technique using guanciale, pecorino cheese, fresh egg yolks, and cracked black pepper.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    thumbnail: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80",
    channelName: "Chef Mario's Kitchen",
    channelId: "c7",
    channelAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80",
    subscribers: "1.1M",
    views: 670000,
    timestamp: "3 weeks ago",
    duration: "11:30",
    category: "Cooking",
    likes: 54000,
    dislikes: 210,
    isVerified: false,
    tags: ["#cooking", "#food", "#recipe", "#italian"]
  },
  {
    id: "v8",
    title: "Minimalist Modern Desk Setup & Workspace Tour 2026",
    description: "Take a peek inside my ultra-clean productivity studio with custom RGB backlighting, cable management tricks, and ergonomic monitor mounts.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4",
    thumbnail: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=1200&q=80",
    channelName: "Aesthetic Spaces",
    channelId: "c8",
    channelAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
    subscribers: "740K",
    views: 520000,
    timestamp: "1 month ago",
    duration: "08:45",
    category: "Design",
    likes: 41000,
    dislikes: 180,
    isVerified: true,
    tags: ["#desksetup", "#minimalism", "#workspace", "#tech"]
  }
];

// Sample Shorts Collection
const SHORTS_DATA = [
  {
    id: "s1",
    title: "Fastest 3D Print ever completed! 🚀 #3dprinting #tech",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    channelName: "MakerLab 3D",
    channelAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    likes: "184K",
    comments: "2.4K",
    soundTitle: "Original Sound - MakerLab"
  },
  {
    id: "s2",
    title: "React custom hooks trick you wish you knew earlier 🔥",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    channelName: "CodeBits",
    channelAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    likes: "290K",
    comments: "4.1K",
    soundTitle: "Lofi Beats Synthwave Mix"
  },
  {
    id: "s3",
    title: "Is this the most beautiful sunset on Earth? 🌅 #travel",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    channelName: "Wanderlust TV",
    channelAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    likes: "512K",
    comments: "8.9K",
    soundTitle: "Nature Relaxation Sounds"
  }
];

// Initial Comments
const INITIAL_COMMENTS = [
  {
    id: "cm1",
    author: "Alex Rivers",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    time: "1 hour ago",
    text: "The speed and dark theme aesthetic on PlayVideo is incredible! Finally a modern UI that feels lightning fast.",
    likes: 342,
    isLiked: false
  },
  {
    id: "cm2",
    author: "Sarah Jenkins",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    time: "3 hours ago",
    text: "Subscribed immediately! Loved the crisp explanations and clear code architecture breakdown.",
    likes: 128,
    isLiked: false
  },
  {
    id: "cm3",
    author: "DevPro_2026",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
    time: "5 hours ago",
    text: "Can you make a video on backend microservices integration with real-time WebSockets next?",
    likes: 95,
    isLiked: false
  }
];

export default function App() {
  // Navigation & View States
  const [currentView, setCurrentView] = useState('home'); // 'home', 'watch', 'shorts', 'subscriptions', 'history', 'liked', 'watchLater'
  const [activeVideo, setActiveVideo] = useState(null);
  const [videos, setVideos] = useState(INITIAL_VIDEOS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // User Interactivity States
  const [subscriptions, setSubscriptions] = useState(['c1', 'c3']);
  const [likedVideoIds, setLikedVideoIds] = useState(['v1']);
  const [dislikedVideoIds, setDislikedVideoIds] = useState([]);
  const [watchLaterIds, setWatchLaterIds] = useState(['v3']);
  const [watchHistory, setWatchHistory] = useState(['v1', 'v2']);

  // Modals & Panels
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Search Autocomplete State
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Comments State
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [newCommentText, setNewCommentText] = useState('');

  // Auto-toast notification helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Categories list
  const categories = [
    "All", "Coding", "Music", "Tech", "Gaming", "AI", "Space", "Cooking", "Design", "Podcasts", "Live", "Lo-Fi", "Gadgets"
  ];

  // Filtered Videos based on Category and Search
  const filteredVideos = useMemo(() => {
    return videos.filter(video => {
      const matchesCategory = selectedCategory === 'All' || video.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = searchQuery === '' || 
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.channelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [videos, selectedCategory, searchQuery]);

  // Dynamic Search Suggestions
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const matches = videos
        .filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase()) || v.category.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(v => v.title)
        .slice(0, 5);
      setSearchSuggestions(matches);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery, videos]);

  // Handle Play Video
  const handleSelectVideo = (video) => {
    setActiveVideo(video);
    setCurrentView('watch');
    if (!watchHistory.includes(video.id)) {
      setWatchHistory(prev => [video.id, ...prev]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle Subscriptions
  const toggleSubscribe = (channelId, channelName) => {
    if (subscriptions.includes(channelId)) {
      setSubscriptions(prev => prev.filter(id => id !== channelId));
      showToast(`Unsubscribed from ${channelName}`);
    } else {
      setSubscriptions(prev => [...prev, channelId]);
      showToast(`Subscribed to ${channelName}! 🎉`);
    }
  };

  // Toggle Like Video
  const toggleLike = (videoId) => {
    if (likedVideoIds.includes(videoId)) {
      setLikedVideoIds(prev => prev.filter(id => id !== videoId));
    } else {
      setLikedVideoIds(prev => [...prev, videoId]);
      setDislikedVideoIds(prev => prev.filter(id => id !== videoId));
      showToast("Added to Liked Videos");
    }
  };

  // Toggle Dislike
  const toggleDislike = (videoId) => {
    if (dislikedVideoIds.includes(videoId)) {
      setDislikedVideoIds(prev => prev.filter(id => id !== videoId));
    } else {
      setDislikedVideoIds(prev => [...prev, videoId]);
      setLikedVideoIds(prev => prev.filter(id => id !== videoId));
    }
  };

  // Toggle Watch Later
  const toggleWatchLater = (videoId) => {
    if (watchLaterIds.includes(videoId)) {
      setWatchLaterIds(prev => prev.filter(id => id !== videoId));
      showToast("Removed from Watch Later");
    } else {
      setWatchLaterIds(prev => [...prev, videoId]);
      showToast("Saved to Watch Later");
    }
  };

  // Simulated Voice Search Handler
  const startVoiceSearch = () => {
    setIsVoiceSearchOpen(true);
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setSearchQuery("Cyberpunk Lo-Fi");
      setIsVoiceSearchOpen(false);
      showToast('Voice Search: "Cyberpunk Lo-Fi"');
    }, 2800);
  };

  // Handle New Comment
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const newCm = {
      id: "cm_" + Date.now(),
      author: "PlayVideo Creator",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      time: "Just now",
      text: newCommentText,
      likes: 0,
      isLiked: false
    };
    setComments([newCm, ...comments]);
    setNewCommentText('');
    showToast("Comment posted!");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col antialiased selection:bg-red-600 selection:text-white">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80 px-4 py-2.5 flex items-center justify-between gap-4">
        
        {/* Left: Hamburger & Brand Logo */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-full hover:bg-zinc-800/80 text-zinc-300 hover:text-white transition-colors"
            title="Toggle Sidebar"
          >
            <Icons.Menu />
          </button>
          
          <div onClick={() => { setCurrentView('home'); setSelectedCategory('All'); setSearchQuery(''); }}>
            <PlayVideoLogo className="h-8 md:h-9" />
          </div>
        </div>

        {/* Center: Search Bar with Autocomplete & Mic */}
        <div className="flex-1 max-w-2xl relative hidden sm:flex items-center gap-2">
          <form 
            onSubmit={(e) => { e.preventDefault(); setShowSuggestions(false); if(currentView !== 'home') setCurrentView('home'); }}
            className="flex-1 flex items-center bg-zinc-900 border border-zinc-700/80 rounded-full focus-within:border-red-600 transition-all overflow-hidden shadow-inner"
          >
            <input 
              type="text"
              placeholder="Search videos, channels, topics..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full bg-transparent px-5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery('')}
                className="p-1 mr-2 text-zinc-400 hover:text-white"
              >
                <Icons.X />
              </button>
            )}
            <button 
              type="submit"
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-6 py-2.5 border-l border-zinc-700/80 flex items-center justify-center transition-colors"
            >
              <Icons.Search />
            </button>
          </form>

          {/* Voice Search Button */}
          <button 
            onClick={startVoiceSearch}
            className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-full text-zinc-200 hover:text-red-500 transition-colors shadow-sm"
            title="Search with Voice"
          >
            <Icons.Mic />
          </button>

          {/* Search Autocomplete Dropdown */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-12 mt-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl py-2 z-50">
              {searchSuggestions.map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => { setSearchQuery(item); setShowSuggestions(false); }}
                  className="px-4 py-2 hover:bg-zinc-800 cursor-pointer text-sm text-zinc-200 flex items-center gap-3"
                >
                  <Icons.Search />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Upload, Notifications, User Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Create / Upload Video */}
          <button 
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors"
          >
            <Icons.VideoPlus />
            <span className="hidden md:inline">Create</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2.5 rounded-full hover:bg-zinc-800 text-zinc-300 hover:text-white relative transition-colors"
              title="Notifications"
            >
              <Icons.Bell />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-600 rounded-full ring-2 ring-zinc-950 animate-pulse"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl py-3 z-50">
                <div className="px-4 py-2 border-b border-zinc-800 flex justify-between items-center">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  <span className="text-xs text-red-500 hover:underline cursor-pointer">Mark all as read</span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-zinc-800/50">
                  <div className="p-3.5 hover:bg-zinc-800/60 cursor-pointer flex gap-3 items-start">
                    <img src={INITIAL_VIDEOS[0].channelAvatar} className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <p className="text-xs font-medium text-zinc-200">TechVision Code uploaded: <span className="font-normal text-zinc-400">PlayVideo Masterclass 2026</span></p>
                      <span className="text-[10px] text-zinc-500">20 mins ago</span>
                    </div>
                  </div>
                  <div className="p-3.5 hover:bg-zinc-800/60 cursor-pointer flex gap-3 items-start">
                    <img src={INITIAL_VIDEOS[2].channelAvatar} className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <p className="text-xs font-medium text-zinc-200">Gizmo Pulse is live now!</p>
                      <span className="text-[10px] text-zinc-500">1 hour ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <button 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-9 h-9 rounded-full ring-2 ring-red-600/50 hover:ring-red-500 overflow-hidden transition-all focus:outline-none"
            >
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" 
                alt="User Profile" 
                className="w-full h-full object-cover"
              />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl py-2 z-50 divide-y divide-zinc-800">
                <div className="p-4 flex items-center gap-3">
                  <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" className="w-10 h-10 rounded-full" />
                  <div>
                    <h4 className="font-semibold text-sm text-zinc-100">Alex Creator</h4>
                    <p className="text-xs text-zinc-400">@alex_playvideo</p>
                  </div>
                </div>
                <div className="py-2 text-sm text-zinc-300">
                  <div className="px-4 py-2 hover:bg-zinc-800 cursor-pointer flex items-center gap-3">
                    <Icons.Sparkles /> <span>PlayVideo Premium (Active)</span>
                  </div>
                  <div onClick={() => { setCurrentView('liked'); setUserMenuOpen(false); }} className="px-4 py-2 hover:bg-zinc-800 cursor-pointer flex items-center gap-3">
                    <Icons.ThumbsUp /> <span>Liked Videos ({likedVideoIds.length})</span>
                  </div>
                  <div onClick={() => { setCurrentView('watchLater'); setUserMenuOpen(false); }} className="px-4 py-2 hover:bg-zinc-800 cursor-pointer flex items-center gap-3">
                    <Icons.Clock /> <span>Watch Later ({watchLaterIds.length})</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Main Container Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Navigation */}
        <aside 
          className={`bg-zinc-950 border-r border-zinc-800/80 transition-all duration-300 flex flex-col z-40 ${
            sidebarOpen ? 'w-60' : 'w-20'
          } hidden sm:flex`}
        >
          <div className="p-3 space-y-1 overflow-y-auto flex-1">
            
            {/* Primary Nav Items */}
            <SidebarItem 
              icon={<Icons.Home />} 
              label="Home" 
              active={currentView === 'home'} 
              expanded={sidebarOpen}
              onClick={() => { setCurrentView('home'); setSelectedCategory('All'); }}
            />
            <SidebarItem 
              icon={<Icons.Shorts />} 
              label="Shorts" 
              active={currentView === 'shorts'} 
              expanded={sidebarOpen}
              onClick={() => setCurrentView('shorts')}
            />
            <SidebarItem 
              icon={<Icons.Subscriptions />} 
              label="Subscriptions" 
              active={currentView === 'subscriptions'} 
              expanded={sidebarOpen}
              onClick={() => setCurrentView('subscriptions')}
            />

            <hr className="border-zinc-800 my-3" />

            {/* Library Section */}
            <SidebarItem 
              icon={<Icons.Library />} 
              label="Library" 
              active={currentView === 'library'} 
              expanded={sidebarOpen}
              onClick={() => setCurrentView('home')}
            />
            <SidebarItem 
              icon={<Icons.History />} 
              label="History" 
              active={currentView === 'history'} 
              expanded={sidebarOpen}
              onClick={() => setCurrentView('history')}
            />
            <SidebarItem 
              icon={<Icons.Clock />} 
              label="Watch Later" 
              active={currentView === 'watchLater'} 
              expanded={sidebarOpen}
              onClick={() => setCurrentView('watchLater')}
            />
            <SidebarItem 
              icon={<Icons.ThumbsUp />} 
              label="Liked Videos" 
              active={currentView === 'liked'} 
              expanded={sidebarOpen}
              onClick={() => setCurrentView('liked')}
            />

            {sidebarOpen && (
              <>
                <hr className="border-zinc-800 my-4" />
                <div className="px-3 mb-2">
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Subscribed Channels</h4>
                </div>
                {INITIAL_VIDEOS.filter(v => subscriptions.includes(v.channelId)).map(v => (
                  <div 
                    key={v.channelId}
                    onClick={() => { setSelectedCategory('All'); setCurrentView('home'); }}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-zinc-800/70 cursor-pointer text-sm text-zinc-300 hover:text-white"
                  >
                    <img src={v.channelAvatar} className="w-6 h-6 rounded-full object-cover" />
                    <span className="truncate">{v.channelName}</span>
                  </div>
                ))}
              </>
            )}

          </div>
        </aside>

        {/* Central Content Area */}
        <main className="flex-1 overflow-y-auto bg-zinc-950 pb-20 sm:pb-8">
          
          {/* Category Filter Pills (When in Home view) */}
          {currentView === 'home' && (
            <div className="sticky top-0 z-30 bg-zinc-950/95 backdrop-blur px-4 py-3 border-b border-zinc-800/60 flex items-center gap-2.5 overflow-x-auto no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat 
                      ? 'bg-zinc-100 text-zinc-900 font-semibold shadow-md' 
                      : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* VIEW RENDERER */}
          <div className="p-4 md:p-6 max-w-7xl mx-auto">
            
            {/* VIEW 1: HOME FEED */}
            {currentView === 'home' && (
              <div>
                {filteredVideos.length === 0 ? (
                  <div className="py-20 text-center">
                    <p className="text-zinc-500 text-lg">No videos found for "{searchQuery || selectedCategory}"</p>
                    <button 
                      onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                      className="mt-4 px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-medium transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredVideos.map((video) => (
                      <VideoCard 
                        key={video.id} 
                        video={video} 
                        onSelect={() => handleSelectVideo(video)}
                        onWatchLater={() => toggleWatchLater(video.id)}
                        isWatchLater={watchLaterIds.includes(video.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* VIEW 2: WATCH SCREEN */}
            {currentView === 'watch' && activeVideo && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Main Video & Details Column */}
                <div className="lg:col-span-2 space-y-4">
                  
                  {/* Embedded Custom HTML5 Video Player */}
                  <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl relative border border-zinc-800 group">
                    <video 
                      src={activeVideo.videoUrl} 
                      controls 
                      autoPlay 
                      poster={activeVideo.thumbnail}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Video Title & Tags */}
                  <div>
                    <div className="flex flex-wrap gap-2 text-xs font-semibold text-red-500 mb-1">
                      {activeVideo.tags.map((tag, idx) => (
                        <span key={idx}>{tag}</span>
                      ))}
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-zinc-100 leading-snug">{activeVideo.title}</h1>
                  </div>

                  {/* Channel & Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-zinc-800 pb-4">
                    
                    {/* Channel Info */}
                    <div className="flex items-center gap-3">
                      <img src={activeVideo.channelAvatar} className="w-11 h-11 rounded-full object-cover ring-2 ring-zinc-800" />
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-zinc-100 text-base">
                          {activeVideo.channelName}
                          {activeVideo.isVerified && <Icons.Check />}
                        </div>
                        <span className="text-xs text-zinc-400">{activeVideo.subscribers} subscribers</span>
                      </div>
                      <button 
                        onClick={() => toggleSubscribe(activeVideo.channelId, activeVideo.channelName)}
                        className={`ml-3 px-5 py-2 rounded-full font-semibold text-sm transition-all ${
                          subscriptions.includes(activeVideo.channelId)
                            ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                            : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/30'
                        }`}
                      >
                        {subscriptions.includes(activeVideo.channelId) ? 'Subscribed' : 'Subscribe'}
                      </button>
                    </div>

                    {/* Action Buttons: Like, Dislike, Share, Watch Later */}
                    <div className="flex items-center gap-2 overflow-x-auto">
                      
                      {/* Like / Dislike pill */}
                      <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden">
                        <button 
                          onClick={() => toggleLike(activeVideo.id)}
                          className={`flex items-center gap-2 px-4 py-2 hover:bg-zinc-800 text-sm font-medium transition-colors ${
                            likedVideoIds.includes(activeVideo.id) ? 'text-red-500' : 'text-zinc-300'
                          }`}
                        >
                          <Icons.ThumbsUp filled={likedVideoIds.includes(activeVideo.id)} />
                          <span>{(activeVideo.likes + (likedVideoIds.includes(activeVideo.id) ? 1 : 0)).toLocaleString()}</span>
                        </button>
                        <div className="w-[1px] h-6 bg-zinc-800"></div>
                        <button 
                          onClick={() => toggleDislike(activeVideo.id)}
                          className={`px-3 py-2 hover:bg-zinc-800 transition-colors ${
                            dislikedVideoIds.includes(activeVideo.id) ? 'text-red-500' : 'text-zinc-300'
                          }`}
                        >
                          <Icons.ThumbsDown filled={dislikedVideoIds.includes(activeVideo.id)} />
                        </button>
                      </div>

                      {/* Share Button */}
                      <button 
                        onClick={() => showToast("Share link copied to clipboard!")}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-full text-sm font-medium text-zinc-300 transition-colors"
                      >
                        <Icons.Share />
                        <span className="hidden sm:inline">Share</span>
                      </button>

                      {/* Watch Later Button */}
                      <button 
                        onClick={() => toggleWatchLater(activeVideo.id)}
                        className={`p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-full transition-colors ${
                          watchLaterIds.includes(activeVideo.id) ? 'text-red-500' : 'text-zinc-300'
                        }`}
                        title="Save to Watch Later"
                      >
                        <Icons.Clock />
                      </button>

                    </div>

                  </div>

                  {/* Expandable Video Description Box */}
                  <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4 text-sm space-y-2">
                    <div className="flex items-center gap-3 text-xs text-zinc-400 font-semibold">
                      <span>{activeVideo.views.toLocaleString()} views</span>
                      <span>•</span>
                      <span>Uploaded {activeVideo.timestamp}</span>
                    </div>
                    <p className="text-zinc-300 whitespace-pre-line leading-relaxed">{activeVideo.description}</p>
                  </div>

                  {/* Comments Section */}
                  <div className="pt-6 border-t border-zinc-800">
                    <div className="flex items-center gap-6 mb-6">
                      <h3 className="text-lg font-bold text-zinc-100">{comments.length} Comments</h3>
                      <span className="text-xs text-zinc-400 font-semibold cursor-pointer hover:text-white">Sort by Top</span>
                    </div>

                    {/* Add Comment Input */}
                    <form onSubmit={handleAddComment} className="flex gap-4 items-start mb-8">
                      <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" className="w-10 h-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <input 
                          type="text" 
                          placeholder="Add a comment on PlayVideo..."
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          className="w-full bg-transparent border-b border-zinc-700 focus:border-red-600 px-1 py-1 text-sm focus:outline-none transition-colors"
                        />
                        {newCommentText && (
                          <div className="flex justify-end gap-2 pt-1">
                            <button 
                              type="button" 
                              onClick={() => setNewCommentText('')}
                              className="px-4 py-1.5 text-xs text-zinc-400 hover:text-white font-medium"
                            >
                              Cancel
                            </button>
                            <button 
                              type="submit"
                              className="px-4 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white rounded-full font-medium transition-colors"
                            >
                              Comment
                            </button>
                          </div>
                        )}
                      </div>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-5">
                      {comments.map((cm) => (
                        <div key={cm.id} className="flex gap-4 items-start">
                          <img src={cm.avatar} className="w-9 h-9 rounded-full object-cover" />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-zinc-200">{cm.author}</span>
                              <span className="text-[11px] text-zinc-500">{cm.time}</span>
                            </div>
                            <p className="text-sm text-zinc-300">{cm.text}</p>
                            <div className="flex items-center gap-4 text-xs text-zinc-400 pt-1">
                              <button className="flex items-center gap-1 hover:text-white">
                                <Icons.ThumbsUp />
                                <span>{cm.likes}</span>
                              </button>
                              <button className="hover:text-white">Reply</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Sidebar Column: Related / Up Next Videos */}
                <div className="space-y-4">
                  <h3 className="font-bold text-base text-zinc-200">Up Next</h3>
                  <div className="space-y-3">
                    {videos.filter(v => v.id !== activeVideo.id).map((video) => (
                      <div 
                        key={video.id}
                        onClick={() => handleSelectVideo(video)}
                        className="flex gap-3 group cursor-pointer p-1.5 rounded-xl hover:bg-zinc-900 transition-colors"
                      >
                        <div className="relative w-36 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-900">
                          <img src={video.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] text-white px-1.5 py-0.5 rounded font-mono">
                            {video.duration}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-zinc-100 line-clamp-2 leading-snug group-hover:text-red-500 transition-colors">
                            {video.title}
                          </h4>
                          <p className="text-[11px] text-zinc-400 mt-1 truncate">{video.channelName}</p>
                          <p className="text-[11px] text-zinc-500">{video.views.toLocaleString()} views</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* VIEW 3: SHORTS VERTICAL FEED */}
            {currentView === 'shorts' && (
              <div className="max-w-md mx-auto space-y-8 py-4">
                {SHORTS_DATA.map((short) => (
                  <div key={short.id} className="relative aspect-[9/16] bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 group">
                    <video 
                      src={short.videoUrl} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Vertical Action Bar on Right */}
                    <div className="absolute right-3 bottom-16 flex flex-col items-center gap-5 z-20">
                      <button className="flex flex-col items-center gap-1 group/btn">
                        <div className="p-3 bg-zinc-900/80 hover:bg-red-600 rounded-full text-white backdrop-blur transition-all">
                          <Icons.ThumbsUp />
                        </div>
                        <span className="text-xs font-semibold">{short.likes}</span>
                      </button>

                      <button className="flex flex-col items-center gap-1">
                        <div className="p-3 bg-zinc-900/80 hover:bg-zinc-800 rounded-full text-white backdrop-blur transition-all">
                          <Icons.Share />
                        </div>
                        <span className="text-xs font-semibold">{short.comments}</span>
                      </button>

                      <button className="p-3 bg-zinc-900/80 hover:bg-zinc-800 rounded-full text-white backdrop-blur transition-all">
                        <Icons.More />
                      </button>
                    </div>

                    {/* Bottom Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 space-y-3">
                      <div className="flex items-center gap-3">
                        <img src={short.channelAvatar} className="w-10 h-10 rounded-full object-cover border-2 border-red-600" />
                        <span className="font-bold text-sm text-white">@{short.channelName}</span>
                        <button className="px-3 py-1 bg-red-600 text-white rounded-full text-xs font-bold hover:bg-red-700">
                          Subscribe
                        </button>
                      </div>
                      <p className="text-xs text-zinc-200 line-clamp-2">{short.title}</p>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                        <Icons.Music />
                        <span>{short.soundTitle}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* VIEW 4: SUBSCRIPTIONS FEED */}
            {currentView === 'subscriptions' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Your Subscriptions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {videos.filter(v => subscriptions.includes(v.channelId)).map(video => (
                    <VideoCard 
                      key={video.id} 
                      video={video} 
                      onSelect={() => handleSelectVideo(video)}
                      onWatchLater={() => toggleWatchLater(video.id)}
                      isWatchLater={watchLaterIds.includes(video.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 5: HISTORY & WATCH LATER */}
            {(currentView === 'history' || currentView === 'liked' || currentView === 'watchLater') && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold capitalize">
                  {currentView === 'history' ? 'Watch History' : currentView === 'liked' ? 'Liked Videos' : 'Watch Later'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {videos.filter(v => {
                    if (currentView === 'history') return watchHistory.includes(v.id);
                    if (currentView === 'liked') return likedVideoIds.includes(v.id);
                    if (currentView === 'watchLater') return watchLaterIds.includes(v.id);
                    return false;
                  }).map(video => (
                    <VideoCard 
                      key={video.id} 
                      video={video} 
                      onSelect={() => handleSelectVideo(video)}
                      onWatchLater={() => toggleWatchLater(video.id)}
                      isWatchLater={watchLaterIds.includes(video.id)}
                    />
                  ))}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Upload Video Modal */}
      {isUploadOpen && (
        <UploadModal 
          onClose={() => setIsUploadOpen(false)}
          onPublish={(newVid) => {
            setVideos([newVid, ...videos]);
            setIsUploadOpen(false);
            showToast("Video uploaded to PlayVideo!");
          }}
        />
      )}

      {/* Voice Search Modal */}
      {isVoiceSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-sm w-full text-center space-y-6">
            <h3 className="text-xl font-bold">Listening to Voice...</h3>
            <div className="flex justify-center items-center gap-2 py-6">
              <div className="w-3 h-10 bg-red-600 rounded-full animate-bounce"></div>
              <div className="w-3 h-16 bg-red-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-3 h-12 bg-red-700 rounded-full animate-bounce delay-200"></div>
            </div>
            <p className="text-xs text-zinc-400">Say something like "Tech news" or "Chill music"</p>
          </div>
        </div>
      )}

      {/* Toast Notification Alert Banner */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 border border-red-600/50 text-zinc-100 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in">
          <PlayVideoLogo className="h-5" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur border-t border-zinc-800/80 sm:hidden flex justify-around py-2">
        <button 
          onClick={() => { setCurrentView('home'); setSelectedCategory('All'); }}
          className={`flex flex-col items-center gap-1 ${currentView === 'home' ? 'text-red-500' : 'text-zinc-400'}`}
        >
          <Icons.Home />
          <span className="text-[10px]">Home</span>
        </button>
        <button 
          onClick={() => setCurrentView('shorts')}
          className={`flex flex-col items-center gap-1 ${currentView === 'shorts' ? 'text-red-500' : 'text-zinc-400'}`}
        >
          <Icons.Shorts />
          <span className="text-[10px]">Shorts</span>
        </button>
        <button 
          onClick={() => setIsUploadOpen(true)}
          className="p-2 bg-red-600 text-white rounded-full -mt-3 shadow-lg"
        >
          <Icons.VideoPlus />
        </button>
        <button 
          onClick={() => setCurrentView('subscriptions')}
          className={`flex flex-col items-center gap-1 ${currentView === 'subscriptions' ? 'text-red-500' : 'text-zinc-400'}`}
        >
          <Icons.Subscriptions />
          <span className="text-[10px]">Subs</span>
        </button>
        <button 
          onClick={() => setCurrentView('history')}
          className={`flex flex-col items-center gap-1 ${currentView === 'history' ? 'text-red-500' : 'text-zinc-400'}`}
        >
          <Icons.Library />
          <span className="text-[10px]">Library</span>
        </button>
      </nav>

    </div>
  );
}


// Sidebar Button Helper Component
function SidebarItem({ icon, label, active, expanded, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
        active 
          ? 'bg-red-600/10 text-red-500 font-semibold' 
          : 'text-zinc-300 hover:bg-zinc-800/70 hover:text-white'
      }`}
    >
      <div className={active ? 'text-red-500' : 'text-zinc-400'}>
        {icon}
      </div>
      {expanded && <span>{label}</span>}
    </button>
  );
}

// Video Grid Card Component
function VideoCard({ video, onSelect, onWatchLater, isWatchLater }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="flex flex-col gap-3 group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail Container */}
      <div 
        onClick={onSelect}
        className="relative aspect-video w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/80 shadow-md group-hover:border-zinc-700 transition-all"
      >
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Timestamp Badge */}
        <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur text-xs font-mono text-zinc-100 px-2 py-0.5 rounded-md font-semibold">
          {video.duration}
        </span>

        {/* Hover Quick Action - Watch Later */}
        <button 
          onClick={(e) => { e.stopPropagation(); onWatchLater(); }}
          className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur transition-opacity ${
            isHovered ? 'opacity-100' : 'opacity-0'
          } ${isWatchLater ? 'bg-red-600 text-white' : 'bg-black/70 text-zinc-200 hover:bg-black'}`}
          title="Watch Later"
        >
          <Icons.Clock />
        </button>
      </div>

      {/* Video Details */}
      <div className="flex gap-3 px-1">
        <img 
          src={video.channelAvatar} 
          className="w-9 h-9 rounded-full object-cover mt-0.5 flex-shrink-0 ring-1 ring-zinc-800" 
        />
        <div className="flex-1 min-w-0">
          <h3 
            onClick={onSelect}
            className="text-sm font-bold text-zinc-100 leading-snug line-clamp-2 group-hover:text-red-500 transition-colors"
          >
            {video.title}
          </h3>
          <p className="text-xs text-zinc-400 mt-1 truncate flex items-center gap-1">
            {video.channelName}
            {video.isVerified && <Icons.Check />}
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">
            {video.views.toLocaleString()} views • {video.timestamp}
          </p>
        </div>
      </div>
    </div>
  );
}

// Upload Modal Component
function UploadModal({ onClose, onPublish }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Coding');
  const [videoUrl, setVideoUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    const newVid = {
      id: "v_" + Date.now(),
      title: title,
      description: "Uploaded via PlayVideo Studio.",
      videoUrl: videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      channelName: "Alex Creator",
      channelId: "my_channel",
      channelAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      subscribers: "1",
      views: 1,
      timestamp: "Just now",
      duration: "05:00",
      category: category,
      likes: 0,
      dislikes: 0,
      isVerified: true,
      tags: ["#new", "#playvideo"]
    };
    onPublish(newVid);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
          <h3 className="text-lg font-bold">Upload to PlayVideo</h3>
          <button onClick={onClose} className="p-1 hover:text-red-500"><Icons.X /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Video Title</label>
            <input 
              type="text" 
              required
              placeholder="Enter video title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:border-red-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:border-red-600 focus:outline-none"
            >
              <option value="Coding">Coding</option>
              <option value="Tech">Tech</option>
              <option value="Gaming">Gaming</option>
              <option value="Music">Music</option>
              <option value="AI">AI</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Video MP4 URL (Optional sample stream)</label>
            <input 
              type="url" 
              placeholder="https://...mp4"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:border-red-600 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2 text-sm text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold text-sm transition-colors shadow-lg shadow-red-900/30"
            >
              Publish Video
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
