import { useState } from "react";

export default function App() {
  const [page, setPage] = useState("you");

  return (
    <div className="flex justify-center bg-[#f2f2f2] min-h-screen">
      <div className="w-full max-w-[430px] bg-white min-h-screen relative pb-[70px] text-black">

        {/* ===== YOU PAGE - 2nd Screenshot er moto ===== */}
        {page === "you" && (
          <div className="p-4">
            <div className="flex justify-between items-center">
              <div className="border px-4 py-2 rounded-full text-sm font-bold">Accounts ▾</div>
              <div className="flex gap-4 text-xl"><span>🔔</span><span>🔍</span><span>⚙️</span></div>
            </div>

            <div className="flex gap-4 mt-6 items-center">
              <img src="https://i.pravatar.cc/100?img=11" className="w-16 h-16 rounded-full" />
              <div>
                <h2 className="font-bold text-xl">Yours Sabuj 01</h2>
                <p className="text-sm text-zinc-500">@Yourssabuj01</p>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button onClick={()=>setPage("channel")} className="flex-1 bg-black text-white py-3 rounded-full font-bold text-sm">View channel</button>
              <button className="flex-1 border border-zinc-300 py-3 rounded-full font-bold text-sm">Get Premium</button>
            </div>

            <h3 className="font-bold text-lg mt-6">History &gt;</h3>
            <div className="flex gap-3 overflow-x-auto mt-3">
              <div className="min-w-[160px]"><img src="https://picsum.photos/300/170?random=1" className="rounded-xl w-full h-24 object-cover"/><p className="text-xs font-bold mt-1">Olivia Rodrigo - drivers license</p></div>
              <div className="min-w-[160px]"><img src="https://picsum.photos/300/170?random=2" className="rounded-xl w-full h-24 object-cover"/><p className="text-xs font-bold mt-1">How to EARN MONEY as STUDENT</p></div>
              <div className="min
