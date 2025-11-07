import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const basename = (p = "") => {
    const parts = String(p).trim().split(/[/\\]+/);
    return parts[parts.length - 1] || "";
};

const buildVariants = (slug = "") => {
    const s = String(slug).trim();
    if (!s) return [];
    const v = new Set();
    const dash = s.replace(/_/g, "-");
    const under = s.replace(/-/g, "_");
    const all = [s, dash, under, s.toLowerCase(), dash.toLowerCase(), under.toLowerCase()];
    const exts = [".jpg", ".jpeg", ".png", ".webp"];
    for (const n of all) for (const e of exts) v.add(`/games/${encodeURIComponent(n)}${e}`);
    return [...v];
};

export default function GameCard({ game: gameProp, docId, tag }) {
    const [game, setGame] = useState(gameProp || null);
    const [fetching, setFetching] = useState(false);

    const derivedDocId =
        docId ||
        gameProp?.id ||
        gameProp?.iid ||
        null;

    const derivedTag =
        tag ||
        gameProp?.tag ||
        gameProp?.iurl ||
        null;

    useEffect(() => {
        let cancelled = false;

        async function ensureGameHasData() {
            const hasCore = gameProp && (gameProp.name || gameProp.image);
            if (hasCore) {
                setGame({
                    id: gameProp.id || gameProp.iid || "",
                    name: gameProp.name || gameProp.iname1 || "Untitled",
                    image: gameProp.image || gameProp.img || "",
                    tag: gameProp.tag || gameProp.iurl || gameProp.id || gameProp.iid || "",
                });
                return;
            }

            const idToUse = derivedDocId;
            const tagToUse = derivedTag;
            if (!idToUse && !tagToUse) return;

            setFetching(true);
            try {
                const docRef = doc(db, "manual-games", String(idToUse || tagToUse));
                const snap = await getDoc(docRef);
                if (!cancelled && snap.exists()) {
                    const v = snap.data() || {};
                    setGame({
                        id: snap.id,
                        name: v.name || "Untitled",
                        image: v.image || "",
                        tag: v.tag || snap.id,
                    });
                }
            } finally {
                if (!cancelled) setFetching(false);
            }
        }

        ensureGameHasData();
        return () => {
            cancelled = true;
        };
    }, [gameProp, derivedDocId, derivedTag]);

    const title = game?.name || "Untitled";
    const file = basename(game?.image || "");
    const slug = (game?.tag || game?.id || "").trim();

    const candidates = useMemo(() => {
        const list = [];
        if (file) list.push(`/games/${encodeURIComponent(file)}`);
        list.push(...buildVariants(slug));
        list.push(`/games/placeholder.jpg`);
        return Array.from(new Set(list));
    }, [file, slug]);

    const [idx, setIdx] = useState(0);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setIdx(0);
        setLoaded(false);
    }, [candidates.join("|")]);

    const src = candidates[idx];

    return (
        <Link
            to={`/games/${slug || game?.id || ""}`}
            className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-xl"
        >
            <article className="group rounded-xl bg-transparent">
                <div className="rounded-xl overflow-hidden border-2 border-primary-400 shadow-[0_10px_30px_rgba(0,0,0,.45)] transition">
                    <div className="aspect-[16/9] w-full bg-black">
                        {(!loaded || fetching) && (
                            <div className="grid h-full w-full place-items-center text-primary-300 font-extrabold">…</div>
                        )}
                        <img
                            src={src}
                            alt={title}
                            loading="lazy"
                            onLoad={() => setLoaded(true)}
                            onError={() => {
                                if (idx < candidates.length - 1) setIdx((i) => i + 1);
                                else setLoaded(true);
                            }}
                            className={`block h-full w-full object-cover ${loaded ? "opacity-100" : "opacity-0"}`}
                        />
                    </div>

                    <div className="bg-black text-center border-t-2 border-primary-400 px-4 py-3">
                        <h2 className="text-white text-lg md:text-xl font-extrabold tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">
                            {title}
                        </h2>
                    </div>
                </div>
            </article>
        </Link>
    );
}
