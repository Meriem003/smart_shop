import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useForm } from '../../hooks';
import { validateEmail } from '../../utils/validators';
import InputField from './InputField';
import { Button } from '../common';

const CustomerForm = ({ initialData, onSubmit, loading = false }) => {
  const validate = useCallback((values) => {
    const errors = {};

    if (!values.nom || values.nom.trim() === '') {
      errors.nom = 'Le nom est requis';
    } else if (values.nom.length < 2) {
      errors.nom = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!values.email || values.email.trim() === '') {
      errors.email = 'L\'email est requis';
    } else if (!validateEmail(values.email)) {
      errors.email = 'L\'email n\'est pas valide';
    }

    return errors;
  }, []);

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
  } = useForm(
    {
      nom: initialData?.nom || '',
      email: initialData?.email || '',
    },
    onSubmit,
    validate
  );

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        label="Nom"
        name="nom"
        value={values.nom}
        onChange={handleChange}
        error={errors.nom}
        required
        placeholder="Nom du client"
        disabled={loading || isSubmitting}
      />

      <InputField
        label="Email"
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange}
        error={errors.email}
        required
        placeholder="email@exemple.com"
        disabled={loading || isSubmitting}
      />

      <div className="flex justify-end gap-3 mt-6">
        <Button
          type="submit"
          variant="primary"
          loading={loading || isSubmitting}
        >
          {initialData ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};

CustomerForm.propTypes = {
  initialData: PropTypes.shape({
    nom: PropTypes.string,
    email: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default CustomerForm;
