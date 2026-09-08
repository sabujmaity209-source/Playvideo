import { useState } from "react";

export default function App() {
  const [page, setPage] = useState("you");
  const [showGoogle, setShowGoogle] = useState(false);
  const [myVideos, setMyVideos] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMyVideos([{ id: Date.now(), title: file.name, url: url },...myVideos]);
      setShowUpload(false);
      alert("Uploaded Boss! 🔥");
    }
  };

  return (
    <div style={{display:'flex', justifyContent:'center', background:'#0f0f0f', minHeight:'100vh', color:'white'}}>
      <style>{`button{cursor:pointer} *{font-family:sans-serif}`}</style>
      <div style={{width:'100%', maxWidth:'430px', background:'#0f0f0f', position:'relative', paddingBottom:'70px'}}>

        {showMenu && (
          <div onClick={()=>setShowMenu(false)} style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:999}}>
            <div style={{position:'absolute', top:'60px', right:'15px', background:'#212121', borderRadius:'12px', width:'200px'}}>
              <div onClick={()=>{setShowMenu(false); alert("Settings coming soon!")}} style={{padding:'14px', borderBottom:'1px solid #333'}}>⚙️ Settings</div>
              <div onClick={()=>{setShowMenu(false); alert("History cleared!")}} style={{padding:'14px', borderBottom:'1px solid #333'}}>🕒 Clear History</div>
              <div onClick={()=>{setShowMenu(false); setShowGoogle(true)}} style={{padding:'14px', borderBottom:'1px solid #333'}}>👤 Google Account</div>
              <div onClick={()=>{setShowMenu(false); alert("PlayVideo v1.0 by Sabuj Boss 🔥")}} style={{padding:'14px'}}>ℹ️ About</div>
            </div>
          </div>
        )}

        {showGoogle && (
          <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999}}>
            <div style={{background:'#212121', padding:'20px', borderRadius:'15px', width:'85%'}}>
              <h3>Google Account</h3><p style={{marginTop:'8px'}}>👤 Sabuj Maity</p><p style={{color:'gray', fontSize:'13px'}}>sabujmaity209-source</p>
              <button onClick={()=>setShowGoogle(false)} style={{marginTop:'15px', width:'100%', padding:'10px', borderRadius:'20px', border:'none', background:'white', color:'black', fontWeight:'bold'}}>Close</button>
            </div>
          </div>
        )}

        {showUpload && (
          <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999}}>
            <div style={{background:'#212121', padding:'20px', borderRadius:'15px', width:'85%', textAlign:'center'}}>
              <h3>📤 Post Video</h3><p style={{color:'gray', fontSize:'13px', marginTop:'5px'}}>Select from phone</p>
              <input type="file" accept="video/*" onChange={handleUpload} style={{marginTop:'15px'}} />
              <button onClick={()=>setShowUpload(false)} style={{marginTop:'15px', width:'100%', padding:'10px', borderRadius:'20px', border:'none', background:'#333', color:'white'}}>Cancel</button>
            </div>
          </div>
        )}

        <div style={{padding:'16px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h2 style={{fontWeight:'bold'}}>PlayVideo</h2>
          <div style={{display:'flex', gap:'12px', alignItems:'center'}}>
            <span onClick={()=>alert("Search coming soon Boss! 🔍")}>🔍</span>
            <span onClick={()=>setShowMenu(true)} style={{fontSize:'22px', background:'#272727', width:'32px', height:'32px', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'50%'}}>⋮</span>
          </div>
        </div>

        {page === "you" && (
          <div style={{padding:'0 16px'}}>
            <div style={{display:'flex', gap:'12px', marginTop:'10px', alignItems:'center'}}>
              <div style={{width:'60px', height:'60px', background:'#f00', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px'}}>▶️</div>
              <div><h3 style={{margin:0}}>Sabuj Maity</h3><p style={{fontSize:'12px', color:'gray', margin:0}}>@sabujmaity209 • {myVideos.length} videos</p></div>
            </div>
            <div style={{display:'flex', gap:'8px', marginTop:'16px'}}>
              <button onClick={()=>setPage("channel")} style={{padding:'8px 14px', borderRadius:'20px', background:'white', color:'black', border:'none', fontWeight:'bold', fontSize:'13px'}}>Switch account</button>
              <button onClick={()=>setShowGoogle(true)} style={{padding:'8px 14px', borderRadius:'20px', background:'#272727', color:'white', border:'none', fontSize:'13px'}}>Google Account</button>
            </div>
            <button onClick={()=>setShowUpload(true)} style={{width:'100%', marginTop:'16px', padding:'12px', borderRadius:'25px', background:'white', color:'black', border:'none', fontWeight:'bold'}}>📤 Post New Video</button>
            <h3 style={{marginTop:'20px'}}>My Videos</h3>
            {myVideos.length===0? <p style={{color:'gray', fontSize:'13px'}}>No videos yet. Post koro Boss!</p> : myVideos.map(v=>(
              <div key={v.id} style={{marginTop:'12px'}}><video src={v.url} controls style={{width:'100%', borderRadius:'10px'}} /><p style={{fontSize:'13px', marginTop:'4px'}}>{v.title}</p></div>
            ))}
          </div>
        )}

        {page!== "you" && (
          <div style={{padding:'16px'}}><span onClick={()=>setPage("you")}>⬅️ Back to You</span><div style={{textAlign:'center', marginTop:'40px'}}><h2>{page==="channel"?"Your Channel 📺":"Shorts 🎬"}</h2><button onClick={()=>setShowUpload(true)} style={{marginTop:'12px', padding:'10px 18px', borderRadius:'20px', border:'none', background:'white', color:'black', fontWeight:'bold'}}>+ Upload</button></div></div>
        )}

        <div style={{position:'fixed', bottom:0, width:'100%', maxWidth:'430px', background:'#0f0f0f', display:'flex', justifyContent:'space-around', padding:'12px 0', borderTop:'1px solid #222'}}>
          <span onClick={()=>setPage("you")} style={{color:page==='you'?'white':'gray'}}>🏠 You</span>
          <span onClick={()=>setPage("shorts")} style={{color:page==='shorts'?'white':'gray'}}>🎬 Shorts</span>
          <span onClick={()=>setPage("channel")} style={{color:page==='channel'?'white':'gray'}}>👤 Channel</span>
        </div>
      </div>
    </div>
  );
}
