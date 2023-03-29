<template>
  <div class="admin">
    <div class="admin__content">
      <h1>Админка</h1>
      <div class="admin__buttonBlock">
        <el-button @click="state.selectedBlock = pages.meals">Блюда</el-button>
        <el-button @click="state.selectedBlock = pages.products">Ингредиенты</el-button>
      </div>
      <MealsComponent class="admin__page" v-if="state.selectedBlock===pages.meals"/>
      <ProductsComponent class="admin__page" v-if="state.selectedBlock===pages.products"/>
    </div>
  </div>
  <Fetching v-if="store.isFetching"/>
</template>

<script setup>
import {reactive} from "vue";
import MealsComponent from "@/components/admin/MealsComponent.vue";
import ProductsComponent from "@/components/admin/ProductsComponent.vue";
import Fetching from "@/components/Fetching.vue";
import {useMainStore} from "@/stores/mainStore";

const store = useMainStore()

const pages =  {meals: 'meals', products: 'products'}

const state = reactive({
  selectedBlock: pages.meals
})
</script>

<style lang="scss" scoped>
.admin{
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Dialog, sans-serif;
  &__content{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
}
</style>
