import { useState, useCallback, useEffect } from 'react';

const useForm = (initialValues = {}, onSubmit = () => {}, validate = () => ({})) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setIsValid(Object.keys(validationErrors).length === 0);
  }, [values]); // Suppression de 'validate' pour éviter la boucle infinie

  const handleChange = useCallback((eventOrName, value) => {
    if (eventOrName?.target) {
      const { name, type, checked, value: inputValue } = eventOrName.target;
      setValues((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : inputValue,
      }));
    } else if (typeof eventOrName === 'string') {
      setValues((prev) => ({
        ...prev,
        [eventOrName]: value,
      }));
    }
  }, []);

  const handleBlur = useCallback((eventOrName) => {
    const name = eventOrName?.target?.name || eventOrName;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  const setValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const setMultipleValues = useCallback((newValues) => {
    setValues((prev) => ({
      ...prev,
      ...newValues,
    }));
  }, []);

  const setError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  const setMultipleErrors = useCallback((newErrors) => {
    setErrors((prev) => ({
      ...prev,
      ...newErrors,
    }));
  }, []);

  const handleSubmit = useCallback(async (event) => {
    if (event) {
      event.preventDefault();
    }

    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (err) {
        if (err.data?.errors) {
          setErrors(err.data.errors);
        } else {
          setError('_form', err.message || 'Une erreur est survenue');
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validate, onSubmit, setError]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const resetWith = useCallback((newValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, []);

  const hasError = useCallback((name) => {
    return touched[name] && Boolean(errors[name]);
  }, [touched, errors]);

  const getError = useCallback((name) => {
    return touched[name] ? errors[name] : undefined;
  }, [touched, errors]);

  const getFieldProps = useCallback((name) => ({
    name,
    value: values[name] || '',
    onChange: handleChange,
    onBlur: handleBlur,
  }), [values, handleChange, handleBlur]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,

    handleChange,
    handleBlur,
    handleSubmit,

    setValue,
    setValues: setMultipleValues,
    setError,
    setErrors: setMultipleErrors,

    reset,
    resetWith,
    hasError,
    getError,
    getFieldProps,
  };
};

const validators = {
  required: (value, rules) => {
    const isEmpty = !value || (typeof value === 'string' && value.trim() === '');
    return isEmpty ? (rules.requiredMessage || 'Ce champ est requis') : null;
  },
  email: (value, rules) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    return isValid ? null : (rules.emailMessage || 'Email invalide');
  },
  minLength: (value, rules) => {
    return value.length < rules.minLength 
      ? (rules.minLengthMessage || `Minimum ${rules.minLength} caractères`) 
      : null;
  },
  maxLength: (value, rules) => {
    return value.length > rules.maxLength 
      ? (rules.maxLengthMessage || `Maximum ${rules.maxLength} caractères`) 
      : null;
  },
  pattern: (value, rules) => {
    const isValid = rules.pattern.test(value);
    return isValid ? null : (rules.patternMessage || 'Format invalide');
  },
  min: (value, rules) => {
    return Number(value) < rules.min 
      ? (rules.minMessage || `Minimum ${rules.min}`) 
      : null;
  },
  max: (value, rules) => {
    return Number(value) > rules.max 
      ? (rules.maxMessage || `Maximum ${rules.max}`) 
      : null;
  },
};

export const useSimpleForm = ({ initialValues = {}, validationRules = {}, onSubmit }) => {
  const validateField = useCallback((value, rules, allValues) => {
    if (rules.required) {
      const error = validators.required(value, rules);
      if (error) return error;
    }

    if (!value) return null;

    const validationKeys = ['email', 'minLength', 'maxLength', 'pattern', 'min', 'max'];
    for (const key of validationKeys) {
      if (rules[key] !== undefined && validators[key]) {
        const error = validators[key](value, rules);
        if (error) return error;
      }
    }

    if (rules.custom) {
      return rules.custom(value, allValues) || null;
    }

    return null;
  }, []);

  const validate = useCallback((values) => {
    const errors = {};

    Object.keys(validationRules).forEach((field) => {
      const error = validateField(values[field], validationRules[field], values);
      if (error) {
        errors[field] = error;
      }
    });

    return errors;
  }, [validationRules, validateField]);

  return useForm(initialValues, onSubmit, validate);
};

export default useForm;
