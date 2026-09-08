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
      setMyVideos([{ id: Date.now(), title: file.name, url: url, views: "0" },...myVideos]);
      setShowUpload(false);
      alert("Video Uploaded Boss! 🔥");
    }
  };

  return (
    <div style={{display:'flex', justifyContent:'center', background:'#0f0f0f', minHeight:'100vh', color:'white'}}>
      <style>{`button{cursor:pointer} *{font-family:sans-serif}`}</style>
      <div style={{width:'100%', maxWidth:'430px', background:'#0f0f0f', position:'relative', paddingBottom:'70px'}}>

        {showMenu && (
          <div onClick={()=>setShowMenu(false)} style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.5)', zIndex:998}}>
            <div style={{position:'absolute', top:'50px', right:'20px', background:'#212121', borderRadius:'12px', padding:'10px', width:'180px'}}>
              <div onClick={()=>{setShowMenu(false); alert("Settings Coming Soon Boss!")}} style={{padding:'12px', borderBottom:'1px solid #333'}}>⚙️ Settings</div>
              <div onClick={()=>{setShowMenu(false); alert("History Cleared!")}} style={{padding:'12px', borderBottom:'1px solid #333'}}>🕒 Clear History</div>
              <div onClick={()=>{setShowMenu(false); setShowGoogle(true)}} style={{padding:'12px', borderBottom:'1px solid #333'}}>👤 Google Account</div>
              <div onClick={()=>{setShowMenu(false); alert("PlayVideo v1.0 by Sabuj Boss 🔥")}} style={{padding:'12px'}}>ℹ️ About</div>
            </div>
          </div>
        )}

        {showGoogle && (
          <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999}}>
            <div style={{background:'#212121', padding:'20px', borderRadius:'15px', width:'85%'}}>
              <h3>Google Account</h3><p>👤 Sabuj Maity</p><p style={{color:'gray'}}>@sabujmaity209@gmail.com</p>
              <button onClick={()=>setShowGoogle(false)} style={{marginTop:'15px', width:'100%', padding:'10px', borderRadius:'20px', border:'none', background:'white', color:'black', fontWeight:'bold'}}>Close</button>
            </div>
          </div>
        )}

        {showUpload && (
          <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999}}>
            <div style={{background:'#212121', padding:'20px', borderRadius:'15px', width:'85%', textAlign:'center'}}>
              <h3>Upload Video 📤</h3>
              <input type="file" accept="video/*" onChange={handleUpload} style={{marginTop:'15px', color:'white'}} />
              <button onClick={()=>setShowUpload(false)} style={{marginTop:'15px', width:'100%', padding:'10px', borderRadius:'20px', border:'none', background:'#333', color:'white'}}>Cancel</button>
            </div>
          </div>
        )}

        {page === "you" && (
          <div style={{padding:'16px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h2 style={{fontWeight:'bold'}}>PlayVideo</h2>
              <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
                <span onClick={()=>alert("Search Coming Soon! 🔍")}>🔍</span>
                <span onClick={()=>setShowMenu(true)} style={{fontSize:'20px', padding:'5px 10px', background:'#272727', borderRadius:'50%'}}>⋮</span>
              </div>
            </div>

            <div style={{display:'flex', gap:'12px', marginTop:'16px', alignItems:'center'}}>
              <div style={{width:'60px', height:'60px', background:'#ff0000', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'30px'}}>▶️</div>
              <div><h3>Sabuj Maity</h3><p style={{fontSize:'12px', color:'gray'}}>{myVideos.length} videos</p></div>
            </div>

            <div style={{display:'flex', gap:'8px', marginTop:'16px'}}>
              <button onClick={()=>setPage("channel")} style={{padding:'8px 16px', borderRadius:'20px', background:'white', color:'black', border:'none', fontWeight:'bold'}}>Switch account</button>
              <button onClick={()=>setShowGoogle(true)} style={{padding:'8px 16px', borderRadius:'20px', background:'#272727', color:'white', border:'none'}}>Google Account</button>
            </div>

            <div style={{marginTop:'16px', display:'flex', gap:'8px'}}>
              <button onClick={()=>setShowUpload(true)} style={{flex:1, padding:'12px', borderRadius:'25px', background:'white', color:'black', border:'none', fontWeight:'bold'}}>📤 Post Video</button>
            </div>

            <h3 style={{fontWeight:'bold', marginTop:'24px'}}>My Uploads ({myVideos.length})</h3>
            <div style={{marginTop:'10px'}}>
              {myVideos.length===0? <p style={{color:'gray'}}>No videos yet. Upload koro Boss!</p> : myVideos.map(v=>(
                <div key={v.id} style={{marginBottom:'15px'}}>
                  <video src={v.url} controls style={{width:'100%', borderRadius:'10px'}} />
                  <p style={{fontSize:'14px', marginTop:'5px', fontWeight:'bold'}}>{v.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {page === "channel" && (
          <div>
            <div style={{padding:'16px', display:'flex', justifyContent:'space-between'}}>
              <span onClick={()=>setPage("you")}>⬅️ Back</span>
              <span onClick={()=>setShowMenu(true)} style={{fontSize:'20px'}}>⋮</span>
            </div>
            <div style={{padding:'20px', textAlign:'center'}}><h1>📺</h1><h2>Your Channel</h2><button onClick={()=>setShowUpload(true)} style={{marginTop:'10px', padding:'10px 20px', borderRadius:'20px', border:'none', background:'white', color:'black', fontWeight:'bold'}}>+ Post Video</button></div>
          </div>
        )}

        {page === "shorts" && (
          <div style={{padding:'8px'}}><div style={{display:'flex', justifyContent:'space-between', padding:'8px'}}><span onClick={()=>setPage("you")}>⬅️ Back</span><span onClick={()=>setShowMenu(true)}>⋮</span></div>
          <div style={{background:'#222', height:'600px', borderRadius:'15px', display:'flex', alignItems:'center', justifyContent:'center'}}><h2>Shorts 🔥</h2></div></div>
        )}

        <div style={{position:'fixed', bottom:0, width:'100%', maxWidth:'430px', background:'#0f0f0f', display:'flex', justifyContent:'space-around', padding:'12px 0', borderTop:'1px solid #272727'}}>
          <span onClick={()=>setPage("you")} style={{cursor:'pointer', color:page==='you'?'white':'gray'}}>🏠 You</span>
          <span onClick={()=>setPage("shorts")} style={{cursor:'pointer', color:page==='shorts'?'white':'gray'}}>🎬 Shorts</span>
          <span onClick={()=>setPage("channel")} style={{cursor:'pointer', color:page==='channel'?'white':'gray'}}>👤 Channel</span>
        </div>
      </div>
    </div>
  );
}
