<template>
  <div class="h-screen flex flex-col overflow-y-hidden">
    <!-- Header -->
    <Header />
    <!-- Main Content -->
    <main class="p-8 w-screen h-full overflow-y-auto">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" v-if="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useServicesStore } from './store/services';
import Header from './components/Header.vue';

const servicesStore = useServicesStore();

// Load services when app starts
onMounted(() => {
  servicesStore.loadServices();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

#app {
  background-color: white;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  display: flex;
  width: 100%;
  flex-direction: column;
}
</style>
