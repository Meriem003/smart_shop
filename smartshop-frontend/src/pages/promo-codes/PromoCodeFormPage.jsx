import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '../../components/layout';
import { Card, Button, Alert, Loading } from '../../components/common';
import { PromoCodeForm } from '../../components/forms';
import { promoCodeService } from '../../services';

const PromoCodeFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [promoCode, setPromoCode] = useState(null);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      fetchPromoCode();
    }
  }, [id]);

  const fetchPromoCode = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await promoCodeService.getById(id);
      setPromoCode(data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement du code promo');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setSaving(true);
      setError(null);

      const promoCodeData = {
        code: values.code.toUpperCase(),
        pourcentageRemise: Number(values.pourcentageRemise),
        usageUnique: values.usageUnique,
      };

      if (isEditMode) {
        // Update n'est pas supporté dans l'API backend, donc redirection
        navigate('/promo-codes');
      } else {
        await promoCodeService.create(promoCodeData);
      }

      navigate('/promo-codes', {
        state: { 
          success: isEditMode 
            ? 'Code promo modifié avec succès' 
            : 'Code promo créé avec succès' 
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
        <Loading size="large" text="Chargement du code promo..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader
        title={isEditMode ? 'Modifier le code promo' : 'Nouveau code promo'}
        subtitle={isEditMode ? `Modification de "${promoCode?.code}"` : 'Créer un nouveau code promotionnel'}
        actions={
          <Link to="/promo-codes">
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
        <PromoCodeForm
          initialData={promoCode}
          onSubmit={handleSubmit}
          loading={saving}
        />
      </Card>
    </div>
  );
};

export default PromoCodeFormPage;