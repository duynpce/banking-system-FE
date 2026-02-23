import React from 'react';

const handleChange = <T extends Record<string, unknown>>(
  setFormData: React.Dispatch<React.SetStateAction<T>>,
) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  setFormData(prev => ({
    ...prev,
    [e.target.name]: e.target.value
  }))
}

export default handleChange;
