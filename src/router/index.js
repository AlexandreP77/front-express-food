import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Carte from '../views/Carte.vue';
import Suivi from '../views/Suivi-commande.vue';
import Panier from '../views/Panier.vue';
import Inscription from '../views/Inscription.vue';
import Connexion from '../views/Connexion.vue';
import Paiement from '../views/Paiement.vue';
import Livreur from '../views/Livreur.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/carte', name: 'Analyse', component: Carte },
  { path: '/Suivi-commande', name: 'Prediction', component: Suivi, meta: { requiresAuth: true } },
  { path: '/Panier', name: 'Panier', component: Panier },
  { path: '/Paiement/:orderId',  name: 'Paiement',  component: Paiement,  props: true },
  { path: '/Inscription', name: 'Inscription', component: Inscription },
  { path: '/Connexion', name: 'Connexion', component: Connexion },
  { path: '/Livreur', name: 'Livreur', component: Livreur }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
