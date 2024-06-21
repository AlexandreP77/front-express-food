<template>
    <div class="container mx-auto px-4 py-16">
      <div class="max-w-md mx-auto bg-white p-8 rounded-md shadow-md">
        <h2 class="text-2xl font-bold text-center mb-6">Inscription</h2>
        <form @submit.prevent="register">
          <div class="mb-4">
            <label for="username" class="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
            <input
              type="text"
              id="username"
              v-model="username"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              required
            />
          </div>
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">Adresse e-mail</label>
            <input
              type="email"
              id="email"
              v-model="email"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              required
            />
          </div>
          <div class="mb-4">
            <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              id="password"
              v-model="password"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              required
            />
          </div>
          <div class="mb-4">
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="confirmPassword"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Inscription
          </button>
        </form>
        <p v-if="error" class="mt-4 text-red-500">{{ error }}</p>
        <div class="mt-4 text-center">
          <p>Vous avez déjà un compte ?</p>
          <button
            @click="goToConnexion"
            class="mt-2 w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Connexion
          </button>
        </div>
        <p v-if="success" class="mt-4 text-green-500">{{ success }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'Inscription',
    data() {
      return {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        error: '',
        success: ''
      };
    },
    methods: {
      register() {
        if (this.password !== this.confirmPassword) {
          this.error = 'Les mots de passe ne correspondent pas';
          return;
        }
  
        axios.post('http://127.0.0.1:8000/inscription/?format=json', {
          username: this.username,
          email: this.email,
          password: this.password
        })
        .then(response => {
          console.log('Inscription réussie:', response.data);
          this.success = 'Inscription réussie! Vous pouvez maintenant vous connecter.';
          this.error = '';
        })
        .catch(error => {
          console.error('Erreur lors de l\'inscription:', error);
          this.error = 'Erreur lors de l\'inscription, veuillez réessayer.';
          this.success = '';
        });
      },
      goToConnexion() {
        this.$router.push('/connexion');
      }
    }
  };
  </script>
  
  <style scoped>
  button {
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #1c64f2;
  }
  </style>
  