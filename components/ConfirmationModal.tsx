import React from 'react';
import { X, Check, LoaderCircle } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
    title: string;
    message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, isLoading, title, message }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmation-modal-title"
        >
            <div
                className="relative bg-white rounded-lg shadow-xl w-full max-w-md m-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <h2 id="confirmation-modal-title" className="text-xl font-bold text-gray-800">{title}</h2>
                    <p className="mt-2 text-gray-600">{message}</p>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 text-white font-bold rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition disabled:bg-teal-300 w-36"
                    >
                        {isLoading ? (
                            <>
                                <LoaderCircle className="animate-spin" size={20} />
                                <span>Memproses...</span>
                            </>
                        ) : (
                            <>
                                <Check size={20} />
                                <span>Lanjutkan</span>
                            </>
                        )}
                    </button>
                </div>
                 <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    aria-label="Tutup"
                >
                    <X size={24} />
                </button>
            </div>
        </div>
    );
};

export default ConfirmationModal;
