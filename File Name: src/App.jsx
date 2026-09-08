import { useState } from "react";

export default function App() {
  const [page, setPage] = useState("you");

  return (
    <div className="flex justify-center bg-zinc-200 min-h-screen">
      <div className="w-full max-w-[430px] bg-white min-h-screen pb-[70px] text-black">

        {page === "you" && (
          <div className="p-4">
            <div className="flex justify-between"><b className="border px-4 py-2 rounded-full text-sm">Accounts ▾</b><span>🔔 🔍 ⚙️</span></div>
            <div className="flex gap-3 mt-6 items-center">
              <img src="https://i.pravatar.cc/100?img=11" className="w-16 h-16 rounded-full"/>
              <div><h2 className="font-bold text-xl">Yours Sabuj 01</h2><p className="text-sm text-zinc-500">@Yourssabuj01</p></div>
            </div>
            <button onClick={()=>setPage("channel")} className="w-full bg-black text-white py-3 rounded-full font-bold mt-5">View channel - 1st Screenshot</button>
            <button onClick={()=>setPage("shorts")} className="w-full border py-3 rounded-full font-bold mt-2">Shorts - 3rd Screenshot</button>
            <h3 className="font-bold mt-6">History</h3>
            <div className="flex gap-2 overflow-x-auto mt-2">
              <img src="https://picsum.photos/200/120?1" className="w-32 h-20 rounded-xl"/>
              <img src="https://picsum.photos/200/120?2" className="w-32 h-20 rounded-xl"/>
              <img src="https://picsum.photos/200/120?3" className="w-32 h-20 rounded-xl"/>
            </div>
          </div>
        )}

        {page === "channel
