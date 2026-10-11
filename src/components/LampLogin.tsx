import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
  useSpring,
} from "framer-motion";
import { Eye, EyeOff, Check, ChevronDown } from "lucide-react";

// ------ Lamp ------
function Lamp({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  // gentle sway
  const sway = useMotionValue(0);
  useEffect(() => {
    const controls = animate(sway, [0, 1.2, -1, 0.6, 0], {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    });
    return () => controls.stop();
  }, [sway]);

  return (
    <div className="relative flex flex-col items-center" style={{ width: 360 }}>
      {/* hint */}
      <AnimatePresence>
        {!on && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="absolute -top-8 text-[10px] tracking-[0.35em] uppercase text-neutral-400"
          >
            Pull the string to toggle login
          </motion.p>
        )}
      </AnimatePresence>

      <motion.svg
        width="360"
        height="380"
        viewBox="0 0 360 380"
        style={{ rotate: sway, transformOrigin: "180px 0px" }}
      >
        <defs>
          <linearGradient id="pole" x1="0" x2="1">
            <stop offset="0" stopColor="#2a2a2e" />
            <stop offset="0.5" stopColor="#4a4a50" />
            <stop offset="1" stopColor="#1a1a1d" />
          </linearGradient>
          <linearGradient id="head" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#3a3a40" />
            <stop offset="1" stopColor="#16161a" />
          </linearGradient>
          <radialGradient id="bulb" cx="0.5" cy="0.4" r="0.6">
            <stop offset="0" stopColor={on ? "#fff4c2" : "#3b3a36"} />
            <stop offset="1" stopColor={on ? "#f0c060" : "#1a1a1c"} />
          </radialGradient>
        </defs>

        {/* horizontal arm */}
        <rect x="120" y="78" width="120" height="3" rx="1.5" fill="url(#pole)" />
        {/* head (shade) */}
        <path
          d="M150 80 L210 80 L205 110 L155 110 Z"
          fill="url(#head)"
          stroke="#0a0a0c"
          strokeWidth="0.5"
        />
        {/* bulb */}
        <ellipse cx="180" cy="116" rx="7" ry="9" fill="url(#bulb)" />
        {/* pull cord */}
        <line x1="200" y1="110" x2="200" y2="150" stroke="#5a5a5e" strokeWidth="0.8" />
        {/* pull knob — clickable */}
        <g
          onClick={onToggle}
          style={{ cursor: "pointer" }}
          className="hover:opacity-90"
        >
          <circle cx="200" cy="156" r="6" fill={on ? "#f3c14a" : "#caa24a"} />
          <circle cx="200" cy="156" r="6" fill="none" stroke="#000" strokeOpacity="0.4" />
        </g>
        {/* vertical pole */}
        <rect x="178.5" y="80" width="3" height="240" fill="url(#pole)" />
        {/* base */}
        <ellipse cx="180" cy="328" rx="44" ry="6" fill="#0a0a0c" />
        <path d="M150 322 Q180 308 210 322 L210 326 L150 326 Z" fill="url(#head)" />
      </motion.svg>

      {/* light cone */}
      <AnimatePresence>
        {on && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="pointer-events-none absolute"
            style={{
              top: 110,
              left: "50%",
              transform: "translateX(-50%)",
              width: 520,
              height: 600,
              background:
                "radial-gradient(ellipse 60% 80% at 50% 0%, rgba(255,210,120,0.35), rgba(255,180,90,0.12) 40%, transparent 75%)",
              filter: "blur(8px)",
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ------ Swipe Auth ------
const DEMO_USER = "ada.lovelace";
const DEMO_PASS = "lumen2026";

function SwipeAuth({
  onAttempt,
  error,
}: {
  onAttempt: () => boolean;
  error: boolean;
}) {
  const TRACK = 220;
  const HANDLE = 48;
  const MAX = TRACK - HANDLE - 6;
  const y = useMotionValue(0);
  const [done, setDone] = useState(false);
  const opacityLabel = useTransform(y, [0, MAX * 0.6], [1, 0]);
  const fillHeight = useTransform(y, (v) => v + HANDLE);

  const fillBg = done
    ? "linear-gradient(180deg, rgba(74,222,128,0.55), rgba(34,197,94,0.25))"
    : error
      ? "linear-gradient(180deg, rgba(248,113,113,0.55), rgba(239,68,68,0.2))"
      : "linear-gradient(180deg, rgba(255,210,120,0.35), rgba(255,160,80,0.10))";
  const handleBg = done
    ? "linear-gradient(180deg,#86efac,#22c55e)"
    : error
      ? "linear-gradient(180deg,#fca5a5,#ef4444)"
      : "linear-gradient(180deg,#f5f5f5,#bdbdbd)";

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        animate={error ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-full border bg-white/[0.03] backdrop-blur-sm transition-colors duration-300"
        style={{
          width: 64,
          height: TRACK,
          borderColor: error ? "rgba(248,113,113,0.6)" : "rgba(255,255,255,0.1)",
        }}
      >
        <motion.div style={{ height: fillHeight }} className="absolute inset-x-0 top-0">
          <div className="h-full w-full transition-all duration-300" style={{ background: fillBg }} />
        </motion.div>

        <motion.div
          style={{ opacity: opacityLabel }}
          className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-[10px] tracking-[0.25em] uppercase text-neutral-300"
        >
          <ChevronDown className="h-3 w-3 animate-bounce" />
          <span style={{ writingMode: "vertical-rl" }}>Swipe to enter</span>
        </motion.div>

        <motion.div
          drag={done ? false : "y"}
          dragConstraints={{ top: 0, bottom: MAX }}
          dragElastic={0.05}
          dragMomentum={false}
          style={{ y, width: HANDLE, height: HANDLE }}
          onDragEnd={() => {
            const v = y.get();
            if (v / MAX >= 0.85) {
              if (onAttempt()) {
                animate(y, MAX, { type: "spring", stiffness: 300, damping: 30 });
                setDone(true);
              } else {
                animate(y, 0, { type: "spring", stiffness: 220, damping: 18 });
              }
            } else {
              animate(y, 0, { type: "spring", stiffness: 220, damping: 18 });
            }
          }}
          className="absolute left-1/2 top-[3px] flex items-center justify-center rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
          whileTap={{ scale: 0.96 }}
        >
          <div
            className="-translate-x-1/2 flex h-full w-full items-center justify-center rounded-full transition-all duration-300"
            style={{ background: handleBg }}
          >
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div key="ok" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Check className="h-5 w-5 text-white" strokeWidth={3} />
                </motion.div>
              ) : (
                <motion.div key="dn" className={error ? "text-white" : "text-neutral-700"}>
                  <ChevronDown className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
      <p
        className={`text-[10px] tracking-[0.3em] uppercase transition-colors ${
          done ? "text-green-400" : error ? "text-red-400" : "text-neutral-500"
        }`}
      >
        {done ? "Authenticated" : error ? "Try again" : "Drag down to enter"}
      </p>
    </div>
  );
}

// ------ Login Card ------
function LoginCard({ visible, success }: { visible: boolean; success: boolean }) {
  const [showPw, setShowPw] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const float = useSpring(0, { stiffness: 30, damping: 10 });
  useEffect(() => {
    const ctrl = animate(float, [0, -6, 0, 4, 0], {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    });
    return () => ctrl.stop();
  }, [float]);

  const attempt = () => {
    const u = username.trim();
    let msg: string | null = null;
    if (!u && !password) msg = "Please enter your username and password. Try again.";
    else if (!u) msg = "Username is missing. Try again.";
    else if (!password) msg = "Password is missing. Try again.";
    else if (u !== DEMO_USER || password !== DEMO_PASS)
      msg = "Incorrect username or password. Try again.";
    if (msg) {
      setError(msg);
      return false;
    }
    setError(null);
    setAuthed(true);
    window.dispatchEvent(new Event("lumen:success"));
    return true;
  };

  const hasError = !!error;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          style={{ y: float, borderColor: hasError ? "rgba(248,113,113,0.5)" : undefined }}
          className="relative w-[360px] max-w-[calc(100vw-2rem)] rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-2xl transition-colors duration-300"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-3xl"
            style={{
              boxShadow: authed || success
                ? "0 0 80px 0 rgba(134,239,172,0.25), inset 0 1px 0 rgba(255,255,255,0.08)"
                : hasError
                  ? "0 0 60px 0 rgba(248,113,113,0.2), inset 0 1px 0 rgba(255,255,255,0.06)"
                  : "0 30px 80px -20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)",
              transition: "box-shadow 600ms",
            }}
          />

          <div className="relative space-y-6">
            <div className="space-y-1">
              <p className="text-[10px] tracking-[0.35em] uppercase text-neutral-400">
                Lumen Studio
              </p>
              <h1 className="font-serif text-2xl text-neutral-50">Welcome back</h1>
            </div>

            <div className="space-y-4">
              <Field label="Username" error={hasError}>
                <input
                  type="text"
                  value={username}
                  maxLength={100}
                  autoComplete="username"
                  placeholder="ada.lovelace"
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError(null);
                  }}
                  className="w-full bg-transparent text-sm text-neutral-100 outline-none placeholder:text-neutral-600"
                />
              </Field>
              <Field label="Password" error={hasError}>
                <div className="flex items-center gap-2">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    maxLength={128}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    className="w-full bg-transparent text-sm tracking-widest text-neutral-100 outline-none placeholder:text-neutral-600"
                  />
                  <button
                    type="button"
                    aria-label={showPw ? "Hide password" : "Show password"}
                    onClick={() => setShowPw((s) => !s)}
                    className="text-neutral-500 hover:text-neutral-200 transition-colors"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </Field>
              <AnimatePresence>
                {error && (
                  <motion.p
                    role="alert"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-red-400"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-neutral-400 cursor-pointer select-none">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <span className="relative h-3.5 w-7 rounded-full bg-white/10 peer-checked:bg-amber-400/70 transition-colors">
                  <span className="absolute top-0.5 left-0.5 h-2.5 w-2.5 rounded-full bg-white transition-transform peer-checked:translate-x-3.5" />
                </span>
                Remember me
              </label>
              <a className="text-neutral-400 hover:text-amber-300 transition-colors" href="#">
                Forgot password?
              </a>
            </div>

            <div className="pt-2">
              <SwipeAuth onAttempt={attempt} error={hasError} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: boolean;
}) {
  return (
    <div
      className={`group rounded-xl border px-4 py-2.5 transition-colors ${
        error
          ? "border-red-400/60 bg-red-500/[0.04]"
          : "border-white/[0.06] bg-white/[0.02] focus-within:border-amber-300/30 hover:border-white/15"
      }`}
    >
      <p className="text-[9px] tracking-[0.3em] uppercase text-neutral-500">{label}</p>
      <div className="mt-1">{children}</div>
    </div>
  );
}

// ------ Page ------
export default function LampLogin() {
  const [on, setOn] = useState(false);
  const [success, setSuccess] = useState(false);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#08080a] text-neutral-100">
      {/* ambient bg */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 10%, rgba(40,30,20,0.6), transparent 60%), radial-gradient(ellipse 80% 60% at 50% 100%, rgba(20,15,30,0.5), transparent 70%)",
        }}
      />
      <motion.div
        aria-hidden
        animate={{ opacity: on ? 1 : 0 }}
        transition={{ duration: 1.2 }}
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 70% at 50% 55%, rgba(255,190,110,0.18), transparent 60%)",
        }}
      />

      {/* grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-10">
        <div className="flex w-full flex-col items-center gap-2 md:flex-row md:items-start md:justify-center md:gap-16">
          <div className="-mt-4">
            <Lamp on={on} onToggle={() => setOn((v) => !v)} />
          </div>
          <div className="mt-6 md:mt-24">
            <LoginCard visible={on} success={success} />
          </div>
        </div>

        <footer className="absolute bottom-6 left-0 right-0 text-center text-[10px] tracking-[0.4em] uppercase text-neutral-600">
          <p>© {new Date().getFullYear()} Lumen · Cinematic Access</p>
        </footer>
      </main>

      {/* hidden bridge for success → brighter lamp */}
      <SuccessBridge setSuccess={setSuccess} />
    </div>
  );
}

function SuccessBridge({ setSuccess }: { setSuccess: (v: boolean) => void }) {
  useEffect(() => {
    const handler = () => setSuccess(true);
    window.addEventListener("lumen:success", handler);
    return () => window.removeEventListener("lumen:success", handler);
  }, [setSuccess]);
  return null;
}