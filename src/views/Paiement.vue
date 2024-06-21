<template>
  <div class="container mx-auto px-4 py-16">
    <h2 class="text-2xl font-bold text-center mb-6">Paiement pour la commande: {{ orderId }}</h2>
    <div class="max-w-md mx-auto bg-white p-8 rounded-md shadow-md">
      <form @submit.prevent="submitPayment">
        <div id="card-element" class="mb-4">
          <!-- Stripe Elements will go here -->
        </div>
        <div id="card-errors" role="alert" class="text-red-500 mb-4"></div>
        <div class="text-right">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Valider
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

export default {
  name: 'Paiement',
  props: ['orderId'],
  data() {
    return {
      stripe: null,
      card: null,
      clientSecret: '',
    };
  },
  async mounted() {
    this.stripe = await loadStripe('pk_test_51MFEQcEZ0N5FcY9bhOkOSdBqVVofehspGUWtl65hS2SFUH3KnWFp1UUipvUaPdMLajLbSiiAJzM1YyiG940Ougvd00dQ93eYQP');
    const elements = this.stripe.elements();
    this.card = elements.create('card', {
      style: {
        base: {
          color: '#32325d',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px',
          '::placeholder': {
            color: '#aab7c4'
          }
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a'
        }
      }
    });
    this.card.mount('#card-element');


    this.createPaymentIntent();
  },
  methods: {
    async createPaymentIntent() {
      const tokenAuth = localStorage.getItem('authToken');
      try {
        const response = await axios.post(`https://python-api-prod.onrender.com/createpaiement/${this.orderId}/create_payment_intent/`, {}, {
          headers: {'Authorization': `Token ${tokenAuth}`}
        });
        this.clientSecret = response.data.client_secret;
      } catch (error) {
        console.error('Erreur lors de la création de l\'intention de paiement:', error);
      }
    },
    async submitPayment() {
      const { error, paymentIntent } = await this.stripe.confirmCardPayment(this.clientSecret, {
        payment_method: {
          card: this.card,
          billing_details: {
            name: 'Nom du client' 
          }
        }
      });

      if (error) {
        console.error(error.message);
        document.getElementById('card-errors').textContent = error.message;
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        this.verifyPayment();
      }
    },
    async verifyPayment() {
      const tokenAuth = localStorage.getItem('authToken');
      try {
        const response = await axios.post(`https://python-api-prod.onrender.com/createpaiement/${this.orderId}/verify_payment/`, {}, {
          headers: {'Authorization': `Token ${tokenAuth}`}
        });
        if (response.data.status === 'succeeded') {
          this.$router.push('/Suivi-commande');
        } else {
         console.log('oups else')
         this.$router.push('/Suivi-commande');
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du paiement:', error);

      }
    }
  }
};
</script>

<style scoped>

#card-element {
  background-color: #f8f8f8;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
}
</style>
