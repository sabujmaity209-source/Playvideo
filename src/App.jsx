import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sqxzahgthhufgpbvsglb.supabase.co'
const supabaseKey = 'sb_publishable_hBReXHVl35ypBonXpg0uzQ_w4MBbGnM'
const supabase = createClient(supabaseUrl, supabaseKey)

const mockVideos = [
  {
    id: 1,
    title: "Building PlayVideo - The Ultimate Platform (2026)",
    channel: "TechVision Code",
    views: "842K views • 2 hours ago",
    duration: "09:56",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
    avatar: "https://i.pravatar.cc/100?img=11"
  },
  {
    id: 2,
    title: "Cyberpunk Lo-Fi Chill Beats - Live",
    channel: "Lofi Beats Station",
    views: "1.2M views • 1 day ago",
    duration: "15:40",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800",
    avatar: "https://i.pravatar.cc/100?img=12"
  }
]

export default function App() {
  const [videos, setVideos] = useState(mockVideos)
  const [activeCat, setActiveCat] = useState('All')
  const cats = ['All','Coding','Music','Tech','Gaming','AI','Space']

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false })
    if(data && data.length > 0) {
      const formatted = data.map(v => ({
        id: v.id,
        title: v.title,
        channel: "My Channel",
        views: "Just now",
        duration: "00:30",
        thumbnail: v.video_url.includes('youtube') ? `https://img.youtube.com/vi/${v.video_url.split('v=')[1]}/hqdefault.jpg` : "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800",
        avatar: "https://i.pravatar.cc/100?img=5"
      }))
      setVideos([...formatted, ...mockVideos])
    }
  }

  return (
    <div style={{ background: '#0f0f0f', minHeight: '100vh', color: 'white', fontFamily: 'Roboto, Arial', paddingBottom: 70 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#0f0f0f', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>☰</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ background: 'red', width: 28, height: 20, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>▶</div>
            <span style={{ fontWeight: 'bold', fontSize: 20 }}>Play<span style={{ color: '#ff0000' }}>Video</span></span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 34, height: 34, background: '#272727', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📹</div>
          <img src="https://i.pravatar.cc/100?img=32" style={{ width: 32, height: 32, borderRadius: '50%' }} />
        </div>
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', gap: 8, padding: '12px', overflowX: 'auto', whiteSpace: 'nowrap', scrollbarWidth: 'none' }}>
        {cats.map(c => (
          <button key={c} onClick={() => setActiveCat(c)} style={{ 
            background: activeCat === c ? 'white' : '#272727', 
            color: activeCat === c ? 'black' : 'white',
            border: 'none', padding: '7px 14px', borderRadius: 8, fontSize: 14, fontWeight: activeCat === c ? 600 : 400
          }}>{c}</button>
        ))}
      </div>

      {/* Videos */}
      <div>
        {videos.map(v => (
          <div key={v.id} style={{ marginBottom: 16 }}>
            <div style={{ position: 'relative' }}>
              <img src={v.thumbnail} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />
              <span style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.8)', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>{v.duration}</span>
            </div>
            <div style={{ display: 'flex', gap: 10, padding: '10px 12px' }}>
              <img src={v.avatar} style={{ width: 36, height: 36, borderRadius: '50%', marginTop: 2 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 15, lineHeight: '20px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{v.title}</div>
                <div style={{ color: '#aaa', fontSize: 13, marginTop: 4 }}>{v.channel} ✓</div>
                <div style={{ color: '#aaa', fontSize: 13 }}>{v.views}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Chat */}
      <div style={{ position: 'fixed', bottom: 80, right: 16, width: 56, height: 56, background: 'linear-gradient(135deg,#ff7a00,#ff3d9a)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>💬</div>

      {/* Bottom Nav */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#0f0f0f', borderTop: '1px solid #303030', display: 'flex', justifyContent: 'space-around', padding: '8px 0' }}>
        <div style={{ textAlign: 'center', fontSize: 11 }}>🏠<br/>Home</div>
        <div style={{ textAlign: 'center', fontSize: 11, color: '#aaa' }}>🎬<br/>Shorts</div>
        <div style={{ width: 40, height: 40, background: 'red', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginTop: -2 }}>+</div>
        <div style={{ textAlign: 'center', fontSize: 11, color: '#aaa' }}>📺<br/>Subs</div>
        <div style={{ textAlign: 'center', fontSize: 11, color: '#aaa' }}>📚<br/>Library</div>
      </div>
    </div>
  )
}
