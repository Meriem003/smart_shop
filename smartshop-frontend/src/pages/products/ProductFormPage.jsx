import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '../../components/layout';
import { Card, Button, Alert, Loading } from '../../components/common';
import { ProductForm } from '../../components/forms';
import { productService } from '../../services';

const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getById(id);
      setProduct(data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement du produit');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setSaving(true);
      setError(null);

      const productData = {
        nom: values.nom,
        prixUnitaire: Number(values.prix),
        stockDisponible: Number(values.stock),
      };

      if (isEditMode) {
        await productService.update(id, productData);
      } else {
        await productService.create(productData);
      }

      navigate('/products', {
        state: { 
          success: isEditMode 
            ? 'Produit modifié avec succès' 
            : 'Produit créé avec succès' 
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
        <Loading size="large" text="Chargement du produit..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader
        title={isEditMode ? 'Modifier le produit' : 'Nouveau produit'}
        subtitle={isEditMode ? `Modification de "${product?.nom}"` : 'Créer un nouveau produit'}
        actions={
          <Link to="/products">
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
        <ProductForm
          initialData={product}
          onSubmit={handleSubmit}
          loading={saving}
        />
      </Card>
    </div>
  );
};

export default ProductFormPage;
