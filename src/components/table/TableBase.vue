<template>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th v-for="th in tableHeader" :key="th">
            <div>
              <span>{{ th }}</span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <slot></slot>
      </tbody>
    </table>
  </div>
</template>

<script>

export default {
  props: [
    'tableHeader','tableData'
  ]
}
</script>

<style scoped>

.table-container table {
  @apply  bg-[#DDE8FA]/60 backdrop-blur-lg
          mb-10
}

.table-container thead {
  @apply border-b-2 border-[#3a3a3e]
}


.table-container th {
  @apply min-w-[140px] font-semibold py-3 px-5
}
.table-container td {
  @apply min-w-[140px] py-3 px-5
}

.table-container tr {
  @apply text-left
} 

</style>