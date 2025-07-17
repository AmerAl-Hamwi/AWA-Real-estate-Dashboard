// src/types/user.ts

export interface Province {
  id: string;
  name: string;
}

export interface City {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  number: string;
  userType: string;
  verified: boolean;
  logo?: string;
  hasSubscription: boolean;
  subscription: {
    createdAt: string;
  } | null;
  province: Province;
  city: City;         
  createdAt: string;
  updatedAt: string;
}
