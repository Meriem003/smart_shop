# 🛒 SmartShop - Application de Gestion Commerciale B2B

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen)
![MySQL](https://img.shields.io/badge/MySQL-8.2.0-blue)
![Maven](https://img.shields.io/badge/Maven-3.x-red)
![License](https://img.shields.io/badge/License-MIT-yellow)

Application de gestion commerciale B2B développée pour **MicroTech Maroc**. SmartShop offre une API REST complète pour gérer les clients, produits, commandes, paiements et codes promotionnels avec un système de fidélité intégré.

---

## 📋 Table des Matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies Utilisées](#-technologies-utilisées)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Lancement de l'Application](#-lancement-de-lapplication)
- [Documentation API](#-documentation-api)
- [Architecture](#-architecture)
- [Modèle de Données](#-modèle-de-données)
- [Système de Fidélité](#-système-de-fidélité)
- [Endpoints Principaux](#-endpoints-principaux)
- [Exemples d'Utilisation](#-exemples-dutilisation)
- [Tests](#-tests)
- [Contribution](#-contribution)
- [Licence](#-licence)

---

## ✨ Fonctionnalités

### 👥 Gestion des Clients
- Création, consultation, modification des clients
- Suivi des statistiques client (commandes totales, dépenses)
- Historique des commandes par client
- Système de fidélité automatique avec 4 tiers

### 📦 Gestion des Produits
- CRUD complet des produits
- Gestion du stock en temps réel
- Soft delete (suppression logique)
- Pagination et filtrage

### 🛍️ Gestion des Commandes
- Création de commandes multi-articles
- Calcul automatique des montants (HT, TVA, TTC)
- Application des remises de fidélité
- Support des codes promotionnels
- Confirmation/Annulation de commandes
- Mise à jour automatique du stock

### 💳 Gestion des Paiements
- Support de 3 moyens de paiement :
  - **Espèces** (avec limite légale de 20 000 MAD)
  - **Chèque** (avec date d'échéance)
  - **Virement bancaire**
- Paiements multiples par commande
- Suivi des statuts (EN_ATTENTE, ENCAISSE, REJETE)

### 🎁 Codes Promotionnels
- Création et gestion des codes promo
- Format normalisé : `PROMO-XXXX`
- Pourcentage de remise configurable
- Support usage unique ou multiple

### 🏆 Système de Fidélité
- 4 tiers : BASIC, SILVER, GOLD, PLATINUM
- Remises progressives jusqu'à 15%
- Calcul automatique basé sur commandes et dépenses

---

## 🛠️ Technologies Utilisées

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
  - Spring Web (REST API)
  - Spring Data JPA (ORM)
  - Spring Validation
- **Hibernate** (JPA Implementation)
- **Maven** (Build Tool)

### Base de Données
- **MySQL 8.2.0** (Production)
- **PostgreSQL 42.7.1** (Alternative)
- **H2** (Tests)

### Librairies
- **Lombok 1.18.30** - Réduction du boilerplate
- **MapStruct 1.5.5** - Mapping DTO ↔ Entity
- **SpringDoc OpenAPI 2.3.0** - Documentation Swagger
- **Apache Commons Lang3** - Utilitaires
- **Jackson** - Sérialisation JSON

### Tests
- **JUnit 5**
- **Mockito**
- **AssertJ**
- **Spring Boot Test**

---

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- ☕ **Java JDK 17** ou supérieur
- 🗄️ **MySQL 8.x** ou **PostgreSQL 12+**
- 📦 **Maven 3.6+**
- 🔧 **IDE** (IntelliJ IDEA, Eclipse, VS Code recommandé)

---

## 🚀 Installation

### 1. Cloner le Projet

```bash
git clone https://github.com/Meriem003/smart_shop.git
cd smart_shop/smartshop
```

### 2. Créer la Base de Données

Connectez-vous à MySQL et créez la base de données :

```sql
CREATE DATABASE smartshop_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Installer les Dépendances

```bash
mvn clean install
```

---

## ⚙️ Configuration

### Configuration de la Base de Données

Modifiez le fichier `src/main/resources/application.properties` :

```properties
# Configuration Serveur
server.port=8080
spring.application.name=SmartShop

# Configuration MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/smartshop_db
spring.datasource.username=root
spring.datasource.password=votreMotDePasse
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Configuration JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Configuration Session
server.servlet.session.timeout=30m
server.servlet.session.cookie.http-only=true
```

### Profils Disponibles

- **Développement** : `application-dev.properties`
- **Production** : `application-prod.properties`

Pour activer un profil :

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

---

## 🏃 Lancement de l'Application

### Avec Maven

```bash
mvn spring-boot:run
```

### Avec Java

```bash
mvn clean package
java -jar target/smartshop-1.0.0.jar
```

### Avec votre IDE

Exécutez la classe principale : `com.microtech.smartshop.SmartshopApplication`

L'application démarre sur : **http://localhost:8080**

---

## 📚 Documentation API

### Swagger UI

Accédez à la documentation interactive Swagger :

```
http://localhost:8080/swagger-ui.html
```

### OpenAPI Specification

Documentation JSON :

```
http://localhost:8080/v3/api-docs
```

---

## 🏗️ Architecture

### Pattern MVC en Couches

```
┌─────────────────┐
│   Controller    │  ← Endpoints REST
└────────┬────────┘
         │
┌────────▼────────┐
│     Service     │  ← Logique métier
└────────┬────────┘
         │
┌────────▼────────┐
│   Repository    │  ← Accès données (JPA)
└────────┬────────┘
         │
┌────────▼────────┐
│     Entity      │  ← Modèle de données
└─────────────────┘
```

### Structure du Projet

```
com.microtech.smartshop/
├── 📂 controller/          # Contrôleurs REST
├── 📂 dto/
│   ├── request/           # DTOs de requête
│   └── response/          # DTOs de réponse
├── 📂 entity/             # Entités JPA
├── 📂 enums/              # Énumérations
├── 📂 exception/          # Gestion globale des exceptions
├── 📂 mapper/             # MapStruct mappers
├── 📂 repository/         # Repositories JPA
├── 📂 service/
│   └── impl/             # Implémentations des services
└── 📂 util/               # Classes utilitaires
```

---

## 🗄️ Modèle de Données

### Entités Principales

#### 👤 Customer (Client)
```java
- id : Long
- nom : String
- email : String (unique)
- loyaltyTier : CustomerTier (BASIC, SILVER, GOLD, PLATINUM)
- totalOrders : Integer
- totalSpent : BigDecimal
- user : User (OneToOne)
- orders : List<Order> (OneToMany)
```

#### 📦 Product (Produit)
```java
- id : Long
- nom : String
- prixUnitaire : BigDecimal
- stockDisponible : Integer
- deleted : Boolean
```

#### 🛍️ Order (Commande)
```java
- id : Long
- dateCommande : LocalDateTime
- sousTotal : BigDecimal
- montantRemise : BigDecimal
- montantHT : BigDecimal
- montantTVA : BigDecimal
- totalTTC : BigDecimal
- montantRestant : BigDecimal
- status : OrderStatus (PENDING, CONFIRMED, CANCELED, REJECTED)
- tauxTVA : BigDecimal (défaut: 0.20)
- customer : Customer (ManyToOne)
- items : List<OrderItem> (OneToMany)
- payments : List<Payment> (OneToMany)
- promoCode : PromoCode (ManyToOne)
```

#### 💳 Payment (Paiement) - Hiérarchie
```java
Payment (abstract)
├── PaymentEspeces (numeroRecu, LIMITE_LEGALE)
├── PaymentCheque (numeroCheque, banque, dateEcheance)
└── PaymentVirement (referenceVirement, banque)
```

#### 🎁 PromoCode (Code Promo)
```java
- id : Long
- code : String (format: PROMO-XXXX)
- pourcentageRemise : BigDecimal (0.0 - 1.0)
- active : Boolean
- usageUnique : Boolean
- used : Boolean
```

---

## 🏆 Système de Fidélité

### Tiers de Fidélité

| Tier | Conditions | Commande Min. | Remise |
|------|-----------|---------------|--------|
| 🥉 **BASIC** | Par défaut | - | 0% |
| 🥈 **SILVER** | 3 commandes **OU** 1 000 MAD | 500 MAD | **5%** |
| 🥇 **GOLD** | 10 commandes **OU** 5 000 MAD | 800 MAD | **10%** |
| 💎 **PLATINUM** | 20 commandes **OU** 15 000 MAD | 1 200 MAD | **15%** |

### Règles d'Application

- ✅ Mise à jour automatique après chaque commande
- ✅ Remise appliquée uniquement si montant minimum atteint
- ✅ Cumul possible avec codes promotionnels
- ✅ Calcul basé sur le sous-total avant TVA

---

## 🔌 Endpoints Principaux

### 👥 Clients

```http
POST   /api/customers              # Créer un client
GET    /api/customers              # Lister tous les clients
GET    /api/customers/{id}         # Consulter un client
PUT    /api/customers/{id}         # Modifier un client
GET    /api/customers/{id}/stats   # Statistiques client
GET    /api/customers/{id}/orders  # Historique des commandes
```

### 📦 Produits

```http
POST   /api/products               # Créer un produit
GET    /api/products               # Lister les produits (pagination)
GET    /api/products/{id}          # Consulter un produit
PUT    /api/products/{id}          # Modifier un produit
DELETE /api/products/{id}          # Supprimer (soft delete)
```

### 🛍️ Commandes

```http
POST   /api/orders                 # Créer une commande
PUT    /api/orders/{id}/confirm    # Confirmer une commande
PUT    /api/orders/{id}/cancel     # Annuler une commande
```

### 💳 Paiements

```http
POST   /api/payments/especes       # Paiement en espèces
POST   /api/payments/cheque        # Paiement par chèque
POST   /api/payments/virement      # Paiement par virement
```

### 🎁 Codes Promotionnels

```http
POST   /api/promo-codes            # Créer un code promo
GET    /api/promo-codes            # Lister les codes
GET    /api/promo-codes/{id}       # Consulter par ID
GET    /api/promo-codes/code/{code} # Consulter par code
DELETE /api/promo-codes/{id}       # Supprimer un code
```

---

## 📝 Exemples d'Utilisation

### Créer un Client

```bash
curl -X POST http://localhost:8080/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Entreprise ACME",
    "email": "contact@acme.ma",
    "username": "acme_user",
    "password": "SecurePass123"
  }'
```

**Réponse :**
```json
{
  "id": 1,
  "nom": "Entreprise ACME",
  "email": "contact@acme.ma",
  "loyaltyTier": "BASIC",
  "totalOrders": 0,
  "totalSpent": 0.00
}
```

### Créer une Commande

```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "items": [
      {
        "productId": 5,
        "quantite": 10
      },
      {
        "productId": 8,
        "quantite": 5
      }
    ],
    "codePromo": "PROMO-2024"
  }'
```

**Réponse :**
```json
{
  "id": 1,
  "dateCommande": "2025-12-06T10:30:00",
  "sousTotal": 5000.00,
  "montantRemise": 250.00,
  "montantHT": 4750.00,
  "montantTVA": 950.00,
  "totalTTC": 5700.00,
  "montantRestant": 5700.00,
  "status": "PENDING",
  "items": [...],
  "customer": {...}
}
```

### Ajouter un Paiement

```bash
curl -X POST http://localhost:8080/api/payments/virement \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": 1,
    "montant": 5700.00,
    "referenceVirement": "VIR-2025-001",
    "banque": "Attijariwafa Bank"
  }'
```

### Créer un Code Promo

```bash
curl -X POST http://localhost:8080/api/promo-codes \
  -H "Content-Type: application/json" \
  -d '{
    "code": "PROMO-NOEL",
    "pourcentageRemise": 0.15,
    "active": true,
    "usageUnique": true
  }'
```

---

## 🧪 Tests

### Exécuter les Tests Unitaires

```bash
mvn test
```

### Exécuter les Tests d'Intégration

```bash
mvn verify
```

### Rapport de Couverture

```bash
mvn clean test jacoco:report
```

Le rapport sera généré dans : `target/site/jacoco/index.html`

---

## 🔐 Sécurité

### Bonnes Pratiques Implémentées

- ✅ Validation des entrées (Jakarta Validation)
- ✅ Gestion centralisée des exceptions
- ✅ HTTP-only cookies
- ✅ Protection contre les injections SQL (JPA/Hibernate)
- ✅ Soft delete pour conservation des données

### À Implémenter

- 🔒 Spring Security (JWT, OAuth2)
- 🔒 Rate Limiting
- 🔒 CORS Configuration
- 🔒 Chiffrement des mots de passe (BCrypt)

---

## 📊 Monitoring et Logs

### Logs

Les logs sont configurés avec SLF4J + Logback.

Niveaux disponibles :
- `DEBUG` : Développement
- `INFO` : Production
- `WARN` : Avertissements
- `ERROR` : Erreurs critiques

### Futures Améliorations

- Spring Boot Actuator
- Prometheus + Grafana
- Distributed Tracing (Zipkin)

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

1. **Fork** le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une **Pull Request**

### Standards de Code

- Utiliser **Lombok** pour réduire le boilerplate
- Respecter les conventions de nommage Java
- Ajouter des tests pour toute nouvelle fonctionnalité
- Documenter les méthodes publiques

---

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier `LICENSE` pour plus de détails.

---

## 👨‍💻 Auteurs

- **MicroTech Maroc** - *Développement initial*
- **Meriem003** - *Maintien du projet*

---

## 📞 Contact

Pour toute question ou suggestion :

- 📧 Email : contact@microtech.ma
- 🌐 Site Web : [www.microtech.ma](https://www.microtech.ma)
- 💬 Issues : [GitHub Issues](https://github.com/Meriem003/smart_shop/issues)

---

## 🙏 Remerciements

- Spring Boot Team
- MapStruct Community
- Lombok Project
- Tous les contributeurs open source

---

## 📈 Roadmap

### Version 1.1.0 (Q1 2026)
- [ ] Authentification JWT
- [ ] Gestion des rôles et permissions
- [ ] Export PDF des commandes/factures
- [ ] Notifications par email

### Version 1.2.0 (Q2 2026)
- [ ] Dashboard administrateur
- [ ] Statistiques avancées
- [ ] API GraphQL
- [ ] Support multi-devises

### Version 2.0.0 (Q3 2026)
- [ ] Microservices architecture
- [ ] Containerisation Docker
- [ ] CI/CD Pipeline
- [ ] Cloud deployment (AWS/Azure)

---

<div align="center">

**Développé avec ❤️ par MicroTech Maroc**

⭐ Si ce projet vous est utile, n'hésitez pas à lui donner une étoile !

</div>
