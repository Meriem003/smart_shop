import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '../../components/layout';
import { Card, Button, Alert, Loading } from '../../components/common';
import { CustomerForm } from '../../components/forms';
import { customerService } from '../../services';

const CustomerFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      fetchCustomer();
    }
  }, [id]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await customerService.getById(id);
      setCustomer(data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement du client');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setSaving(true);
      setError(null);

      const customerData = {
        nom: values.nom,
        email: values.email,
      };

      if (isEditMode) {
        await customerService.update(id, customerData);
      } else {
        await customerService.create(customerData);
      }

      navigate('/customers', {
        state: { 
          success: isEditMode 
            ? 'Client modifié avec succès' 
            : 'Client créé avec succès' 
        }
      });
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Loading size="large" text="Chargement du client..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader
        title={isEditMode ? 'Modifier le client' : 'Nouveau client'}
        subtitle={isEditMode ? `Modification de "${customer?.nom}"` : 'Créer un nouveau client'}
        actions={
          <Link to="/customers">
            <Button variant="secondary">Retour à la liste</Button>
          </Link>
        }
      />

      {error && (
        <Alert type="error" onClose={() => setError(null)} className="mb-4">
          {error}
        </Alert>
      )}

      <Card>
        <CustomerForm
          initialData={customer}
          onSubmit={handleSubmit}
          loading={saving}
        />
      </Card>
    </div>
  );
};

export default CustomerFormPage;
