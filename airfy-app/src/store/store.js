import { defineStore } from "pinia";

export const useStore = defineStore ('store', {

    state: () => (
    { value: 0 }
    ),

    actions: {
        increment() {
            this.value++
        }
    },

  getters: {
    double() {
      return this.value * 2;
    }
  }
})