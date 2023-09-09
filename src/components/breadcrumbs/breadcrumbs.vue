<template>
  <nav class="breadcrumbs">
    <ul>
      <li><router-link to="/">Home</router-link></li>
      <li v-for="(crumb, index) in crumbs" :key="index">
        <router-link :to="crumb.route">{{ crumb.name }}</router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'Breadcrumbs',
  computed: {
    crumbs() {
      const matchedRoutes = this.$route.matched
      return matchedRoutes.map((route, index) => {
        const name = route.meta.title || route.name
        const routePath = matchedRoutes
          .slice(0, index + 1)
          .map(route => route.path)
          .join('')
        return { name, route: routePath }
      })
    }
  }
}
</script>

<style scoped>
.breadcrumbs {
  margin: 10px 0;
}

.breadcrumbs ul {
  list-style: none;
  display: flex;
  align-items: center;
}

.breadcrumbs li:not(:last-child) {
  margin-right: 10px;
}

.breadcrumbs a {
  text-decoration: none;
  color: #2d3748;
}

.breadcrumbs a:hover {
  text-decoration: underline;
}
</style>
