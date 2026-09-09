import { useState, useEffect } from 'react'

function openDB(){
  return new Promise((res)=>{
    const r=indexedDB.open("PlayVideoDB_FINAL",2)
    r.onupgradeneeded=()=>r.result.createObjectStore("videos",{keyPath:"id"})
    r.onsuccess=()=>res(r.result)
  })
}
async function getAll(){ const db=await openDB(); return new Promise(r=>{ const q=db.transaction("videos","readonly").objectStore("videos").getAll(); q.onsuccess=()=>r(q.result) }) }
async function save(v){ const db=await openDB(); db.transaction("videos","readwrite").objectStore("videos").put(v) }
async function del(id){ const db=await openDB(); db.transaction("videos","readwrite").objectStore("videos").delete(id) }

export default function App(){
  const [videos,setVideos]=useState([])
  const [sel,setSel]=useState(null)
  const [title,setTitle]=useState("")
  const [file,setFile]=useState(null)
  const [show,setShow]=useState(false)
  const [cmt,setCmt]=useState("")
  const [liked,setLiked]=useState({})
  const [subscribed,setSubscribed]=useState(false)

  useEffect(()=>{ (async()=>{
    const all=await getAll()
    const withUrl=all.map(v=>({...v, url:URL.createObjectURL(v.blob)}))
    setVideos(withUrl.reverse())
  })() },[])

  async function upload(){
    if(!title||!file) return alert("Title + Video din!")
    const v={id:Date.now(), title, blob:file, views:449, channel:"My Channel", comments:[]}
    await save(v)
    setVideos([{...v, url:URL.createObjectURL(file)},...videos])
    setTitle(""); setFile(null); setShow(false)
    alert("Upload Done Boss! Video te click korun ▶️")
  }

  // WATCH PAGE - SOB TOOLS EKHANE
  if(sel){
    const isLiked=liked[sel.id]
    return (
      <div style={{background:'#0f0f0f',color:'white',minHeight:'100vh',fontFamily:'system-ui'}}>
        <div style={{padding:10,background:'black',display:'flex',alignItems:'center',gap:10,position:'sticky',top:0,zIndex:10}}>
          <button onClick={()=>setSel(null)} style={{background:'#222',border:0,color:'white',padding:'8px 14px',borderRadius:20,fontWeight:'bold'}}>← Back</button>
          <b>▶️ PlayVideo</b>
        </div>

        <video src={sel.url} controls autoPlay playsInline style={{width:'100%',maxHeight:'50vh',background:'black'}} />

        <div style={{padding:12}}>
          <h3 style={{margin:'6px 0'}}>{sel.title}</h3>
          <div style={{color:'#aaa',fontSize:12}}>{sel.views} views • Long Video • 2 hours ago</div>

          <div style={{display:'flex',alignItems:'center',gap:10,marginTop:12}}>
            <div style={{width:36,height:36,background:'red',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'bold'}}>M</div>
            <div style={{flex:1}}><div style={{fontWeight:'bold',fontSize:14}}>My Channel ✔️</div><div style={{fontSize:11,color:'#aaa'}}>15K subscribers</div></div>
            <button onClick={()=>setSubscribed(!subscribed)} style={{background:subscribed?'#272727':'white',color:subscribed?'white':'black',border:0,padding:'8px 14px',borderRadius:20,fontWeight:'bold',fontSize:12}}>{subscribed?'Subscribed':'Subscribe'}</button>
            <button onClick={()=>alert("🔔 Bell On! Notification paben Boss!")} style={{background:'#272727',border:0,color:'white',padding:'6px 10px',borderRadius:20,fontSize:18}}>🔔</button>
          </div>

          <div style={{display:'flex',gap:8,marginTop:14,overflowX:'auto',paddingBottom:4}}>
            <button onClick={()=>setLiked({...liked,[sel.id]:!isLiked})} style={{background:isLiked?'#3ea6ff':'#272727',color:isLiked?'black':'white',border:0,padding:'8px 14px',borderRadius:20,fontWeight:'bold',display:'flex',gap:5}}>{isLiked?'👍':'👍'} {isLiked?2:1} Like</button>
            <button onClick={()=>alert("👎 Disliked")} style={{background:'#272727',border:0,color:'white',padding:'8px 14px',borderRadius:20}}>👎 Dislike</button>
            <button onClick={async()=>{ try{ await navigator.share({title:sel.title, url:window.location.href}); }catch{ navigator.clipboard.writeText(window.location.href); alert("🔗 Link Copied! Share korun Boss!") } }} style={{background:'#272727',border:0,color:'white',padding:'8px 14px',borderRadius:20,fontWeight:'bold'}}>↗️ Share</button>
            <button onClick={async()=>{ await del(sel.id); setVideos(vs=>vs.filter(x=>x.id!==sel.id)); setSel(null); alert("Deleted!") }} style={{background:'#272727',border:0,color:'#ff6666',padding:'8px 14px',borderRadius:20}}>🗑️ Delete</button>
          </div>

          <div style={{background:'#212121',padding:10,borderRadius:10,marginTop:12,textAlign:'center',fontSize:12,border:'1px dashed #555'}}>💰 AD SPACE - Ekhane Ad bosle income hobe</div>

          <div style={{marginTop:16}}>
            <b>{sel.comments.length} Comments</b>
            <div style={{display:'flex',gap:6,marginTop:10}}>
              <input value={cmt} onChange={e=>setCmt(e.target.value)} placeholder="Add a comment..." style={{flex:1,padding:10,borderRadius:20,border:0,background:'#212121',color:'white',outline:'none'}}/>
              <button onClick={()=>{ if(!cmt.trim()) return; const up={...sel, comments:[...sel.comments,cmt]}; setSel(up); setVideos(vs=>vs.map(x=>x.id===sel.id?up:x)); setCmt("") }} style={{background:'#3ea6ff',border:0,color:'black',padding:'8px 14px',borderRadius:20,fontWeight:'bold'}}>Post</button>
            </div>
            {sel.comments.map((c,i)=><div key={i} style={{marginTop:10,background:'#181818',padding:8,borderRadius:8,fontSize:14}}>😎 {c}</div>)}
            {sel.comments.length===0 && <div style={{color:'#666',fontSize:12,marginTop:8}}>No comments yet - first comment korun!</div>}
          </div>
        </div>
      </div>
    )
  }

  // HOME PAGE
  return (
    <div style={{background:'#0f0f0f',color:'white',minHeight:'100vh',paddingBottom:80,fontFamily:'system-ui'}}>
      <div style={{background:'#0f0f0f',padding:'10px 12px',display:'flex',alignItems:'center',gap:10,borderBottom:'1px solid #222',position:'sticky',top:0,zIndex:10}}>
        <span style={{fontSize:22}}>☰</span>
        <b style={{fontSize:18}}>▶️ <span style={{color:'red'}}>Play</span>Video</b>
        <div style={{flex:1}}></div>
        <button onClick={()=>setShow(!show)} style={{background:'red',border:0,color:'white',width:36,height:36,borderRadius:'50%',fontSize:20,fontWeight:'bold'}}>+</button>
      </div>

      {show && <div style={{margin:10,background:'#212121',padding:12,borderRadius:12,border:'1px solid #333'}}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Video title likhun..." style={{width:'100%',padding:12,borderRadius:8,border:0,background:'#111',color:'white',marginBottom:8,boxSizing:'border-box'}}/>
        <input type="file" accept="video/*" onChange={e=>setFile(e.target.files[0])} style={{width:'100%',marginBottom:10,color:'white'}}/>
        <button onClick={upload} style={{width:'100%',padding:12,background:'red',border:0,borderRadius:8,color:'white',fontWeight:'bold',fontSize:15}}>PUBLISH VIDEO 🚀</button>
      </div>
