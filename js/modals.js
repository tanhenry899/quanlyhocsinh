/**
 * Quản lý các cửa sổ Modal (Danh sách học sinh, Ngân hàng câu hỏi, Lịch sử, Cài đặt)
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Cửa sổ Quản Lý Học Sinh
    const modalStudents = document.getElementById("modal-students");
    const btnOpenStudents = document.getElementById("btn-open-students");
    const btnCloseStudents = document.getElementById("btn-close-students");
    const studentsListContainer = document.getElementById("students-edit-list");
    const btnSelectAll = document.getElementById("btn-select-all-students");
    const btnDeselectAll = document.getElementById("btn-deselect-all-students");
    const btnResetScores = document.getElementById("btn-reset-all-scores");
    const btnAddNewStudent = document.getElementById("btn-add-student");

    if (btnOpenStudents) {
        btnOpenStudents.addEventListener("click", () => {
            renderStudentEditorList();
            modalStudents.style.display = "flex";
        });
    }

    if (btnCloseStudents) {
        btnCloseStudents.addEventListener("click", () => {
            modalStudents.style.display = "none";
            window.game.renderAudienceSeats();
            window.game.updateStatsBar();
        });
    }

    function renderStudentEditorList() {
        if (!studentsListContainer) return;
        studentsListContainer.innerHTML = "";
        const students = window.studentMgr.students;

        students.forEach((s) => {
            const row = document.createElement("div");
            row.className = "student-edit-row";

            // Tạo danh sách 20 bộ đồng phục cho select
            let uniformOptions = "";
            UNIFORM_STYLES.forEach(u => {
                uniformOptions += `<option value="${u.id}" ${s.uniform === u.id ? 'selected' : ''}>${u.badge} ${u.id}. ${u.name}</option>`;
            });

            row.innerHTML = `
                <div class="row-checkbox">
                    <input type="checkbox" id="chk-student-${s.id}" ${s.active ? 'checked' : ''}>
                </div>
                <div class="row-avatar" id="edit-avatar-${s.id}">
                    ${window.studentMgr.renderAvatarSVG(s, 44)}
                </div>
                <div class="row-name">
                    <input type="text" class="input-student-name" id="name-student-${s.id}" value="${s.name}" placeholder="Tên học sinh...">
                </div>
                <div class="row-gender">
                    <select class="select-gender" id="gender-student-${s.id}">
                        <option value="nam" ${s.gender === 'nam' ? 'selected' : ''}>👦 Nam</option>
                        <option value="nu" ${s.gender === 'nu' ? 'selected' : ''}>👧 Nữ</option>
                    </select>
                </div>
                <div class="row-uniform">
                    <select class="select-uniform" id="uniform-student-${s.id}">
                        ${uniformOptions}
                    </select>
                </div>
                <div class="row-score">
                    <input type="number" class="input-score" id="score-student-${s.id}" value="${s.score}" min="0" step="10"> điểm
                </div>
                <div class="row-actions">
                    <button class="btn-del-student" title="Xóa học sinh" data-id="${s.id}">🗑️</button>
                </div>
            `;

            // Bắt sự kiện thay đổi
            const chk = row.querySelector(`#chk-student-${s.id}`);
            const inputName = row.querySelector(`#name-student-${s.id}`);
            const selGender = row.querySelector(`#gender-student-${s.id}`);
            const selUniform = row.querySelector(`#uniform-student-${s.id}`);
            const inputScore = row.querySelector(`#score-student-${s.id}`);
            const btnDel = row.querySelector(".btn-del-student");

            chk.addEventListener("change", () => {
                window.studentMgr.setStudentActive(s.id, chk.checked);
            });

            inputName.addEventListener("input", () => {
                window.studentMgr.updateStudent(s.id, { name: inputName.value });
            });

            selGender.addEventListener("change", () => {
                window.studentMgr.updateStudent(s.id, { gender: selGender.value });
                const avatarWrap = row.querySelector(`#edit-avatar-${s.id}`);
                if (avatarWrap) avatarWrap.innerHTML = window.studentMgr.renderAvatarSVG(s, 44);
            });

            selUniform.addEventListener("change", () => {
                window.studentMgr.updateStudent(s.id, { uniform: parseInt(selUniform.value) });
                const avatarWrap = row.querySelector(`#edit-avatar-${s.id}`);
                if (avatarWrap) avatarWrap.innerHTML = window.studentMgr.renderAvatarSVG(s, 44);
            });

            inputScore.addEventListener("change", () => {
                window.studentMgr.updateStudent(s.id, { score: parseInt(inputScore.value) || 0 });
            });

            btnDel.addEventListener("click", () => {
                if (confirm(`Bạn có chắc chắn muốn xóa học sinh "${s.name}"?`)) {
                    window.studentMgr.removeStudent(s.id);
                    renderStudentEditorList();
                }
            });

            studentsListContainer.appendChild(row);
        });
    }

    if (btnSelectAll) {
        btnSelectAll.addEventListener("click", () => {
            window.studentMgr.students.forEach(s => s.active = true);
            window.studentMgr.save();
            renderStudentEditorList();
        });
    }

    if (btnDeselectAll) {
        btnDeselectAll.addEventListener("click", () => {
            window.studentMgr.students.forEach(s => s.active = false);
            window.studentMgr.save();
            renderStudentEditorList();
        });
    }

    if (btnResetScores) {
        btnResetScores.addEventListener("click", () => {
            if (confirm("Bạn có chắc chắn muốn đặt lại điểm số và lượt chơi của toàn bộ học sinh về 0?")) {
                window.studentMgr.resetScores();
                renderStudentEditorList();
                window.game.renderAudienceSeats();
            }
        });
    }

    if (btnAddNewStudent) {
        btnAddNewStudent.addEventListener("click", () => {
            const name = prompt("Nhập họ và tên học sinh mới:");
            if (name && name.trim()) {
                window.studentMgr.addStudent(name);
                renderStudentEditorList();
            }
        });
    }

    // 2. Cửa sổ Quản Lý Câu Hỏi
    const modalQuestions = document.getElementById("modal-questions");
    const btnOpenQuestions = document.getElementById("btn-open-questions");
    const btnCloseQuestions = document.getElementById("btn-close-questions");
    const questionsTableBody = document.getElementById("questions-table-body");
    const btnDownloadTemplate = document.getElementById("btn-download-template");
    const inputQuestionFile = document.getElementById("input-question-file");
    const btnAddQuestionManual = document.getElementById("btn-add-question-manual");
    const btnResetQuestions = document.getElementById("btn-reset-questions");

    if (btnOpenQuestions) {
        btnOpenQuestions.addEventListener("click", () => {
            renderQuestionsList();
            modalQuestions.style.display = "flex";
        });
    }

    if (btnCloseQuestions) {
        btnCloseQuestions.addEventListener("click", () => {
            modalQuestions.style.display = "none";
            window.game.updateStatsBar();
        });
    }

    function renderQuestionsList() {
        if (!questionsTableBody) return;
        questionsTableBody.innerHTML = "";
        const questions = window.questionMgr.questions;

        questions.forEach((q, idx) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${idx + 1}</td>
                <td><span class="badge-category">${q.category}</span></td>
                <td class="font-medium">${q.question}</td>
                <td><span class="badge-correct-answer">${q.answer}</span></td>
                <td class="text-xs text-slate-400">${q.options ? q.options.join(" | ") : ''}</td>
                <td>
                    <button class="btn-del-question" data-id="${q.id}">🗑️</button>
                </td>
            `;

            tr.querySelector(".btn-del-question").addEventListener("click", () => {
                if (confirm("Xóa câu hỏi này?")) {
                    window.questionMgr.deleteQuestion(q.id);
                    renderQuestionsList();
                }
            });

            questionsTableBody.appendChild(tr);
        });
    }

    if (btnDownloadTemplate) {
        btnDownloadTemplate.addEventListener("click", () => {
            window.questionMgr.downloadTemplate();
        });
    }

    if (inputQuestionFile) {
        inputQuestionFile.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                window.questionMgr.importFromFile(file, (count) => {
                    alert(`Đã nạp thành công ${count} câu hỏi vào trò chơi!`);
                    renderQuestionsList();
                    window.game.updateStatsBar();
                });
            }
        });
    }

    if (btnResetQuestions) {
        btnResetQuestions.addEventListener("click", () => {
            if (confirm("Khôi phục danh sách 15 câu hỏi tiểu học chuẩn mặc định?")) {
                window.questionMgr.resetToDefaults();
                renderQuestionsList();
            }
        });
    }

    if (btnAddQuestionManual) {
        btnAddQuestionManual.addEventListener("click", () => {
            const qText = prompt("Nhập nội dung câu hỏi:");
            if (!qText) return;
            const cat = prompt("Nhập chủ đề (Toán Học, Tiếng Việt, Khoa Học...):", "Toán Học");
            const a = prompt("Phương án A:", "");
            const b = prompt("Phương án B:", "");
            const c = prompt("Phương án C:", "");
            const d = prompt("Phương án D:", "");
            const ans = prompt("Đáp án đúng (A/B/C/D):", "A");

            window.questionMgr.addQuestion({
                category: cat,
                question: qText,
                options: ["A. " + a, "B. " + b, "C. " + c, "D. " + d],
                answer: ans.toUpperCase()
            });
            renderQuestionsList();
        });
    }

    // 3. Cửa sổ Lịch Sử Buổi Thi
    const modalHistory = document.getElementById("modal-history");
    const btnOpenHistory = document.getElementById("btn-open-history");
    const btnCloseHistory = document.getElementById("btn-close-history");
    const historyListContainer = document.getElementById("history-sessions-list");
    const btnClearHistory = document.getElementById("btn-clear-history");

    if (btnOpenHistory) {
        btnOpenHistory.addEventListener("click", () => {
            renderHistoryList();
            modalHistory.style.display = "flex";
        });
    }

    if (btnCloseHistory) {
        btnCloseHistory.addEventListener("click", () => {
            modalHistory.style.display = "none";
        });
    }

    function renderHistoryList() {
        if (!historyListContainer) return;
        historyListContainer.innerHTML = "";
        const sessions = window.historyMgr.getSessions();

        if (sessions.length === 0) {
            historyListContainer.innerHTML = `<div class="empty-state">Chưa có lịch sử buổi thi nào được lưu. Hãy thi đấu và tổng kết để ghi nhận!</div>`;
            return;
        }

        sessions.forEach(ses => {
            const card = document.createElement("div");
            card.className = "history-card";
            card.innerHTML = `
                <div class="history-card-header">
                    <div class="history-title">📅 ${ses.sessionName} (${ses.className})</div>
                    <div class="history-date">${ses.date} lúc ${ses.time}</div>
                </div>
                <div class="history-body">
                    <div>🏆 Quán quân: <b>${ses.winner ? ses.winner.name + ' (' + ses.winner.score + ' điểm)' : 'Chưa có'}</b></div>
                    <div>👥 Thí sinh: ${ses.participantsCount} học sinh | ❓ Câu hỏi: ${ses.questionsCount} câu</div>
                </div>
                <div class="history-actions">
                    <button class="btn-action-small btn-export-excel" data-id="${ses.id}">📊 Xuất Excel</button>
                    <button class="btn-action-small btn-del-session text-rose-400" data-id="${ses.id}">🗑️ Xóa</button>
                </div>
            `;

            card.querySelector(".btn-export-excel").addEventListener("click", () => {
                window.historyMgr.exportExcelReport(ses);
            });

            card.querySelector(".btn-del-session").addEventListener("click", () => {
                if (confirm("Xóa lịch sử buổi thi này?")) {
                    window.historyMgr.deleteSession(ses.id);
                    renderHistoryList();
                }
            });

            historyListContainer.appendChild(card);
        });
    }

    if (btnClearHistory) {
        btnClearHistory.addEventListener("click", () => {
            if (confirm("Xóa toàn bộ lịch sử các buổi thi đã lưu?")) {
                window.historyMgr.clearAll();
                renderHistoryList();
            }
        });
    }

    // 4. Nút Xuất Excel tại Bảng Vàng & Đóng Bảng Vàng
    const btnExportFromLeaderboard = document.getElementById("btn-export-excel-report");
    if (btnExportFromLeaderboard) {
        btnExportFromLeaderboard.addEventListener("click", () => {
            window.historyMgr.exportExcelReport(window.studentMgr.students);
        });
    }

    const btnCloseLeaderboard = document.getElementById("btn-close-leaderboard");
    if (btnCloseLeaderboard) {
        btnCloseLeaderboard.addEventListener("click", () => {
            document.getElementById("leaderboard-modal").style.display = "none";
            if (window.fireworks) window.fireworks.stop();
        });
    }
});
