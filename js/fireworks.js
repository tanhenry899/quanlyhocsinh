/**
 * Hiệu ứng Pháo Hoa & Kim Tuyến mừng chiến thắng (HTML5 Canvas Particle Engine)
 */
class FireworksEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
        this.particles = [];
        this.fireworks = [];
        this.isRunning = false;
        this.isEnabled = false; // Tính năng pháo hoa đã tắt theo yêu cầu
        this.colors = [
            "#ef4444", "#f97316", "#f59e0b", "#10b981", "#06b6d4",
            "#3b82f6", "#8b5cf6", "#ec4899", "#facc15", "#ffffff"
        ];

        this.resize();
        window.addEventListener("resize", () => this.resize());
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    startCelebration(durationSeconds = 8) {
        if (!this.isEnabled) return;
        this.resize();
        this.isRunning = true;
        this.particles = [];
        this.fireworks = [];

        let count = 0;
        const interval = setInterval(() => {
            if (!this.isRunning || !this.isEnabled) {
                clearInterval(interval);
                return;
            }
            this.launchRandomFirework();
            count++;
            if (count > durationSeconds * 3) {
                clearInterval(interval);
            }
        }, 320);

        this.loop();
    }

    stop() {
        this.isRunning = false;
        this.particles = [];
        this.fireworks = [];
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    launchRandomFirework() {
        if (!this.isEnabled) return;
        const x = Math.random() * this.canvas.width * 0.8 + this.canvas.width * 0.1;
        const targetY = Math.random() * this.canvas.height * 0.45 + this.canvas.height * 0.1;
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];

        this.fireworks.push({
            x: x,
            y: this.canvas.height,
            targetY: targetY,
            speedY: -(Math.random() * 4 + 11),
            color: color
        });
    }

    explode(x, y, color) {
        if (!this.isEnabled) return;
        if (window.sound) {
            window.sound.playFireworkBurst();
        }

        const count = 75;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 6 + 1.5;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: Math.random() > 0.3 ? color : this.colors[Math.floor(Math.random() * this.colors.length)],
                alpha: 1,
                decay: Math.random() * 0.015 + 0.015,
                size: Math.random() * 3 + 2,
                gravity: 0.12
            });
        }
    }

    // Nổ hoa giấy mini xung quanh một phần tử cụ thể (ví dụ bàn học sinh trả lời đúng)
    burstConfettiAt(x, y, count = 40) {
        if (!this.isEnabled) return;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 7 + 2;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 3,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                alpha: 1,
                decay: Math.random() * 0.02 + 0.018,
                size: Math.random() * 5 + 3,
                gravity: 0.15,
                shape: Math.random() > 0.5 ? "circle" : "rect"
            });
        }
        if (!this.isRunning) {
            this.isRunning = true;
            this.loop();
        }
    }

    loop() {
        if (!this.isRunning && this.particles.length === 0 && this.fireworks.length === 0) {
            if (this.ctx && this.canvas) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
            return;
        }

        this.ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Cập nhật pháo bắn lên
        for (let i = this.fireworks.length - 1; i >= 0; i--) {
            const fw = this.fireworks[i];
            fw.y += fw.speedY;

            this.ctx.beginPath();
            this.ctx.arc(fw.x, fw.y, 3, 0, Math.PI * 2);
            this.ctx.fillStyle = fw.color;
            this.ctx.fill();

            if (fw.y <= fw.targetY || fw.speedY >= 0) {
                this.explode(fw.x, fw.y, fw.color);
                this.fireworks.splice(i, 1);
            }
        }

        // Cập nhật hạt pháo nổ / confetti
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.vx *= 0.98;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fillStyle = p.color;

            if (p.shape === "rect") {
                this.ctx.fillRect(p.x, p.y, p.size, p.size * 1.5);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            }
            this.ctx.restore();
        }

        requestAnimationFrame(() => this.loop());
    }
}

window.fireworks = new FireworksEngine("fireworks-canvas");
