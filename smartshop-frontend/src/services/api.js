import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

const errorMessages = {
  400: 'Requête invalide. Veuillez vérifier les données envoyées.',
  401: 'Non autorisé. Veuillez vous connecter.',
  403: 'Accès refusé. Vous n\'avez pas les permissions nécessaires.',
  404: 'Ressource non trouvée.',
  422: 'Données non valides. Veuillez vérifier les champs du formulaire.',
  500: 'Erreur serveur. Veuillez réessayer plus tard.',
  default: 'Une erreur est survenue. Veuillez réessayer.',
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = errorMessages.default;

    if (error.response) {
      const status = error.response.status;
      
      if (error.response.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (errorMessages[status]) {
          errorMessage = errorMessages[status];
        }
      } else if (errorMessages[status]) {
        errorMessage = errorMessages[status];
      }
    } else if (error.request) {
      errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion internet.';
    }

    // Créer une erreur enrichie
    const enrichedError = new Error(errorMessage);
    enrichedError.status = error.response?.status;
    enrichedError.data = error.response?.data;
    enrichedError.originalError = error;

    return Promise.reject(enrichedError);
  }
);

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
