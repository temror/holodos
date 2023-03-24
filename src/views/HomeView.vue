<template>
  <main class="main" @click="state.showRes=false">
    <div @click.stop style="position: relative; width: 100%; display: flex; align-items: center; justify-content: center">
      <img :src="state.img" alt="" v-if="state.img!==''"/>
      <div style="position: relative; display: flex; flex-direction: column; align-items: center">
        <input placeholder="че завалялось?" v-model="state.input" @change="log" class="main__input"
               @focusin="state.showRes=true"/>
        <div class="main__results">
          <div v-if="state.selectedProducts.length!==0" class="main__addProd">
            <p v-for="(prod, index) in state.selectedProducts">{{ prod.title }}
              <el-icon style="margin-left: 10px; cursor: pointer" @click="state.selectedProducts.splice(index,1)">
                <Close/>
              </el-icon>
            </p>
            <p style="background-color: #337ecc; color: white; cursor:pointer;" @click="find">Найти че приготовить 🍲</p>
          </div>
        </div>
        <div class="main__meals" v-if="state.findMeals.length!==0">
          <h2>А вот че</h2>
          <div class="main__mealContent">
            <div v-for="meal in state.findMeals" class="main__meal">
              <h3>{{ meal.title }}</h3>
              <img :src="img + meal.image" alt="" v-if="meal.image" style="width: 150px; height: 150px;">
              <p><span>Че есть: </span>{{ meal.selectedProducts.reduce((acc, el) => acc += `${el.title}, `, "").slice(0, -2) }}</p>
              <p><span>Че надо: </span>{{ meal.products.reduce((acc, el) => acc += `${el.title}, `, "").slice(0, -2) }}</p>
            </div>
          </div>
        </div>
      </div>
      <input type="file" ref="file" @change="fileLoader" hidden>
<!--      <button @click="$refs.file.click">Открыть файл</button>-->
      <div class="main__searchRes" v-if="state.results.length !== 0 && state.showRes">
        <p v-for="item in state.results" @click="()=>add(item)">{{ item.title }}</p>
      </div>
    </div>
    <Fetching v-if="store.isFetching"/>
  </main>
</template>
<script setup>
import {reactive, watch} from "vue";
import axios from "axios";
import {Close} from "@element-plus/icons-vue";
import Fetching from "@/components/Fetching.vue";
import {useMainStore} from "@/stores/counter";

const store = useMainStore()

const img ="data:image/jpeg;base64,"

const fileLoader = async e =>{
  const file = e.target.files[0]
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = async () =>{
    console.log(reader.result)
   /* await axios.post(import.meta.env.VITE_BASE_URL + "/api/meals/img", {
      image: reader.result.split(',')[1],
      id: 3
    }).then(res => {
      console.log(res)
    })*/
  }
}
const log = () => {
  console.log(state.input)
}

const find = async () => {
  const productsId = state.selectedProducts.map(item => item.id)
  store.isFetching = true
  await axios.post(import.meta.env.VITE_BASE_URL + "/api/meals", {
    productsId
  }).then(res => {
    console.log(res)
    state.findMeals = res.data.sort((a, b) => b.selectedProducts.length - a.selectedProducts.length)
  })
  store.isFetching = false
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
    state.showRes = false
  }
}

const res = debounce(req, 500)

const state = reactive({
  input: '',
  results: [],
  selectedProducts: [],
  findMeals: [],
  showRes: false,
  img: ''
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

  &__results {
    position: absolute;
    top: 120px;
    left: 30px;
  }

  &__addProd {
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

  &__meals {
    flex: 1 1 auto;
    width: 80vw;
    position: absolute;
    top: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-bottom: 100px;
    h2{
      text-align: center;
      font-family: Dialog, sans-serif;
      font-weight: normal;
      font-size: 30px;
    }
  }

  &__meal {
    max-width: 20rem;
    padding: 20px;
    margin: 20px;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(1,1,1,0.2);
    cursor: pointer;
    transition: 0.1s;
    &:hover{
      scale: 1.01;
      transition: 0.1s;
    }
    h3{
      font-weight: lighter;
      font-family: Dialog, sans-serif;
      font-size: 1.5rem;
    }
    span{
      font-weight: bold;
    }
    p{
      font-family: Dialog, sans-serif;
    }
  }
  &__mealContent {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
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
    &__meal{
      display: flex;
      flex-direction: column;
      align-items: center;
      p{
        text-align: center;
      }
    }
  }
}
</style>
