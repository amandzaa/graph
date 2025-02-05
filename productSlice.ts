import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ProductData, Categories, ProductFormData } from '@/types/index';

export interface ProductState {
  products: ProductData[];
  categories: Categories[];
  loadingProduct: boolean;
  errorProduct: string | null;
}

const initialState: ProductState = {
  products: [],
  categories: [],
  loadingProduct: false,
  errorProduct: null,
};

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://api.escuelajs.co/api/v1/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue('Failed to load products.');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'product/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://api.escuelajs.co/api/v1/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue('Failed to load categories.');
    }
  }
);

export const addProduct = createAsyncThunk(
  'product/addProduct',
  async (productData: Partial<ProductFormData>, { rejectWithValue }) => {
    try {
      const response = await fetch('https://api.escuelajs.co/api/v1/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add product');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue('Failed to add product.');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ id, productData }: { id: number, productData: Partial<ProductData> }, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://api.escuelajs.co/api/v1/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue('Failed to update product.');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://api.escuelajs.co/api/v1/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      return id;
    } catch (error) {
      return rejectWithValue('Failed to delete product.');
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loadingProduct = true;
        state.errorProduct = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<ProductData[]>) => {
        state.loadingProduct = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loadingProduct = false;
        state.errorProduct = action.payload as string;
      })
      .addCase(fetchCategories.pending, (state) => {
        state.loadingProduct = true;
        state.errorProduct = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Categories[]>) => {
        state.loadingProduct = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loadingProduct = false;
        state.errorProduct = action.payload as string;
      })
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<ProductData>) => {
        state.products.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<ProductData>) => {
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
        state.products = state.products.filter(p => p.id !== action.payload);
      });
  },
});

export default productSlice.reducer;