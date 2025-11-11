import { useTranslation } from "react-i18next";

export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="mt-14 border-t border-orange-500/20 bg-black/70">
            <div className="max-w-6xl mx-auto px-6 py-8 text-xl text-gray-300 flex flex-col md:flex-row gap-2 md:gap-0 items-center justify-between font-bold">
                <span>© {new Date().getFullYear()} XPG</span>
                <span className="text-gray-400">
                    {t("footer.manual")} • v1.0
                </span>
            </div>
        </footer>
    );
}
