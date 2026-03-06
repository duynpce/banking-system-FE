import React from 'react';
import type { UniqueDetailObj } from '../types/unique-detail.type';

export const handleChange = <T extends Record<string, unknown>>(
  setState: React.Dispatch<React.SetStateAction<T>>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setState(prev => ({
        ...prev,
        [name]: value
      }));
};

export const handleChangeValueForUniqueDetails = <T extends Record<string, UniqueDetailObj>>(
  setUniqueDetails: React.Dispatch<React.SetStateAction<T>>,
  name: string,
  value: string,
) => {
  setUniqueDetails(prev => ({
    ...prev,
    [name]: {
      ...prev[name],
      value,
    }
  }));
};

export const handleChangeExistsForUniqueDetails = <T extends Record<string, UniqueDetailObj>>(
  setUniqueDetails: React.Dispatch<React.SetStateAction<T>>,
  name: string,
  exists: boolean,
) => {
  setUniqueDetails(prev => ({
    ...prev,
    [name]: {
      ...prev[name],
      exists,
    }
  }));
};

export const trimObjectValues = (obj : Record<string,unknown>) => {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value]));
};


