import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://sqxzahgththufgbpvcwu.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxeHphaGd0aHRodWZnYnB2Y3d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NjE0OTIsImV4cCI6MjA3MjQzNzQ5Mn0.4T8ulaO0O0Q3Yv4eS1f4Jz4Bz6L7"; // tomar anon key
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [myVideos, setMyVideos] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("videos").select("*").order("created_at", { ascending: false });
      if (data) setMyVideos(data);
    };
    fetch();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage.from("Videos").upload(fileName, file);
    if (error) { alert(error.message); return; }

    const { data } = supabase.storage.from("Videos").getPublicUrl(fileName);

    await supabase.from("videos").insert({ title: file.name, video_url: data.publicUrl });

    const { data: newData } = await supabase.from("videos").select("*").order("created_at", { ascending: false });
    setMyVideos(newData);
  };

  return (
    <div style={{padding:20}}>
      <h2>Playvideo - Boss er App</h2>
      <input type="file" accept="video/*" onChange={handleUpload} />
      <div>
        {myVideos.map(v => (
          <div key={v.id} style={{marginTop:20}}>
            <p>{v.title}</p>
            <video src={v.video_url} controls width="300" />
          </div>
        ))}
      </div>
    </div>
  )
}
