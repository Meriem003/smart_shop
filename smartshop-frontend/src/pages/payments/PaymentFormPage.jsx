import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MainLayout, PageHeader } from '../../components/layout';
import { Card, Loading, Alert, Button } from '../../components/common';
import { SelectField, PaymentForm } from '../../components/forms';
import { orderService } from '../../services';
import { formatCurrency } from '../../utils/formatters';

const PaymentFormPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedOrderId = searchParams.get('orderId');

  // États
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(preselectedOrderId || '');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les commandes en attente
  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await orderService.getAll({ size: 100 });
        const allOrders = data.content || data;
        // Filtrer les commandes avec montant restant > 0
        const pendingOrders = allOrders.filter(
          (o) => (o.montantRestant || 0) > 0
        );
        setOrders(pendingOrders);

        // Si un orderId est passé en paramètre
        if (preselectedOrderId) {
          const order = pendingOrders.find(
            (o) => o.id === Number(preselectedOrderId)
          );
          if (order) {
            setSelectedOrder(order);
          }
        }
      } catch {
        setError('Erreur lors du chargement des commandes');
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [preselectedOrderId]);

  // Quand la sélection change
  const handleOrderChange = (e) => {
    const orderId = e.target.value;
    setSelectedOrderId(orderId);
    if (orderId) {
      const order = orders.find((o) => o.id === Number(orderId));
      setSelectedOrder(order || null);
    } else {
      setSelectedOrder(null);
    }
  };

  // Après succès du paiement
  const handleSuccess = () => {
    navigate(`/orders/${selectedOrderId}`, {
      state: { message: 'Paiement enregistré avec succès' },
    });
  };

  // Annuler
  const handleCancel = () => {
    if (selectedOrderId) {
      navigate(`/orders/${selectedOrderId}`);
    } else {
      navigate('/payments');
    }
  };

  // Options de commandes
  const orderOptions = [
    { value: '', label: 'Sélectionner une commande' },
    ...orders.map((o) => {
      const client = o.client || o.customer;
      const clientName = client ? `${client.prenom} ${client.nom}` : 'Client inconnu';
      return {
        value: o.id,
        label: `#${o.id} - ${clientName} - Restant: ${formatCurrency(o.montantRestant || 0)}`,
      };
    }),
  ];

  if (loading) {
    return (
      <MainLayout>
        <Loading message="Chargement des commandes..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="Nouveau paiement"
        subtitle="Enregistrer un paiement pour une commande"
        action={
          <Button variant="secondary" onClick={handleCancel}>
            Retour
          </Button>
        }
      />

      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}

      {orders.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">
              Aucune commande en attente de paiement
            </p>
            <Button onClick={() => navigate('/orders')}>
              Voir les commandes
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Sélection de commande */}
          <Card title="Sélectionner la commande">
            <SelectField
              label="Commande"
              value={selectedOrderId}
              onChange={handleOrderChange}
              options={orderOptions}
              required
            />

            {selectedOrder && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Client</p>
                    <p className="font-medium">
                      {selectedOrder.client?.prenom} {selectedOrder.client?.nom}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total TTC</p>
                    <p className="font-medium">
                      {formatCurrency(selectedOrder.totalTTC || selectedOrder.total || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Déjà payé</p>
                    <p className="font-medium text-green-600">
                      {formatCurrency(
                        (selectedOrder.totalTTC || selectedOrder.total || 0) -
                          (selectedOrder.montantRestant || 0)
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Restant à payer</p>
                    <p className="font-bold text-red-600">
                      {formatCurrency(selectedOrder.montantRestant || 0)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Formulaire de paiement */}
          {selectedOrder && (
            <Card title="Détails du paiement">
              <PaymentForm
                orderId={Number(selectedOrderId)}
                remainingAmount={selectedOrder.montantRestant || 0}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            </Card>
          )}
        </div>
      )}
    </MainLayout>
  );
};

export default PaymentFormPage;
