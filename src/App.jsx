import { useState, useEffect } from 'react'
const cats = ["All", "Coding", "Music", "Tech", "Gaming", "AI"]

function openDB(){
  return new Promise((res, rej)=>{
    const r = indexedDB.open("PlayVideoDB",2)
    r.onupgradeneeded = ()=>{
      if(!r.result.objectStoreNames.contains("videos")) r.result.createObjectStore("videos", {keyPath:"id"})
    }
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
  req.onsuccess = ()=>{
    const v = {...req.result,...data}
    store.put(v)
  }
}
async function getAllFromDB(){
  const db = await openDB()
  return new Promise((res)=>{
    const req = db.transaction("videos","readonly").objectStore("videos").getAll()
    req.onsuccess = ()=> res(req.result)
  })
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

  useEffect(()=>{
    (async()=>{
      const all = await getAllFromDB()
      const withUrl = all.map(v=> ({...v, video_url: URL.createObjectURL(v.blob), likes:v.likes||0, liked:v.liked||false, comments:v.comments||[]}))
      setVideos(withUrl)
      setLoading(false)
    })()
  },[])

  async function upload(){
    if(!title) return alert("Title din Boss!")
    if(!file) return alert("Video din!")
    const newV = {id: Date.now(), title, blob: file, views: Math.floor(Math.random()*900)+10, likes:0, liked:false, comments:[], created_at: new Date().toISOString()}
    await saveToDB(newV)
    const withUrl = {...newV, video_url: URL.createObjectURL(file)}
    setVideos([withUrl,...videos])
    setTitle(""); setFile(null); setShowUp(false)
    alert("Viral Video Upload Done Boss! 🚀")
  }

  function openVideo(v){ setSelected(v); window.scrollTo(0,0); setVideos(prev=> prev.map(x=> x.id===v.id? {...x, views:x.views+1}:x)); updateInDB(v.id, {views:v.views+1}) }

  function toggleLike(){
    const newLiked =!selected.liked
    const newLikes = newLiked? selected.likes+1 : selected.likes-1
    const updated = {...selected, liked:newLiked, likes:newLikes}
    setSelected(updated)
    setVideos(videos.map(v=> v.id===selected.id? updated : v))
    updateInDB(selected.id, {liked:newLiked, likes:newLikes})
  }

  function addComment(){
    if(!comment) return
    const newComments = [...(selected.comments||[]), {id:Date.now(), text:comment, time:"Just now"}]
    const updated = {...selected, comments:newComments}
    setSelected(updated)
    setVideos(videos.map(v=> v.id===selected.id? updated : v))
    updateInDB(selected.id, {comments:newComments})
    setComment("")
  }

  function shareVideo(){
    if(navigator.share){
      navigator.share({title:selected.title, text:"Dekho ei video ta!", url: window.location.href})
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link Copy hoye geche Boss! Share korun! 🔗")
    }
  }

  async function delVideo(id, e){
    if(e) e.stopPropagation()
    if(!confirm("Delete korben Boss?")) return
    await deleteFromDB(id)
    setVideos(videos.filter(v=>v.id!==id))
    setSelected(null)
  }

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

      {selected? <div>
        <video src={selected.video_url} controls autoPlay style={{width:'100%', maxHeight:'55vh', background:'black'}}/>
        <div style={{padding:12}}>
          <h3 style={{margin:'5px 0'}}>{selected.title}</h3>
          <p style={{color:'#aaa', margin:'4px 0'}}>{selected.views} views • {selected.likes} likes</p>
