<template>
  <div class="app-container">
    <el-table :data="tableData" :row-style="showTr" v-bind="$attrs" @selection-change="handleSelectionChange">
      <el-table-column v-if="selection" type="selection" :width="selectionWidth">
      </el-table-column>
      <el-table-column align="center" label='ID' width="95">
        <template slot-scope="scope">
          <span :style="{paddingLeft:judegeLevel(scope.row)*levelPadding+'px'}">{{scope.row.id}}</span>
          <el-button class="expand-button" type="text" size="mini" v-if="showExpanIcon(scope.row)" @click="toggleExpand(scope.$index)">
            <i :class="scope.row._isExpanded?collapseIcon:expandIcon"></i>
          </el-button>
        </template>
      </el-table-column>
      <slot/>
    </el-table>
  </div>
</template>



<script>

export default {
  props: {
    data: {
      type: Array,
      default: []
    },
    levelPadding: {
      type: Number,
      default: 20
    },
    expandAnimation: {
      type: String,
      default: 'animation:treeTableShow 1s;'
    },
    expandIcon: {
      type: String,
      default: 'el-icon-plus'
    },
    collapseIcon: {
      type: String,
      default: 'el-icon-minus'
    },
    selection: {
      type: Boolean,
      default: false
    },
    selectionWidth: {
      type: Number,
      default: 55
    }
  },
  data() {
    return {
      listLoading: false,
      tableData: []
    }
  },

  created() {
    this.tableData = this.formatData(this.data)
  },

  methods: {
    formatData(data, parentId) {
      let tempData = []
      data.forEach((item, index) => {
        if (parentId !== undefined) {
          this.$set(item, '_isExpanded', false)
          this.$set(item, '_isShow', false)
          this.$set(item, '_parentId', parentId + '')
          this.$set(item, '_id', parentId + '-' + index)
        } else {
          this.$set(item, '_isExpanded', false)
          this.$set(item, '_isShow', true)
          this.$set(item, '_id', index + '')
        }
        if (item.children && item.children.length > 0) {
          tempData.push(item)
          tempData = tempData.concat(this.formatData(item.children, parentId ? parentId + '-' + index : index + ''))
        } else {
          tempData.push(item)
        }
      })
      console.log(tempData)
      return tempData
    },
    showTr: function({ row, index }) {
      const show = (row._parentId === undefined) || row._isShow
      return show ? this.expandAnimation : 'display:none;'
    },
    toggleExpand: function(trIndex) {
      const record = this.tableData[trIndex]
      record._isExpanded = !record._isExpanded

      const arr = this.tableData.filter(i => {
        return i._parentId === record._id
      })
      console.log(arr)
      arr.forEach(i => {
        i._isShow = !i._isShow
      })
    },
    showExpanIcon(record) {
      if (record.children && record.children.length > 0) {
        return true
      }
      return false
    },
    judegeLevel(row) {
      return (row._id + '').split('-').length - 1
    },
    handleSelectionChange(val) {
      this.$emit('selection-change', val)
    }
  }
}
</script>

<style>
@keyframes treeTableShow {
    from {opacity: 0;}
    to {opacity: 1;}
  }
</style>

<style scoped>

.expand-button{
  margin-left: -20px;
}
</style>
