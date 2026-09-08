<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PlayVideo</title>

<style>
*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:Arial, sans-serif;
}

body{
    background:#0b0b0d;
    color:white;
    max-width:700px;
    margin:auto;
}

/* HEADER */
.header{
    height:72px;
    display:flex;
    align-items:center;
    padding:0 18px;
    border-bottom:1px solid #242426;
    position:sticky;
    top:0;
    background:#0b0b0d;
    z-index:10;
}

.menu{
    font-size:27px;
    margin-right:20px;
}

.logo{
    font-size:25px;
    font-weight:bold;
}

.logo span{
    color:#ef233c;
}

.search{
    margin-left:auto;
    background:#19191c;
    border-radius:25px;
    padding:10px 15px;
}

/* CATEGORY */
.categories{
    display:flex;
    gap:12px;
    overflow-x:auto;
    padding:14px 20px;
}

.categories::-webkit-scrollbar{
    display:none;
}

.category{
    background:#1b1b1e;
    padding:11px 20px;
    border-radius:20px;
    white-space:nowrap;
}

.category.active{
    background:white;
    color:#111;
}

/* VIDEO CARD */
.video{
    margin:18px 20px 28px;
}

.thumbnail{
    width:100%;
    aspect-ratio:16/9;
    object-fit:cover;
    border-radius:18px;
    display:block;
}

.video-info{
    display:flex;
    gap:12px;
    margin-top:12px;
}

.avatar{
    width:42px;
    height:42px;
    border-radius:50%;
    object-fit:cover;
}

.title{
    font-size:17px;
    font-weight:bold;
    line-height:1.3;
}

.meta{
    color:#999;
    font-size:14px;
    margin-top:5px;
}

/* BOTTOM NAV */
.bottom{
    position:fixed;
    bottom:0;
    left:50%;
    transform:translateX(-50%);
    width:100%;
    max-width:700px;
    height:78px;
    background:#111114;
    border-top:1px solid #29292c;
    display:flex;
    justify-content:space-around;
    align-items:center;
    z-index:20;
}

.nav{
    color:#aaa;
    text-align:center;
    font-size:12px;
}

.nav-icon{
    font-size:24px;
    display:block;
    margin-bottom:4px;
}

.nav.active{
    color:#ff263d;
}

.create{
    width:58px;
    height:58px;
    border-radius:18px;
    background:#ef233c;
    display:flex;
    justify-content:center;
    align-items:center;
    font-size:28px;
}

/* PAGE */
.page{
    display:none;
    padding-bottom:100px;
}

.page.active{
    display:block;
}

/* CHAT */
.chat-list{
    padding:20px;
}

.chat-user{
    display:flex;
    align-items:center;
    gap:14px;
    padding:15px 0;
    border-bottom:1px solid #222;
}

.chat-user img{
    width:52px;
    height:52px;
    border-radius:50%;
}

.chat-name{
    font-weight:bold;
}

.chat-msg{
    color:#999;
    margin-top:5px;
}

/* CHAT WINDOW */
.chat-window{
    padding:20px;
}

.message{
    max-width:75%;
    padding:12px 16px;
    border-radius:18px;
    margin:10px 0;
}

.received{
    background:#202023;
}

.sent{
    background:#ef233c;
    margin-left:auto;
}

.chat-input{
    position:fixed;
    bottom:80px;
    width:100%;
    max-width:660px;
    display:flex;
    gap:10px;
    padding:12px;
    background:#111;
}

.chat-input input{
    flex:1;
    padding:13px;
    border:0;
    outline:0;
    border-radius:25px;
    background:#222;
    color:white;
}

.chat-input button{
    border:0;
    border-radius:50%;
    width:45px;
    background:#ef233c;
    color:white;
}

/* UPLOAD */
.upload{
    padding:25px 20px;
}

.upload input,
.upload textarea{
    width:100%;
    margin:10px 0;
    padding:14px;
    border-radius:12px;
    border:1px solid #333;
    background:#171719;
    color:white;
}

.upload button{
    width:100%;
    padding:15px;
    border:0;
    border-radius:12px;
    background:#ef233c;
    color:white;
    font-size:17px;
}

/* SHORTS */
.short{
    height:calc(100vh - 150px);
    margin:10px 20px;
    position:relative;
}

.short video{
    width:100%;
    height:100%;
    object-fit:cover;
    border-radius:18px;
}

.short-buttons{
    position:absolute;
    right:15px;
    bottom:30px;
    display:flex;
    flex-direction:column;
    gap:20px;
    font-size:25px;
    text-align:center;
}

.short-buttons small{
    font-size:12px;
}

/* RESPONSIVE */
@media(max-width:500px){
    .title{
        font-size:15px;
    }

    .logo{
        font-size:22px;
    }
}
</style>
</head>

<body>

<!-- HOME -->
<div id="home" class="page active">

<header class="header">
    <div class="menu">☰</div>
    <div class="logo">▶ Play<span>Video</span></div>
    <div class="search">🔍</div>
</header>

<div class="categories">
    <div class="category active">All</div>
    <div class="category">Coding</div>
    <div class="category">Music</div>
    <div class="category">Tech</div>
    <div class="category">Gaming</div>
    <div class="category">AI</div>
    <div class="category">Space</div>
</div>

<div class="video">

    <img class="thumbnail"
    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3">

    <div class="video-info">
        <img class="avatar"
        src="https://i.pravatar.cc/100?img=12">

        <div>
            <div class="title">
                Building PlayVideo - The Ultimate Video Platform
            </div>

            <div class="meta">
                TechVision Code ✓
                <br>
                842K views • 2 hours ago
            </div>
        </div>
    </div>

</div>


<div class="video">

    <img class="thumbnail"
    src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23">

    <div class="video-info">

        <img class="avatar"
        src="https://i.pravatar.cc/100?img=33">

        <div>
            <div class="title">
                Beautiful Cinematic World 🌎
            </div>

            <div class="meta">
                Travel World ✓
                <br>
                1.2M views • 1 day ago
            </div>
        </div>

    </div>

</div>


<div class="video">

    <img class="thumbnail"
    src="https://images.unsplash.com/photo-1517336714739-489689fd1ca8">

    <div class="video-info">

        <img class="avatar"
        src="https://i.pravatar.cc/100?img=45">

        <div>
            <div class="title">
                Cyberpunk Night Coding 💻
            </div>

            <div class="meta">
                Code Station ✓
                <br>
                560K views • 3 days ago
            </div>
        </div>

    </div>

</div>

</div>


<!-- SHORTS -->
<div id="shorts" class="page">

<header class="header">
    <div class="logo">Shorts</div>
</header>

<div class="short">

    <video
    src=""
    controls
    poster="https://images.unsplash.com/photo-1498050108023-c5249f4df085">
    </video>

    <div class="short-buttons">
        ❤️ <small>12K</small>
        💬 <small>890</small>
        ↗️ <small>Share</small>
    </div>

</div>

</div>


<!-- CREATE -->
<div id="create" class="page">

<header class="header">
    <div class="logo">Create Post</div>
</header>

<div class="upload">

<h2>Upload Video</h2>

<input type="file" accept="video/*">

<input type="text"
placeholder="Video title">

<textarea
rows="5"
placeholder="Write description..."></textarea>

<button onclick="uploadPost()">
    Upload Video
</button>

</div>

</div>


<!-- CHAT -->
<div id="chat" class="page">

<header class="header">
    <div class="logo">Messages</div>
</header>

<div class="chat-list">

<div class="chat-user"
onclick="openChat('Rahul')">

<img src="https://i.pravatar.cc/100?img=11">

<div>
<div class="chat-name">Rahul</div>
<div class="chat-msg">
Hey! Nice video 👍
</div>
</div>

</div>


<div class="chat-user"
onclick="openChat('Sayan')">

<img src="https://i.pravatar.cc/100?img=14">

<div>
<div class="chat-name">Sayan</div>
<div class="chat-msg">
When will you upload?
</div>
</div>

</div>


<div class="chat-user"
onclick="openChat('Arjun')">

<img src="https://i.pravatar.cc/100?img=18">

<div>
<div class="chat-name">Arjun</div>
<div class="chat-msg">
🔥 Great edit
</div>
</div>

</div>

</div>

</div>


<!-- LIBRARY -->
<div id="library" class="page">

<header class="header">
    <div class="logo">Your Library</div>
</header>

<div style="padding:25px">

<h2>Your Videos</h2>

<br>

<p style="color:#999">
Watch history, liked videos,
saved videos and your uploads
will appear here.
</p>

</div>

</div>


<!-- CHAT WINDOW -->
<div id="chatWindow"
style="display:none">

<header class="header">

<div onclick="closeChat()">
←
</div>

<div class="logo"
style="margin-left:20px"
id="chatTitle">
Chat
</div>

</header>

<div class="chat-window"
id="messages">

<div class="message received">
Hello! 👋
</div>

<div class="message sent">
Hi bro 🔥
</div>

</div>

<div class="chat-input">

<input
id="messageInput"
placeholder="Message...">

<button onclick="sendMessage()">
➤
</button>

</div>

</div>


<!-- BOTTOM NAV -->
<nav class="bottom">

<div class="nav active"
onclick="showPage('home',this)">
<span class="nav-icon">⌂</span>
Home
</div>

<div class="nav"
onclick="showPage('shorts',this)">
<span class="nav-icon">▶</span>
Shorts
</div>

<div class="create"
onclick="showPage('create',this)">
+
</div>

<div class="nav"
onclick="showPage('chat',this)">
<span class="nav-icon">💬</span>
Chat
</div>

<div class="nav"
onclick="showPage('library',this)">
<span class="nav-icon">▣</span>
Library
</div>

</nav>


<script>

function showPage(page, element){

    document.querySelectorAll('.page')
    .forEach(p => p.classList.remove('active'));

    document.getElementById(page)
    .classList.add('active');

    document.querySelectorAll('.nav')
    .forEach(n => n.classList.remove('active'));

    if(element){
        element.classList.add('active');
    }

}


function openChat(name){

    document.querySelectorAll('.page')
    .forEach(p => p.classList.remove('active'));

    document.getElementById('chatWindow')
    .style.display='block';

    document.getElementById('chatTitle')
    .innerText=name;

}


function closeChat(){

    document.getElementById('chatWindow')
    .style.display='none';

    showPage('chat',
    document.querySelectorAll('.nav')[3]);

}


function sendMessage(){

    let input=
    document.getElementById('messageInput');

    let text=input.value.trim();

    if(text==="") return;

    let msg=
    document.createElement('div');

    msg.className='message sent';

    msg.innerText=text;

    document.getElementById('messages')
    .appendChild(msg);

    input.value="";

}


function uploadPost(){

    alert(
    "Video selected! Backend connect করলে ভিডিওটি server-এ upload হবে."
    );

}

</script>

</body>
</html>
