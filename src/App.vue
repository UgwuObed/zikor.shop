<!-- App.vue -->
<template>
  <div id="app">
    <div v-if="isMobile">
      <!-- Your mobile app content with router-view -->
      <router-view />
    </div>
    <div v-else class="desktop-message">
      <img :src="require('@/assets/mobile.svg')" alt="Mobile device" class="mobile-icon" />
      <h1>Mobile Only</h1>
      <p>This website is only available on mobile devices. Please open it on your smartphone or tablet.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isMobile: false
    }
  },
  mounted() {
    this.checkDeviceWidth()
    window.addEventListener('resize', this.checkDeviceWidth)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkDeviceWidth)
  },
  methods: {
    checkDeviceWidth() {
      this.isMobile = window.innerWidth <= 768 // Adjust this breakpoint as needed
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.desktop-message {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

.mobile-icon {
  width: 300px; 
  margin-bottom: 20px;
}
</style>