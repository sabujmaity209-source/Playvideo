import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://sqxzahgthhufgpbvsglb.supabase.co'
const supabaseKey = 'sb_publishable_hBReXHVl35ypBonXpg0uzQ_w4MBbGnM'
const supabase = createClient(supabaseUrl, supabaseKey)

const initialVideos = [
  { id: 1, title: "Building PlayVideo - The Ultimate Platform (2026)", channel: "TechVision Code", views: "842K", viewsNum: 842000, duration: "09:56", cat: "Coding", thumb: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800", avatar: "https://i.pravatar.cc/100?img=11", vid: "dQw4w9WgXcQ", likes: 12000 },
  { id: 2, title: "Cyberpunk Lo-Fi Chill Beats - Live", channel: "Lofi Beats Station", views: "1.2M", viewsNum: 1200000, duration: "15:40", cat: "Music", thumb: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800", avatar: "https://i.pravatar.cc/100?img=12", vid: "5qap5aO4i9A", likes: 25000 },
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
  const [form, setForm] = useState({ title: '', url: '' })
  const [messages, setMessages] = useState([{ from: 'them', text: 'Boss video sera! 🔥', time: '11:08' }])
  const [newMsg, setNewMsg] = useState('')
  const cats = ['All','Coding','Music','Tech','Gaming','AI','Space']

  useEffect(() => {
    const totalViews = videos.reduce((a, b) => a + b.viewsNum, 0)
    setEarnings((totalViews * 0.002).toFixed(2)) // $0.002 per view
  }, [videos])

  const addVideo = () => {
    if(!form.title) return alert("Title din")
    let vidId = "dQw4w9WgXcQ"
    if(form.url.includes("v=")) vidId = form.url.split("v=")[1].split("&")[0]
    const nv = { id: Date.now(), title: form.title, channel: "Yours Sabuj 01", views: "0", viewsNum: 0, duration: "05:00", cat: "All", thumb: `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`, avatar: "https://i.pravatar.cc/100?img=32", vid: vidId, likes: 0 }
    setVideos([nv, ...videos]); setShowUpload(false); setForm({ title: '', url: '' })
  }

  return (
    <div style={{ background: tab==='shorts'?'black':'#0f0f0f', minHeight: '100vh', color: 'white', fontFamily: 'Roboto' }}>
      {/* HEADER */}
      {tab !== 'shorts' && (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: 12, background: '#0f0f0f', position: 'sticky', top: 0, zIndex: 20, borderBottom: '1px solid #222' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontWeight: 800, fontSize: 19 }}><span style={{ background: 'red', borderRadius: 6, padding: '2px 6px' }}>▶</span>Play<span style={{ color: 'red' }}>Video</span></div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div onClick={() => setShowUpload(true)} style={{ width: 36, height: 36, background: '#272727', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>📹</div>
            <div onClick={() => setShowChat(true)} style={{ width: 36, height: 36, background: '#25D366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>💬</div>
            <img onClick={() => setTab('you')} src="https://i.pravatar.cc/100?img=32" style={{ width: 32, height: 32, borderRadius: '50%' }} />
          </div>
        </div>
      )}

      {/* HOME */}
      {tab === 'home' && <>
        <div style={{ display: 'flex', gap: 8, padding: 12, overflowX: 'auto', position: 'sticky', top: 50, background: '#0f0f0f', zIndex: 10 }}>{cats.map(c => <button key={c} onClick={() => setActiveCat(c)} style={{ background: activeCat===c?'white':'#272727', color: activeCat===c?'black':'white', border: 'none', padding: '7px 14px', borderRadius: 8 }}>{c}</button>)}</div>
        <div style={{ paddingBottom: 80 }}>{videos.filter(v=>activeCat==='All'||v.cat===activeCat).map(v => <div key={v.id} onClick={() => { setPlaying(v); setVideos(videos.map(x=>x.id===v.id?{...x, viewsNum: x.viewsNum+1}:x)) }} style={{ marginBottom: 16 }}><div style={{ position: 'relative' }}><img src={v.thumb} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} /><span style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.8)', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>{v.duration}</span></div><div style={{ display: 'flex', gap: 10, padding: '10px 12px' }}><img src={v.avatar} style={{ width: 36, height: 36, borderRadius: '50%' }} /><div><div style={{ fontSize: 15, fontWeight: 500 }}>{v.title}</div><div style={{ color: '#aaa', fontSize: 13 }}>{v.channel} ✓</div><div style={{ color: '#aaa', fontSize: 13 }}>{v.views} views • 2 hours ago • ${ (v.viewsNum*0.002).toFixed(2)} Earned</div></div></div></div>)}</div>
      </>}

      {/* SHORTS - FULL SCREEN SWIPE */}
      {tab === 'shorts' && (
        <div style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: 12, display: 'flex', justifyContent: 'space-between', zIndex: 5 }}><span>🔍</span><span>⋮</span></div>
          <img src={videos[shortIdx % videos.length].thumb} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', right: 12, bottom: 120, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }} onClick={() => setVideos(videos.map((v,i)=>i===shortIdx%videos.length?{...v, likes: v.likes+1}:v))}>❤️<br/>{videos[shortIdx%videos.length].likes}</div>
            <div>💬<br/>1</div><div>🔖<br/>Save</div><div>↗️<br/>Share</div><div>🔄<br/>Remix</div>
          </div>
          <div style={{ position: 'absolute', left: 12, bottom: 90, right: 70 }}><b>@{videos[shortIdx%videos.length].channel.replace(/\s/g,'')}</b><br/><span style={{ fontSize: 14 }}>🌸 Joy Maa Monosha Mayer ashirbade sobar jibon vore uthuk...</span><br/>🎵 Garbhe Dhorecho Maa - Samiran Das</div>
          <div onClick={() => setShortIdx(shortIdx+1)} style={{ position: 'absolute', inset: 0, zIndex: 1 }}></div>
        </div>
      )}

      {/* SUBSCRIPTIONS */}
      {tab === 'subs' && <div style={{ padding: 16, paddingBottom: 80 }}><div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 12 }}>{videos.map(v => <div key={v.id} style={{ textAlign: 'center', minWidth: 60 }}><img src={v.avatar} style={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid red' }} /><div style={{ fontSize: 12, marginTop: 4 }}>{v.channel.slice(0,10)}</div></div>)}</div><h3>Latest Videos</h3>{videos.map(v => <div key={v.id} style={{ display: 'flex', gap: 10, marginTop: 12 }}><img src={v.thumb} style={{ width: 160, height: 90, borderRadius: 8, objectFit: 'cover' }} /><div><div style={{ fontSize: 14 }}>{v.title.slice(0,40)}...</div><div style={{ color: '#aaa', fontSize: 12 }}>{v.channel}</div></div></div>)}</div>}

      {/* YOU / CHANNEL + MONETIZATION */}
      {tab === 'you' && (
        <div style={{ background: 'white', color: 'black', minHeight: '100vh', paddingBottom: 80 }}>
          <div style={{ padding: 16, background: 'black', color: 'white' }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}><img src="https://i.pravatar.cc/100?img=32" style={{ width: 72, height: 72, borderRadius: '50%' }} /><div><h2 style={{ margin: 0 }}>Yours Sabuj 01</h2><div style={{ color: '#aaa' }}>@Yourssabuj01 • 497 subscribers</div></div></div>
            <div style={{ background: '#1a1a1a', borderRadius: 12, padding: 12, marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
              <div><div style={{ color: '#aaa', fontSize: 12 }}>Total Earnings</div><div style={{ fontSize: 22, fontWeight: 800, color: '#25D366' }}>${earnings}</div></div>
              <div><div style={{ color: '#aaa', fontSize: 12 }}>Total Views</div><div style={{ fontSize: 22, fontWeight: 700 }}>{videos.reduce((a,b)=>a+b.viewsNum,0).toLocaleString()}</div></div>
              <div><div style={{ color: '#aaa', fontSize: 12 }}>Videos</div><div style={{ fontSize: 22, fontWeight: 700 }}>{videos.length}</div></div>
            </div>
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ display: 'flex', gap: 10 }}><button style={{ flex: 1, padding: 12, borderRadius: 20, border: 'none', background: 'black', color: 'white' }}>📊 Analytics</button><button style={{ flex: 1, padding: 12, borderRadius: 20, border: '1px solid #ddd' }}>✏️ Edit Channel</button></div>
            <h3 style={{ marginTop: 20 }}>💰 Monetization Status</h3>
            <div style={{ background: '#e8f5e9', padding: 12, borderRadius: 12, border: '1px solid #25D366' }}>
              <b style={{ color: '#1b5e20' }}>✓ Channel Monetized!</b><br/>
              <span style={{ fontSize: 13 }}>Creator ra apnar video dekhe ${earnings} earn koreche. Per 1000 views = $2. Payment: UPI / Bank</span>
            </div>
            <h3 style={{ marginTop: 20 }}>Your Videos</h3>
            {videos.filter(v=>v.channel==="Yours Sabuj 01").map(v => <div key={v.id} style={{ display: 'flex', gap: 10, marginTop: 12, background: '#f5f5f5', padding: 8, borderRadius: 8 }}><img src={v.thumb} style={{ width: 120, height: 68, borderRadius: 6 }} /><div><div style={{ fontSize: 13, fontWeight: 600 }}>{v.title}</div><div style={{ fontSize: 12, color: '#666' }}>{v.viewsNum} views • ${(v.viewsNum*0.002).toFixed(2)}</div></div></div>)}
          </div>
        </div>
      )}

      {/* UPLOAD STUDIO - Video/Short/Live/Post */}
      {showUpload && (
        <div style={{ position: 'fixed', inset: 0, background: 'black', zIndex: 60, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span onClick={() => setShowUpload(false)} style={{ fontSize: 22, cursor: 'pointer' }}>✕</span>
            <span style={{ background: '#333', padding: '6px 14px', borderRadius: 20, fontSize: 13 }}>🎵 Add sound</span>
            <span style={{ fontSize: 22 }}>✨</span>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
            <div style={{ width: '100%', padding: 20 }}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>{['Video','Short','Live','Post'].map(t => <button key={t} onClick={() => setUploadType(t)} style={{ flex: 1, padding: '10px', borderRadius: 20, border: 'none', background: uploadType===t?'white':'#222', color: uploadType===t?'black':'white', fontWeight: 700 }}>{t}</button>)}</div>
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder={uploadType + " Title likhun..."} style={{ width: '100%', padding: 14, borderRadius: 10, background: '#222', border: '1px solid #333', color: 'white', marginBottom: 12 }} />
              <input value={form.url} onChange={e => setForm({...form, url: e.target.value})} placeholder="YouTube Link (optional)" style={{ width: '100%', padding: 14, borderRadius: 10, background: '#222', border: '1px solid #333', color: 'white', marginBottom: 12 }} />
              <div style={{ background: '#222', height: 160, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>📷 {uploadType} Preview Area</div>
            </div>
          </div>
          <div style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}><div style={{ width: 40, height: 40, background: '#333', borderRadius: 6 }}></div><div style={{ fontSize: 11, marginTop: 4 }}>Add</div></div>
            <div onClick={addVideo} style={{ width: 72, height: 72, background: 'red', borderRadius: '50%', border: '4px solid white', cursor: 'pointer' }}></div>
            <div style={{ textAlign: 'center' }}><div style={{ width: 40, height: 40, background: '#333', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📄</div><div style={{ fontSize: 11, marginTop: 4 }}>Drafts</div></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, paddingBottom: 20, color: '#888' }}>{['Video','Short','Live','Post'].map(t => <span key={t} onClick={() => setUploadType(t)} style={{ color: uploadType===t?'white':'#888', fontWeight: uploadType===t?700:400, cursor: 'pointer' }}>{t}</span>)}</div>
        </div>
      )}

      {/* WHATSAPP CHAT */}
      {showChat && !selectedChat && (
        <div style={{ position: 'fixed', inset: 0, background: '#111b21', zIndex: 70, display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: '#202c33', padding: 14, display: 'flex', justifyContent: 'space-between' }}><div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><span onClick={() => setShowChat(false)} style={{ cursor: 'pointer' }}>←</span><b>WhatsApp Chat - Creators</b></div><span>🔍 ⋮</span></div>
          <div style={{ flex: 1, overflowY: 'auto' }}>{[
            { id: 1, name: "TechVision Code", last: "Boss video sera! 🔥", time: "11:10", unread: 2, avatar: "https://i.pravatar.cc/100?img=11", online: true },
            { id: 2, name: "Yours Sabuj 01", last: "Taka kobe pabo?", time: "11:37", unread: 1, avatar: "https://i.pravatar.cc/100?img=32", online: true },
          ].map(c => <div key={c.id} onClick={() => setSelectedChat(c)} style={{ display: 'flex', gap: 12, padding: '14px 16px', borderBottom: '1px solid #1f2c34' }}><img src={c.avatar} style={{ width: 50, height: 50, borderRadius: '50%' }} /><div style={{ flex: 1 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><b>{c.name}</b><span style={{ fontSize: 12, color: c.unread?'#25D366':'#8696a0' }}>{c.time}</span></div><div style={{ color: '#8696a0', fontSize: 14 }}>{c.last}</div></div></div>)}</div>
        </div>
      )}
      {selectedChat && (
        <div style={{ position: 'fixed', inset: 0, background: '#0b141a', zIndex: 80, display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: '#202c33', padding: '10px 12px', display: 'flex', gap: 10, alignItems: 'center' }}><span onClick={() => setSelectedChat(null)} style={{ cursor: 'pointer' }}>←</span><img src={selectedChat.avatar} style={{ width: 40, height: 40, borderRadius: '50%' }} /><div><div style={{ fontWeight: 600 }}>{selectedChat.name}</div><div style={{ fontSize: 12, color: '#8696a0' }}>online</div></div></div>
          <div style={{ flex: 1, padding: 12, overflowY: 'auto' }}>{messages.map((m,i)=><div key={i} style={{ display: 'flex', justifyContent: m.from==='me'?'flex-end':'flex-start', marginBottom: 8 }}><div style={{ background: m.from==='me'?'#005c4b':'#202c33', padding: '8px 12px', borderRadius: 8, maxWidth: '70%' }}>{m.text} <span style={{ fontSize: 10, color: '#aaa' }}>{m.time} ✓✓</span></div></div>)}</div>
          <div style={{ background: '#202c33', padding: 8, display: 'flex', gap: 8 }}><input value={newMsg} onChange={e=>setNewMsg(e.target.value)} onKeyDown={e=>e.key==='Enter'&& (setMessages([...messages,{from:'me',text:newMsg,time:'11:38'}]), setNewMsg(''))} placeholder="Message" style={{ flex: 1, padding: '10px 14px', borderRadius: 20, border: 'none', background: '#2a3942', color: 'white' }} /><button onClick={() => { if(!newMsg) return; setMessages([...messages,{from:'me',text:newMsg,time:'11:38'}]); setNewMsg(''); setTimeout(()=>setMessages(m=>[...m,{from:'them',text:'Payment hoye jabe Boss! 💰',time:'11:38'}]),1000) }} style={{ width: 44, height: 44, borderRadius: '50%', background: '#25D366', border: 'none' }}>➤</button></div>
        </div>
      )}

      {playing && <div style={{ position: 'fixed', inset: 0, background: 'black', zIndex: 90 }}><div style={{ padding: 10 }}><button onClick={() => setPlaying(null)} style={{ background: 'none', border: 'none', color: 'white', fontSize: 22 }}>←</button></div><iframe width="100%" height="220" src={`https://www.youtube.com/embed/${playing.vid}?autoplay=1`} frameBorder="0" allowFullScreen></iframe><div style={{ padding: 12 }}><h3>{playing.title}</h3><p style={{ color: '#aaa' }}>{playing.views} views • Creator earns ${(playing.viewsNum*0.002).toFixed(2)}</p></div></div>}

      {/* BOTTOM NAV */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: tab==='shorts'?'black':'#0f0f0f', borderTop: '1px solid #222', display: 'flex', justifyContent: 'space-around', padding: '8px 0', zIndex: 25 }}>
        <div onClick={() => setTab('home')} style={{ textAlign: 'center', fontSize: 11, opacity: tab==='home'?1:0.6 }}>🏠<br/>Home</div>
        <div onClick={() => setTab('shorts')} style={{ textAlign: 'center', fontSize: 11, opacity: tab==='shorts'?1:0.6 }}>🎬<br/>Shorts</div>
        <div onClick={() => setShowUpload(true)} style={{ width: 44, height: 44, background: 'red', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginTop: -6 }}>+</div>
        <div onClick={() => setTab('subs')} style={{ textAlign: 'center', fontSize: 11, opacity: tab==='subs'?1:0.6 }}>📺<br/>Subs</div>
        <div onClick={() => setTab('you')} style={{ textAlign: 'center', fontSize: 11, opacity: tab==='you'?1:0.6 }}>👤<br/>You</div>
      </div>
    </div>
  )
}
