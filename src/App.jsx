import React, { useEffect, useMemo, useState } from "react";

const CATS = ["All","Music","Gaming","Tech","Comedy","Live","AI","News","Cricket","Bangla","Cooking","Vlog","Education","Meme"];

const seedVideos = [
  {id:"v1",title:"Welcome to PlayVideo 2026",channel:"PlayVideo",category:"Tech",type:"long",views:1240,likes:128,dislikes:7,src:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",comments:[]},
  {id:"v2",title:"Amazing Short Video",channel:"PlayVideo",category:"Comedy",type:"short",views:860,likes:92,dislikes:3,src:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",comments:[]},
];

const KEY="playvideo_v1";

function load(){
  try{
    const x=JSON.parse(localStorage.getItem(KEY)||"{}");
    return {
      videos:x.videos?.length?x.videos:seedVideos,
      liked:x.liked||{}, disliked:x.disliked||{}, saved:x.saved||{},
      history:x.history||[], subscribed:x.subscribed||{},
      bell:x.bell||{}, comments:x.comments||{}, chats:x.chats||[],
      profile:x.profile||{name:"You",handle:"@you",bio:"Welcome to my PlayVideo channel"},
      notifications:x.notifications||[],
      earnings:x.earnings??0
    };
  }catch{return {videos:seedVideos,liked:{},disliked:{},saved:{},history:[],subscribed:{},bell:{},comments:{},chats:[],profile:{name:"You",handle:"@you",bio:"Welcome"},notifications:[],earnings:0}}
}
function save(s){localStorage.setItem(KEY,JSON.stringify(s));}

const css=`
*{box-sizing:border-box}body{margin:0;background:#0f0f0f;color:#fff;font-family:Arial,system-ui,sans-serif}
button{border:0;cursor:pointer;color:#fff;background:#272727;border-radius:20px;padding:9px 14px}
button:hover{background:#383838}.app{min-height:100vh}.top{position:sticky;top:0;z-index:30;background:#111;border-bottom:1px solid #292929;padding:10px 14px;display:flex;gap:10px;align-items:center}
.logo{font-size:20px;font-weight:800;white-space:nowrap}.red{color:#ff2b2b}.search{flex:1;max-width:650px;margin:auto;display:flex}.search input{width:100%;background:#181818;border:1px solid #333;color:#fff;padding:10px 14px;border-radius:22px 0 0 22px;outline:0}.search button{border-radius:0 22px 22px 0}
.layout{display:flex}.side{width:220px;padding:14px;position:sticky;top:61px;height:calc(100vh - 61px);border-right:1px solid #222}.side button{width:100%;text-align:left;margin:3px 0}.main{flex:1;padding:16px;max-width:1400px;margin:auto}.chips{display:flex;gap:8px;overflow:auto;padding-bottom:14px}.chip{white-space:nowrap}.active{background:#fff;color:#111}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:18px}.card{background:#161616;border-radius:12px;overflow:hidden;border:1px solid #242424}.thumb{width:100%;aspect-ratio:16/9;background:#000;object-fit:cover;display:block}.cardbody{padding:10px}.muted{color:#aaa;font-size:13px}.row{display:flex;gap:8px;align-items:center}.grow{flex:1}.pageTitle{margin:5px 0 16px}.watch{max-width:1000px;margin:auto}.player{width:100%;max-height:62vh;background:#000;border-radius:10px}.actions{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}.panel{background:#171717;border:1px solid #292929;border-radius:12px;padding:14px;margin-top:14px}.comment{padding:12px 0;border-bottom:1px solid #292929}.input{background:#111;border:1px solid #333;color:#fff;border-radius:8px;padding:10px;width:100%;outline:0}.bottom{display:none}.modalbg{position:fixed;inset:0;background:#000b;z-index:100;display:flex;align-items:center;justify-content:center;padding:16px}.modal{background:#171717;border:1px solid #333;border-radius:16px;width:min(620px,100%);max-height:90vh;overflow:auto;padding:18px}.file{border:1px dashed #555;padding:20px;border-radius:10px}.statgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.stat{background:#202020;border-radius:12px;padding:18px}.chatlist button{display:block;width:100%;text-align:left;margin:7px 0}.bubble{max-width:75%;padding:10px 12px;border-radius:14px;margin:7px 0;background:#272727}.mine{margin-left:auto;background:#075e54}.messages{height:55vh;overflow:auto;padding:10px;background:#101010;border-radius:10px}.danger{background:#9b2020}.success{background:#16834d}
@media(max-width:800px){.side{display:none}.main{padding:10px 10px 75px}.grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.cardbody{padding:8px}.bottom{display:flex;position:fixed;bottom:0;left:0;right:0;background:#111;border-top:1px solid #292929;z-index:50;justify-content:space-around;padding:7px}.bottom button{background:transparent;padding:7px 9px;font-size:11px}.top .search{max-width:none}.top{gap:6px}.statgrid{grid-template-columns:1fr 1fr}}
`;

export default function App(){
  const [s,setS]=useState(load);
  const [page,setPage]=useState("home");
  const [cat,setCat]=useState("All");
  const [query,setQuery]=useState("");
  const [selected,setSelected]=useState(null);
  const [showUpload,setShowUpload]=useState(false);
  const [showAuth,setShowAuth]=useState(false);
  const [showChat,setShowChat]=useState(false);
  const [uploadFile,setUploadFile]=useState(null);
  const [uploadTitle,setUploadTitle]=useState("");
  const [uploadCat,setUploadCat]=useState("Tech");
  const [uploadType,setUploadType]=useState("long");
  const [comment,setComment]=useState("");
  const [replyTo,setReplyTo]=useState(null);
  const [reply,setReply]=useState("");
  const [chatUser,setChatUser]=useState("PlayVideo Creator");
  const [chatText,setChatText]=useState("");
  const [profileName,setProfileName]=useState(s.profile.name);

  useEffect(()=>save(s),[s]);

  const shorts=useMemo(()=>s.videos.filter(v=>v.type==="short"),[s.videos]);
  const filtered=useMemo(()=>{
    let a=s.videos;
    if(cat!=="All") a=a.filter(v=>v.category===cat);
    const q=query.trim().toLowerCase();
    if(q)a=a.filter(v=>(v.title+" "+v.channel+" "+v.category).toLowerCase().includes(q));
    if(page==="shorts")a=a.filter(v=>v.type==="short");
    if(page==="saved")a=a.filter(v=>s.saved[v.id]);
    if(page==="history")a=a.filter(v=>s.history.includes(v.id));
    return a;
  },[s.videos,cat,query,page,s.saved,s.history]);

  function openVideo(v){
    setSelected(v);
    setPage("watch");
    setS(x=>({...x,history:[v.id,...x.history.filter(id=>id!==v.id)].slice(0,100)}));
  }
  function react(id,type){
    setS(x=>{
      const v=x.videos.find(z=>z.id===id); if(!v)return x;
      const liked=!!x.liked[id], disliked=!!x.disliked[id];
      let nl={...x.liked}, nd={...x.disliked}, likes=v.likes||0, dislikes=v.dislikes||0;
      if(type==="like"){
        if(liked){delete nl[id];likes=Math.max(0,likes-1)}
        else {nl[id]=1;likes++;if(disliked){delete nd[id];dislikes=Math.max(0,dislikes-1)}}
      }else{
        if(disliked){delete nd[id];dislikes=Math.max(0,dislikes-1)}
        else {nd[id]=1;dislikes++;if(liked){delete nl[id];likes=Math.max(0,likes-1)}}
      }
      const videos=x.videos.map(z=>z.id===id?{...z,likes,dislikes}:z);
      return {...x,videos,liked:nl,disliked:nd};
    });
  }
  function subscribe(v){
    setS(x=>({...x,subscribed:{...x.subscribed,[v.channel]:!x.subscribed[v.channel]},bell:{...x.bell,[v.channel]:x.bell[v.channel]||false}}));
  }
  function addComment(){
    if(!selected||!comment.trim())return;
    const c={id:crypto.randomUUID?.()||String(Date.now()),user:s.profile.name,text:comment.trim(),time:"Just now",likes:0,replies:[]};
    setS(x=>({...x,comments:{...x.comments,[selected.id]:[...(x.comments[selected.id]||[]),c]},notifications:[{id:Date.now(),text:`${x.profile.name} commented on ${selected.title}`,time:"now"},...x.notifications]}));
    setComment("");
  }
  function addReply(cid){
    if(!selected||!reply.trim())return;
    const arr=(s.comments[selected.id]||[]).map(c=>c.id===cid?{...c,replies:[...(c.replies||[]),{id:Date.now(),user:s.profile.name,text:reply.trim()}]}:c);
    setS(x=>({...x,comments:{...x.comments,[selected.id]:arr}}));setReply("");setReplyTo(null);
  }
  function share(v){
    const url=location.href.split("#")[0]+"#video="+v.id;
    if(navigator.share)navigator.share({title:v.title,text:"Watch on PlayVideo",url}).catch(()=>{});
    else navigator.clipboard?.writeText(url).then(()=>alert("Link copied"));
  }
  function download(v){
    const a=document.createElement("a");a.href=v.src;a.download=(v.title||"PlayVideo")+".mp4";a.click();
  }
  function upload(){
    if(!uploadTitle.trim())return alert("Title 唳︵唳�");
    const src=uploadFile?URL.createObjectURL(uploadFile):seedVideos[0].src;
    const v={id:"u"+Date.now(),title:uploadTitle.trim(),channel:s.profile.name,category:uploadCat,type:uploadType,views:0,likes:0,dislikes:0,src,comments:[]};
    setS(x=>({...x,videos:[v,...x.videos]}));setShowUpload(false);setUploadTitle("");setUploadFile(null);setPage("home");
  }
  function saveVideo(v){
    setS(x=>({...x,saved:{...x.saved,[v.id]:!x.saved[v.id]}}));
  }
  function sendChat(){
    if(!chatText.trim())return;
    setS(x=>({...x,chats:[...x.chats,{id:Date.now(),user:chatUser,text:chatText.trim(),mine:true,time:new Date().toLocaleTimeString()}]}));
    setChatText("");
  }
  function updateProfile(){
    setS(x=>({...x,profile:{...x.profile,name:profileName,handle:"@"+profileName.toLowerCase().replace(/\s+/g,""),bio:x.profile.bio}}));
    alert("Profile saved");setPage("profile");
  }

  const Sidebar=()=> <aside className="side">
    {["home","shorts","subscriptions","saved","history","profile","creator","chat","notifications"].map(p=>
      <button key={p} onClick={()=>setPage(p)}>
        {({home:"馃彔 Home",shorts:"馃幀 Shorts",subscriptions:"馃摵 Subscriptions",saved:"馃捑 Saved",history:"馃晿 History",profile:"馃懁 Profile",creator:"馃挵 Creator Studio",chat:"馃挰 Chat",notifications:"馃敂 Notifications"})[p]}
      </button>)}
    <button onClick={()=>setShowUpload(true)}>猬嗭笍 Upload</button>
  </aside>;

  const Header=()=> <header className="top">
    <div className="logo" onClick={()=>setPage("home")}>鈻� Play<span className="red">Video</span></div>
    <div className="search"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search videos..."/><button onClick={()=>setPage("home")}>馃攳</button></div>
    <button onClick={()=>setShowChat(true)}>馃挰</button><button onClick={()=>setShowAuth(true)}>馃懁</button>
  </header>;

  const Card=({v})=><div className="card">
    <video className="thumb" src={v.src} muted preload="metadata" onClick={()=>openVideo(v)} />
    <div className="cardbody">
      <b onClick={()=>openVideo(v)} style={{cursor:"pointer"}}>{v.title}</b>
      <div className="muted">@{v.channel} 鈥� {v.views} views</div>
      <div className="row" style={{marginTop:8}}><span className="muted">#{v.category}</span><span className="grow"/><button onClick={()=>saveVideo(v)}>馃捑</button></div>
    </div>
  </div>;

  function Watch(){
    if(!selected)return null;
    const comments=s.comments[selected.id]||[];
    return <div className="watch">
      <button onClick={()=>{setSelected(null);setPage("home")}}>鈫� Back</button>
      <video className="player" src={selected.src} controls autoPlay playsInline />
      <h2>{selected.title}</h2>
      <div className="muted">@{selected.channel} 鈥� {selected.views} views 鈥� #{selected.category}</div>
      <div className="actions">
        <button onClick={()=>react(selected.id,"like")}>{s.liked[selected.id]?"鉂わ笍":"馃"} {selected.likes}</button>
        <button onClick={()=>react(selected.id,"dislike")}>{s.disliked[selected.id]?"馃憥":"馃枑锔�"} {selected.dislikes}</button>
        <button onClick={()=>subscribe(selected)}>馃摵 {s.subscribed[selected.channel]?"Subscribed":"Subscribe"}</button>
        <button onClick={()=>share(selected)}>鈫楋笍 Share</button><button onClick={()=>download(selected)}>猬囷笍 Download</button>
        <button onClick={()=>saveVideo(selected)}>馃捑 {s.saved[selected.id]?"Saved":"Save"}</button>
        <button onClick={()=>setShowChat(true)}>馃挰 Chat</button>
      </div>
      <div className="panel"><b>Comments ({comments.length})</b>
        <div className="row" style={{marginTop:10}}><input className="input" value={comment} onChange={e=>setComment(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addComment()} placeholder="Write a comment..."/><button className="success" onClick={addComment}>Post</button></div>
        {comments.map(c=><div className="comment" key={c.id}><b>@{c.user}</b><div>{c.text}</div>
          <div className="actions"><button>馃憤 {c.likes||0}</button><button onClick={()=>setReplyTo(replyTo===c.id?null:c.id)}>Reply</button></div>
          {replyTo===c.id&&<div className="row"><input className="input" value={reply} onChange={e=>setReply(e.target.value)} placeholder="Write reply..."/><button onClick={()=>addReply(c.id)}>Reply</button></div>}
          {(c.replies||[]).map(r=><div className="panel" style={{marginLeft:25}} key={r.id}><b>@{r.user}</b> {r.text}</div>)}
        </div>)}
      </div>
    </div>
  }

  return <><style>{css}</style><div className="app"><Header/><div className="layout"><Sidebar/><main className="main">
    {page==="watch"?<Watch/>:
    page==="creator"?<Creator s={s} setPage={setPage}/>:
    page==="profile"?<Profile s={s} profileName={profileName} setProfileName={setProfileName} updateProfile={updateProfile}/>:
    page==="chat"?<Chat s={s} chatUser={chatUser} setChatUser={setChatUser} chatText={chatText} setChatText={setChatText} sendChat={sendChat}/>:
    page==="notifications"?<Notifications s={s}/>:
    <><h2 className="pageTitle">{page==="shorts"?"馃幀 Shorts":page==="saved"?"馃捑 Saved":page==="history"?"馃晿 Watch History":page==="subscriptions"?"馃摵 Subscriptions":"馃彔 Home"}</h2>
      {page==="home"&&<div className="chips">{CATS.map(c=><button className={"chip "+(cat===c?"active":"")} onClick={()=>setCat(c)} key={c}>{c}</button>)}</div>}
      <div className="grid">{filtered.map(v=><Card v={v} key={v.id}/>)}</div>
      {!filtered.length&&<div className="panel">唳曕唳ㄠ 唳唳∴唳� 唳唳撪Ο唳监 唳唳唳ㄠ啷�</div>}
    </>}
  </main></div>
  <nav className="bottom"><button onClick={()=>setPage("home")}>馃彔<br/>Home</button><button onClick={()=>setPage("shorts")}>馃幀<br/>Shorts</button><button onClick={()=>setShowUpload(true)}>鉃�<br/>Upload</button><button onClick={()=>setPage("chat")}>馃挰<br/>Chat</button><button onClick={()=>setPage("profile")}>馃懁<br/>Profile</button></nav>
  {showUpload&&<ModalUpload close={()=>setShowUpload(false)} {...{uploadTitle,setUploadTitle,uploadCat,setUploadCat,uploadType,setUploadType,uploadFile,setUploadFile,upload}}/>}
  {showAuth&&<div className="modalbg" onClick={()=>setShowAuth(false)}><div className="modal" onClick={e=>e.stopPropagation()}><h2>馃攼 Login / Signup</h2><p className="muted">唳忇 demo-唳む account local唳唳 唳班唳栢 唳灌唰嵿唰囙イ Real multi-user login-唳忇Π 唳溹Θ唰嵿Ο Supabase Auth connect 唳曕Π唳む 唳灌Μ唰�.</p><input className="input" placeholder="Email"/><br/><br/><input className="input" placeholder="Password" type="password"/><br/><br/><button className="success" onClick={()=>{setShowAuth(false);alert("Demo login successful")}}>Continue</button></div></div>}
  {showChat&&<div className="modalbg" onClick={()=>setShowChat(false)}><div className="modal" onClick={e=>e.stopPropagation()}><Chat s={s} chatUser={chatUser} setChatUser={setChatUser} chatText={chatText} setChatText={setChatText} sendChat={sendChat}/></div></div>}
  </div></>;
}

function ModalUpload(p){
 return <div className="modalbg"><div className="modal"><div className="row"><h2 className="grow">猬嗭笍 Upload Video</h2><button onClick={p.close}>鉁�</button></div>
 <input className="input" value={p.uploadTitle} onChange={e=>p.setUploadTitle(e.target.value)} placeholder="Video title"/>
 <div className="row" style={{marginTop:10}}><select className="input" value={p.uploadType} onChange={e=>p.setUploadType(e.target.value)}><option value="long">Long Video</option><option value="short">Shorts</option></select><select className="input" value={p.uploadCat} onChange={e=>p.setUploadCat(e.target.value)}>{CATS.slice(1).map(c=><option key={c}>{c}</option>)}</select></div>
 <div className="file" style={{marginTop:10}}><input type="file" accept="video/*" onChange={e=>p.setUploadFile(e.target.files?.[0]||null)}/>{p.uploadFile&&<div className="muted">{p.uploadFile.name}</div>}</div>
 <p className="muted">Local demo: selected video 唳忇 browser-唳� object URL 唳灌唳膏唳 唳氞唳侧Μ唰囙イ Refresh-唳忇Π 唳Π 唳Α唳� uploaded file 唳膏唳ム唳唰€ online storage-唳� 唳ム唳曕Μ唰� 唳ㄠ.</p>
 <button className="success" onClick={p.upload}>Upload</button></div></div>
}

function Creator({s,setPage}){
 const mine=s.videos.filter(v=>v.channel===s.profile.name);
 const views=mine.reduce((a,v)=>a+(v.views||0),0);
 const likes=mine.reduce((a,v)=>a+(v.likes||0),0);
 return <div><div className="row"><h2>馃挵 Creator Studio</h2><span className="grow"/><button onClick={()=>setPage("home")}>Home</button></div>
 <div className="statgrid"><div className="stat"><b>{mine.length}</b><div className="muted">Videos</div></div><div className="stat"><b>{views}</b><div className="muted">Views</div></div><div className="stat"><b>{likes}</b><div className="muted">Likes</div></div></div>
 <div className="panel"><h3>Estimated earnings</h3><div style={{fontSize:28}}>鈧箋Number(s.earnings).toFixed(2)}</div><p className="muted">Demo balance only. Real creator payouts require a proper payment provider, age/identity verification and applicable legal requirements.</p></div>
 <div className="panel"><h3>Your videos</h3>{mine.map(v=><div className="row panel" key={v.id}><b className="grow">{v.title}</b><span>{v.views} views</span></div>)}</div></div>
}

function Profile({s,profileName,setProfileName,updateProfile}){
 return <div><h2>馃懁 Profile / Channel</h2><div className="panel"><h3>Channel settings</h3><input className="input" value={profileName} onChange={e=>setProfileName(e.target.value)} placeholder="Channel name"/><br/><br/><button className="success" onClick={updateProfile}>Save Profile</button><p className="muted">@{s.profile.handle.replace(/^@/,"")} 鈥� {s.profile.bio}</p></div>
 <div className="panel"><h3>Account</h3><p>Channel: <b>{s.profile.name}</b></p><p>Subscribers: Demo mode</p></div></div>
}
function Notifications({s}){return <div><h2>馃敂 Notifications</h2>{s.notifications.length?s.notifications.map(n=><div className="panel" key={n.id}>{n.text}<div className="muted">{n.time}</div></div>):<div className="panel">唳曕唳ㄠ notification 唳ㄠ唳囙イ</div>}</div>}
function Chat({s,chatUser,setChatUser,chatText,setChatText,sendChat}){
 return <div><h2>馃挰 Chat</h2><div className="row"><button className="active" onClick={()=>setChatUser("PlayVideo Creator")}>Creator</button><button onClick={()=>setChatUser("Friend")}>Friend</button></div><div className="messages">{s.chats.filter(x=>x.user===chatUser||x.mine).map(m=><div className={"bubble "+(m.mine?"mine":"")} key={m.id}><b>{m.mine?"You":m.user}</b><br/>{m.text}<div className="muted">{m.time}</div></div>)}</div><div className="row" style={{marginTop:10}}><input className="input" value={chatText} onChange={e=>setChatText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()} placeholder="Message..."/><button className="success" onClick={sendChat}>Send</button></div><p className="muted">Demo chat: 唳忇 version-唳� message 唳多唳о 唳忇 browser-唳� 唳ム唳曕啷�</p></div>
}
