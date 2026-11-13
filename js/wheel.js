/**
 * Chiếc Nón Kỳ Diệu - Canvas Wheel with Realistic Physics & Audio Sync
 */

const WHEEL_SLICES = [
    { label: "100", value: 100, type: "points", color: "#e11d48", text: "#ffffff" },
    { label: "MẤT LƯỢT", value: 0, type: "lose", color: "#0f172a", text: "#f87171" },
    { label: "20", value: 20, type: "points", color: "#f59e0b", text: "#000000" },
    { label: "60", value: 60, type: "points", color: "#10b981", text: "#ffffff" },
    { label: "THÊM LƯỢT", value: 0, type: "extra", color: "#8b5cf6", text: "#ffffff" },
    { label: "40", value: 40, type: "points", color: "#06b6d4", text: "#000000" },
    { label: "80", value: 80, type: "points", color: "#f97316", text: "#ffffff" },
    { label: "NHÂN ĐÔI", value: 2, type: "double", color: "#ec4899", text: "#ffffff" },
    { label: "30", value: 30, type: "points", color: "#3b82f6", text: "#ffffff" },
    { label: "70", value: 70, type: "points", color: "#14b8a6", text: "#ffffff" },
    { label: "MAY MẮN", value: 50, type: "lucky", color: "#eab308", text: "#713f12" },
    { label: "10", value: 10, type: "points", color: "#64748b", text: "#ffffff" },
    { label: "50", value: 50, type: "points", color: "#a855f7", text: "#ffffff" },
    { label: "90", value: 90, type: "points", color: "#ef4444", text: "#ffffff" },
    { label: "MẤT LƯỢT", value: 0, type: "lose", color: "#1e293b", text: "#fca5a5" },
    { label: "50", value: 50, type: "points", color: "#0ea5e9", text: "#ffffff" }
];

class MagicWheel {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext("2d");

        this.slices = WHEEL_SLICES;
        this.sliceCount = this.slices.length;
        this.sliceAngle = (2 * Math.PI) / this.sliceCount;

        this.currentAngle = 0;
        this.angularVelocity = 0;
        this.friction = 0.985;
        this.isSpinning = false;
        this.onFinishCallback = null;

        this.lastPegIndex = -1;
        this.pointerFlex = 0;

        this.setupDPI();
        this.draw();
    }

    setupDPI() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = (rect.width || 360) * dpr;
        this.canvas.height = (rect.height || 360) * dpr;
        this.ctx.scale(dpr, dpr);
        this.radius = (rect.width || 360) / 2;
    }

    spin(targetSliceIndex = null, onFinish = null) {
        if (this.isSpinning) return;
        this.isSpinning = true;
        this.onFinishCallback = onFinish;

        // Tốc độ ban đầu ngẫu nhiên tạo độ hồi hộp
        const baseSpeed = 0.35 + Math.random() * 0.25;
        this.angularVelocity = baseSpeed;

        this.animate();
    }

    animate() {
        if (!this.isSpinning) return;

        this.currentAngle += this.angularVelocity;
        this.currentAngle %= (2 * Math.PI);

        // Phát hiện kim chạm chốt (Peg collision)
        // Kim chỉ cố định ở góc 3 * Math.PI / 2 (đỉnh trên cùng 12 giờ)
        const pointerAngle = (3 * Math.PI / 2 - this.currentAngle + 4 * Math.PI) % (2 * Math.PI);
        const currentPeg = Math.floor(pointerAngle / this.sliceAngle);

        if (currentPeg !== this.lastPegIndex) {
            this.lastPegIndex = currentPeg;
            this.pointerFlex = -0.3; // Làm kim bị uốn cong
            if (window.sound) {
                const pitch = 0.8 + (this.angularVelocity / 0.5) * 0.4;
                window.sound.playWheelTick(pitch);
            }
        }

        // Hồi phục độ cong của kim
        this.pointerFlex *= 0.85;

        // Giảm tốc ma sát
        this.angularVelocity *= this.friction;

        this.draw();

        if (this.angularVelocity < 0.0015) {
            this.isSpinning = false;
            this.angularVelocity = 0;
            this.draw();

            const winningSlice = this.getCurrentSlice();
            if (this.onFinishCallback) {
                this.onFinishCallback(winningSlice);
            }
        } else {
            requestAnimationFrame(() => this.animate());
        }
    }

    getCurrentSlice() {
        // Góc kim ở đỉnh trên (270 độ = 3*PI/2)
        const normalizedAngle = (3 * Math.PI / 2 - this.currentAngle + 4 * Math.PI) % (2 * Math.PI);
        const index = Math.floor(normalizedAngle / this.sliceAngle) % this.sliceCount;
        return this.slices[index];
    }

    draw() {
        const { ctx, radius, currentAngle, slices, sliceAngle } = this;
        const cx = radius;
        const cy = radius;
        ctx.clearRect(0, 0, radius * 2, radius * 2);

        // 1. Viền ngoài phát sáng Neon & Chốt kim loại
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, radius - 4, 0, 2 * Math.PI);
        ctx.fillStyle = "#1e293b";
        ctx.shadowColor = "#f59e0b";
        ctx.shadowBlur = 18;
        ctx.fill();

        ctx.lineWidth = 8;
        ctx.strokeStyle = "#facc15";
        ctx.stroke();
        ctx.restore();

        // 2. Vẽ các nan quạt
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(currentAngle);

        for (let i = 0; i < slices.length; i++) {
            const startAngle = i * sliceAngle;
            const endAngle = startAngle + sliceAngle;
            const slice = slices[i];

            // Cánh quạt
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, radius - 12, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = slice.color;
            ctx.fill();

            // Đường viền ngăn cách
            ctx.lineWidth = 2;
            ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
            ctx.stroke();

            // Chữ / Điểm số trên nan quạt
            ctx.save();
            ctx.rotate(startAngle + sliceAngle / 2);
            ctx.textAlign = "right";
            ctx.textBaseline = "middle";
            ctx.fillStyle = slice.text;
            ctx.font = slice.label.length > 5 ? "bold 13px 'Be Vietnam Pro', sans-serif" : "bold 20px 'Be Vietnam Pro', sans-serif";
            ctx.shadowColor = "rgba(0,0,0,0.7)";
            ctx.shadowBlur = 4;
            ctx.fillText(slice.label, radius - 24, 0);
            ctx.restore();
        }

        // 3. Các chốt kim loại (Pegs) xung quanh vòng ngoài
        for (let i = 0; i < slices.length; i++) {
            const angle = i * sliceAngle;
            const px = (radius - 12) * Math.cos(angle);
            const py = (radius - 12) * Math.sin(angle);

            ctx.beginPath();
            ctx.arc(px, py, 4.5, 0, 2 * Math.PI);
            ctx.fillStyle = "#fef08a";
            ctx.fill();
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = "#854d0e";
            ctx.stroke();
        }

        ctx.restore();

        // 4. Trục giữa (Center Cap) mạ vàng 3D
        ctx.save();
        const centerGrad = ctx.createRadialGradient(cx - 5, cy - 5, 2, cx, cy, 38);
        centerGrad.addColorStop(0, "#fef08a");
        centerGrad.addColorStop(0.5, "#f59e0b");
        centerGrad.addColorStop(1, "#b45309");

        ctx.beginPath();
        ctx.arc(cx, cy, 36, 0, 2 * Math.PI);
        ctx.fillStyle = centerGrad;
        ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();

        // Ngôi sao ở tâm
        ctx.fillStyle = "#ffffff";
        ctx.font = "20px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("⭐", cx, cy);
        ctx.restore();

        // 5. Kim chỉ ở đỉnh 12 giờ (Top Pointer / Flapper)
        ctx.save();
        ctx.translate(cx, 10);
        ctx.rotate(this.pointerFlex);

        ctx.beginPath();
        ctx.moveTo(-12, -4);
        ctx.lineTo(12, -4);
        ctx.lineTo(0, 24);
        ctx.closePath();

        const pointerGrad = ctx.createLinearGradient(0, -4, 0, 24);
        pointerGrad.addColorStop(0, "#ef4444");
        pointerGrad.addColorStop(1, "#991b1b");
        ctx.fillStyle = pointerGrad;
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, -2, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "#fef08a";
        ctx.fill();
        ctx.restore();
    }
}
