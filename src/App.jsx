import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sqxzahgthhufgpbvsglb.supabase.co'
const supabaseKey = 'sb_publishable_hBReXHVl35ypBonXpg0uzQ_w4MBbGnM'
const supabase = createClient(supabaseUrl, supabaseKey)

const defaultVideos = [
  {
    id: 'yt1',
    title: "Building PlayVideo - The Ultimate Platform (2026)",
    channel: "TechVision Code",
    views: "842K views • 2 hours ago",
    duration: "09:56",
    cat: "Coding",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=450&fit=crop",
    avatar: "https://i.pravatar.cc/100?img=11",
    videoId: "dQw4w9WgXcQ"
  },
  {
    id: 'yt2',
    title: "Cyberpunk Lo-Fi Chill Beats - Live Radio 24/7",
    channel: "Lofi Beats Station",
    views: "1.2M views • 1 day ago",
    duration: "15:40",
    cat: "Music",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=450&fit=crop",
    avatar: "https://i.pravatar.cc/100?img=12",
    videoId: "5qap5aO4i9A"
  },
  {
    id: 'yt3',
    title: "I Built Same App in 10 Minutes - Full Tutorial",
    channel: "Code With Sabuj",
    views: "55K views • 5 hours ago",
    duration: "10:22",
    cat: "Tech",
    thumbnail: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&h=450&fit=crop",
    avatar: "https://i.pravatar.cc/100?img=33",
    videoId: "k85mRPqvMbE"
  }
]

export default function App() {
  const [videos, setVideos] = useState(defaultVideos)
  const [activeCat, setActiveCat] = useState('All')
  const [showAdd, setShowAdd] = useState(false)
  const [playing, setPlaying] = useState(null)
  const [form, setForm] = useState({ title: '', url: '' })
  const cats = ['All','Coding','Music','Tech','Gaming','AI','Space']

  useEffect(() => {
    fetchDB()
  }, [])

  const fetchDB = async () => {
    const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false })
    if (data && data.length) {
      const dbVideos = data.map(v => {
        let vid = "dQw4w9WgXcQ"
        if (v.video_url.includes("v=")) vid = v.video_url.split("v=")[1].split("&")[0]
        else if (v.video_url.includes("youtu.be/")) vid = v.video_url.split("youtu.be/")[1]
        return {
          id: v.id,
          title: v.title,
          channel: "My Channel",
          views: "Just now • 0 views",
          duration: "05:00",
          cat: "All",
          thumbnail: `https://img.youtube.com/vi/${vid}/hqdefault.jpg`,
          avatar: "https://i.pravatar.cc/100?img=32",
          videoId: vid
        }
      })
      setVideos([...dbVideos,...defaultVideos])
    }
  }

  const addVideo = async () => {
    if (!form.title ||!form.url) return alert("Title ar Link din Boss!")
    const { error } = await supabase.from('videos').insert([{ title: form.title, video_url: form.url, description: 'PlayVideo' }])
    if (!error) {
      setForm({ title: '', url: '' })
      setShowAdd(false)
      fetchDB()
      alert("Video Add Hoye Geche Boss! 🚀")
    } else alert(error.message)
  }

  const filtered = activeCat === 'All'? videos : videos.filter(v => v.cat === activeCat)

  return (
    <div style={{ background: '#0f0f0f', minHeight: '100vh', color: 'white', fontFamily: 'Roboto, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 12px', background: '#0f0f0f', position: 'sticky', top: 0, zIndex: 20, borderBottom: '1px solid #212121' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 22 }}>☰</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, fontWeight: 800, fontSize: 20 }}>
            <span style={{ background: 'red', borderRadius: 6, padding: '2px 5px', fontSize: 14 }}>▶</span>
            <span>Play<span style={{ color: 'red' }}>Video</span></span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: '#272727', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📹</div>
          <img src="https://i.pravatar.cc/100?img=5" style={{ width: 32, height: 32, borderRadius: '50%' }} />
        </div>
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', gap: 8, padding: '12px', overflowX: 'auto', position: 'sticky', top: 49, background: '#0f0f0f', zIndex: 19 }}>
        {cats.map(c => (
          <button key={c} onClick={() => setActiveCat(c)} style={{
            background: activeCat === c? 'white' : '#272727', color: activeCat === c? 'black' : 'white',
            border: 'none', padding: '7px 14px', borderRadius: 8, fontWeight: 500, whiteSpace: 'nowrap'
          }}>{c}</button>
        ))}
      </div>

      {/* Video List */}
      <div style={{ paddingBottom: 70 }}>
        {filtered.map(v => (
          <div key={v.id} onClick={() => setPlaying(v)} style={{ marginBottom: 18, cursor: 'pointer' }}>
            <div style={{ position: 'relative', background: '#000' }}>
              <img src={v.thumbnail} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />
              <span style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.85)', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>{v.duration}</span>
            </div>
            <div style={{ display: 'flex', gap: 10, padding: '10px 12px' }}>
              <img src={v.avatar} style={{ width: 36, height: 36, borderRadius: '50%' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 500, lineHeight: '20px' }}>{v.title}</div>
                <div style={{ color: '#aaa', fontSize: 13.5, marginTop: 4 }}>{v.channel} ✓</div>
                <div style={{ color: '#aaa', fontSize: 13.5 }}>{v.views}</div>
              </div>
              <div style={{ color: '#aaa' }}>⋮</div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Player Modal */}
      {playing && (
        <div style={{ position: 'fixed', inset: 0, background: '#0f0f0f', zIndex: 50, overflowY: 'auto' }}>
          <div style={{ position: 'sticky', top: 0, background: '#0f0f0f', padding: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => setPlaying(null)} style={{ background: 'none', border: 'none', color: 'white', fontSize: 22 }}>←</button>
            <span style={{ fontWeight: 600 }}>PlayVideo</span>
          </div>
          <div style={{ width: '100%', aspectRatio: '16/9', background: 'black' }}>
            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${playing.videoId}?autoplay=1`} frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
          </div>
          <div style={{ padding: 12 }}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>{playing.title}</div>
            <div style={{ color: '#aaa', marginTop: 6 }}>{playing.views}</div>
            <div style={{ display: 'flex', gap: 10, marginTop: 12, alignItems: 'center' }}>
              <img src={playing.avatar} style={{ width: 36, height: 36, borderRadius: '50%' }} />
              <div style={{ flex: 1, fontWeight: 500 }}>{playing.channel}</div>
              <button style={{ background: 'white', color: 'black', border: 'none', borderRadius: 20, padding: '8px 16px', fontWeight: 700 }}>Subscribe</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#212121', width: '100%', maxWidth: 360, borderRadius: 16, padding: 20 }}>
            <h3 style={{ marginTop: 0 }}>Add New Video +</h3>
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value })} placeholder="Video Title" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #333', background: '#0f0f0f', color: 'white', marginBottom: 10 }} />
            <input value={form.url} onChange={e => setForm({...form, url: e.target.value })} placeholder="YouTube Link (https://youtube.com/watch?v=...)" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #333', background: '#0f0f0f', color: 'white', marginBottom: 16 }} />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: 12, borderRadius: 20, border: 'none', background: '#333', color: 'white' }}>Cancel</button>
              <button onClick={addVideo} style={{ flex: 1, padding: 12, borderRadius: 20, border: 'none', background: 'red', color: 'white', fontWeight: 700 }}>Add Video</button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#0f0f0f', borderTop: '1px solid #212121', display: 'flex', justifyContent: 'space-around', padding: '8px 0', zIndex: 30 }}>
        <div style={{ textAlign: 'center', fontSize: 11, lineHeight: '12px' }}>🏠<br/>Home</div>
        <div style={{ textAlign: 'center', fontSize: 11, lineHeight: '12px', color: '#aaa' }}>🎬<br/>Shorts</div>
        <div onClick={() => setShowAdd(true)} style={{ width: 44, height: 44, background: 'red', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginTop: -6, cursor: 'pointer' }}>+</div>
        <div style={{ textAlign: 'center', fontSize: 11, lineHeight: '12px', color: '#aaa' }}>📺<br/>Subs</div>
        <div style={{ textAlign: 'center', fontSize: 11, lineHeight: '12px', color: '#aaa' }}>📚<br/>Library</div>
      </div>
    </div>
  )
}
