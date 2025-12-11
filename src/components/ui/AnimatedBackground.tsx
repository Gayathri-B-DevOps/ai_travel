import { useEffect, useRef } from "react";

export const AnimatedBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        let width = window.innerWidth;
        let height = window.innerHeight;

        // Configuration
        const particleCount = 50;
        const mouseDistance = 250;

        // Mouse state
        const mouse = { x: 0, y: 0 };

        type ShapeType = "plane" | "pin" | "compass" | "cloud";
        const shapes: ShapeType[] = ["plane", "pin", "compass", "cloud"];

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            type: ShapeType;
            rotation: number;
            rotationSpeed: number;
            color: string;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 15 + 10;
                this.type = shapes[Math.floor(Math.random() * shapes.length)];
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.01;

                // Premium travel colors
                const colors = ["#38bdf8", "#818cf8", "#c084fc", "#ffffff"]; // Sky, Indigo, Purple, White
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.rotation += this.rotationSpeed;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse interaction
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouseDistance) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouseDistance - distance) / mouseDistance;

                    this.vx -= forceDirectionX * force * 0.5;
                    this.vy -= forceDirectionY * force * 0.5;
                }

                // Friction and Speed Limits
                this.vx *= 0.99;
                this.vy *= 0.99;
                if (Math.abs(this.vx) < 0.1) this.vx *= 1.01;
                if (Math.abs(this.vy) < 0.1) this.vy *= 1.01;
            }

            draw() {
                if (!ctx) return;
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.strokeStyle = this.color;
                ctx.fillStyle = this.color;
                ctx.lineWidth = 1.5;
                ctx.globalAlpha = 0.4;

                switch (this.type) {
                    case "plane":
                        // Paper Plane
                        ctx.beginPath();
                        ctx.moveTo(this.size, 0);
                        ctx.lineTo(-this.size / 2, this.size / 2);
                        ctx.lineTo(-this.size / 4, 0);
                        ctx.lineTo(-this.size / 2, -this.size / 2);
                        ctx.closePath();
                        ctx.stroke();
                        break;
                    case "pin":
                        // Map Pin
                        ctx.beginPath();
                        ctx.arc(0, -this.size / 3, this.size / 3, 0, Math.PI * 2);
                        ctx.moveTo(0, 0);
                        ctx.lineTo(0, this.size);
                        ctx.stroke();
                        break;
                    case "compass":
                        // Compass
                        ctx.beginPath();
                        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                        ctx.moveTo(0, -this.size / 2);
                        ctx.lineTo(0, this.size / 2);
                        ctx.moveTo(-this.size / 2, 0);
                        ctx.lineTo(this.size / 2, 0);
                        ctx.stroke();
                        break;
                    case "cloud":
                        // Simple Cloud
                        ctx.beginPath();
                        ctx.arc(-this.size / 3, 0, this.size / 3, 0, Math.PI * 2);
                        ctx.arc(this.size / 3, 0, this.size / 4, 0, Math.PI * 2);
                        ctx.arc(0, -this.size / 3, this.size / 3, 0, Math.PI * 2);
                        ctx.stroke();
                        break;
                }
                ctx.restore();
            }

            explode() {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 400) {
                    const force = (400 - distance) / 400;
                    this.vx += (dx / distance) * force * 10;
                    this.vy += (dy / distance) * force * 10;
                }
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            // Deep Space / Night Sky Background
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, "#0f172a"); // Slate 900
            gradient.addColorStop(1, "#1e1b4b"); // Indigo 950
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Draw particles
            particles.forEach((particle) => {
                particle.update();
                particle.draw();
            });

            // Connect planes with flight paths
            particles.forEach((a, index) => {
                if (a.type !== "plane") return;

                for (let j = index + 1; j < particles.length; j++) {
                    const b = particles[j];
                    if (b.type === "plane") continue; // Don't connect planes to planes, looks messy

                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.strokeStyle = a.color;
                        ctx.globalAlpha = (1 - distance / 150) * 0.15;
                        ctx.setLineDash([5, 5]); // Flight path style
                        ctx.lineWidth = 1;
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                        ctx.setLineDash([]);
                    }
                }
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            init();
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleClick = () => {
            particles.forEach(p => p.explode());
        };

        // Initialize
        canvas.width = width;
        canvas.height = height;
        init();
        animate();

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("click", handleClick);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("click", handleClick);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 h-full w-full"
        />
    );
};
