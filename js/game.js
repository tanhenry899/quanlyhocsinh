/**
 * Game Controller - Điều khiển toàn bộ logic Gameshow Chiếc Nón Kỳ Diệu Tiểu Học
 */

class GameEngine {
    constructor() {
        this.wheel = null;
        this.currentQuestion = null;
        this.currentStudent = null;
        this.currentAttempt = 1; // 1 hoặc 2 (mỗi câu tối đa 2 lần trả lời)
        this.currentPoints = 50;
        this.multiplier = 1;
        this.timerSeconds = 30;
        this.timerRemaining = 30;
        this.timerInterval = null;
        this.isSuspenseRunning = false;
        this.isGameActive = false;
        this.questionsPlayedCount = 0;
        this.advanceTimeout = null;
        this.isAdvancing = false;
        this.autoSpinWheel = true;

        this.init();
    }

    init() {
        // Khởi tạo vòng quay canvas
        window.addEventListener("DOMContentLoaded", () => {
            this.wheel = new MagicWheel("wheel-canvas");
            this.renderAudienceSeats();
            this.bindEvents();
            this.updateStatsBar();
        });
    }

    bindEvents() {
        // Nút mở màn / Bắt đầu lượt mới
        const btnNextTurn = document.getElementById("btn-next-turn");
        if (btnNextTurn) {
            btnNextTurn.addEventListener("click", () => this.startNewTurn());
        }

        // Nút Quay Nón
        const btnSpinWheel = document.getElementById("btn-spin-wheel");
        if (btnSpinWheel) {
            btnSpinWheel.addEventListener("click", () => this.spinWheelAction());
        }

        // Nút Bắt đầu đếm ngược 30s
        const btnStartTimer = document.getElementById("btn-start-timer");
        if (btnStartTimer) {
            btnStartTimer.addEventListener("click", () => this.startCountdown());
        }

        // Nút Tạm dừng đếm ngược
        const btnPauseTimer = document.getElementById("btn-pause-timer");
        if (btnPauseTimer) {
            btnPauseTimer.addEventListener("click", () => this.pauseCountdown());
        }

        // Nút Hồi hộp & Công bố đáp án
        const btnRevealAnswer = document.getElementById("btn-reveal-answer");
        if (btnRevealAnswer) {
            btnRevealAnswer.addEventListener("click", () => this.triggerSuspenseReveal());
        }

        // Nút Giáo viên chấm: Đúng (Cộng điểm & tự động chuyển câu tiếp theo)
        const btnMarkCorrect = document.getElementById("btn-mark-correct");
        if (btnMarkCorrect) {
            btnMarkCorrect.addEventListener("click", () => this.handleAnswerResult(true));
        }

        // Nút Giáo viên chấm: Trừ điểm & tự động chuyển câu tiếp theo
        const btnMarkDeduct = document.getElementById("btn-mark-deduct");
        if (btnMarkDeduct) {
            btnMarkDeduct.addEventListener("click", () => this.handleDeductPointsAction());
        }

        // Nút Giáo viên chấm: Sai (Cứu trợ lần 2)
        const btnMarkWrong = document.getElementById("btn-mark-wrong");
        if (btnMarkWrong) {
            btnMarkWrong.addEventListener("click", () => this.handleAnswerResult(false));
        }

        // Nút Toàn màn hình 16:9
        const btnFullscreen = document.getElementById("btn-fullscreen");
        if (btnFullscreen) {
            btnFullscreen.addEventListener("click", () => this.toggleFullscreen());
        }

        // Nút Bảng Vàng Tổng Kết
        const btnLeaderboard = document.getElementById("btn-leaderboard");
        if (btnLeaderboard) {
            btnLeaderboard.addEventListener("click", () => this.showLeaderboard());
        }

        // Nút Nhạc Hiệu Intro
        const btnPlayIntro = document.getElementById("btn-play-intro");
        if (btnPlayIntro) {
            btnPlayIntro.addEventListener("click", () => {
                if (window.sound) window.sound.playIntro();
                if (window.mc) window.mc.greetClass();
            });
        }

        // Nút Bật/Tắt âm thanh
        const btnMute = document.getElementById("btn-mute-sound");
        if (btnMute) {
            btnMute.addEventListener("click", () => {
                if (window.sound) {
                    const isMuted = window.sound.toggleMute();
                    btnMute.innerHTML = isMuted ? "🔇 Bật Âm" : "🔊 Âm Thanh";
                    btnMute.classList.toggle("btn-active", isMuted);
                }
            });
        }

        // Bàn phím tắt hỗ trợ giáo viên
        document.addEventListener("keydown", (e) => {
            // Chỉ bắt khi không ở trong ô nhập liệu
            if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

            if (e.code === "Space") {
                e.preventDefault();
                if (!this.wheel.isSpinning) this.spinWheelAction();
            } else if (e.code === "KeyR") {
                this.triggerSuspenseReveal();
            } else if (e.code === "KeyT") {
                this.startCountdown();
            } else if (e.key === "1" || e.key === "a" || e.key === "A") {
                this.selectOption("A");
            } else if (e.key === "2" || e.key === "b" || e.key === "B") {
                this.selectOption("B");
            } else if (e.key === "3" || e.key === "c" || e.key === "C") {
                this.selectOption("C");
            } else if (e.key === "4" || e.key === "d" || e.key === "D") {
                this.selectOption("D");
            } else if (e.key === "+" || e.key === "=" || e.code === "KeyY") {
                this.handleAnswerResult(true);
            } else if (e.key === "-" || e.key === "_" || e.code === "KeyN") {
                this.handleDeductPointsAction();
            }
        });
    }

    // Hiển thị 30 bàn học sinh dưới khán đài
    renderAudienceSeats() {
        const container = document.getElementById("audience-grid");
        if (!container) return;

        container.innerHTML = "";
        const students = window.studentMgr.students;

        students.forEach(student => {
            const seat = document.createElement("div");
            seat.className = `student-seat ${student.active ? 'active-seat' : 'inactive-seat'} ${this.currentStudent && this.currentStudent.id === student.id ? 'selected-seat' : ''}`;
            seat.id = `seat-student-${student.id}`;

            const uni = UNIFORM_STYLES.find(u => u.id === student.uniform) || UNIFORM_STYLES[0];
            const avatarSvg = window.studentMgr.renderAvatarSVG(student, 54);

            seat.innerHTML = `
                <div class="seat-badge-gender ${student.gender === 'nam' ? 'badge-boy' : 'badge-girl'}">
                    ${student.gender === 'nam' ? '👦 Nam' : '👧 Nữ'}
                </div>
                <div class="student-avatar-wrap">
                    ${avatarSvg}
                    <div class="spotlight-cone"></div>
                </div>
                <div class="student-info">
                    <div class="student-name" title="${student.name}">${student.name}</div>
                    <div class="student-score-box">
                        <span class="score-icon">🪙</span>
                        <span class="score-num" id="seat-score-${student.id}">${student.score}</span> điểm
                    </div>
                </div>
                ${student.extraTurns > 0 ? `<div class="extra-turns-badge">+${student.extraTurns} lượt</div>` : ''}
                ${!student.active ? `<div class="absent-tag">Vắng mặt</div>` : ''}
            `;

            // Cho phép giáo viên click vào bàn để chọn nhanh học sinh
            seat.addEventListener("click", () => {
                if (student.active) {
                    this.setCurrentStudent(student);
                }
            });

            container.appendChild(seat);
        });
    }

    updateStatsBar() {
        const activeCount = window.studentMgr.getActiveStudents().length;
        const totalCount = window.studentMgr.students.length;
        const remainingQ = window.questionMgr.getRemainingQuestions().length;

        const statEl = document.getElementById("game-stats-pill");
        if (statEl) {
            statEl.innerHTML = `👥 Thí sinh: <b>${activeCount}/${totalCount}</b> &nbsp;|&nbsp; ❓ Còn lại: <b>${remainingQ} câu</b>`;
        }
        const badgeEl = document.getElementById("active-students-badge");
        if (badgeEl) {
            badgeEl.textContent = `${activeCount}`;
        }
    }

    // Bắt đầu một lượt thi mới (Lấy câu hỏi mới & Quay người ngẫu nhiên)
    startNewTurn() {
        this.pauseCountdown();
        this.currentAttempt = 1;
        this.multiplier = 1;

        // 1. Lấy câu hỏi tiếp theo
        const q = window.questionMgr.getNextQuestion();
        if (!q) {
            alert("Đã hoàn thành tất cả các câu hỏi trong ngân hàng câu hỏi! Chuyển sang phần tổng kết trao giải.");
            this.showLeaderboard();
            return;
        }

        this.currentQuestion = q;
        this.questionsPlayedCount++;
        this.displayQuestion(q);

        // 2. Quay chọn ngẫu nhiên học sinh
        this.selectRandomStudentWithSpotlight();
    }

    displayQuestion(q) {
        const catEl = document.getElementById("question-category");
        const titleEl = document.getElementById("question-text");
        const optionsEl = document.getElementById("question-options");
        const attemptEl = document.getElementById("turn-attempt-indicator");
        const expEl = document.getElementById("question-explanation");

        if (catEl) catEl.textContent = `Chủ Đề: ${q.category}`;
        if (titleEl) titleEl.textContent = q.question;
        if (expEl) {
            expEl.textContent = "";
            expEl.style.display = "none";
        }

        if (attemptEl) {
            attemptEl.innerHTML = `<span class="badge-attempt attempt-1">Lần Trả Lời: 1 / 2</span>`;
        }

        if (optionsEl) {
            optionsEl.innerHTML = "";
            q.options.forEach((opt, idx) => {
                const optKey = ["A", "B", "C", "D"][idx];
                const btn = document.createElement("button");
                btn.className = "question-option-btn";
                btn.id = `opt-btn-${optKey}`;
                btn.innerHTML = `<span class="opt-key">${optKey}</span> <span class="opt-text">${opt.replace(/^[A-D]\.\s*/, '')}</span>`;
                btn.addEventListener("click", () => this.selectOption(optKey));
                optionsEl.appendChild(btn);
            });
        }

        this.updatePointsDisplay();
    }

    // Hiệu ứng đèn sân khấu quét qua các học sinh để chọn ngẫu nhiên
    selectRandomStudentWithSpotlight(excludeStudentId = null) {
        let activeCandidates = window.studentMgr.getActiveStudents();
        if (excludeStudentId) {
            activeCandidates = activeCandidates.filter(s => s.id !== excludeStudentId);
        }

        if (activeCandidates.length === 0) {
            alert("Không còn thí sinh nào khả dụng!");
            return;
        }

        // Chạy animation quét đèn qua các ghế
        let step = 0;
        const totalSteps = 22;
        let delay = 60;

        const scanLoop = () => {
            // Bỏ highlight ghế cũ
            document.querySelectorAll(".student-seat").forEach(s => s.classList.remove("scanning-seat", "selected-seat"));

            const randomIndex = Math.floor(Math.random() * activeCandidates.length);
            const candidate = activeCandidates[randomIndex];
            const seatEl = document.getElementById(`seat-student-${candidate.id}`);

            if (seatEl) {
                seatEl.classList.add("scanning-seat");
            }

            if (window.sound) {
                window.sound.playSpotlightScan();
            }

            step++;
            if (step < totalSteps) {
                delay += 12; // Chậm dần tạo độ hồi hộp cực cao
                setTimeout(scanLoop, delay);
            } else {
                // Khóa mục tiêu trúng thí sinh may mắn!
                this.setCurrentStudent(candidate);
                if (window.sound) window.sound.playLockOn();
                if (window.mc) {
                    window.mc.announceTurn(candidate.name, this.currentAttempt);
                }

                // Tự động quay Chiếc Nón Kỳ Diệu chọn điểm số tiếp theo
                setTimeout(() => {
                    if (this.autoSpinWheel && !this.wheel.isSpinning) {
                        this.spinWheelAction();
                    }
                }, 1600);
            }
        };

        scanLoop();
    }

    setCurrentStudent(student) {
        this.currentStudent = student;

        // Cập nhật giao diện ghế được chọn
        document.querySelectorAll(".student-seat").forEach(s => {
            s.classList.remove("scanning-seat", "selected-seat");
        });

        const chosenSeat = document.getElementById(`seat-student-${student.id}`);
        if (chosenSeat) {
            chosenSeat.classList.add("selected-seat");
            chosenSeat.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Cập nhật thẻ thí sinh trên sân khấu
        const stageStudentName = document.getElementById("stage-student-name");
        const stageStudentAvatar = document.getElementById("stage-student-avatar");
        const stageStudentScore = document.getElementById("stage-student-score");

        if (stageStudentName) stageStudentName.textContent = student.name;
        if (stageStudentAvatar) stageStudentAvatar.innerHTML = window.studentMgr.renderAvatarSVG(student, 60);
        if (stageStudentScore) stageStudentScore.textContent = `${student.score} điểm`;
    }

    // Hành động quay nón kỳ diệu
    spinWheelAction() {
        if (!this.wheel || this.wheel.isSpinning) return;

        const spinBtn = document.getElementById("btn-spin-wheel");
        if (spinBtn) spinBtn.disabled = true;

        this.wheel.spin(null, (winningSlice) => {
            if (spinBtn) spinBtn.disabled = false;
            this.handleWheelResult(winningSlice);
        });
    }

    handleWheelResult(slice) {
        const wheelResultBadge = document.getElementById("wheel-result-badge");
        if (wheelResultBadge) {
            wheelResultBadge.innerHTML = `<span class="badge-slice" style="background-color: ${slice.color}; color: ${slice.text}">${slice.label}</span>`;
        }

        if (slice.type === "points") {
            this.currentPoints = slice.value * this.multiplier;
            this.updatePointsDisplay();
            if (window.sound) window.sound.playCoinGain();
        } else if (slice.type === "lose") {
            // Mất lượt!
            if (window.sound) window.sound.playWrong();
            if (window.mc) {
                window.mc.speak(`Ôi tiếc quá! Ô nón rơi vào ô Mất Lượt! Quyền trả lời sẽ chuyển cho bạn khác!`);
            }
            setTimeout(() => {
                this.selectRandomStudentWithSpotlight(this.currentStudent ? this.currentStudent.id : null);
            }, 2500);
        } else if (slice.type === "extra") {
            // Thêm lượt!
            if (this.currentStudent) {
                window.studentMgr.addExtraTurn(this.currentStudent.id);
                this.renderAudienceSeats();
            }
            if (window.sound) window.sound.playCorrect();
            if (window.mc) {
                window.mc.speak(`Tuyệt vời! Bạn nhận được thêm một lượt cứu nguy đặc biệt!`);
            }
            this.currentPoints = 50 * this.multiplier;
            this.updatePointsDisplay();
        } else if (slice.type === "double") {
            // Nhân đôi điểm!
            this.multiplier = 2;
            this.currentPoints = 100;
            this.updatePointsDisplay();
            if (window.sound) window.sound.playCorrect();
            if (window.mc) {
                window.mc.speak(`Woa! Nhân đôi điểm số cho câu hỏi này! Cố lên nhé!`);
            }
        } else if (slice.type === "lucky") {
            // May mắn (+50 điểm ngay lập tức)
            if (this.currentStudent) {
                window.studentMgr.addScore(this.currentStudent.id, 50);
                this.triggerCoinFlyAnimation(50);
                this.renderAudienceSeats();
            }
            if (window.sound) window.sound.playCorrect();
            if (window.mc) {
                window.mc.speak(`May mắn gõ cửa! Bạn được cộng ngay 50 điểm thưởng!`);
            }
            this.currentPoints = 50;
            this.updatePointsDisplay();
        }

        // Đọc câu hỏi sau khi vòng quay dừng (trừ trường hợp mất lượt)
        if (slice.type !== "lose") {
            setTimeout(() => {
                if (this.currentQuestion && window.mc) {
                    window.mc.speak(`Câu hỏi: ${this.currentQuestion.question}`);
                }
            }, 800);
        }
    }

    updatePointsDisplay() {
        const ptEl = document.getElementById("current-points-value");
        if (ptEl) {
            ptEl.textContent = `${this.currentPoints} Điểm`;
        }
    }

    // Bắt đầu đếm ngược 30 giây
    startCountdown() {
        this.pauseCountdown();
        this.timerRemaining = this.timerSeconds;
        this.updateTimerDisplay();

        const timerRing = document.getElementById("timer-progress-ring");
        const circumference = 2 * Math.PI * 45; // r=45

        this.timerInterval = setInterval(() => {
            this.timerRemaining--;
            this.updateTimerDisplay();

            if (timerRing) {
                const offset = circumference - (this.timerRemaining / this.timerSeconds) * circumference;
                timerRing.style.strokeDashoffset = offset;
            }

            // Âm thanh tích tắc
            if (window.sound) {
                const isUrgent = this.timerRemaining <= 5;
                window.sound.playTimerTick(isUrgent);
            }

            if (this.timerRemaining <= 0) {
                this.pauseCountdown();
                if (window.sound) window.sound.playWrong();
                if (window.mc) window.mc.speak("Hết giờ rồi!");
            }
        }, 1000);
    }

    pauseCountdown() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimerDisplay() {
        const timerNum = document.getElementById("timer-number");
        if (timerNum) {
            timerNum.textContent = this.timerRemaining;
            if (this.timerRemaining <= 5) {
                timerNum.classList.add("timer-urgent");
            } else {
                timerNum.classList.remove("timer-urgent");
            }
        }
    }

    selectOption(optKey) {
        document.querySelectorAll(".question-option-btn").forEach(btn => {
            btn.classList.remove("selected-option");
        });
        const chosen = document.getElementById(`opt-btn-${optKey}`);
        if (chosen) {
            chosen.classList.add("selected-option");
        }
    }

    // Hiệu ứng hồi hộp trước khi công bố đáp án (Suspense Riser & Drumroll)
    triggerSuspenseReveal() {
        if (!this.currentQuestion || this.isSuspenseRunning) return;
        this.isSuspenseRunning = true;
        this.pauseCountdown();

        // 1. Bật âm thanh hồi hộp drum roll & riser
        if (window.sound) {
            window.sound.playSuspenseRiser();
        }

        // 2. Chớp đèn LED sân khấu kịch tính
        const stageEl = document.getElementById("stage-area");
        if (stageEl) stageEl.classList.add("stage-suspense-pulse");

        const suspenseBanner = document.getElementById("suspense-overlay-banner");
        if (suspenseBanner) {
            suspenseBanner.style.display = "flex";
            suspenseBanner.textContent = "HỒI HỘP CHỜ ĐÁP ÁN...";
        }

        // Sau 2.5 giây kịch tính, công bố đáp án
        setTimeout(() => {
            if (stageEl) stageEl.classList.remove("stage-suspense-pulse");
            if (suspenseBanner) suspenseBanner.style.display = "none";
            this.isSuspenseRunning = false;

            this.revealAnswerDetails();
        }, 2600);
    }

    revealAnswerDetails() {
        if (!this.currentQuestion) return;

        // Đổi màu các phương án
        const correctKey = this.currentQuestion.answer.toUpperCase();
        document.querySelectorAll(".question-option-btn").forEach(btn => {
            btn.classList.remove("correct-option", "wrong-option");
        });

        const correctBtn = document.getElementById(`opt-btn-${correctKey}`);
        if (correctBtn) {
            correctBtn.classList.add("correct-option");
        }

        // Hiển thị phần giải thích
        const expEl = document.getElementById("question-explanation");
        if (expEl && this.currentQuestion.explanation) {
            expEl.innerHTML = `<b>💡 Giải thích:</b> ${this.currentQuestion.explanation}`;
            expEl.style.display = "block";
        }
    }

    // Xử lý kết quả trả lời (Đúng / Sai)
    handleAnswerResult(isCorrect) {
        if (!this.currentQuestion || !this.currentStudent) {
            alert("Vui lòng bắt đầu lượt mới và chọn thí sinh trước!");
            return;
        }

        if (this.isAdvancing) return;

        this.pauseCountdown();

        if (isCorrect) {
            // TRẢ LỜI ĐÚNG!
            if (window.sound) window.sound.playCorrect();

            // Cộng điểm cho học sinh
            window.studentMgr.recordAnswer(this.currentStudent.id, true, this.currentPoints);

            // Hiệu ứng tiền bay & cập nhật điểm
            this.triggerCoinFlyAnimation(this.currentPoints, false);
            this.renderAudienceSeats();

            // MC chúc mừng
            if (window.mc) {
                window.mc.praiseCorrect(this.currentStudent.name, this.currentPoints);
            }

            // Đánh dấu câu hỏi đã hoàn thành
            window.questionMgr.markAsPlayed(this.currentQuestion.id);
            this.updateStatsBar();

            // Hiển thị thông báo chuyển lượt
            this.showToast(`🎉 <b>Chính xác!</b> +${this.currentPoints} điểm cho <b>${this.currentStudent.name}</b>. Đang chuyển câu tiếp theo & quay người mới...`, 'success', 2800);

            // Tự động chuyển câu tiếp theo và quay ngẫu nhiên người tiếp theo
            this.scheduleNextTurn(2800);

        } else {
            // TRẢ LỜI SAI!
            if (window.sound) window.sound.playWrong();
            window.studentMgr.recordAnswer(this.currentStudent.id, false, 0);

            if (this.currentAttempt === 1) {
                // LẦN 1 SAI -> CHUYỂN SANG LẦN 2 (Cơ hội giải cứu!)
                this.currentAttempt = 2;
                const attemptEl = document.getElementById("turn-attempt-indicator");
                if (attemptEl) {
                    attemptEl.innerHTML = `<span class="badge-attempt attempt-2">Lần Trả Lời: 2 / 2 (Cơ Hội Cứu Trợ!)</span>`;
                }

                if (window.mc) {
                    window.mc.notifyWrong(1);
                }

                this.showToast(`⚠️ Chưa chính xác! Đang quay chọn bạn khác cứu trợ câu này...`, 'deduct', 2200);

                // Tự động quét chọn bạn khác cứu trợ câu hỏi này!
                setTimeout(() => {
                    this.selectRandomStudentWithSpotlight(this.currentStudent.id);
                }, 2200);

            } else {
                // LẦN 2 CŨNG SAI -> Kết thúc câu hỏi này, công bố đáp án chuẩn
                this.revealAnswerDetails();
                if (window.mc) {
                    window.mc.notifyWrong(2);
                }
                window.questionMgr.markAsPlayed(this.currentQuestion.id);
                this.updateStatsBar();

                this.showToast(`⌛ Đã hết 2 lượt câu hỏi này! Đang chuyển câu tiếp theo & quay người mới...`, 'deduct', 3200);

                // Tự động chuyển câu tiếp theo và quay ngẫu nhiên người tiếp theo
                this.scheduleNextTurn(3200);
            }
        }
    }

    // Hành động Trừ Điểm thủ công khi học sinh trả lời sai / trừ phạt
    handleDeductPointsAction() {
        if (!this.currentQuestion || !this.currentStudent) {
            alert("Vui lòng bắt đầu lượt mới và chọn thí sinh trước!");
            return;
        }

        if (this.isAdvancing) return;

        this.pauseCountdown();

        // Mức trừ điểm: Điểm của câu hỏi hiện tại hoặc tối thiểu 20 điểm
        const deductPts = this.currentPoints > 0 ? this.currentPoints : 20;

        // Âm thanh trừ điểm
        if (window.sound) window.sound.playCoinDeduct();

        // Cập nhật trừ điểm cho học sinh
        window.studentMgr.recordAnswer(this.currentStudent.id, false, deductPts, true);

        // Hiệu ứng trừ tiền màu đỏ
        this.triggerCoinFlyAnimation(deductPts, true);
        this.renderAudienceSeats();

        // MC thông báo
        if (window.mc) {
            window.mc.notifyDeduct(this.currentStudent.name, deductPts);
        }

        // Đánh dấu câu hỏi đã hoàn thành
        window.questionMgr.markAsPlayed(this.currentQuestion.id);
        this.updateStatsBar();

        // Hiển thị thông báo chuyển lượt
        this.showToast(`➖ Đã trừ <b>${deductPts} điểm</b> của <b>${this.currentStudent.name}</b>. Đang chuyển câu tiếp theo & quay người mới...`, 'deduct', 2800);

        // Tự động chuyển câu tiếp theo và quay ngẫu nhiên người tiếp theo
        this.scheduleNextTurn(2800);
    }

    // Lên lịch chuyển sang câu tiếp theo và tự động quay vòng tiếp theo
    scheduleNextTurn(delayMs = 2800) {
        if (this.advanceTimeout) {
            clearTimeout(this.advanceTimeout);
        }
        this.isAdvancing = true;
        this.advanceTimeout = setTimeout(() => {
            this.isAdvancing = false;
            this.startNewTurn();
        }, delayMs);
    }

    // Hiển thị thanh Toast thông báo chuyển lượt mượt mà
    showToast(message, type = 'info', duration = 2800) {
        const toast = document.getElementById("auto-advance-toast");
        if (!toast) return;

        toast.className = `auto-advance-toast toast-${type} toast-show`;
        toast.innerHTML = message;

        setTimeout(() => {
            toast.classList.remove("toast-show");
        }, duration);
    }

    // Hiệu ứng cộng tiền / trừ tiền bay sinh động
    triggerCoinFlyAnimation(points, isDeduct = false) {
        if (!this.currentStudent) return;
        const targetSeat = document.getElementById(`seat-student-${this.currentStudent.id}`);
        const sourceScreen = document.getElementById("question-display-board");

        if (!targetSeat || !sourceScreen) return;

        const srcRect = sourceScreen.getBoundingClientRect();
        const destRect = targetSeat.getBoundingClientRect();

        const coin = document.createElement("div");
        coin.className = `flying-coin-particle ${isDeduct ? 'deduct-coin' : ''}`;
        coin.textContent = `${isDeduct ? '-' : '+'}${points}🪙`;

        if (isDeduct) {
            // Hiệu ứng trừ tiền: Rơi từ bàn học sinh xuống
            coin.style.left = `${destRect.left + destRect.width / 2 - 25}px`;
            coin.style.top = `${destRect.top + 10}px`;
            document.body.appendChild(coin);

            setTimeout(() => {
                coin.style.top = `${destRect.top + 60}px`;
                coin.style.opacity = "0.2";
                coin.style.transform = "scale(0.85)";
            }, 20);

            setTimeout(() => {
                coin.remove();
            }, 850);
        } else {
            // Hiệu ứng cộng tiền: Bay từ màn hình LED đến bàn học sinh
            coin.style.left = `${srcRect.left + srcRect.width / 2}px`;
            coin.style.top = `${srcRect.top + srcRect.height / 2}px`;
            document.body.appendChild(coin);

            setTimeout(() => {
                coin.style.left = `${destRect.left + destRect.width / 2 - 20}px`;
                coin.style.top = `${destRect.top + 10}px`;
                coin.style.transform = "scale(1.4)";
                coin.style.opacity = "0.9";
            }, 20);

            setTimeout(() => {
                coin.remove();
                if (window.sound) window.sound.playCoinGain();
            }, 900);
        }
    }

    // Chế độ toàn màn hình chuẩn trình chiếu 16:9
    toggleFullscreen() {
        const elem = document.documentElement;
        if (!document.fullscreenElement) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    // Màn hình Bảng Vàng Vinh Danh & Bắn Pháo Hoa chúc mừng
    showLeaderboard() {
        const modal = document.getElementById("leaderboard-modal");
        if (!modal) return;

        const students = [...window.studentMgr.students]
            .filter(s => s.active)
            .sort((a, b) => b.score - a.score || b.correctCount - a.correctCount);

        // Bục vinh quang Top 3
        const top1 = students[0];
        const top2 = students[1];
        const top3 = students[2];

        const podiumEl = document.getElementById("podium-container");
        if (podiumEl) {
            podiumEl.innerHTML = `
                <!-- Hạng 2 -->
                <div class="podium-item rank-2">
                    <div class="podium-trophy">🥈</div>
                    <div class="podium-avatar">${top2 ? window.studentMgr.renderAvatarSVG(top2, 64) : ''}</div>
                    <div class="podium-name">${top2 ? top2.name : 'Chưa có'}</div>
                    <div class="podium-score">${top2 ? top2.score : 0} điểm</div>
                    <div class="podium-step step-2">2</div>
                </div>

                <!-- Hạng 1 (Quán Quân) -->
                <div class="podium-item rank-1">
                    <div class="podium-crown">👑</div>
                    <div class="podium-trophy">🏆</div>
                    <div class="podium-avatar">${top1 ? window.studentMgr.renderAvatarSVG(top1, 76) : ''}</div>
                    <div class="podium-name">${top1 ? top1.name : 'Chưa có'}</div>
                    <div class="podium-score">${top1 ? top1.score : 0} điểm</div>
                    <div class="podium-step step-1">QUÁN QUÂN</div>
                </div>

                <!-- Hạng 3 -->
                <div class="podium-item rank-3">
                    <div class="podium-trophy">🥉</div>
                    <div class="podium-avatar">${top3 ? window.studentMgr.renderAvatarSVG(top3, 60) : ''}</div>
                    <div class="podium-name">${top3 ? top3.name : 'Chưa có'}</div>
                    <div class="podium-score">${top3 ? top3.score : 0} điểm</div>
                    <div class="podium-step step-3">3</div>
                </div>
            `;
        }

        // Bảng danh sách chi tiết
        const tableBody = document.getElementById("leaderboard-table-body");
        if (tableBody) {
            tableBody.innerHTML = "";
            students.forEach((s, idx) => {
                const tr = document.createElement("tr");
                const total = s.turnsTaken || (s.correctCount + s.wrongCount) || 1;
                const accuracy = Math.round((s.correctCount / total) * 100);

                tr.innerHTML = `
                    <td class="col-rank font-bold">${idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}</td>
                    <td class="col-student-name">
                        <span class="table-mini-avatar">${window.studentMgr.renderAvatarSVG(s, 28)}</span>
                        ${s.name}
                    </td>
                    <td>${s.gender === 'nam' ? '👦 Nam' : '👧 Nữ'}</td>
                    <td class="col-score font-bold text-amber-400">${s.score}</td>
                    <td class="text-emerald-400 font-bold">${s.correctCount}</td>
                    <td class="text-rose-400">${s.wrongCount}</td>
                    <td>${accuracy}%</td>
                `;
                tableBody.appendChild(tr);
            });
        }

        modal.style.display = "flex";

        // Tự động lưu buổi thi vào lịch sử
        window.historyMgr.saveSession(
            "Chiếc Nón Kỳ Diệu - Tiết Học Vui Nhộn",
            "Lớp Tiểu Học",
            "Giáo Viên",
            students,
            this.questionsPlayedCount
        );

        if (window.mc && top1) {
            window.mc.speak(`Chúc mừng bạn ${top1.name} đã xuất sắc giành ngôi vị Quán quân Chiếc Nón Kỳ Diệu với tổng số ${top1.score} điểm! Hoan hô các bạn học sinh!`);
        }
    }
}

// Global Game Engine
window.game = new GameEngine();
