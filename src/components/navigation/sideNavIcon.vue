<template>
  <router-link :class="{'active' : isActive}" :to="route" class="icon-link"  >
    <svg width="38" height="38" viewBox="0 0 40 40" fill="#818183">
      <path :d="path" />
    </svg>
    <div class="flying-text">
      <p>{{menuName}}</p>
    </div>
  </router-link>
</template>

<script setup>

const props = defineProps({
  isActive: Boolean,
  menuName: String,
  active: {
    type: String,
    default: 'active',
  },
  route: {
    type: [String, Object],
    required: true,
  },  
  path: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.icon-link {
  @apply
    relative justify-center items-center inline-flex w-full z-50
}

svg {
  @apply 
    hover:fill-[#2482E6] cursor-pointer transition-all ease-in-out z-50
}
.flying-text {
  @apply 
    absolute w-auto py-2 px-8 ml-4 min-w-max left-12 rounded-md shadow-md
    text-white bg-gray-900 
    text-xs font-bold 
    transition-all duration-200 scale-0 origin-left z-50
}

svg:hover + .flying-text {
  @apply 
  scale-100
}

.active svg {
  @apply fill-[#2482E6] z-50
}

.active {
  @apply border-r-2 border-[#509BEB] z-50
}




 
</style>