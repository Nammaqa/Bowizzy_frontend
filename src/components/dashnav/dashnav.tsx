import { Search, Bell, Share2, Menu } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';

export default function DashNav({heading}: {heading: string}) {
    const { toggleSidebar } = useSidebar()

    return (
        <nav className="flex items-center justify-between px-6 py-6 bg-white border-b border-gray-200">
            <div className="text-lg font-medium text-gray-700">{heading}</div>
            <div className="flex items-center gap-2">
                <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-100 transition">
                    <Search size={18} />
                </button>
                <div className="relative">
                    <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-100 transition">
                        <Bell size={18} />
                    </button>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
                </div>
                <button className="flex items-center gap-1 px-4 h-9 rounded-full border border-gray-200 bg-white hover:bg-gray-100 transition">
                    <Share2 size={16} />
                    <span className="text-sm">Share</span>
                </button>
                <button 
                    onClick={() => toggleSidebar()} 
                    className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white 
                            hover:bg-gray-100 transition lg:hidden"
                >
                    <Menu size={18} />
                </button>

            </div>
        </nav>
    );
}