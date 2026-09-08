import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sqxzahgthhufgbvsglb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxeHphaGd0aGh1ZmdwYnZzZ2xiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4NTg3NTgsImV4cCI6MjEwNDQzNDc1OH0.HcRp9IGreHU0rn3n6pQ8JKWj2b3iNfXv6gLDwrKmqQQ'
const supabase = createClient(supabaseUrl, supabaseKey)

const cats = ["All", "Coding", "Music", "Tech", "Gaming", "AI", "Space"]

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
  const [subs, setSubs] = useState([])

  useEffect(()=>{ getVideos() }, [])

  async function getVideos(){
    const {data} = await supabase.from('videos').select('*').order('created_at',{ascending:false})
    if(data) setVideos(data)
  }

  async function openVideo(v){
    setSelected(v)
    setPage("Watch")
    await supabase.from('videos').update({views:(v.views||0)+1}).eq('id',v.id)
    window.scrollTo(0,0)
  }

  async function upload(){
    if(!file ||!title) return alert("Title & Video din Boss!")
    setUploading(true)
    try{
      const name = `${Date.now()}-${file.name.replace(/\s/g,'_')}`
      const {error} = await supabase.storage.from('videos').upload(name,file)
      if(error) throw error
      const {data:{publicUrl}} = supabase.storage.from('videos').getPublicUrl(name)
      await supabase.from('videos').insert([{title, video_url: publicUrl, views: Math.floor(Math.random()*1000)+10 }])
      setTitle(""); setFile(null); setShowUp(false); getVideos(); alert("Upload Success Boss! 🚀")
    }catch(e){ alert(e.message) }
    setUploading(false)
  }

  const toggleSub = (id) => {
    if(subs.includes(id)) setSubs(subs.filter(s=>s!==id))
    else { setSubs([...subs,id]); alert("Subscribed! 🔔") }
  }

  let filtered = videos.filter(v=> v.title.toLowerCase().includes(search.toLowerCase()))
  if(cat!=="All") filtered = filtered.filter(v=> v.title.toLowerCase().includes(cat.toLowerCase()))

  return (
    <div style={{background:'#0f0f0f', color:'white', minHeight:'100vh', fontFamily:'Arial', paddingBottom:85}}>

      {/* HEADER - ACTIVE SEARCH */}
      <header style={{background:'#0f0f0f', padding:'10px 12px', display:'flex', gap:10, alignItems:'center', position:'sticky', top:0, zIndex:100}}>
        <span style={{fontSize:22}}>☰</span>
        <h3 style={{margin:0, whiteSpace:'nowrap'}}><span style={{background:'red', padding:'1px 5px', borderRadius:4}}>▶</span> Play<span style={{color:'red'}}>Video</span></h3>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search video..." style={{flex:1, padding:'8px 15px', borderRadius:20, border:0, background:'#121212', color:'white', outline:'none', borderWidth:1, borderStyle:'solid', borderColor:'#303030'}} />
        <button onClick={()=>setShowUp(!showUp)} style={{background:'red', color:'white', border:0, padding:'7px 12px', borderRadius:20, fontWeight:'bold', whiteSpace:'nowrap'}}>+ Upload</button>
      </header>

      {/* CATEGORY - ACTIVE FILTER */}
      <div style={{display:'flex', gap:8, padding:'10px 12px', overflowX:'auto', borderBottom:'1px solid #212121'}}>
        {cats.map(c=>(
          <button key={c} onClick={()=>{setCat(c); setPage("Home"); setSelected(null)}} style={{background:cat===c?'white':'#272727', color:cat===c?'black':'white', border:0, padding:'6px 14px', borderRadius:8, fontSize:13, flexShrink:0, fontWeight:cat===c?'bold':'normal'}}>{c}</button>
        ))}
      </div>

      {/* UPLOAD BOX - ACTIVE */}
      {showUp && (
        <div style={{background:'#212121', margin:12, padding:15, borderRadius:12}}>
          <input placeholder="Video Title (ex: My Coding Video)" value={title} onChange={e=>setTitle(e.target.value)} style={{width:'100%', padding:12, borderRadius:8, border:0, background:'#303030', color:'white', marginBottom:10, boxSizing:'border-box'}} />
          <input type="file" accept="video/*" onChange={e=>setFile(e.target.files[0])} style={{marginBottom:10, width:'100%'}} />
          <button onClick={upload} disabled={uploading} style={{width:'100%', padding:12, background:'red', color:'white', border:0, borderRadius:8, fontWeight:'bold'}}>{uploading?'Uploading...':'PUBLISH VIDEO 🚀'}</button>
        </div>
      )}

      {/* PAGES - ALL ACTIVE */}
      {page==="Shorts" && (
        <div style={{padding:20, textAlign:'center'}}>
          <h2>🔥 Shorts</h2>
          <p style={{color:'#aaa'}}>Vertical Short Videos - Coming Soon</p>
          {videos.slice(0,3).map(v=>(
            <div key={v.id} onClick={()=>openVideo(v)} style={{background:'#212121', margin:'15px auto', maxWidth:350, borderRadius:12, overflow:'hidden'}}>
              <video src={v.video_url} style={{width:'100%', height:400, objectFit:'cover'}} muted />
              <p style={{padding:10}}>{v.title}</p>
            </div>
          ))}
        </div>
      )}

      {page==="Subs" && (
        <div style={{padding:15}}>
          <h3>📺 Subscriptions ({subs.length})</h3>
          {subs.length===0? <p style={{color:'#aaa'}}>Kono channel e subscribe koren ni</p> : videos.filter(v=>subs.includes(v.id)).map(v=>(
            <div key={v.id} onClick={()=>openVideo(v)} style={{display:'flex', gap:10, background:'#212121', padding:10, borderRadius:10, marginBottom:10}}>
              <video src={v.video_url} style={{width:120, height:70, borderRadius:8, objectFit:'cover'}} muted />
              <div><b>{v.title.slice(0,40)}</b><br/><small style={{color:'#aaa'}}>{v.views} views</small></div>
            </div>
          ))}
        </div>
      )}

      {page==="Library" && (
        <div style={{padding:15}}>
          <h3>📚 Library</h3>
          <div style={{background:'#212121', padding:15, borderRadius:10, marginBottom:10}}>🕒 Watch History - {videos.length} videos</div>
          <div style={{background:'#212121', padding:15, borderRadius:10, marginBottom:10}}>❤️ Liked Videos</div>
          <div style={{background:'#212121', padding:15, borderRadius:10}}>📥 Downloads</div>
          <h4 style={{marginTop:20}}>Recent Uploads</h4>
          {videos.slice(0,5).map(v=>(
            <div key={v.id} onClick={()=>openVideo(v)} style={{display:'flex', gap:10, padding:10}}>
              <video src={v.video_url} style={{width:120, height:70, borderRadius:8}} muted />
              <div>{v.title.slice(0,35)}</div>
            </div>
          ))}
        </div>
      )}

      {/* WATCH PAGE - ACTIVE */}
      {selected && page==="Watch"? (
        <div>
          <video src={selected.video_url} controls autoPlay style={{width:'100%', background:'black', maxHeight:'55vh'}} />
          <div style={{padding:12}}>
            <h3 style={{margin:'5px 0'}}>{selected.title}</h3>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8}}>
              <span style={{color:'#aaa', fontSize:13}}>{selected.views} views • 2 hours ago</span>
              <button onClick={()=>toggleSub(selected.id)} style={{background:subs.includes(selected.id)?'#303030':'red', color:'white', border:0, padding:'6px 15px', borderRadius:20}}>{subs.includes(selected.id)?'Subscribed ✓':'Subscribe'}</button>
            </div>
            <div style={{background:'#1f1f1f', padding:12, borderRadius:10, marginTop:12, color:'#aaa', textAlign:'center', border:'1px dashed #555'}}>AD - Below Video - Ekhane Ad Bosbe - High Income</div>
            <button onClick={()=>{setSelected(null); setPage("Home")}} style={{marginTop:12, background:'#272727', color:'white', border:0, padding:'8px 15px', borderRadius:20}}>← Back to Home</button>
            <h4 style={{marginTop:20}}>Up next</h4>
            {videos.filter(v=>v.id!==selected.id).slice(0,5).map(v=>(
              <div key={v.id} onClick={()=>openVideo(v)} style={{display:'flex', gap:10, marginBottom:12}}>
                <video src={v.video_url} style={{width:160, height:90, borderRadius:8, objectFit:'cover'}} muted />
                <div style={{fontSize:13}}><b>{v.title.slice(0,45)}</b><br/><small style={{color:'#aaa'}}>{v.views} views</small></div>
              </div>
            ))}
          </div>
        </div>
      ) : (page==="Home" && (
        <div>
          {filtered.length===0? <p style={{textAlign:'center', color:'#aaa', marginTop:50}}>{search || cat!=="All"? `No video found for "${search || cat}"` : "Kono video nei Boss - Upload korun!"}</p> : filtered.map((v,i)=>(
            <div key={v.id}>
              <div onClick={()=>openVideo(v)} style={{cursor:'pointer', marginBottom:4}}>
                <div style={{position:'relative'}}>
                  <video src={v.video_url} style={{width:'100%', aspectRatio:'16/9', objectFit:'cover', background:'#000'}} muted />
                  <span style={{position:'absolute', bottom:8, right:8, background:'rgba(0,0,0,0.85)', padding:'2px 6px', borderRadius:4, fontSize:12}}>{String(Math.floor(Math.random()*20)+1).padStart(2,'0')}:{String(Math.floor(Math.random()*60)).padStart(2,'0')}</span>
                </div>
                <div style={{display:'flex', gap:12, padding:'10px 12px'}}>
                  <img src={`https://i.pravatar.cc/100?img=${(i%30)+1}`} style={{width:36, height:36, borderRadius:'50%', flexShrink:0}} />
                  <div style={{flex:1}}>
                    <div style={{fontWeight:500, fontSize:15, lineHeight:'20px'}}>{v.title}</div>
                    <div style={{color:'#aaa', fontSize:13, marginTop:4}}>TechVision • {v.views} views • {i+1} hours ago</div>
                  </div>
                  <span style={{color:'#aaa'}}>⋮</span>
                </div>
              </div>
              {i===2 && <div style={{background:'#1a1a1a', margin:'10px 12px', padding:20, borderRadius:10, textAlign:'center', border:'1px dashed #555', color:'#aaa'}}>AD - In Feed 300x250 - Ekhane Ad Code Bosbe</div>}
            </div>
          ))}
        </div>
      ))}

      {/* BOTTOM NAV - ALL ACTIVE */}
      <div style={{position:'fixed', bottom:0, left:0, right:0, background:'#0f0f0f', display:'flex', justifyContent:'space-around', padding:'8px 0 12px 0', borderTop:'1px solid #212121', zIndex:999}}>
        <div onClick={()=>{setPage("Home"); setSelected(null)}} style={{textAlign:'center', fontSize:11, color:page==="Home"?'white':'#aaa', cursor:'pointer'}}><div style={{fontSize:20}}>🏠</div>Home</div>
        <div onClick={()=>{setPage("Shorts"); setSelected(null)}} style={{textAlign:'center', fontSize:11, color:page==="Shorts"?'white':'#aaa', cursor:'pointer'}}><div style={{fontSize:20}}>🎬</div>Shorts</div>
        <div onClick={()=>setShowUp(!showUp)} style={{background:'red', width:48, height:48, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, marginTop:-18, cursor:'pointer', boxShadow:'0 0 10px red'}}>+</div>
        <div onClick={()=>{setPage("Subs"); setSelected(null)}} style={{textAlign:'center', fontSize:11, color:page==="Subs"?'white':'#aaa', cursor:'pointer'}}><div style={{fontSize:20}}>📺</div>Subs</div>
        <div onClick={()=>{setPage("Library"); setSelected(null)}} style={{textAlign:'center', fontSize:11, color:page==="Library"?'white':'#aaa', cursor:'pointer'}}><div style={{fontSize:20}}>📚</div>Library</div>
      </div>
    </div>
  )
                                                                                                            }
