import { useMemo, useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Menu as LangMenu, Transition } from "@headlessui/react";
import { Menu as MenuIcon } from "lucide-react";
import * as Flags from "country-flag-icons/react/3x2";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router-dom";

function Flag({ country, className = "h-4 w-6 rounded-sm" }) {
    const C = Flags[country] || Flags.US;
    return <C className={className} />;
}

export default function Navbar({
    title = "",
    showMenuButton = false,
    onMenuClick = () => { },
}) {
    const { t } = useTranslation();
    const { selectedLanguage, setLanguage, languages } = useLanguage();
    const [isScrolled, setIsScrolled] = useState(false);

    const ordered = useMemo(() => {
        const en = languages.find((l) => l.code === "en");
        const rest = languages
            .filter((l) => l.code !== "en")
            .sort((a, b) => a.label.localeCompare(b.label));
        return [en, ...rest].filter(Boolean);
    }, [languages]);

    const current = selectedLanguage || ordered[0];

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 0);
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const hasCustomTitle = !!title;
    const gameTitle = hasCustomTitle ? title : t("titles.gameRules");

    return (
        <header className="sticky top-0 z-20 backdrop-blur bg-black/80 border-b border-[#A66C13] shadow-[0_0_20px_rgba(244,165,46,.08)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                    <div className="flex items-center gap-3">
                        {showMenuButton && (
                            <button
                                type="button"
                                onClick={onMenuClick}
                                className="inline-flex items-center justify-center h-11 w-11 rounded-md border border-[#A66C13] text-gray-100 hover:text-primary-300 hover:bg-orange-500/10 sm:hidden"
                                aria-label={t("actions.openMenu")}
                            >
                                <MenuIcon className="h-6 w-6" />
                            </button>
                        )}

                        <Link to="/" className="hidden sm:inline-flex items-center">
                            <img
                                src="/logo_2.png"
                                alt={t("brand.name")}
                                className="h-10 w-auto md:h-12 hover:opacity-90 transition"
                            />
                        </Link>
                    </div>

                    <div className="text-center">
                        <span
                            className={
                                "mx-auto max-w-[70vw] text-2xl sm:text-2xl md:text-3xl font-extrabold text-primary-300 truncate " +
                                (hasCustomTitle && !isScrolled ? "hidden sm:inline" : "")
                            }
                        >
                            {gameTitle}
                        </span>
                    </div>

                    <div
                        className={
                            "justify-self-end transition-opacity duration-200 " +
                            (isScrolled
                                ? "opacity-0 pointer-events-none sm:opacity-100 sm:pointer-events-auto"
                                : "opacity-100")
                        }
                    >
                        {current && (
                            <LangMenu as="div" className="relative inline-block text-left">
                                <LangMenu.Button className="inline-flex items-center gap-2 rounded-md border border-[#A66C13] px-3 py-2 text-sm sm:text-base font-bold text-gray-100 hover:border-primary-400 transition">
                                    <Flag country={current.country} />
                                    <span className="hidden sm:inline">{current.label}</span>
                                    <span className="sm:hidden">{current.code.toUpperCase()}</span>
                                </LangMenu.Button>

                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <LangMenu.Items className="absolute right-0 mt-2 w-60 origin-top-right rounded-md border border-[#A66C13] bg-[#0f141a] shadow-xl focus:outline-none">
                                        <div className="py-1">
                                            {ordered.map((l) => (
                                                <LangMenu.Item key={l.code}>
                                                    {({ active }) => (
                                                        <button
                                                            type="button"
                                                            onClick={() => setLanguage(l.code)}
                                                            className={
                                                                "w-full flex items-center gap-2 px-3 py-2 text-sm sm:text-base " +
                                                                (active ? "bg-orange-500/10 " : "") +
                                                                (l.code === current.code
                                                                    ? "text-primary-300"
                                                                    : "text-gray-100") +
                                                                " font-bold"
                                                            }
                                                        >
                                                            <Flag country={l.country} />
                                                            <span className="flex-1 text-left truncate">
                                                                {l.label}
                                                            </span>
                                                            {l.code === current.code && (
                                                                <span className="text-xs font-black text-primary-300">
                                                                    ●
                                                                </span>
                                                            )}
                                                        </button>
                                                    )}
                                                </LangMenu.Item>
                                            ))}
                                        </div>
                                    </LangMenu.Items>
                                </Transition>
                            </LangMenu>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
