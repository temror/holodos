<template>
  <div class="fetching">
    <div class="fetching__content">
      <img src="@/assets/load.gif">
    </div>
  </div>
</template>

<script setup>
import {Loading} from "@element-plus/icons-vue";
import {ElIcon} from "element-plus";

</script>

<style lang="scss" scoped>
.fetching{
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  &__content{
    img{
      width: 200px;
    }
  }
}
</style>
