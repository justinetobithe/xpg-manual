import { Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Menu, Transition } from "@headlessui/react";
import * as Flags from "country-flag-icons/react/3x2";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router-dom";

function Flag({ country, className = "h-4 w-6 rounded-sm" }) {
    const C = Flags[country] || Flags.US;
    return <C className={className} />;
}

export default function Navbar({ title = "", onLang, lang }) {
    const { t } = useTranslation();
    const { selectedLanguage, setLanguage, languages } = useLanguage();

    const ordered = useMemo(() => {
        const en = languages.find((l) => l.code === "en");
        const rest = languages.filter((l) => l.code !== "en").sort((a, b) => a.label.localeCompare(b.label));
        return [en, ...rest].filter(Boolean);
    }, [languages]);

    const current = selectedLanguage || ordered[0];

    return (
        <header className="sticky top-0 z-20 backdrop-blur bg-black/80 border-b border-[#A66C13] shadow-[0_0_20px_rgba(244,165,46,.08)]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 grid grid-cols-3 items-center">
                <div className="flex items-center gap-3">
                    <Link to="/" className="inline-flex items-center">
                        <img src="/logo_2.png" alt={t("brand.name")} className="h-9 w-auto md:h-10 hover:opacity-90 transition" />
                    </Link>
                </div>
                <div className="text-center">
                    {title ? (
                        <span className="mx-auto max-w-[70vw] text-xl sm:text-2xl md:text-3xl font-extrabold text-primary-300 truncate">
                            {title}
                        </span>
                    ) : (
                        <span className="text-xl sm:text-3xl md:text-3xl font-extrabold text-primary-300">{t("titles.gameRules")}</span>
                    )}
                </div>
                <div className="justify-self-end">
                    <Menu as="div" className="relative inline-block text-left">
                        <Menu.Button className="inline-flex items-center gap-2 rounded-md border border-[#A66C13] px-3 py-2 text-[15px] md:text-base font-extrabold text-gray-100 hover:border-primary-400 transition">
                            <Flag country={current.country} />
                            <span className="hidden sm:inline">{current.label}</span>
                            <span className="sm:hidden">{current.code.toUpperCase()}</span>
                        </Menu.Button>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md border border-[#A66C13] bg-[#0f141a] shadow-xl focus:outline-none">
                                <div className="py-1">
                                    {ordered.map((l) => (
                                        <Menu.Item key={l.code}>
                                            {({ active }) => (
                                                <button
                                                    type="button"
                                                    onClick={() => setLanguage(l.code)}
                                                    className={`w-full flex items-center gap-2 px-3 py-2 text-[15px] ${active ? "bg-orange-500/10" : ""
                                                        } ${l.code === current.code ? "text-primary-300" : "text-gray-100"} font-extrabold`}
                                                >
                                                    <Flag country={l.country} />
                                                    <span className="flex-1 text-left">{l.label}</span>
                                                    {l.code === current.code && <span className="text-xs font-black text-primary-300">●</span>}
                                                </button>
                                            )}
                                        </Menu.Item>
                                    ))}
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            </div>
        </header>
    );
}
