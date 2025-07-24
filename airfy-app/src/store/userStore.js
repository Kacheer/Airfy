import { defineStore } from "pinia";

export const useUserStore = defineStore ('userStore', {

  state: () => ({
    userPos: {
      lat: null,
      long: null
    },
    language: null,
    requestTime: null
  }),

    actions: {
        setUserPos(lat, long) {
            this.userPos.lat = lat,
            this.userPos.long = long
            console.log("[STORE] Данные занесены ", this.userPos)
            return true
        },
        getUserPos() {
          console.log("[STORE] Данные возвращаются ", this.userPos)
          return this.userPos
        },

        setRequestTime() {
          console.log("таак")
          const date = new Date()
          const time = date.getTime()
          this.requestTime = time
           console.log("Заебись")
        },
        getRequestTime() {
          return this.requestTime
        }
        
    },

  getters: {

  },
  persist: true
})