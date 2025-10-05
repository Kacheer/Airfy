<template>
  <div class="premium-dynamic-background" :class="backgroundClass" :style="backgroundStyle">
    <div class="background-content">
      <!-- Контрастная подложка для светлой темы -->
      <div v-if="theme === 'Светлая'" class="light-contrast-overlay"></div>

      <!-- Эффекты для темной темы -->
      <div v-if="theme === 'Темная'" class="storm-layer">
        <svg class="lightning-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <filter id="bolt-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur1"/>
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="blur2"/>
              <feGaussianBlur in="SourceGraphic" stdDeviation="4.8" result="blur3"/>
              <feGaussianBlur in="SourceGraphic" stdDeviation="8.5" result="blur4"/>
              <feMerge>
                <feMergeNode in="blur4"/>
                <feMergeNode in="blur3"/>
                <feMergeNode in="blur2"/>
                <feMergeNode in="blur1"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <linearGradient id="bolt-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#ffffff"/>
              <stop offset="50%" stop-color="#d4e8ff"/>
              <stop offset="100%" stop-color="#8fc4ff"/>
            </linearGradient>
          </defs>
          <g v-if="lightningActive" class="bolt-group">
            <template v-for="(path, idx) in lightningPaths" :key="idx">
              <path :d="path" class="bolt bolt-outer-glow"/>
              <path :d="path" class="bolt bolt-outer"/>
              <path :d="path" class="bolt bolt-inner"/>
              <path :d="path" class="bolt bolt-core"/>
            </template>
          </g>
        </svg>
        <!-- Общий всполох неба -->
        <div class="sky-flash" :class="{ active: flashActive }"></div>
        <!-- Локальная засветка в точке удара -->
        <div class="bolt-flare" :class="{ active: flashActive }" :style="getFlareStyle()"></div>
      </div>

      <!-- Дождь для темной темы -->
      <div v-if="theme === 'Темная'" class="rain-container">
        <div v-for="i in 60" :key="i" class="rain-drop" :style="getRainStyle(i)"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SimpleDynamicBackground',
  props: {
    weatherCode: { type: Number, default: 0 },
    theme: { type: String, default: 'Светлая' },
    interactive: { type: Boolean, default: true }
  },
  data() {
    return {
      time: 0,
      animationId: null,
      isSunnyEffectActive: false,
      spotlightTimer: null,
      flashActive: false,
      lightningActive: false,
      flashTimer: null,
      flashEvents: [],
      lightningPaths: [],
      flashCenter: { x: 50, y: 80 },
    }
  },
  computed: {
    backgroundClass() { return this.theme === 'Темная' ? 'dark-theme' : 'light-theme' },
    backgroundStyle() {
      if (this.theme === 'Светлая' && this.isSunnyEffectActive) {
        return {
          background: `radial-gradient(1100px 460px at 70% 0%, rgba(255, 255, 255, 0.3) 0%, transparent 70%), linear-gradient(140deg, #FFEB3B 0%, #FFC107 20%, #FF9800 50%, #F57C00 75%, #EF6C00 100%)`
        };
      }
      if (this.theme === 'Светлая') {
        return {
          background: `radial-gradient(1100px 460px at 70% 0%, rgba(255, 255, 255, 0.18) 0%, transparent 70%), linear-gradient(140deg, #D6E6F5 0%, #C2DBF2 22%, #A7CBEE 50%, #8FBBE9 75%, #79ACE2 100%)`
        };
      }
      return {
        background: `radial-gradient(ellipse at top, rgba(0, 0, 0, 0.5) 0%, transparent 60%), linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 30%, #16213e 70%, #0f3460 100%)`
      };
    }
  },
  mounted() {
    this.startAnimation();
    this.resetThemeTimers();
    window.addEventListener('resize', this.onResize);
  },
  beforeUnmount() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.clearTimers();
    window.removeEventListener('resize', this.onResize);
  },
  watch: {
    theme() { this.resetThemeTimers() }
  },
  methods: {
    onResize() {
      if (this.lightningActive) this.buildLightning();
    },
    startAnimation() {
      const animate = () => {
        this.time += 0.01;
        this.animationId = requestAnimationFrame(animate);
      };
      animate();
    },
    clearTimers() {
      if (this.flashTimer) { clearTimeout(this.flashTimer); this.flashTimer = null; }
      if (this.spotlightTimer) { clearTimeout(this.spotlightTimer); this.spotlightTimer = null; }
    },
    resetThemeTimers() {
      this.clearTimers();
      this.flashActive = false;
      this.lightningActive = false;
      this.isSunnyEffectActive = false;
      if (this.theme === 'Темная') {
        this.scheduleNextFlash();
      } else if (this.theme === 'Светлая') {
        this.scheduleNextSunnyEffect();
      }
    },
    scheduleNextSunnyEffect() {
      const delay = 30000 + Math.random() * 30000; // 30-60 сек для 1-2 раз в минуту
      console.log(`Scheduling next sunny effect in ${delay / 1000} seconds`); // Для отладки
      this.spotlightTimer = setTimeout(() => {
        this.triggerSunnyEffect();
      }, delay);
    },
    triggerSunnyEffect() {
      if (this.theme !== 'Светлая') return;
      console.log("Triggering sunny effect"); // Для отладки
      this.isSunnyEffectActive = true;
      setTimeout(() => {
        this.isSunnyEffectActive = false;
        this.scheduleNextSunnyEffect();
      }, 5000);
    },
    // Методы для темной темы
    scheduleNextFlash() {
      const delay = 3000 + Math.random() * 3000;
      this.flashTimer = setTimeout(this.tryFlash, delay);
    },
    tryFlash() {
      if (this.theme !== 'Темная') return;
      const now = Date.now();
      this.flashEvents = this.flashEvents.filter(t => now - t < 60000);
      if (this.flashEvents.length >= 6) {
        this.scheduleNextFlash();
        return;
      }
      this.flashEvents.push(now);
      this.triggerFlash();
      this.scheduleNextFlash();
    },
    triggerFlash() {
      this.buildLightning();
      this.lightningActive = true;
      this.flashActive = true;
      setTimeout(() => {
        this.lightningActive = false;
        this.flashActive = false;
      }, 950);
    },
    buildLightning() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const startOptions = [
        { x: w * (0.3 + Math.random() * 0.4), y: -h * 0.08 },
        { x: -w * 0.05, y: h * (0.05 + Math.random() * 0.15) },
        { x: w * 1.05, y: h * (0.05 + Math.random() * 0.15) }
      ];
      const start = startOptions[Math.floor(Math.random() * startOptions.length)];
      const endX = start.x + (Math.random() * w * 0.7 - w * 0.35);
      const endY = h * (0.75 + Math.random() * 0.2);
      const end = { x: endX, y: endY };

      const mainBolt = this.generateFractalBolt(start, end, Math.max(w, h) * 0.08, Math.max(w, h) * 0.018);

      const branches = [];
      const branchCount = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < branchCount; i++) {
        const ratio = 0.25 + Math.random() * 0.6;
        const idx = Math.max(2, Math.floor(mainBolt.length * ratio));
        if (idx >= mainBolt.length - 2) continue;
        const base = mainBolt[idx];
        const next = mainBolt[Math.min(idx + 3, mainBolt.length - 1)];
        const dir = { x: next.x - base.x, y: next.y - base.y };
        const len = Math.hypot(dir.x, dir.y) || 1;
        let nx = -dir.y / len;
        let ny = dir.x / len;
        if (Math.random() < 0.5) { nx = -nx; ny = -ny; }
        const branchLength = Math.min(
          Math.max(w, h) * (0.4 + Math.random() * 0.45),
          Math.hypot(end.x - base.x, end.y - base.y) * 0.9
        );
        const branchEnd = {
          x: base.x + nx * branchLength * (0.8 + Math.random() * 0.4),
          y: base.y + ny * branchLength * (0.7 + Math.random() * 0.5) + Math.random() * h * 0.1
        };
        branches.push(this.generateFractalBolt(base, branchEnd, Math.max(w, h) * 0.05, Math.max(w, h) * 0.015));
      }

      const extraBolts = [];
      if (Math.random() < 0.35) {
        const start2 = { x: w * (0.2 + Math.random() * 0.6), y: -h * (0.03 + Math.random() * 0.08) };
        const end2 = { x: start2.x + (Math.random() * w * 0.6 - w * 0.3), y: h * (0.7 + Math.random() * 0.25) };
        extraBolts.push(this.generateFractalBolt(start2, end2, Math.max(w, h) * 0.06, Math.max(w, h) * 0.018));
      }

      const scaleX = x => (x / w) * 100;
      const scaleY = y => (y / h) * 100;
      const toPath = pts => pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.x).toFixed(2)} ${scaleY(p.y).toFixed(2)}`).join(' ');

      this.lightningPaths = [
        toPath(mainBolt),
        ...branches.map(toPath),
        ...extraBolts.map(toPath)
      ];

      const endPt = mainBolt[mainBolt.length - 1] || end;
      this.flashCenter = { x: scaleX(endPt.x), y: scaleY(endPt.y) };
    },
    generateFractalBolt(start, end, displace = 70, minDisp = 15) {
      let points = [start, end];
      let d = displace;
      
      while (d > minDisp) {
        const newPts = [points[0]];
        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];
          const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
          
          const vx = p2.x - p1.x;
          const vy = p2.y - p1.y;
          const len = Math.hypot(vx, vy) || 1;
          
          const nx = -vy / len;
          const ny = vx / len;
          
          const perpOffset = (Math.random() * 2 - 1) * d * 0.9;
          const tangentOffset = (Math.random() * 2 - 1) * d * 0.25;
          const gravityBias = Math.random() * d * 0.12;
          
          mid.x += nx * perpOffset + (vx / len) * tangentOffset;
          mid.y += ny * perpOffset + (vy / len) * tangentOffset + gravityBias;
          
          newPts.push(mid, p2);
        }
        points = newPts;
        d *= 0.52;
      }
      return points;
    },
    getRainStyle(index) {
      const baseX = (index * 25) % window.innerWidth;
      const baseY = -50 + (index * 12) % 50;
      const speed = 0.8 + (index % 3) * 0.4;
      return { left: `${baseX}px`, top: `${baseY}px`, animationDuration: `${speed}s`, animationDelay: `${(index % 10) * 0.1}s` };
    },
    getFlareStyle() {
      return {
        '--fx': this.flashCenter.x + '%',
        '--fy': this.flashCenter.y + '%'
      };
    }
  }
};
</script>

<style scoped>
.premium-dynamic-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -10;
  pointer-events: none;
  overflow: hidden;
  transition: background 2s ease-in-out; /* Плавный переход градиента */
}

.light-theme {
  background:
    radial-gradient(1100px 460px at 70% 0%, rgba(255, 255, 255, 0.18) 0%, transparent 70%),
    linear-gradient(140deg, #D6E6F5 0%, #C2DBF2 22%, #A7CBEE 50%, #8FBBE9 75%, #79ACE2 100%);
}

.dark-theme {
  background:
    radial-gradient(ellipse at top, rgba(0, 0, 0, 0.5) 0%, transparent 60%),
    linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 30%, #16213e 70%, #0f3460 100%);
}

.background-content {
  position: relative;
  width: 100%;
  height: 100%;
}

.light-contrast-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(7, 24, 45, 0.22), rgba(7, 24, 45, 0.18)), radial-gradient(1000px 500px at 60% 0%, rgba(6, 20, 38, 0.20), transparent 70%), radial-gradient(800px 400px at 0% 30%, rgba(10, 26, 46, 0.18), transparent 70%);
}

/* Стили для темной темы */
.storm-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.lightning-svg {
  position: absolute;
  width: 100%;
  height: 100%;
}

.bolt-group .bolt {
  fill: none;
  stroke: url(#bolt-grad);
  stroke-width: 0.5;
}

.bolt-outer-glow { filter: url(#bolt-glow); opacity: 0.2; }
.bolt-outer { opacity: 0.5; }
.bolt-inner { opacity: 0.8; }
.bolt-core { stroke-width: 0.8; }

.sky-flash {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.5s ease-out;
}

.sky-flash.active {
  opacity: 1;
}

.bolt-flare {
  position: absolute;
  width: 20%;
  height: 20%;
  background: radial-gradient(circle at var(--fx) var(--fy), rgba(255, 255, 255, 0.6) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.5s ease-out;
}

.bolt-flare.active {
  opacity: 0.8;
}

.rain-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.rain-drop {
  position: absolute;
  width: 1px;
  height: 10px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.2));
  animation: fall linear infinite;
}

@keyframes fall {
  0% { transform: translateY(-50px); }
  100% { transform: translateY(110vh); }
}

@-moz-document url-prefix() {
  .lightning-svg {
    transform: translateZ(0);
  }
}
</style>

<!-- Глобальные переопределения палитры светлой темы -->
<style>
body:not(.dark-mode) .glass-card { background: rgba(10, 26, 46, 0.45) !important; backdrop-filter: blur(14px) !important; -webkit-backdrop-filter: blur(14px) !important; border: 1px solid rgba(255, 255, 255, 0.22) !important; box-shadow: 0 12px 34px rgba(13, 38, 76, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.25), inset 0 -1px 0 rgba(255, 255, 255, 0.1) !important; color: rgba(255,255,255,0.98) !important; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25) !important; }
body:not(.dark-mode) .forecast-title, body:not(.dark-mode) .text-wrapper, body:not(.dark-mode) .text-wrapper-3, body:not(.dark-mode) .weather-description, body:not(.dark-mode) .CurrentForecastDetails, body:not(.dark-mode) .CurrentForecastDetails li, body:not(.dark-mode) .feelsLike { color: rgba(255, 255, 255, 0.98) !important; }
body:not(.dark-mode) .CurrentForecastDetails hr { background: rgba(255, 255, 255, 0.35) !important; }
body:not(.dark-mode) .header-button, body:not(.dark-mode) .dropdown { background: rgba(10, 26, 46, 0.55) !important; color: #ffffff !important; border: 1px solid rgba(255, 255, 255, 0.22) !important; }
body:not(.dark-mode) .header-button:hover { background: rgba(10, 26, 46, 0.7) !important; transform: translateY(-6px) !important; }
body:not(.dark-mode) .hourly-scroll-container::-webkit-scrollbar-thumb { background-color: rgba(120, 156, 190, 0.9) !important; }
body:not(.dark-mode) .hourly-scroll-container::-webkit-scrollbar-track { background-color: rgba(230, 240, 250, 0.85) !important; }
</style>