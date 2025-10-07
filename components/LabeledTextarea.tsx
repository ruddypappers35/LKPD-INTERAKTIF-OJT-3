
import React from 'react';

interface LabeledTextareaProps {
    label: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    rows?: number;
}

const LabeledTextarea: React.FC<LabeledTextareaProps> = ({ label, value, onChange, rows = 4 }) => {
    return (
        <div className="mb-4">
            <label className="font-semibold block mb-2 text-gray-700">{label}</label>
            <textarea
                value={value}
                onChange={onChange}
                rows={rows}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition text-gray-900"
                placeholder="Tuliskan jawabanmu di sini..."
            />
        </div>
    );
};

export default LabeledTextarea;
