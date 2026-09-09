import { useState, useEffect } from 'react'

function openDB(){
  return new Promise((res)=>{
    const r=indexedDB.open("PlayVideoDB_FINAL",2)
    r.onupgradeneeded=()=>{ if(!r.result.objectStoreNames.contains("videos")) r.result.createObjectStore("videos",{keyPath:"id"}) }
    r.onsuccess=()=>res(r.result)
  })
}

export default function App(){
  const [videos,setVideos]=useState([])
  const [sel,setSel]=useState(null)
  const [title,setTitle]=useState("")
  const [file,setFile]=useState(null)
  const [show,setShow]=useState(false)
  const [cmt,setCmt]=useState("")
  const [liked,setLiked]=useState({})

  useEffect(()=>{ (async()=>{
    const db=await openDB()
    const req=db.transaction("videos","readonly").objectStore("videos").getAll()
    req.onsuccess=()=>{
      const withUrl=req.result.map(v=>({...v, url:URL.createObjectURL(v.blob)}))
      setVideos(withUrl.reverse())
    }
  })() },[])

  async function upload(){
    if(!title||!file){ alert("Title + Video din Boss!"); return }
    const db=await openDB()
    const v={id:Date.now(), title, blob:file, views:449, comments:[]}
    db.transaction("videos","readwrite").objectStore("videos").put(v)
    setVideos([{...v, url:URL.createObjectURL(file)},...videos])
    setTitle(""); setFile(null); setShow(false)
  }

  if(sel){
    return (
      <div style={{background:'#0f0f0f',color:'white',minHeight:'100vh'}}>
        <div style={{padding:10,background:'#000',display:'flex',gap:10,alignItems:'center'}}>
          <button onClick={()=>setSel(null)} style={{background:'#222',border:0,color:'white',padding:'8px 14px',borderRadius:20}}>Back</button>
          <b>PlayVideo</b>
        </div>
        <video src={sel.url} controls autoPlay style={{width:'100%',background:'black'}} />
        <div style={{padding:12}}>
          <h3>{sel.title}</h3>
          <p style={{color:'#aaa',fontSize:12}}>{sel.views} views - My Channel</p>
          <div style={{display:'flex',gap:8,marginTop:12,flexWrap:'wrap'}}>
            <button onClick={()=>setLiked({...liked,[sel.id]:!liked[sel.id]})} style={{background:liked[sel.id]?'#3ea6ff':'#272727',color:liked[sel.id]?'black':'white',border:0,padding:'8px 14px',borderRadius:20}}>{liked[sel.id]?'👍 Liked':'👍 Like'}</button>
            <button style={{background:'#272727',border:0,color:'white',padding:'8px 14px',borderRadius:20}}>👎 Dislike</button>
            <button onClick={()=>{ navigator.clipboard.writeText(window.location.href); alert("Link Copied 🔗"); }} style={{background:'#272727',border:0,color:'white',padding:'8px 14px',borderRadius:20}}>Share</button>
            <button onClick={()=>alert("🔔 Bell On!")} style={{background:'#272727',border:0,color:'white',padding:'8px 14px',borderRadius:20}}>🔔 Subscribe</button>
          </div>
          <div style={{marginTop:14}}>
            <b>Comments</b>
            <div style={{display:'flex',gap:6,marginTop:8}}>
              <input value={cmt} onChange={e=>setCmt(e.target.value)} placeholder="Comment..." style={{flex:1,padding:10,borderRadius:20,border:0,background:'#222',color:'white'}}/>
              <button onClick={()=>{ if(!cmt) return; const up={...sel, comments:[...sel.comments,cmt]}; setSel(up); setCmt(""); }} style={{background:'#3ea6ff',border:0,padding:'8px 12px',borderRadius:20}}>Post</button>
            </div>
            {sel.comments.map((c,i)=><div key={i} style={{marginTop:8,background:'#181818',padding:8,borderRadius:8}}>😎 {c}</div>)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{background:'#0f0f0f',color:'white',minHeight:'100vh',paddingBottom:80}}>
      <div style={{padding:'10px 12px',display:'flex',alignItems:'center',gap:10,borderBottom:'1px solid #222',position:'sticky',top:0,background:'#0f0f0f'}}>
        <b style={{fontSize:18}}>▶️ Play<span style={{color:'red'}}>Video</span></b>
        <div style={{flex:1}}></div>
        <button onClick={()=>setShow(!show)} style={{background:'red',border:0,color:'white',width:36,height:36,borderRadius:'50%',fontSize:20}}>+</button>
      </div>
      {show && <div style={{margin:10,background:'#212121',padding:12,borderRadius:12}}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title..." style={{width:'100%',padding:10,borderRadius:8,border:0,background:'#111',color:'white',marginBottom:8,boxSizing:'border-box'}}/>
        <input type="file" accept="video/*" onChange={e=>setFile(e.target.files[0])} style={{width:'100%',marginBottom:8}}/>
        <button onClick={upload} style={{width:'100%',padding:10,background:'red',border:0,borderRadius:8,color:'white',fontWeight:'bold'}}>PUBLISH</button>
      </div>}
      <div style={{padding:10}}>
        <div style={{fontWeight:'bold',marginBottom:10}}>Long Videos</div>
        {videos.map(v=>(
          <div key={v.id} onClick={()=>setSel(v)} style={{marginBottom:14,background:'#181818',borderRadius:12,overflow:'hidden',border:'1px solid #222',cursor:'pointer'}}>
            <div style={{position:'relative'}}>
              <video src={v.url} muted style={{width:'100%',aspectRatio:'16/9',background:'black',display:'block'}} />
              <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{width:56,height:56,background:'rgba(0,0,0,0.7)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24}}>▶️</div></div>
            </div>
            <div style={{padding:10}}><b>{v.title}</b><br/><span style={{fontSize:12,color:'#aaa'}}>{v.views} views - Click kore Like/Share/Comment korun</span></div>
          </div>
        ))}
        {videos.length===0 && <div style={{textAlign:'center',marginTop:50,color:'#777'}}>Upload korun Boss 👆</div>}
      </div>
    </div>
  )
}
