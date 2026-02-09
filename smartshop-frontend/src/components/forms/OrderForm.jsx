import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { formatCurrency } from '../../utils/formatters';
import { validatePromoCode } from '../../utils/validators';
import {
  calculateSubtotal,
  calculateLoyaltyDiscount,
  calculatePromoDiscount,
  calculateTotalDiscount,
  calculateTaxableAmount,
  calculateTVA,
  calculateTotalTTC,
} from '../../utils/helpers';
import {
  LOYALTY_TIERS,
  LOYALTY_TIER_LABELS,
  LOYALTY_DISCOUNTS,
  LOYALTY_THRESHOLDS,
  PROMO_DISCOUNT_RATE,
} from '../../utils/constants';
import InputField from './InputField';
import SelectField from './SelectField';
import { Button, Card, Table, Alert } from '../common';

const LoyaltyBadge = ({ level }) => {
  const badgeColors = {
    [LOYALTY_TIERS.BASIC]: 'bg-gray-100 text-gray-800',
    [LOYALTY_TIERS.SILVER]: 'bg-slate-200 text-slate-800',
    [LOYALTY_TIERS.GOLD]: 'bg-yellow-100 text-yellow-800',
    [LOYALTY_TIERS.PLATINUM]: 'bg-purple-100 text-purple-800',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${badgeColors[level] || badgeColors[LOYALTY_TIERS.BASIC]}`}>
      {LOYALTY_TIER_LABELS[level] || level}
    </span>
  );
};

LoyaltyBadge.propTypes = {
  level: PropTypes.string.isRequired,
};

const SectionLabel = ({ number, title }) => (
  <div className="flex items-center gap-3 mb-4">
    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">
      {number}
    </span>
    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
  </div>
);

SectionLabel.propTypes = {
  number: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};

const OrderForm = ({
  customers = [],
  products = [],
  onSubmit,
  loading = false,
  onValidatePromoCode,
}) => {
  const [clientId, setClientId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [promoValid, setPromoValid] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [promoChecking, setPromoChecking] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCustomer = customers.find((c) => c.id === Number(clientId));

  const customerOptions = customers.map((c) => ({
    value: c.id,
    label: `${c.nom} - ${c.email}`,
  }));

  const availableProducts = products.filter(
    (p) => p.stock > 0 && !cartItems.some((item) => item.product.id === p.id)
  );

  const productOptions = availableProducts.map((p) => ({
    value: p.id,
    label: `${p.nom} - ${formatCurrency(p.prix)} (Stock: ${p.stock})`,
  }));

  const productToAdd = products.find((p) => p.id === Number(selectedProductId));
  const maxQuantity = productToAdd?.stock || 1;

  const items = cartItems.map((item) => ({
    prix: item.product.prix,
    quantite: item.quantity,
  }));

  const subtotal = calculateSubtotal(items);
  const loyaltyTier = selectedCustomer?.niveauFidelite || LOYALTY_TIERS.BASIC;
  const loyaltyDiscount = calculateLoyaltyDiscount(subtotal, loyaltyTier);
  const loyaltyDiscountRate = LOYALTY_DISCOUNTS[loyaltyTier] || 0;
  
  const loyaltyThreshold = LOYALTY_THRESHOLDS[loyaltyTier] || 0;
  const isLoyaltyThresholdMet = loyaltyTier === LOYALTY_TIERS.BASIC || subtotal >= loyaltyThreshold;
  const effectiveLoyaltyDiscount = isLoyaltyThresholdMet ? loyaltyDiscount : 0;

  const promoDiscount = calculatePromoDiscount(subtotal, promoValid);
  const totalDiscount = calculateTotalDiscount(effectiveLoyaltyDiscount, promoDiscount);
  const taxableAmount = calculateTaxableAmount(subtotal, totalDiscount);
  const tva = calculateTVA(taxableAmount);
  const totalTTC = calculateTotalTTC(taxableAmount, tva);

  const handleAddToCart = () => {
    if (!productToAdd || quantity < 1) return;

    if (quantity > productToAdd.stock) {
      setErrors({ ...errors, quantity: `Stock insuffisant (${productToAdd.stock} disponibles)` });
      return;
    }

    setCartItems([...cartItems, { product: productToAdd, quantity }]);
    setSelectedProductId('');
    setQuantity(1);
    setErrors({});
  };

  const handleQuantityChange = useCallback((productId, newQuantity) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const validQuantity = Math.max(1, Math.min(newQuantity, item.product.stock));
          return { ...item, quantity: validQuantity };
        }
        return item;
      })
    );
  }, []);

  const handleRemoveFromCart = useCallback((productId) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const handleCheckPromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoError('Veuillez entrer un code promo');
      return;
    }

    if (!validatePromoCode(promoCode)) {
      setPromoError('Format invalide. Utilisez PROMO-XXXX (4 caractères alphanumériques)');
      return;
    }

    setPromoChecking(true);
    setPromoError('');

    try {
      if (onValidatePromoCode) {
        const result = await onValidatePromoCode(promoCode);
        if (result.valid) {
          setPromoValid(true);
          setPromoError('');
        } else {
          setPromoValid(false);
          setPromoError(result.message || 'Code promo invalide ou expiré');
        }
      }
    } catch {
      setPromoError('Erreur lors de la vérification du code');
      setPromoValid(false);
    } finally {
      setPromoChecking(false);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!clientId) {
      newErrors.client = 'Veuillez sélectionner un client';
    }

    if (cartItems.length === 0) {
      newErrors.cart = 'Le panier est vide. Ajoutez au moins un produit.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await onSubmit({
        clientId: Number(clientId),
        lignes: cartItems.map((item) => ({
          produitId: item.product.id,
          quantite: item.quantity,
        })),
        codePromo: promoValid ? promoCode : undefined,
      });
    } catch (err) {
      setSubmitError(err.message || 'Erreur lors de la création de la commande');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (promoValid) {
      setPromoValid(false);
    }
  }, [cartItems.length]);

  const cartColumns = [
    {
      key: 'nom',
      label: 'Produit',
      render: (_, row) => <span className="font-medium">{row.product.nom}</span>,
    },
    {
      key: 'prix',
      label: 'Prix unitaire HT',
      render: (_, row) => formatCurrency(row.product.prix),
    },
    {
      key: 'quantity',
      label: 'Quantité',
      render: (_, row) => (
        <input
          type="number"
          min="1"
          max={row.product.stock}
          value={row.quantity}
          onChange={(e) => handleQuantityChange(row.product.id, Number.parseInt(e.target.value, 10) || 1)}
          disabled={loading || isSubmitting}
          className="w-20 px-2 py-1 text-center border border-gray-300 rounded text-sm"
        />
      ),
    },
    {
      key: 'total',
      label: 'Total ligne',
      render: (_, row) => (
        <span className="font-medium">{formatCurrency(row.product.prix * row.quantity)}</span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <Button
          variant="danger"
          size="small"
          onClick={() => handleRemoveFromCart(row.product.id)}
          disabled={loading || isSubmitting}
        >
          Retirer
        </Button>
      ),
    },
  ];

  const isFormDisabled = loading || isSubmitting;
  const canSubmit = clientId && cartItems.length > 0 && !isFormDisabled;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {submitError && (
        <Alert type="error" onClose={() => setSubmitError(null)}>
          {submitError}
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <SectionLabel number={1} title="Sélection du client" />
            
            <SelectField
              label="Client"
              name="clientId"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              options={customerOptions}
              error={errors.client}
              required
              placeholder="Sélectionner un client..."
              disabled={isFormDisabled}
            />

            {selectedCustomer && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{selectedCustomer.nom}</p>
                    <p className="text-sm text-gray-500">{selectedCustomer.email}</p>
                  </div>
                  <LoyaltyBadge level={selectedCustomer.niveauFidelite} />
                </div>
              </div>
            )}
          </Card>

          <Card>
            <SectionLabel number={2} title="Ajout des produits" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="md:col-span-2">
                <SelectField
                  label="Produit"
                  name="productId"
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    setQuantity(1);
                    setErrors({ ...errors, quantity: null });
                  }}
                  options={productOptions}
                  placeholder="Sélectionner un produit..."
                  disabled={isFormDisabled || productOptions.length === 0}
                />
              </div>
              <div className="flex gap-2 items-end">
                <InputField
                  label="Quantité"
                  name="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number.parseInt(e.target.value, 10) || 1)}
                  min={1}
                  max={maxQuantity}
                  error={errors.quantity}
                  disabled={isFormDisabled || !selectedProductId}
                  className="w-24 mb-0"
                />
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleAddToCart}
                  disabled={isFormDisabled || !selectedProductId}
                  className="mb-4"
                >
                  Ajouter
                </Button>
              </div>
            </div>

            {productToAdd && (
              <p className="text-sm text-gray-500 mt-2">
                Stock disponible : {productToAdd.stock} unités
              </p>
            )}

            {errors.cart && (
              <Alert type="warning" className="mt-4">
                {errors.cart}
              </Alert>
            )}

            {cartItems.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Panier ({cartItems.length} produit{cartItems.length > 1 ? 's' : ''})</h4>
                <Table
                  columns={cartColumns}
                  data={cartItems}
                  emptyMessage="Panier vide"
                />
              </div>
            )}
          </Card>

          <Card>
            <SectionLabel number={3} title="Code promo (optionnel)" />

            <div className="flex gap-4 items-end">
              <InputField
                label="Code promo"
                name="promoCode"
                value={promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value.toUpperCase());
                  setPromoValid(false);
                  setPromoError('');
                }}
                placeholder="PROMO-XXXX"
                error={promoError}
                disabled={isFormDisabled}
                className="flex-1 mb-0"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleCheckPromoCode}
                disabled={isFormDisabled || !promoCode.trim() || promoChecking}
                loading={promoChecking}
                className="mb-4"
              >
                Vérifier
              </Button>
            </div>

            {promoValid && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-700 font-medium">
                  Code valide ✓ - Remise de {(PROMO_DISCOUNT_RATE * 100).toFixed(0)}% appliquée
                </span>
              </div>
            )}
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card title="Récapitulatif" className="sticky top-6">
            <SectionLabel number={4} title="Totaux" />

            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Ajoutez des produits pour voir le récapitulatif
              </p>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between text-sm py-2 border-b">
                  <span className="text-gray-600">Sous-total HT</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>

                {loyaltyTier !== LOYALTY_TIERS.BASIC && (
                  <div className="py-2 border-b">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Remise {LOYALTY_TIER_LABELS[loyaltyTier]} ({(loyaltyDiscountRate * 100).toFixed(0)}%)
                      </span>
                      {isLoyaltyThresholdMet ? (
                        <span className="font-medium text-green-600">
                          -{formatCurrency(effectiveLoyaltyDiscount)}
                        </span>
                      ) : (
                        <span className="text-orange-500 text-xs">
                          Seuil non atteint
                        </span>
                      )}
                    </div>
                    {!isLoyaltyThresholdMet && (
                      <p className="text-xs text-gray-500 mt-1">
                        Minimum {formatCurrency(loyaltyThreshold)} pour bénéficier de la remise
                      </p>
                    )}
                  </div>
                )}

                {promoValid && (
                  <div className="flex justify-between text-sm py-2 border-b">
                    <span className="text-gray-600">Code promo ({(PROMO_DISCOUNT_RATE * 100).toFixed(0)}%)</span>
                    <span className="font-medium text-green-600">-{formatCurrency(promoDiscount)}</span>
                  </div>
                )}

                {totalDiscount > 0 && (
                  <div className="flex justify-between text-sm py-2 border-b bg-green-50 -mx-4 px-4">
                    <span className="font-medium text-green-700">Total remises</span>
                    <span className="font-bold text-green-700">-{formatCurrency(totalDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm py-2 border-b">
                  <span className="text-gray-600">Montant HT après remise</span>
                  <span className="font-medium">{formatCurrency(taxableAmount)}</span>
                </div>

                <div className="flex justify-between text-sm py-2 border-b">
                  <span className="text-gray-600">TVA (20%)</span>
                  <span className="font-medium">{formatCurrency(tva)}</span>
                </div>

                <div className="flex justify-between py-3 mt-2 bg-blue-50 -mx-4 px-4 rounded-b-lg">
                  <span className="text-lg font-bold text-gray-900">Total TTC</span>
                  <span className="text-xl font-bold text-blue-600">{formatCurrency(totalTTC)}</span>
                </div>
              </div>
            )}

            <div className="mt-6">
              <Button
                type="submit"
                variant="primary"
                loading={isSubmitting}
                disabled={!canSubmit}
                className="w-full"
              >
                Créer la commande
              </Button>
              {!canSubmit && !isFormDisabled && (
                <p className="text-xs text-gray-500 text-center mt-2">
                  {!clientId && 'Sélectionnez un client'}
                  {clientId && cartItems.length === 0 && 'Ajoutez des produits au panier'}
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
};

OrderForm.propTypes = {
  customers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nom: PropTypes.string.isRequired,
      email: PropTypes.string,
      niveauFidelite: PropTypes.string,
    })
  ),
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nom: PropTypes.string.isRequired,
      prix: PropTypes.number.isRequired,
      stock: PropTypes.number.isRequired,
    })
  ),
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  onValidatePromoCode: PropTypes.func,
};

export default OrderForm;

