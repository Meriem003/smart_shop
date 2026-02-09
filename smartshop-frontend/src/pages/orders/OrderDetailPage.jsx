import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { MainLayout, PageHeader } from '../../components/layout';
import { Card, Table, Loading, Alert, Button, Modal, ConfirmDialog } from '../../components/common';
import { SelectField, InputField } from '../../components/forms';
import { orderService, paymentService } from '../../services';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { ORDER_STATUS, PAYMENT_TYPES, PAYMENT_TYPE_LABELS, CASH_PAYMENT_LIMIT } from '../../utils/constants';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(location.state?.message || null);
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  
  const [paymentType, setPaymentType] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [numeroCheque, setNumeroCheque] = useState('');
  const [banqueCheque, setBanqueCheque] = useState('');
  const [referenceVirement, setReferenceVirement] = useState('');
  const [banqueVirement, setBanqueVirement] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  
  const [actionLoading, setActionLoading] = useState(false);

  const loadOrder = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getById(id);
      setOrder(data);
    } catch {
      setError('Erreur lors du chargement de la commande');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleConfirm = async () => {
    setActionLoading(true);
    try {
      await orderService.confirm(id);
      setSuccessMessage('Commande confirmée avec succès');
      setShowConfirmDialog(false);
      loadOrder();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la confirmation');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    setActionLoading(true);
    try {
      await orderService.cancel(id);
      setSuccessMessage('Commande annulée');
      setShowCancelDialog(false);
      loadOrder();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'annulation");
    } finally {
      setActionLoading(false);
    }
  };

  const openPaymentModal = () => {
    setPaymentType('');
    setPaymentAmount(order?.montantRestant?.toString() || '');
    setNumeroCheque('');
    setBanqueCheque('');
    setReferenceVirement('');
    setBanqueVirement('');
    setPaymentError(null);
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async () => {
    setPaymentError(null);
    
    if (!paymentType) {
      setPaymentError('Veuillez sélectionner un type de paiement');
      return;
    }
    if (!paymentAmount || Number(paymentAmount) <= 0) {
      setPaymentError('Veuillez entrer un montant valide');
      return;
    }
    if (Number(paymentAmount) > (order?.montantRestant || 0)) {
      setPaymentError('Le montant ne peut pas dépasser le montant restant');
      return;
    }
    if (paymentType === PAYMENT_TYPES.CASH && Number(paymentAmount) > CASH_PAYMENT_LIMIT) {
      setPaymentError(`Le paiement en espèces est limité à ${formatCurrency(CASH_PAYMENT_LIMIT)}`);
      return;
    }
    if (paymentType === PAYMENT_TYPES.CHECK && (!numeroCheque || !banqueCheque)) {
      setPaymentError('Veuillez remplir tous les champs du chèque');
      return;
    }
    if (paymentType === PAYMENT_TYPES.TRANSFER && (!referenceVirement || !banqueVirement)) {
      setPaymentError('Veuillez remplir tous les champs du virement');
      return;
    }

    setPaymentLoading(true);
    try {
      const baseData = {
        orderId: Number(id),
        montant: Number(paymentAmount),
      };

      if (paymentType === PAYMENT_TYPES.CASH) {
        await paymentService.createEspeces(baseData);
      } else if (paymentType === PAYMENT_TYPES.CHECK) {
        await paymentService.createCheque({
          ...baseData,
          numeroCheque,
          banque: banqueCheque,
        });
      } else if (paymentType === PAYMENT_TYPES.TRANSFER) {
        await paymentService.createVirement({
          ...baseData,
          referenceVirement,
          banque: banqueVirement,
        });
      }

      setSuccessMessage('Paiement enregistré avec succès');
      setShowPaymentModal(false);
      loadOrder();
    } catch (err) {
      setPaymentError(err.response?.data?.message || "Erreur lors de l'enregistrement du paiement");
    } finally {
      setPaymentLoading(false);
    }
  };

  // Badge de statut
  const getStatusBadge = (status) => {
    const statusStyles = {
      [ORDER_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
      [ORDER_STATUS.CONFIRMED]: 'bg-green-100 text-green-800',
      [ORDER_STATUS.CANCELED]: 'bg-red-100 text-red-800',
      [ORDER_STATUS.REJECTED]: 'bg-gray-100 text-gray-800',
    };

    const statusLabels = {
      [ORDER_STATUS.PENDING]: 'En attente',
      [ORDER_STATUS.CONFIRMED]: 'Confirmée',
      [ORDER_STATUS.CANCELED]: 'Annulée',
      [ORDER_STATUS.REJECTED]: 'Rejetée',
    };

    const style = statusStyles[status] || 'bg-gray-100 text-gray-800';
    const label = statusLabels[status] || status;

    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${style}`}>
        {label}
      </span>
    );
  };

  const productColumns = [
    {
      key: 'produit',
      label: 'Produit',
      render: (_, row) => {
        const product = row.produit || row.product;
        return product?.designation || product?.nom || '-';
      },
    },
    {
      key: 'prixUnitaire',
      label: 'Prix unitaire',
      render: (value) => formatCurrency(value),
    },
    {
      key: 'quantite',
      label: 'Quantité',
    },
    {
      key: 'total',
      label: 'Total',
      render: (_, row) => formatCurrency((row.prixUnitaire || 0) * (row.quantite || 0)),
    },
  ];

  const paymentColumns = [
    {
      key: 'id',
      label: 'N°',
      render: (value) => `#${value}`,
    },
    {
      key: 'datePaiement',
      label: 'Date',
      render: (value) => formatDateTime(value),
    },
    {
      key: 'typePaiement',
      label: 'Type',
      render: (value) => PAYMENT_TYPE_LABELS[value] || value,
    },
    {
      key: 'montant',
      label: 'Montant',
      render: (value) => (
        <span className="font-medium text-green-600">{formatCurrency(value)}</span>
      ),
    },
  ];

  // Options de type de paiement
  const paymentTypeOptions = [
    { value: '', label: 'Sélectionner un type' },
    { value: PAYMENT_TYPES.CASH, label: PAYMENT_TYPE_LABELS[PAYMENT_TYPES.CASH] },
    { value: PAYMENT_TYPES.CHECK, label: PAYMENT_TYPE_LABELS[PAYMENT_TYPES.CHECK] },
    { value: PAYMENT_TYPES.TRANSFER, label: PAYMENT_TYPE_LABELS[PAYMENT_TYPES.TRANSFER] },
  ];

  if (loading) {
    return (
      <MainLayout>
        <Loading message="Chargement de la commande..." />
      </MainLayout>
    );
  }

  if (error && !order) {
    return (
      <MainLayout>
        <Alert type="error">{error}</Alert>
        <div className="mt-4">
          <Button onClick={() => navigate('/orders')}>Retour aux commandes</Button>
        </div>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout>
        <Alert type="error">Commande non trouvée</Alert>
        <div className="mt-4">
          <Button onClick={() => navigate('/orders')}>Retour aux commandes</Button>
        </div>
      </MainLayout>
    );
  }

  const client = order.client || order.customer;
  const lignesCommande = order.lignesCommande || order.orderItems || [];
  const paiements = order.paiements || order.payments || [];
  const isPending = order.statut === ORDER_STATUS.PENDING;
  const canConfirm = isPending && (order.montantRestant || 0) === 0;
  const canPay = isPending && (order.montantRestant || 0) > 0;

  return (
    <MainLayout>
      <PageHeader
        title={`Commande #${order.id}`}
        subtitle={`Créée le ${formatDateTime(order.dateCommande)}`}
        action={
          <Link to="/orders">
            <Button variant="secondary">Retour aux commandes</Button>
          </Link>
        }
      />

      {/* Messages */}
      {successMessage && (
        <Alert type="success" className="mb-6" onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}
      {error && (
        <Alert type="error" className="mb-6" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations générales */}
          <Card title="Informations de la commande">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">N° Commande</p>
                <p className="font-medium">#{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{formatDateTime(order.dateCommande)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Client</p>
                {client ? (
                  <Link
                    to={`/customers/${client.id}`}
                    className="font-medium text-blue-600 hover:text-blue-800"
                  >
                    {client.prenom} {client.nom}
                  </Link>
                ) : (
                  <p className="font-medium">-</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Statut</p>
                <div className="mt-1">{getStatusBadge(order.statut)}</div>
              </div>
              {order.codePromo && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Code promo appliqué</p>
                  <p className="font-medium text-green-600">{order.codePromo.code}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Produits commandés */}
          <Card title="Produits commandés">
            {lignesCommande.length > 0 ? (
              <Table columns={productColumns} data={lignesCommande} />
            ) : (
              <p className="text-gray-500 text-center py-4">Aucun produit</p>
            )}
          </Card>

          {/* Paiements */}
          <Card
            title="Paiements"
            action={
              canPay && (
                <Button size="sm" onClick={openPaymentModal}>
                  Ajouter un paiement
                </Button>
              )
            }
          >
            {paiements.length > 0 ? (
              <Table columns={paymentColumns} data={paiements} />
            ) : (
              <p className="text-gray-500 text-center py-4">Aucun paiement enregistré</p>
            )}
          </Card>
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Récapitulatif financier */}
          <Card title="Récapitulatif">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total HT</span>
                <span>{formatCurrency(order.sousTotal || order.subtotal || 0)}</span>
              </div>
              
              {(order.remiseFidelite || order.loyaltyDiscount) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Remise fidélité</span>
                  <span>-{formatCurrency(order.remiseFidelite || order.loyaltyDiscount)}</span>
                </div>
              )}
              
              {(order.remisePromo || order.promoDiscount) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Remise promo</span>
                  <span>-{formatCurrency(order.remisePromo || order.promoDiscount)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Base imposable</span>
                <span>{formatCurrency(order.baseImposable || order.taxableAmount || 0)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">TVA (20%)</span>
                <span>{formatCurrency(order.tva || order.taxAmount || 0)}</span>
              </div>
              
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total TTC</span>
                <span>{formatCurrency(order.totalTTC || order.total || 0)}</span>
              </div>
              
              <div className="border-t pt-3 flex justify-between">
                <span className="text-gray-600">Montant payé</span>
                <span className="text-green-600">
                  {formatCurrency((order.totalTTC || order.total || 0) - (order.montantRestant || 0))}
                </span>
              </div>
              
              <div className="flex justify-between font-medium">
                <span>Reste à payer</span>
                <span className={order.montantRestant > 0 ? 'text-red-600' : 'text-green-600'}>
                  {formatCurrency(order.montantRestant || 0)}
                </span>
              </div>
            </div>
          </Card>

          {/* Actions */}
          {isPending && (
            <Card title="Actions">
              <div className="space-y-3">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setShowConfirmDialog(true)}
                  disabled={!canConfirm || actionLoading}
                >
                  Confirmer la commande
                </Button>
                {!canConfirm && (
                  <p className="text-sm text-gray-500 text-center">
                    Veuillez payer le montant restant avant de confirmer
                  </p>
                )}
                <Button
                  variant="danger"
                  className="w-full"
                  onClick={() => setShowCancelDialog(true)}
                  disabled={actionLoading}
                >
                  Annuler la commande
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Modal de paiement */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Ajouter un paiement"
      >
        <div className="space-y-4">
          {paymentError && (
            <Alert type="error">{paymentError}</Alert>
          )}
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              Montant restant à payer: <strong>{formatCurrency(order.montantRestant || 0)}</strong>
            </p>
          </div>

          <SelectField
            label="Type de paiement"
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            options={paymentTypeOptions}
            required
          />

          <InputField
            label="Montant"
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            min="0.01"
            max={order.montantRestant || 0}
            step="0.01"
            required
          />

          {paymentType === PAYMENT_TYPES.CHECK && (
            <>
              <InputField
                label="Numéro de chèque"
                value={numeroCheque}
                onChange={(e) => setNumeroCheque(e.target.value)}
                required
              />
              <InputField
                label="Banque"
                value={banqueCheque}
                onChange={(e) => setBanqueCheque(e.target.value)}
                required
              />
            </>
          )}

          {paymentType === PAYMENT_TYPES.TRANSFER && (
            <>
              <InputField
                label="Référence du virement"
                value={referenceVirement}
                onChange={(e) => setReferenceVirement(e.target.value)}
                required
              />
              <InputField
                label="Banque"
                value={banqueVirement}
                onChange={(e) => setBanqueVirement(e.target.value)}
                required
              />
            </>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowPaymentModal(false)}
              disabled={paymentLoading}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={handlePaymentSubmit}
              loading={paymentLoading}
            >
              Enregistrer le paiement
            </Button>
          </div>
        </div>
      </Modal>

      {/* Dialog de confirmation */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirm}
        title="Confirmer la commande"
        message={`Êtes-vous sûr de vouloir confirmer la commande #${order.id} ? Cette action est irréversible.`}
        confirmText="Confirmer"
        loading={actionLoading}
      />

      {/* Dialog d'annulation */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancel}
        title="Annuler la commande"
        message={`Êtes-vous sûr de vouloir annuler la commande #${order.id} ? Cette action est irréversible.`}
        confirmText="Annuler la commande"
        confirmVariant="danger"
        loading={actionLoading}
      />
    </MainLayout>
  );
};

export default OrderDetailPage;