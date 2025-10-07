
export interface ExperimentRow {
    chatbot: string;
    manusia: string;
    perbandingan: string;
}

export interface ExperimentData {
    kelebihanAI: ExperimentRow;
    kekuranganAI: ExperimentRow;
    situasiAI: ExperimentRow;
    peranManusia: ExperimentRow;
}
