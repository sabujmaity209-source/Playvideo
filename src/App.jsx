import { useState, useEffect } from 'react'

const cats = ["All", "Coding", "Music", "Tech", "Gaming", "AI"]

export default function App() {
  const [videos, setVideos] = useState(()=>{
    try{
      const s = localStorage.getItem('playvideos_final')
      return s? JSON.parse(s) : []
    }catch{ return [] }
  })
  const [selected, setSelected] = useState(null)
  const [cat, setCat] = useState("All")
  const [page, setPage] = useState("Home")
  const [search, setSearch] = useState("")
  const [title, setTitle] = useState("")
  const [file, setFile] = useState(null)
  const [showUp, setShowUp] = useState(false)

  useEffect(()=>{
    localStorage.setItem('playvideos_final', JSON.stringify(videos))
  }, [videos])

  function openVideo(v){
    setSelected(v)
    setPage("Watch")
    window.scrollTo(0,0)
    setVideos(prev=> prev.map(x=> x.id===v.id? {...x, views:x.views+1}:x))
  }

  function upload(){
    if(!title) return alert("Title din Boss!")
    if(!file) return alert("Video din!")
    const url = URL.createObjectURL(file)
    const newV = {id: Date.now(), title, video_url: url, views: Math.floor(Math.random()*900)+10, created_at: new Date().toISOString()}
    setVideos([newV,...videos])
    setTitle(""); setFile(null); setShowUp(false)
    alert("Upload Success Boss! 🚀 Video cholbe!")
  }

  let filtered = videos.filter(v=> v.title.toLowerCase().includes(search.toLowerCase()))
  if(cat!=="All") filtered = filtered.filter(v=> v.title.toLowerCase().includes(cat.toLowerCase()))

  return (
    <div style={{background:'#0f0f0f', color:'white', minHeight:'100vh', paddingBottom:80}}>
      <header style={{padding:'10px 12px', display:'flex', gap:8, alignItems:'center', position:'sticky', top:0, background:'#0f0f0f', zIndex:10, borderBottom:'1px solid #222'}}>
        <h3 style={{margin:0}}>▶ PlayVideo</h3>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{flex:1, padding:'8px 14px', borderRadius:20, border:'1px solid #333', background:'#121212', color:'white'}}/>
        <button onClick={()=>setShowUp(!showUp)} style={{background:'red', color:'white', border:0, padding:'7px 12px', borderRadius:20, fontWeight:'bold'}}>+ Upload</button>
      </header>
      <div style={{display:'flex', gap:8, padding:10, overflowX:'auto'}}>
        {cats.map(c=><button key={c} onClick={()=>{setCat(c); setPage("Home"); setSelected(null)}} style={{background:cat===c?'white':'#272727', color:cat===c?'black':'white', border:0, padding:'6px 12px', borderRadius:8, flexShrink:0}}>{c}</button>)}
      </div>
      {showUp && <div style={{background:'#212121', margin:12, padding:15, borderRadius:12}}><input placeholder="Title..." value={title} onChange={e=>setTitle(e.target.value)} style={{width:'100%', padding:12, borderRadius:8, border:0, background:'#333', color:'white', marginBottom:10, boxSizing:'border-box'}}/><input type="file" accept="video/*" onChange={e=>setFile(e.target.files[0])} style={{width:'100%', marginBottom:10}}/><button onClick={upload} style={{width:'100%', padding:12, background:'red', color:'white', border:0, borderRadius:8, fontWeight:'bold'}}>PUBLISH 🚀</button></div>}
      {selected && page==="Watch"? <div><video src={selected.video_url} controls autoPlay style={{width:'100%', maxHeight:'55vh', background:'black'}}/><div style={{padding:12}}><h3>{selected.title}</h3><p style={{color:'#aaa'}}>{selected.views} views</p><button onClick={()=>{setSelected(null); setPage("Home")}} style={{padding:'8px 14px', borderRadius:20, border:0}}>← Back</button><div style={{background:'#1f1f1f', padding:15, borderRadius:10, marginTop:12, textAlign:'center', border:'1px dashed #555'}}>AD SPACE 300x250</div></div></div> : page==="Home" && <div>{filtered.length===0? <p style={{textAlign:'center', color:'#aaa', marginTop:60}}>Kono video nei - Upload korun Boss!</p> : filtered.map(v=><div key={v.id} onClick={()=>openVideo(v)} style={{marginBottom:10}}><video src={v.video_url} style={{width:'100%', aspectRatio:'16/9', background:'black'}} muted/><div style={{padding:'8px 12px'}}><b>{v.title}</b><br/><small style={{color:'#aaa'}}>{v.views} views</small></div></div>)}</div>}
      <div style={{position:'fixed', bottom:0, left:0, right:0, background:'#0f0f0f', display:'flex', justifyContent:'space-around', padding:'8px 0', borderTop:'1px solid #222'}}><div onClick={()=>{setPage("Home"); setSelected(null)}} style={{textAlign:'center', color:page==="Home"?'white':'#aaa', fontSize:11}}><div style={{fontSize:18}}>🏠</div>Home</div><div onClick={()=>setPage("Shorts")} style={{textAlign:'center', color:'#aaa', fontSize:11}}><div style={{fontSize:18}}>🎬</div>Shorts</div><div onClick={()=>setShowUp(!showUp)} style={{background:'red', width:42, height:42, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, marginTop:-12}}>+</div><div style={{textAlign:'center', color:'#aaa', fontSize:11}}><div style={{fontSize:18}}>📺</div>Subs</div><div style={{textAlign:'center', color:'#aaa', fontSize:11}}><div style={{fontSize:18}}>📚</div>Library</div></div>
    </div>
  )
}
