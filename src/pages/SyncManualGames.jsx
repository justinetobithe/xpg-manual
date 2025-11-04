// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { doc, setDoc, serverTimestamp } from "firebase/firestore";
// import { db } from "../firebase";
// import api from "../lib/api";
// import Spinner from "@/components/Spinner";

// const ENGLISH_IURLS = [
//     "thirty-two-cards",
//     "andar-bahar",
//     "baccarat",
//     "blackjack",
//     "unlimited-blackjack",
//     "caribbean-poker",
//     "dragon-tiger",
//     "european-roulette",
//     "thunder-roulette",
//     "sic-bo",
//     "wheel-of-fortune",
//     "single-poker",
//     "mobile-roulette",
//     "mobile-dragon-tiger",
//     "mobile-baccarat",
//     "teen-patti",
//     "teen-patti-20-20",
//     "general-info",
// ];

// export default function SyncManualGames() {
//     const [rows, setRows] = useState([]);
//     const [busy, setBusy] = useState(false);
//     const [done, setDone] = useState(false);
//     const [error, setError] = useState("");

//     const syncNow = async () => {
//         setBusy(true);
//         setDone(false);
//         setError("");
//         const dedup = Array.from(new Set(ENGLISH_IURLS));
//         const out = [];

//         for (const slug of dedup) {
//             const item = { slug, status: "pending", message: "" };
//             out.push(item);
//             setRows([...out]);

//             try {
//                 const { data } = await api.get(`/api/games/${slug}`);
//                 const payload = {
//                     name: data?.iname1 || "",
//                     tag: data?.iurl || slug,
//                     text: data?.itext || "",
//                     image: data?.img || "",
//                     updatedAt: serverTimestamp(),
//                 };

//                 await setDoc(doc(db, "manual-games", payload.tag), payload, { merge: true });
//                 item.status = "ok";
//                 item.message = "saved";
//             } catch (e) {
//                 item.status = "fail";
//                 item.message = e?.response?.data?.error || e?.message || "error";
//             }
//             setRows([...out]);
//         }

//         setBusy(false);
//         setDone(true);
//     };

//     return (
//         <div className="min-h-screen bg-black text-white">
//             <div className="max-w-5xl mx-auto px-6 py-8">
//                 <div className="flex items-center justify-between mb-6">
//                     <h1 className="text-2xl md:text-3xl font-bold text-orange-400">Sync Manual Games → Firestore</h1>
//                     <Link to="/" className="text-sm text-gray-300 hover:text-orange-300 underline">Back to Home</Link>
//                 </div>

//                 <p className="text-sm text-gray-400 mb-4">
//                     Will fetch from <span className="text-gray-200">/api/games/:iurl</span> and upsert into
//                     <span className="text-gray-200"> manual-games</span> with fields
//                     <span className="text-gray-200"> name, tag, text, image</span>.
//                 </p>

//                 <button
//                     type="button"
//                     onClick={syncNow}
//                     disabled={busy}
//                     className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-[#A66C13] hover:bg-[#F4A52E] text-black font-semibold disabled:opacity-50"
//                 >
//                     {busy && <Spinner className="h-4 w-4" />} {busy ? "Syncing…" : "Sync to Firestore"}
//                 </button>

//                 <div className="mt-6 overflow-x-auto">
//                     <table className="min-w-full text-sm">
//                         <thead className="text-gray-400">
//                             <tr>
//                                 <th className="text-left py-2 pr-6">#</th>
//                                 <th className="text-left py-2 pr-6">iurl</th>
//                                 <th className="text-left py-2 pr-6">status</th>
//                                 <th className="text-left py-2">message</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {rows.map((r, i) => (
//                                 <tr key={r.slug} className="border-t border-white/10">
//                                     <td className="py-2 pr-6 text-gray-400">{i + 1}</td>
//                                     <td className="py-2 pr-6">{r.slug}</td>
//                                     <td className={`py-2 pr-6 ${r.status === "ok" ? "text-green-400" : r.status === "fail" ? "text-red-400" : "text-gray-400"}`}>
//                                         {r.status}
//                                     </td>
//                                     <td className="py-2">{r.message}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>

//                     {!rows.length && (
//                         <div className="text-gray-500 text-sm mt-4">No runs yet. Click “Sync to Firestore”.</div>
//                     )}
//                 </div>

//                 {done && (
//                     <div className="mt-4 text-green-400 text-sm">
//                         Done. {rows.filter(r => r.status === "ok").length} saved,
//                         {" "}
//                         {rows.filter(r => r.status === "fail").length} failed.
//                     </div>
//                 )}
//                 {!!error && <div className="mt-4 text-red-400 text-sm">{error}</div>}
//             </div>
//         </div>
//     );
// }


import React from 'react'

export default function SyncManualGames() {
    return (
        <div>SyncManualGames</div>
    )
}
