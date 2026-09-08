import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://sqxzahgththufgbpvcwu.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxeHphaGd0aHR1ZmdicHZjd3UiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc1OTU1NjE1MSwiZXhwIjoyMDc1MTMyMTUxfQ.IkpXVCJ9";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [myVideos, setMyVideos] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const { data } = await supabase.from("videos").select("*").order("created_at", { ascending: false });
    if (data) setMyVideos(data);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileName = `${Date.now()}-${file.name}`;

    // 1. Storage e upload
    const { error } = await supabase.storage.from("videos").upload(fileName, file);
    if (error) { alert(error.message); setUploading(false); return; }

    // 2. Public URL nao
    const { data } = supabase.storage.from("videos").getPublicUrl(fileName);

    // 3. Table e save koro
    await supabase.from("videos").insert({ title: file.name, video_url: data.publicUrl });

    // 4. Abar video gulo load koro
    fetchVideos();
    setUploading(false);
    alert("Upload hoyeche Boss!");
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>PlayVideo</h1>
      <input type="file" accept="video/*" onChange={handleUpload} disabled={uploading} />
      {uploading && <p>Uploading...</p>}

      <div style={{ marginTop: '20px' }}>
        {myVideos.map((v) => (
          <div key={v.id} style={{ marginBottom: '20px' }}>
            <p>{v.title}</p>
            <video src={v.video_url} controls width="300"></video>
          </div>
        ))}
      </div>
    </div>
  );
}
