<template>
  <div id="app">
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<style lang="scss">
#app {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>
