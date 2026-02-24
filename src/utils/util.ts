import React from 'react';
import type { UniqueDetailObj } from '../types/UniqueDetailObj';

export const handleChange = <T extends Record<string, unknown>>(
  setState: React.Dispatch<React.SetStateAction<T>>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setState(prev => ({
        ...prev,
        [name]: value
      }));
};

export const handleChangeForUniqueDetails = <T extends Record<string, UniqueDetailObj>>(
  setUniqueDetails: React.Dispatch<React.SetStateAction<T>>,
  name: string,
  value: string,
  exists: boolean
) => {
  setUniqueDetails(prev => ({
    ...prev,
    [name]: {
      ...prev[name],
      value,
      exists
    }
  }));
};
export const toKebab = (str: string) =>
  str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();


