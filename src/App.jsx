import { useState } from "react";

export default function App() {
  const [page, setPage] = useState("you");
  const videos = [
    {id:1, title:"New Play Video Design 🔥", views:"1.2M", time:"2 days"},
    {id:2, title:"Vercel Deploy Fixed!", views:"500K", time:"5 hours"},
    {id:3, title:"React Tutorial Bangla", views:"2M", time:"1 week"},
    {id:4, title:"Ganga Sagar Vlog 2026", views:"800K", time:"3 days"},
  ];

  return (
    <div style={{display:'flex', justifyContent:'center', background:'#0f0f0f', minHeight:'100vh', color:'white'}}>
      <style>{`button{cursor:pointer} *{font-family:sans-serif}`}</style>
      <div style={{width:'100%', maxWidth:'430px', background:'#0f0f0f'}}>

        {page === "you" && (
          <div style={{padding:'16px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h2 style={{fontWeight:'bold'}}>PlayVideo</h2>
              <div>🔍 ⋮</div>
            </div>
            <div style={{display:'flex', gap:'12px', marginTop:'16px', alignItems:'center'}}>
              <div style={{width:'60px', height:'60px', background:'#ff0000', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'30px'}}>▶️</div>
              <div><h3>Sabuj Maity</h3><p style={{fontSize:'12px', color:'gray'}}>@sabujmaity209 • No videos</p></div>
            </div>
            <div style={{display:'flex', gap:'8px', marginTop:'16px'}}>
              <button onClick={()=>setPage("channel")} style={{padding:'8px 16px', borderRadius:'20px', background:'white', color:'black', border:'none'}}>Switch account</button>
              <button style={{padding:'8px 16px', borderRadius:'20px', background:'#272727', color:'white', border:'none'}}>Google Account</button>
            </div>
            <h3 style={{fontWeight:'bold', marginTop:'24px'}}>History</h3>
            <div style={{display:'flex', gap:'8px', overflowX:'auto', marginTop:'10px'}}>
              {videos.map(v=>(
                <div key={v.id} style={{minWidth:'150px'}}>
                  <div style={{width:'150px', height:'80px', background:'#272727', borderRadius:'10px'}}></div>
                  <p style={{fontSize:'12px', marginTop:'5px'}}>{v.title}</p>
                </div>
              ))}
            </div>
            <h3 style={{marginTop:'20px'}}>Playlists</h3>
            <p style={{color:'gray', fontSize:'14px'}}>No playlists found</p>
          </div>
        )}

        {page === "channel" && (
          <div><div onClick={()=>setPage("you")} style={{padding:'16px'}}>⬅️ Back to You</div>
          <div style={{padding:'20px', textAlign:'center'}}><h1>📺</h1><h2>Your Channel</h2><p>Create videos and upload</p></div></div>
        )}

        {page === "shorts" && (
          <div style={{padding:'8px'}}><div onClick={()=>setPage("you")} style={{padding:'8px'}}>⬅️ Back</div>
          <div style={{background:'#222', height:'600px', borderRadius:'15px', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}><h2>Shorts 🔥</h2><p>Swipe up for next</p></div></div>
        )}

        <div style={{position:'fixed', bottom:0, width:'100%', maxWidth:'430px', background:'#0f0f0f', display:'flex', justifyContent:'space-around', padding:'10px 0', borderTop:'1px solid #272727'}}>
          <span onClick={()=>setPage("you")} style={{cursor:'pointer', color:page==='you'?'white':'gray'}}>🏠 You</span>
          <span onClick={()=>setPage("shorts")} style={{cursor:'pointer', color:page==='shorts'?'white':'gray'}}>🎬 Shorts</span>
          <span onClick={()=>setPage("channel")} style={{cursor:'pointer', color:page==='channel'?'white':'gray'}}>👤 Channel</span>
        </div>
      </div>
    </div>
  );
}
