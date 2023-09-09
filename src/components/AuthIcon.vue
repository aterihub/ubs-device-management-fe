
<template>
    <div>
      <svg :src="svgUrl"></svg>
    </div>
</template>
  
  <script>
  export default {
    props: {
      fileName: {
        type: String,
        required: true,
      },
    },
    computed: {
      svgUrl() {
        return `/assets/${this.fileName}.svg`;
      },
    },
  };
  </script>