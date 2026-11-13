/**
 * Quản lý ngân hàng câu hỏi tiểu học & Nhập/Xuất file Excel mẫu
 */

const DEFAULT_QUESTIONS = [
    {
        id: 1,
        category: "Toán Học",
        question: "Số lớn nhất có 2 chữ số khác nhau là số nào?",
        type: "choice",
        options: ["A. 99", "B. 98", "C. 89", "D. 90"],
        answer: "B",
        explanation: "Số lớn nhất có 2 chữ số khác nhau là 98 (chữ số 9 và chữ số 8)."
    },
    {
        id: 2,
        category: "Tiếng Việt",
        question: "Trong câu: 'Mặt trời đội biển nhô màu mới', từ nào là từ chỉ hoạt động?",
        type: "choice",
        options: ["A. Mặt trời", "B. Biển", "C. Đội, nhô", "D. Màu mới"],
        answer: "C",
        explanation: "'Đội' và 'nhô' là các động từ chỉ hoạt động trong câu."
    },
    {
        id: 3,
        category: "Tự Nhiên & Xã Hội",
        question: "Cơ quan nào trong cơ thể người có chức năng bơm máu đi khắp cơ thể?",
        type: "choice",
        options: ["A. Phổi", "B. Tim", "C. Dạ dày", "D. Thận"],
        answer: "B",
        explanation: "Tim là cơ quan tuần hoàn có chức năng co bóp để bơm máu đi nuôi cơ thể."
    },
    {
        id: 4,
        category: "Lịch Sử",
        question: "Bác Hồ đọc Tuyên ngôn Độc lập khai sinh ra nước Việt Nam Dân chủ Cộng hòa vào ngày tháng năm nào?",
        type: "choice",
        options: ["A. 19/8/1945", "B. 2/9/1945", "C. 30/4/1975", "D. 7/5/1954"],
        answer: "B",
        explanation: "Ngày 2/9/1945 tại Quảng trường Ba Đình lịch sử, Bác Hồ đọc Tuyên ngôn Độc lập."
    },
    {
        id: 5,
        category: "Địa Lý",
        question: "Thủ đô của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam là thành phố nào?",
        type: "choice",
        options: ["A. TP. Hồ Chí Minh", "B. Đà Nẵng", "C. Hải Phòng", "D. Hà Nội"],
        answer: "D",
        explanation: "Thủ đô của Việt Nam là Thành phố Hà Nội nghìn năm văn hiến."
    },
    {
        id: 6,
        category: "Đố Vui Trí Tuệ",
        question: "Cái gì đen khi bạn mua nó, đỏ khi bạn dùng nó và xám xịt khi bạn vứt nó đi?",
        type: "choice",
        options: ["A. Than hoa (than củi)", "B. Bút chì", "C. Tẩy gôm", "D. Cục phấn"],
        answer: "A",
        explanation: "Đó là than hoa: khi mua màu đen, khi đốt đỏ lửa, khi tàn hóa tro xám."
    },
    {
        id: 7,
        category: "Toán Học",
        question: "Một hình vuông có chu vi là 24 cm. Diện tích của hình vuông đó là bao nhiêu cm²?",
        type: "choice",
        options: ["A. 36 cm²", "B. 24 cm²", "C. 48 cm²", "D. 16 cm²"],
        answer: "A",
        explanation: "Cạnh hình vuông = 24 / 4 = 6 cm. Diện tích = 6 x 6 = 36 cm²."
    },
    {
        id: 8,
        category: "Tiếng Việt",
        question: "Thành ngữ nào dưới đây nói về tinh thần đoàn kết, giúp đỡ lẫn nhau?",
        type: "choice",
        options: ["A. Nước chảy đá mòn", "B. Lá lành đùm lá rách", "C. Học một biết mười", "D. Đi một ngày đàng"],
        answer: "B",
        explanation: "'Lá lành đùm lá rách' là truyền thống tốt đẹp thể hiện sự sẻ chia, đoàn kết."
    },
    {
        id: 9,
        category: "Khoa Học",
        question: "Nước chuyển từ thể lỏng sang thể khí ở nhiệt độ nào dưới áp suất khí quyển tiêu chuẩn?",
        type: "choice",
        options: ["A. 0 độ C", "B. 50 độ C", "C. 100 độ C", "D. 200 độ C"],
        answer: "C",
        explanation: "Nước sôi và bốc hơi mạnh ở 100 độ C."
    },
    {
        id: 10,
        category: "Đạo Đức & Kỹ Năng",
        question: "Khi qua đường ở nơi có đèn tín hiệu giao thông, người đi bộ được phép sang đường khi đèn tín hiệu người đi bộ bật màu gì?",
        type: "choice",
        options: ["A. Màu đỏ", "B. Màu vàng", "C. Màu xanh", "D. Màu cam"],
        answer: "C",
        explanation: "Đèn xanh dành cho người đi bộ là tín hiệu an toàn để sang đường trên vạch kẻ."
    },
    {
        id: 11,
        category: "Toán Học",
        question: "Một lớp học có 32 học sinh, trong đó số học sinh nữ chiếm 1/2 số học sinh cả lớp. Hỏi lớp đó có bao nhiêu học sinh nam?",
        type: "choice",
        options: ["A. 14 học sinh", "B. 16 học sinh", "C. 18 học sinh", "D. 20 học sinh"],
        answer: "B",
        explanation: "Số học sinh nữ là: 32 x 1/2 = 16. Số học sinh nam là: 32 - 16 = 16 học sinh."
    },
    {
        id: 12,
        category: "Tiếng Việt",
        question: "Cặp từ nào sau đây là cặp từ đồng nghĩa?",
        type: "choice",
        options: ["A. Siêng năng - Cần cù", "B. Dũng cảm - Hèn nhát", "C. Cao - Thấp", "D. Rộng - Hẹp"],
        answer: "A",
        explanation: "'Siêng năng' và 'Cần cù' cùng mang ý nghĩa chăm chỉ làm việc, học tập."
    },
    {
        id: 13,
        category: "Âm Nhạc",
        question: "Ai là tác giả của bài hát 'Quốc ca' (Tiến quân ca) của nước ta?",
        type: "choice",
        options: ["A. Nhạc sĩ Phong Nhã", "B. Nhạc sĩ Văn Cao", "C. Nhạc sĩ Trịnh Công Sơn", "D. Nhạc sĩ Hoàng Long"],
        answer: "B",
        explanation: "Nhạc sĩ Văn Cao sáng tác bài 'Tiến quân ca' vào năm 1944."
    },
    {
        id: 14,
        category: "Địa Lý",
        question: "Đỉnh núi nào được mệnh danh là 'Nóc nhà của Đông Dương' nằm ở Việt Nam?",
        type: "choice",
        options: ["A. Đỉnh Bạch Mộc Lương Tử", "B. Đỉnh Phan Xi Păng (Fansipan)", "C. Đỉnh Langbiang", "D. Đỉnh Bà Nà"],
        answer: "B",
        explanation: "Đỉnh Fansipan cao 3.143 mét là đỉnh núi cao nhất Việt Nam và Đông Dương."
    },
    {
        id: 15,
        category: "Đố Vui Trí Tuệ",
        question: "Có một đàn vịt đi qua cầu, con đi trước hai con, con đi giữa hai con, con đi sau hai con. Hỏi có mấy con vịt?",
        type: "choice",
        options: ["A. 3 con", "B. 4 con", "C. 6 con", "D. 9 con"],
        answer: "A",
        explanation: "Chỉ có 3 con vịt đi theo hàng dọc: con thứ 1 đi trước 2 con sau, con thứ 2 đi giữa, con thứ 3 đi sau 2 con trước."
    }
];

class QuestionManager {
    constructor() {
        this.STORAGE_KEY = "chiec_non_questions_v1";
        this.questions = [];
        this.playedQuestionIds = new Set();
        this.load();
    }

    load() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
            try {
                this.questions = JSON.parse(saved);
            } catch (e) {
                this.resetToDefaults();
            }
        } else {
            this.resetToDefaults();
        }
    }

    save() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.questions));
    }

    resetToDefaults() {
        this.questions = JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
        this.save();
    }

    resetPlayedStatus() {
        this.playedQuestionIds.clear();
    }

    getRemainingQuestions() {
        return this.questions.filter(q => !this.playedQuestionIds.has(q.id));
    }

    markAsPlayed(questionId) {
        this.playedQuestionIds.add(questionId);
    }

    getNextQuestion() {
        const remaining = this.getRemainingQuestions();
        if (remaining.length === 0) {
            // Đã trả lời hết câu hỏi
            return null;
        }
        // Chọn ngẫu nhiên hoặc tuần tự
        const randomIndex = Math.floor(Math.random() * remaining.length);
        const q = remaining[randomIndex];
        return q;
    }

    addQuestion(data) {
        const newId = this.questions.length > 0 ? Math.max(...this.questions.map(q => q.id)) + 1 : 1;
        const q = {
            id: newId,
            category: data.category || "Kiến Thức Chung",
            question: data.question,
            type: data.type || "choice",
            options: data.options || ["A. ", "B. ", "C. ", "D. "],
            answer: data.answer || "A",
            explanation: data.explanation || ""
        };
        this.questions.push(q);
        this.save();
        return q;
    }

    updateQuestion(id, data) {
        const q = this.questions.find(x => x.id === id);
        if (q) {
            Object.assign(q, data);
            this.save();
        }
    }

    deleteQuestion(id) {
        this.questions = this.questions.filter(q => q.id !== id);
        this.save();
    }

    // Xuất file mẫu Excel (.xlsx / .csv)
    downloadTemplate() {
        const headers = ["Chủ đề", "Nội dung câu hỏi", "Lựa chọn A", "Lựa chọn B", "Lựa chọn C", "Lựa chọn D", "Đáp án đúng (A/B/C/D)", "Giải thích chi tiết"];
        const rows = [
            ["Toán Học", "25 + 75 bằng bao nhiêu?", "90", "100", "110", "105", "B", "25 + 75 = 100."],
            ["Tiếng Việt", "Từ nào dưới đây viết đúng chính tả?", "Xinh sắn", "Xinh xắn", "Sinh xắn", "Sinh sắn", "B", "Từ đúng là 'Xinh xắn'."],
            ["Khoa Học", "Cây xanh quang hợp nhả ra khí gì vào ban ngày?", "Khí Các-bô-níc", "Khí Ô-xi", "Khí Ni-tơ", "Khí Hi-đrô", "B", "Quang hợp ban ngày nhả ra khí Ô-xi."],
            ["Lịch Sử", "Hai Bà Trưng cưỡi con vật gì khi ra trận đánh giặc?", "Ngựa", "Voi", "Hổ", "Trâu", "B", "Hai Bà Trưng cưỡi voi chỉ huy quân đội."],
            ["Đố Vui", "Con gì đi thì nằm, đứng cũng nằm, nhưng nằm lại đứng?", "Bàn chân", "Con rắn", "Con cá", "Con gà", "A", "Bàn chân người khi đứng/đi thì tiếp đất nằm ngang, khi nằm thì dựng đứng lên."]
        ];

        if (window.XLSX) {
            const data = [headers, ...rows];
            const ws = XLSX.utils.aoa_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Cau_Hoi_Mau");
            XLSX.writeFile(wb, "Mau_Cau_Hoi_Chiec_Non_Ky_Dieu.xlsx");
        } else {
            // Xuất UTF-8 BOM CSV mở được mượt mà trên Excel
            let csvContent = "\uFEFF" + headers.join(",") + "\n";
            rows.forEach(r => {
                const escaped = r.map(val => `"${String(val).replace(/"/g, '""')}"`);
                csvContent += escaped.join(",") + "\n";
            });
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Mau_Cau_Hoi_Chiec_Non_Ky_Dieu.csv";
            a.click();
            URL.revokeObjectURL(url);
        }
    }

    // Đọc file câu hỏi đưa vào (Excel / CSV)
    importFromFile(file, onComplete) {
        const reader = new FileReader();
        const fileName = file.name.toLowerCase();

        if (fileName.endsWith(".csv")) {
            reader.onload = (e) => {
                try {
                    const text = e.target.result;
                    const lines = text.split(/\r\n|\n/).filter(line => line.trim().length > 0);
                    if (lines.length <= 1) {
                        alert("File không chứa dữ liệu câu hỏi hợp lệ!");
                        return;
                    }
                    // Bỏ dòng header
                    const newQuestions = [];
                    for (let i = 1; i < lines.length; i++) {
                        // Regex tách CSV có hỗ trợ ngoặc kép
                        const cols = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(",");
                        const cleanCols = cols.map(c => c.replace(/^"|"$/g, '').trim());
                        if (cleanCols.length >= 7) {
                            newQuestions.push({
                                id: Date.now() + i,
                                category: cleanCols[0] || "Chung",
                                question: cleanCols[1],
                                type: "choice",
                                options: [
                                    "A. " + cleanCols[2],
                                    "B. " + cleanCols[3],
                                    "C. " + cleanCols[4],
                                    "D. " + cleanCols[5]
                                ],
                                answer: cleanCols[6].toUpperCase().trim(),
                                explanation: cleanCols[7] || ""
                            });
                        }
                    }

                    if (newQuestions.length > 0) {
                        this.questions = newQuestions;
                        this.save();
                        if (onComplete) onComplete(newQuestions.length);
                    } else {
                        alert("Không đọc được câu hỏi nào từ file CSV. Hãy tải file mẫu để kiểm tra cấu trúc!");
                    }
                } catch (err) {
                    alert("Lỗi khi đọc file CSV: " + err.message);
                }
            };
            reader.readAsText(file, "UTF-8");
        } else if (window.XLSX && (fileName.endsWith(".xlsx") || fileName.endsWith(".xls"))) {
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: "array" });
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                    if (rows.length <= 1) {
                        alert("File Excel rỗng hoặc không có dữ liệu!");
                        return;
                    }

                    const newQuestions = [];
                    for (let i = 1; i < rows.length; i++) {
                        const r = rows[i];
                        if (r && r.length >= 7 && r[1]) {
                            newQuestions.push({
                                id: Date.now() + i,
                                category: String(r[0] || "Chung").trim(),
                                question: String(r[1]).trim(),
                                type: "choice",
                                options: [
                                    "A. " + String(r[2] || "").trim(),
                                    "B. " + String(r[3] || "").trim(),
                                    "C. " + String(r[4] || "").trim(),
                                    "D. " + String(r[5] || "").trim()
                                ],
                                answer: String(r[6] || "A").toUpperCase().trim(),
                                explanation: String(r[7] || "").trim()
                            });
                        }
                    }

                    if (newQuestions.length > 0) {
                        this.questions = newQuestions;
                        this.save();
                        if (onComplete) onComplete(newQuestions.length);
                    } else {
                        alert("Không tìm thấy hàng câu hỏi hợp lệ trong bảng tính. Vui lòng làm theo file mẫu!");
                    }
                } catch (err) {
                    alert("Lỗi khi xử lý file Excel: " + err.message);
                }
            };
            reader.readAsArrayBuffer(file);
        } else {
            alert("Vui lòng chọn file định dạng .xlsx, .xls hoặc .csv!");
        }
    }
}

window.questionMgr = new QuestionManager();
