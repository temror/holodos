<template>
  <main class="main" @click="state.showRes=false">
    <div @click.stop style="position: relative">
      <div v-if="state.selectedProducts.length!==0" class="main__addProd">
        <p v-for="(prod, index) in state.selectedProducts">{{ prod.title }}
          <el-icon style="margin-left: 10px; cursor: pointer" @click="state.selectedProducts.splice(index,1)">
            <Close/>
          </el-icon>
        </p>
      </div>
      <input placeholder="че завалялось?" v-model="state.input" @change="log" class="main__input" @focusin="state.showRes=true"/>
      <div class="main__searchRes" v-if="state.results.length !== 0 && state.showRes">
        <p v-for="item in state.results" @click="()=>add(item)">{{ item.title }}</p>
      </div>
    </div>
  </main>
</template>

<script setup>
import {reactive, watch} from "vue";
import axios from "axios";
import {Close} from "@element-plus/icons-vue";

const log = () => {
  console.log(state.input)
}

function debounce(callback, delay) {
  let timer = null;

  return (...args) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      callback(...args)
    }, delay)
  }
}

const req = async () => {
  if (state.input) {
    await axios.post(import.meta.env.VITE_BASE_URL + "/api/products", {
      input: state.input.toLowerCase()
    }).then(res => state.results = res.data)
  } else {
    state.results = []
  }
}

const add = product => {
  if (state.selectedProducts.filter(item => item.id === product.id).length === 0) {
    state.selectedProducts.push(product)
    state.showRes=false
  }
}

const res = debounce(req, 500)

const state = reactive({
  input: '',
  results: [],
  selectedProducts: [],
  showRes: false
})

watch(() => state.input, () => {
  res()
})
</script>


<style lang="scss" scoped>
.main {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &__input {
    width: 40rem;
    padding: 20px;
    font-size: 30px;
    border: none;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(1, 1, 1, 0.2);
    outline: none;
    margin: 30px 30px 5px 30px;
  }

  &__searchRes {
    position: absolute;
    top: 110px;
    width: 42rem;
    padding: 4px;
    font-size: 20px;
    border: none;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(1, 1, 1, 0.2);
    outline: none;
    margin: 5px 30px 30px 30px;
    background-color: white;

    p {
      cursor: pointer;
      margin: 0;
      padding: 8px 5px;
      border-radius: 5px;
    }

    p:hover {
      background-color: rgba(243, 183, 55, 0.33);
    }
  }

  &__addProd {
    position: absolute;
    top: 120px;
    left: 30px;
    display: flex;
    flex-wrap: wrap;
    width: 40rem;

    p {
      background-color: white;
      padding: 10px;
      margin: 5px;
      border-radius: 5px;
      border: 1px solid #dcdcdc;
      width: auto;
      display: flex;
      align-items: center;
    }
  }
}

@media (max-width: 900px) {
  .main {
    &__input {
      margin: 30px;
      padding: 15px;
      font-size: 25px;
      width: 80%;
      max-width: 500px;
      color: #464646;
    }
    &__searchRes {
      width: 85%;
    }
    &__addProd {
      bottom: 100px;
      width: 85%;
    }
  }
}
</style>
