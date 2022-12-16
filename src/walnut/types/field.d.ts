declare global {
  interface IStringFieldOptions {
    minLength?: number;
    maxLength?: number;
    toLowerCase?: boolean;
    toUpperCase?: boolean;
    swagger?: boolean;
  }

  interface INumberFieldOptions {
    each?: boolean;
    minimum?: number;
    maximum?: number;
    int?: boolean;
    isPositive?: boolean;
    swagger?: boolean;
  }
}

export {};
