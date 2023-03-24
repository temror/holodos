<template>
  <div class="products" @click="()=>{
    state.edited=false
    state.added=false
  }">
    <h1 class="products__title">продукты
      <div class="products__item products__item_plus" @click.stop="state.added=true">
        <span>+</span>
      </div></h1>
    <input type="text" class="products__input" v-if="state.edited" v-model="state.editValue.title" @keydown.enter="edit" v-focus @click.stop>
    <input type="text" class="products__input" v-if="state.added" v-model="state.addValue" @keydown.enter="add" placeholder="Добавить продукт" v-focus @click.stop>
    <div class="products__content">
      <div class="products__item" v-for="product in state.products" @click.stop="()=>{
        state.edited = true
        state.editValue=product
      }">
        <span>{{ product.title }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, reactive} from "vue";
import axios from "axios";
import {useMainStore} from "@/stores/counter";

const store = useMainStore()

const vFocus = {
  mounted: (el) => el.focus()
}

const state = reactive({
  products: [],
  editValue: null,
  addValue: "",
  edited: false,
  added: false
})

const edit = async () =>{
  store.isFetching = true
  state.edited = false
  await axios.put(import.meta.env.VITE_BASE_URL + "/api/products/edit",{
    id: state.editValue.id,
    title: state.editValue.title
  }).then(res => {
    store.isFetching = false
  })
  state.editValue = null
  await init()
}

const add = async () =>{
  store.isFetching = true
  state.added = false
  await axios.post(import.meta.env.VITE_BASE_URL + "/api/products/add",{
    title: state.addValue
  }).then(res => {
    store.isFetching = false
  })
  state.addValue = null
  await init()
}

const init = async () =>{
  store.isFetching = true
  axios.get(import.meta.env.VITE_BASE_URL + "/api/products").then(res => {
    state.products = res.data
    store.isFetching = false
  })
}

onMounted(async () => {
  await init()
})
</script>

<style lang="scss" scoped>
.products {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  &__title{
    text-align: center;
    font-weight: lighter;
    font-size: 40px;
    display: flex;
    align-items: center;
  }
  &__content {
    display: flex;
    flex-wrap: wrap;
    max-width: 1000px;
    justify-content: space-between;
  }
  &__item{
    padding: 10px;
    margin: 10px;
    border-radius: 5px;
    border:  1px solid #505050;
    cursor: pointer;
    transition: 0.2s;
    &:hover{
      scale: 1.1;
      transition: 0.2s;
    }
  }
  &__item_plus{
    background-color: #8d1aad;
    color: white;
    border: none;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__input{
    border: none;
    width: auto;
    box-shadow: 0 0 10px rgba(1,1,1,0.2);
    padding: 10px;
    margin: 30px;
    border-radius: 5px;
    outline: none;
  }
}
</style>
