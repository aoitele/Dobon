<template>
  <div>
    <div class="index-wrap">
      <h1 class="title">Dobon</h1>
      <img src="image/numa_hamaru_woman.png" class="mv" />
      <div>
        <form id="app">
          <input
            v-model="invitationCode"
            type="text"
            placeholder="enter your invitation code"
            class="invitaionForm"
          />
          <input type="button" value="参加する" @click="submit" />
        </form>
      </div>
      <NuxtLink to="/room"> ルームを選んで参加する </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    return {}
  }
})
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 30px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
