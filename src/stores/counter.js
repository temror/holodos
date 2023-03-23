import {ref, computed, reactive} from 'vue'
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', () => {
  const state = reactive({
    isFetching: false
  })

  return { isFetching: state.isFetching }
})
