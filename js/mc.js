/**
 * MC Ảo Sân Khấu - Hỗ trợ phát âm Tiếng Việt (Web Speech API) & Hoạt họa khẩu hình
 */
class VirtualMC {
    constructor() {
        this.synth = window.speechSynthesis || null;
        this.vietnameseVoice = null;
        this.isEnabled = true;
        this.rate = 0.95; // Tốc độ vừa phải chuẩn giáo viên tiểu học
        this.pitch = 1.05; // Giọng tươi vui, ấm áp
        this.isSpeaking = false;
        this.mouthOpen = false;
        this.animInterval = null;

        this.initVoice();
    }

    initVoice() {
        if (!this.synth) return;

        const updateVoices = () => {
            const voices = this.synth.getVoices();
            // Ưu tiên giọng Tiếng Việt
            this.vietnameseVoice = voices.find(v => v.lang.includes("vi-VN") || v.lang.includes("vi_VN") || v.lang.toLowerCase().includes("vietnam")) ||
                                  voices.find(v => v.name.toLowerCase().includes("vietnam") || v.name.toLowerCase().includes("tiếng việt")) ||
                                  voices[0];
        };

        updateVoices();
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = updateVoices;
        }
    }

    speak(text, onComplete = null) {
        if (!this.synth || !this.isEnabled || !text) {
            if (onComplete) onComplete();
            return;
        }

        // Dừng câu nói trước nếu đang nói
        this.synth.cancel();

        // Chuẩn hóa văn bản đọc (bỏ dấu ngoặc hoặc định dạng đặc biệt)
        const cleanText = text.replace(/[*_#`]/g, '');

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = "vi-VN";
        if (this.vietnameseVoice) {
            utterance.voice = this.vietnameseVoice;
        }
        utterance.rate = this.rate;
        utterance.pitch = this.pitch;

        utterance.onstart = () => {
            this.isSpeaking = true;
            this.startMouthAnimation();
        };

        utterance.onend = () => {
            this.isSpeaking = false;
            this.stopMouthAnimation();
            if (onComplete) onComplete();
        };

        utterance.onerror = () => {
            this.isSpeaking = false;
            this.stopMouthAnimation();
            if (onComplete) onComplete();
        };

        this.synth.speak(utterance);
    }

    stop() {
        if (this.synth) {
            this.synth.cancel();
        }
        this.isSpeaking = false;
        this.stopMouthAnimation();
    }

    startMouthAnimation() {
        if (this.animInterval) clearInterval(this.animInterval);
        const mouthEl = document.getElementById("mc-mouth");
        if (!mouthEl) return;

        this.animInterval = setInterval(() => {
            this.mouthOpen = !this.mouthOpen;
            if (this.mouthOpen) {
                // Miệng mở khi phát âm
                mouthEl.setAttribute("d", "M 44,52 Q 50,60 56,52 Q 50,56 44,52 Z");
                mouthEl.setAttribute("fill", "#dc2626");
            } else {
                // Miệng ngậm mỉm cười
                mouthEl.setAttribute("d", "M 44,53 Q 50,57 56,53");
                mouthEl.setAttribute("fill", "none");
            }
        }, 140);
    }

    stopMouthAnimation() {
        if (this.animInterval) {
            clearInterval(this.animInterval);
            this.animInterval = null;
        }
        const mouthEl = document.getElementById("mc-mouth");
        if (mouthEl) {
            mouthEl.setAttribute("d", "M 44,53 Q 50,57 56,53");
            mouthEl.setAttribute("fill", "none");
        }
    }

    // Các câu dẫn chương trình thân thiện vui tươi
    greetClass() {
        this.speak("Nhiệt liệt chào mừng quý thầy cô và các bạn học sinh đến với đấu trường Chiếc Nón Kỳ Diệu!");
    }

    announceTurn(studentName, attempt = 1) {
        if (attempt === 1) {
            this.speak(`Xin chúc mừng bạn ${studentName} đã được chọn để trả lời câu hỏi! Bạn hãy sẵn sàng nhé!`);
        } else {
            this.speak(`Cơ hội giải cứu lần hai xin thuộc về bạn ${studentName}! Hãy cố gắng lên nào!`);
        }
    }

    praiseCorrect(studentName, points) {
        const phrases = [
            `Xuất sắc! Câu trả lời hoàn toàn chính xác! Chúc mừng bạn ${studentName} được cộng thêm ${points} điểm!`,
            `Tuyệt vời lắm ${studentName}! Đáp án chính xác! Bạn nhận được ${points} điểm!`,
            `Thật đáng khen ngợi! Bạn ${studentName} đã trả lời đúng và rinh về ${points} điểm!`
        ];
        const text = phrases[Math.floor(Math.random() * phrases.length)];
        this.speak(text);
    }

    notifyWrong(attempt = 1) {
        if (attempt === 1) {
            this.speak("Rất tiếc! Câu trả lời chưa chính xác. Cơ hội thứ hai sẽ dành cho một bạn cứu trợ ngay sau đây!");
        } else {
            this.speak("Rất tiếc, lần trả lời thứ hai cũng chưa đúng. Chúng ta sẽ cùng xem đáp án chuẩn nhé!");
        }
    }

    notifyDeduct(studentName, points) {
        this.speak(`Rất tiếc! Bạn ${studentName} bị trừ ${points} điểm. Cố gắng ở các câu sau nhé! Hãy cùng đến với câu hỏi tiếp theo!`);
    }

    announceNextTurn() {
        this.speak("Chúng ta cùng đến với câu hỏi tiếp theo và quay chọn thí sinh mới!");
    }
}

window.mc = new VirtualMC();
