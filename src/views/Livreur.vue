<template>
  <div class="container mx-auto px-4 py-16">
    <h2 class="text-2xl font-bold text-center mb-6">Status livreur</h2>
    <table v-if="livreurs.length > 0" class="min-w-full leading-normal">
      <thead>
        <tr>
          <th>Nom du Livreur</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="livreur in livreurs" :key="livreur.id">
          <td>{{ livreur.user.username }}</td>
          <td>{{ livreur.statut }}</td>
          <td>
            <select v-model="livreur.statut" @change="updateLivreurStatus(livreur)">
              <option value="disponible">Disponible</option>
              <option value="indisponible">Indisponible</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="text-center text-gray-500">Aucun livreur disponible.</p>

    <h2 class="text-2xl font-bold text-center mt-6 mb-6">Suivi des Commandes</h2>
    <table v-if="commandes.length > 0" class="min-w-full leading-normal">
      <thead>
        <tr>
          <th>Client</th>
          <th>Livreur</th>
          <th>Date de Commande</th>
          <th>Montant Total</th>
          <th>Statut</th>
          <th>Frais de Livraison</th>
          <th>Temps Estimé de Livraison</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="commande in commandes" :key="commande.id">
          <td>{{ commande.client.user.username }}</td>
          <td>{{ commande.livreur.user.username }}</td>
          <td>{{ new Date(commande.date_commande).toLocaleString() }}</td>
          <td>{{ commande.montant_total }} €</td>
          <td>{{ commande.statut }}</td>
          <td>{{ commande.frais_livraison }} €</td>
          <td>{{ commande.temps_estime_livraison }}</td>
          <td>
            <button v-if="commande.statut === 'prise_en_charge'" @click="updateCommandeStatus(commande, 'en_cours_de_livraison')" class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">En cours de livraison</button>
            <button v-if="commande.statut === 'en_cours_de_livraison'" @click="updateCommandeStatus(commande, 'livree')" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Livrée</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="text-center text-gray-500">Aucune commande disponible.</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      commandes: [],
      livreurs: []
    };
  },
  created() {
    this.fetchCommandes();
    this.fetchLivreurs();
  },
  methods: {
    fetchCommandes() {
      const token = localStorage.getItem('authToken');
      axios.get('http://127.0.0.1:8000/commandes/?format=json', {
        headers: {'Authorization': `Token ${token}`}
      }).then(response => {
        this.commandes = response.data;
      }).catch(error => {
        console.error("Erreur lors de la récupération des commandes:", error);
      });
    },
    fetchLivreurs() {
      const token = localStorage.getItem('authToken');
      axios.get('http://127.0.0.1:8000/livreurs/?format=json', {
        headers: {'Authorization': `Token ${token}`}
      }).then(response => {
        this.livreurs = response.data;
      }).catch(error => {
        console.error("Erreur lors de la récupération des livreurs:", error);
      });
    },
    updateLivreurStatus(livreur) {
      const token = localStorage.getItem('authToken');
      axios.patch(`http://127.0.0.1:8000/livreurs/${livreur.id}/`, {
        statut: livreur.statut
      }, {
        headers: {'Authorization': `Token ${token}`}
      }).then(response => {
        console.log("Statut mis à jour avec succès");
      }).catch(error => {
        console.error("Erreur lors de la mise à jour du statut:", error);
      });
    },
    updateCommandeStatus(commande, statut) {
      const token = localStorage.getItem('authToken');
      axios.patch(`http://127.0.0.1:8000/commandes/${commande.id}/`, {
        statut: statut
      }, {
        headers: {'Authorization': `Token ${token}`}
      }).then(response => {
        commande.statut = statut;
      }).catch(error => {
        console.error("Erreur lors de la mise à jour du statut de la commande:", error);
      });
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
