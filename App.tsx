import React from 'react';
import { useState, useRef } from 'react';
import { Users, FileText, Lightbulb, TestTube2, MessageSquareQuote, Send } from 'lucide-react';
import Section from './components/Section';
import LabeledTextarea from './components/LabeledTextarea';
import { ExperimentData } from './types';
import PrintableView from './components/PrintableView';
import ChatbotModal from './components/ChatbotModal';
import ConfirmationModal from './components/ConfirmationModal';

// These would be in a global scope in the browser via CDN script in index.html
declare const jspdf: any;
declare const html2canvas: any;

const App: React.FC = () => {
    const [kelompok, setKelompok] = useState('');
    const [anggota, setAnggota] = useState<string[]>(Array(10).fill(''));
    const [pemecahanMasalah, setPemecahanMasalah] = useState({ q1: '', q2: '', q3: '' });
    const [eksperimen, setEksperimen] = useState<ExperimentData>({
        kelebihanAI: { chatbot: '', manusia: '', perbandingan: '' },
        kekuranganAI: { chatbot: '', manusia: '', perbandingan: '' },
        situasiAI: { chatbot: '', manusia: '', perbandingan: '' },
        peranManusia: { chatbot: '', manusia: '', perbandingan: '' },
    });
    const [kesimpulan, setKesimpulan] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);


    const printRef = useRef<HTMLDivElement>(null);

    const handleAnggotaChange = (index: number, value: string) => {
        const newAnggota = [...anggota];
        newAnggota[index] = value;
        setAnggota(newAnggota);
    };

    const handlePemecahanMasalahChange = (q: 'q1' | 'q2' | 'q3', value: string) => {
        setPemecahanMasalah(prev => ({ ...prev, [q]: value }));
    };

    const handleEksperimenChange = (
        question: keyof ExperimentData,
        field: keyof ExperimentData[keyof ExperimentData],
        value: string
    ) => {
        setEksperimen(prev => ({
            ...prev,
            [question]: {
                ...prev[question],
                [field]: value
            }
        }));
    };
    
    const openChatbotSimulation = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    }

    const handleInitiateSubmit = () => {
        if (!kelompok.trim()) {
            alert('Harap isi nama kelompok terlebih dahulu.');
            return;
        }
        setIsConfirmationModalOpen(true);
    };


    const proceedWithSubmit = async () => {
        setIsLoading(true);
        const element = printRef.current;
        if (!element) {
            setIsLoading(false);
            setIsConfirmationModalOpen(false);
            return;
        }

        // Temporarily make the printable element visible for html2canvas to capture it
        element.style.display = 'block';

        try {
            const canvas = await html2canvas(element, { 
                scale: 2, // Higher scale for better quality
                useCORS: true,
                logging: false,
                windowWidth: element.scrollWidth,
                windowHeight: element.scrollHeight,
            });
            const imgData = canvas.toDataURL('image/png');
            
            // Use jsPDF with point units for standard document sizing
            const pdf = new jspdf.jsPDF({
                orientation: 'p',
                unit: 'pt',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / canvasHeight;

            // Calculate the height of the image in the PDF to maintain aspect ratio
            const imgHeight = pdfWidth / ratio;
            let heightLeft = imgHeight;
            let position = 0;

            // Add the first page
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;

            // Add new pages if the content is longer than one page
            while (heightLeft > 0) {
                position -= pdfHeight; // Move the image up to show the next part
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save(`LKPD_${kelompok.replace(/\s/g, '_')}.pdf`);

            const message = encodeURIComponent(`Halo, kami dari kelompok "${kelompok}" telah selesai mengerjakan LKPD "Peran Kecerdasan Artifisial dalam Komunikasi". Berikut kami lampirkan file PDF hasil pengerjaan kami.`);
            const whatsappUrl = `https://wa.me/6282127618761?text=${message}`;
            window.open(whatsappUrl, '_blank');

        } catch (error) {
            console.error("Gagal membuat PDF:", error);
            alert("Terjadi kesalahan saat membuat PDF. Silakan coba lagi.");
        } finally {
            // Always hide the printable element again, regardless of success or failure
            element.style.display = 'none';
            setIsLoading(false);
            setIsConfirmationModalOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 p-4 sm:p-8">
            <main className="max-w-5xl mx-auto bg-white p-6 sm:p-10 rounded-2xl shadow-lg print-container">
                <header className="text-center border-b-4 border-gray-700 pb-4 mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">LEMBAR KERJA PESERTA DIDIK (LKPD)</h1>
                    <p className="text-lg sm:text-xl font-semibold mt-1">KODING DAN KA</p>
                    <p className="text-xl sm:text-2xl font-bold text-teal-600 mt-2">"PERAN KECERDASAN ARTIFISIAL DALAM KOMUNIKASI"</p>
                </header>

                <Section icon={<Users className="text-teal-500" />} title="Identitas Kelompok">
                    <div className="mb-4">
                        <label className="font-semibold block mb-2 text-gray-700">NAMA KELOMPOK:</label>
                        <input
                            type="text"
                            value={kelompok}
                            onChange={(e) => setKelompok(e.target.value)}
                            className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition text-gray-900 placeholder:text-gray-400"
                            placeholder="Masukkan nama kelompok..."
                        />
                    </div>
                    <div>
                        <label className="font-semibold block mb-2 text-gray-700">NAMA ANGGOTA:</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                            {anggota.map((nama, index) => (
                                <div key={index} className="flex items-center">
                                    <span className="w-6 text-gray-500">{index + 1}.</span>
                                    <input
                                        type="text"
                                        value={nama}
                                        onChange={(e) => handleAnggotaChange(index, e.target.value)}
                                        className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition text-gray-900 placeholder:text-gray-400"
                                        placeholder={`Anggota ${index + 1}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </Section>

                <Section icon={<Lightbulb className="text-yellow-500" />} title="Aktivitas Pemecahan Masalah">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                        <h4 className="font-bold text-lg mb-2 text-gray-800">Kisah Siti dan Chatbot Belanja Online</h4>
                        <p className="text-gray-600 leading-relaxed">Siti adalah seorang mahasiswa yang suka berbelanja secara online. Suatu hari, ia membeli sepatu di toko online bernama TokoKu. Ketika paketnya tiba, Siti merasa kecewa karena sepatu yang diterimanya rusak, solnya lepas dan ada sobekan di bagian atas. Ingin segera menyampaikan keluhan, Siti membuka fitur chat di aplikasi. Namun, ternyata yang membalas pesannya bukan manusia, melainkan chatbot. Chatbot itu menjawab cepat, tetapi hanya memberikan pilihan menu yang tidak sesuai dengan masalah Siti. "Maaf, saya tidak mengerti pertanyaan Anda. Silakan pilih menu berikut," begitu isi pesannya. Siti mencoba berkali-kali menjelaskan, tetapi hasilnya sama. Akhirnya, ia menyerah dan berharap bisa berbicara langsung dengan manusia yang benar-benar mengerti situasinya.</p>
                         <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-gray-700">
                                Simulasi Chatbot yang dialami Siti akses melalui link:
                                <button
                                    onClick={openChatbotSimulation}
                                    className="text-teal-600 font-semibold hover:text-teal-700 underline ml-1 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded bg-transparent border-none p-0 cursor-pointer"
                                >
                                    https://rdsusanto.my.id/chatbot/
                                </button>
                            </p>
                        </div>
                    </div>
                    <LabeledTextarea label="1. Bagaimana perasaan pelanggan jika hanya dilayani chatbot?" value={pemecahanMasalah.q1} onChange={(e) => handlePemecahanMasalahChange('q1', e.target.value)} />
                    <LabeledTextarea label="2. Dalam situasi apa sebaiknya kita menggunakan chatbot (AI)? Dalam kondisi apa peran manusia lebih penting daripada chatbot?" value={pemecahanMasalah.q2} onChange={(e) => handlePemecahanMasalahChange('q2', e.target.value)} />
                    <LabeledTextarea label="3. Dalam kondisi apa peran manusia lebih penting daripada chatbot?" value={pemecahanMasalah.q3} onChange={(e) => handlePemecahanMasalahChange('q3', e.target.value)} />
                </Section>

                <Section icon={<TestTube2 className="text-green-500" />} title="Aktivitas Eksperimen dan Pengumpulan Data">
                    <div className="text-gray-600 space-y-1 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-bold text-lg mb-2 text-gray-800">Petunjuk: Menguji Chatbot vs Manusia</h4>
                      <p>1. Gunakan HP/laptop untuk mengakses chatbot (misalnya ChatGPT, Google Assistant, atau Bing Copilot).</p>
                      <p>2. Ajukan pertanyaan yang sama ke chatbot dan ke temanmu.</p>
                      <p>3. Catat jawaban dari chatbot dan manusia dalam tabel berikut:</p>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <div className="grid grid-cols-[1fr,1fr,1fr,1fr] min-w-[700px] border border-gray-300 rounded-lg">
                          <div className="font-bold bg-gray-100 p-3 border-b border-r border-gray-300">Pertanyaan</div>
                          <div className="font-bold bg-gray-100 p-3 border-b border-r border-gray-300">Jawaban Chatbot (KA)</div>
                          <div className="font-bold bg-gray-100 p-3 border-b border-r border-gray-300">Jawaban Manusia</div>
                          <div className="font-bold bg-gray-100 p-3 border-b border-gray-300">Perbandingan</div>

                          {Object.keys(eksperimen).map((key, idx) => {
                            const qKey = key as keyof ExperimentData;
                            const questionText = {
                              kelebihanAI: "Apa kelebihan AI dalam komunikasi?",
                              kekuranganAI: "Apa kekurangannya dibanding manusia?",
                              situasiAI: "Dalam situasi apa lebih baik menggunakan AI?",
                              peranManusia: "Kapan sebaiknya manusia yang berperan?"
                            }[qKey];

                            return (
                              <React.Fragment key={qKey}>
                                <div className={`p-3 border-r border-gray-300 ${idx < 3 ? 'border-b' : ''} flex items-center font-semibold`}>{questionText}</div>
                                <div className={`p-1 border-r border-gray-300 ${idx < 3 ? 'border-b' : ''}`}>
                                    <textarea value={eksperimen[qKey].chatbot} onChange={(e) => handleEksperimenChange(qKey, 'chatbot', e.target.value)} className="w-full h-32 p-2 border-0 rounded-md focus:ring-2 focus:ring-teal-500 transition resize-none bg-gray-50 text-gray-900 placeholder:text-gray-400" placeholder="Jawaban chatbot..."></textarea>
                                </div>
                                <div className={`p-1 border-r border-gray-300 ${idx < 3 ? 'border-b' : ''}`}>
                                    <textarea value={eksperimen[qKey].manusia} onChange={(e) => handleEksperimenChange(qKey, 'manusia', e.target.value)} className="w-full h-32 p-2 border-0 rounded-md focus:ring-2 focus:ring-teal-500 transition resize-none bg-gray-50 text-gray-900 placeholder:text-gray-400" placeholder="Jawaban manusia..."></textarea>
                                </div>
                                <div className={`p-1 ${idx < 3 ? 'border-b border-gray-300' : ''}`}>
                                    <textarea value={eksperimen[qKey].perbandingan} onChange={(e) => handleEksperimenChange(qKey, 'perbandingan', e.target.value)} className="w-full h-32 p-2 border-0 rounded-md focus:ring-2 focus:ring-teal-500 transition resize-none bg-gray-50 text-gray-900 placeholder:text-gray-400" placeholder="Bandingkan..."></textarea>
                                </div>
                              </React.Fragment>
                            );
                          })}
                      </div>
                    </div>
                </Section>
                
                <Section icon={<MessageSquareQuote className="text-blue-500" />} title="Aktivitas Menyimpulkan">
                    <LabeledTextarea label="Bagaimana Kesimpulan Hasil Diskusi Kelompokmu?" value={kesimpulan} onChange={(e) => setKesimpulan(e.target.value)} rows={8} />
                </Section>
            </main>
            
            <div className="max-w-5xl mx-auto mt-8 flex justify-end">
                <button
                    onClick={handleInitiateSubmit}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 bg-teal-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                    <Send size={20} />
                    <span>Selesai & Kirim</span>
                </button>
            </div>
             <footer className="text-center mt-12 text-gray-500 text-sm">
                <p>LKPD Interaktif © 2025. Dibuat Oleh Rudy Susanto, S.Pd.</p>
            </footer>

            {/* Hidden component, styled for printing, used for PDF generation */}
            <PrintableView
                ref={printRef}
                kelompok={kelompok}
                anggota={anggota}
                pemecahanMasalah={pemecahanMasalah}
                eksperimen={eksperimen}
                kesimpulan={kesimpulan}
            />

            <ChatbotModal isOpen={isModalOpen} onClose={closeModal} />
            <ConfirmationModal 
                isOpen={isConfirmationModalOpen}
                onClose={() => !isLoading && setIsConfirmationModalOpen(false)}
                onConfirm={proceedWithSubmit}
                isLoading={isLoading}
                title="Konfirmasi Pengiriman"
                message="Apakah Anda yakin ingin menyelesaikan dan mengirimkan hasil LKPD? Pastikan semua isian sudah benar."
            />
        </div>
    );
};

export default App;