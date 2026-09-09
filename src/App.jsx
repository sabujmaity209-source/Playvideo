import { useState, useEffect } from 'react'

export default function App(){
  const [videos,setVideos]=useState([])
  const [sel,setSel]=useState(null)
  const [title,setTitle]=useState("")
  const [file,setFile]=useState(null)
  const [show,setShow]=useState(false)
  const [cmt,setCmt]=useState("")
  const [likes,setLikes]=useState({})

  useEffect(()=>{
    const s=localStorage.getItem("playvideo_v2")
    if(s){ try{ const p=JSON.parse(s); setVideos(p.map(v=>({...v, url:v.url})))}catch{} }
  },[])

  async function upload(){
    if(!title||!file) return alert("Title + Video din Boss!")
    const url=URL.createObjectURL(file)
    const v={id:Date.now(), title, url, views:608, channel:"My Channel", comments:[]}
    const nv=[v,...videos]
    setVideos(nv);
    try{
      const toSave=nv.slice(0,3).map(x=>({id:x.id,title:x.title,views:x.views,channel:x.channel,comments:x.comments,url:x.url}))
      localStorage.setItem("playvideo_v2", JSON.stringify(toSave))
    }catch{}
    setTitle(""); setFile(null); setShow(false)
  }

  if(sel){
    return (
      <div style={{background:'#0f0f0f',color:'white',minHeight:'100vh'}}>
        <div style={{padding:10,display:'flex',gap:10,alignItems:'center',background:'#000',position:'sticky',top:0,zIndex:10}}>
          <button onClick={()=>setSel(null)} style={{background:'#222',border:0,color:'white',padding:'8px 12px',borderRadius:20}}>← Back</button>
          <b>▶️ PlayVideo</b>
        </div>
        <video src={sel.url} controls autoPlay playsInline style={{width:'100%',background:'black'}} />
        <div style={{padding:12}}>
          <h3 style={{margin:'5px 0'}}>{sel.title}</h3>
          <div style={{color:'#aaa',fontSize:12}}>{sel.views} views • My Channel ✔️</div>
          <div style={{display:'flex',gap:8,marginTop:12,flexWrap:'wrap'}}>
            <button onClick={()=>{ const k=sel.id; const l=(likes[k]||0)+1; setLikes({...likes,[k]:l}) }} style={{background:'#272727',border:0,color:'white',padding:'8px 14px',borderRadius:20}}>👍 {(likes[sel.id]||0)+1} Like</button>
            <button style={{background:'#272727',border:0,color:'white',padding:'8px 14px',borderRadius:20}}>👎 Dislike</button>
            <button onClick={()=>{navigator.clipboard.writeText(sel.title); alert("Copied 🔗")}} style={{background:'#272727',border:0,color:'white',padding:'8px 14px',borderRadius:20}}>↗️ Share</button>
            <button style={{background:'#272727',border:0,color:'white',padding:'8px 14px',borderRadius:20}}>🔔 Subscribe</button>
          </div>
          <div style={{marginTop:14,background:'#1e1e1e',padding:10,borderRadius:8,textAlign:'center',fontSize:12,border:'1px dashed #555'}}>💰 AD SPACE - Ekhane apnar Ad bosbe</div>
          <div style={{marginTop:14}}>
            <b>Comments</b>
            <div style={{display:'flex',gap:6,marginTop:8}}>
              <input value={cmt} onChange={e=>setCmt(e.target.value)} placeholder="Comment likhun..." style={{flex:1,padding:10,borderRadius:20,border:0,background:'#222',color:'white'}}/>
              <button onClick={()=>{ if(!cmt) return; const up={...sel, comments:[...sel.comments,cmt]}; setSel(up); setVideos(vs=>vs.map(x=>x.id===sel.id?up:x)); setCmt("") }} style={{background:'#3ea6ff',border:0,padding:'8px 12px',borderRadius:20}}>Post</button>
            </div>
            {sel.comments.map((c,i)=><div key={i} style={{marginTop:8,background:'#181818',padding:8,borderRadius:8}}>😎 {c}</div>)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{background:'#0f0f0f',color:'white',minHeight:'100vh',paddingBottom:80}}>
      <div style={{background:'#0f0f0f',padding:'10px 12px',display:'flex',alignItems:'center',gap:10,borderBottom:'1px solid #222',position:'sticky',top:0,zIndex:10}}>
        <b style={{fontSize:18}}>▶️ Play<span style={{color:'red'}}>Video</span></b>
        <div style={{flex:1}}></div>
        <button onClick={()=>setShow(!show)} style={{background:'red',border:0,color:'white',padding:'6px 12px',borderRadius:20,fontWeight:'bold'}}>+ Upload</button>
      </div>

      {show && <div style={{margin:10,background:'#222',padding:12,borderRadius:12}}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Video title - ex: Amer dokana" style={{width:'100%',padding:10,borderRadius:8,border:0,background:'#111',color:'white',marginBottom:8,boxSizing:'border-box'}}/>
        <input type="file" accept="video/*" onChange={e=>setFile(e.target.files[0])} style={{width:'100%',marginBottom:8}}/>
        <button onClick={upload} style={{width:'100%',padding:10,background:'red',border:0,borderRadius:8,color:'white',fontWeight:'bold'}}>PUBLISH NOW</button>
      </div>}

      <div style={{padding:10}}>
        {videos.length===0 && <div style={{textAlign:'center',marginTop:60,color:'#777'}}>Kono video nei<br/>Upload korun Boss! 👆<br/><button onClick={()=>setShow(true)} style={{marginTop:10,background:'red',border:0,color:'white',padding:'8px 16px',borderRadius:20}}>+ First Video Upload</button></div>}
        {videos.map(v=>(
          <div key={v.id} onClick={()=>setSel(v)} style={{marginBottom:14,background:'#181818',borderRadius:12,overflow:'hidden',border:'1px solid #222'}}>
            <video src={v.url} muted style={{width:'100%',aspectRatio:'16/9',background:'black',objectFit:'cover'}} />
            <div style={{padding:10,display:'flex',gap:8,alignItems:'center'}}>
              <div style={{flex:1}}><b style={{fontSize:14}}>{v.title}</b><br/><span style={{fontSize:11,color:'#aaa'}}>{v.views} views • My Channel ✔️ • Tools sob vitore 👆 click korun</span></div>
              <div style={{background:'red',padding:'6px 10px',borderRadius:20,fontSize:12}}>▶️ Play</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{position:'fixed',bottom:0,left:0,right:0,background:'#0f0f0f',display:'flex',justifyContent:'space-around',padding:'10px 0',borderTop:'1px solid #222'}}>
        <span style={{color:'red'}}>🏠 Home</span><span style={{color:'#666'}}>🎬 Shorts</span><span onClick={()=>setShow(!show)} style={{background:'white',color:'black',padding:'2px 14px',borderRadius:12}}>+</span><span style={{color:'#666'}}>📺 Subs</span><span style={{color:'#666'}}>▶️ You</span>
      </div>
    </div>
  )
}
