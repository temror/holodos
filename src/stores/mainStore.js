import {ref, computed, reactive} from 'vue'
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', () => {
  const state = reactive({
    //Состояние загрузки ресурса
    isFetching: false
  })

  //Функция debounce()
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

  //Функция парсинга node-элементов в html
  function nodeToDom(node) {
    let domNode = null
    if (typeof node === 'string' || node instanceof String) {
      return document.createTextNode(node);
    }
    if (node.tag) {
      domNode = document.createElement(node.tag);
      if (node.attrs) {
        for (let name in node.attrs) {
          let value = node.attrs[name];
          domNode.setAttribute(name, value);
        }
      }
    } else {
      domNode = document.createDocumentFragment();
    }
    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        let child = node.children[i];
        domNode.appendChild(nodeToDom(child));
      }
    }
    domNode.style.fontFamily = 'Dialog,sans-serif'
    domNode.style.lineHeight = '30px'
    node.tag !== 'h3' && (domNode.style.fontWeight = 'lighter')
    return domNode;
  }

  return { isFetching: state.isFetching, debounce, nodeToDom }
})
