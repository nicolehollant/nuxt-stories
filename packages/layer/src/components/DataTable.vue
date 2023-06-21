<template>
  <div class="table-wrapper">
    <table style="table-layout: auto">
      <thead v-if="columnNames">
        <tr>
          <th v-for="(column, i) in columnNames" :key="i">
            {{ column }}
          </th>
        </tr>
      </thead>
      <tbody v-if="data">
        <slot :data="data">
          <tr v-for="(row, i) in data" :key="'row-' + i">
            <td v-for="(cell, j) in row" :key="['cell', i, j].join('-')">
              {{ cell }}
            </td>
          </tr>
        </slot>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  columns?: string[]
  rows?: string[][] | Record<string, unknown>[]
}>()

const constructColumnNamesFromSparseRows = () => {
  const columnNames = new Set()
  props.rows?.forEach((row) => {
    Object.keys(row).forEach((key) => {
      columnNames.add(key)
    })
  })
  return [...columnNames] as string[]
}

const columnNames = computed(() => {
  if (props.columns) {
    return props.columns
  }
  if (!props.rows || !Array.isArray(props.rows)) {
    return null
  }
  if (Object.keys(props.rows[0]).length) {
    return constructColumnNamesFromSparseRows()
  }
  return null
})

const ensureRowLength = (row: any[]) => {
  const length = columnNames.value?.length
  if (!length) {
    return row
  }
  return Array.from({ length }).map((_, i) => {
    return row.at(i)
  })
}

const data = computed(() => {
  if (!props.rows || !Array.isArray(props.rows)) {
    return null
  }
  if (Object.keys(props.rows[0]).length) {
    if (columnNames.value) {
      return props.rows.map((row) =>
        columnNames.value!.map((columnName) => (row as Record<string, unknown>)?.[columnName])
      )
    }
    return props.rows.map((row) => ensureRowLength(Object.values(row)))
  }
  return props.rows
})
</script>

<style>
td,
th {
  padding: 0.5rem;
  border-right: 1px solid #333;
  border-bottom: 1px solid #333;
}
th:last-child {
  border-right: none;
}
tbody tr:last-child {
  border-bottom: none;
}
tbody td:last-of-type {
  border-right: none;
}
thead {
  border-bottom: 2px solid #333;
  background-color: #111;
  text-align: left;
}

.prose thead th:first-child,
.prose thead th:last-child,
.prose tbody td:first-child,
tfoot td:first-child,
.prose tbody td:last-child,
tfoot td:last-child {
  padding-right: 0.5rem !important;
  padding-left: 0.5rem !important;
}

.prose thead th:first-of-type {
  border-top-left-radius: 0.5rem;
}
table {
  overflow: hidden;
  min-width: 100%;
}
.table-wrapper {
  overflow: auto;
  width: 100%;
  outline: 2px solid #333;
  border-radius: 0.5rem;
}
</style>
