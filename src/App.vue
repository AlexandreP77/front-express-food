<template>
  <div>
    <Navbar />
    <router-view />
    <Footer />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

export default {
  components: {
    Navbar,
    Footer
  },
  mounted() {
    const redirectPath = localStorage.getItem('redirectAfterLogin');
    if (redirectPath) {
      this.$router.push(redirectPath);
      localStorage.removeItem('redirectAfterLogin');
    }
  }
}
</script>
