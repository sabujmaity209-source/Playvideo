import { useState, useEffect } from 'react'
const cats = ["All", "Coding", "Music", "Tech", "Gaming", "AI"]
function openDB(){
  return new Promise((res, rej)=>{
    const r = indexedDB.open("PlayVideoDB",2)
    r.onupgradeneeded = ()=>{ if(!r.result.objectStoreNames.contains("videos")) r.result.createObjectStore("videos", {keyPath:"id"}) }
    r.onsuccess = ()=> res(r.result)
    r.onerror = ()=> rej(r.error)
  })
}
async function saveToDB(video){
  const db = await openDB()
  const tx = db.transaction("videos","readwrite")
  tx.objectStore("videos").put({id:video.id, title:video.title, blob:video.blob, views:video.views, likes:video.likes||0, liked:video.liked||false, comments:video.comments||[], created_at:video.created_at})
}
async function updateInDB(id, data){
  const db = await openDB()
  const store = db.transaction("videos","readwrite").objectStore("videos")
  const req = store.get(id)
  req.onsuccess = ()=>{ const v = {...req.result,...data}; store.put(v) }
}
async function getAllFromDB(){
  const db = await openDB()
  return new Promise((res)=>{ const req = db.transaction("videos","readonly").objectStore("videos").getAll(); req.onsuccess = ()=> res(req.result) })
}
async function deleteFromDB(id){
  const db = await openDB()
  db.transaction("videos","readwrite").objectStore("videos").delete(id)
}
export default function App() {
  const [videos, setVideos] = useState([])
  const [selected, setSelected] = useState(null)
  const [cat, setCat] = useState("All")
  const [search, setSearch] = useState("")
  const [title, setTitle] = useState("")
  const [file, setFile] = useState(null)
  const [showUp, setShowUp] = useState(false)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState("")
  useEffect(()=>{ (async()=>{ const all = await getAllFromDB(); const withUrl = all.map(v=> ({...v, video_url: URL.createObjectURL(v.blob), likes:v.likes||0, liked:v.liked||false, comments:v.comments||[] })); setVideos(withUrl); setLoading(false) })() },[])
  async function upload(){
    if(!title) return alert("Title din Boss!")
    if(!file) return alert("Video din!")
    const newV = {id: Date.now(), title, blob: file, views: Math.floor(Math.random()*900)+10, likes:0, liked:false, comments:[], created_at: new Date().toISOString()}
    await saveToDB(newV)
    const withUrl = {...newV, video_url: URL.createObjectURL(file)}
    setVideos([withUrl,...videos]); setTitle(""); setFile(null); setShowUp(false)
    alert("Viral Video Upload Done Boss! 🚀")
  }
  function openVideo(v){ setSelected(v); window.scrollTo(0,0); setVideos(prev=> prev.map(x=> x.id===v.id? {...x, views:x.views+1}:x)); updateInDB(v.id, {views:v.views+1}) }
  function toggleLike(){
    const newLiked =!selected.liked; const newLikes = newLiked? selected.likes+1 : selected.likes-1
    const updated = {...selected, liked:newLiked, likes:newLikes}
    setSelected(updated); setVideos(videos.map(v=> v.id===selected.id? updated : v)); updateInDB(selected.id, {liked:newLiked, likes:newLikes})
  }
  function addComment(){
    if(!comment) return
    const newComments = [...(selected.comments||[]), {id:Date.now(), text:comment, time:"Just now"}]
    const updated = {...selected, comments:newComments}
    setSelected(updated); setVideos(videos.map(v=> v.id===selected.id? updated : v)); updateInDB(selected.id, {comments:newComments}); setComment("")
  }
  function shareVideo(){
    if(navigator.share){ navigator.share({title:selected.title, text:"Dekho ei video ta!", url: window.location.href}) }
    else { navigator.clipboard.writeText(window.location.href); alert("Link Copy hoye geche Boss! Share korun! 🔗") }
  }
  async function delVideo(id, e){ if(e) e.stopPropagation(); if(!confirm("Delete korben Boss?")) return; await deleteFromDB(id); setVideos(videos.filter(v=>v.id!==id)); setSelected(null) }
  let filtered = videos.filter(v=> v.title.toLowerCase().includes(search.toLowerCase()))
  if(cat!=="All") filtered = filtered.filter(v=> v.title.toLowerCase().includes(cat.toLowerCase()))
  if(loading) return <div style={{background:'#0f0f0f', color:'white', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>Loading Boss... 🚀</div>
  return (
    <div style={{background:'#0f0f0f', color:'white', minHeight:'100vh', paddingBottom:80, fontFamily:'system-ui'}}>
      <header style={{padding:'10px 12px', display:'flex', gap:8, alignItems:'center', position:'sticky', top:0, background:'#0f0f0f', zIndex:10, borderBottom:'1px solid #222'}}>
        <h3 onClick={()=>setSelected(null)} style={{margin:0, cursor:'pointer'}}>▶ PlayVideo</h3>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{flex:1, padding:'8px 14px', borderRadius:20, border:'1px solid #333', background:'#121212', color:'white'}}/>
        <button onClick={()=>setShowUp(!showUp)} style={{background:'red', color:'white', border:0, padding:'7px 12px', borderRadius:20, fontWeight:'bold'}}>+ Upload</button>
      </header>
      <div style={{display:'flex', gap:8, padding:10, overflowX:'auto'}}>
        {cats.map(c=><button key={c} onClick={()=>{setCat(c); setSelected(null)}} style={{background:cat===c?'white':'#272727', color:cat===c?'black':'white', border:0, padding:'6px 12px', borderRadius:8, flexShrink:0}}>{c}</button>)}
      </div>
      {showUp && <div style={{background:'#212121', margin:12, padding:15, borderRadius:12}}><input placeholder="Title..." value={title} onChange={e=>setTitle(e.target.value)} style={{width:'100%', padding:12, borderRadius:8, border:0, background:'#333', color:'white', marginBottom:10, boxSizing:'border-box'}}/><input type="file" accept="video/*" onChange={e=>setFile(e.target.files[0])} style={{width:'100%', marginBottom:10}}/><button onClick={upload} style={{width:'100%', padding:12, background:'red', color:'white', border:0, borderRadius:8, fontWeight:'bold'}}>PUBLISH 🚀</button></div>}
      {selected? <div><video src={selected.video_url} controls autoPlay style={{width:'100%', maxHeight:'55vh', background:'black'}}/>
        <div style={{padding:12}}>
          <h3 style={{margin:'5px 0'}}>{selected.title}</h3>
          <p style={{color:'#aaa', margin:'4px 0'}}>{selected.views} views • {selected.likes} likes</p>
          <div style={{display:'flex', gap:10, margin:'12px 0', overflowX:'auto'}}>
            <button onClick={toggleLike} style={{background:selected.liked?'#ff0000':'#272727', color:'white', border:0, padding:'8px 16px', borderRadius:20, fontWeight:'bold'}}>{selected.liked?'❤️':'🤍'} {selected.likes} Like</button>
            <button onClick={shareVideo} style={{background:'#272727', color:'white', border:0, padding:'8px 16px', borderRadius:20, fontWeight:'bold'}}>🔗 Share</button>
            <button onClick={()=>delVideo(selected.id)} style={{background:'#272727', color:'#ff6b6b', border:0, padding:'8px 16px', borderRadius:20}}>🗑️ Delete</button>
            <button onClick={()=>setSelected(null)} style={{background:'#272727', color:'white', border:0, padding:'8px 16px', borderRadius:20}}>← Back</button>
          </div>
          <div style={{background:'#1f1f1f', padding:15, borderRadius:10, marginTop:12, textAlign:'center', border:'1px dashed #555'}}>AD SPACE 💰</div>
          <div style={{marginTop:20}}>
            <h4>{selected.comments?.length||0} Comments</h4>
            <div style={{display:'flex', gap:8, marginBottom:15}}>
              <input value={comment} onChange={e=>setComment(e.target.value)} placeholder="Comment likhun..." style={{flex:1, padding:'10px 14px', borderRadius:20, border:'1px solid #333', background:'#121212', color:'white'}}/>
              <button onClick={addComment} style={{background:'#3ea6ff', color:'white', border:0, padding:'8px 16px', borderRadius:20, fontWeight:'bold'}}>Post</button>
            </div>
            {selected.comments?.map(c=><div key={c.id} style={{display:'flex', gap:10, marginBottom:12, background:'#181818', padding:10, borderRadius:8}}><div style={{width:32, height:32, background:'red', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>😎</div><div><b style={{fontSize:13}}>@user</b> <small style={{color:'#aaa'}}> {c.time}</small><div style={{fontSize:14, marginTop:2}}>{c.text}</div></div></div>)}
          </div>
        </div>
      </div> : <div>{filtered.length===0? <p style={{textAlign:'center', color:'#aaa', marginTop:60}}>Kono video nei</p> : filtered.map(v=><div key={v.id} onClick={()=>openVideo(v)} style={{marginBottom:12, cursor:'pointer'}}><video src={v.video_url} style={{width:'100%', aspectRatio:'16/9', background:'black', borderRadius:8}} muted/><div style={{padding:'8px 12px', display:'flex', justifyContent:'space-between'}}><div><b>{v.title}</b><br/><small style={{color:'#aaa'}}>{v.views} views • {v.likes} likes • {v.comments?.length||0} comments</small></div><div>⋮</div></div></div>)}</div>}
      <div style={{position:'fixed', bottom:0, left:0, right:0, background:'#0f0f0f', display:'flex', justifyContent:'space-around', padding:'8px 0', borderTop:'1px solid #222'}}><div onClick={()=>setSelected(null)} style={{textAlign:'center', color:'white', fontSize:11}}><div style={{fontSize:18}}>🏠</div>Home</div><div style={{textAlign:'center', color:'#aaa', fontSize:11}}><div style={{fontSize:18}}>🎬</div>Shorts</div><div onClick={()=>setShowUp(!showUp)} style={{background:'red', width:42, height:42, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, marginTop:-12}}>+</div><div style={{textAlign:'center', color:'#aaa', fontSize:11}}><div style={{fontSize:18}}>📺</div>Subs</div><div style={{textAlign:'center', color:'#aaa', fontSize:11}}><div style={{fontSize:18}}>📚</div>Library</div></div>
    </div>
  )
}
