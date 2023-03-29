<template>
  <div class="products">
    <h1 class="products__title">блюда
      <div class="products__item products__item_plus" @click="()=>{
        state.edited = true
        state.added = true
      }">
        <span>+</span>
      </div>
    </h1>
    <div class="products__content">
      <div class="products__item" v-for="meal in state.meals" @click.stop="()=>{editInit(meal.id)}">
        <span>{{ meal.title }}</span>
      </div>
    </div>
    <WindowComponent v-if="state.added||state.edited" @closeWindow="()=>{
      state.added = false
      state.edited = false
    }">
      <div class="products__add">
        <h1>Создать блюдо</h1>
        <p>Название:</p>
        <el-input v-model="state.addedMeal.title" placeholder="Название"/>
        <p>Описание:</p>
        <el-input v-model="state.addedMeal.description" type="textarea" placeholder="Описание"/>
        <p>Изображение:</p>
        <el-input placeholder="Название изображения" style="margin-bottom: 20px" v-model="state.addedMeal.image"/>
        <img :src="state.addImage" alt="" v-if="state.addImage !== ''">
        <p>Ингредиенты:</p>
        <el-select
            v-model="state.addedMeal.products"
            multiple
            filterable
            remote
            reserve-keyword
            remote-show-suffix
            class="m-2"
            placeholder="Выбирай"
            :remote-method="remoteMethod"
            size="large">
          <el-option
              v-for="item in state.options.sort((a,b)=>a.title.localeCompare(b.title)).map(item =>{
              return {value: item.id,label: item.title}})"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
        <el-button type="success" style="margin: 20px 0; align-self: flex-start" size="large" @click="()=>{
          if(state.added){createMeal()}
          if(state.edited){editMeal()}
        }">
          Добавить
        </el-button>
      </div>
    </WindowComponent>
  </div>
</template>

<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import axios from "axios";
import {useMainStore} from "@/stores/mainStore";
import WindowComponent from "@/components/WindowComponent.vue";


const state = reactive({
    meals: [],
    products: [],
    options: [],
    added: false,
    edited: false,
    addedMeal: {
        title: '',
        description: '',
        image: '',
        products: []
    },
    addImage: ''
})

const store = useMainStore()

const loading = ref(false)

const remoteMethod = (query) => {
    if (query) {
        loading.value = true
        setTimeout(() => {
            loading.value = false
            state.options = state.products.filter((item) => {
                return item.title.toLowerCase().includes(query.toLowerCase())
            })
        }, 0)
    } else {
        state.options = []
    }
}

const editInit = async id => {
  store.isFetching = true
  await axios.get(import.meta.env.VITE_BASE_URL + "/api/meals/" + id).then(res => {
    state.addedMeal.id = res.data.id
    state.addedMeal.title = res.data.title
    state.addedMeal.description = res.data.description.result.path
    state.addedMeal.image = res.data.image.name
    state.addImage = res.data.image.file
    state.addedMeal.products = res.data.products.map(product => product.id)
    store.isFetching = false
  })
  state.edited = true
}

const editMeal = async () =>{
  store.isFetching = true
  await axios.put(import.meta.env.VITE_BASE_URL + "/api/meals/edit", {
    id: state.addedMeal.id,
    title: state.addedMeal.title,
    description: state.addedMeal.description,
    image: state.addedMeal.image,
    products: state.addedMeal.products
  }).then(res => {
    store.isFetching = false
  })
  state.edited = false
  await init()
  state.addedMeal ={
        title: '',
        description: '',
        image: '',
        products: []
  }
  state.edited = false
  state.added = false
}

const createMeal = async () => {
  store.isFetching = true
  await axios.post(import.meta.env.VITE_BASE_URL + "/api/meals/create", {
    title: state.addedMeal.title,
    description: state.addedMeal.description,
    image: state.addedMeal.image,
    products: state.addedMeal.products
  }).then(res => {
    store.isFetching = false
  })
  state.edited = false
  state.added = false
  await init()
  state.addedMeal ={
    title: '',
    description: '',
    image: '',
    products: []
  }
}

const init = async () => {
  store.isFetching = true
  axios.get(import.meta.env.VITE_BASE_URL + "/api/meals").then(res => {
    state.meals = res.data
    store.isFetching = false
  })
}

const initProducts = async () => {
  store.isFetching = true
  await axios.get(import.meta.env.VITE_BASE_URL + "/api/products").then(res => {
    state.products = res.data
    store.isFetching = false
  })
}

onMounted(async () => {
  await init()
  await initProducts()
})
</script>

<style lang="scss" scoped>
.products {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  &__title {
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

  &__item {
    padding: 10px;
    margin: 10px;
    border-radius: 5px;
    border: 1px solid #505050;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      scale: 1.1;
      transition: 0.2s;
    }
  }

  &__item_plus {
    background-color: #8d1aad;
    color: white;
    border: none;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__add {
    display: flex;
    flex-direction: column;

    h1 {
      font-weight: lighter;
    }
  }
}
</style>
