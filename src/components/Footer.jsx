export default function Footer() {
    return (
        <footer className="mt-12 border-t border-orange-500/20 bg-black/60">
            <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-gray-400 flex items-center justify-between">
                <span>© {new Date().getFullYear()} XPG</span>
                <span className="text-gray-500">Manual • v1.0</span>
            </div>
        </footer>
    );
}
