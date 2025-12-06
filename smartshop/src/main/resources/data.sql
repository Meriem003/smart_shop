-- ============================================
-- 1. USERS (7 utilisateurs)
-- ============================================
INSERT INTO users (username, password, role) VALUES
('admin', 'admin123', 'ADMIN'),
('manager', 'manager123', 'ADMIN'),
('employee', 'emp123', 'ADMIN'),
('client_alpha', 'alpha123', 'CLIENT'),
('client_beta', 'beta123', 'CLIENT'),
('client_gamma', 'gamma123', 'CLIENT'),
('client_delta', 'delta123', 'CLIENT');

-- ============================================
-- 2. CUSTOMERS (7 clients avec différents niveaux)
-- ============================================
INSERT INTO customers (nom, email, loyalty_tier, total_orders, total_spent, user_id) VALUES
('Alpha Technologies', 'contact@alpha.ma', 'BASIC', 0, 0.00, 4),
('Beta Solutions', 'info@beta.ma', 'SILVER', 5, 2500.00, 5),
('Gamma Informatique', 'contact@gamma.ma', 'GOLD', 12, 8500.00, 6),
('Delta Systems', 'hello@delta.ma', 'PLATINUM', 25, 20000.00, 7),
('Epsilon Corp', 'contact@epsilon.ma', 'SILVER', 4, 1200.00, NULL),
('Zeta Entreprise', 'info@zeta.ma', 'GOLD', 11, 6000.00, NULL),
('Eta Technologies', 'contact@eta.ma', 'BASIC', 1, 450.00, NULL);

-- ============================================
-- 3. PRODUCTS (12 produits)
-- ============================================
INSERT INTO products (nom, prix_unitaire, stock_disponible, deleted) VALUES
('Laptop Dell XPS 15', 12500.00, 50, FALSE),
('Laptop HP Pavilion', 8500.00, 35, FALSE),
('Ecran Samsung 27"', 2500.00, 100, FALSE),
('Clavier Logitech MX', 850.00, 150, FALSE),
('Souris Logitech MX Master', 650.00, 200, FALSE),
('Imprimante HP LaserJet', 4200.00, 25, FALSE),
('Routeur Cisco', 3500.00, 40, FALSE),
('Switch TP-Link 24 ports', 2800.00, 30, FALSE),
('Disque dur externe 2TB', 750.00, 120, FALSE),
('SSD Samsung 1TB', 1200.00, 80, FALSE),
('Webcam Logitech HD', 450.00, 90, FALSE),
('Casque sans fil Sony', 980.00, 70, FALSE);

-- ============================================
-- 4. PROMO_CODES (7 codes promo)
-- ============================================
INSERT INTO promo_codes (code, pourcentage_remise, active, usage_unique, used) VALUES
('PROMO-2024', 0.05, TRUE, FALSE, FALSE),
('PROMO-NOEL', 0.10, TRUE, TRUE, FALSE),
('PROMO-VIP1', 0.08, TRUE, TRUE, TRUE),
('PROMO-SPEC', 0.07, TRUE, FALSE, FALSE),
('PROMO-TEST', 0.05, FALSE, FALSE, FALSE),
('PROMO-JANV', 0.06, TRUE, TRUE, FALSE),
('PROMO-FETE', 0.12, TRUE, FALSE, FALSE);

-- ============================================
-- 5. ORDERS (10 commandes avec différents statuts)
-- ============================================
INSERT INTO orders (date_commande, sous_total, montant_remise, montant_ht, taux_tva, montant_tva, total_ttc, montant_restant, code_promo, status, customer_id, promo_code_id) VALUES
-- Commande 1 : Client SILVER - CONFIRMED (payée totalement)
('2025-11-15 10:30:00', 10000.00, 500.00, 9500.00, 0.20, 1900.00, 11400.00, 0.00, NULL, 'CONFIRMED', 2, NULL),

-- Commande 2 : Client GOLD - CONFIRMED (payée totalement)
('2025-11-18 14:20:00', 15000.00, 1500.00, 13500.00, 0.20, 2700.00, 16200.00, 0.00, 'PROMO-2024', 'CONFIRMED', 3, 1),

-- Commande 3 : Client PLATINUM - CONFIRMED (payée totalement)
('2025-11-20 09:15:00', 25000.00, 3750.00, 21250.00, 0.20, 4250.00, 25500.00, 0.00, NULL, 'CONFIRMED', 4, NULL),

-- Commande 4 : Client BASIC - PENDING (partiellement payée)
('2025-11-25 11:45:00', 5000.00, 0.00, 5000.00, 0.20, 1000.00, 6000.00, 2000.00, NULL, 'PENDING', 1, NULL),

-- Commande 5 : Client SILVER - PENDING (partiellement payée)
('2025-11-28 16:30:00', 8000.00, 400.00, 7600.00, 0.20, 1520.00, 9120.00, 3120.00, NULL, 'PENDING', 5, NULL),

-- Commande 6 : Client GOLD - CANCELED
('2025-11-22 13:00:00', 12000.00, 1200.00, 10800.00, 0.20, 2160.00, 12960.00, 12960.00, NULL, 'CANCELED', 6, NULL),

-- Commande 7 : Client BASIC - REJECTED (stock insuffisant)
('2025-11-29 10:00:00', 3000.00, 0.00, 3000.00, 0.20, 600.00, 3600.00, 3600.00, NULL, 'REJECTED', 7, NULL),

-- Commande 8 : Client PLATINUM - CONFIRMED
('2025-12-01 12:00:00', 18000.00, 2700.00, 15300.00, 0.20, 3060.00, 18360.00, 0.00, 'PROMO-SPEC', 'CONFIRMED', 4, 4),

-- Commande 9 : Client GOLD - PENDING
('2025-12-03 15:30:00', 9000.00, 900.00, 8100.00, 0.20, 1620.00, 9720.00, 9720.00, NULL, 'PENDING', 3, NULL),

-- Commande 10 : Client SILVER - CONFIRMED
('2025-12-04 09:00:00', 6500.00, 325.00, 6175.00, 0.20, 1235.00, 7410.00, 0.00, NULL, 'CONFIRMED', 2, NULL);

-- ============================================
-- 6. ORDER_ITEMS (lignes de commande)
-- ============================================
-- Commande 1 (2 articles)
INSERT INTO order_items (quantite, prix_unitaire, total_ligne, order_id, product_id) VALUES
(2, 12500.00, 25000.00, 1, 1),
(3, 2500.00, 7500.00, 1, 3);

-- Commande 2 (3 articles)
INSERT INTO order_items (quantite, prix_unitaire, total_ligne, order_id, product_id) VALUES
(1, 8500.00, 8500.00, 2, 2),
(2, 850.00, 1700.00, 2, 4),
(3, 650.00, 1950.00, 2, 5);

-- Commande 3 (2 articles)
INSERT INTO order_items (quantite, prix_unitaire, total_ligne, order_id, product_id) VALUES
(5, 4200.00, 21000.00, 3, 6),
(2, 3500.00, 7000.00, 3, 7);

-- Commande 4 (2 articles)
INSERT INTO order_items (quantite, prix_unitaire, total_ligne, order_id, product_id) VALUES
(3, 750.00, 2250.00, 4, 9),
(2, 1200.00, 2400.00, 4, 10);

-- Commande 5 (3 articles)
INSERT INTO order_items (quantite, prix_unitaire, total_ligne, order_id, product_id) VALUES
(4, 450.00, 1800.00, 5, 11),
(3, 980.00, 2940.00, 5, 12),
(2, 2800.00, 5600.00, 5, 8);

-- Commande 6 (2 articles)
INSERT INTO order_items (quantite, prix_unitaire, total_ligne, order_id, product_id) VALUES
(3, 12500.00, 37500.00, 6, 1),
(1, 4200.00, 4200.00, 6, 6);

-- Commande 7 (1 article)
INSERT INTO order_items (quantite, prix_unitaire, total_ligne, order_id, product_id) VALUES
(2, 8500.00, 17000.00, 7, 2);

-- Commande 8 (2 articles)
INSERT INTO order_items (quantite, prix_unitaire, total_ligne, order_id, product_id) VALUES
(4, 2500.00, 10000.00, 8, 3),
(3, 2800.00, 8400.00, 8, 8);

-- Commande 9 (2 articles)
INSERT INTO order_items (quantite, prix_unitaire, total_ligne, order_id, product_id) VALUES
(5, 1200.00, 6000.00, 9, 10),
(4, 750.00, 3000.00, 9, 9);

-- Commande 10 (2 articles)
INSERT INTO order_items (quantite, prix_unitaire, total_ligne, order_id, product_id) VALUES
(3, 850.00, 2550.00, 10, 4),
(6, 650.00, 3900.00, 10, 5);

-- ============================================
-- 7. PAYMENTS (17 paiements de différents types)
-- ============================================

-- Paiements pour Commande 1 (CONFIRMED - totalement payée)
INSERT INTO payments (numero_payment, montant, date_payment, date_encaissement, status, order_id) VALUES
(1, 6000.00, '2025-11-15 11:00:00', '2025-11-15 11:00:00', 'ENCAISSÉ', 1);

INSERT INTO payment_especes (id, numero_recu) VALUES
(LAST_INSERT_ID(), 'RECU-2025-001');

INSERT INTO payments (numero_payment, montant, date_payment, date_encaissement, status, order_id) VALUES
(2, 5400.00, '2025-11-16 10:00:00', '2025-11-18 10:00:00', 'ENCAISSÉ', 1);

INSERT INTO payment_cheque (id, numero_cheque, nom_banque, date_echeance) VALUES
(LAST_INSERT_ID(), 'CHQ-123456', 'BMCE Bank', '2025-11-18 00:00:00');

-- Paiements pour Commande 2 (CONFIRMED - totalement payée)
INSERT INTO payments (numero_payment, montant, date_payment, date_encaissement, status, order_id) VALUES
(1, 10000.00, '2025-11-18 15:00:00', '2025-11-18 15:00:00', 'ENCAISSÉ', 2);

INSERT INTO payment_virement (id, reference_virement, nom_banque) VALUES
(LAST_INSERT_ID(), 'VIR-2025-11-18-001', 'Attijariwafa Bank');

INSERT INTO payments (numero_payment, montant, date_payment, date_encaissement, status, order_id) VALUES
(2, 6200.00, '2025-11-19 09:00:00', '2025-11-19 09:00:00', 'ENCAISSÉ', 2);

INSERT INTO payment_especes (id, numero_recu) VALUES
(LAST_INSERT_ID(), 'RECU-2025-002');

-- Paiements pour Commande 3 (CONFIRMED - totalement payée)
INSERT INTO payments (numero_payment, montant, date_payment, date_encaissement, status, order_id) VALUES
(1, 20000.00, '2025-11-20 10:00:00', '2025-11-20 10:00:00', 'ENCAISSÉ', 3);

INSERT INTO payment_especes (id, numero_recu) VALUES
(LAST_INSERT_ID(), 'RECU-2025-003');

INSERT INTO payments (numero_payment, montant, date_payment, date_encaissement, status, order_id) VALUES
(2, 5500.00, '2025-11-21 11:00:00', '2025-11-23 11:00:00', 'ENCAISSÉ', 3);

INSERT INTO payment_cheque (id, numero_cheque, nom_banque, date_echeance) VALUES
(LAST_INSERT_ID(), 'CHQ-789012', 'CIH Bank', '2025-11-23 00:00:00');

-- Paiements pour Commande 4 (PENDING - partiellement payée)
INSERT INTO payments (numero_payment, montant, date_payment, date_encaissement, status, order_id) VALUES
(1, 4000.00, '2025-11-25 12:00:00', '2025-11-25 12:00:00', 'ENCAISSÉ', 4);

INSERT INTO payment_especes (id, numero_recu) VALUES
(LAST_INSERT_ID(), 'RECU-2025-004');

-- Paiements pour Commande 5 (PENDING - partiellement payée)
INSERT INTO payments (numero_payment, montant, date_payment, date_encaissement, status, order_id) VALUES
(1, 6000.00, '2025-11-28 17:00:00', '2025-11-28 17:00:00', 'ENCAISSÉ', 5);

INSERT INTO payment_virement (id, reference_virement, nom_banque) VALUES
(LAST_INSERT_ID(), 'VIR-2025-11-28-001', 'Banque Populaire');

-- Paiements pour Commande 8 (CONFIRMED - totalement payée)
INSERT INTO payments (numero_payment, montant, date_payment, date_encaissement, status, order_id) VALUES
(1, 18360.00, '2025-12-01 13:00:00', '2025-12-03 13:00:00', 'ENCAISSÉ', 8);

INSERT INTO payment_cheque (id, numero_cheque, nom_banque, date_echeance) VALUES
(LAST_INSERT_ID(), 'CHQ-345678', 'BMCI', '2025-12-03 00:00:00');

-- Paiements pour Commande 10 (CONFIRMED - totalement payée)
INSERT INTO payments (numero_payment, montant, date_payment, date_encaissement, status, order_id) VALUES
(1, 7410.00, '2025-12-04 10:00:00', '2025-12-04 10:00:00', 'ENCAISSÉ', 10);

INSERT INTO payment_especes (id, numero_recu) VALUES
(LAST_INSERT_ID(), 'RECU-2025-005');

-- Paiement en attente (Chèque non encore encaissé)
INSERT INTO payments (numero_payment, montant, date_payment, date_encaissement, status, order_id) VALUES
(2, 3120.00, '2025-12-05 14:00:00', NULL, 'EN_ATTENTE', 5);

INSERT INTO payment_cheque (id, numero_cheque, nom_banque, date_echeance) VALUES
(LAST_INSERT_ID(), 'CHQ-999888', 'BMCE Bank', '2025-12-15 00:00:00');

-- Paiement rejeté (Chèque sans provision)
INSERT INTO payments (numero_payment, montant, date_payment, date_encaissement, status, order_id) VALUES
(2, 2000.00, '2025-12-06 10:00:00', NULL, 'REJETÉ', 4);

INSERT INTO payment_cheque (id, numero_cheque, nom_banque, date_echeance) VALUES
(LAST_INSERT_ID(), 'CHQ-777666', 'CIH Bank', '2025-12-06 00:00:00');
