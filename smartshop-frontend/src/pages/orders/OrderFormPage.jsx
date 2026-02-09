import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout, PageHeader } from '../../components/layout';
import { Alert, Button } from '../../components/common';
import { OrderForm } from '../../components/forms';
import { orderService } from '../../services';

const OrderFormPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (orderData) => {
    setLoading(true);
    setError(null);
    
    try {
      const newOrder = await orderService.create(orderData);
      navigate(`/orders/${newOrder.id}`, {
        state: { message: 'Commande créée avec succès' },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Erreur lors de la création de la commande'
      );
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/orders');
  };

  return (
    <MainLayout>
      <PageHeader
        title="Nouvelle commande"
        subtitle="Créez une nouvelle commande en sélectionnant un client et des produits"
        action={
          <Button variant="secondary" onClick={handleCancel}>
            Annuler
          </Button>
        }
      />

      {error && (
        <Alert type="error" className="mb-6" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <div className="bg-white rounded-lg shadow">
        <OrderForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>
    </MainLayout>
  );
};

export default OrderFormPage;