import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sqxzahgthhufgpbvsglb.supabase.co'
const supabaseKey = 'sb_publishable_hBReXHVl35ypBonXpg0uzQ_w4MBbGnM'
const supabase = createClient(supabaseUrl, supabaseKey)

function App() {
  const [videos, setVideos] = useState([])
  const [title, setTitle] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [desc, setDesc] = useState('')

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false })
    if (data) setVideos(data)
  }

  const addVideo = async () => {
    if (!title || !videoUrl) return alert('Title ar Video URL din!')
    await supabase.from('videos').insert([{ title, video_url: videoUrl, description: desc }])
    setTitle(''); setVideoUrl(''); setDesc('')
    fetchVideos()
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>🎬 Amar Video App</h1>
      <div style={{ background: '#f5f5f5', padding: 15, borderRadius: 10 }}>
        <input placeholder="Video Title" value={title} onChange={e=>setTitle(e.target.value)} style={{ width:'100%', padding:10, marginBottom:10 }} />
        <input placeholder="YouTube Link" value={videoUrl} onChange={e=>setVideoUrl(e.target.value)} style={{ width:'100%', padding:10, marginBottom:10 }} />
        <input placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} style={{ width:'100%', padding:10, marginBottom:10 }} />
        <button onClick={addVideo} style={{ width:'100%', padding:12, background:'black', color:'white', borderRadius:8 }}>Add Video</button>
      </div>
      <div style={{ marginTop: 20 }}>
        {videos.map(v => (
          <div key={v.id} style={{ border:'1px solid #ddd', padding:10, borderRadius:10, marginBottom:10 }}>
            <h3>{v.title}</h3>
            <p>{v.description}</p>
            <a href={v.video_url} target="_blank">▶️ Watch</a>
          </div>
        ))}
      </div>
    </div>
  )
}
export default App
