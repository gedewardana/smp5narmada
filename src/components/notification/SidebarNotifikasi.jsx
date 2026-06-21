'use client'

import { useState, useEffect, useRef, useMemo } from 'react';
import NotifikasiItem from './NotifikasiItem';
import { X, CheckCheck, BellOff, Bell, History, ArrowRight } from 'lucide-react';
import { useNotifikasi } from '@/hooks/useNotifikasi';

const SidebarNotifikasi = ({ isOpen, onClose }) => {
    const { 
        notifications,
        groupedNotifications, 
        unreadCount, 
        isLoading, 
        markRead, 
        markAllRead,
        loadMore,
        hasMore
    } = useNotifikasi();

    const sidebarRef = useRef(null);
    const [showShadow, setShowShadow] = useState(false);

    // Effect for shadow delay
    useEffect(() => {
        let timer;
        if (isOpen) {
            timer = setTimeout(() => setShowShadow(true), 150);
        } else {
            setShowShadow(false);
        }
        return () => clearTimeout(timer);
    }, [isOpen]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isOpen) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    const handleMarkAllRead = async () => {
        await markAllRead();
    };

    const handleMarkOneRead = async (id) => {
        await markRead(id);
    };
    // Grouping Logic sekarang dikelola oleh useNotifikasi hook
    
    return (
        <>
            {/* Professional Backdrop Blur Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-gray-900/10 backdrop-blur-sm transition-all duration-500 ease-in-out
                    ${isOpen ? 'opacity-100 pointer-events-auto cursor-pointer' : 'opacity-0 pointer-events-none'}`}
                aria-hidden="true"
                onClick={onClose}
            />

            {/* SIDEBAR CONTAINER */}
            <aside
                ref={sidebarRef}
                className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[450px] bg-white border-l border-gray-100/50 
                transform transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                ${showShadow ? 'shadow-[0_0_100px_rgba(0,0,0,0.15)]' : ''}`}
            >
                <div className="flex flex-col h-full bg-white relative">

                    {/* Header: Sticky and Professional */}
                    <div className="px-8 py-7 bg-white/80 backdrop-blur-md border-b border-gray-50 flex items-center justify-between shrink-0 sticky top-0 z-20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                                <Bell className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-900 tracking-tight leading-none mb-1">Notifikasi</h2>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                                    {unreadCount} Pesan Belum Dibaca
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    title="Tandai semua sudah dibaca"
                                    className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50/50 rounded-2xl transition-all active:scale-90"
                                >
                                    <CheckCheck className="w-5 h-5" />
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50/50 rounded-2xl transition-all active:scale-90"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* CONTENT LIST (Scrollable) */}
                    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollview pb-24">
                        {isLoading && notifications.length === 0 ? (
                            <div className="space-y-6 p-8">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="animate-pulse flex gap-5">
                                        <div className="w-12 h-12 bg-gray-100 rounded-xl shrink-0"></div>
                                        <div className="flex-1 space-y-3 py-1">
                                            <div className="h-4 bg-gray-100 rounded-full w-3/4"></div>
                                            <div className="h-3 bg-gray-50 rounded-full w-full"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-12 animate-in fade-in zoom-in duration-700">
                                <div className="w-32 h-32 rounded-[2.5rem] bg-gray-50/50 border border-gray-100/50 flex items-center justify-center mb-8 shadow-inner group transition-all hover:bg-white hover:shadow-xl hover:shadow-blue-500/5">
                                    <BellOff className="w-12 h-12 text-gray-300 group-hover:text-blue-400 transition-colors group-hover:rotate-12" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2">Belum Ada Notifikasi !</h3>
                                <p className="text-sm font-medium text-gray-400 leading-relaxed max-w-[240px]">
                                    Notifikasi akan muncul di sini jika ada!
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                {Object.entries(groupedNotifications).map(([group, list]) => (
                                    list.length > 0 && (
                                        <div key={group} className="animate-in slide-in-from-right-4 duration-500">
                                            <div className="px-8 py-4 bg-gray-50/50 border-y border-gray-100/30 sticky top-0 z-10 hidden md:block">
                                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                                    {group === 'today' ? 'Hari Ini' : group === 'yesterday' ? 'Kemarin' : 'Riwayat Lama'}
                                                </h3>
                                            </div>
                                            <div className="divide-y divide-gray-50 min-h-20">
                                                {list.map((notif) => (
                                                    <NotifikasiItem
                                                        key={notif.id_notif}
                                                        notif={notif}
                                                        onMarkAsRead={handleMarkOneRead}
                                                        onClose={onClose}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer Area: Fixed and High-End */}
                    {hasMore && (
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/95 to-transparent pt-12 shrink-0">
                            <button 
                                onClick={loadMore}
                                disabled={isLoading}
                                className="w-full h-14 rounded-2xl bg-gray-900 text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-gray-900/20 hover:bg-gray-800 transition-all flex items-center justify-center gap-3 group active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait"
                            >
                                <History className={`w-4 h-4 transition-transform group-hover:rotate-[-45deg] ${isLoading ? 'animate-spin' : ''}`} />
                                {isLoading ? 'MEMUAT...' : 'TAMPILKAN LEBIH BANYAK (5)'}
                                {!isLoading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                            </button>
                        </div>
                    )}

                </div>
            </aside>

            <style>{`
                .scrollbar-thin::-webkit-scrollbar { width: 4px; }
                .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
                .scrollbar-thin::-webkit-scrollbar-thumb { background: #f1f1f1; border-radius: 20px; }
            `}</style>
        </>
    );
};

export default SidebarNotifikasi;
