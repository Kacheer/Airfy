    <script>
    import { useStore } from "../store/store.js"
    
    export default {
      name: "HelloWorld",
      props: {
        msg: String
      },
      data() {
        return {
          store: useStore()
        }
      },
      computed: {
        count() {
          return this.store.value
        },
        double() {
          return this.store.double
        }
      },
      methods: {
        increment() {
          this.store.increment()
        }
      }
    }
    </script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="increment">count is {{ count }}</button>
    <button type="button">double count is {{ double }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>
    , the official Vue + Vite starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
       target="_blank">Vue Docs Scaling up Guide </a>.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>


<style scoped>
.read-the-docs {
  color: #888;
}
.card {
  display: flex;
  flex-direction: column;
}
</style>