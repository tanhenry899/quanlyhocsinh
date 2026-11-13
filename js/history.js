/**
 * Quản lý lịch sử các buổi thi & Xuất báo cáo Excel cho giáo viên
 */

class HistoryManager {
    constructor() {
        this.STORAGE_KEY = "chiec_non_history_v1";
        this.sessions = [];
        this.load();
    }

    load() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
            try {
                this.sessions = JSON.parse(saved);
            } catch (e) {
                this.sessions = [];
            }
        }
    }

    save() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.sessions));
    }

    // Lưu phiên thi hiện tại
    saveSession(sessionName, className, teacherName, studentsList, questionsPlayedCount) {
        const sortedStudents = [...studentsList].sort((a, b) => b.score - a.score || b.correctCount - a.correctCount);
        const topWinner = sortedStudents[0];

        const session = {
            id: "SES_" + Date.now(),
            date: new Date().toLocaleDateString("vi-VN"),
            time: new Date().toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }),
            sessionName: sessionName || "Ôn tập kiến thức",
            className: className || "Lớp Tiểu Học",
            teacherName: teacherName || "Giáo Viên",
            questionsCount: questionsPlayedCount,
            participantsCount: studentsList.filter(s => s.active).length,
            winner: topWinner ? { name: topWinner.name, score: topWinner.score, correct: topWinner.correctCount } : null,
            students: sortedStudents.map((s, index) => ({
                rank: index + 1,
                id: s.id,
                name: s.name,
                gender: s.gender === 'nam' ? "Nam" : "Nữ",
                uniformId: s.uniform,
                score: s.score,
                correctCount: s.correctCount,
                wrongCount: s.wrongCount,
                turnsTaken: s.turnsTaken,
                active: s.active
            }))
        };

        this.sessions.unshift(session);
        // Lưu tối đa 50 buổi thi gần nhất
        if (this.sessions.length > 50) {
            this.sessions.pop();
        }
        this.save();
        return session;
    }

    getSessions() {
        return this.sessions;
    }

    deleteSession(sessionId) {
        this.sessions = this.sessions.filter(s => s.id !== sessionId);
        this.save();
    }

    clearAll() {
        this.sessions = [];
        this.save();
    }

    // Xuất báo cáo Excel chuyên nghiệp cho giáo viên (.xlsx hoặc UTF-8 BOM CSV)
    exportExcelReport(sessionOrStudents, meta = {}) {
        let students = [];
        let sessionInfo = {
            title: meta.title || "Báo Cáo Kết Quả Thi Đua - Chiếc Nón Kỳ Diệu",
            className: meta.className || "Lớp Học",
            teacher: meta.teacher || "Giáo Viên Chủ Nhiệm",
            date: meta.date || new Date().toLocaleDateString("vi-VN")
        };

        if (sessionOrStudents.students) {
            // Là một đối tượng session lưu trong lịch sử
            students = sessionOrStudents.students;
            sessionInfo.title = sessionOrStudents.sessionName;
            sessionInfo.className = sessionOrStudents.className;
            sessionInfo.teacher = sessionOrStudents.teacherName;
            sessionInfo.date = sessionOrStudents.date + " " + sessionOrStudents.time;
        } else {
            // Danh sách học sinh hiện tại
            students = [...sessionOrStudents]
                .filter(s => s.active)
                .sort((a, b) => b.score - a.score || b.correctCount - a.correctCount)
                .map((s, idx) => ({
                    rank: idx + 1,
                    name: s.name,
                    gender: s.gender === 'nam' ? "Nam" : "Nữ",
                    score: s.score,
                    correctCount: s.correctCount,
                    wrongCount: s.wrongCount,
                    turnsTaken: s.turnsTaken || (s.correctCount + s.wrongCount)
                }));
        }

        const headers = [
            "Hạng",
            "Họ và Tên Học Sinh",
            "Giới Tính",
            "Tổng Điểm Đạt Được",
            "Số Câu Trả Lời Đúng",
            "Số Câu Trả Lời Sai",
            "Tổng Số Lượt Tham Gia",
            "Tỷ Lệ Trả Lời Đúng",
            "Danh Hiệu / Khen Thưởng"
        ];

        const rows = students.map((s, i) => {
            const total = s.turnsTaken || (s.correctCount + s.wrongCount) || 1;
            const accuracy = total > 0 ? Math.round((s.correctCount / total) * 100) + "%" : "0%";
            let award = "Tích Cực";
            if (s.rank === 1) award = "🏆 QUÁN QUÂN - THỦ LĨNH TRI THỨC";
            else if (s.rank === 2) award = "🥈 Á QUÂN 1 - XUẤT SẮC";
            else if (s.rank === 3) award = "🥉 Á QUÂN 2 - TIÊU BIỂU";
            else if (s.score >= 100) award = "Học Sinh Giỏi Vượt Trội";
            else if (s.score >= 50) award = "Học Sinh Khá Tiêu Biểu";

            return [
                s.rank || (i + 1),
                s.name,
                s.gender,
                s.score,
                s.correctCount,
                s.wrongCount,
                s.turnsTaken || (s.correctCount + s.wrongCount),
                accuracy,
                award
            ];
        });

        const safeFilename = `Bao_Cao_Chiec_Non_Ky_Dieu_${sessionInfo.className.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}`;

        if (window.XLSX) {
            const summaryRows = [
                ["TRƯỜNG TIỂU HỌC - BẢNG ĐIỂM GAMESHOW CHIẾC NÓN KỲ DIỆU"],
                ["Chủ Đề Buổi Học:", sessionInfo.title],
                ["Lớp:", sessionInfo.className, "Giáo Viên:", sessionInfo.teacher],
                ["Thời Gian:", sessionInfo.date, "Tổng Số Thí Sinh:", students.length],
                [], // Dòng trống
                headers,
                ...rows
            ];

            const ws = XLSX.utils.aoa_to_sheet(summaryRows);

            // Căn chỉnh độ rộng các cột
            ws['!cols'] = [
                { wch: 8 },  // Hạng
                { wch: 26 }, // Tên
                { wch: 12 }, // Giới tính
                { wch: 18 }, // Điểm
                { wch: 18 }, // Đúng
                { wch: 18 }, // Sai
                { wch: 20 }, // Lượt
                { wch: 18 }, // Tỷ lệ
                { wch: 34 }  // Danh hiệu
            ];

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Bang_Diem_Chi_Tiet");
            XLSX.writeFile(wb, `${safeFilename}.xlsx`);
        } else {
            // Xuất UTF-8 BOM CSV mở được mượt mà trên Microsoft Excel
            let csv = "\uFEFF";
            csv += `"BẢNG ĐIỂM GAMESHOW CHIẾC NÓN KỲ DIỆU"\n`;
            csv += `"Buổi thi: ${sessionInfo.title}","Lớp: ${sessionInfo.className}","Giáo viên: ${sessionInfo.teacher}","Ngày: ${sessionInfo.date}"\n\n`;
            csv += headers.map(h => `"${h}"`).join(",") + "\n";
            rows.forEach(r => {
                csv += r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",") + "\n";
            });

            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${safeFilename}.csv`;
            a.click();
            URL.revokeObjectURL(url);
        }
    }
}

window.historyMgr = new HistoryManager();
