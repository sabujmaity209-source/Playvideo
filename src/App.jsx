import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://sqxzahgthhufgpbvsg1b.supabase.co'
const supabaseKey = 'sb_publishable_hBReXHV135ypBonXpg0uzQ_w4NBbGnM'
const supabase = createClient(supabaseUrl, supabaseKey)

const initialVideos = [
  { id: 1, title: "Building PlayVideo - The Ultimate Platform (2026)", channel: "Yours Sabuj 01", views: "1.2M", viewsNum: 1200000, duration: "10:25", cat: "All", thumb: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800", avatar: "https://i.pravatar.cc/100?img=32", vid: "dQw4w9WgXcQ", url: "", likes: 0 },
  { id: 2, title: "Cyberpunk Lo-Fi Chill Beats - Live", channel: "Lofi Boy", views: "50K", viewsNum: 50000, duration: "LIVE", cat: "Music", thumb: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800", avatar: "https://i.pravatar.cc/100?img=12", vid: "5qap5aO4i9A", url: "", likes: 0 },
]

export default function App() {
  const [videos, setVideos] = useState(initialVideos)
  const [tab, setTab] = useState('home')
  const [shortIdx, setShortIdx] = useState(0)
  const [playing, setPlaying] = useState(null)
  const [showUpload, setShowUpload] = useState(false)
  const [uploadType, setUploadType] = useState('Video')
  const [showChat, setShowChat] = useState(false)
  const [selectedChat, setSelectedChat] = useState(null)
  const [activeCat, setActiveCat] = useState('All')
  const [earnings, setEarnings] = useState(0)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ title: '', url: '' })
  const [messages, setMessages] = useState([{ from: 'them', text: 'Boss, PlayVideo kobe launch?' }])
  const [newMsg, setNewMsg] = useState('')
  const cats = ['All','Coding','Music','Tech','Gaming','AI','Space']

  useEffect(() => {
    const totalViews = videos.reduce((a, b) => a + b.viewsNum, 0)
    setEarnings((totalViews * 0.002).toFixed(2))
  }, [videos])

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const addVideo = async () => {
    if(!form.title) return alert("Title din Boss!")
    if(!file &&!form.url) return alert("Gallery theke video nin ba YouTube link din!")
    setUploading(true)
    try {
      let videoUrl = form.url
      let thumbUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800"
      let vidId = "dQw4w9WgXcQ"
      if (file) {
        const fileName = `${Date.now()}_${file.name}`
        const { error } = await supabase.storage.from('videos').upload(fileName, file)
        if (error) throw error
        const { data } = supabase.storage.from('videos').getPublicUrl(fileName)
        videoUrl = data.publicUrl
        vidId = "local"
      } else if(form.url.includes("v=")) {
        vidId = form.url.split("v=")[1].split("&")[0]
        thumbUrl = `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`
      }
      const nv = { id: Date.now(), title: form.title, channel: "Yours Sabuj 01", views: "0", viewsNum: 0, duration: "05:00", cat: "All", thumb: thumbUrl, avatar: "https://i.pravatar.cc/100?img=32", vid: vidId, url: videoUrl, likes: 0 }
      setVideos([nv,...videos])
      setShowUpload(false)
      setForm({ title: '', url: '' })
      setFile(null)
      setPreview(null)
      alert("✅ Video Post Hoye Geche!")
    } catch (err) {
      alert("Supabase e 'videos' bucket banan ni! Error: " + err.message)
    }
    setUploading(false)
  }

  return (
    <div style={{ background: tab==='shorts'?'black':'#0f0f0f', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
      {tab!== 'shorts' && (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: 12, background: '#212121', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontWeight: 800, fontSize: 18 }}>▶️ PlayVideo</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div onClick={()=>setShowUpload(true)} style={{ width: 36, height: 36, background: '#3f3f3f', borderRadius: 18, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>+</div>
            <div onClick={()=>setShowChat(true)} style={{ width: 36, height: 36, background: '#3f3f3f', borderRadius: 18, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>💬</div>
            <img onClick={()=>setTab('you')} src="https://i.pravatar.cc/100?img=32" style={{ width: 32, height: 32, borderRadius: 16 }} />
          </div>
        </div>
      )}

      {tab === 'home' && (
        <>
          <div style={{ display: 'flex', gap: 8, padding: 12, overflowX: 'auto' }}>
            {cats.map(c => (
              <div key={c} onClick={()=>setActiveCat(c)} style={{ padding: '6px 12px', borderRadius: 8, background: activeCat===c?'white':'#272727', color: activeCat===c?'black':'white', whiteSpace: 'nowrap', cursor: 'pointer', fontSize: 14 }}>{c}</div>
            ))}
          </div>
          <div style={{ paddingBottom: 80 }}>
            {videos.filter(v=>activeCat==='All'||v.cat===activeCat).map(v => (
              <div key={v.id} onClick={()=>setPlaying(v)} style={{ marginBottom: 16, cursor: 'pointer' }}>
                <img src={v.thumb} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />
                <div style={{ padding: 12, display: 'flex', gap: 12 }}>
                  <img src={v.avatar} style={{ width: 36, height: 36, borderRadius: 18 }} />
                  <div><div style={{ fontWeight: 600 }}>{v.title}</div><div style={{ color: '#aaa', fontSize: 13 }}>{v.channel} • {v.views}</div></div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'shorts' && (
        <div style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
          <img src={videos[shortIdx % videos.length].thumb} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }} />
          <div onClick={()=>setTab('home')} style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.5)', padding: '6px 12px', borderRadius: 20, cursor: 'pointer' }}>← Back</div>
          <div style={{ position: 'absolute', bottom: 80, left: 12, right: 60 }}><div style={{ fontWeight: 700 }}>{videos[shortIdx % videos.length].title}</div><div style={{ fontSize: 13, color: '#ddd' }}>{videos[shortIdx % videos.length].channel}</div></div>
          <div style={{ position: 'absolute', right: 12, bottom: 100, display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
            <div>❤️<div style={{ fontSize: 12 }}>{videos[shortIdx % videos.length].likes}</div></div>
            <div>💬</div>
            <div onClick={()=>{ if(shortIdx < videos.length-1) setShortIdx(shortIdx+1); else setShortIdx(0)}} style={{ background: 'white', color: 'black', padding: '8px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer' }}>Next ⏭️</div>
          </div>
        </div>
      )}

      {tab === 'you' && (
        <div style={{ padding: 20, textAlign: 'center' }}>
          <img src="https://i.pravatar.cc/200?img=32" style={{ width: 80, height: 80, borderRadius: 40, margin: '20px auto' }} />
          <h2>Yours Sabuj 01</h2><p style={{ color: '#aaa' }}>@sabujmaity209 • {videos.length} Videos</p>
          <div style={{ background: '#212121', padding: 16, borderRadius: 12, marginTop: 20 }}><div style={{ color: '#aaa' }}>Total Earnings ( $0.002 / view )</div><div style={{ fontSize: 28, fontWeight: 800, color: '#25D366' }}>${earnings}</div><div style={{ fontSize: 12, color: '#888' }}>{videos.reduce((a,b)=>a+b.viewsNum,0)} Total Views</div></div>
          <div onClick={()=>setTab('home')} style={{ marginTop: 20, background: 'white', color: 'black', padding: 12, borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>Go Home</div>
        </div>
      )}

      {playing && (
        <div style={{ position: 'fixed', inset: 0, background: 'black', zIndex: 100, overflowY: 'auto' }}>
          <div onClick={()=>setPlaying(null)} style={{ padding: 12, cursor: 'pointer' }}>← Back</div>
          {playing.vid === 'local'? <video src={playing.url} controls autoPlay style={{ width: '100%', aspectRatio: '16/9' }} /> : <iframe width="100%" height="220" src={`https://www.youtube.com/embed/${playing.vid}`} frameBorder="0" allowFullScreen title="video"></iframe>}
          <div style={{ padding: 12 }}><h3>{playing.title}</h3><p style={{ color: '#aaa' }}>{playing.channel} • {playing.views}</p></div>
        </div>
      )}

      {showUpload && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 200, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <div style={{ background: '#212121', width: '100%', maxWidth: 400, padding: 20, borderRadius: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}><b>Upload Video 📤</b><span onClick={()=>setShowUpload(false)} style={{ cursor: 'pointer' }}>✕</span></div>
            <input value={form.title} onChange={e=>setForm({...form, title: e.target.value})} placeholder="Video Title likhun..." style={{ width: '100%', padding: 12, borderRadius: 8, background: '#111', border: '1px solid #333', color: 'white', marginBottom: 12 }} />
            <label style={{ display: 'block', width: '100%', padding: 14, borderRadius: 10, background: file?'#25D366':'#222', border: '1px dashed #666', color: file?'black':'white', marginBottom: 12, textAlign: 'center', fontWeight: 700, cursor: 'pointer' }}>
              {file? `✅ ${file.name.slice(0,30)}` : "📁 Gallery theke Video Select Korun"}
              <input type="file" accept="video/*" onChange={handleFile} style={{ display: 'none' }} />
            </label>
            {preview && <video src={preview} controls style={{ width: '100%', height: 160, borderRadius: 10, marginBottom: 12 }} />}
            {uploading && <div style={{ textAlign: 'center', color: '#25D366', marginBottom: 10 }}>⏳ Uploading...</div>}
            <div style={{ textAlign: 'center', color: '#666', margin: '8px 0', fontSize: 12 }}>--- OR ---</div>
            <input value={form.url} onChange={e=>setForm({...form, url: e.target.value})} placeholder="YouTube link (optional)" style={{ width: '100%', padding: 12, borderRadius: 8, background: '#111', border: '1px solid #333', color: 'white', marginBottom: 16 }} />
            <div onClick={addVideo} style={{ background: uploading?'#666':'#25D366', color: 'black', padding: 12, borderRadius: 8, textAlign: 'center', fontWeight: 800, cursor: 'pointer' }}>{uploading?'Uploading...':'Post Video 🚀'}</div>
          </div>
        </div>
      )}

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#212121', display: 'flex', justifyContent: 'space-around', padding: '10px 0', borderTop: '1px solid #333' }}>
        <div onClick={()=>setTab('home')} style={{ textAlign: 'center', cursor: 'pointer', opacity: tab==='home'?1:0.5 }}>🏠<div style={{ fontSize: 10 }}>Home</div></div>
        <div onClick={()=>setTab('shorts')} style={{ textAlign: 'center', cursor: 'pointer', opacity: tab==='shorts'?1:0.5 }}>🎬<div style={{ fontSize: 10 }}>Shorts</div></div>
        <div onClick={()=>setShowUpload(true)} style={{ textAlign: 'center', cursor: 'pointer' }}><div style={{ background: 'white', color: 'black', width: 28, height: 20, borderRadius: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto' }}>+</div></div>
        <div onClick={()=>setShowChat(true)} style={{ textAlign: 'center', cursor: 'pointer' }}>💬<div style={{ fontSize: 10 }}>Chat</div></div>
        <div onClick={()=>setTab('you')} style={{ textAlign: 'center', cursor: 'pointer', opacity: tab==='you'?1:0.5 }}>👤<div style={{ fontSize: 10 }}>You</div></div>
      </div>
    </div>
  )
}
