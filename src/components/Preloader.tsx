import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOGO = '/photo_2026-05-13_21-54-50-removebg-preview.png';
const DURATION_MS = 3200;

function CinematicBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(174,33,25,0.25) 0%, rgba(174,33,25,0.08) 30%, rgba(0,0,0,0) 70%)',
        }}
      />
      <motion.div
        animate={{
          background: [
            'radial-gradient(circle at 20% 30%, rgba(255,140,0,0.08) 0%, transparent 40%)',
            'radial-gradient(circle at 80% 70%, rgba(255,200,0,0.06) 0%, transparent 40%)',
            'radial-gradient(circle at 20% 30%, rgba(255,140,0,0.08) 0%, transparent 40%)',
          ],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0"
      />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(234,236,236,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(234,236,236,0.4) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`line-${i}`}
          className="absolute h-px"
          style={{
            top: `${15 + i * 13}%`,
            left: '-20%',
            right: '-20%',
            background:
              'linear-gradient(90deg, transparent 0%, rgba(137,137,137,0.35) 50%, transparent 100%)',
          }}
          animate={{ x: ['-10%', '10%', '-10%'] }}
          transition={{
            duration: 8 + i * 1.2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.4,
          }}
        />
      ))}
    </div>
  );
}

function AmbientParticles() {
  const particles = Array.from({ length: 28 });
  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((_, i) => {
        const size = 1 + Math.random() * 2.5;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const dur = 4 + Math.random() * 6;
        const delay = Math.random() * 3;
        const isRed = i % 4 === 0;
        return (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              top: `${top}%`,
              background: isRed ? '#AE2119' : '#EAECEC',
              boxShadow: isRed
                ? '0 0 8px rgba(174,33,25,0.8)'
                : '0 0 6px rgba(234,236,236,0.5)',
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 0.9, 0],
            }}
            transition={{
              duration: dur,
              delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        );
      })}
    </div>
  );
}

function LightSweep({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="absolute inset-y-0 w-[60%] pointer-events-none"
      initial={{ x: '-120%', opacity: 0 }}
      animate={{ x: '220%', opacity: [0, 1, 0] }}
      transition={{ duration: 1.6, delay, ease: 'easeInOut' }}
      style={{
        background:
          'linear-gradient(110deg, transparent 0%, rgba(174,33,25,0.0) 30%, rgba(255,140,0,0.35) 48%, rgba(174,33,25,0.9) 50%, rgba(255,200,0,0.35) 52%, transparent 70%)',
        filter: 'blur(2px)',
      }}
    />
  );
}

function SpeedStreaks() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-[2px]"
          style={{
            top: `${30 + i * 10}%`,
            left: '-30%',
            width: '40%',
            background:
              'linear-gradient(90deg, transparent, rgba(174,33,25,0.7), transparent)',
            filter: 'blur(1px)',
          }}
          initial={{ x: '-50%', opacity: 0 }}
          animate={{ x: '350%', opacity: [0, 1, 0] }}
          transition={{
            duration: 1.4,
            delay: 0.4 + i * 0.18,
            repeat: 1,
            repeatDelay: 1.2,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

function AnimatedLogo() {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.85, filter: 'blur(14px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="absolute inset-0 -z-10 rounded-full"
        animate={{
          opacity: [0.4, 0.85, 0.4],
          scale: [0.9, 1.15, 0.9],
        }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(circle, rgba(174,33,25,0.55) 0%, rgba(255,140,0,0.18) 30%, transparent 65%)',
          filter: 'blur(40px)',
        }}
      />
      <motion.img
        src={LOGO}
        alt="Apex Auto Drive"
        className="relative w-[260px] sm:w-[340px] md:w-[420px] h-auto object-contain select-none"
        draggable={false}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
        style={{
          filter:
            'drop-shadow(0 0 18px rgba(174,33,25,0.55)) drop-shadow(0 0 40px rgba(255,140,0,0.18))',
        }}
      />
      <motion.div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 h-[3px] rounded-full"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: '70%', opacity: [0, 1, 0.6] }}
        transition={{ duration: 1, delay: 1.4, ease: 'easeOut' }}
        style={{
          background:
            'linear-gradient(90deg, transparent, #AE2119 50%, transparent)',
          boxShadow: '0 0 20px rgba(174,33,25,0.8)',
        }}
      />
    </motion.div>
  );
}

function LoadingBar({ progress }: { progress: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.6 }}
      className="absolute bottom-[14%] left-1/2 -translate-x-1/2 w-[260px] sm:w-[340px]"
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-[10px] tracking-[0.4em] uppercase"
          style={{ color: '#898989' }}
        >
          Initializing
        </span>
        <span
          className="text-[10px] tracking-[0.3em] font-mono"
          style={{ color: '#EAECEC' }}
        >
          {String(Math.floor(progress)).padStart(3, '0')}%
        </span>
      </div>
      <div
        className="relative h-[3px] w-full overflow-hidden"
        style={{ background: 'rgba(234,236,236,0.08)' }}
      >
        <motion.div
          className="absolute inset-y-0 left-0"
          style={{
            width: `${progress}%`,
            background:
              'linear-gradient(90deg, #AE2119 0%, #ff8c00 60%, #ffd400 100%)',
            boxShadow: '0 0 12px rgba(174,33,25,0.9), 0 0 22px rgba(255,140,0,0.5)',
          }}
          transition={{ ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-y-0 w-16"
          animate={{ x: ['-100%', '600%'] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          }}
        />
      </div>
      <div className="mt-3 flex gap-1.5">
        {[...Array(12)].map((_, i) => {
          const active = (progress / 100) * 12 > i;
          return (
            <motion.div
              key={i}
              className="flex-1 h-[2px]"
              animate={{
                background: active ? '#AE2119' : 'rgba(137,137,137,0.25)',
                boxShadow: active ? '0 0 8px rgba(174,33,25,0.8)' : 'none',
              }}
              transition={{ duration: 0.3 }}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const elapsed = t - start;
      const pct = Math.min(100, (elapsed / DURATION_MS) * 100);
      setProgress(pct);
      if (pct < 100) raf = requestAnimationFrame(tick);
      else setTimeout(() => setVisible(false), 350);
    };
    raf = requestAnimationFrame(tick);
    document.body.style.overflow = 'hidden';
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (!visible) document.body.style.overflow = '';
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[9999]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.05 }}
          transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
        >
          <CinematicBackground />
          <AmbientParticles />
          <SpeedStreaks />
          <LightSweep delay={0.2} />
          <LightSweep delay={2.4} />

          <div className="relative z-10 h-full w-full flex items-center justify-center">
            <AnimatedLogo />
          </div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-3"
          >
            <span className="h-px w-10" style={{ background: '#AE2119' }} />
            <span
              className="text-[10px] tracking-[0.5em] uppercase"
              style={{ color: '#EAECEC' }}
            >
              Apex Auto Drive
            </span>
            <span className="h-px w-10" style={{ background: '#AE2119' }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="absolute bottom-[8%] left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] uppercase"
            style={{ color: '#898989' }}
          >
            Premium Mobility · Drive Beyond Limits
          </motion.div>

          <LoadingBar progress={progress} />

          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.6, delay: DURATION_MS / 1000 - 0.2 }}
            style={{
              background:
                'radial-gradient(circle at center, rgba(255,200,0,0.25), rgba(174,33,25,0.15) 30%, transparent 70%)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
