'use client';

import { useRouter } from 'next/navigation';
import NotifikasiIcon from './NotifikasiIcon';
import { formatDistanceToNow, format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ChevronRight, Circle, Calendar } from 'lucide-react';

const NotifikasiItem = ({ notif, onMarkAsRead, onClose }) => {
    const router = useRouter();
    const isRead = Boolean(notif.is_read);

    const handleClick = () => {
        // 1. Mark as read
        onMarkAsRead(notif.id_notif);
        
        // 2. Navigate if action link exists
        if (notif.tautan_aksi) {
            onClose();
            router.push(notif.tautan_aksi);
        }
    };

    return (
        <div 
            onClick={handleClick}
            className={`group relative flex gap-4 p-5 transition-all duration-300 cursor-pointer overflow-hidden
                ${!isRead ? 'bg-blue-50/40 hover:bg-white shadow-inner pb-6' : 'bg-white hover:bg-gray-50/80'}
                border-b border-gray-100 last:border-b-0 backdrop-blur-sm
            `}
        >
            {/* Left Accent Bar for Unread */}
            {!isRead && (
                <div className="absolute left-0 top-0 bottom-0 w-1 transition-all group-hover:w-1.5" />
            )}

            {/* Icon Container */}
            <div className="shrink-0 pt-0.5">
                <NotifikasiIcon kategori={notif.kategori} />
            </div>

            {/* Content Area */}
            <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex justify-between items-start gap-4">
                    <h4 className={`text-sm tracking-tight leading-snug transition-colors ${!isRead ? 'text-gray-900 font-black' : 'text-gray-600 font-bold'}`}>
                        {notif.judul}
                    </h4>
                    
                    <div className="shrink-0 flex items-center gap-1.5">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest tabular-nums">
                            {notif.dibuat_pada && formatDistanceToNow(new Date(notif.dibuat_pada), { addSuffix: true, locale: id })}
                        </span>
                        {!isRead && <Circle className="w-2 h-2 fill-blue-600 text-blue-600 animate-pulse" />}
                    </div>
                </div>

                <p className={`text-sm leading-relaxed line-clamp-2 transition-colors ${!isRead ? 'text-gray-600 font-medium' : 'text-gray-400 font-normal'}`}>
                    {notif.pesan}
                </p>

                {/* Metadata Footer */}
                <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                        <div className="px-2 py-0.5 rounded-lg bg-gray-100/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 transition-colors group-hover:bg-gray-200/50 group-hover:text-gray-500">
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            Oleh: {['SUCCESS', 'WARNING', 'DANGER'].includes(notif.kategori) ? 'Panitia PPDB' : 'Sistem'}
                        </div>
                        {notif.dibuat_pada && (
                            <div className="px-2 py-0.5 rounded-lg bg-gray-100/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 transition-colors group-hover:bg-gray-200/50 group-hover:text-gray-500">
                                <Calendar className="w-3 h-3" />
                                {format(new Date(notif.dibuat_pada), 'dd/MM/yyyy')}
                            </div>
                        )}
                    </div>

                    {notif.tautan_aksi && (
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-1 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                            Lihat Detail <ChevronRight className="w-3 h-3" />
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotifikasiItem;
