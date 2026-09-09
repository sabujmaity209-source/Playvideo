import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sqxzahgthhufgbvsglb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxeHphaGd0aGh1ZmdwYnZzZ2xiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4NTg3NTgsImV4cCI6MjEwNDQzNDc1OH0.HcRp9IGreHU0rn3n6pQ8JKWj2b3iNfXv6gLDwrKmqQQ'
const supabase = createClient(supabaseUrl, supabaseKey)

const cats = ["All", "Coding", "Music", "Tech", "Gaming", "AI"]

export default function App() {
  const [videos, setVideos] = useState([])
  const [selected, setSelected] = useState(null)
  const [cat, setCat] = useState("All")
  const [page, setPage] = useState("Home")
  const [search, setSearch] = useState("")
  const [title, setTitle] = useState("")
  const [file, setFile] = useState(null)
  const [showUp, setShowUp] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(()=>{ getVideos() }, [])

  async function getVideos(){
    try{
      const {data} = await supabase.from('videos').select('*').order('created_at',{ascending:false})
      if(data) setVideos(data)
    }catch(e){ console.log(e) }
  }

  async function openVideo(v){
    setSelected(v)
    setPage("Watch")
    window.scrollTo(0,0)
    try{ await supabase.from('videos').update({views:(v.views||0)+1}).eq('id',v.id) }catch{}
  }

  async function upload(){
    if(!title ||!file) return alert("Title & Video din Boss!")
    setUploading(true)
    try{
      const name = `${Date.now()}-${file.name.replace(/\s/g,'_')}`
      const {error} = await supabase.storage.from('videos').upload(name, file)
      if(error) throw error
      const {data:{publicUrl}} = supabase.storage.from('videos').getPublicUrl(name)
      await supabase.from('videos').insert([{title, video_url: publicUrl, views: 0}])
      setTitle(""); setFile(null); setShowUp(false)
      await getVideos()
      alert("Upload Success Boss! 🚀")
    }catch(e){ alert("Error: "+e.message) }
    setUploading(false)
  }

  let filtered = videos.filter(v=> v.title.toLowerCase().includes(search.toLowerCase()))
  if(cat!=="All") filtered = filtered.filter(v=> v.title.toLowerCase().includes(cat.toLowerCase()))

  return (
    <div style={{background:'#0f0f0f', color:'white', minHeight:'100vh', fontFamily:'Arial', paddingBottom:80}}>

      <header style={{padding:'10px 12px', display:'flex', gap:10, alignItems:'center', position:'sticky', top:0, zIndex:100, background:'#0f0f0f', borderBottom:'1px solid #222'}}>
        <h3 style={{margin:0, whiteSpace:'nowrap'}}><span style={{background:'red', padding:'1px 6px', borderRadius:4}}>▶</span> PlayVideo</h3>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{flex:1, padding:'8px 14px', borderRadius:20, border:'1px solid #333', background:'#121212', color:'white'}} />
        <button onClick={()=>setShowUp(!showUp)} style={{background:'red', color:'white', border:0, padding:'7px 14px', borderRadius:20, fontWeight:'bold'}}>+ Upload</button>
      </header>

      <div style={{display:'flex', gap:8, padding:'10px 12px', overflowX:'auto'}}>
        {cats.map(c=>(
          <button key={c} onClick={()=>{setCat(c); setPage("Home"); setSelected(null)}} style={{background:cat===c?'white':'#272727', color:cat===c?'black':'white', border:0, padding:'6px 14px', borderRadius:8, flexShrink:0}}>{c}</button>
        ))}
      </div>

      {showUp && (
        <div style={{background:'#212121', margin:12, padding:15, borderRadius:12}}>
          <input placeholder="Video Title..." value={title} onChange={e=>setTitle(e.target.value)} style={{width:'100%', padding:12, borderRadius:8, border:0, background:'#333', color:'white', marginBottom:10, boxSizing:'border-box'}} />
          <input type="file" accept="video/*" onChange={e=>setFile(e.target.files[0])} style={{width:'100%', marginBottom:10}} />
          <button onClick={upload} disabled={uploading} style={{width:'100%', padding:12, background:'red', color:'white', border:0, borderRadius:8, fontWeight:'bold'}}>{uploading?'Uploading...':'PUBLISH'}</button>
        </div>
      )}

      {page==="Shorts" && <div style={{padding:20, textAlign:'center'}}><h2>Shorts</h2><button onClick={()=>setPage("Home")}>Back Home</button></div>}
      {page==="Subs" && <div style={{padding:20}}><h2>Subscriptions</h2></div>}
      {page==="Library" && <div style={{padding:20}}><h2>Library - {videos.length} videos</h2></div>}

      {selected && page==="Watch"? (
        <div>
          <video src={selected.video_url} controls autoPlay style={{width:'100%', maxHeight:'50vh', background:'black'}} />
          <div style={{padding:12}}>
            <h3>{selected.title}</h3>
            <p style={{color:'#aaa'}}>{selected.views} views</p>
            <button onClick={()=>{setSelected(null); setPage("Home")}} style={{background:'#333', color:'white', border:0, padding:'8px 14px', borderRadius:20}}>← Back</button>
            <div style={{background:'#1f1f1f', padding:15, borderRadius:10, marginTop:12, textAlign:'center', border:'1px dashed #555'}}>AD SPACE</div>
          </div>
        </div>
      ) : page==="Home" && (
        <div>
          {filtered.length===0? <p style={{textAlign:'center', color:'#aaa', marginTop:60}}>Kono video nei - Upload korun Boss!</p> : filtered.map(v=>(
            <div key={v.id} onClick={()=>openVideo(v)} style={{marginBottom:10, cursor:'pointer'}}>
              <video src={v.video_url} style={{width:'100%', aspectRatio:'16/9', background:'black'}} muted />
              <div style={{padding:'8px 12px'}}><b>{v.title}</b><br/><small style={{color:'#aaa'}}>{v.views} views</small></div>
            </div>
          ))}
        </div>
      )}

      <div style={{position:'fixed', bottom:0, left:0, right:0, background:'#0f0f0f', display:'flex', justifyContent:'space-around', padding:'8px 0', borderTop:'1px solid #222'}}>
        <div onClick={()=>{setPage("Home"); setSelected(null)}} style={{textAlign:'center', color:page==="Home"?'white':'#aaa', fontSize:11}}><div style={{fontSize:20}}>🏠</div>Home</div>
        <div onClick={()=>setPage("Shorts")} style={{textAlign:'center', color:page==="Shorts"?'white':'#aaa', fontSize:11}}><div style={{fontSize:20}}>🎬</div>Shorts</div>
        <div onClick={()=>setShowUp(!showUp)} style={{background:'red', width:45, height:45, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, marginTop:-15}}>+</div>
        <div onClick={()=>setPage("Subs")} style={{textAlign:'center', color:page==="Subs"?'white':'#aaa', fontSize:11}}><div style={{fontSize:20}}>📺</div>Subs</div>
        <div onClick={()=>setPage("Library")} style={{textAlign:'center', color:page==="Library"?'white':'#aaa', fontSize:11}}><div style={{fontSize:20}}>📚</div>Library</div>
      </div>
    </div>
  )
}
