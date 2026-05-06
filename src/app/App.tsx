import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Rectangle from "../imports/Rectangle15/Rectangle15";
import imgDiagnostico from "figma:asset/219f36972a48af087aff464629a32bc21323d345.png";
import imgVanguarda from "figma:asset/328a713f1e59c5ef92b21c633b6703ee8a257505.png";
import svgPaths from "../imports/Desktop1/svg-8r1b22f4xs";
import hostingerSvg2 from "../imports/Vector-1/svg-9qtctz56h5";
import faviconSrc from "../imports/image-1.png";

// ─── Lazy-load popup (only fetched when user clicks) ───────────────────────
const EmBrevePopup = lazy(() =>
  Promise.resolve({ default: EmBrevePopupComp })
);

// ─── Animation constants (module-level — never recreated on re-render) ─────
const revealVariants = {
  hidden:  { clipPath: "inset(0 50% 0 50%)" },
  visible: { clipPath: "inset(0 0% 0 0%)" },
} as const;

const textVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
} as const;

const mkReveal = (delay: number) => ({
  duration: 0.6,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  delay,
});

const mkText = (delay: number) => ({ duration: 0.3, delay });

// ─── SEO + preconnect ──────────────────────────────────────────────────────
function useSEO() {
  useEffect(() => {
    document.title = "Leoaragão.1 — IA, Tecnologia & Negócios";

    const setMeta = (
      attr: "name" | "property",
      value: string,
      content: string
    ) => {
      let el = document.querySelector(
        `meta[${attr}="${value}"]`
      ) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, value);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta("name", "description", "Leonardo Aragão — IA First. Diagnóstico IA, Vanguarda.club, Paperclip e muito mais.");
    setMeta("name", "keywords", "IA, inteligência artificial, automação, Leonardo Aragão, Vanguarda, Paperclip, tecnologia");
    setMeta("name", "author", "Leonardo Aragão");
    setMeta("name", "robots", "index, follow");
    setMeta("name", "theme-color", "#000000");
    setMeta("property", "og:type", "website");
    setMeta("property", "og:title", "Leoaragão.1 — IA, Tecnologia & Negócios");
    setMeta("property", "og:description", "Leonardo Aragão — IA First. Diagnóstico IA, Vanguarda.club, Paperclip e muito mais.");
    setMeta("property", "og:image", faviconSrc);
    setMeta("property", "og:locale", "pt_BR");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", "Leoaragão.1 — IA, Tecnologia & Negócios");
    setMeta("name", "twitter:description", "Leonardo Aragão — IA First. Diagnóstico IA, Vanguarda.club, Paperclip e muito mais.");
    setMeta("name", "twitter:image", faviconSrc);

    // Favicon
    let favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (!favicon) { favicon = document.createElement("link"); favicon.rel = "icon"; document.head.appendChild(favicon); }
    favicon.type = "image/png";
    favicon.href = faviconSrc;

    let appleIcon = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement | null;
    if (!appleIcon) { appleIcon = document.createElement("link"); appleIcon.rel = "apple-touch-icon"; document.head.appendChild(appleIcon); }
    appleIcon.href = faviconSrc;

    // Preconnect — jsDelivr (UnicornStudio SDK) + Google Fonts
    const origins = [
      { href: "https://cdn.jsdelivr.net",    co: true  },
      { href: "https://fonts.googleapis.com", co: false },
      { href: "https://fonts.gstatic.com",    co: true  },
    ];
    origins.forEach(({ href, co }) => {
      if (!document.querySelector(`link[rel="dns-prefetch"][href="${href}"]`)) {
        const d = document.createElement("link"); d.rel = "dns-prefetch"; d.href = href;
        document.head.prepend(d);
      }
      if (!document.querySelector(`link[rel="preconnect"][href="${href}"]`)) {
        const l = document.createElement("link"); l.rel = "preconnect"; l.href = href;
        if (co) l.crossOrigin = "anonymous";
        document.head.prepend(l);
      }
    });
  }, []);
}

// ─── UnicornStudio background ──────────────────────────────────────────────
const US_PROJECT = "EgvoZC7eDXsErT3Z1FOQ";
const US_SCRIPT  = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.12/dist/unicornStudio.umd.js";

const WATERMARK_CSS = `
  [class*="unicorn"][class*="watermark"],
  [id*="unicorn"][id*="watermark"],
  a[href*="unicornstudio"],
  .us-watermark, #us-watermark {
    display: none !important;
    opacity: 0 !important;
    pointer-events: none !important;
    visibility: hidden !important;
  }
`;

function UnicornBackground() {
  useEffect(() => {
    if (!document.getElementById("us-wm-kill")) {
      const style = document.createElement("style");
      style.id = "us-wm-kill";
      style.textContent = WATERMARK_CSS;
      document.head.appendChild(style);
    }

    const mo = new MutationObserver(() => {
      document.querySelectorAll<HTMLElement>(
        '[class*="watermark"],[id*="watermark"],a[href*="unicornstudio"]'
      ).forEach((el) => { el.style.cssText += "display:none!important;"; });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    const initUS = () => {
      // @ts-expect-error global
      const US = window.UnicornStudio;
      if (US && typeof US.init === "function") {
        try { US.init(); } catch (_) { /* ignore */ }
      }
    };

    if (document.getElementById("us-sdk")) {
      initUS();
    } else {
      const script = document.createElement("script");
      script.id   = "us-sdk";
      script.type = "text/javascript";
      script.src  = US_SCRIPT;
      script.onload = () => {
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", initUS);
        } else {
          initUS();
        }
      };
      (document.head || document.body).appendChild(script);
    }

    return () => { mo.disconnect(); };
  }, []);

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <div
        data-us-project={US_PROJECT}
        data-us-scale="cover"
        data-us-dpi="1.5"
        style={{ width: "100%", height: "100%" }}
      />
      {/* Patch preto sobre o canto da marca d'água */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 220,
          height: 52,
          background: "#000",
          zIndex: 99,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

// ─── Corner bracket decorator ──────────────────────────────────────────────
function CornerBrackets({ color = "#12a0fa" }: { color?: string }) {
  const s = `absolute bg-white border border-solid size-[6px]`;
  return (
    <>
      <div className={`${s} top-0 left-0`}  style={{ borderColor: color }} />
      <div className={`${s} top-0 right-0`} style={{ borderColor: color }} />
      <div className={`${s} bottom-0 left-0`} style={{ borderColor: color }} />
      <div className={`${s} bottom-0 right-0`} style={{ borderColor: color }} />
    </>
  );
}

// ─── Social icon button ────────────────────────────────────────────────────
function SocialIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative size-[56px]">
      <div className="absolute bg-[rgba(18,160,250,0.34)] border border-solid border-white left-[3px] top-[3px] size-[50px]" />
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
      <CornerBrackets color="#12a0fa" />
    </div>
  );
}

// ─── Image card ───────────────────────────────────────────────────────────
const CARD_GRADIENT_BIG = "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 356 182\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(-12.95 30.45 -59.562 -25.331 374 -42.5)\\'><stop stop-color=\\'rgba(18,160,250,0)\\' offset=\\'0.091597\\'/><stop stop-color=\\'rgba(0,87,226,1)\\' offset=\\'0.58789\\'/></radialGradient></defs></svg>')";
const CARD_GRADIENT_SM  = "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 356 118\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(-12.95 19.742 -59.562 -16.423 374 -27.555)\\'><stop stop-color=\\'rgba(18,160,250,0)\\' offset=\\'0.091597\\'/><stop stop-color=\\'rgba(0,87,226,1)\\' offset=\\'0.58789\\'/></radialGradient></defs></svg>')";

function ImageCard({
  title, description, bgImage, imgPosition, borderColor = "#2367f9", href, priority = false,
}: {
  title: string; description: string; bgImage: string;
  imgPosition: { top: string; left: string; width: string; height: string };
  borderColor?: string; href?: string; priority?: boolean;
}) {
  const inner = (
    <div className="relative w-full" style={{ height: 182 }}>
      <div className="absolute inset-0 overflow-hidden">
        <img
          alt=""
          className="absolute max-w-none"
          src={bgImage}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          // @ts-expect-error fetchpriority is valid HTML but not in TS types yet
          fetchpriority={priority ? "high" : "auto"}
          style={{ top: imgPosition.top, left: imgPosition.left, width: imgPosition.width, height: imgPosition.height }}
        />
      </div>
      <div className="absolute inset-0" style={{ backgroundImage: CARD_GRADIENT_BIG }} />
      <div className="absolute inset-0 border border-solid border-white pointer-events-none" />
      <div className="absolute inset-0 flex flex-col gap-[8px] items-start justify-end p-[10px]">
        <p className="shrink-0 xs:text-[20px] text-white whitespace-nowrap text-[24px]"
           style={{ fontFamily: "'Funnel Display', sans-serif", fontWeight: 600 }}>{title}</p>
        <p className="xs:text-[12px] text-white w-full text-[16px]"
           style={{ fontFamily: "'Funnel Display', sans-serif", fontWeight: 300 }}>{description}</p>
      </div>
      <CornerBrackets color={borderColor} />
    </div>
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block w-full" style={{ textDecoration: "none" }}>{inner}</a>
  ) : inner;
}

// ─── Icon card ─────────────────────────────────────────────────────────────
function IconCard({
  iconPath, iconViewBox, iconW, iconH, title, description, href,
}: {
  iconPath: string; iconViewBox: string; iconW: number; iconH: number;
  title: string; description: string; href?: string;
}) {
  const inner = (
    <div className="relative w-full" style={{ height: 118 }}>
      <div className="absolute inset-0" style={{ backgroundImage: CARD_GRADIENT_SM }} />
      <div className="absolute inset-0 border border-solid border-white pointer-events-none" />
      <div className="absolute inset-0 flex flex-col gap-[8px] items-start justify-end p-[10px]">
        <div className="flex gap-[10px] items-center justify-center">
          <svg fill="none" viewBox={iconViewBox} style={{ width: iconW, height: iconH, flexShrink: 0 }}>
            <path d={iconPath} fill="white" />
          </svg>
          <p className="xs:text-[20px] text-white whitespace-nowrap text-[24px]"
             style={{ fontFamily: "'Funnel Display', sans-serif", fontWeight: 600 }}>{title}</p>
        </div>
        <p className="xs:text-[12px] text-white w-full text-[15px]"
           style={{ fontFamily: "'Funnel Display', sans-serif", fontWeight: 300 }}>{description}</p>
      </div>
      <CornerBrackets color="#12a0fa" />
    </div>
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block w-full" style={{ textDecoration: "none" }}>{inner}</a>
  ) : inner;
}

// ─── Em breve popup (referenced via lazy above) ────────────────────────────
function EmBrevePopupComp({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]"
         style={{ background: "rgba(0,0,0,0.7)" }} onClick={onClose}>
      <div className="relative flex flex-col items-center justify-center gap-4 px-10 py-8"
           style={{ background: "#0a0a0a", border: "1px solid #12a0fa", minWidth: 260 }}
           onClick={(e) => e.stopPropagation()}>
        <CornerBrackets color="#12a0fa" />
        <p className="text-white text-[22px] whitespace-nowrap"
           style={{ fontFamily: "'Funnel Display', sans-serif", fontWeight: 600 }}>Em breve 🚀</p>
        <p className="text-white text-[14px] text-center"
           style={{ fontFamily: "'Funnel Display', sans-serif", fontWeight: 300, opacity: 0.7 }}>
          Estamos preparando algo incrível.<br />Fique ligado!
        </p>
        <button onClick={onClose}
          className="mt-2 px-6 py-2 border border-solid border-[#12a0fa] text-white text-[13px]"
          style={{ fontFamily: "'Funnel Display', sans-serif", background: "rgba(18,160,250,0.15)", cursor: "pointer" }}>
          Fechar
        </button>
      </div>
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────
export default function App() {
  useSEO();
  const [showEmBreve, setShowEmBreve] = useState(false);

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden" style={{ background: "#000" }}>

      {showEmBreve && (
        <Suspense fallback={null}>
          <EmBrevePopup onClose={() => setShowEmBreve(false)} />
        </Suspense>
      )}

      <UnicornBackground />

      {/* Content */}
      <div className="relative mx-auto flex flex-col items-center" style={{ maxWidth: 430, zIndex: 1 }}>
        {/* Hero spacer */}
        <div className="relative w-full overflow-hidden" style={{ height: 320 }} />

        {/* Name tag */}
        <div className="relative mt-4 mb-4">
          <motion.div
            className="bg-[rgba(18,160,250,0.34)] border border-solid border-white px-4 py-2"
            variants={revealVariants} initial="hidden" animate="visible" transition={mkReveal(0)}
          >
            <motion.p
              className="text-[20px] sm:text-[22px] md:text-[24px] text-center text-white whitespace-nowrap"
              style={{ fontFamily: "'Funnel Display', sans-serif", fontWeight: 600 }}
              variants={textVariants} initial="hidden" animate="visible" transition={mkText(0.45)}
            >
              Leoaragão.1
            </motion.p>
          </motion.div>
          <CornerBrackets color="#12a0fa" />
        </div>

        {/* Cards */}
        <div className="w-full px-[37px] flex flex-col gap-[18px] pb-8">
          <motion.div variants={revealVariants} initial="hidden" animate="visible" transition={mkReveal(0.15)}>
            <ImageCard
              title="Diagnóstico IA"
              description="Agende sua reunião de analise de solução IA para sua empresa"
              bgImage={imgDiagnostico}
              imgPosition={{ top: "-36.64%", left: "31.28%", width: "77.76%", height: "150.4%" }}
              borderColor="#2367f9"
              href="https://wa.me/5577981126262?text=Vim%20pelo%20instagram%20e%20quero%20solicitar%20consulta%20do%20meu%20projeto/empresa"
              priority
            />
          </motion.div>

          <motion.div variants={revealVariants} initial="hidden" animate="visible" transition={mkReveal(0.27)}>
            <ImageCard
              title="Vanguarda.club"
              description="Seu espaço de IA First, networking e conteúdo sobre IA e tecnologia aplicada para seu negócio"
              bgImage={imgVanguarda}
              imgPosition={{ top: "-36.81%", left: "-14.45%", width: "128.9%", height: "141.83%" }}
              borderColor="#12a0fa"
              href="https://vanguardaclub.vercel.app/waitlist.html"
            />
          </motion.div>

          <motion.div variants={revealVariants} initial="hidden" animate="visible" transition={mkReveal(0.39)}>
            <IconCard
              iconPath={svgPaths.p2b4f7c00} iconViewBox="0 0 35 32" iconW={35} iconH={32}
              title="Paperclip"
              description="Seu escritório de agentes rodando sozinho"
              href="https://paperclip.ing/"
            />
          </motion.div>

          <motion.div
            variants={revealVariants} initial="hidden" animate="visible" transition={mkReveal(0.51)}
            onClick={() => setShowEmBreve(true)} style={{ cursor: "pointer" }}
          >
            <IconCard
              iconPath={svgPaths.p12cc9800} iconViewBox="0 0 38 32" iconW={38} iconH={32}
              title="Vanguarda.squads"
              description="Meu time de squads de graça para você usar"
            />
          </motion.div>

          <motion.div
            variants={revealVariants} initial="hidden" animate="visible" transition={mkReveal(0.63)}
            onClick={() => setShowEmBreve(true)} style={{ cursor: "pointer" }}
          >
            <IconCard
              iconPath={hostingerSvg2.p345eee80} iconViewBox="0 0 32 38" iconW={32} iconH={38}
              title="Hospedagem VPS"
              description="Servidor VPS com 10% de desconto com meu cupom na hostinger"
            />
          </motion.div>
        </div>

        {/* Social icons */}
        <div className="flex gap-[13px] items-center justify-center mb-6">
          <motion.a href="https://www.linkedin.com/in/leoartmesh/" target="_blank" rel="noopener noreferrer"
            variants={revealVariants} initial="hidden" animate="visible" transition={mkReveal(0.75)}>
            <SocialIcon>
              <svg fill="none" viewBox="0 0 43 43" className="size-[43px]"><path d={svgPaths.p32a6d780} fill="white" /></svg>
            </SocialIcon>
          </motion.a>

          <motion.a href="https://www.youtube.com/@leoaragao1" target="_blank" rel="noopener noreferrer"
            variants={revealVariants} initial="hidden" animate="visible" transition={mkReveal(0.83)}>
            <SocialIcon>
              <svg fill="none" viewBox="0 0 43 43" className="size-[43px]"><path d={svgPaths.p1eef0100} fill="white" /></svg>
            </SocialIcon>
          </motion.a>

          <motion.a href="https://www.instagram.com/leoaragao.1/" target="_blank" rel="noopener noreferrer"
            variants={revealVariants} initial="hidden" animate="visible" transition={mkReveal(0.91)}>
            <SocialIcon>
              <svg fill="none" viewBox="0 0 43 43" className="size-[43px]"><path d={svgPaths.p28696172} fill="white" /></svg>
            </SocialIcon>
          </motion.a>
        </div>

        {/* Footer */}
        <motion.p
          className="text-[12px] sm:text-[13px] md:text-[15px] text-center text-white pb-8"
          style={{ fontFamily: "'Funnel Display', sans-serif", fontWeight: 300 }}
          variants={textVariants} initial="hidden" animate="visible" transition={mkText(1.0)}
        >
          Leonardo Aragão 2026
        </motion.p>

        {/* Black bar — covers UnicornStudio watermark */}
        <div style={{ width: "100vw", height: 56, background: "#000", flexShrink: 0, position: "relative", zIndex: 10 }}>
          <Rectangle />
          <div style={{ position: "absolute", top: -10, left: 0, right: 0, bottom: 0, background: "#000" }} />
        </div>
      </div>
    </div>
  );
}