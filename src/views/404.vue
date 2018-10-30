<template>
  <section class="error-page">
    <img src="../assets/logo.png" alt="Logo" width="200"/>
    <h1 class="title">
      <router-link class="button" to="/">
      404
      </router-link>
    </h1>
  </section>
</template>

<style scoped lang="scss">
.error-page {
  text-align: center;
  min-height: 20rem;
  margin: 10rem 0;
}
.title
{
  margin-top: 15px;
  font-size: 5em;
}
.info
{
  font-weight: 300;
  color: #9aabb1;
  margin: 0;
}
.button
{
  margin-top: 50px;
}
</style>
