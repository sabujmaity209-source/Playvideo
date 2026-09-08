import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sqxzahgthhufgbvsg1b.supabase.co'
const supabaseKey = 'sb_publishable_hBReXHV135ypBonXpg0uzQ_w4NBbGnM'
const supabase = createClient(supabaseUrl, supabaseKey)

const initialVideos = [
  { id: 1, title: "Building PlayVideo - Ultimate YouTube Clone (2026)", channel: "Yours Sabuj", views: "10K", viewsNum: 10000, thumb: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe", avatar: "https://i.pravatar.cc/100?img=1", videoUrl: "", vidId: "dQw4w9WgXcQ", category: "Coding" },
  { id: 2, title: "Cyberpunk Lo-Fi Chill - Live Radio", channel: "Lofi Boy", views: "5K", viewsNum: 5000, thumb: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f", avatar: "https://i.pravatar.cc/100?img=2", videoUrl: "", vidId: "dQw4w9WgXcQ", category: "Music" }
]

export default function App() {
  const [videos, setVideos] = useState(()=>{
    const saved = localStorage.getItem('playvideo_data')
    return saved? JSON.parse(saved) : initialVideos
  })
  const [tab, setTab] = useState('home')
  const [shortIdx, setShortIdx] = useState(0)
  const [playing, setPlaying] = useState(null)
  const [showUpload, setShowUpload] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [activeCat, setActiveCat] = useState('All')
  const [earnings, setEarnings] = useState(0)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ title: '', url: '' })
  const [withdrawHistory, setWithdrawHistory] = useState([])

  const cats = ['All','Coding','Music','Tech','Gaming','AI','Space']

  useEffect(()=>{
    localStorage.setItem('playvideo_data', JSON.stringify(videos))
    const totalViews = videos.reduce((a,b)=>a+b.viewsNum,0)
    const totalEarn = (totalViews * 0.002).toFixed(2)
    setEarnings(totalEarn)
  },[videos])

  const handleFile = (e)=>{
    const f = e.target.files[0]
    if(!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  // YOUTUBE LIKE MONETIZATION VIEW COUNT
  const handlePlay = (v)=>{
    setPlaying(v)
    const updated = videos.map(x=> x.id===v.id? {...x, viewsNum: x.viewsNum+1} : x)
    setVideos(updated)
  }

  const addVideo = async ()=>{
    if(!form.title) return alert("Title din Boss!")
    if(!file &&!form.url) return alert("Gallery theke video nin ba YouTube link din!")
    setUploading(true)
    try{
      let videoUrl = form.url
      let thumbUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe"
      let vidId = "dQw4w9WgXcQ"
      if(file){
        const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g,'-')
        const fileName = Date.now()+"-"+cleanName
        const {error} = await supabase.storage.from('videos').upload(fileName, file, {upsert:true})
        if(error) throw error
        const {data} = supabase.storage.from('videos').getPublicUrl(fileName)
        videoUrl = data.publicUrl
        vidId = "local"
      }else if(form.url.includes("v=")){
        vidId = form.url.split("v=")[1].split("&")[0]
        thumbUrl = `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`
      }
      const nv = {id:Date.now(), title:form.title, channel:"Yours Sabuj 01", views:"0", viewsNum:0, thumb:thumbUrl, avatar:"https://i.pravatar.cc/100?img=12", videoUrl:videoUrl, vidId:vidId, category:"All"}
      setVideos([nv,...videos])
      setShowUpload(false)
      setForm({title:'', url:''})
      setFile(null)
      setPreview(null)
      alert("✅ Video Post Hoye Geche! Monetization ON 🔥")
    }catch(err){ alert("Error: "+err.message) }
    setUploading(false)
  }

  const handleWithdraw = ()=>{
    if(Number(earnings) < 10) return alert(`Minimum $10 lagbe! Apnar ache $${earnings}`)
    setWithdrawHistory([{amount:earnings, date:new Date().toLocaleDateString()},...withdrawHistory])
    alert(`✅ $${earnings} Withdraw Success! Bank e 24hr e chole asbe Boss!`)
  }

  const totalViews = videos.reduce((a,b)=>a+b.viewsNum,0)
  const watchHours = (totalViews * 0.05).toFixed(0)

  return (
    <div style={{background:tab==='shorts'?'black':'#0f0f0f', minHeight:'100vh', color:'white', fontFamily:'sans-serif', paddingBottom:70}}>
      {tab==='home' && (
        <>
          <div style={{display:'flex', gap:8, padding:12, overflowX:'auto'}}>
            {cats.map(c=><div key={c} onClick={()=>setActiveCat(c)} style={{padding:'6px 12px', background:activeCat===c?'white':'#272727', color:activeCat===c?'black':'white', borderRadius:8, whiteSpace:'nowrap'}}>{c}</div>)}
          </div>
          {videos.filter(v=>activeCat==='All'||v.category===activeCat).map(v=>(
            <div key={v.id} onClick={()=>handlePlay(v)} style={{marginBottom:12}}>
              <img src={v.thumb} style={{width:'100%', aspectRatio:'16/9', objectFit:'cover'}}/>
              <div style={{padding:12, display:'flex', gap:12}}>
                <img src={v.avatar} style={{width:36, height:36, borderRadius:20}}/>
                <div><div style={{fontWeight:600}}>{v.title}</div><div style={{fontSize:12, color:'#aaa'}}>{v.channel} • {v.viewsNum} views • ${ (v.viewsNum*0.002).toFixed(2)} earned</div></div>
              </div>
            </div>
          ))}
        </>
      )}

      {tab==='shorts' && (
        <div style={{height:'100vh', position:'relative', overflow:'hidden'}}>
          <img src={videos[shortIdx % videos.length].thumb} style={{width:'100%', height:'100%', objectFit:'cover'}}/>
          <div style={{position:'absolute', bottom:80, left:12}}><div>❤️ {videos[shortIdx % videos.length].viewsNum} views</div><div style={{fontSize:12, marginTop:8}}>{videos[shortIdx % videos.length].title}</div></div>
          <div onClick={()=>setShortIdx(s=>s+1)} style={{position:'absolute', bottom:200, right:20, background:'white', color:'black', padding:10, borderRadius:20}}>Next ⬇️</div>
        </div>
      )}

      {tab==='you' && (
        <div style={{padding:20}}>
          <div style={{textAlign:'center'}}>
            <img src="https://i.pravatar.cc/200?img=12" style={{width:80, height:80, borderRadius:50}}/>
            <h2>Yours Sabuj 01</h2><p style={{color:'#aaa'}}>@sabujmaity209 • Monetization ON ✅</p>
          </div>

          <div style={{background:'linear-gradient(135deg,#ff0000,#990000)', padding:16, borderRadius:16, marginTop:20}}>
            <div style={{fontSize:13, opacity:0.8}}>TOTAL EARNINGS</div>
            <div style={{fontSize:32, fontWeight:'bold'}}>${earnings}</div>
            <div style={{fontSize:12}}>1000 views = $2.00 • YouTube Rate</div>
          </div>

          <div style={{background:'#212121', padding:16, borderRadius:12, marginTop:12, display:'flex', justifyContent:'space-between'}}>
            <div><div style={{fontSize:20, fontWeight:'bold'}}>{totalViews}</div><div style={{fontSize:11, color:'#aaa'}}>Total Views</div></div>
            <div><div style={{fontSize:20, fontWeight:'bold'}}>{watchHours}h</div><div style={{fontSize:11, color:'#aaa'}}>Watch Hours</div></div>
            <div><div style={{fontSize:20, fontWeight:'bold'}}>{videos.length}</div><div style={{fontSize:11, color:'#aaa'}}>Videos</div></div>
          </div>

          <div style={{background:'#212121', padding:16, borderRadius:12, marginTop:12}}>
            <div style={{display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:6}}><span>Monetization Progress</span><span>{Math.min(100, Math.floor((watchHours/4000)*100))}%</span></div>
            <div style={{background:'#333', height:8, borderRadius:10}}><div style={{width:`${Math.min(100, (watchHours/4000)*100)}%`, background:'red', height:8, borderRadius:10}}></div></div>
            <div style={{fontSize:11, marginTop:6, color:'#aaa'}}>4000h hole full YouTube monetization unlock • Akhon {watchHours}h / 4000h</div>
            <div onClick={handleWithdraw} style={{marginTop:15, background:Number(earnings)>=10?'#00c853':'#555', padding:14, borderRadius:10, textAlign:'center', fontWeight:'bold', cursor:'pointer'}}>
              {Number(earnings)>=10?`💸 Withdraw $${earnings} Now`:`🔒 $${earnings} / $10 Minimum Withdraw`}
            </div>
          </div>

          {withdrawHistory.length>0 && <div style={{marginTop:12, background:'#212121', padding:12, borderRadius:12}}><b>Withdraw History:</b>{withdrawHistory.map((w,i)=><div key={i} style={{fontSize:12, marginTop:6, color:'#aaa'}}>${w.amount} - {w.date} - Paid ✅</div>)}</div>}
          <div onClick={()=>setTab('home')} style={{marginTop:20, background:'white', color:'black', padding:12, borderRadius:10, textAlign:'center', fontWeight:'bold'}}>Go Home</div>
        </div>
      )}

      {playing && (
        <div style={{position:'fixed', inset:0, background:'black', zIndex:50}}>
          <div onClick={()=>setPlaying(null)} style={{padding:12}}>✕ Close • Ad playing - Earning +$0.002</div>
          {playing.vidId==='local'?<video src={playing.videoUrl} controls autoPlay style={{width:'100%', maxHeight:'60vh'}}/>:<iframe width="100%" height="60%" src={`https://www.youtube.com/embed/${playing.vidId}`} frameBorder="0" allowFullScreen/>}
          <div style={{padding:12}}><h3>{playing.title}</h3><p style={{color:'#aaa'}}>{playing.channel} • {playing.viewsNum+1} views • ${((playing.viewsNum+1)*0.002).toFixed(3)} earned from this video</p><div style={{marginTop:10, background:'#222', padding:10, borderRadius:8, fontSize:12}}>💰 Monetization: Ad Running • You earn per view like YouTube</div></div>
        </div>
      )}

      {showUpload && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', zIndex:60, padding:20}}>
          <div style={{background:'#212121', maxWidth:400, margin:'0 auto', padding:20, borderRadius:12}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:20}}><b>Upload Video - Monetization ON</b><div onClick={()=>setShowUpload(false)}>✕</div></div>
            <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} placeholder="Video Title din - SEO title = besi view = besi taka" style={{width:'100%', padding:12, borderRadius:8, background:'#111', color:'white', border:'1px solid #333', marginBottom:10}}/>
            <label style={{display:'block', width:'100%', padding:14, background:'#111', borderRadius:8, textAlign:'center', marginBottom:10}}>{file?`✅ ${file.name.slice(0,30)}`:'📁 Gallery theke Video nin'}<input type="file" accept="video/*" onChange={handleFile} style={{display:'none'}}/></label>
            {preview && <video src={preview} controls style={{width:'100%', borderRadius:8, marginBottom:10}}/>}
            <div style={{textAlign:'center', color:'#666', margin:'10px 0'}}>OR</div>
            <input value={form.url} onChange={e=>setForm({...form, url:e.target.value})} placeholder="YouTube URL paste korun" style={{width:'100%', padding:12, borderRadius:8, background:'#111', color:'white', border:'1px solid #333', marginBottom:15}}/>
            <div onClick={addVideo} style={{background:uploading?'#666':'red', padding:14, borderRadius:10, textAlign:'center', fontWeight:'bold'}}>{uploading?'Uploading...':'Post Video + Earn Money 🚀💰'}</div>
          </div>
        </div>
      )}

      <div style={{position:'fixed', bottom:0, left:0, right:0, background:'#0f0f0f', display:'flex', justifyContent:'space-around', padding:'10px 0', borderTop:'1px solid #222'}}>
        <div onClick={()=>setTab('home')} style={{textAlign:'center', color:tab==='home'?'white':'#888'}}>🏠<br/>Home</div>
        <div onClick={()=>setTab('shorts')} style={{textAlign:'center', color:tab==='shorts'?'white':'#888'}}>▶️<br/>Shorts</div>
        <div onClick={()=>setShowUpload(true)} style={{textAlign:'center', color:'#888'}}>➕<br/>Post</div>
        <div onClick={()=>setTab('you')} style={{textAlign:'center', color:tab==='you'?'white':'#888'}}>💰<br/>${earnings}</div>
      </div>
    </div>
  )
}
