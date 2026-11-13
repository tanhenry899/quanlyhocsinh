/**
 * Quản lý thí sinh (Tối đa 30 học sinh)
 * Hỗ trợ chọn Nam/Nữ, 20 bộ đồng phục độc đáo, điểm số, lượt chơi
 */

const UNIFORM_STYLES = [
    { id: 1, name: "Khăn Quàng Đỏ Đội Viên", primary: "#ffffff", secondary: "#dc2626", badge: "🧣", desc: "Áo trắng thắt khăn quàng đỏ tươi" },
    { id: 2, name: "Sơ Mi Trắng Cà Vạt Xanh", primary: "#f8fafc", secondary: "#2563eb", badge: "👔", desc: "Đồng phục chuẩn trường tiểu học" },
    { id: 3, name: "Thể Dục Năng Động Xanh Lam", primary: "#38bdf8", secondary: "#0369a1", badge: "⚡", desc: "Bộ thể thao xanh dương khỏe khoắn" },
    { id: 4, name: "Thể Dục Nhiệt Huyết Đỏ Cam", primary: "#fb923c", secondary: "#c2410c", badge: "🔥", desc: "Bộ thể dục năng lượng mặt trời" },
    { id: 5, name: "Áo Polo Vàng Thông Thái", primary: "#facc15", secondary: "#854d0e", badge: "🌟", desc: "Polo vàng tươi rực rỡ trí tuệ" },
    { id: 6, name: "Polo Mầm Xanh Hy Vọng", primary: "#4ade80", secondary: "#15803d", badge: "🌿", desc: "Áo xanh lá cây bảo vệ môi trường" },
    { id: 7, name: "Thủy Thủ Nhí Đại Dương", primary: "#f1f5f9", secondary: "#1e3a8a", badge: "⚓", desc: "Cổ yếm thủy thủ viền sọc xanh biển" },
    { id: 8, name: "Áo Dài Truyền Thống Nhí", primary: "#f472b6", secondary: "#be185d", badge: "🌸", desc: "Áo dài hoa hồng truyền thống Việt Nam" },
    { id: 9, name: "Vest Tiểu Học Hoàng Gia", primary: "#312e81", secondary: "#fbbf24", badge: "👑", desc: "Blazer xanh đậm khuy mạ vàng sang trọng" },
    { id: 10, name: "Học Sinh Ca-rô Scotland", primary: "#ef4444", secondary: "#1e293b", badge: "🏁", desc: "Yếm caro đỏ thanh lịch cổ điển" },
    { id: 11, name: "Áo Khoác Nỉ Mùa Đông Đỏ", primary: "#e11d48", secondary: "#ffffff", badge: "❄️", desc: "Áo ấm mùa đông viền lông ấm áp" },
    { id: 12, name: "Áo Khoác Bomber Xanh Navy", primary: "#1e3a5f", secondary: "#f59e0b", badge: "🧢", desc: "Áo khoác bomber thời trang cá tính" },
    { id: 13, name: "Hướng Đạo Sinh / Thám Hiểm", primary: "#d97706", secondary: "#78350f", badge: "🧭", desc: "Bộ kaki dã ngoại thắt khăn nâu" },
    { id: 14, name: "Bác Học Nhí / Áo Lab Trắng", primary: "#e0f2fe", secondary: "#0284c7", badge: "🔬", desc: "Áo blouse trắng nhà khoa học nhí" },
    { id: 15, name: "Cờ Đỏ Sao Vàng Yêu Nước", primary: "#dc2626", secondary: "#facc15", badge: "⭐", desc: "Áo cờ đỏ sao vàng tự hào Việt Nam" },
    { id: 16, name: "Họa Sĩ Nhí Yếm Denim", primary: "#60a5fa", secondary: "#e11d48", badge: "🎨", desc: "Quần yếm jean cùng mũ beret nghệ sĩ" },
    { id: 17, name: "Phi Hành Gia Nhí Vũ Trụ", primary: "#94a3b8", secondary: "#38bdf8", badge: "🚀", desc: "Trang phục phi thuyền khám phá ngân hà" },
    { id: 18, name: "Siêu Nhân Trí Tuệ Áo Choàng", primary: "#8b5cf6", secondary: "#fbbf24", badge: "🦸", desc: "Huy hiệu anh hùng tri thức nhí" },
    { id: 19, name: "Hoàng Tử & Công Chúa Nhí", primary: "#c084fc", secondary: "#fef08a", badge: "💎", desc: "Vương miện lấp lánh và áo đính ngọc" },
    { id: 20, name: "Cầu Thủ Bóng Rổ Số 1", primary: "#ea580c", secondary: "#0284c7", badge: "🏀", desc: "Áo số bóng rổ vô địch thể thao" }
];

const DEFAULT_NAMES = [
    { name: "Nguyễn Minh An", gender: "nam", uniform: 1 },
    { name: "Trần Bảo Ngọc", gender: "nu", uniform: 1 },
    { name: "Lê Gia Huy", gender: "nam", uniform: 2 },
    { name: "Phạm Quỳnh Anh", gender: "nu", uniform: 8 },
    { name: "Hoàng Đức Duy", gender: "nam", uniform: 3 },
    { name: "Vũ Mai Phương", gender: "nu", uniform: 5 },
    { name: "Đặng Quang Minh", gender: "nam", uniform: 15 },
    { name: "Bùi Linh Đan", gender: "nu", uniform: 6 },
    { name: "Ngô Tuấn Kiệt", gender: "nam", uniform: 9 },
    { name: "Đỗ Thùy Chi", gender: "nu", uniform: 10 },
    { name: "Dương Nhật Nam", gender: "nam", uniform: 13 },
    { name: "Hồ Khánh Vy", gender: "nu", uniform: 7 },
    { name: "Lý Quốc Bảo", gender: "nam", uniform: 14 },
    { name: "Trịnh Thảo My", gender: "nu", uniform: 16 },
    { name: "Lâm Hải Đăng", gender: "nam", uniform: 17 },
    { name: "Mai Trúc Linh", gender: "nu", uniform: 18 },
    { name: "Võ Thành Đạt", gender: "nam", uniform: 4 },
    { name: "Phan Yến Nhi", gender: "nu", uniform: 19 },
    { name: "Đoàn Tấn Phát", gender: "nam", uniform: 20 },
    { name: "Cao Ngọc Ánh", gender: "nu", uniform: 11 },
    { name: "Lương Phúc Lâm", gender: "nam", uniform: 12 },
    { name: "Tạ Diệu Huyền", gender: "nu", uniform: 1 },
    { name: "Thái Việt Anh", gender: "nam", uniform: 2 },
    { name: "Chu Hà My", gender: "nu", uniform: 8 },
    { name: "Đinh Khải Hoàn", gender: "nam", uniform: 15 },
    { name: "Quách Trà My", gender: "nu", uniform: 5 },
    { name: "Ân Trọng Hiếu", gender: "nam", uniform: 3 },
    { name: "Bạch Kim Ngân", gender: "nu", uniform: 19 },
    { name: "Trương Hoàng Long", gender: "nam", uniform: 9 },
    { name: "Hà Diễm Quỳnh", gender: "nu", uniform: 7 }
];

class StudentManager {
    constructor() {
        this.STORAGE_KEY = "chiec_non_students_v1";
        this.students = [];
        this.load();
    }

    load() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
            try {
                this.students = JSON.parse(saved);
            } catch (e) {
                this.loadDefaults();
            }
        } else {
            this.loadDefaults();
        }
    }

    save() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.students));
    }

    loadDefaults() {
        this.students = DEFAULT_NAMES.map((item, index) => ({
            id: index + 1,
            name: item.name,
            gender: item.gender, // 'nam' or 'nu'
            uniform: item.uniform || (index % 20) + 1,
            active: true, // Tham gia thi đấu
            score: 0,
            correctCount: 0,
            wrongCount: 0,
            extraTurns: 0,
            turnsTaken: 0
        }));
        this.save();
    }

    resetScores() {
        this.students.forEach(s => {
            s.score = 0;
            s.correctCount = 0;
            s.wrongCount = 0;
            s.extraTurns = 0;
            s.turnsTaken = 0;
        });
        this.save();
    }

    getActiveStudents() {
        return this.students.filter(s => s.active);
    }

    getStudentById(id) {
        return this.students.find(s => s.id === id);
    }

    addScore(studentId, points) {
        const student = this.getStudentById(studentId);
        if (student) {
            student.score = Math.max(0, student.score + points);
            this.save();
        }
    }

    deductScore(studentId, points) {
        const student = this.getStudentById(studentId);
        if (student) {
            student.score = Math.max(0, student.score - points);
            this.save();
        }
    }

    recordAnswer(studentId, isCorrect, points = 0, isDeduct = false) {
        const student = this.getStudentById(studentId);
        if (student) {
            student.turnsTaken++;
            if (isCorrect) {
                student.correctCount++;
                student.score += points;
            } else {
                student.wrongCount++;
                if (isDeduct && points > 0) {
                    student.score = Math.max(0, student.score - points);
                }
            }
            this.save();
        }
    }

    addExtraTurn(studentId) {
        const student = this.getStudentById(studentId);
        if (student) {
            student.extraTurns++;
            this.save();
        }
    }

    useExtraTurn(studentId) {
        const student = this.getStudentById(studentId);
        if (student && student.extraTurns > 0) {
            student.extraTurns--;
            this.save();
            return true;
        }
        return false;
    }

    setStudentActive(studentId, isActive) {
        const student = this.getStudentById(studentId);
        if (student) {
            student.active = isActive;
            this.save();
        }
    }

    updateStudent(studentId, data) {
        const student = this.getStudentById(studentId);
        if (student) {
            Object.assign(student, data);
            this.save();
        }
    }

    addStudent(name, gender = 'nam', uniform = 1) {
        if (this.students.length >= 30) {
            alert("Tối đa 30 học sinh trong một lớp học!");
            return false;
        }
        const newId = this.students.length > 0 ? Math.max(...this.students.map(s => s.id)) + 1 : 1;
        this.students.push({
            id: newId,
            name: name.trim() || `Học sinh ${newId}`,
            gender: gender,
            uniform: parseInt(uniform) || 1,
            active: true,
            score: 0,
            correctCount: 0,
            wrongCount: 0,
            extraTurns: 0,
            turnsTaken: 0
        });
        this.save();
        return true;
    }

    removeStudent(studentId) {
        this.students = this.students.filter(s => s.id !== studentId);
        this.save();
    }

    // Tạo hình ảnh đại diện SVG siêu dễ thương cho học sinh theo giới tính và 20 bộ đồng phục
    renderAvatarSVG(student, size = 64) {
        const uni = UNIFORM_STYLES.find(u => u.id === student.uniform) || UNIFORM_STYLES[0];
        const isBoy = student.gender === 'nam';

        // Tóc & Khuôn mặt
        const hairColor = "#262626";
        const skinColor = "#ffdfbf";
        const blushColor = "#fca5a5";

        const boyHair = `
            <path d="M 14,24 C 12,12 24,6 32,6 C 40,6 52,12 50,24 C 44,14 36,16 32,15 C 28,16 20,14 14,24 Z" fill="${hairColor}"/>
            <path d="M 13,22 Q 18,17 26,17 Q 34,17 38,20" stroke="${hairColor}" stroke-width="3" fill="none" stroke-linecap="round"/>
        `;

        const girlHair = `
            <!-- Tóc hai chùm dễ thương -->
            <circle cx="12" cy="18" r="8" fill="${hairColor}"/>
            <circle cx="52" cy="18" r="8" fill="${hairColor}"/>
            <circle cx="12" cy="18" r="5" fill="${uni.secondary}"/>
            <circle cx="52" cy="18" r="5" fill="${uni.secondary}"/>
            <path d="M 15,25 C 13,11 23,6 32,6 C 41,6 51,11 49,25 C 44,15 36,16 32,16 C 28,16 20,15 15,25 Z" fill="${hairColor}"/>
        `;

        // Chi tiết đồng phục trên thân
        const badgeElement = uni.badge ? `
            <text x="32" y="55" font-size="10" text-anchor="middle" dominant-baseline="middle">${uni.badge}</text>
        ` : '';

        return `
            <svg viewBox="0 0 64 64" width="${size}" height="${size}" class="student-avatar-svg">
                <defs>
                    <radialGradient id="skinGlow-${student.id}" cx="50%" cy="40%" r="60%">
                        <stop offset="0%" stop-color="#fff0e0"/>
                        <stop offset="100%" stop-color="${skinColor}"/>
                    </radialGradient>
                    <linearGradient id="bodyGrad-${student.id}" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="${uni.primary}"/>
                        <stop offset="100%" stop-color="${uni.secondary}"/>
                    </linearGradient>
                </defs>

                <!-- Thân & Trang phục -->
                <path d="M 16,62 C 16,42 48,42 48,62 Z" fill="url(#bodyGrad-${student.id})" stroke="${uni.secondary}" stroke-width="1.5"/>
                
                <!-- Cổ áo & Khăn/Cà vạt -->
                <path d="M 26,44 L 32,50 L 38,44" fill="${uni.secondary}" stroke="#ffffff" stroke-width="1"/>
                ${badgeElement}

                <!-- Cổ -->
                <rect x="28" y="38" width="8" height="7" rx="3" fill="${skinColor}"/>

                <!-- Khuôn mặt tròn trĩnh -->
                <circle cx="32" cy="27" r="15" fill="url(#skinGlow-${student.id})"/>

                <!-- Tai -->
                <circle cx="16" cy="28" r="3.5" fill="${skinColor}"/>
                <circle cx="48" cy="28" r="3.5" fill="${skinColor}"/>

                <!-- Tóc -->
                ${isBoy ? boyHair : girlHair}

                <!-- Mắt to tròn long lanh -->
                <circle cx="26" cy="27" r="2.2" fill="#1e293b"/>
                <circle cx="25.2" cy="26.2" r="0.8" fill="#ffffff"/>
                <circle cx="38" cy="27" r="2.2" fill="#1e293b"/>
                <circle cx="37.2" cy="26.2" r="0.8" fill="#ffffff"/>

                <!-- Má hồng búp bê -->
                <ellipse cx="23" cy="31" rx="2.5" ry="1.5" fill="${blushColor}" opacity="0.6"/>
                <ellipse cx="41" cy="31" rx="2.5" ry="1.5" fill="${blushColor}" opacity="0.6"/>

                <!-- Miệng cười tươi -->
                <path d="M 29,32 Q 32,36 35,32" stroke="#b91c1c" stroke-width="1.6" fill="none" stroke-linecap="round"/>
            </svg>
        `;
    }
}

// Global Student Manager
window.studentMgr = new StudentManager();
