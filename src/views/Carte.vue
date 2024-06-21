<template>
  <section class="pb-24 pt-12 text-center text-gray-50">
    <div class="container mx-auto px-4">
      <div class="bg-gray-50 px-12 py-16 rounded-lg text-gray-400">
        <div class="-mx-4 flex flex-wrap items-center justify-center mb-12">
          <div class="px-4 text-center w-full md:w-10/12 xl:w-9/12">
            <h2 class="font-medium mb-1 text-primary-500">Produit frais</h2>
            <h3 class="capitalize font-bold text-4xl text-orange-500">Faite votre choix</h3>
          </div>
        </div>
        <div class="mb-8">
          <button
            v-for="type in types"
            :key="type"
            @click="filterProduits(type)"
            :class="{'bg-orange-300 text-white': selectedType === type, 'bg-gray-200 text-orange-500': selectedType !== type}"
            class="m-2 px-4 py-2 rounded bg-orange-300"
          >
            {{ type }}
          </button>
        </div>
        <div class="-mx-3 flex flex-wrap justify-center mb-12">
          <div
            v-for="produit in filteredProduits"
            :key="produit.id"
            class="p-3 w-full md:w-6/12 lg:w-4/12 xl:w-3/12"
          >
            <div class="bg-white border px-6 py-12 rounded-md text-center text-gray-400">
              <img
                v-if="produit.image"
                :src="produit.image"
                class="mb-4 mx-auto rounded-md w-full sm:w-10/12"
                :alt="produit.nom_produit"
                width="600"
                height="600"
              />
              <img
                v-else
                src="https://via.placeholder.com/600"
                class="mb-4 mx-auto rounded-md w-full sm:w-10/12"
                alt="Pas d'image disponible"
                width="600"
                height="600"
              />
              <h4 class="font-bold mb-2 text-orange-500 text-xl">{{ produit.nom_produit }}</h4>
              <p class="mb-2 text-sm">{{ produit.description }}</p>
              <p class="font-semibold font-serif mb-4 text-orange-500">{{ produit.prix }} €</p>
              <button
                @click="addToCart(produit)"
                class="border border-orange-500 hover:bg-orange-500 hover:text-white inline-block px-4 py-1 rounded text-orange-500 text-sm"
              >
                <img src="..\assets\images\panier.png" class="h-6">
              </button>
            </div>
          </div>
        </div>
        <div>
          <router-link
            to="/panier"
            class="bg-orange-500 hover:bg-orange-600 inline-block m-1 px-6 py-2 rounded text-white"
          >
            Voir le Panier
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Carte',
  data() {
    return {
      produits: [],
      selectedType: 'Tout voir',
      types: ['Tout voir', 'Pizza', 'Boissons', 'Dessert'],
    };
  },
  computed: {
    filteredProduits() {
      if (this.selectedType === 'Tout voir') {
        return this.produits;
      }
      return this.produits.filter(produit => produit.type_produit && produit.type_produit.toLowerCase() === this.selectedType.toLowerCase());
    },
  },
  mounted() {
    this.fetchProduits();
  },
  methods: {
    fetchProduits() {
      axios.get('http://127.0.0.1:8000/produits/?format=json')
        .then(response => {
          this.produits = response.data;
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des produits:', error);

        });
    },
    filterProduits(type) {
      this.selectedType = type;
    },
    addToCart(produit) {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      let productInCart = cart.find(item => item.id === produit.id);

      if (productInCart) {
        productInCart.quantity += 1;
      } else {
        produit.quantity = 1;
        cart.push(produit);
      }

      localStorage.setItem('cart', JSON.stringify(cart));

    }
  },
};
</script>

<style scoped>
button {
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

button:hover {
  background-color: #fbd38d;
  color: white;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
}
</style>
