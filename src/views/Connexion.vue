<template>
    <div class="container mx-auto px-4 py-16">
      <div class="max-w-md mx-auto bg-white p-8 rounded-md shadow-md">
        <h2 class="text-2xl font-bold text-center mb-6">Connexion</h2>
        <form @submit.prevent="login">
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
            <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              id="password"
              v-model="password"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Connexion
          </button>
        </form>
        <p v-if="error" class="mt-4 text-red-500">{{ error }}</p>
        <div class="mt-4 text-center">
          <p>Vous n'avez pas de compte ?</p>
          <button
            @click="goToInscription"
            class="mt-2 w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Inscription
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'Connexion',
    data() {
      return {
        username: '',
        password: '',
        error: ''
      };
    },
    methods: {
      login() {
        axios.post('https://python-api-prod.onrender.com/connexion/?format=json', {
          username: this.username,
          password: this.password
        })
        .then(response => {
          const token = response.data.token;
          localStorage.setItem('authToken', token);
          localStorage.setItem('username', this.username);
          this.checkUserRole();
        })
        .catch(error => {
          console.error('Erreur lors de la connexion:', error);
          this.error = 'Nom d\'utilisateur ou mot de passe incorrect';
        });
      },
      checkUserRole() {
        const headers = {
          Authorization: `Token ${localStorage.getItem('authToken')}`
        };
  
        axios.get('https://python-api-prod.onrender.com/livreurs/', { headers })
          .then(response => {
            const livreurs = response.data;
            const user = livreurs.find(livreur => livreur.user.username === this.username);
            if (user) {
              this.$router.push('/livreur').catch(err => {
                console.error(err);
              }).finally(() => {
                window.location.reload();
              });
            } else {
              this.checkIfClient();
            }
          })
          .catch(error => {
            console.error('Erreur lors de la vérification du rôle de livreur:', error);
            this.error = 'Erreur lors de la vérification du rôle utilisateur';
          });
      },
      checkIfClient() {
        const headers = {
          Authorization: `Token ${localStorage.getItem('authToken')}`
        };
  
        axios.get('https://python-api-prod.onrender.com/clients/', { headers })
          .then(response => {
            const clients = response.data;
            const user = clients.find(client => client.user.username === this.username);
            if (user) {
              this.$router.push('/panier').catch(err => {
                console.error(err);
              }).finally(() => {
                window.location.reload();
              });
            } else {
              this.error = 'Utilisateur non reconnu comme client ou livreur';
            }
          })
          .catch(error => {
            console.error('Erreur lors de la vérification du rôle de client:', error);
            this.error = 'Erreur lors de la vérification du rôle utilisateur';
          });
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
  