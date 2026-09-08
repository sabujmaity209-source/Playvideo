<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PlayVideo Clone</title>
  <!-- FontAwesome Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    body {
      background-color: #000000;
      color: #ffffff;
      display: flex;
      justify-content: center;
    }

    /* App Layout Container */
    .app-container {
      width: 100%;
      max-width: 480px;
      min-height: 100vh;
      background-color: #0f0f0f;
      position: relative;
      padding-bottom: 70px;
      display: flex;
      flex-direction: column;
    }

    /* Top Navigation Bar */
    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background-color: #0f0f0f;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .top-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: bold;
      font-size: 20px;
    }

    .logo-icon {
      color: #ff0000;
      font-size: 22px;
    }

    .logo-text span {
      color: #ff0000;
    }

    .top-right {
      display: flex;
      align-items: center;
      gap: 18px;
      font-size: 18px;
    }

    .profile-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      object-fit: cover;
    }

    /* Categories Horizontal Scroll */
    .category-bar {
      display: flex;
      gap: 8px;
      padding: 8px 12px;
      overflow-x: auto;
      white-space: nowrap;
      scrollbar-width: none;
      background-color: #0f0f0f;
      position: sticky;
      top: 52px;
      z-index: 9;
    }

    .category-bar::-webkit-scrollbar {
      display: none;
    }

    .chip {
      background-color: #272727;
      color: #ffffff;
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 14px;
      border: none;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
    }

    .chip.active {
      background-color: #ffffff;
      color: #0f0f0f;
      font-weight: 500;
    }

    /* Video Feed */
    .video-feed {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-top: 4px;
    }

    .video-card {
      display: flex;
      flex-direction: column;
      cursor: pointer;
    }

    .thumbnail-container {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9;
      background-color: #202020;
    }

    .thumbnail {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .duration {
      position: absolute;
      bottom: 8px;
      right: 8px;
      background-color: rgba(0, 0, 0, 0.8);
      font-size: 12px;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 500;
    }

    .video-info {
      display: flex;
      padding: 12px;
      gap: 12px;
    }

    .channel-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
    }

    .meta-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .video-title {
      font-size: 15px;
      font-weight: 600;
      line-height: 1.3;
      color: #f1f1f1;
    }

    .channel-name {
      font-size: 13px;
      color: #aaaaaa;
      display: flex;
      align-items: center;
      gap: 4px;

    }

    .verified-tick {
      font-size: 11px;
    }

    .video-stats {
      font-size: 12px;
      color: #aaaaaa;
    }

    /* Floating Action Button */
    .chat-fab {
      position: fixed;
      bottom: 80px;
      right: 20px;
      width: 48px;
      height: 48px;
      background-color: #e50914;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-size: 20px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
      border: none;
      cursor: pointer;
      z-index: 20;
    }

    /* Bottom Navigation Bar */
    .bottom-nav {
      position: fixed;
      bottom: 0;
      width: 100%;
      max-width: 480px;
      height: 60px;
      background-color: #0f0f0f;
      border-top: 1px solid #272727;
      display: flex;
      justify-content: space-around;
      align-items: center;
      z-index: 30;
    }

    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      color: #aaaaaa;
      font-size: 10px;
      text-decoration: none;
      cursor: pointer;
      background: none;
      border: none;
    }

    .nav-item i {
      font-size: 18px;
    }

    .nav-item.active {
      color: #ffffff;
    }

    .add-btn {
      background-color: #ff0000;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ffffff;
      font-size: 18px;
      border: none;
      cursor: pointer;
    }
  </style>
</head>
<body>

  <div class="app-container">
    
    <!-- Top Bar -->
    <header class="top-bar">
      <div class="top-left">
        <i class="fa-solid fa-bars"></i>
        <div class="logo-container">
          <i class="fa-solid fa-square-play logo-icon"></i>
          <div class="logo-text">Play<span>Video</span></div>
        </div>
      </div>
      <div class="top-right">
        <i class="fa-solid fa-tv"></i>
        <i class="fa-regular fa-bell"></i>
        <img src="https://picsum.photos/id/64/100/100" class="profile-avatar" alt="Profile">
      </div>
    </header>

    <!-- Category Chips -->
    <div class="category-bar">
      <button class="chip active">All</button>
      <button class="chip">Coding</button>
      <button class="chip">Music</button>
      <button class="chip">Tech</button>
      <button class="chip">Gaming</button>
      <button class="chip">AI</button>
      <button class="chip">Space</button>
    </div>

    <!-- Video Feed Container -->
    <main class="video-feed" id="videoFeed">
      
      <!-- Video 1 -->
      <article class="video-card" data-category="Coding Tech AI">
        <div class="thumbnail-container">
          <img src="https://picsum.photos/id/1060/800/450" class="thumbnail" alt="Thumbnail">
          <span class="duration">09:56</span>
        </div>
        <div class="video-info">
          <img src="https://picsum.photos/id/1005/100/100" class="channel-avatar" alt="Channel">
          <div class="meta-details">
            <h3 class="video-title">Building PlayVideo - The Ultimate Video Streaming Platform (2026)</h3>
            <div class="channel-name">TechVision Code <i class="fa-solid fa-circle-check verified-tick"></i></div>
            <div class="video-stats">842,000 views • 2 hours ago</div>
          </div>
        </div>
      </article>

      <!-- Video 2 -->
      <article class="video-card" data-category="Music">
        <div class="thumbnail-container">
          <img src="https://picsum.photos/id/1040/800/450" class="thumbnail" alt="Thumbnail">
          <span class="duration">15:40</span>
        </div>
        <div class="video-info">
          <img src="https://picsum.photos/id/1027/100/100" class="channel-avatar" alt="Channel">
          <div class="meta-details">
            <h3 class="video-title">Cyberpunk Nightscape Lo-Fi Chill Beats [24/7 Live Stream]</h3>
            <div class="channel-name">Lofi Beats Station <i class="fa-solid fa-circle-check verified-tick"></i></div>
            <div class="video-stats">1,250,000 views • 1 day ago</div>
          </div>
        </div>
      </article>

      <!-- Video 3 -->
      <article class="video-card" data-category="Gaming">
        <div class="thumbnail-container">
          <img src="https://picsum.photos/id/1058/800/450" class="thumbnail" alt="Thumbnail">
          <span class="duration">12:10</span>
        </div>
        <div class="video-info">
          <img src="https://picsum.photos/id/1012/100/100" class="channel-avatar" alt="Channel">
          <div class="meta-details">
            <h3 class="video-title">Next-Gen Gaming Engine Showcase & Realtime Physics</h3>
            <div class="channel-name">GameDev Pro <i class="fa-solid fa-circle-check verified-tick"></i></div>
            <div class="video-stats">430,000 views • 3 days ago</div>
          </div>
        </div>
      </article>

    </main>

    <!-- Floating Chat Button -->
    <button class="chat-fab" onclick="alert('Floating Chat Opened!')">
      <i class="fa-solid fa-comment-dots"></i>
    </button>

    <!-- Bottom Navigation Bar -->
    <nav class="bottom-nav">
      <button class="nav-item active">
        <i class="fa-solid fa-house"></i>
        <span>Home</span>
      </button>
      <button class="nav-item">
        <i class="fa-solid fa-film"></i>
        <span>Shorts</span>
      </button>
      <button class="add-btn" onclick="alert('Create/Upload Video')">
        <i class="fa-solid fa-plus"></i>
      </button>
      <button class="nav-item">
        <i class="fa-solid fa-layer-group"></i>
        <span>Subs</span>
      </button>
      <button class="nav-item">
        <i class="fa-solid fa-book-bookmark"></i>
        <span>Library</span>
      </button>
    </nav>

  </div>

  <script>
    // Category Tag Interactivity & Filtering
    const chips = document.querySelectorAll('.chip');
    const videos = document.querySelectorAll('.video-card');

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        // Active class toggle
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const filter = chip.textContent.trim();

        // Simple filtering functionality
        videos.forEach(video => {
          const categories = video.getAttribute('data-category');
          if (filter === 'All' || (categories && categories.includes(filter))) {
            video.style.display = 'flex';
          } else {
            video.style.display = 'none';
          }
        });
      });
    });

    // Bottom Navigation Active State Toggle
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
      });
    });
  </script>

</body>
</html>
