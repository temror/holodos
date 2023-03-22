<template>
  <main class="main">
    <input placeholder="че завалялось?" v-model="state.input" @change="log" class="main__input"/>
  </main>
</template>

<script setup>
import {reactive, watch} from "vue";

const log = () =>{
  console.log(state.input)
}

function debounce(callback, delay) {
  let timer = null;

  return(...args) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(()=>{
      callback(...args)
    }, delay)
  }
}

const res = debounce(()=>{console.log(state.input)},300)

const state = reactive({
  input: ''
})

watch(()=>state.input, ()=>{
  res()
})
</script>


<style lang="scss" scoped>
.main{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  &__input{
    width: 40rem;
    padding: 20px;
    font-size: 30px;
    border: none;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(1,1,1,0.2);
    outline: none;
  }
}
</style>
