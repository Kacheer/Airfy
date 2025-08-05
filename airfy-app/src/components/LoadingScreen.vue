<template>
  <transition name="fade-loader">
    <div v-if="visible" :class="['loader-overlay', themeClass]">
      <div class="loader-content">
        <div class="balls">
          <div v-for="n in 3" :key="n" :ref="setBallRef" class="loader-ball"></div>
        </div>
        <div class="loader-stage-text">{{ displayStageText }}</div>
      </div>
    </div>
  </transition>
</template>

<script>
import { gsap } from 'gsap';

export default {
  name: 'LoadingScreen',
  props: {
    show: {
      type: Boolean,
      default: true,
    },
    theme: {
      type: String,
      default: 'Темная',
    },
    stageText: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      visible: true,
      ballRefs: [],
    };
  },
  computed: {
    themeClass() {
      return this.theme === 'Темная' ? 'dark-loader' : 'light-loader';
    },
    displayStageText() {
      return this.stageText || 'Загрузка...';
    },
  },
  watch: {
    show(val) {
      this.visible = !!val;
    },
  },
  methods: {
    setBallRef(el) {
      if (el && !this.ballRefs.includes(el)) {
        this.ballRefs.push(el);
      }
    },
    animateBalls() {
      this.ballRefs.forEach((ball, i) => {
        gsap.to(ball, {
          y: -40,
          scale: 1.15,
          repeat: -1,
          yoyo: true,
          duration: 0.45,
          delay: i * 0.18,
          ease: 'power2.out',
        });
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.animateBalls();
    });
  },
};
</script>

<style scoped>
/* Fade transition for loader */
.fade-loader-enter-active, .fade-loader-leave-active {
  transition: opacity 0.6s cubic-bezier(.4,0,.2,1);
}
.fade-loader-enter, .fade-loader-leave-to {
  opacity: 0;
}
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  opacity: 1;
  pointer-events: auto;
}
.dark-loader {
  background: #252525;
}
.light-loader {
  background: #f5f6fa;
}
.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: transparent;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  padding: 48px 56px 32px 56px;
}
.balls {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}
.loader-ball {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}
.loader-stage-text {
  color: #fff;
  font-size: 1.4rem;
  font-family: 'Inter', Helvetica, Arial, sans-serif;
  letter-spacing: 0.04em;
  font-weight: 600;
  text-shadow: 0 2px 8px rgba(0,0,0,0.18);
  margin-top: 12px;
  text-align: center;
}
.light-loader .loader-stage-text {
  color: #222;
  text-shadow: 0 2px 8px rgba(255,255,255,0.12);
}
</style>