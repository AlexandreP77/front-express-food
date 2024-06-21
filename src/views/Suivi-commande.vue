<template>
  <div class="container mx-auto px-4 py-16">
    <h2 class="text-2xl font-bold text-center mb-6">Suivi des Commandes</h2>
    <table v-if="commandes.length > 0" class="min-w-full leading-normal">
      <thead>
        <tr>
          <th>Date de Commande</th>
          <th>Montant Total</th>
          <th>Statut</th>
          <th>Frais de Livraison</th>
          <th>Temps Estimé de Livraison</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="commande in commandes" :key="commande.id">
          <td>{{ new Date(commande.date_commande).toLocaleString() }}</td>
          <td>{{ commande.montant_total }} €</td>
          <td>{{ commande.statut || 'Non spécifié' }}</td>
          <td>{{ commande.frais_livraison || 'Non spécifié' }} €</td>
          <td>{{ commande.temps_estime_livraison }}</td>
          <td v-if="commande.statut !== 'prise_en_charge'">
            <button @click="goToPayment(commande.id)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Paiement
            </button>
          </td>
          <td v-else>Commande en cours</td>
        </tr>
      </tbody>
    </table>
    <p v-else class="text-center text-gray-500">Aucune commande disponible.</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SuiviCommande',
  data() {
    return {
      commandes: []
    };
  },
  created() {
    this.fetchCommandes();
  },
  methods: {
    fetchCommandes() {
      const token = localStorage.getItem('authToken');
      axios.get('http://127.0.0.1:8000/commandes/?format=json', {
        headers: {
          'Authorization': `Token ${token}`
        }
      })
      .then(response => {
        this.commandes = response.data;
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des commandes:", error);
      });
    },
    goToPayment(orderId) {
      this.$router.push(`/paiement/${orderId}`);
      this.$router.push({ name: 'paiement', params: { orderId: orderId } });
      
    }
  }
};
</script>

<style>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}
th {
  background-color: #eeeeee;
}
</style>
