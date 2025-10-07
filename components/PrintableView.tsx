import React from 'react';
import { ExperimentData } from '../types';

interface PrintableViewProps {
  kelompok: string;
  anggota: string[];
  pemecahanMasalah: { q1: string; q2: string; q3: string };
  eksperimen: ExperimentData;
  kesimpulan: string;
}

// FIX: Removed incorrect `React.FC<PrintableViewProps>` type annotation.
// Components created with `React.forwardRef` have a special type that is not `React.FC`,
// and adding this annotation prevents the `ref` prop from being recognized.
const PrintableView = React.forwardRef<HTMLDivElement, PrintableViewProps>((props, ref) => {
  const { kelompok, anggota, pemecahanMasalah, eksperimen, kesimpulan } = props;

  const questionMap = {
      kelebihanAI: "Apa kelebihan AI dalam komunikasi?",
      kekuranganAI: "Apa kekurangannya dibanding manusia?",
      situasiAI: "Dalam situasi apa lebih baik menggunakan AI?",
      peranManusia: "Kapan sebaiknya manusia yang berperan?"
  };
  
  const filledAnggota = anggota.filter(nama => nama.trim() !== '');
  const midpoint = Math.ceil(filledAnggota.length / 2);
  const column1 = filledAnggota.slice(0, midpoint);
  const column2 = filledAnggota.slice(midpoint);

  return (
    <div ref={ref} className="printable-container">
        <header className="print-header">
            <h1>LEMBAR KERJA PESERTA DIDIK (LKPD)</h1>
            <p className="subtitle">KODING DAN KA</p>
            <p className="title">"PERAN KECERDASAN ARTIFISIAL DALAM KOMUNIKASI"</p>
        </header>

        <section className="print-section">
            <h2>Identitas Kelompok</h2>
            <div className="identity-grid">
                <div className="font-bold">NAMA KELOMPOK:</div>
                <div>{kelompok || '(Belum diisi)'}</div>
                <div className="font-bold">NAMA ANGGOTA:</div>
                <div>
                    {filledAnggota.length > 0 ? (
                        <div className="anggota-container">
                            <ol>
                                {column1.map((nama, index) => (
                                    <li key={`col1-${index}`}>{nama}</li>
                                ))}
                            </ol>
                            {column2.length > 0 && (
                                <ol start={midpoint + 1}>
                                    {column2.map((nama, index) => (
                                        <li key={`col2-${index}`}>{nama}</li>
                                    ))}
                                </ol>
                            )}
                        </div>
                    ) : (
                        '(Belum diisi)'
                    )}
                </div>
            </div>
        </section>

        <section className="print-section">
            <h2>Aktivitas Pemecahan Masalah</h2>
            <div className="question-block">
                <p className="question">1. Bagaimana perasaan pelanggan jika hanya dilayani chatbot?</p>
                <p className="answer">{pemecahanMasalah.q1 || '(Belum diisi)'}</p>
            </div>
            <div className="question-block">
                <p className="question">2. Dalam situasi apa sebaiknya kita menggunakan chatbot (AI)? Dalam kondisi apa peran manusia lebih penting daripada chatbot?</p>
                <p className="answer">{pemecahanMasalah.q2 || '(Belum diisi)'}</p>
            </div>
            <div className="question-block">
                <p className="question">3. Dalam kondisi apa peran manusia lebih penting daripada chatbot?</p>
                <p className="answer">{pemecahanMasalah.q3 || '(Belum diisi)'}</p>
            </div>
        </section>

        <section className="print-section">
            <h2>Aktivitas Eksperimen dan Pengumpulan Data</h2>
            <table>
                <thead>
                    <tr>
                        <th>Pertanyaan</th>
                        <th>Jawaban Chatbot (KA)</th>
                        <th>Jawaban Manusia</th>
                        <th>Perbandingan</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(eksperimen).map(key => {
                        const qKey = key as keyof ExperimentData;
                        return (
                            <tr key={qKey}>
                                <td className="font-semibold">{questionMap[qKey]}</td>
                                <td className="answer-cell">{eksperimen[qKey].chatbot || '(Belum diisi)'}</td>
                                <td className="answer-cell">{eksperimen[qKey].manusia || '(Belum diisi)'}</td>
                                <td className="answer-cell">{eksperimen[qKey].perbandingan || '(Belum diisi)'}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </section>

        <section className="print-section">
            <h2>Aktivitas Menyimpulkan</h2>
            <div className="question-block">
                <p className="question">Bagaimana Kesimpulan Hasil Diskusi Kelompokmu?</p>
                <p className="answer">{kesimpulan || '(Belum diisi)'}</p>
            </div>
        </section>
    </div>
  );
});

export default PrintableView;