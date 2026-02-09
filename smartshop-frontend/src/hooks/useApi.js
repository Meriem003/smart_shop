import { useState, useCallback, useEffect } from 'react';

const useApi = (apiFunction, options = {}) => {
  const { initialData = null } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Une erreur est survenue';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setData(initialData);
    setLoading(false);
    setError(null);
  }, [initialData]);

  const setDataManually = useCallback((newData) => {
    setData(newData);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
    setData: setDataManually,
  };
};

export const useFetch = (apiFunction, deps = [], initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    setData,
  };
};

export const usePagination = (apiFunction, options = {}) => {
  const { initialPage = 0, pageSize = 10 } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [filters, setFilters] = useState({});

  const fetchPage = useCallback(async (pageNum, currentFilters = filters) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction({
        page: pageNum,
        size: pageSize,
        ...currentFilters,
      });

      if (result.content !== undefined) {
        setData(result.content);
        setTotalPages(result.totalPages || 0);
        setTotalElements(result.totalElements || 0);
      } else if (Array.isArray(result)) {
        setData(result);
        setTotalPages(1);
        setTotalElements(result.length);
      } else {
        setData(result);
      }

      setPage(pageNum);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, [apiFunction, pageSize, filters]);

  const goToPage = useCallback((pageNum) => {
    if (pageNum >= 0 && pageNum < totalPages) {
      fetchPage(pageNum);
    }
  }, [fetchPage, totalPages]);

  const nextPage = useCallback(() => {
    if (page < totalPages - 1) {
      fetchPage(page + 1);
    }
  }, [fetchPage, page, totalPages]);

  const prevPage = useCallback(() => {
    if (page > 0) {
      fetchPage(page - 1);
    }
  }, [fetchPage, page]);

  const refresh = useCallback(() => {
    fetchPage(page);
  }, [fetchPage, page]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    fetchPage(0, newFilters);
  }, [fetchPage]);

  return {
    data,
    loading,
    error,
    page,
    pageSize,
    totalPages,
    totalElements,
    goToPage,
    nextPage,
    prevPage,
    refresh,
    filters,
    updateFilters,
    fetchPage,
  };
};

export default useApi;
