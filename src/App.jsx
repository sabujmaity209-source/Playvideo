import { useState, useEffect } from 'react'

function openDB(){
  return new Promise((res,rej)=>{
    const r=indexedDB.open("PlayVideoDB",5)
    r.onupgradeneeded=()=>{ if(!r.result.objectStoreNames.contains("videos")) r.result.createObjectStore("videos",{keyPath:"id"}) }
    r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error)
  })
}
async function saveDB(v){ const db=await openDB(); db.transaction("videos","readwrite").objectStore("videos").put(v) }
async function updateDB(id,d){ const db=await openDB(); const s=db.transaction("videos","readwrite").objectStore("videos"); const req=s.get(id); req.onsuccess=()=>{ if(req.result) s.put({...req.result,...d}) } }
async function getAllDB(){ const db=await openDB(); return new Promise(res=>{ const req=db.transaction("videos","readonly").objectStore("videos").getAll(); req.onsuccess=()=>res(req.result) }) }
async function delDB(id){ const db=await openDB(); db.transaction("videos","readwrite").objectStore("videos").delete(id) }

export default function App(){
  const [videos,setVideos]=useState([])
  const [sel,setSel]=useState(null)
  const [search,setSearch]=useState("")
  const [title,setTitle]=useState("")
  const [file,setFile]=useState(null)
  const [showUp,setShowUp]=useState(false)
  const [loading,setLoading]=useState(true)
  const [cmt,setCmt]=useState("")
  const [type,setType]=useState("Long") // Long or Short
  const [activeTab,setActiveTab]=useState("All")
  const cats=["All","Coding","Music","Tech","Gaming","AI","Space","News","Live"]
  const demoLong=[
    {thumb:"https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600", dur:"09:56", title:"Building PlayVideo - The Ultimate Video Streaming Platform (2026)", ch:"TechVision Code", views:"842,000", time:"2 hours ago"},
    {thumb:"https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600", dur:"15:40", title:"Cyberpunk Nightscape Lo-Fi Chill Beats [24/7 Live Stream]", ch:"Lofi Beats Station", views:"1,250,000", time:"1 day ago"}
  ]

  useEffect(()=>{ (async()=>{ const all=await getAllDB(); const withUrl=all.map(v=>({...v, video_url:URL.createObjectURL(v.blob)})); setVideos(withUrl); setLoading(false) })() },[])

  async function upload(){
    if(!title||!file) return alert("Title + Video din Boss!")
    const isShort = type==="Short"
    const newV={id:Date.now(), title, channel:"My Channel", blob:file, views:Math.floor(Math.random()*9000)+100, likes:0, dislikes:12, liked:false, disliked:false, comments:[], subs:"15.2K", verified:true, dur: isShort? "00:28" : `${Math.floor(Math.random()*20)+1}:${Math.floor(Math.random()*59).toString().padStart(2,'0')}`, isShort, created_at:new Date().toISOString()}
    await saveDB(newV)
    setVideos([{...newV, video_url:URL.createObjectURL(file)},...videos]); setTitle(""); setFile(null); setShowUp(false)
  }

  function openV(v){ setSel(v); window.scrollTo(0,0); const nv=v.views+1; setVideos(vs=>vs.map(x=>x.id===v.id?{...x,views:nv}:x)); updateDB(v.id,{views:nv}) }
  function like(){ const l=!sel.liked; const up={...sel, liked:l, likes:l?sel.likes+1:sel.likes-1, disliked:false}; setSel(up); setVideos(vs=>vs.map(x=>x.id===sel.id?up:x)); updateDB(sel.id,{liked:l,likes:up.likes,disliked:false}) }
  function dislike(){ const d=!sel.disliked; const up={...sel, disliked:d, dislikes:d?sel.dislikes+1:sel.dislikes-1, liked:d?false:sel.liked, likes:d&&sel.liked?sel.likes-1:sel.likes}; setSel(up); setVideos(vs=>vs.map(x=>x.id===sel.id?up:x)); updateDB(sel.id,{disliked:d,dislikes:up.dislikes,liked:up.liked,likes:up.likes}) }

  const shorts = videos.filter(v=>v.isShort)
  const longs = videos.filter(v=>!v.isShort)

  if(loading) return <div style={{background:'#0f0f0f',color:'#fff',height:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>▶️ Loading PlayVideo...</div>

  return (
    <div style={{background:'#0f0f0f',color:'white',minHeight:'100vh',fontFamily:'system-ui'}}>
      {/* TOP BAR - EXACT SCREENSHOT */}
      <header style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px',background:'#0f0f0f',position:'sticky',top:0,zIndex:30}}>
        <div style={{fontSize:22}}>☰</div>
        <div style={{display:'flex',alignItems:'center',gap:6,fontWeight:900,fontSize:20}}><span style={{background:'red',color:'white',borderRadius:6,padding:'2px 6px',fontSize:14}}>▶</span> Play<span style={{color:'red'}}>Video</span></div>
        <div style={{flex:1}}></div>
        <div style={{background:'#272727',width:36,height:36,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}>📹</div>
        <div style={{position:'relative'}}><div style={{fontSize:22}}>🔔</div><div style={{position:'absolute',top:-2,right:-2,background:'red',width:8,height:8,borderRadius:'50%'}}></div></div>
        <div style={{width:32,height:32,borderRadius:'50%',background:'url(https://i.pravatar.cc/100) center/cover'}}></div>
      </header>

      {/* CATEGORY CHIPS - EXACT */}
      <div style={{display:'flex',gap:8,padding:'10px 12px',overflowX:'auto',background:'#0f0f0f',borderBottom:'1px solid #222',scrollbarWidth:'none'}}>
        {cats.map(c=><button key={c} onClick={()=>setActiveTab(c)} style={{background:activeTab===c?'white':'#272727',color:activeTab===c?'black':'white',border:0,padding:'8px 14px',borderRadius:8,fontSize:14,fontWeight:500,flexShrink:0}}>{c}</button>)}
      </div>

      {/* UPLOAD BOX */}
      {showUp && <div style={{margin:12,background:'#212121',padding:14,borderRadius:12}}>
        <div style={{display:'flex',gap:8,marginBottom:10}}>
          <button onClick={()=>setType("Long")} style={{flex:1,padding:8,borderRadius:8,border:0,background:type==="Long"?'white':'#333',color:type==="Long"?'black':'white',fontWeight:'bold'}}>Long Video</button>
          <button onClick={()=>setType("Short")} style={{flex:1,padding:8,borderRadius:8,border:0,background:type==="Short"?'white':'#333',color:type==="Short"?'black':'white',fontWeight:'bold'}}>Short Video 🔥</button>
        </div>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder={type==="Short"?"Short title...":"Long video title..."} style={{width:'100%',padding:12,borderRadius:8,border:0,background:'#111',color:'white',marginBottom:8,boxSizing:'border-box'}}/>
        <input type="file" accept="video/*" onChange={e=>setFile(e.target.files[0])} style={{width:'100%',marginBottom:10}}/>
        <button onClick={upload} style={{width:'100%',padding:12,background:'red',border:0,borderRadius:8,color:'white',fontWeight:'bold'}}>UPLOAD {type.toUpperCase()}</button>
      </div>}

      {sel? (
        /* WATCH PAGE - FULL FEATURES */
        <div style={{paddingBottom:80}}>
          <video src={sel.video_url} controls autoPlay style={{width:'100%',maxHeight:'55vh',background:'black'}}/>
          <div style={{padding:12}}>
            <h3 style={{margin:'6px 0',lineHeight:1.3}}>{sel.title}</h3>
            <div style={{color:'#aaa',fontSize:13}}>{sel.views} views • {sel.isShort?"Short":"Long"}</div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginTop:12}}>
              <div style={{width:40,height:40,borderRadius:'50%',background:'#e74c3c',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'bold'}}>{sel.channel[0]}</div>
              <div style={{flex:1}}><div style={{fontWeight:'bold',fontSize:14,display:'flex',gap:4}}>{sel.channel} {sel.verified&&<span style={{color:'#3ea6ff'}}>✔️</span>}</div><div style={{fontSize:11,color:'#aaa'}}>{sel.subs} subscribers</div></div>
              <button style={{background:'white',color:'black',border:0,padding:'8px 16px',borderRadius:20,fontWeight:'bold',fontSize:13}}>Subscribe</button>
              <div style={{fontSize:22}}>🔔</div>
            </div>
            <div style={{display:'flex',gap:8,marginTop:14,overflowX:'auto'}}>
              <div style={{display:'flex',background:'#272727',borderRadius:20,overflow:'hidden'}}>
                <button onClick={like} style={{background:'transparent',border:0,color:'white',padding:'8px 14px',display:'flex',gap:6,alignItems:'center',fontWeight:'bold',borderRight:'1px solid #444'}}>{sel.liked?'👍':'👍'} {sel.likes}</button>
                <button onClick={dislike} style={{background:'transparent',border:0,color:'white',padding:'8px 14px'}}>👎 {sel.dislikes}</button>
              </div>
              <button onClick={()=>{navigator.clipboard.writeText(window.location.href); alert("Link Copied 🔗")}} style={{background:'#272727',color:'white',border:0,padding:'8px 16px',borderRadius:20,fontWeight:'bold'}}>↗️ Share</button>
              <button style={{background:'#272727',color:'white',border:0,padding:'8px 16px',borderRadius:20}}>⬇️ Download</button>
            </div>
            <div style={{background:'#272727',padding:12,borderRadius:12,marginTop:14,fontSize:13}}>💰 AD SPACE - Apnar ad ekhane bosbe<br/>#viral #playvideo</div>
            <div style={{marginTop:16}}>
              <b>{sel.comments.length} Comments</b>
              <div style={{display:'flex',gap:8,marginTop:10}}>
                <input value={cmt} onChange={e=>setCmt(e.target.value)} placeholder="Add a comment..." style={{flex:1,background:'transparent',border:0,borderBottom:'1px solid #333',color:'white',outline:'none'}}/>
                <button onClick={()=>{ if(!cmt) return; const nc=[...sel.comments,{id:Date.now(),text:cmt}]; const up={...sel,comments:nc}; setSel(up); setVideos(vs=>vs.map(x=>x.id===sel.id?up:x)); updateDB(sel.id,{comments:nc}); setCmt("") }} style={{background:'#3ea6ff',border:0,borderRadius:16,padding:'6px 14px',fontWeight:'bold'}}>Post</button>
              </div>
              {sel.comments.map(c=><div key={c.id} style={{marginTop:12,fontSize:14}}>😎 {c.text}</div>)}
            </div>
          </div>
          <div style={{padding:12}}><button onClick={()=>setSel(null)} style={{background:'#272727',border:0,color:'white',padding:'8px 16px',borderRadius:20}}>← Back to Home</button></div>
        </div>
      ) : (
        /* HOME - EXACT LIKE SCREENSHOT + SHORTS */
        <div style={{paddingBottom:80}}>
          {/* YOUR VIDEOS */}
          {videos.length>0 && <div>
            {/* SHORTS ROW */}
            {shorts.length>0 && <div style={{padding:'10px 0'}}>
              <div style={{display:'flex',alignItems:'center',gap:6,padding:'0 12px 8px',fontWeight:'bold'}}><span style={{background:'red',padding:'2px 6px',borderRadius:4,fontSize:12}}>▶</span> Shorts</div>
              <div style={{display:'flex',gap:8,overflowX:'auto',padding:'0 12px'}}>
                {shorts.map(v=><div key={v.id} onClick={()=>openV(v)} style={{minWidth:140,flexShrink:0}}>
                  <video src={v.video_url} style={{width:140,height:250,objectFit:'cover',borderRadius:12,background:'black'}} muted/>
                  <div style={{fontSize:12,marginTop:4,lineHeight:1.2}}>{v.title.slice(0,35)}</div><div style={{fontSize:11,color:'#aaa'}}>{v.views} views</div>
                </div>)}
              </div>
            </div>}

            {/* LONG VIDEOS - SCREENSHOT STYLE */}
            {longs.map(v=><div key={v.id} onClick={()=>openV(v)} style={{marginBottom:18,cursor:'pointer'}}>
              <div style={{position:'relative'}}>
                <video src={v.video_url} style={{width:'100%',aspectRatio:'16/9',background:'#111',objectFit:'cover'}} muted/>
                <div style={{position:'absolute',bottom:8,right:8,background:'rgba(0,0,0,0.8)',padding:'2px 6px',borderRadius:4,fontSize:11}}>{v.dur}</div>
              </div>
              <div style={{display:'flex',gap:10,padding:'10px 12px'}}>
                <div style={{width:36,height:36,borderRadius:'50%',background:'#444',flexShrink:0,backgroundImage:`url(https://i.pravatar.cc/100?u=${v.id})`,backgroundSize:'cover'}}></div>
                <div style={{flex:1}}><div style={{fontWeight:'bold',fontSize:15,lineHeight:1.3}}>{v.title}</div><div style={{color:'#aaa',fontSize:13,marginTop:2,display:'flex',alignItems:'center',gap:4}}>{v.channel} {v.verified&&"✔️"}</div><div style={{color:'#aaa',fontSize:12}}>{v.views} views • 2 hours ago</div></div>
                <div style={{color:'#aaa'}}>⋮</div>
              </div>
            </div>)}
          </div>}

          {/* DEMO VIDEOS - Jodi apnar video na thake */}
          {videos.length===0 && demoLong.map((d,i)=><div key={i} style={{marginBottom:18}}>
            <div style={{position:'relative'}}><img src={d.thumb} style={{width:'100%',aspectRatio:'16/9',objectFit:'cover',borderRadius:0}}/><div style={{position:'absolute',bottom:8,right:8,background:'rgba(0,0,0,0.8)',padding:'2px 6px',borderRadius:4,fontSize:11}}>{d.dur}</div></div>
            <div style={{display:'flex',gap:10,padding:'10px 12px'}}><div style={{width:36,height:36,borderRadius:'50%',background:'#333',flexShrink:0}}></div><div><div style={{fontWeight:'bold'}}>{d.title}</div><div style={{color:'#aaa',fontSize:13}}>{d.ch} ✔️</div><div style={{color:'#aaa',fontSize:12}}>{d.views} views • {d.time}</div></div></div>
          </div>)}

          {videos.length===0 && <div style={{textAlign:'center',padding:40,color:'#777'}}><p>Apnar video upload korun Boss! 👆<br/>Long + Short 2toi cholbe</p><button onClick={()=>setShowUp(true)} style={{marginTop:10,background:'red',color:'white',border:0,padding:'10px 20px',borderRadius:20,fontWeight:'bold'}}>＋ Upload Video</button></div>}
        </div>
      )}

      {/* BOTTOM NAV - EXACT SCREENSHOT */}
      <div style={{position:'fixed',bottom:0,left:0,right:0,background:'#0f0f0f',display:'flex',justifyContent:'space-around',padding:'8px 0',borderTop:'1px solid #222',zIndex:30}}>
        <div onClick={()=>setSel(null)} style={{textAlign:'center',color:!sel?'white':'#aaa'}}><div style={{fontSize:22}}>🏠</div><div style={{fontSize:10,marginTop:2,color:!sel?'red':'#aaa'}}>Home</div></div>
        <div style={{textAlign:'center',color:'#aaa'}}><div style={{fontSize:22}}>🎬</div><div style={{fontSize:10}}>Shorts</div></div>
        <div onClick={()=>setShowUp(!showUp)} style={{background:'#fff',color:'black',width:44,height:32,borderRadius:16,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,marginTop:4}}>+</div>
        <div style={{textAlign:'center',color:'#aaa'}}><div style={{fontSize:22}}>📺</div><div style={{fontSize:10}}>Subs</div></div>
        <div style={{textAlign:'center',color:'#aaa'}}><div style={{fontSize:22}}>▶️</div><div style={{fontSize:10}}>Library</div></div>
      </div>
    </div>
  )
}
