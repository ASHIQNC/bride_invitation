import { useState, useEffect, useRef, useCallback } from 'react';

function useAnime() {
  const [anime, setAnime] = useState(null);
  useEffect(() => {
    if (window.anime) {
      setAnime(() => window.anime);
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js';
    s.onload = () => setAnime(() => window.anime);
    document.head.appendChild(s);
  }, []);
  return anime;
}

function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, on];
}
function Reveal({ children, delay = 0, dir = 'up', className = '' }: any) {
  const [ref, on] = useReveal();
  const t: any = {
    up: on ? 'translateY(0)' : 'translateY(60px)',
    left: on ? 'translateX(0)' : 'translateX(-60px)',
    right: on ? 'translateX(0)' : 'translateX(60px)',
    scale: on ? 'scale(1)' : 'scale(0.78)',
    fade: 'none',
  };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: on ? 1 : 0,
        transform: t[dir] || t.up,
        zIndex: 1000,
        transition: `opacity 1.1s cubic-bezier(.16,1,.3,1) ${delay}s, transform 1.1s cubic-bezier(.16,1,.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

const EDiamond = ({ size = 8, opacity = 0.5 }) => (
  <div
    style={{
      width: size,
      height: size,
      transform: 'rotate(45deg)',
      border: '1px solid #4ade80',
      opacity,
      flexShrink: 0,
      boxShadow: opacity > 0.6 ? `0 0 ${size}px rgba(74,222,128,.4)` : 'none',
    }}
  />
);

const GLine = ({ w = 48 }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      justifyContent: 'center',
    }}
  >
    <div
      style={{
        height: 1,
        width: w,
        background: 'linear-gradient(to right,transparent,#4ade80)',
      }}
    />
    <EDiamond size={5} opacity={0.6} />
    <EDiamond size={9} opacity={0.95} />
    <EDiamond size={5} opacity={0.6} />
    <div
      style={{
        height: 1,
        width: w,
        background: 'linear-gradient(to left,transparent,#4ade80)',
      }}
    />
  </div>
);

/* ── LEAF icon (corner decoration — small, not covering anything) ── */
const LeafIcon = ({ s = 30, op = 0.25 }) => (
  <svg
    viewBox='0 0 40 40'
    width={s}
    height={s}
    style={{ opacity: op, display: 'block', flexShrink: 0 }}
  >
    <path
      d='M20 35 Q8 25 8 14 Q8 5 20 5 Q32 5 32 14 Q32 25 20 35Z'
      fill='none'
      stroke='#4ade80'
      strokeWidth='1.2'
    />
    <line
      x1='20'
      y1='8'
      x2='20'
      y2='34'
      stroke='#4ade80'
      strokeWidth='0.7'
      opacity='0.6'
    />
    <path
      d='M20 14 Q26 18 28 24'
      fill='none'
      stroke='#4ade80'
      strokeWidth='0.6'
      opacity='0.5'
    />
    <path
      d='M20 14 Q14 18 12 24'
      fill='none'
      stroke='#4ade80'
      strokeWidth='0.6'
      opacity='0.5'
    />
  </svg>
);

/* ── FLOATING PARTICLES ── */
function Particles() {
  const [items] = useState(() =>
    Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      dur: 14 + Math.random() * 18,
      delay: Math.random() * 20,
      size: 10 + Math.random() * 18,
      rot: Math.random() * 360,
      kind: i % 4,
    })),
  );
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {items.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            bottom: -80,
            width: p.size,
            height: p.size,
            animation: `leafRise ${p.dur}s linear ${p.delay}s infinite`,
          }}
        >
          {p.kind === 0 && (
            <svg
              viewBox='0 0 30 38'
              style={{ transform: `rotate(${p.rot}deg)`, opacity: 0.38 }}
            >
              <ellipse cx='15' cy='19' rx='10' ry='17' fill='#1a4731' />
              <path
                d='M15 3Q18 19 15 35Q12 19 15 3'
                fill='rgba(74,222,128,.25)'
              />
            </svg>
          )}
          {p.kind === 1 && (
            <svg
              viewBox='0 0 20 20'
              style={{ transform: `rotate(${p.rot}deg)`, opacity: 0.5 }}
            >
              <polygon
                points='10,1 12,7 18,7 13,11 15,17 10,13 5,17 7,11 2,7 8,7'
                fill='rgba(212,175,80,.7)'
              />
            </svg>
          )}
          {p.kind === 2 && (
            <svg
              viewBox='0 0 16 16'
              style={{ transform: `rotate(${p.rot}deg)`, opacity: 0.55 }}
            >
              <circle cx='8' cy='8' r='3' fill='rgba(74,222,128,.55)' />
            </svg>
          )}
          {p.kind === 3 && (
            <svg
              viewBox='0 0 20 26'
              style={{ transform: `rotate(${p.rot}deg)`, opacity: 0.32 }}
            >
              <ellipse cx='10' cy='13' rx='7' ry='11' fill='#0d3320' />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── COUNTDOWN ── */
function Countdown({ targetDate }: any) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = +new Date(targetDate) - +new Date();
      if (diff <= 0) {
        setTime({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return (
    <div
      style={{
        display: 'flex',
        gap: 'clamp(10px,3.5vw,24px)',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: '0 4px',
      }}
    >
      {[
        ['Days', time.d],
        ['Hours', time.h],
        ['Minutes', time.m],
        ['Seconds', time.s],
      ].map(([label, val]) => (
        <div
          key={label}
          style={{ textAlign: 'center', minWidth: 'clamp(72px,20vw,110px)' }}
        >
          <div
            style={{
              position: 'relative',
              borderRadius: 'clamp(14px,4vw,20px)',
              padding: 'clamp(22px,6vw,36px) 8px clamp(16px,4vw,26px)',
              background:
                'linear-gradient(145deg,rgba(10,60,35,.8),rgba(5,35,20,.9))',
              border: '1px solid rgba(74,222,128,.28)',
              boxShadow:
                '0 20px 50px rgba(0,0,0,.5),0 0 30px rgba(74,222,128,.07),inset 0 1px 0 rgba(74,222,128,.12)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                background:
                  'linear-gradient(to right,transparent,rgba(74,222,128,.4),transparent)',
              }}
            />
            <div
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 'clamp(48px,13vw,76px)',
                fontWeight: 300,
                lineHeight: 1,
                background: 'linear-gradient(135deg,#4ade80,#a7f3d0,#d4af50)',
                backgroundSize: '200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {String(val).padStart(2, '0')}
            </div>
            <div style={{ position: 'absolute', top: 10, right: 10 }}>
              <EDiamond size={5} opacity={0.4} />
            </div>
            <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
              <EDiamond size={5} opacity={0.4} />
            </div>
          </div>
          <p
            style={{
              fontFamily: "'Jost',sans-serif",
              fontSize: 'clamp(8px,2.2vw,10px)',
              letterSpacing: '.42em',
              textTransform: 'uppercase',
              color: 'rgba(74,222,128,.5)',
              marginTop: 12,
              marginBottom: 0,
            }}
          >
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ── RSVP ── */
function RSVPSection({ anime }: any) {
  const [phase, setPhase] = useState<'idle' | 'accepted' | 'declined'>('idle');
  const burstRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const msgRef = useRef<HTMLDivElement>(null);

  const fireParticles = useCallback(
    (accepted: boolean) => {
      if (!anime || !burstRef.current) return;
      const c = burstRef.current;
      const colors = accepted
        ? [
            '#4ade80',
            '#a7f3d0',
            '#6ee7b7',
            '#d4af50',
            '#fef08a',
            '#86efac',
            '#34d399',
            '#fff',
          ]
        : ['#6b7280', '#9ca3af', '#d1d5db', '#94a3b8'];
      Array.from({ length: 70 }).forEach((_, i) => {
        const el = document.createElement('div'),
          size = 5 + Math.random() * 11;
        el.style.cssText = `position:absolute;top:0;left:0;width:${size}px;height:${size}px;border-radius:${i % 3 === 0 ? '50%' : i % 3 === 1 ? '0%' : '30%'};background:${colors[i % colors.length]};pointer-events:none;`;
        c.appendChild(el);
        const angle = (i / 70) * 360 + Math.random() * 8,
          dist = accepted ? 90 + Math.random() * 240 : 40 + Math.random() * 110;
        anime({
          targets: el,
          translateX: [0, Math.cos((angle * Math.PI) / 180) * dist],
          translateY: [
            0,
            Math.sin((angle * Math.PI) / 180) * dist - (accepted ? 50 : 10),
          ],
          rotate: [0, Math.random() * 720],
          scale: [
            { value: 1.5, duration: 50 },
            { value: 0, duration: 1300 + Math.random() * 500 },
          ],
          opacity: [1, 0],
          easing: 'easeOutCubic',
          delay: i * 9,
          complete: () => el.remove(),
        });
      });
      if (accepted) {
        [0, 220, 440].forEach((delay, r) => {
          const ring = document.createElement('div');
          ring.style.cssText = `position:absolute;top:0;left:0;width:4px;height:4px;border-radius:50%;border:2px solid rgba(74,222,128,.9);pointer-events:none;`;
          c.appendChild(ring);
          anime({
            targets: ring,
            scale: [0, 55 + r * 18],
            opacity: [1, 0],
            duration: 1100,
            easing: 'easeOutExpo',
            delay,
            complete: () => ring.remove(),
          });
        });
        ['🌿', '✨', '💚', '🌺', '⭐', '🍃', '💛', '🌸'].forEach((emoji, i) => {
          const el = document.createElement('div');
          el.textContent = emoji;
          el.style.cssText = `position:absolute;top:0;left:0;font-size:${14 + Math.random() * 14}px;pointer-events:none;user-select:none;`;
          c.appendChild(el);
          anime({
            targets: el,
            translateX: [0, (Math.random() - 0.5) * 200],
            translateY: [0, -(100 + Math.random() * 170)],
            rotate: [(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 60],
            opacity: [1, 0],
            scale: [0.4, 1.3, 0.2],
            duration: 1700 + Math.random() * 700,
            easing: 'easeOutCubic',
            delay: 80 + i * 90,
            complete: () => el.remove(),
          });
        });
      }
    },
    [anime],
  );

  const handleAccept = useCallback(() => {
    if (!anime || phase !== 'idle') return;
    if (cardRef.current)
      anime({
        targets: cardRef.current,
        scale: [1, 1.05, 1],
        duration: 400,
        easing: 'easeOutBack',
      });
    fireParticles(true);
    setTimeout(() => setPhase('accepted'), 100);
    setTimeout(() => {
      if (msgRef.current)
        anime({
          targets: msgRef.current,
          opacity: [0, 1],
          translateY: [30, 0],
          duration: 900,
          easing: 'easeOutExpo',
        });
    }, 180);
  }, [anime, phase, fireParticles]);
  const handleDecline = useCallback(() => {
    if (!anime || phase !== 'idle') return;
    if (cardRef.current)
      anime({
        targets: cardRef.current,
        translateX: [0, -9, 9, -5, 5, 0],
        duration: 420,
        easing: 'easeInOutSine',
      });
    fireParticles(false);
    setTimeout(() => setPhase('declined'), 100);
    setTimeout(() => {
      if (msgRef.current)
        anime({
          targets: msgRef.current,
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 800,
          easing: 'easeOutExpo',
        });
    }, 180);
  }, [anime, phase, fireParticles]);

  return (
    <section
      style={{
        position: 'relative',
        zIndex: 10,
        width: '100vw',
        boxSizing: 'border-box',
        padding: 'clamp(70px,15vw,110px) 20px',
        textAlign: 'center',
        background:
          'linear-gradient(180deg,rgba(2,20,10,0.7) 0%,rgba(5,40,20,0.45) 50%,rgba(2,20,10,0.7) 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          pointerEvents: 'none',
          zIndex: 100,
        }}
      >
        <div
          ref={burstRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none',
          }}
        />
      </div>
      <Reveal>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            marginBottom: 44,
          }}
        >
          <div
            style={{
              height: 1,
              flex: 1,
              maxWidth: 70,
              background:
                'linear-gradient(to right,transparent,rgba(74,222,128,.4))',
            }}
          />
          <span
            style={{
              fontFamily: "'Jost',sans-serif",
              fontSize: 'clamp(9px,2.5vw,11px)',
              letterSpacing: '.5em',
              textTransform: 'uppercase',
              color: 'rgba(74,222,128,.8)',
              padding: '7px 18px',
              border: '1px solid rgba(74,222,128,.3)',
              borderRadius: 50,
              background: 'rgba(74,222,128,.06)',
              whiteSpace: 'nowrap',
            }}
          >
            {phase === 'idle'
              ? '💌\u00a0\u00a0RSVP'
              : phase === 'accepted'
                ? "🌿\u00a0\u00a0We're Overjoyed"
                : '🌿\u00a0\u00a0With Love'}
          </span>
          <div
            style={{
              height: 1,
              flex: 1,
              maxWidth: 70,
              background:
                'linear-gradient(to left,transparent,rgba(74,222,128,.4))',
            }}
          />
        </div>
      </Reveal>
      <Reveal dir='scale'>
        <div
          ref={cardRef}
          style={{
            maxWidth: 420,
            margin: '0 auto',
            borderRadius: 'clamp(20px,6vw,30px)',
            padding: 'clamp(36px,10vw,60px) clamp(24px,8vw,48px)',
            background:
              'linear-gradient(145deg,rgba(5,40,22,.8),rgba(2,22,12,.92))',
            border: `1px solid ${phase === 'accepted' ? 'rgba(74,222,128,.55)' : phase === 'declined' ? 'rgba(100,120,110,.3)' : 'rgba(74,222,128,.25)'}`,
            boxShadow: `0 0 120px rgba(20,80,45,.4),0 70px 140px rgba(0,0,0,.7),inset 0 1px 0 rgba(74,222,128,.08)${phase === 'accepted' ? ',0 0 80px rgba(74,222,128,.2)' : ''}`,
            position: 'relative',
            overflow: 'hidden',
            transition: 'border .5s,box-shadow .5s',
            animation:
              phase === 'accepted'
                ? 'emeraldGlow 2.5s ease-in-out infinite'
                : undefined,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse at 50% 0%,rgba(74,222,128,.1) 0%,transparent 60%)',
              pointerEvents: 'none',
            }}
          />
          {phase === 'idle' && (
            <>
              <p
                style={{
                  fontFamily: "'Jost',sans-serif",
                  fontSize: 'clamp(9px,2.5vw,10px)',
                  letterSpacing: '.45em',
                  textTransform: 'uppercase',
                  color: 'rgba(74,222,128,.5)',
                  marginBottom: 14,
                  marginTop: 0,
                }}
              >
                Kindly Reply
              </p>
              <h3
                style={{
                  fontFamily: "'Great Vibes',cursive",
                  fontSize: 'clamp(42px,13vw,60px)',
                  color: '#d4f4e6',
                  textShadow: '0 0 60px rgba(74,222,128,.4)',
                  lineHeight: 1.1,
                  margin: '0 0 20px',
                }}
              >
                Will you
                <br />
                join us?
              </h3>
              <div style={{ margin: '18px 0' }}>
                <GLine w={36} />
              </div>
              <p
                style={{
                  fontFamily: "'Jost',sans-serif",
                  fontSize: 'clamp(10px,3vw,13px)',
                  fontWeight: 300,
                  color: 'rgba(74,222,128,.35)',
                  letterSpacing: '.1em',
                  marginBottom: 32,
                  marginTop: 0,
                }}
              >
                We'd love to celebrate with you
              </p>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
              >
                <button
                  onClick={handleAccept}
                  style={{
                    width: '100%',
                    padding: 'clamp(15px,4.5vw,19px)',
                    borderRadius: 50,
                    fontFamily: "'Jost',sans-serif",
                    fontSize: 'clamp(10px,3vw,12px)',
                    letterSpacing: '.32em',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                    background:
                      'linear-gradient(135deg,#16a34a,#4ade80,#16a34a)',
                    color: '#021a0e',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 14px 40px rgba(74,222,128,.3)',
                    transition: 'transform .2s,box-shadow .2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      'translateY(-3px) scale(1.02)';
                    e.currentTarget.style.boxShadow =
                      '0 22px 55px rgba(74,222,128,.45)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow =
                      '0 14px 40px rgba(74,222,128,.3)';
                  }}
                  onTouchStart={(e) =>
                    (e.currentTarget.style.transform = 'scale(.97)')
                  }
                  onTouchEnd={(e) => (e.currentTarget.style.transform = 'none')}
                >
                  ✦ Joyfully Accept ✦
                </button>
                <button
                  onClick={handleDecline}
                  style={{
                    width: '100%',
                    padding: 'clamp(15px,4.5vw,19px)',
                    borderRadius: 50,
                    fontFamily: "'Jost',sans-serif",
                    fontSize: 'clamp(10px,3vw,12px)',
                    letterSpacing: '.32em',
                    textTransform: 'uppercase',
                    background: 'transparent',
                    color: 'rgba(74,222,128,.4)',
                    border: '1px solid rgba(74,222,128,.2)',
                    cursor: 'pointer',
                    transition: 'background .25s',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = 'rgba(74,222,128,.07)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = 'transparent')
                  }
                >
                  Regretfully Decline
                </button>
              </div>
            </>
          )}
          {phase === 'accepted' && (
            <div ref={msgRef} style={{ opacity: 0 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: 22,
                }}
              >
                <div style={{ position: 'relative', width: 96, height: 96 }}>
                  <svg
                    viewBox='0 0 96 96'
                    width='96'
                    height='96'
                    style={{ position: 'absolute', inset: 0 }}
                  >
                    <circle
                      cx='48'
                      cy='48'
                      r='44'
                      fill='none'
                      stroke='rgba(74,222,128,.15)'
                      strokeWidth='2'
                    />
                    <circle
                      cx='48'
                      cy='48'
                      r='44'
                      fill='none'
                      stroke='url(#eGrad)'
                      strokeWidth='2.5'
                      strokeLinecap='round'
                      strokeDasharray='276'
                      strokeDashoffset='276'
                      style={{
                        animation: 'circleReveal 1.2s ease .1s forwards',
                        transformOrigin: 'center',
                        transform: 'rotate(-90deg)',
                      }}
                    />
                    <defs>
                      <linearGradient
                        id='eGrad'
                        x1='0%'
                        y1='0%'
                        x2='100%'
                        y2='100%'
                      >
                        <stop offset='0%' stopColor='#16a34a' />
                        <stop offset='100%' stopColor='#4ade80' />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 36,
                      animation:
                        'popIn .6s cubic-bezier(.34,1.56,.64,1) .4s both',
                    }}
                  >
                    🌿
                  </div>
                </div>
              </div>
              <h3
                style={{
                  fontFamily: "'Great Vibes',cursive",
                  fontSize: 'clamp(36px,11vw,54px)',
                  color: '#d4f4e6',
                  textShadow: '0 0 80px rgba(74,222,128,.6)',
                  lineHeight: 1.15,
                  margin: '0 0 14px',
                }}
              >
                We're so happy!
              </h3>
              <div style={{ margin: '14px 0' }}>
                <GLine w={36} />
              </div>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: 'clamp(15px,4.5vw,19px)',
                  fontStyle: 'italic',
                  color: 'rgba(200,242,215,.7)',
                  lineHeight: 1.9,
                  margin: '0 0 18px',
                }}
              >
                Your presence will make our day
                <br />
                truly unforgettable. ✨
              </p>
              <p
                style={{
                  fontFamily: "'Jost',sans-serif",
                  fontSize: 'clamp(9px,2.5vw,11px)',
                  letterSpacing: '.35em',
                  textTransform: 'uppercase',
                  color: 'rgba(74,222,128,.45)',
                  marginBottom: 24,
                  marginTop: 0,
                }}
              >
                April 4, 2026 · 4:00 PM
              </p>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 'clamp(10px,3vw,18px)',
                  fontSize: 'clamp(18px,5vw,24px)',
                  marginBottom: 28,
                }}
              >
                {['🌿', '💚', '🌺', '✨', '🤲'].map((e, i) => (
                  <span
                    key={i}
                    style={{
                      display: 'inline-block',
                      animation: `floatBob 2.2s ease-in-out ${i * 0.18}s infinite`,
                    }}
                  >
                    {e}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setPhase('idle')}
                style={{
                  padding: '10px 28px',
                  borderRadius: 50,
                  fontFamily: "'Jost',sans-serif",
                  fontSize: 'clamp(8px,2.2vw,10px)',
                  letterSpacing: '.3em',
                  textTransform: 'uppercase',
                  background: 'transparent',
                  color: 'rgba(74,222,128,.3)',
                  border: '1px solid rgba(74,222,128,.12)',
                  cursor: 'pointer',
                }}
              >
                ← Go back
              </button>
            </div>
          )}
          {phase === 'declined' && (
            <div ref={msgRef} style={{ opacity: 0 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: 20,
                  fontSize: 'clamp(42px,14vw,58px)',
                  animation: 'popIn .7s cubic-bezier(.34,1.56,.64,1) .1s both',
                }}
              >
                🍃
              </div>
              <h3
                style={{
                  fontFamily: "'Great Vibes',cursive",
                  fontSize: 'clamp(32px,10vw,50px)',
                  color: '#d4f4e6',
                  textShadow: '0 0 40px rgba(74,222,128,.3)',
                  lineHeight: 1.2,
                  margin: '0 0 14px',
                }}
              >
                You'll be missed
              </h3>
              <div style={{ margin: '14px 0' }}>
                <GLine w={36} />
              </div>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: 'clamp(15px,4.5vw,18px)',
                  fontStyle: 'italic',
                  color: 'rgba(200,242,215,.6)',
                  lineHeight: 1.9,
                  margin: '0 0 26px',
                }}
              >
                We understand completely.
                <br />
                You'll be in our hearts & duas. 🍃
              </p>
              <button
                onClick={() => setPhase('idle')}
                style={{
                  padding: 'clamp(12px,3.5vw,15px) clamp(22px,6vw,32px)',
                  borderRadius: 50,
                  fontFamily: "'Jost',sans-serif",
                  fontSize: 'clamp(9px,2.5vw,11px)',
                  letterSpacing: '.28em',
                  textTransform: 'uppercase',
                  background: 'linear-gradient(135deg,#16a34a,#4ade80,#16a34a)',
                  color: '#021a0e',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 30px rgba(74,222,128,.2)',
                }}
              >
                ← Change my mind
              </button>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════ */
export default function BrideInvitation() {
  const anime = useAnime();
  const [envPhase, setEnvPhase] = useState<'closed' | 'opening' | 'done'>(
    'closed',
  );
  const [opened, setOpened] = useState(false);

  const burstRef = useRef<HTMLDivElement>(null);
  const namesRef = useRef<HTMLElement>(null);
  const brideRef = useRef<HTMLDivElement>(null);
  const ampRef = useRef<HTMLDivElement>(null);
  const groomRef = useRef<HTMLDivElement>(null);

  // Envelope parts
  const envWrapRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);

  // Hero entrance
  useEffect(() => {
    if (!anime || !heroTextRef.current) return;
    setTimeout(() => {
      anime({
        targets: heroTextRef.current,
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 1200,
        easing: 'easeOutExpo',
      });
    }, 200);
  }, [anime]);

  /* ── ENVELOPE OPEN ANIMATION ── */
  const handleOpen = useCallback(() => {
    if (!anime || envPhase !== 'closed') return;
    setEnvPhase('opening');

    // 1. Flap lifts open (rotateX around top edge)
    anime({
      targets: flapRef.current,
      rotateX: [0, -180],
      duration: 700,
      easing: 'cubicBezier(0.4,0,0.2,1)',
    });

    // 2. Letter rises out of envelope
    setTimeout(() => {
      anime({
        targets: letterRef.current,
        translateY: [0, -120],
        scale: [0.9, 1.05],
        opacity: [0.6, 1],
        duration: 700,
        easing: 'easeOutBack',
      });
    }, 500);

    // 3. Green sparks burst
    setTimeout(() => {
      if (!burstRef.current) return;
      const c = burstRef.current;
      const colors = [
        '#4ade80',
        '#a7f3d0',
        '#d4af50',
        '#fef08a',
        '#6ee7b7',
        '#fff',
      ];
      Array.from({ length: 45 }).forEach((_, i) => {
        const el = document.createElement('div'),
          sz = 4 + Math.random() * 9;
        el.style.cssText = `position:absolute;top:0;left:0;width:${sz}px;height:${sz}px;border-radius:${i % 2 ? '50%' : '2px'};background:${colors[i % colors.length]};pointer-events:none;`;
        c.appendChild(el);
        const a = (i / 45) * 360,
          dist = 50 + Math.random() * 150;
        anime({
          targets: el,
          translateX: [0, Math.cos((a * Math.PI) / 180) * dist],
          translateY: [0, Math.sin((a * Math.PI) / 180) * dist],
          scale: [1.2, 0],
          opacity: [1, 0],
          duration: 900 + Math.random() * 400,
          easing: 'easeOutCubic',
          delay: i * 14,
          complete: () => el.remove(),
        });
      });
    }, 550);

    // 4. Envelope fades, reveal names
    setTimeout(() => {
      anime({
        targets: envWrapRef.current,
        opacity: [1, 0],
        scale: [1, 0.9],
        translateY: [0, -40],
        duration: 600,
        easing: 'easeInCubic',
        complete: () => {
          setEnvPhase('done');
          setOpened(true);
          setTimeout(
            () =>
              namesRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              }),
            100,
          );
        },
      });
    }, 1200);
  }, [anime, envPhase]);

  // Names reveal
  useEffect(() => {
    if (!opened || !anime) return;
    setTimeout(() => {
      if (brideRef.current)
        anime({
          targets: brideRef.current,
          clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'],
          opacity: [0, 1],
          duration: 1400,
          easing: 'easeOutExpo',
          delay: 200,
        });
      if (ampRef.current)
        anime({
          targets: ampRef.current,
          opacity: [0, 1],
          scale: [0.5, 1],
          duration: 900,
          easing: 'easeOutBack',
          delay: 900,
        });
      if (groomRef.current)
        anime({
          targets: groomRef.current,
          clipPath: ['inset(0 0% 0 100%)', 'inset(0 0% 0 0%)'],
          opacity: [0, 1],
          duration: 1400,
          easing: 'easeOutExpo',
          delay: 1200,
        });
    }, 300);
  }, [opened, anime]);

  return (
    <div
      style={{
        minHeight: '100dvh',
        width: '100vw',
        maxWidth: '100vw',
        overflowX: 'hidden',
        background:
          'linear-gradient(160deg,#020e06 0%,#041c0c 35%,#061408 70%,#020b05 100%)',
        fontFamily: "'Cormorant Garamond',serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Great+Vibes&family=Jost:wght@200;300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;-webkit-tap-highlight-color:transparent;margin:0}
        html,body{margin:0;padding:0;width:100%;max-width:100%;-webkit-font-smoothing:antialiased;overflow-x:hidden}

        @keyframes leafRise{0%{transform:translateY(110dvh) rotate(0deg) translateX(0);opacity:0}8%{opacity:.4}50%{transform:translateY(50dvh) rotate(180deg) translateX(24px)}92%{opacity:.3}100%{transform:translateY(-10dvh) rotate(360deg) translateX(-18px);opacity:0}}
        @keyframes emeraldShine{0%{background-position:-300% center}100%{background-position:300% center}}
        @keyframes tapPulse{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-6px) scale(1.04)}}
        @keyframes envFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes shimmer{0%,100%{opacity:.4}50%{opacity:.9}}
        @keyframes bgBreath{0%,100%{opacity:.1}50%{opacity:.22}}
        @keyframes emeraldGlow{0%,100%{box-shadow:0 0 30px rgba(74,222,128,.15),0 70px 140px rgba(0,0,0,.7)}50%{box-shadow:0 0 80px rgba(74,222,128,.4),0 70px 140px rgba(0,0,0,.7)}}
        @keyframes circleReveal{to{stroke-dashoffset:0}}
        @keyframes popIn{0%{transform:scale(0) rotate(-20deg);opacity:0}70%{transform:scale(1.15) rotate(5deg)}100%{transform:scale(1);opacity:1}}
        @keyframes floatBob{0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-10px) rotate(4deg)}}
        @keyframes rotateSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes sealPulse{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.12);opacity:1}}
        @keyframes flapWiggle{0%,100%{transform:rotateX(0deg)}50%{transform:rotateX(-8deg)}}

        .emerald-text{background:linear-gradient(90deg,#16a34a 0%,#4ade80 30%,#a7f3d0 50%,#4ade80 70%,#16a34a 100%);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:emeraldShine 5s linear infinite}
        .shimmer{animation:shimmer 3s ease-in-out infinite}
        .env-float{animation:envFloat 4s ease-in-out infinite}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#4ade80;border-radius:2px}
        .story-card-cell{width:100%;display:flex;flex-direction:column;}
        .story-card-cell > div{flex:1;}
        @media(max-width:400px){html{font-size:14px}}
      `}</style>

      <Particles />
      {/* burst origin */}
      <div
        ref={burstRef}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          pointerEvents: 'none',
          zIndex: 999,
        }}
      />

      {/* ══ HERO — ENVELOPE ══ */}
      {!opened && (
        <section
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100vw',
            height: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 20px',
            overflow: 'hidden',
          }}
        >
          {/* ambient glow */}
          <div
            style={{
              position: 'absolute',
              width: 'min(700px,150vw)',
              height: 'min(700px,150vh)',
              borderRadius: '50%',
              background:
                'radial-gradient(circle,rgba(20,100,45,.18) 0%,transparent 65%)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
              pointerEvents: 'none',
              animation: 'bgBreath 5s ease-in-out infinite',
            }}
          />
          {/* slow rotating geometric ring */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
              width: 'min(480px,108vw)',
              height: 'min(480px,108vw)',
              pointerEvents: 'none',
              animation: 'rotateSlow 50s linear infinite',
              opacity: 0.05,
            }}
          >
            <svg viewBox='0 0 480 480' width='100%' height='100%'>
              {Array.from({ length: 12 }).map((_, i) => {
                const a = (i / 12) * Math.PI * 2;
                return (
                  <line
                    key={i}
                    x1={240 + 190 * Math.cos(a)}
                    y1={240 + 190 * Math.sin(a)}
                    x2={240 + 230 * Math.cos(a)}
                    y2={240 + 230 * Math.sin(a)}
                    stroke='#4ade80'
                    strokeWidth='1'
                  />
                );
              })}
              <circle
                cx='240'
                cy='240'
                r='190'
                fill='none'
                stroke='#4ade80'
                strokeWidth='.5'
              />
              <circle
                cx='240'
                cy='240'
                r='230'
                fill='none'
                stroke='#4ade80'
                strokeWidth='.4'
              />
              {Array.from({ length: 6 }).map((_, i) => {
                const a = (i / 6) * Math.PI * 2;
                return (
                  <circle
                    key={i}
                    cx={240 + 210 * Math.cos(a)}
                    cy={240 + 210 * Math.sin(a)}
                    r='2'
                    fill='#4ade80'
                  />
                );
              })}
            </svg>
          </div>

          <div
            ref={heroTextRef}
            style={{
              opacity: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              maxWidth: 440,
            }}
          >
            <p
              className='shimmer'
              style={{
                fontFamily: "'Jost',sans-serif",
                fontSize: 'clamp(9px,2.4vw,11px)',
                letterSpacing: '.5em',
                textTransform: 'uppercase',
                color: '#4ade80',
                marginBottom: 28,
                textAlign: 'center',
              }}
            >
              A Wedding Invitation
            </p>

            {/* ══ ENVELOPE ══ */}
            {envPhase !== 'done' && (
              <div
                ref={envWrapRef}
                className={envPhase === 'closed' ? 'env-float' : ''}
                onClick={handleOpen}
                style={{
                  width: '100%',
                  maxWidth: 380,
                  cursor: envPhase === 'closed' ? 'pointer' : 'default',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  perspective: '800px',
                  perspectiveOrigin: '50% 60%',
                }}
              >
                <div style={{ position: 'relative', paddingBottom: '70%' }}>
                  {/* ── ENVELOPE BODY ── */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 'clamp(10px,3vw,16px)',
                      background:
                        'linear-gradient(170deg,#0a3018 0%,#062012 60%,#031409 100%)',
                      boxShadow:
                        '0 40px 100px rgba(0,0,0,.85),0 0 0 1px rgba(74,222,128,.2),0 0 50px rgba(20,80,40,.25)',
                      overflow: 'hidden',
                    }}
                  >
                    {/* V-fold lines on envelope body */}
                    <svg
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0.15,
                      }}
                      viewBox='0 0 380 270'
                      preserveAspectRatio='none'
                    >
                      <line
                        x1='0'
                        y1='270'
                        x2='190'
                        y2='130'
                        stroke='#4ade80'
                        strokeWidth='.8'
                      />
                      <line
                        x1='380'
                        y1='270'
                        x2='190'
                        y2='130'
                        stroke='#4ade80'
                        strokeWidth='.8'
                      />
                      <line
                        x1='0'
                        y1='0'
                        x2='190'
                        y2='130'
                        stroke='#4ade80'
                        strokeWidth='.5'
                        opacity='.4'
                      />
                      <line
                        x1='380'
                        y1='0'
                        x2='190'
                        y2='130'
                        stroke='#4ade80'
                        strokeWidth='.5'
                        opacity='.4'
                      />
                    </svg>
                    {/* subtle border inside */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 8,
                        borderRadius: 10,
                        border: '1px solid rgba(74,222,128,.15)',
                      }}
                    />

                    {/* corner leaf accents — small, tucked in corners */}
                    <div style={{ position: 'absolute', top: 6, left: 6 }}>
                      <LeafIcon s={22} op={0.3} />
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        transform: 'scaleX(-1)',
                      }}
                    >
                      <LeafIcon s={22} op={0.3} />
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 6,
                        left: 6,
                        transform: 'scaleY(-1)',
                      }}
                    >
                      <LeafIcon s={22} op={0.3} />
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 6,
                        right: 6,
                        transform: 'scale(-1)',
                      }}
                    >
                      <LeafIcon s={22} op={0.3} />
                    </div>

                    {/* Diamond row across middle */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '48%',
                        left: 0,
                        right: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 8,
                        alignItems: 'center',
                      }}
                    >
                      {Array.from({ length: 9 }).map((_, i) => (
                        <EDiamond
                          key={i}
                          size={i === 4 ? 8 : 5}
                          opacity={i === 4 ? 0.55 : 0.2}
                        />
                      ))}
                    </div>

                    {/* Bottom text */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 18,
                        left: 0,
                        right: 0,
                        textAlign: 'center',
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "'Cormorant Garamond',serif",
                          fontSize: 'clamp(11px,3vw,13px)',
                          fontStyle: 'italic',
                          color: 'rgba(167,243,208,.28)',
                          letterSpacing: 2,
                          margin: 0,
                        }}
                      >
                        Together with their families
                      </p>
                    </div>
                  </div>

                  {/* ── FLAP (top triangle that lifts) ── */}
                  <div
                    ref={flapRef}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '52%',
                      transformOrigin: 'top center',
                      transformStyle: 'preserve-3d',
                      zIndex: 4,
                      pointerEvents: 'none',
                    }}
                  >
                    <svg
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                      }}
                      viewBox='0 0 380 140'
                      preserveAspectRatio='none'
                    >
                      {/* flap fill */}
                      <path
                        d='M0 0 L380 0 L190 135 Z'
                        fill='url(#flapGrad)'
                        opacity='.95'
                      />
                      {/* flap border */}
                      <path
                        d='M0 0 L380 0 L190 135 Z'
                        fill='none'
                        stroke='rgba(74,222,128,.3)'
                        strokeWidth='1'
                      />
                      <defs>
                        <linearGradient
                          id='flapGrad'
                          x1='0'
                          y1='0'
                          x2='0'
                          y2='1'
                        >
                          <stop offset='0%' stopColor='#0c3820' />
                          <stop offset='100%' stopColor='#041810' />
                        </linearGradient>
                      </defs>
                    </svg>
                    {/* Wax seal on flap center */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: -18,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 5,
                      }}
                    >
                      <div
                        style={{ position: 'relative', width: 54, height: 54 }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            inset: -6,
                            borderRadius: '50%',
                            background:
                              'radial-gradient(circle,rgba(74,222,128,.5) 0%,transparent 70%)',
                            animation: 'sealPulse 2.5s ease-in-out infinite',
                          }}
                        />
                        <svg viewBox='0 0 54 54' width='54' height='54'>
                          <circle
                            cx='27'
                            cy='27'
                            r='25'
                            fill='#0a3820'
                            stroke='rgba(74,222,128,.5)'
                            strokeWidth='1'
                          />
                          {Array.from({ length: 20 }).map((_, i) => {
                            const a = (i / 20) * Math.PI * 2;
                            return (
                              <circle
                                key={i}
                                cx={27 + 22 * Math.cos(a)}
                                cy={27 + 22 * Math.sin(a)}
                                r='.8'
                                fill='#4ade80'
                                opacity='.5'
                              />
                            );
                          })}
                          <circle
                            cx='27'
                            cy='27'
                            r='14'
                            fill='none'
                            stroke='rgba(74,222,128,.35)'
                            strokeWidth='.8'
                          />
                        </svg>
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "'Great Vibes',cursive",
                              fontSize: 13,
                              color: '#a7f3d0',
                              lineHeight: 1,
                            }}
                          >
                            S
                          </span>
                          <span
                            style={{
                              fontFamily: "'Cormorant Garamond',serif",
                              fontSize: 7,
                              color: '#6ee7b7',
                              letterSpacing: 1,
                            }}
                          >
                            &amp;
                          </span>
                          <span
                            style={{
                              fontFamily: "'Great Vibes',cursive",
                              fontSize: 11,
                              color: '#a7f3d0',
                              lineHeight: 1,
                            }}
                          >
                            A
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── LETTER rising from inside ── */}
                  <div
                    ref={letterRef}
                    style={{
                      position: 'absolute',
                      top: '8%',
                      left: '8%',
                      right: '8%',
                      opacity: 0,
                      zIndex: 2,
                      borderRadius: 'clamp(8px,2vw,12px)',
                      background: 'linear-gradient(160deg,#0d4025,#062014)',
                      border: '1px solid rgba(74,222,128,.22)',
                      padding: 'clamp(16px,5vw,24px) clamp(14px,4vw,20px)',
                      boxShadow: '0 20px 60px rgba(0,0,0,.6)',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <p
                        style={{
                          fontFamily: "'Jost',sans-serif",
                          fontSize: 'clamp(8px,2.2vw,10px)',
                          letterSpacing: '.4em',
                          textTransform: 'uppercase',
                          color: 'rgba(74,222,128,.5)',
                          marginBottom: 8,
                          marginTop: 0,
                        }}
                      >
                        You are cordially invited
                      </p>
                      <div style={{ margin: '6px 0' }}>
                        <GLine w={24} />
                      </div>
                      <p
                        style={{
                          fontFamily: "'Great Vibes',cursive",
                          fontSize: 'clamp(26px,8vw,36px)',
                          color: '#d4f4e6',
                          textShadow: '0 0 40px rgba(74,222,128,.4)',
                          lineHeight: 1.2,
                          margin: '8px 0 4px',
                        }}
                      >
                        Shamida
                      </p>
                      <p
                        style={{
                          fontFamily: "'Cormorant Garamond',serif",
                          fontSize: 'clamp(10px,3vw,13px)',
                          fontStyle: 'italic',
                          color: 'rgba(167,243,208,.45)',
                          letterSpacing: 3,
                          margin: '0 0 4px',
                        }}
                      >
                        &amp;
                      </p>
                      <p
                        style={{
                          fontFamily: "'Great Vibes',cursive",
                          fontSize: 'clamp(22px,7vw,30px)',
                          color: '#d4f4e6',
                          textShadow: '0 0 30px rgba(74,222,128,.3)',
                          lineHeight: 1.2,
                          margin: '0 0 8px',
                        }}
                      >
                        Ashiq Rahman
                      </p>
                      <div style={{ margin: '6px 0' }}>
                        <GLine w={24} />
                      </div>
                      <p
                        style={{
                          fontFamily: "'Jost',sans-serif",
                          fontSize: 'clamp(8px,2.2vw,9px)',
                          letterSpacing: '.3em',
                          textTransform: 'uppercase',
                          color: 'rgba(74,222,128,.4)',
                          marginTop: 8,
                          marginBottom: 0,
                        }}
                      >
                        April 4, 2026
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {envPhase === 'closed' && (
              <p
                style={{
                  fontFamily: "'Jost',sans-serif",
                  fontSize: 'clamp(9px,2.4vw,11px)',
                  letterSpacing: '.38em',
                  textTransform: 'uppercase',
                  color: 'rgba(74,222,128,.38)',
                  marginTop: 22,
                  animation: 'tapPulse 2s ease-in-out infinite',
                  textAlign: 'center',
                }}
              >
                ✦ Tap to Open ✦
              </p>
            )}
          </div>
        </section>
      )}

      {/* ══ OPENED CONTENT ══ */}
      {opened && (
        <>
          {/* ── NAMES ── */}
          <section
            ref={namesRef}
            style={{
              position: 'relative',
              zIndex: 10,
              width: '100vw',
              boxSizing: 'border-box',
              minHeight: '140dvh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'clamp(80px,14vw,140px) 24px clamp(80px,14vw,120px)',
              textAlign: 'center',
              overflow: 'hidden',
              background:
                'linear-gradient(180deg,rgba(5,40,15,0.2) 0%,transparent 40%,rgba(5,40,15,0.2) 100%)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background:
                  'linear-gradient(to right,transparent,rgba(74,222,128,.3),rgba(74,222,128,.6),rgba(74,222,128,.3),transparent)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 2,
                background:
                  'linear-gradient(to right,transparent,rgba(74,222,128,.3),rgba(74,222,128,.6),rgba(74,222,128,.3),transparent)',
              }}
            />
            {/* faint geometric bg pattern */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                opacity: 0.03,
              }}
            >
              <svg
                viewBox='0 0 400 600'
                width='100%'
                height='100%'
                preserveAspectRatio='xMidYMid slice'
              >
                {Array.from({ length: 10 }).map((_, i) => (
                  <circle
                    key={i}
                    cx='200'
                    cy='300'
                    r={40 + i * 30}
                    fill='none'
                    stroke='#4ade80'
                    strokeWidth='.5'
                  />
                ))}
              </svg>
            </div>
            <div
              style={{
                position: 'absolute',
                width: 'min(520px,120vw)',
                height: 'min(520px,120vw)',
                borderRadius: '50%',
                background:
                  'radial-gradient(circle,rgba(30,110,60,.18) 0%,transparent 70%)',
                top: '30%',
                left: '50%',
                transform: 'translate(-50%,-50%)',
                pointerEvents: 'none',
              }}
            />

            <Reveal dir='scale'>
              <p
                style={{
                  fontFamily: "'Jost',sans-serif",
                  fontSize: 'clamp(9px,2.4vw,11px)',
                  letterSpacing: '.55em',
                  textTransform: 'uppercase',
                  color: 'rgba(74,222,128,.65)',
                  marginBottom: 32,
                  padding: '8px 20px',
                  border: '1px solid rgba(74,222,128,.2)',
                  borderRadius: 50,
                  background: 'rgba(74,222,128,.05)',
                }}
              >
                ✦ &nbsp; You Are Invited &nbsp; ✦
              </p>
            </Reveal>

            <div
              ref={brideRef}
              style={{
                opacity: 0,
                clipPath: 'inset(0 100% 0 0)',
                width: '100%',
                textAlign: 'center',
              }}
            >
              <h1
                style={{
                  fontFamily: "'Great Vibes',cursive",
                  fontSize: 'clamp(52px,14vw,130px)',
                  color: '#d4f4e6',
                  textShadow:
                    '0 0 100px rgba(74,222,128,.5),0 0 40px rgba(74,222,128,.22),0 6px 32px rgba(0,0,0,.7)',
                  lineHeight: 1.5,
                  margin: 0,
                  letterSpacing: 2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                }}
              >
                shamida
              </h1>
              <p
                style={{
                  fontFamily: "'Jost',sans-serif",
                  fontSize: 'clamp(9px,2.4vw,11px)',
                  letterSpacing: '.45em',
                  textTransform: 'uppercase',
                  color: 'rgba(74,222,128,.5)',
                  marginTop: 10,
                  marginBottom: 0,
                }}
              >
                Bride
              </p>
            </div>

            <div
              ref={ampRef}
              style={{ opacity: 0, margin: 'clamp(20px,5vw,36px) 0' }}
            >
              <GLine w={Math.min(80, window.innerWidth * 0.14)} />
              <p
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: 'clamp(22px,6vw,36px)',
                  fontStyle: 'italic',
                  color: 'rgba(74,222,128,.6)',
                  margin: '10px 0',
                  letterSpacing: 6,
                }}
              >
                and
              </p>
              <GLine w={Math.min(80, window.innerWidth * 0.14)} />
            </div>

            <div
              ref={groomRef}
              style={{
                opacity: 0,
                clipPath: 'inset(0 0% 0 100%)',
                width: '100%',
                textAlign: 'center',
              }}
            >
              <h1
                style={{
                  fontFamily: "'Great Vibes',cursive",
                  fontSize: 'clamp(52px,14vw,130px)',
                  color: '#d4f4e6',
                  textShadow:
                    '0 0 100px rgba(74,222,128,.5),0 0 40px rgba(74,222,128,.22),0 6px 32px rgba(0,0,0,.7)',
                  lineHeight: 1.5,
                  margin: 0,
                  letterSpacing: 2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                }}
              >
                ashiq rahman
              </h1>
              <p
                style={{
                  fontFamily: "'Jost',sans-serif",
                  fontSize: 'clamp(9px,2.4vw,11px)',
                  letterSpacing: '.45em',
                  textTransform: 'uppercase',
                  color: 'rgba(74,222,128,.5)',
                  marginTop: 10,
                  marginBottom: 0,
                }}
              >
                Groom
              </p>
            </div>

            <Reveal delay={1.6}>
              <p
                style={{
                  fontFamily: "'Jost',sans-serif",
                  fontSize: 'clamp(10px,2.8vw,13px)',
                  letterSpacing: '.38em',
                  textTransform: 'uppercase',
                  color: 'rgba(74,222,128,.4)',
                  marginTop: 36,
                  padding: '12px 28px',
                  borderTop: '1px solid rgba(74,222,128,.15)',
                  borderBottom: '1px solid rgba(74,222,128,.15)',
                }}
              >
                Are Getting Married · April 4, 2026
              </p>
            </Reveal>
            <Reveal delay={2}>
              <div
                style={{
                  marginTop: 50,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  opacity: 0.4,
                }}
              >
                <div
                  style={{
                    width: 1,
                    height: 50,
                    background:
                      'linear-gradient(to bottom,transparent,#4ade80)',
                  }}
                />
                <p
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: 9,
                    letterSpacing: '.42em',
                    textTransform: 'uppercase',
                    color: '#4ade80',
                    margin: 0,
                  }}
                >
                  scroll
                </p>
              </div>
            </Reveal>
          </section>

          {/* ── DATE ── */}
          <section
            style={{
              position: 'relative',
              zIndex: 10,
              width: '100vw',
              boxSizing: 'border-box',
              padding: 'clamp(64px,14vw,100px) 20px',
              background:
                'linear-gradient(180deg,rgba(2,15,8,0.8) 0%,rgba(5,35,18,0.5) 50%,rgba(2,15,8,0.8) 100%)',
              borderTop: '1px solid rgba(74,222,128,.1)',
              borderBottom: '1px solid rgba(74,222,128,.1)',
            }}
          >
            <Reveal>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 14,
                  marginBottom: 42,
                }}
              >
                <div
                  style={{
                    height: 1,
                    flex: 1,
                    maxWidth: 70,
                    background:
                      'linear-gradient(to right,transparent,rgba(74,222,128,.4))',
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: 'clamp(9px,2.5vw,11px)',
                    letterSpacing: '.5em',
                    textTransform: 'uppercase',
                    color: 'rgba(74,222,128,.75)',
                    padding: '7px 18px',
                    border: '1px solid rgba(74,222,128,.28)',
                    borderRadius: 50,
                    background: 'rgba(74,222,128,.05)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  📅 &nbsp; Date &amp; Venue
                </span>
                <div
                  style={{
                    height: 1,
                    flex: 1,
                    maxWidth: 70,
                    background:
                      'linear-gradient(to left,transparent,rgba(74,222,128,.4))',
                  }}
                />
              </div>
            </Reveal>
            <Reveal dir='scale'>
              <div
                style={{
                  maxWidth: 440,
                  margin: '0 auto',
                  borderRadius: 'clamp(18px,5vw,26px)',
                  padding: 'clamp(32px,9vw,56px) clamp(24px,7vw,48px)',
                  textAlign: 'center',
                  background:
                    'linear-gradient(145deg,rgba(5,40,20,.7),rgba(2,22,10,.85))',
                  border: '1px solid rgba(74,222,128,.22)',
                  backdropFilter: 'blur(28px)',
                  boxShadow:
                    '0 0 60px rgba(20,80,40,.18),0 60px 120px rgba(0,0,0,.65),inset 0 1px 0 rgba(74,222,128,.07)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'radial-gradient(ellipse at 50% 0%,rgba(74,222,128,.08) 0%,transparent 60%)',
                    pointerEvents: 'none',
                  }}
                />
                {[
                  ['top', 'left'],
                  ['top', 'right'],
                  ['bottom', 'left'],
                  ['bottom', 'right'],
                ].map(([v, h]) => (
                  <svg
                    key={`${v}${h}`}
                    viewBox='0 0 28 28'
                    width='28'
                    height='28'
                    style={{
                      position: 'absolute',
                      [v]: 12,
                      [h]: 12,
                      opacity: 0.4,
                    }}
                  >
                    <path
                      d={v === 'top' ? 'M0 20 L0 0 L20 0' : 'M0 8 L0 28 L20 28'}
                      stroke='#4ade80'
                      strokeWidth='1.5'
                      fill='none'
                      transform={
                        h === 'right' ? 'scale(-1,1) translate(-28,0)' : ''
                      }
                    />
                    <circle
                      cx={h === 'left' ? 0 : 20}
                      cy={v === 'top' ? 0 : 28}
                      r='2.5'
                      fill='#4ade80'
                      transform={
                        h === 'right' ? 'scale(-1,1) translate(-28,0)' : ''
                      }
                    />
                  </svg>
                ))}
                <p
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: 'clamp(9px,2.4vw,10px)',
                    letterSpacing: '.45em',
                    textTransform: 'uppercase',
                    color: 'rgba(74,222,128,.5)',
                    marginBottom: 26,
                    marginTop: 0,
                  }}
                >
                  Save the Date
                </p>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    gap: 'clamp(16px,5vw,28px)',
                    marginBottom: 24,
                  }}
                >
                  <div>
                    <div
                      className='emerald-text'
                      style={{
                        fontFamily: "'Cormorant Garamond',serif",
                        fontSize: 'clamp(60px,17vw,82px)',
                        fontWeight: 300,
                        lineHeight: 1,
                      }}
                    >
                      04
                    </div>
                    <div
                      style={{
                        fontFamily: "'Jost',sans-serif",
                        fontSize: 9,
                        letterSpacing: '.3em',
                        color: 'rgba(74,222,128,.35)',
                        textTransform: 'uppercase',
                      }}
                    >
                      Day
                    </div>
                  </div>
                  <div
                    style={{
                      width: 1,
                      height: 66,
                      background: 'rgba(74,222,128,.18)',
                      marginBottom: 16,
                    }}
                  />
                  <div>
                    <div
                      className='emerald-text'
                      style={{
                        fontFamily: "'Cormorant Garamond',serif",
                        fontSize: 'clamp(26px,8vw,36px)',
                        fontWeight: 300,
                        lineHeight: 1,
                      }}
                    >
                      April
                    </div>
                    <div
                      style={{
                        fontFamily: "'Cormorant Garamond',serif",
                        fontSize: 'clamp(38px,12vw,54px)',
                        fontWeight: 300,
                        color: '#a7f3d0',
                        lineHeight: 1.1,
                      }}
                    >
                      2026
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: 22 }}>
                  <GLine w={44} />
                </div>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: 'clamp(17px,5.5vw,21px)',
                    color: 'rgba(200,242,215,.7)',
                    marginBottom: 6,
                    marginTop: 0,
                  }}
                >
                  At Villa Aasharintada
                </p>
                <p
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: 'clamp(9px,2.5vw,11px)',
                    letterSpacing: '.22em',
                    color: 'rgba(74,222,128,.38)',
                    textTransform: 'uppercase',
                    margin: 0,
                  }}
                >
                  Ceremony · 4:00 PM · Reception to follow
                </p>
                <div style={{ margin: '22px 0' }}>
                  <GLine w={44} />
                </div>
              </div>
            </Reveal>
          </section>

          {/* ── COUNTDOWN ── */}
          <section
            style={{
              position: 'relative',
              zIndex: 10,
              width: '100vw',
              boxSizing: 'border-box',
              padding: 'clamp(70px,15vw,110px) 20px',
              background:
                'linear-gradient(180deg,rgba(5,30,15,.55) 0%,rgba(8,50,22,.38) 50%,rgba(5,30,15,.55) 100%)',
              borderBottom: '1px solid rgba(74,222,128,.1)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(ellipse at 50% 50%,rgba(20,100,50,.1) 0%,transparent 65%)',
                pointerEvents: 'none',
              }}
            />
            <Reveal>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 14,
                  marginBottom: 36,
                }}
              >
                <div
                  style={{
                    height: 1,
                    flex: 1,
                    maxWidth: 70,
                    background:
                      'linear-gradient(to right,transparent,rgba(74,222,128,.4))',
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: 'clamp(9px,2.5vw,11px)',
                    letterSpacing: '.5em',
                    textTransform: 'uppercase',
                    color: 'rgba(74,222,128,.75)',
                    padding: '7px 18px',
                    border: '1px solid rgba(74,222,128,.28)',
                    borderRadius: 50,
                    background: 'rgba(74,222,128,.05)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ⏳ &nbsp; Counting Down
                </span>
                <div
                  style={{
                    height: 1,
                    flex: 1,
                    maxWidth: 70,
                    background:
                      'linear-gradient(to left,transparent,rgba(74,222,128,.4))',
                  }}
                />
              </div>
              <p
                style={{
                  textAlign: 'center',
                  fontFamily: "'Great Vibes',cursive",
                  fontSize: 'clamp(30px,10vw,48px)',
                  color: 'rgba(167,243,208,.45)',
                  marginBottom: 40,
                  marginTop: 0,
                }}
              >
                Until the blessed day
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <Countdown targetDate='2026-04-04T16:00:00' />
            </Reveal>
            <Reveal delay={0.4}>
              <p
                style={{
                  textAlign: 'center',
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: 'clamp(14px,4vw,17px)',
                  fontStyle: 'italic',
                  color: 'rgba(167,243,208,.3)',
                  marginTop: 36,
                  marginBottom: 0,
                }}
              >
                April 4, 2026 · 4:00 PM
              </p>
            </Reveal>
          </section>

          {/* ── QUOTE — different one for bride's side ── */}
          <section
            style={{
              position: 'relative',
              zIndex: 10,
              width: '100vw',
              boxSizing: 'border-box',
              padding: 'clamp(60px,14vw,90px) 28px',
              textAlign: 'center',
              background:
                'linear-gradient(180deg,rgba(2,12,6,.65) 0%,rgba(5,28,14,.42) 50%,rgba(2,12,6,.65) 100%)',
              borderBottom: '1px solid rgba(74,222,128,.07)',
            }}
          >
            <Reveal>
              <div style={{ maxWidth: 400, margin: '0 auto' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: 20,
                    opacity: 0.3,
                  }}
                >
                  <GLine w={60} />
                </div>
                <p
                  style={{
                    fontFamily: "'Great Vibes',cursive",
                    fontSize: 'clamp(28px,9vw,42px)',
                    color: 'rgba(167,243,208,.5)',
                    lineHeight: 1.3,
                    margin: '0 0 16px',
                  }}
                >
                  بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                </p>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: 'clamp(17px,5.5vw,22px)',
                    fontStyle: 'italic',
                    color: 'rgba(200,242,215,.48)',
                    lineHeight: 1.9,
                    margin: '0 0 16px',
                  }}
                >
                  "And He it is who created from water a human being and made
                  him relations by blood and marriage."
                </p>
                <p
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: 'clamp(8px,2.2vw,10px)',
                    letterSpacing: '.35em',
                    textTransform: 'uppercase',
                    color: 'rgba(74,222,128,.35)',
                    margin: 0,
                  }}
                >
                  — Surah Al-Furqan, 25:54
                </p>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: 20,
                    opacity: 0.3,
                  }}
                >
                  <GLine w={60} />
                </div>
              </div>
            </Reveal>
          </section>

          {/* ── TIMELINE ── */}
          <section
            style={{
              position: 'relative',
              zIndex: 10,
              width: '100vw',
              boxSizing: 'border-box',
              padding: 'clamp(64px,14vw,100px) 20px',
              background:
                'linear-gradient(180deg,rgba(5,30,15,.55) 0%,rgba(8,45,20,.38) 50%,rgba(5,30,15,.55) 100%)',
              borderBottom: '1px solid rgba(74,222,128,.1)',
            }}
          >
            <Reveal>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 14,
                  marginBottom: 48,
                }}
              >
                <div
                  style={{
                    height: 1,
                    flex: 1,
                    maxWidth: 70,
                    background:
                      'linear-gradient(to right,transparent,rgba(74,222,128,.4))',
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: 'clamp(9px,2.5vw,11px)',
                    letterSpacing: '.5em',
                    textTransform: 'uppercase',
                    color: 'rgba(74,222,128,.75)',
                    padding: '7px 18px',
                    border: '1px solid rgba(74,222,128,.28)',
                    borderRadius: 50,
                    background: 'rgba(74,222,128,.05)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  🤲 &nbsp; The Day's Events
                </span>
                <div
                  style={{
                    height: 1,
                    flex: 1,
                    maxWidth: 70,
                    background:
                      'linear-gradient(to left,transparent,rgba(74,222,128,.4))',
                  }}
                />
              </div>
            </Reveal>
            <div style={{ maxWidth: 440, margin: '0 auto' }}>
              {[
                [
                  '4:00 PM',
                  'Nikah Ceremony',
                  'The sacred bond is made in the presence of loved ones & Allah',
                  '🕌',
                ],
                [
                  '5:30 PM',
                  'Family Gathering',
                  'Blessings, laughter and cherished moments with both families',
                  '🌿',
                ],
                [
                  '7:00 PM',
                  'Walima Feast',
                  'A grand celebration dinner — barakah on every plate',
                  '🍽️',
                ],
                [
                  '9:00 PM',
                  'Duas & Farewell',
                  'Heartfelt prayers to send the couple off into their new life',
                  '✨',
                ],
              ].map(([time, title, desc, icon], i) => (
                <Reveal key={i} delay={i * 0.12}>
                  <div
                    style={{
                      display: 'flex',
                      gap: 'clamp(14px,4vw,20px)',
                      marginBottom: 'clamp(24px,6vw,36px)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        flexShrink: 0,
                        paddingTop: 4,
                      }}
                    >
                      <div
                        style={{
                          width: 'clamp(44px,12vw,52px)',
                          height: 'clamp(44px,12vw,52px)',
                          borderRadius: '50%',
                          background: 'rgba(74,222,128,.07)',
                          border: '1px solid rgba(74,222,128,.28)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 'clamp(18px,5vw,22px)',
                          boxShadow: '0 0 20px rgba(74,222,128,.1)',
                        }}
                      >
                        {icon}
                      </div>
                      {i < 3 && (
                        <div
                          style={{
                            width: 1,
                            flex: 1,
                            background: 'rgba(74,222,128,.12)',
                            marginTop: 8,
                          }}
                        />
                      )}
                    </div>
                    <div style={{ paddingBottom: 20 }}>
                      <p
                        style={{
                          fontFamily: "'Jost',sans-serif",
                          fontSize: 'clamp(8px,2.2vw,10px)',
                          letterSpacing: '.32em',
                          color: 'rgba(74,222,128,.45)',
                          textTransform: 'uppercase',
                          marginBottom: 5,
                          marginTop: 0,
                        }}
                      >
                        {time}
                      </p>
                      <p
                        style={{
                          fontFamily: "'Cormorant Garamond',serif",
                          fontSize: 'clamp(18px,5.8vw,23px)',
                          color: 'rgba(200,242,215,.85)',
                          marginBottom: 5,
                          marginTop: 0,
                        }}
                      >
                        {title}
                      </p>
                      <p
                        style={{
                          fontFamily: "'Jost',sans-serif",
                          fontSize: 'clamp(11px,3.5vw,14px)',
                          fontWeight: 300,
                          color: 'rgba(74,222,128,.35)',
                          margin: 0,
                          lineHeight: 1.6,
                        }}
                      >
                        {desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ── GIFT OF DUA — unique section replacing "Our Story" ── */}
          <section
            style={{
              position: 'relative',
              zIndex: 10,
              width: '100vw',
              boxSizing: 'border-box',
              padding: 'clamp(64px,14vw,100px) 20px',
              background:
                'linear-gradient(180deg,rgba(2,15,8,.7) 0%,rgba(5,35,18,.42) 50%,rgba(2,15,8,.7) 100%)',
              borderBottom: '1px solid rgba(74,222,128,.1)',
            }}
          >
            <Reveal>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 14,
                  marginBottom: 40,
                }}
              >
                <div
                  style={{
                    height: 1,
                    flex: 1,
                    maxWidth: 70,
                    background:
                      'linear-gradient(to right,transparent,rgba(74,222,128,.4))',
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: 'clamp(9px,2.5vw,11px)',
                    letterSpacing: '.5em',
                    textTransform: 'uppercase',
                    color: 'rgba(74,222,128,.75)',
                    padding: '7px 18px',
                    border: '1px solid rgba(74,222,128,.28)',
                    borderRadius: 50,
                    background: 'rgba(74,222,128,.05)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  🌿 &nbsp; Gifts &amp; Wishes
                </span>
                <div
                  style={{
                    height: 1,
                    flex: 1,
                    maxWidth: 70,
                    background:
                      'linear-gradient(to left,transparent,rgba(74,222,128,.4))',
                  }}
                />
              </div>
            </Reveal>
            <Reveal dir='scale'>
              <div
                style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}
              >
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: 'clamp(16px,5vw,20px)',
                    fontStyle: 'italic',
                    color: 'rgba(200,242,215,.55)',
                    lineHeight: 1.9,
                    marginBottom: 40,
                    marginTop: 0,
                  }}
                >
                  Your presence is the greatest gift. If you wish to give more,
                  your heartfelt duas for the couple are the most precious
                  treasure of all.
                </p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'clamp(12px,3.5vw,20px)',
                    width: '100%',
                  }}
                >
                  {[
                    {
                      icon: '🤲',
                      title: 'Dua',
                      desc: 'Pray for their happiness, health & blessed union',
                    },
                    {
                      icon: '🕌',
                      title: 'Barakah',
                      desc: 'May Allah fill their home with peace & mercy',
                    },
                    {
                      icon: '🌿',
                      title: 'Presence',
                      desc: 'Simply being here means the world to them',
                    },
                    {
                      icon: '💚',
                      title: 'Love',
                      desc: 'Your warmth & joy is the best gift they need',
                    },
                  ].map(({ icon, title, desc }, i) => (
                    <Reveal
                      key={i}
                      delay={i * 0.12}
                      dir='scale'
                      className='story-card-cell'
                    >
                      <div
                        style={{
                          width: '100%',
                          borderRadius: 'clamp(16px,5vw,22px)',
                          padding:
                            'clamp(20px,6vw,28px) clamp(12px,3.5vw,16px)',
                          textAlign: 'center',
                          background:
                            'linear-gradient(145deg,rgba(5,40,20,.55),rgba(2,22,10,.75))',
                          border: '1px solid rgba(74,222,128,.18)',
                          boxShadow: '0 20px 50px rgba(0,0,0,.4)',
                        }}
                      >
                        <div
                          style={{
                            fontSize: 'clamp(28px,8vw,36px)',
                            marginBottom: 10,
                          }}
                        >
                          {icon}
                        </div>
                        <div
                          style={{
                            fontFamily: "'Great Vibes',cursive",
                            fontSize: 'clamp(20px,6vw,26px)',
                            color: '#d4f4e6',
                            lineHeight: 1.1,
                            marginBottom: 8,
                          }}
                        >
                          {title}
                        </div>
                        <div
                          style={{
                            fontFamily: "'Cormorant Garamond',serif",
                            fontSize: 'clamp(11px,3.5vw,13px)',
                            fontStyle: 'italic',
                            color: 'rgba(167,243,208,.35)',
                            lineHeight: 1.5,
                          }}
                        >
                          {desc}
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </Reveal>
          </section>

          {/* ── MAP ── */}
          <section
            style={{
              position: 'relative',
              zIndex: 10,
              width: '100vw',
              boxSizing: 'border-box',
              padding: 'clamp(64px,14vw,100px) 20px',
              background:
                'linear-gradient(180deg,rgba(5,30,15,.55) 0%,rgba(8,45,20,.38) 50%,rgba(5,30,15,.55) 100%)',
              borderBottom: '1px solid rgba(74,222,128,.1)',
            }}
          >
            <Reveal>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 14,
                  marginBottom: 36,
                }}
              >
                <div
                  style={{
                    height: 1,
                    flex: 1,
                    maxWidth: 70,
                    background:
                      'linear-gradient(to right,transparent,rgba(74,222,128,.4))',
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: 'clamp(9px,2.5vw,11px)',
                    letterSpacing: '.5em',
                    textTransform: 'uppercase',
                    color: 'rgba(74,222,128,.75)',
                    padding: '7px 18px',
                    border: '1px solid rgba(74,222,128,.28)',
                    borderRadius: 50,
                    background: 'rgba(74,222,128,.05)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  📍 &nbsp; Find Us
                </span>
                <div
                  style={{
                    height: 1,
                    flex: 1,
                    maxWidth: 70,
                    background:
                      'linear-gradient(to left,transparent,rgba(74,222,128,.4))',
                  }}
                />
              </div>
              <p
                style={{
                  textAlign: 'center',
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: 'clamp(18px,6vw,24px)',
                  color: 'rgba(167,243,208,.5)',
                  fontStyle: 'italic',
                  marginBottom: 6,
                  marginTop: 0,
                }}
              >
                Villa Aasharintada
              </p>
              <p
                style={{
                  textAlign: 'center',
                  fontFamily: "'Jost',sans-serif",
                  fontSize: 'clamp(9px,2.5vw,11px)',
                  letterSpacing: '.25em',
                  color: 'rgba(74,222,128,.28)',
                  textTransform: 'uppercase',
                  marginBottom: 32,
                }}
              >
                Your Venue Address Here
              </p>
            </Reveal>
            <Reveal delay={0.12} dir='scale'>
              <div style={{ maxWidth: 600, margin: '0 auto' }}>
                <div
                  style={{
                    borderRadius: 'clamp(18px,5vw,24px)',
                    overflow: 'hidden',
                    boxShadow:
                      '0 0 0 1px rgba(74,222,128,.18),0 60px 120px rgba(0,0,0,.65),0 0 60px rgba(20,80,40,.1)',
                  }}
                >
                  <iframe
                    title='Venue'
                    src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d581.1402652747969!2d75.63114679953713!3d11.520971610518506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba688af37e8c3df%3A0x32ee8e6d97112b8e!2sFresh%20Mart!5e0!3m2!1sen!2sin!4v1772447714724!5m2!1sen!2sin'
                    width='100%'
                    height='340'
                    style={{
                      border: 0,
                      display: 'block',
                      filter: 'hue-rotate(100deg) saturate(.5) brightness(.6)',
                    }}
                    allowFullScreen
                    loading='lazy'
                    referrerPolicy='no-referrer-when-downgrade'
                  />
                </div>
                <div style={{ textAlign: 'center', marginTop: 22 }}>
                  <a
                    href='https://maps.app.goo.gl/9xnMw3Rs2iLwWPZ58'
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 9,
                      padding: 'clamp(13px,3.5vw,16px) clamp(26px,7vw,36px)',
                      borderRadius: 50,
                      fontFamily: "'Jost',sans-serif",
                      fontSize: 'clamp(9px,2.5vw,11px)',
                      letterSpacing: '.3em',
                      textTransform: 'uppercase',
                      color: '#4ade80',
                      border: '1px solid rgba(74,222,128,.3)',
                      textDecoration: 'none',
                      transition: 'all .3s ease',
                      background: 'rgba(74,222,128,.04)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(74,222,128,.1)';
                      e.currentTarget.style.boxShadow =
                        '0 0 30px rgba(74,222,128,.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(74,222,128,.04)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <svg
                      viewBox='0 0 24 24'
                      width='13'
                      height='13'
                      fill='currentColor'
                    >
                      <path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z' />
                    </svg>
                    Get Directions
                  </a>
                </div>
              </div>
            </Reveal>
          </section>

          {/* ── RSVP ── */}
          <RSVPSection anime={anime} />

          {/* ── FOOTER ── */}
          <footer
            style={{
              position: 'relative',
              zIndex: 10,
              width: '100vw',
              boxSizing: 'border-box',
              padding: 'clamp(50px,12vw,80px) 20px',
              textAlign: 'center',
              borderTop: '1px solid rgba(74,222,128,.1)',
            }}
          >
            <Reveal>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 14,
                  marginBottom: 20,
                  opacity: 0.35,
                }}
              >
                <LeafIcon s={26} op={1} />
                <LeafIcon s={20} op={1} />
                <LeafIcon s={26} op={1} />
              </div>
              <p
                style={{
                  fontFamily: "'Great Vibes',cursive",
                  fontSize: 'clamp(30px,10vw,42px)',
                  color: 'rgba(74,222,128,.65)',
                  margin: '0 0 10px',
                }}
              >
                Shamida &amp; Ashiq
              </p>
              <div
                style={{
                  margin: '12px auto 12px',
                  width: 'min(120px,30vw)',
                  height: 1,
                  background:
                    'linear-gradient(to right,transparent,rgba(74,222,128,.28),transparent)',
                }}
              />
              <p
                style={{
                  fontFamily: "'Jost',sans-serif",
                  fontSize: 'clamp(9px,2.5vw,11px)',
                  letterSpacing: '.5em',
                  textTransform: 'uppercase',
                  color: 'rgba(74,222,128,.6)',
                  margin: 0,
                }}
              >
                April 4, 2026 · With Love
              </p>
            </Reveal>
          </footer>
        </>
      )}
    </div>
  );
}
