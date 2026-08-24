// this is the file where the types are declared
export type userType = {
  _id: any;
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt?: any;
  updatedAt?: any;
};

export type expenseType = {
  _id: any;
  id: string;
  userId: any;
  title: string;
  amount: number;
  category: string;
  date: any;
  notes?: string;
  createdAt?: any;
  updatedAt?: any;
};

export const expenseCategories = [
  'Food & Dining',
  'Shopping',
  'Bills & Utilities',
  'Transportation',
  'Entertainment',
  'Health & Fitness',
  'Housing',
  'Others',
];
