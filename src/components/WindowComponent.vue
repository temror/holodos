<template>
  <div class="wrapper" @click="$emit('closeWindow')">
    <div class="content" @click.stop>
      <el-icon class="icon" @click="$emit('closeWindow')">
        <Close/>
      </el-icon>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import {Close} from "@element-plus/icons-vue";
import {ElIcon} from "element-plus";

export default {
  components: {Close}
}
</script>

<style lang="scss" scoped>
.wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}
.content{
  width: 30vw;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  position: relative;
}
.icon{
  position: absolute;
  top: 10px;
  right: 12px;
  cursor: pointer;
  &:hover{
    color: #c45656;
  }
}
</style>
