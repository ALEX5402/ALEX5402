import { useState, useEffect } from 'react';

interface Age {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalYears: number;
}

export const useAge = (birthDate: Date): Age => {
  const [age, setAge] = useState<Age>(() => calculateAge(birthDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setAge(calculateAge(birthDate));
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [birthDate]);

  return age;
};

const calculateAge = (birthDate: Date): Age => {
  const now = new Date();
  const diff = now.getTime() - birthDate.getTime();

  // Calculate total years with decimal precision
  const totalYears = diff / (365.25 * 24 * 60 * 60 * 1000);

  // Calculate individual components
  const years = Math.floor(totalYears);
  const months = Math.floor((totalYears - years) * 12);
  const days = Math.floor(((totalYears - years) * 12 - months) * 30.44);
  const hours = Math.floor(((totalYears - years) * 12 - months) * 30.44 * 24 - days * 24);
  const minutes = Math.floor((((totalYears - years) * 12 - months) * 30.44 * 24 - days * 24 - hours) * 60);
  const seconds = Math.floor(((((totalYears - years) * 12 - months) * 30.44 * 24 - days * 24 - hours) * 60 - minutes) * 60);

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    totalYears
  };
};
