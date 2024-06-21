<template>
  <nav class="fixed top-0 w-full z-50 bg-orange-300 p-4 text-black">
    <div class="container mx-auto flex justify-between items-center">
      <img src="../assets/images/mona.png" alt="Pizza Delisa" class="h-14">
      <button @click="toggleMenu" class="text-black hover:text-black md:hidden">
        <img src="../assets/images/menu-icon.png" alt="Menu" class="h-6">
      </button>
      <div :class="{'block': isMenuOpen, 'hidden': !isMenuOpen, 'fixed inset-0 bg-orange-300 z-50 p-4 md:hidden': isMenuOpen}" class="md:flex md:items-center md:justify-end md:relative md:bg-transparent md:border-none">
        <a href="/" class="block text-center py-2 w-full text-black hover:bg-orange-400 md:hover:bg-transparent md:w-auto md:mx-2">Accueil</a>
        <a v-if="!isLivreur" href="/Carte" class="block text-center py-2 w-full text-black hover:bg-orange-400 md:hover:bg-transparent md:w-auto md:mx-2">Nos Pizzas</a>
        <a v-if="isAuthenticated && !isLivreur" href="/Suivi-commande" class="block text-center py-2 w-full text-black hover:bg-orange-400 md:hover:bg-transparent md:w-auto md:mx-2">Suivi de commande</a>
        <a v-if="isLivreur" href="/Livreur" class="block text-center py-2 w-full text-black hover:bg-orange-400 md:hover:bg-transparent md:w-auto md:mx-2">Espace Livreur</a>
        <a v-if="!isAuthenticated" href="/Connexion" class="block text-center py-2 w-full text-black hover:bg-orange-400 md:hover:bg-transparent md:w-auto md:mx-2">Connexion</a>
        <a v-else @click.prevent="logout" class="block text-center py-2 w-full text-black hover:bg-orange-400 md:hover:bg-transparent md:w-auto md:mx-2">Déconnexion</a>
        <a v-if="!isLivreur" href="/Panier" class="block text-center py-2 w-full text-black hover:bg-orange-400 md:hover:bg-transparent md:w-auto md:mx-2">
          <img src="../assets/images/panier.png" alt="Panier" class="h-6 mx-auto">
        </a>
      </div>
    </div>
  </nav>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      isAuthenticated: false,
      isLivreur: false,
      isMenuOpen: false
    };
  },
  created() {
    this.checkAuthentication();
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    async checkAuthentication() {
      const token = localStorage.getItem('authToken');
      if (token) {
        await this.checkIfLivreur(token);
        this.isAuthenticated = true;
      }
    },
    async checkIfLivreur(token) {
      try {
        const response = await axios.get('http://127.0.0.1:8000/livreurs/', {
          headers: { Authorization: `Token ${token}` }
        });
        const livreurs = response.data;
        const username = localStorage.getItem('username');
        const user = livreurs.find(livreur => livreur.user.username === username);
        this.isLivreur = !!user;
      } catch (error) {
        console.error('Erreur lors de la vérification du rôle de livreur:', error);
      }
    },
    logout() {
      localStorage.removeItem('authToken');
      this.isAuthenticated = false;
      this.isLivreur = false;
      this.$router.push('/');
    }
  }
};
</script>


<style>
body {
  padding-top: 70px;
}
</style>