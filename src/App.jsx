import { useState } from "react";
export default function App() {
  const [page, setPage] = useState("you");
  return (
    <div className="flex justify-center bg-zinc-100 min-h-screen">
      <div className="w-full max-w-[430px] bg-white min-h-screen pb-[70px] text-black">
        {page === "you" && (
          <div className="p-4">
            <div className="flex justify-between"><b className="border px-4 py-2 rounded-full text-sm">Accounts ▾</b><span>🔔 🔍 ⚙️</span></div>
            <div className="flex gap-3 mt-6 items-center"><img src="https://i.pravatar.cc/100?img=11" className="w-16 h-16 rounded-full"/><div><h2 className="font-bold text-xl">Yours Sabuj 01</h2><p className="text-sm text-zinc-500">@Yourssabuj01 • 496 subs</p></div></div>
            <div className="flex gap-2 mt-5"><button onClick={()=>setPage("channel")} className="flex-1 bg-black text-white py-3 rounded-full font-bold text-sm">View channel</button><button className="flex-1 border py-3 rounded-full font-bold text-sm">Get Premium</button></div>
            <h3 className="font-bold mt-6">History &gt;</h3>
            <div className="flex gap-2 overflow-x-auto mt-2"><div className="min-w-[130px] h-20 bg-zinc-200 rounded-xl"></div><div className="min-w-[130px] h-20 bg-zinc-200 rounded-xl"></div><div className="min-w-[130px] h-20 bg-zinc-200 rounded-xl"></div></div>
          </div>
        )}
        {page === "channel" && (
          <div><div onClick={()=>setPage("you")} className="p-3 font-bold">← Back</div><div className="h-32 bg-black"></div><div className="p-3"><h2 className="font-bold">Yours Sabuj 01</h2><p className="text-xs">@Yourssabuj01 • 496 subs</p><div className="grid grid-cols-2 gap-2 mt-4"><div><div className="h-24 bg-zinc-200 rounded-xl"></div><p className="text-xs font-bold">Unboxing! 🎁</p></div><div><div className="h-24 bg-zinc-200 rounded-xl"></div><p className="text-xs font-bold">Amar Vlog</p></div></div></div></div>
        )}
        {page === "shorts" && (
          <div className="p-2"><div onClick={()=>setPage("you")} className="p-2 font-bold">← Back</div><div className="grid grid-cols-2 gap-2"><div className="h-[300px] bg-zinc-300 rounded-xl flex items-end p-2 text-white text-xs font-bold">🌺 Joy Ma
