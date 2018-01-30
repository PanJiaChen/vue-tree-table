import TreeTable from './vue-tree-table.vue'

export default TreeTable

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component('tree-table', TreeTable)
}
