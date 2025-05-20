// types/car.ts
export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  image: string;
  isRented: boolean;
  agencyId: string;
}

export type AddCarRequest = Omit<Car, 'id' | 'isRented'>;
export type UpdateCarPriceRequest = Pick<Car, 'id' | 'pricePerDay'>;