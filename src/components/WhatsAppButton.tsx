import { MessageCircle } from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';

export default function WhatsAppButton() {
  return (
    <button
      onClick={() => openWhatsApp()}
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 z-50 flex items-center gap-2 group"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="hidden group-hover:inline-block text-sm font-medium pr-2">
        Chat with us
      </span>
    </button>
  );
}
