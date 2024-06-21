<template>
  <div class="container mx-auto px-4 py-16">
    <h2 class="text-2xl font-bold text-center mb-6">Votre Panier</h2>
    <div v-if="cart.length > 0" class="max-w-3xl mx-auto bg-white p-8 rounded-md shadow-md">
      <table class="min-w-full leading-normal">
        <thead>
          <tr>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Produit</th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Prix</th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantité</th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cart" :key="item.id">
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{{ item.nom_produit }}</td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{{ item.prix }} €</td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <button @click="decreaseQuantity(item)" class="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600 mr-2">-</button>
              <input type="number" v-model.number="item.quantity" class="text-center w-12">
              <button @click="increaseQuantity(item)" class="px-2 py-1 text-white bg-green-500 rounded hover:bg-green-600 ml-2">+</button>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <button @click="removeFromCart(item)" class="text-red-500 hover:text-red-700">Retirer</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="mt-6 text-right">
        <button @click="checkout" class="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">Valider le Panier</button>
      </div>
    </div>
    <div v-else class="text-center text-gray-500">
      <p>Votre panier est vide.</p>
      <router-link to="/Carte" class="text-orange-500 hover:underline">Continuer vos achats</router-link>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  name: 'Panier',
  data() {
    return {
      cart: [],
      user: {},
    };
  },
  created() {
    this.loadCart();
  },
  methods: {
    loadCart() {
      const cart = localStorage.getItem('cart');
      this.cart = cart ? JSON.parse(cart) : [];
    },
    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    },
    removeFromCart(item) {
      this.cart = this.cart.filter(cartItem => cartItem.id !== item.id);
      this.saveCart();
    },
    increaseQuantity(item) {
      item.quantity++;
      this.saveCart();
    },
    decreaseQuantity(item) {
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        this.removeFromCart(item);
      }
      this.saveCart();
    },
    checkout() {
      const token = localStorage.getItem('authToken');
      if (!token) {
        localStorage.setItem('redirectAfterLogin', '/panier');
        this.$router.push('/connexion');
      } else {
        this.createOrder(token);
      }
    },
    createOrder(token) {
      const orderData = {
        client: this.user.id,
        montant_total: this.cart.reduce((acc, item) => acc + item.prix * item.quantity, 0),
        frais_livraison: 5,
        statut: "en_cours",
      };

      axios.post('https://python-api-prod.onrender.com/commandes/', orderData, {
        headers: {'Authorization': `Token ${token}`}
      }).then(response => {
        const orderId = response.data.id;
        this.addAllProductsToOrder(orderId, token);
      }).catch(error => {
        console.error("Erreur lors de la création de la commande:", error);

      });
    },
    addAllProductsToOrder(orderId, token) {
    const requests = this.cart.map(item => {
      return axios.post(`https://python-api-prod.onrender.com/commande_produits/`, {
        produit: item.id,
        quantite: item.quantity,
        commande: orderId
      }, {
        headers: {'Authorization': `Token ${token}`}
      });
    });

    axios.all(requests).then(axios.spread((...responses) => {
      console.log('Tous les produits ont été ajoutés à la commande.');
      this.cart = [];
      this.saveCart();
      this.$router.push(`/paiement/${orderId}`);
      this.$router.push({ name: 'paiement', params: { orderId: orderId } });
  
    })).catch(errors => {
      console.error("Erreur lors de l'ajout des produits à la commande:", errors);
  
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
