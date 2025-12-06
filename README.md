# 🛒 SmartShop - Système de Gestion Commerciale B2B

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Application web backend REST pour la gestion commerciale B2B de **MicroTech Maroc**, distributeur de matériel informatique basé à Casablanca.

---

## 📋 Table des Matières

- [À Propos](#-à-propos)
- [Fonctionnalités Principales](#-fonctionnalités-principales)
- [Technologies Utilisées](#-technologies-utilisées)
- [Architecture](#-architecture)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Lancement de l'Application](#-lancement-de-lapplication)
- [Documentation API](#-documentation-api)
- [Tests](#-tests)
- [Règles Métier](#-règles-métier)
- [Auteur](#-auteur)

---

## 📖 À Propos

SmartShop est une **API REST backend uniquement** (sans interface graphique) conçue pour gérer :
- Un portefeuille de **650+ clients actifs**
- Un système de **fidélité à remises progressives** (4 niveaux)
- Des **paiements fractionnés multi-moyens** par facture
- Une **traçabilité complète** des événements financiers
- Une optimisation de la **gestion de trésorerie**

> **Note** : Cette application ne contient pas de frontend. Les tests et démonstrations se font via **Postman** ou **Swagger**.

---

## ✨ Fonctionnalités Principales

### 🧑‍💼 Gestion des Clients
- ✅ CRUD complet des clients
- ✅ Suivi automatique : nombre de commandes, montant cumulé
- ✅ Historique complet des commandes
- ✅ Calcul automatique du niveau de fidélité

### 🎁 Système de Fidélité Automatique
| Niveau | Conditions | Remise | Montant Minimum |
|--------|-----------|---------|-----------------|
| **BASIC** | Par défaut | 0% | - |
| **SILVER** | 3+ commandes OU 1,000 DH cumulés | 5% | ≥ 500 DH |
| **GOLD** | 10+ commandes OU 5,000 DH cumulés | 10% | ≥ 800 DH |
| **PLATINUM** | 20+ commandes OU 15,000 DH cumulés | 15% | ≥ 1,200 DH |

### 📦 Gestion des Produits
- ✅ CRUD avec pagination et filtres
- ✅ Gestion du stock en temps réel
- ✅ Soft delete (suppression logique)
- ✅ Validation automatique du stock

### 🧾 Gestion des Commandes
- ✅ Création multi-produits avec quantités
- ✅ Calculs automatiques : Sous-total HT, Remises cumulatives, TVA 20%, Total TTC
- ✅ Application des remises fidélité + codes promo
- ✅ Gestion des statuts : PENDING, CONFIRMED, CANCELED, REJECTED
- ✅ Mise à jour automatique du stock et des statistiques client

### 💳 Paiements Multi-Moyens
Supporte 3 moyens de paiement :

| Moyen | Limite | Caractéristiques |
|-------|--------|------------------|
| **ESPECES** | 20,000 DH max | Paiement immédiat |
| **CHÈQUE** | Illimité | Date d'échéance, statuts (EN_ATTENTE/ENCAISSÉ/REJETÉ) |
| **VIREMENT** | Illimité | Référence bancaire, date d'encaissement |

**Règle importante** : Une commande ne peut être validée (CONFIRMED) que si elle est **totalement payée** (`montantRestant = 0`).

### 🔐 Authentification & Sécurité
- ✅ Authentification par HTTP Session (login/logout)
- ✅ Gestion des rôles : **ADMIN** (gestion complète) et **CLIENT** (consultation uniquement)
- ✅ Intercepteur pour protéger les endpoints
- ✅ Matrice de permissions stricte

---

## 🛠 Technologies Utilisées

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA** (Hibernate)
- **Spring Validation**
- **MySQL 8.0**

### Outils de Développement
- **Maven** - Gestion des dépendances
- **Lombok** - Réduction du code boilerplate
- **MapStruct** - Mapping automatique DTO ↔ Entity
- **JUnit 5** - Tests unitaires
- **Mockito** - Mocking pour les tests

### Documentation & Tests
- **Swagger/OpenAPI** (SpringDoc)
- **Postman** - Tests API

---

## 🏗 Architecture

```
smartshop/
├── src/
│   ├── main/
│   │   ├── java/com/microtech/smartshop/
│   │   │   ├── config/           # Configuration (WebConfig, AuthInterceptor)
│   │   │   ├── controller/       # Contrôleurs REST
│   │   │   ├── dto/
│   │   │   │   ├── request/      # DTOs de requête
│   │   │   │   └── response/     # DTOs de réponse
│   │   │   ├── entity/           # Entités JPA
│   │   │   ├── enums/            # Énumérations (Status, Tier, Role)
│   │   │   ├── exception/        # Exceptions personnalisées + @ControllerAdvice
│   │   │   ├── mapper/           # Mappers MapStruct
│   │   │   ├── repository/       # Repositories Spring Data JPA
│   │   │   └── service/
│   │   │       └── impl/         # Implémentations des services
│   │   └── resources/
│   │       └── application.properties  # Configuration de l'application
│   └── test/                      # Tests unitaires (JUnit 5 + Mockito)
├── uml/                           # Diagrammes UML
├── pom.xml                        # Configuration Maven
└── README.md                      # Ce fichier
```

### Patron de Conception
- **Architecture en couches** : Controller → Service → Repository → Entity
- **DTO Pattern** : Séparation des entités et des objets de transfert
- **Builder Pattern** : Construction fluide des objets (Lombok)
- **Strategy Pattern** : Hiérarchie de paiements (Payment → PaymentEspeces/Cheque/Virement)

---

## 📋 Prérequis

- **Java JDK 17** ou supérieur
- **Maven 3.8+**
- **MySQL 8.0+** ou **Laragon** (avec MySQL)
- **Postman** ou **Swagger UI** (pour tester l'API)
- Un IDE Java (IntelliJ IDEA, Eclipse, VS Code)

---

## 🚀 Installation

### 1. Cloner le Projet
```bash
git clone https://github.com/Meriem003/smart_shop.git
cd smart_shop/smartshop
```

### 2. Créer la Base de Données
```sql
CREATE DATABASE smartshop_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Configurer la Connexion
Modifier `src/main/resources/application.properties` :
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smartshop_db
spring.datasource.username=root
spring.datasource.password=votre_mot_de_passe
```

### 4. Installer les Dépendances
```bash
mvn clean install
```

## 🏃 Lancement de l'Application

### Via Maven
```bash
mvn spring-boot:run
```


### Via IDE
- Exécuter la classe principale : `SmartshopApplication.java`

L'application sera accessible sur : **http://localhost:8080**

---

## 📚 Documentation API

### Endpoints Principaux

#### 🔐 Authentification
| Méthode | Endpoint | Description | Rôle |
|---------|----------|-------------|------|
| POST | `/api/auth/login` | Connexion | Public |
| GET | `/api/auth/me` | Utilisateur connecté | Authentifié |
| POST | `/api/auth/logout` | Déconnexion | Authentifié |

**Exemple Login** :
```json
POST /api/auth/login
{
  "username": "admin",
  "password": "password123"
}
```

#### 🧑‍💼 Clients
| Méthode | Endpoint | Description | Rôle |
|---------|----------|-------------|------|
| POST | `/api/customers` | Créer un client | ADMIN |
| GET | `/api/customers/{id}` | Consulter un client | ADMIN/CLIENT (soi-même) |
| PUT | `/api/customers/{id}` | Modifier un client | ADMIN |
| GET | `/api/customers/{id}/stats` | Statistiques client | ADMIN/CLIENT (soi-même) |
| GET | `/api/customers/{id}/orders` | Historique commandes | ADMIN/CLIENT (soi-même) |

**Exemple Création Client** :
```json
POST /api/customers
{
  "nom": "Entreprise XYZ",
  "email": "contact@xyz.ma",
  "username": "xyz_user",
  "password": "secure123"
}
```

#### 📦 Produits
| Méthode | Endpoint | Description | Rôle |
|---------|----------|-------------|------|
| POST | `/api/products` | Créer un produit | ADMIN |
| GET | `/api/products/{id}` | Consulter un produit | Tous |
| PUT | `/api/products/{id}` | Modifier un produit | ADMIN |
| DELETE | `/api/products/{id}` | Supprimer un produit | ADMIN |
| GET | `/api/products` | Liste avec pagination | Tous |

**Exemple Création Produit** :
```json
POST /api/products
{
  "nom": "Laptop Dell XPS 15",
  "prixUnitaire": 12500.00,
  "stockDisponible": 50
}
```

#### 🧾 Commandes
| Méthode | Endpoint | Description | Rôle |
|---------|----------|-------------|------|
| POST | `/api/orders` | Créer une commande | ADMIN |
| PUT | `/api/orders/{id}/confirm` | Valider une commande | ADMIN |
| PUT | `/api/orders/{id}/cancel` | Annuler une commande | ADMIN |

**Exemple Création Commande** :
```json
POST /api/orders
{
  "customerId": 1,
  "codePromo": "PROMO-2024",
  "items": [
    {
      "productId": 1,
      "quantite": 2
    },
    {
      "productId": 3,
      "quantite": 1
    }
  ]
}
```

#### 💳 Paiements
| Méthode | Endpoint | Description | Rôle |
|---------|----------|-------------|------|
| POST | `/api/payments/especes` | Paiement espèces | ADMIN |
| POST | `/api/payments/cheque` | Paiement chèque | ADMIN |
| POST | `/api/payments/virement` | Paiement virement | ADMIN |

**Exemples Paiements** :
```json
// Espèces
POST /api/payments/especes
{
  "orderId": 1,
  "montant": 5000.00,
  "numeroRecu": "RECU-001"
}

// Chèque
POST /api/payments/cheque
{
  "orderId": 1,
  "montant": 3000.00,
  "numeroCheque": "CHQ-123456",
  "nomBanque": "BMCE Bank",
  "dateEcheance": "2025-12-31"
}

// Virement
POST /api/payments/virement
{
  "orderId": 1,
  "montant": 2000.00,
  "referenceVirement": "VIR-2025-001",
  "nomBanque": "Attijariwafa Bank"
}
```

#### 🎁 Codes Promo
| Méthode | Endpoint | Description | Rôle |
|---------|----------|-------------|------|
| POST | `/api/promocodes` | Créer un code promo | ADMIN |
| GET | `/api/promocodes` | Liste des codes promo | ADMIN |

---



## 📐 Règles Métier

### Système de Fidélité
1. Le niveau est **calculé automatiquement** après chaque commande **confirmée**
2. Le niveau se base sur :
   - Nombre total de commandes OU
   - Montant total dépensé (le premier atteint)
3. La remise s'applique SUR LES FUTURES COMMANDES si le montant minimum est atteint

### Commandes
1. ✅ Une commande nécessite **au moins 1 article**
2. ✅ Le stock doit être suffisant pour tous les produits
3. ✅ Les remises sont **cumulatives** (fidélité + promo code)
4. ✅ La **TVA se calcule APRÈS les remises**
5. ✅ Une commande ne peut être validée que si **totalement payée**

### Paiements
1. ✅ **Espèces** : Limite légale de 20,000 DH par paiement 
2. ✅ **Chèque** : Statuts EN_ATTENTE → ENCAISSÉ/REJETÉ
3. ✅ Une facture peut être payée en **plusieurs fois** avec **différents moyens**

### Statuts des Commandes
- **PENDING** : En attente de paiement complet
- **CONFIRMED** : Validée par ADMIN (après paiement complet)
- **CANCELED** : Annulée par ADMIN
- **REJECTED** : Refusée (stock insuffisant)

### Validations
- ✅ Codes promo : Format strict `PROMO-XXXX` (4 caractères alphanumériques)
- ✅ Email : Format valide requis
- ✅ Montants : Arrondis à 2 décimales
- ✅ Stock : `quantité_demandée ≤ stock_disponible`



**🎓 Développé avec ❤️ dans le cadre de la formation YouCode - Simplon Maroc**
