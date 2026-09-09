import { useState, useEffect } from 'react'

function openDB(){
  return new Promise((res,rej)=>{
    const r=indexedDB.open("PlayVideoDB",6)
    r.onupgradeneeded=()=>{ if(!r.result.objectStoreNames.contains("videos")) r.result.createObjectStore("videos",{keyPath:"id"}) }
    r.onsuccess=()=>res(r.result)
  })
}
async function saveDB(v){ const db=await openDB(); db.transaction("videos","readwrite").objectStore("videos").put(v) }
async function getAllDB(){ const db=await openDB(); return new Promise(res=>{ const q=db.transaction("videos","readonly").objectStore("videos").getAll(); q.onsuccess=()=>res(q.result) }) }
async function delDB(id){ const db=await openDB(); db.transaction("videos","readwrite").objectStore("videos").delete(id) }

export default function App(){
  const [videos,setVideos]=useState([])
  const [sel,setSel]=useState(null)
  const [title,setTitle]=useState("")
  const [file,setFile]=useState(null)
  const [show,setShow]=useState(false)
  const [cmt,setCmt]=useState("")

  useEffect(()=>{ (async()=>{
    const all=await getAllDB()
    const withUrl=all.map(v=>({...v, url: URL.createObjectURL(v.blob)}))
    setVideos(withUrl.reverse())
  })() },[])

  async function upload(){
    if(!title||!file) return alert("Title + video din Boss!")
    const isShort = file.size < 10*1024*1024 && confirm("Short banaben? OK=Short, Cancel=Long")
    const v={id:Date.now(), title, channel:"My Channel", blob:file, views:Math.floor(Math.random()*5000)+10, likes:0, comments:[], dur:`${Math.floor(Math.random()*15)+1}:${String(Math.floor(Math.random()*60)).padStart(2,'0')}`, isShort}
    await saveDB(v)
    setVideos([{...v, url:URL.createObjectURL(file)},...videos])
    setTitle(""); setFile(null); setShow(false); alert("Upload Done! 🚀")
  }

  if(sel){
    return (
      <div style={{background:'#0f0f0f',color:'white',minHeight:'100vh',fontFamily:'system-ui'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,padding:10,background:'#0f0f0f',position:'sticky',top:0,zIndex:10}}>
          <button onClick={()=>setSel(null)} style={{background:'#272727',border:0,color:'white',padding:'8px 12px',borderRadius:20}}>← Back</button>
          <b>▶️ PlayVideo</b>
        </div>
        <video src={sel.url} controls autoPlay playsInline style={{width:'100%',background:'black',maxHeight:'55vh'}} />
        <div style={{padding:12}}>
          <h3 style={{margin:'8px 0'}}>{sel.title}</h3>
          <p style={{color:'#aaa',fontSize:13}}>{sel.views} views • {sel.isShort?"Short":"Long Video"}</p>

          <div style={{display:'flex',alignItems:'center',gap:10,marginTop:12}}>
            <div style={{width:36,height:36,background:'red',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'bold'}}>M</div>
            <div style={{flex:1}}><b style={{fontSize:14}}>My Channel ✔️</b><br/><span style={{fontSize:11,color:'#aaa'}}>15K subscribers</span></div>
            <button style={{background:'white',color:'black',border:0,padding:'8px 14px',borderRadius:20,fontWeight:'bold',fontSize:12}}>Subscribe</button>
            <span style={{fontSize:20}}>🔔</span>
          </div>

          <div style={{display:'flex',gap:8,marginTop:14,overflowX:'auto'}}>
            <button onClick={()=>{ const up={...sel, likes:sel.likes+1}; setSel(up); setVideos(vs=>vs.map(x=>x.id===sel.id?up:x)) }} style={{background:'#272727',color:'white',border:0,padding:'8px 16px',borderRadius:20,fontWeight:'bold'}}>👍 {sel.likes} Like</button>
            <button style={{background:'#272727',color:'white',border:0,padding:'8px 16px',borderRadius:20}}>👎 Dislike</button>
            <button onClick={()=>{navigator.clipboard.writeText(window.location.href); alert("Link Copied 🔗")}} style={{background:'#272727',color:'white',border:0,padding:'8px 16px',borderRadius:20}}>↗️ Share</button>
            <button onClick={async()=>{ await delDB(sel.id); setVideos(vs=>vs.filter(x=>x.id!==sel.id)); setSel(null) }} style={{background:'#272727',color:'#ff6b6b',border:0,padding:'8px 16px',borderRadius:20}}>🗑️ Delete</button>
          </div>

          <div style={{background:'#1e1e1e',padding:12,borderRadius:10,marginTop:14,textAlign:'center',border:'1px dashed #555',fontSize:12}}>💰 AD SPACE - Ekhane Ad bosbe</div>

          <div style={{marginTop:16}}>
            <b>Comments</b>
            <div style={{display:'flex',gap:8,marginTop:10}}>
              <input value={cmt} onChange={e=>setCmt(e.target.value)} placeholder="Comment..." style={{flex:1,padding:10,borderRadius:20,border:'1px solid #333',background:'#111',color:'white'}}/>
              <button onClick={()=>{ if(!cmt) return; const up={...sel, comments:[...sel.comments,{id:Date.now(),text:cmt}]}; setSel(up); setVideos(vs=>vs.map(x=>x.id===sel.id?up:x)); setCmt("") }} style={{background:'#3ea6ff',border:0,padding:'8px 14px',borderRadius:20,fontWeight:'bold'}}>Post</button>
            </div>
            {sel.comments.map(c=><div key={c.id} style={{marginTop:10,background:'#181818',padding:8,borderRadius:8,fontSize:14}}>😎 {c.text}</div>)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{background:'#0f0f0f',color:'white',minHeight:'100vh',paddingBottom:80,fontFamily:'system-ui'}}>
      <header style={{padding:'10px 12px',display:'flex',alignItems:'center',gap:10,position:'sticky',top:0,background:'#0f0f0f',zIndex:10,borderBottom:'1px solid #222'}}>
        <span style={{fontSize:22}}>☰</span>
        <b style={{fontSize:19}}>▶️ <span style={{color:'red'}}>Play</span>Video</b>
        <div style={{flex:1}}></div>
        <button onClick={()=>setShow(!show)} style={{background:'red',border:0,color:'white',padding:'6px 12px',borderRadius:20,fontWeight:'bold'}}>+</button>
      </header>

      {show && <div style={{margin:10,background:'#212121',padding:12,borderRadius:12}}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Video title..." style={{width:'100%',padding:10,borderRadius:8,border:0,background:'#111',color:'white',marginBottom:8,boxSizing:'border-box'}}/>
        <input type="file" accept="video/*" onChange={e=>setFile(e.target.files[0])} style={{width:'100%',marginBottom:8}}/>
        <button onClick={upload} style={{width:'100%',padding:10,background:'red',border:0,borderRadius:8,color:'white',fontWeight:'bold'}}>PUBLISH</button>
      </div>}

      <div style={{padding:10}}>
        {videos.length===0 && <div style={{textAlign:'center',marginTop:80,color:'#777'}}>Kono video nei<br/>Upload korun Boss! 👆</div>}

        {/* LONG */}
        <div style={{fontWeight:'bold',margin:'10px 0'}}>📺 Long Videos</div>
        {videos.filter(v=>!v.isShort).map(v=>(
          <div key={v.id} onClick={()=>setSel(v)} style={{marginBottom:16,background:'#181818',borderRadius:12,overflow:'hidden'}}>
            <div style={{position:'relative'}}>
              <video src={v.url} muted style={{width:'100%',aspectRatio:'16/9',objectFit:'cover',background:'#000'}} />
              <div style={{position:'absolute',bottom:8,right:8,background:'black',padding:'2px 6px',borderRadius:4,fontSize:11}}>{v.dur}</div>
              <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:48,height:48,background:'rgba(0,0,0,0.6)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>▶️</div>
            </div>
            <div style={{padding:10}}><b style={{fontSize:14}}>{v.title}</b><br/><span style={{fontSize:12,color:'#aaa'}}>{v.views} views • My Channel ✔️</span></div>
          </div>
        ))}

        {/* SHORTS */}
        {videos.filter(v=>v.isShort).length>0 && <>
          <div style={{fontWeight:'bold',margin:'16px 0 10px'}}>🔥 Shorts</div>
          <div style={{display:'flex',gap:10,overflowX:'auto'}}>
            {videos.filter(v=>v.isShort).map(v=>(
              <div key={v.id} onClick={()=>setSel(v)} style={{minWidth:130}}>
                <video src={v.url} muted style={{width:130,height:220,objectFit:'cover',borderRadius:12,background:'#000'}}/>
                <div style={{fontSize:12,marginTop:4}}>{v.title.slice(0,25)}</div>
                <div style={{fontSize:11,color:'#aaa'}}>{v.views} views</div>
              </div>
            ))}
          </div>
        </>}
      </div>

      <div style={{position:'fixed',bottom:0,left:0,right:0,background:'#0f0f0f',display:'flex',justifyContent:'space-around',padding:'8px 0',borderTop:'1px solid #222'}}>
        <div style={{textAlign:'center'}}><div>🏠</div><div style={{fontSize:10,color:'red'}}>Home</div></div>
        <div style={{textAlign:'center',color:'#aaa'}}><div>🎬</div><div style={{fontSize:10}}>Shorts</div></div>
        <div onClick={()=>setShow(!show)} style={{width:36,height:28,background:'white',color:'black',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'bold'}}>+</div>
        <div style={{textAlign:'center',color:'#aaa'}}><div>📺</div><div style={{fontSize:10}}>Subs</div></div>
        <div style={{textAlign:'center',color:'#aaa'}}><div>▶️</div><div style={{fontSize:10}}>You</div></div>
      </div>
    </div>
  )
}
