<template>
  <div>
    <div class='index-wrap'>
      <h1 class='title'>Dobon</h1>
      <!-- logging: {{ logging }} -->
      <img src='image/numa_hamaru_woman.png' class='mv' />
      <div>
        <!-- <form id='app'>
          <input
            type='text'
            v-model='invitationCode'
            placeholder='enter your invitation code'
            class='invitaionForm'
          />
           <p v-if="errors.length">
            <ul>
              <li 
              v-for="error in errors" 
              :key="error">
              {{ error }}
              </li>
            </ul>
            </p>
            <input type="button" @click="submit" value="参加する">
        </form> -->
      
      </div>
      <NuxtLink to='/room'>ルームを選んで参加する</NuxtLink>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, useContext } from '@nuxtjs/composition-api';

export default defineComponent({
  setup() {
    const { route } = useContext()
    console.log(route)
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
