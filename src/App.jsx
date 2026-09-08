import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sqxzahgthhufgbvsglb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxeHphaGd0aGh1ZmdwYnZzZ2xiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4NTg3NTgsImV4cCI6MjEwNDQzNDc1OH0.HcRp9IGreHU0rn3n6pQ8JKWj2b3iNfXv6gLDwrKmqQQ'
const supabase = createClient(supabaseUrl, supabaseKey)

const AdBanner = ({ label }) => (
  <div style={{ background: '#f1f1f1', border: '1px dashed #999', padding: 15, textAlign: 'center', margin: '15px 0', borderRadius: 8, color: 'black' }}>
    <small>ADVERTISEMENT - {label}</small>
    <div style={{ height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
      Google Ad - {label}
    </div>
  </div>
)

function App() {
  const [videos, setVideos] = useState([])
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => { fetchVideos() }, [])

  async function fetchVideos() {
    const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false })
    if (data) setVideos(data)
  }

  async function handleVideoClick(video) {
    setSelectedVideo(video)
    window.scrollTo(0,0)
    await supabase.from('videos').update({ views: (video.views || 0) + 1 }).eq('id', video.id)
  }

  async function handleUpload() {
    if (!file ||!title) return alert('Title & Video lagbe Boss!')
    setUploading(true)
    try {
      const fileName = `${Date.now()}-${file.name.replace(/\s/g,'_')}`
      const { error: upErr } = await supabase.storage.from('videos').upload(fileName, file)
      if (upErr) throw upErr
      const { data: { publicUrl } } = supabase.storage.from('videos').getPublicUrl(fileName)
      const { error: dbErr } = await supabase.from('videos').insert([{ title, description: desc, video_url: publicUrl, views: 0 }])
      if (dbErr) throw dbErr
      setTitle(''); setDesc(''); setFile(null); setShowUpload(false); fetchVideos(); alert('Upload Success! 🚀')
    } catch (e) { alert('Error: ' + e.message) }
    setUploading(false)
  }

  const filtered = videos.filter(v => v.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ fontFamily: 'Arial', background: '#0f0f0f', color: 'white', minHeight: '100vh' }}>
      <header style={{ background: '#212121', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <h2 style={{ margin: 0, color: 'red', cursor: 'pointer' }} onClick={()=>setSelectedVideo(null)}>▶️ PlayVideo</h2>
        <input placeholder="Search video..." value={search} onChange={e=>setSearch(e.target.value)} style={{ padding: 8, width: '40%', borderRadius: 20, border: 0 }} />
        <button onClick={()=>setShowUpload(!showUpload)} style={{ background: 'red', color: 'white', border: 0, padding: '8px 15px', borderRadius: 20 }}>+ Upload</button>
      </header>

      <AdBanner label="TOP BANNER 728x90" />

      <div style={{ maxWidth: 1300, margin: '0 auto', display: 'flex', gap: 20, padding: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: 350 }}>
          {showUpload && (
            <div style={{ background: '#212121', padding: 20, borderRadius: 10, marginBottom: 20 }}>
              <h3>Upload Video</h3>
              <input type="text" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} style={{ width: '100%', padding: 10, marginBottom: 10, borderRadius: 5, border: 0 }} />
              <textarea placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} style={{ width: '100%', padding: 10, marginBottom: 10, borderRadius: 5, border: 0 }} />
              <input type="file" accept="video/*" onChange={e=>setFile(e.target.files[0])} style={{ marginBottom: 10 }} />
              <button onClick={handleUpload} disabled={uploading} style={{ width: '100%', padding: 12, background: 'red', color: 'white', border: 0, borderRadius: 6 }}>{uploading? 'Uploading...' : 'PUBLISH & EARN 💰'}</button>
            </div>
          )}

          {selectedVideo? (
            <div>
              <video src={selectedVideo.video_url} controls autoPlay style={{ width: '100%', borderRadius: 10, background: 'black' }} />
              <h2 style={{ margin: '10px 0' }}>{selectedVideo.title}</h2>
              <p style={{ color: '#aaa' }}>{selectedVideo.views} views • {selectedVideo.description}</p>
              <AdBanner label="BELOW VIDEO AD - HIGH CPC" />
              <button onClick={()=>setSelectedVideo(null)} style={{ marginTop: 10, background: '#333', color: 'white', border: 0, padding: '8px 15px', borderRadius: 5 }}>← Back</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 15 }}>
              {filtered.map((v, i) => (
                <div key={v.id}>
                  {i===2 && <AdBanner label="IN-FEED AD" />}
                  <div onClick={()=>handleVideoClick(v)} style={{ cursor: 'pointer', background: '#212121', borderRadius: 10, overflow: 'hidden' }}>
                    <video src={v.video_url} style={{ width: '100%', height: 150, objectFit: 'cover' }} muted />
                    <div style={{ padding: 10 }}>
                      <h4 style={{ margin: '5px 0', fontSize: 15 }}>{v.title.slice(0,50)}</h4>
                      <small style={{ color: '#aaa' }}>{v.views || 0} views</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 300 }}>
          <AdBanner label="SIDEBAR AD 300x250" />
          <h4>🔥 Trending</h4>
          {videos.slice(0,5).map(v => (
            <div key={v.id} onClick={()=>handleVideoClick(v)} style={{ display: 'flex', gap: 10, marginBottom: 10, cursor: 'pointer', background: '#212121', padding: 8, borderRadius: 8 }}>
              <video src={v.video_url} style={{ width: 100, height: 60, borderRadius: 5, objectFit: 'cover' }} muted />
              <div><small style={{ fontWeight: 'bold' }}>{v.title.slice(0,40)}</small><br/><small style={{ color: '#aaa' }}>{v.views} views</small></div>
            </div>
          ))}
          <AdBanner label="SIDEBAR AD 300x600" />
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', padding: 5, textAlign: 'center', zIndex: 999, borderTop: '2px solid red', color: 'black' }}>
        <div style={{ height: 50, fontWeight: 'bold' }}>STICKY AD 320x50 - Ekhane Ad Code Bosan</div>
      </div>
      <div style={{ height: 80 }}></div>
    </div>
  )
}
export default App
