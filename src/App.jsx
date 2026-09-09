import { useState, useEffect, useRef } from 'react'

function openDB(){
  return new Promise((res)=>{
    const r=indexedDB.open("PlayVideoDB",4)
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
  const [search,setSearch]=useState("")
  const [cmt,setCmt]=useState("")
  const [liked,setLiked]=useState({})
  const [disliked,setDisliked]=useState({})
  const [subscribed,setSubscribed]=useState({})
  const [bell,setBell]=useState({})
  const [history,setHistory]=useState([])
  const [likedVideos,setLikedVideos]=useState([])
  const [showShorts,setShowShorts]=useState(false)
  const [shortIndex,setShortIndex]=useState(0)
  const [replyTo,setReplyTo]=useState(null)
  const [replyText,setReplyText]=useState("")
  const videoRef=useRef(null)

  const cats=["All","Music","Gaming","Tech","Comedy","Live","AI","News","Cricket","Bangla","Cooking","Vlog","Education","Meme"]
  const [tab,setTab]=useState("All")

  useEffect(()=>{ (async()=>{
    const db=await openDB()
    const req=db.transaction("videos","readonly").objectStore("videos").getAll()
    req.onsuccess=()=>{
      const withUrl=req.result.map(v=>({...v, url:URL.createObjectURL(v.blob), likes:v.likes||Math.floor(Math.random()*1000)+10, views:v.views||Math.floor(Math.random()*5000)+100, comments:v.comments||[], replies:v.replies||{}}))
      setVideos(withUrl.reverse())
    }
    const h=localStorage.getItem("play_history"); if(h) setHistory(JSON.parse(h))
    const l=localStorage.getItem("play_liked"); if(l) setLikedVideos(JSON.parse(l))
  })() },[])

  async function upload(){
    if(!title||!file) return alert("Title + Video din Boss!")
    const db=await openDB()
    const isShort=file.size < 20*1024*1024
    const v={id:Date.now(), title, blob:file, views:0, likes:0, comments:[], replies:{}, dur:`${Math.floor(Math.random()*15)+1}:${String(Math.floor(Math.random()*60)).padStart(2,'0')}`, isShort, channel:"My Channel", verified:true, subs:"15K"}
    db.transaction("videos","readwrite").objectStore("videos").put(v)
    setVideos([{...v, url:URL.createObjectURL(file), likes:0, views:0, comments:[], replies:{}},...videos])
    setTitle(""); setFile(null); setShow(false)
    alert("Published Boss! 🚀")
  }

  function openVideo(v){
    setSel(v)
    const newHistory=[v.id,...history.filter(id=>id!==v.id)].slice(0,50)
    setHistory(newHistory); localStorage.setItem("play_history",JSON.stringify(newHistory))
    setVideos(vs=>vs.map(x=>x.id===v.id?{...x,views:x.views+1}:x))
    window.scrollTo(0,0)
  }

  function handleLike(){
    if(!sel) return
    const isLiked=liked[sel.id]
    const newLiked={...liked,[sel.id]:!isLiked}
    setLiked(newLiked)
    if(!isLiked){
      const newLikedVideos=[sel.id,...likedVideos.filter(id=>id!==sel.id)]
      setLikedVideos(newLikedVideos); localStorage.setItem("play_liked",JSON.stringify(newLikedVideos))
    } else {
      const newLikedVideos=likedVideos.filter(id=>id!==sel.id)
      setLikedVideos(newLikedVideos); localStorage.setItem("play_liked",JSON.stringify(newLikedVideos))
    }
    const up={...sel, likes:isLiked?sel.likes-1:sel.likes+1}
    setSel(up); setVideos(vs=>vs.map(x=>x.id===sel.id?up:x))
  }

  function handleDislike(){
    if(!sel) return
    setDisliked({...disliked,[sel.id]:!disliked[sel.id]})
  }

  function handleSubscribe(){
    if(!sel) return
    setSubscribed({...subscribed,[sel.id]:!subscribed[sel.id]})
  }

  function handleBell(){
    if(!sel) return
    setBell({...bell,[sel.id]:!bell[sel.id]})
    alert(bell[sel.id]?"🔕 Bell Off":"🔔 Bell On! Sob video er notification pabe Boss!")
  }

  function postComment(){
    if(!cmt.trim()||!sel) return
    const newComment={id:Date.now(), text:cmt, user:"You", time:"Just now", likes:0}
    const up={...sel, comments:[...sel.comments,newComment]}
    setSel(up); setVideos(vs=>vs.map(x=>x.id===sel.id?up:x)); setCmt("")
  }

  function postReply(commentId){
    if(!replyText.trim()||!sel) return
    const newReply={id:Date.now(), text:replyText, user:"You", time:"Just now"}
    const newReplies={...sel.replies, [commentId]:[...(sel.replies[commentId]||[]),newReply]}
    const up={...sel, replies:newReplies}
    setSel(up); setVideos(vs=>vs.map(x=>x.id===sel.id?up:x)); setReplyText(""); setReplyTo(null)
  }

  async function delVideo(id){
    if(!confirm("Delete korbe Boss?")) return
    const db=await openDB()
    db.transaction("videos","readwrite").objectStore("videos").delete(id)
    setVideos(v=>v.filter(x=>x.id!==id))
    setSel(null)
  }

  const filtered=videos.filter(v=>v.title.toLowerCase().includes(search.toLowerCase()) && (tab==="All"||v.title.toLowerCase().includes(tab.toLowerCase())||tab==="All"))
  const shorts=filtered.filter(v=>v.isShort)
  const longs=filtered.filter(v=>!v.isShort)
  const shortList=shorts.length>0?shorts:videos.slice(0,5)

  // SHORTS FULLSCREEN
  if(showShorts){
    const s=shortList[shortIndex]
    if(!s) return <div style={{background:'black',color:'white',height:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>No Shorts</div>
    return (
      <div style={{background:'black',color:'white',height:'100vh',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,padding:12,display:'flex',justifyContent:'space-between',zIndex:10,background:'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)'}}>
          <button onClick={()=>setShowShorts(false)} style={{background:'rgba(255,255,255,0.2)',border:0,color:'white',padding:'8px 14px',borderRadius:20}}>← Back</button>
          <b>Shorts</b>
          <div style={{width:60}}></div>
        </div>
        <video src={s.url} autoPlay loop controls playsInline style={{width:'100%',height:'100vh',objectFit:'cover'}} />
        <div style={{position:'absolute',right:10,bottom:100,display:'flex',flexDirection:'column',gap:16,zIndex:10}}>
          <button onClick={()=>setLiked({...liked,[s.id]:!liked[s.id]})} style={{background:'rgba(255,255,255,0.2)',border:0,width:48,height:48,borderRadius:'50%',color:'white',fontSize:20}}>{liked[s.id]?'❤️':'🤍'}<br/><span style={{fontSize:10}}>{s.likes}</span></button>
          <button style={{background:'rgba(255,255,255,0.2)',border:0,width:48,height:48,borderRadius:'50%',color:'white',fontSize:20}}>💬<br/><span style={{fontSize:10}}>{s.comments.length}</span></button>
          <button onClick={()=>{ navigator.clipboard.writeText(window.location.href); alert("Copied!"); }} style={{background:'rgba(255,255,255,0.2)',border:0,width:48,height:48,borderRadius:'50%',color:'white',fontSize:20}}>↗️</button>
        </div>
        <div style={{position:'absolute',left:10,bottom:20,right:80,zIndex:10}}>
          <b>@{s.channel}</b><br/><span style={{fontSize:14}}>{s.title}</span><br/><span style={{fontSize:12,color:'#ccc'}}>🎵 Original Audio • {s.views} views</span>
        </div>
        <div style={{position:'absolute',left:0,right:0,top:'50%',display:'flex',justifyContent:'space-between',padding:'0 10px',zIndex:10}}>
          <button onClick={()=>setShortIndex(i=>i>0?i-1:shortList.length-1)} style={{background:'rgba(0,0,0,0.5)',border:0,color:'white',padding:12,borderRadius:'50%'}}>‹</button>
          <button onClick={()=>setShortIndex(i=>i<shortList.length-1?i+1:0)} style={{background:'rgba(0,0,0,0.5)',border:0,color:'white',padding:12,borderRadius:'50%'}}>›</button>
        </div>
      </div>
    )
  }

  // WATCH PAGE
  if(sel){
    const isLiked=liked[sel.id]
    const isDisliked=disliked[sel.id]
    const isSub=subscribed[sel.id]
    const isBell=bell[sel.id]
    return (
      <div style={{background:'#0f0f0f',color:'white',minHeight:'100vh',fontFamily:'system-ui'}}>
        <div style={{padding:'10px 12px',display:'flex',alignItems:'center',gap:10,background:'#0f0f0f',borderBottom:'1px solid #222',position:'sticky',top:0,zIndex:10}}>
          <button onClick={()=>setSel(null)} style={{background:'#222',border:0,color:'white',padding:'8px 14px',borderRadius:20}}>← Back</button>
          <b>▶️ PlayVideo</b>
          <div style={{flex:1}}></div>
          <button onClick={()=>{ if(navigator.share) navigator.share({title:sel.title,url:window.location.href}); else { navigator.clipboard.writeText(window.location.href); alert("Copied 🔗"); } }} style={{background:'#222',border:0,color:'white',padding:'6px 12px',borderRadius:20}}>↗️</button>
        </div>
        <video ref={videoRef} src={sel.url} controls autoPlay playsInline style={{width:'100%',maxHeight:'55vh',background:'black'}} />
        <div style={{padding:12}}>
          <h3 style={{margin:'6px 0',lineHeight:1.3,fontSize:18}}>{sel.title}</h3>
          <div style={{color:'#aaa',fontSize:12,display:'flex',gap:10}}><span>{sel.views} views</span><span>•</span><span>{new Date(sel.id).toLocaleDateString()}</span><span>•</span><span>#PlayVideo #Viral</span></div>
          <div style={{display:'flex',alignItems:'center',gap:10,marginTop:14}}>
            <div style={{width:40,height:40,background:'linear-gradient(45deg, red, orange)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'bold',fontSize:18}}>{sel.channel[0]}</div>
            <div style={{flex:1}}><div style={{fontWeight:'bold',fontSize:15,display:'flex',alignItems:'center',gap:4}}>{sel.channel} {sel.verified&&<span style={{background:'#3ea6ff',color:'black',borderRadius:'50%',width:16,height:16,display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:10}}>✓</span>}</div><div style={{fontSize:12,color:'#aaa'}}>{sel.subs||'15K'} subscribers</div></div>
            <button onClick={handleSubscribe} style={{background:isSub?'#272727':'white',color:isSub?'#aaa':'black',border:0,padding:'8px 16px',borderRadius:20,fontWeight:'bold',fontSize:13}}>{isSub?'Subscribed':'Subscribe'}</button>
            <button onClick={handleBell} style={{background:'#272727',border:0,padding:'8px 10px',borderRadius:20,fontSize:18}}>{isBell?'🔔':'🔕'}</button>
          </div>
          <div style={{display:'flex',gap:8,marginTop:16,overflowX:'auto',paddingBottom:4}}>
            <div style={{display:'flex',background:'#272727',borderRadius:20,overflow:'hidden',flexShrink:0}}>
              <button onClick={handleLike} style={{background:isLiked?'#3ea6ff':'transparent',color:isLiked?'black':'white',border:0,padding:'8px 16px',fontWeight:'bold',display:'flex',gap:6,alignItems:'center',borderRight:'1px solid #444'}}>{isLiked?'👍':'👍'} {sel.likes+ (isLiked?1:0)}</button>
              <button onClick={handleDislike} style={{background:isDisliked?'#3ea6ff':'transparent',color:isDisliked?'black':'white',border:0,padding:'8px 16px'}}>{isDisliked?'👎':'👎'}</button>
            </div>
            <button onClick={()=>{ navigator.clipboard.writeText(window.location.href); alert("🔗 Link Copied Boss!"); }} style={{background:'#272727',color:'white',border:0,padding:'8px 16px',borderRadius:20,fontWeight:'bold',flexShrink:0}}>↗️ Share</button>
            <button onClick={()=>{ const a=document.createElement('a'); a.href=sel.url; a.download=sel.title+'.mp4'; a.click(); }} style={{background:'#272727',color:'white',border:0,padding:'8px 16px',borderRadius:20,flexShrink:0}}>⬇️ Download</button>
            <button onClick={()=>alert("💾 Saved to Library!")} style={{background:'#272727',color:'white',border:0,padding:'8px 16px',borderRadius:20,flexShrink:0}}>💾 Save</button>
            <button onClick={()=>delVideo(sel.id)} style={{background:'#272727',color:'#ff6b6b',border:0,padding:'8px 16px',borderRadius:20,flexShrink:0}}>🗑️</button>
          </div>
          <div style={{background:'#212121',padding:12,borderRadius:12,marginTop:16}}>
            <div style={{fontSize:13,fontWeight:'bold'}}>Description • {sel.views} views • #{tab}</div>
            <div style={{fontSize:12,color:'#aaa',marginTop:6}}>This is {sel.title}. Like, Comment, Share korun Boss! 🔥<br/>#PlayVideo #Viral #Trending<br/><br/>💰 AD SPACE - Ekhane ad bosle income hobe!</div>
          </div>
          <div style={{marginTop:20}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><b>{sel.comments.length} Comments</b><span style={{fontSize:20}}>☰</span></div>
            <div style={{display:'flex',gap:10,marginTop:12,alignItems:'center'}}>
              <div style={{width:32,height:32,background:'#666',borderRadius:'50%'}}></div>
              <input value={cmt} onChange={e=>setCmt(e.target.value)} placeholder="Add a comment..." style={{flex:1,padding:'10px 14px',borderRadius:20,border:'1px solid #333',background:'#121212',color:'white',outline:'none'}}/>
              <button onClick={postComment} style={{background:'#3ea6ff',border:0,width:32,height:32,borderRadius:'50%',fontWeight:'bold'}}>➤</button>
            </div>
            <div style={{marginTop:16}}>
              {sel.comments.map(cm=>(
                <div key={cm.id} style={{display:'flex',gap:10,marginTop:14}}>
                  <div style={{width:32,height:32,background:'#444',borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12}}>😎</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13}}><b>@{cm.user||'user'}</b> <span style={{color:'#aaa',fontSize:11}}>• {cm.time||'2h ago'}</span></div>
                    <div style={{fontSize:14,marginTop:2}}>{cm.text}</div>
                    <div style={{display:'flex',gap:14,marginTop:6,fontSize:12,color:'#aaa'}}>
                      <span>👍 {cm.likes||0}</span><span>👎</span>
                      <span onClick={()=>setReplyTo(replyTo===cm.id?null:cm.id)} style={{cursor:'pointer',color:'#3ea6ff',fontWeight:'bold'}}>Reply</span>
                    </div>
                    {replyTo===cm.id && <div style={{display:'flex',gap:6,marginTop:8}}>
                      <input value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder={`Reply to ${cm.user}...`} style={{flex:1,padding:'6px 10px',borderRadius:20,border:'1px solid #333',background:'#121212',color:'white',fontSize:12}}/>
                      <button onClick={()=>postReply(cm.id)} style={{background:'#3ea6ff',border:0,padding:'6px 12px',borderRadius:20,fontSize:12,fontWeight:'bold'}}>Reply</button>
                    </div>}
                    {(sel.replies[cm.id]||[]).map(rp=><div key={rp.id} style={{marginTop:8,marginLeft:10,background:'#1a1a1a',padding:'6px 10px',borderRadius:8,fontSize:13}}><b>@{rp.user}</b> {rp.text}</div>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{padding:10}}>
          <b>Up next</b>
          {videos.filter(v=>v.id!==sel.id).slice(0,5).map(v=>(
            <div key={v.id} onClick={()=>openVideo(v)} style={{display:'flex',gap:8,marginTop:10,cursor:'pointer'}}>
              <video src={v.url} muted style={{width:160,aspectRatio:'16/9',background:'black',borderRadius:8,objectFit:'cover'}}/>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:'bold',lineHeight:1.2}}>{v.title.slice(0,50)}</div><div style={{fontSize:11,color:'#aaa',marginTop:4}}>{v.channel}<br/>{v.views} views</div></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{background:'#0f0f0f',color:'white',minHeight:'100vh',paddingBottom:80,fontFamily:'system-ui'}}>
      <header style={{display:'flex',alignItems:'center',gap:8,padding:'8px 10px',background:'#0f0f0f',position:'sticky',top:0,zIndex:20,borderBottom:'1px solid #222'}}>
        <span style={{fontSize:20}}>☰</span>
        <div style={{display:'flex',alignItems:'center',gap:4,fontWeight:900,fontSize:17}}><span style={{background:'red',color:'white',borderRadius:4,padding:'1px 5px',fontSize:12}}>▶</span> Play<span style={{color:'red'}}>Video</span></div>
        <div style={{flex:1,display:'flex',maxWidth:600,margin:'0 8px'}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search" style={{flex:1,padding:'8px 12px',borderRadius:'20px 0 0 20px',border:'1px solid #303030',background:'#121212',color:'white',outline:'none',fontSize:14}}/>
          <button style={{padding:'8px 14px',borderRadius:'0 20px 20px 0',border:'1px solid #303030',borderLeft:0,background:'#222',color:'white'}}>🔍</button>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <button onClick={()=>setShow(!show)} style={{background:'#272727',border:0,color:'white',width:32,height:32,borderRadius:'50%'}}>📹</button>
          <div style={{position:'relative'}}><span style={{fontSize:20}}>🔔</span>{Object.keys(bell).length>0&&<div style={{position:'absolute',top:-2,right:-2,background:'red',width:8,height:8,borderRadius:'50%'}}></div>}</div>
          <div style={{width:30,height:30,borderRadius:'50%',background:'linear-gradient(45deg,#f00,#fa0)'}}></div>
        </div>
      </header>

      <div style={{display:'flex',gap:6,padding:'8px 10px',overflowX:'auto',background:'#0f0f0f',borderBottom:'1px solid #222',scrollbarWidth:'none',position:'sticky',top:48,zIndex:10}}>
        {cats.map(c=><button key={c} onClick={()=>setTab(c)} style={{background:tab===c?'white':'#272727',color:tab===c?'black':'white',border:0,padding:'6px 12px',borderRadius:8,fontSize:13,whiteSpace:'nowrap',fontWeight:tab===c?'bold':'normal'}}>{c}</button>)}
      </div>

      {show && <div style={{margin:10,background:'#212121',padding:12,borderRadius:12,border:'1px solid #333'}}>
        <div style={{display:'flex',gap:8,marginBottom:8}}>
          <button style={{flex:1,padding:8,borderRadius:8,border:0,background:'white',color:'black',fontWeight:'bold',fontSize:12}}>Long Video</button>
          <button style={{flex:1,padding:8,borderRadius:8,border:0,background:'#333',color:'white',fontSize:12}}>Short {"(<20MB)"}</button>
        </div>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title - ex: Amer dokana | Funny video" style={{width:'100%',padding:10,borderRadius:8,border:'1px solid #333',background:'#111',color:'white',marginBottom:8,boxSizing:'border-box'}}/>
        <input type="file" accept="video/*" onChange={e=>setFile(e.target.files[0])} style={{width:'100%',marginBottom:10,color:'white'}}/>
        <button onClick={upload} style={{width:'100%',padding:12,background:'red',border:0,borderRadius:8,color:'white',fontWeight:'bold'}}>PUBLISH NOW 🚀</button>
      </div>}

      <div style={{padding:'0 0 10px'}}>
        {shorts.length>0 && <div style={{padding:'10px 0',borderBottom:'4px solid #222'}}>
          <div style={{display:'flex',justifyContent:'space-between',padding:'0 12px',alignItems:'center',marginBottom:8}}><div style={{fontWeight:'bold',display:'flex',gap:6,alignItems:'center'}}><span style={{background:'red',color:'white',padding:'2px 6px',borderRadius:4,fontSize:12}}>▶</span> Shorts</div><button onClick={()=>setShowShorts(true)} style={{background:'transparent',border:0,color:'#aaa',fontSize:20}}>›</button></div>
          <div style={{display:'flex',gap:8,overflowX:'auto',padding:'0 12px'}}>
            {shorts.map((v,i)=>(
              <div key={v.id} onClick={()=>{ setShortIndex(i); setShowShorts(true); }} style={{minWidth:140,cursor:'pointer',flexShrink:0}}>
                <div style={{position:'relative'}}><video src={v.url} muted style={{width:140,height:250,objectFit:'cover',borderRadius:12,background:'black'}}/><div style={{position:'absolute',bottom:6,left:6,right:6,fontSize:11,color:'white',textShadow:'0 1px 2px black'}}>{v.title.slice(0,20)}</div></div>
                <div style={{fontSize:12,marginTop:4}}>{v.views} views</div>
              </div>
            ))}
          </div>
        </div>}

        <div style={{padding:10}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}><b>📺 Long Videos • {longs.length}</b><span style={{fontSize:11,color:'#aaa'}}>{history.length} history • {likedVideos.length} liked</span></div>
          {longs.length===0 && shorts.length===0 && <div style={{textAlign:'center',marginTop:50,color:'#777'}}><div style={{fontSize:48}}>📹</div><div style={{marginTop:10}}>Upload korun Boss 👆</div><div style={{fontSize:11,marginTop:6,color:'#555'}}>Long + Short 2toi support kore • Like/Comment/Share/Bell/Reply/Download sob ache</div><button onClick={()=>setShow(true)} style={{marginTop:14,background:'red',border:0,color:'white',padding:'10px 20px',borderRadius:20,fontWeight:'bold'}}>+ Upload First Video</button></div>}
          {longs.map(v=>(
            <div key={v.id} onClick={()=>openVideo(v)} style={{marginBottom:18,cursor:'pointer'}}>
              <div style={{position:'relative',borderRadius:12,overflow:'hidden'}}>
                <video src={v.url} muted preload="metadata" style={{width:'100%',aspectRatio:'16/9',objectFit:'cover',background:'#111',display:'block'}} />
                <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',opacity:0.9}}><div style={{width:50,height:50,background:'rgba(0,0,0,0.7)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,border:'2px solid rgba(255,255,255,0.8)'}}>▶️</div></div>
                <div style={{position:'absolute',bottom:8,right:8,background:'rgba(0,0,0,0.85)',padding:'2px 6px',borderRadius:4,fontSize:11,fontWeight:'bold'}}>{v.dur}</div>
              </div>
              <div style={{display:'flex',gap:10,marginTop:10}}>
                <div style={{width:36,height:36,borderRadius:'50%',background:`hsl(${v.id%360},70%,50%)`,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'bold',fontSize:14}}>{v.channel[0]}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:'bold',fontSize:15,lineHeight:1.3}}>{v.title}</div>
                  <div style={{color:'#aaa',fontSize:13,marginTop:3,display:'flex',alignItems:'center',gap:4}}>{v.channel} {v.verified&&<span style={{color:'#3ea6ff'}}>✔️</span>} • {v.views} views • 2 hours ago</div>
                  <div style={{display:'flex',gap:10,marginTop:6,fontSize:11,color:'#777'}}><span>👍 {v.likes}</span><span>💬 {v.comments.length}</span><span>🔔 Subscribe</span><span>↗️ Share</span></div>
                </div>
                <div style={{color:'#aaa',fontSize:18}}>⋮</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{position:'fixed',bottom:0,left:0,right:0,background:'#0f0f0f',display:'flex',justifyContent:'space-around',padding:'8px 0 6px',borderTop:'1px solid #222',zIndex:20}}>
        <div style={{textAlign:'center',color:'white'}}><div style={{fontSize:20}}>🏠</div><div style={{fontSize:9,marginTop:2}}>Home</div></div>
        <div onClick={()=>setShowShorts(true)} style={{textAlign:'center',color:'#aaa'}}><div style={{fontSize:20}}>🎬</div><div style={{fontSize:9}}>Shorts</div></div>
        <div onClick={()=>setShow(!show)} style={{width:44,height:32,background:'white',color:'black',borderRadius:16,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,marginTop:2}}>+</div>
        <div style={{textAlign:'center',color:'#aaa'}}><div style={{fontSize:20}}>📺</div><div style={{fontSize:9}}>Subs</div></div>
        <div style={{textAlign:'center',color:'#aaa'}}><div style={{fontSize:20}}>👤</div><div style={{fontSize:9}}>You</div></div>
      </div>
    </div>
  )
}
