import React from 'react';
import { X } from 'lucide-react';

interface ChatbotModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ChatbotModal: React.FC<ChatbotModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="chatbot-modal-title"
        >
            <div 
                className="relative bg-transparent rounded-lg"
                onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside the phone
            >
                {/* Phone Frame */}
                <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[720px] w-[360px] shadow-xl">
                    <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
                    <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
                    <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
                    <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
                    <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white">
                        <iframe
                            src="https://rdsusanto.my.id/chatbot/"
                            title="Simulasi Chatbot"
                            className="w-full h-full border-0"
                            id="chatbot-modal-title"
                        ></iframe>
                    </div>
                </div>
                
                <button
                    onClick={onClose}
                    className="absolute -top-3 -right-3 md:-top-4 md:-right-4 bg-white rounded-full p-2 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition shadow-md"
                    aria-label="Tutup simulasi"
                >
                    <X size={24} />
                </button>
            </div>
        </div>
    );
};

export default ChatbotModal;
