<template>
  <div>
    <div class='index-wrap'>
      <h1 class='title'>Dobon</h1>
      logging: {{ logging }}
      <img src='image/numa_hamaru_woman.png' class='mv' />
      <div>
        <form id='app'>
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
        </form>
      </div>
      <router-link to='/room'>ルームを選んで参加する</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      logging: false, 
      invitationCode: null,
      errors: []
    };
  },
  methods: {
    async submit() {
      this.logging = true;
      try {
        //const res = await this.$axios.get('/api/login', { params:{ invitationcode: this.invitationCode }})
        console.log(process.env.API_BASE_URL, 'API_BASE_URL');
        const res1 = await this.$axios.get('/room');
        console.log(res1, 'res1');

        const res2 = await this.$axios.get(process.env.API_BASE_URL + '/room');
        console.log(res2, 'res2');
      } catch(e) {
        console.log(e, 'e')
      }
      this.logging = false;
    },
    checkForm: function (e) {
      if (this.invitationCode) {
        return true;
      }

      this.errors = [];
      if (!this.invitationCode) {
        this.errors.push('code required');
      }
      e.preventDefault();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/style.scss";
@import "../assets/scss/index.scss";
</style>
