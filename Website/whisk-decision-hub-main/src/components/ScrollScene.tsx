import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import handImg from "@/assets/hand.png";
import burgerImg from "@/assets/burger.png";

const STATS = [
  {
    pct: "4–10%",
    line: "of all food purchased by restaurants",
    accent: "is wasted.",
    sub: "Every shift. Every prep list. Every plate scraped.",
  },
  {
    pct: "$3,000",
    line: "wasted per location, per month",
    accent: "on average.",
    sub: "On a $30K food cost — it's the silent line item.",
  },
  {
    pct: "$100B+",
    line: "annual cost of food waste",
    accent: "to businesses globally.",
    sub: "A trillion-dollar decade of lost margin.",
  },
];

export function ScrollScene() {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 20, mass: 0.5 });

  useMotionValueEvent(p, "change", (v) => {
    const seg = Math.min(4, Math.floor(v * 5));
    setStage(seg <= 3 ? seg : 3);
  });

  const burgerX = useTransform(p, [0, 0.2, 0.4, 0.6, 0.8, 1], ["0vw", "0vw", "-8vw", "-16vw", "-24vw", "0vw"]);
  const burgerY = useTransform(p, [0, 0.2, 0.4, 0.6, 0.8, 1], ["0vh", "0vh", "10vh", "20vh", "30vh", "0vh"]);
  const burgerRot = useTransform(p, [0, 0.2, 0.4, 0.6, 0.8, 1], [0, 0, 220, 480, 760, 1080]);
  const burgerScale = useTransform(p, [0, 0.2, 0.4, 0.6, 0.8, 0.9, 1], [1, 1, 0.85, 0.7, 0.55, 1.1, 1]);
  const burgerOpacity = useTransform(p, [0, 0.78, 0.82, 1], [1, 1, 1, 1]);

  const handX = useTransform(p, [0, 1], ["0vw", "-2vw"]);
  const handRot = useTransform(p, [0, 0.5, 1], [0, -4, 0]);

  const revealOpacity = useTransform(p, [0.8, 0.9], [0, 1]);
  const revealY = useTransform(p, [0.8, 1], [40, 0]);

  const stat0 = useTransform(p, [0.18, 0.23, 0.36, 0.40], [0, 1, 1, 0]);
  const stat1 = useTransform(p, [0.38, 0.43, 0.56, 0.60], [0, 1, 1, 0]);
  const stat2 = useTransform(p, [0.58, 0.63, 0.76, 0.80], [0, 1, 1, 0]);

  const introOpacity = useTransform(p, [0, 0.08, 0.18], [1, 1, 0]);

  return (
    <div ref={ref} className="landing-root relative" style={{ height: "500vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden noise">
        <div className="absolute inset-0 grid-bg" />

        <div className="pointer-events-none absolute -top-40 -left-40 h-[40rem] w-[40rem] rounded-full"
          style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--neon) 25%, transparent), transparent 60%)" }} />
        <div className="pointer-events-none absolute -bottom-40 -right-40 h-[40rem] w-[40rem] rounded-full"
          style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--landing-amber) 18%, transparent), transparent 60%)" }} />

        <header className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-6 py-6 md:px-12">
          <div className="flex items-center gap-2 font-mono text-sm tracking-widest text-neon">
            <span className="inline-block h-2 w-2 rounded-full bg-neon" style={{ boxShadow: "0 0 12px var(--neon)" }} />
            WHISK / 001
          </div>
          <div className="hidden gap-8 font-mono text-xs uppercase tracking-[0.2em] text-white/60 md:flex">
            <span>The Problem</span><span>The Cost</span><span>The Fix</span>
          </div>
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-white/60">scroll ↓</div>
        </header>

        <div className="absolute right-6 top-1/2 z-30 -translate-y-1/2 md:right-12">
          <div className="flex flex-col gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <span className={`font-mono text-[10px] tracking-widest ${stage === i ? "text-neon" : "text-white/30"}`}>0{i + 1}</span>
                <span className="block h-px transition-all duration-500" style={{
                  width: stage === i ? 48 : 16,
                  background: stage === i ? "var(--neon)" : "rgba(255,255,255,0.3)",
                  boxShadow: stage === i ? "0 0 10px var(--neon)" : "none",
                }} />
              </div>
            ))}
          </div>
        </div>

        <motion.div style={{ opacity: introOpacity }}
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.4em] text-neon">An anatomy of waste</p>
          <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
            Every bite they don't <br />
            <span className="text-glow text-neon">finish</span> is your <span className="text-amber-glow text-amber">margin</span>.
          </h1>
          <p className="mt-6 max-w-xl font-mono text-xs uppercase tracking-[0.25em] text-white/50">
            scroll to see what restaurants throw away ↓
          </p>
        </motion.div>

        {STATS.map((s, i) => {
          const op = [stat0, stat1, stat2][i];
          return (
            <motion.div key={i} style={{ opacity: op }}
              className="absolute inset-0 z-10 flex items-center pl-[38vw] pr-6 md:pl-[34vw] md:pr-20">
              <div className="max-w-2xl">
                <p className="mb-4 font-mono text-xs uppercase tracking-[0.4em] text-neon">Stat 0{i + 1} / 03</p>
                <h2 className="font-display text-7xl font-bold leading-none tracking-tighter text-neon text-glow md:text-[10rem] lg:text-[12rem]">{s.pct}</h2>
                <p className="mt-6 max-w-md font-display text-xl leading-snug md:text-3xl">
                  {s.line} <span className="text-amber text-amber-glow">{s.accent}</span>
                </p>
                <p className="mt-4 max-w-md font-mono text-xs uppercase tracking-[0.2em] text-white/50">— {s.sub}</p>
              </div>
            </motion.div>
          );
        })}

        <motion.div style={{ x: handX, rotate: handRot }}
          className="pointer-events-none absolute right-[-10vw] top-[18vh] z-20 w-[70vw] max-w-[820px] md:right-[-4vw] md:top-[22vh] md:w-[44vw]">
          <motion.img src={burgerImg} alt="" aria-hidden
            style={{ x: burgerX, y: burgerY, rotate: burgerRot, scale: burgerScale, opacity: burgerOpacity }}
            className="absolute -top-[8vh] left-[6vw] z-10 w-[32vw] max-w-[360px] select-none drop-shadow-neon md:w-[18vw]"
          />
          <img src={handImg} alt="A hand offering food" className="relative w-full select-none drop-shadow-neon" />
        </motion.div>

        <motion.div style={{ opacity: revealOpacity, y: revealY }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center backdrop-blur-sm"
          style2={{ backgroundColor: "oklch(0.22 0.018 60 / 0.85)" }}>
          <div className="absolute inset-0" style={{ background: "oklch(0.22 0.018 60 / 0.85)" }} />
          <div className="relative z-10 flex flex-col items-center">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.4em] text-neon">← The opportunity</p>
            <h2 className="font-display text-4xl font-bold leading-[0.95] tracking-tight md:text-6xl lg:text-7xl">
              What if the <span className="text-glow text-neon">burger</span> went back<br />
              in the <span className="text-amber text-amber-glow">hand</span>?
            </h2>

            <div className="mt-12 grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { k: "$4.34T", v: "Global Foodservice Market" },
                { k: "$7.49B", v: "Restaurant Software (2025)" },
                { k: "~18%", v: "Food Waste Tech CAGR → 2029" },
              ].map((m) => (
                <div key={m.k} className="rounded-2xl px-6 py-5 text-left backdrop-blur"
                  style={{ border: "1px solid color-mix(in oklab, var(--neon) 20%, transparent)", background: "rgba(255,255,255,0.03)" }}>
                  <div className="font-display text-3xl font-bold text-neon text-glow md:text-4xl">{m.k}</div>
                  <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">{m.v}</div>
                </div>
              ))}
            </div>

            <p className="mt-10 max-w-xl font-display text-lg text-white/80 md:text-xl">
              Whisk is the AI brain that sits on top of what restaurants already use —
              turning every wasted bite into <span className="text-neon">recovered margin</span>.
            </p>

            <button
              type="button"
              onClick={() => navigate("/app")}
              className="mt-8 rounded-full font-mono text-xs uppercase tracking-[0.3em] text-neon transition-all"
              style={{
                border: "1px solid color-mix(in oklab, var(--neon) 40%, transparent)",
                background: "color-mix(in oklab, var(--neon) 10%, transparent)",
                padding: "0.75rem 2rem",
              }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.background = "color-mix(in oklab, var(--neon) 20%, transparent)"; (e.target as HTMLElement).style.boxShadow = "0 0 30px var(--neon)"; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "color-mix(in oklab, var(--neon) 10%, transparent)"; (e.target as HTMLElement).style.boxShadow = ""; }}
            >
              See the demo →
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
