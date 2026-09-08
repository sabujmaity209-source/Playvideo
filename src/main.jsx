import { useState } from "react";
export default function App() {
  const [page, setPage] = useState("you");
  return (
    <div style={{display:'flex', justifyContent:'center', background:'#f4f4f5', minHeight:'100vh'}}>
      <style>{`button{cursor:pointer}`}</style>
      <div style={{width:'100%', maxWidth:'430px', background:'white', minHeight:'100vh', paddingBottom:'70px', color:'black', fontFamily:'sans-serif'}}>
        
        {page === "you" && (
          <div style={{padding:'16px'}}>
            <div style={{display:'flex', justifyContent:'space-between'}}><b style={{border:'1px solid #ccc', padding:'6px 16px', borderRadius:'20px', fontSize:'14px'}}>Accounts ▾</b><span>🔔 🔍 ⚙️</span></div>
            <div style={{display:'flex', gap:'12px', marginTop:'24px', alignItems:'center'}}><img src="https://i.pravatar.cc/100?img=11" style={{width:'64px', height:'64px', borderRadius:'50%'}}/><div><h2 style={{fontWeight:'bold', fontSize:'20px', margin:0}}>Yours Sabuj 01</h2><p style={{fontSize:'14px', color:'#71717a', margin:0}}>@Yourssabuj01 • 496 subs</p></div></div>
            <div style={{display:'flex', gap:'8px', marginTop:'20px'}}><button onClick={()=>setPage("channel")} style={{flex:1, background:'black', color:'white', padding:'12px', borderRadius:'20px', fontWeight:'bold', border:'none'}}>View channel</button><button style={{flex:1, border:'1px solid #ccc', padding:'12px', borderRadius:'20px', fontWeight:'bold', background:'white'}}>Get Premium</button></div>
            <h3 style={{fontWeight:'bold', marginTop:'24px'}}>History &gt;</h3>
            <div style={{display:'flex', gap:'8px', overflowX:'auto', marginTop:'8px'}}><div style={{minWidth:'130px', height:'80px', background:'#e4e4e7', borderRadius:'12px'}}></div><div style={{minWidth:'130px', height:'80px', background:'#e4e4e7', borderRadius:'12px'}}></div><div style={{minWidth:'130px', height:'80px', background:'#e4e4e7', borderRadius:'12px'}}></div></div>
          </div>
        )}

        {page === "channel" && (
          <div><div onClick={()=>setPage("you")} style={{padding:'12px', fontWeight:'bold', cursor:'pointer'}}>← Back</div><div style={{height:'128px', background:'black'}}></div><div style={{padding:'12px'}}><h2 style={{fontWeight:'bold'}}>Yours Sabuj 01</h2><p style={{fontSize:'12px'}}>@Yourssabuj01 • 496 subs</p><div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginTop:'16px'}}><div><div style={{height:'96px', background:'#e4e4e7', borderRadius:'12px'}}></div><p style={{fontSize:'12px', fontWeight:'bold'}}>Unboxing! 🎁</p></div><div><div style={{height:'96px', background:'#e4e4e7', borderRadius:'12px'}}></div><p style={{fontSize:'12px', fontWeight:'bold'}}>Amar Vlog</p></div></div></div></div>
        )}

        {page === "shorts" && (
          <div style={{padding:'8px'}}><div onClick={()=>setPage("you")} style={{padding:'8px', fontWeight:'bold'}}>← Back</div><div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px'}}><div style={{height:'300px', background:'#ccc', borderRadius:'12px', display:'flex', alignItems:'end', padding:'8px', color:'white', fontWeight:'bold', fontSize:'12px'}}>🌺 Joy Ma Mansa 🌺</div><div style={{height:'300px', background:'#ccc', borderRadius:'12px', display:'flex', alignItems:'end', padding:'8px', color:'white', fontWeight:'bold', fontSize:'12px'}}>Bicycle Trick</div><div style={{height:'300px', background:'#ccc', borderRadius:'12px', display:'flex', alignItems:'end', padding:'8px', color:'white', fontWeight:'bold', fontSize:'12px'}}>Dahi Handi!</div><div style={{height:'300px', background:'#ccc', borderRadius:'12px', display:'flex', alignItems:'end', padding:'8px', color:'white', fontWeight:'bold', fontSize:'12px'}}>New iPhone!</div></div></div>
        )}

        <div style={{position:'fixed', bottom:0, width:'100%', maxWidth:'430px', background:'white', borderTop:'1px solid #eee', display:'flex', justifyContent:'space-around', padding:'12px 0', fontWeight:'bold', fontSize:'14px'}}>
          <span onClick={()=>setPage("you")} style={{cursor:'pointer'}}>You</span>
          <span onClick={()=>setPage("shorts")} style={{cursor:'pointer'}}>Shorts</span>
          <span onClick={()=>setPage("channel")} style={{cursor:'pointer'}}>Channel</span>
        </div>
      </div>
    </div>
  );
}
