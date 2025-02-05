import { configureStore } from '@reduxjs/toolkit';
import fetchMock from 'jest-fetch-mock';
import productReducer, {
  fetchProducts,
  fetchCategories,
  addProduct,
  updateProduct,
  deleteProduct,
} from '@/redux/product/productSlice'; 
import type  {ProductState } from '@/redux/product/productSlice'; 
import { ProductData, Categories } from '@/types/index';

fetchMock.enableMocks();

const initialState: ProductState = {
  products: [],
  categories: [],
  loadingProduct: false,
  errorProduct: null,
};

describe('productSlice', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should return the initial state', () => {
    expect(productReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('fetchProducts', () => {
    it('should handle pending state', () => {
      const action = { type: fetchProducts.pending.type };
      const state = productReducer(initialState, action);
      expect(state.loadingProduct).toBe(true);
      expect(state.errorProduct).toBeNull();
    });

    it('should handle fulfilled state', async () => {
      const mockProducts: ProductData[] = [{ id: 1, title: 'Test Product' } as ProductData];
      fetchMock.mockResponseOnce(JSON.stringify(mockProducts));

      const store = configureStore({ reducer: productReducer });
      await store.dispatch(fetchProducts());

      const state = store.getState();
      expect(state.products).toEqual(mockProducts);
      expect(state.loadingProduct).toBe(false);
    });

    it('should handle rejected state', async () => {
      fetchMock.mockReject(new Error('Failed to fetch'));

      const store = configureStore({ reducer: productReducer });
      await store.dispatch(fetchProducts());

      const state = store.getState();
      expect(state.errorProduct).toBe('Failed to load products.');
      expect(state.loadingProduct).toBe(false);
    });
  });

  // Test fetchCategories thunk and reducer handling
  describe('fetchCategories', () => {
    it('should handle pending state', () => {
      const action = { type: fetchCategories.pending.type };
      const state = productReducer(initialState, action);
      expect(state.loadingProduct).toBe(true);
      expect(state.errorProduct).toBeNull();
    });

    it('should handle fulfilled state', async () => {
      const mockCategories: Categories[] = [{ id: 1, name: 'Test Category' } as Categories];
      fetchMock.mockResponseOnce(JSON.stringify(mockCategories));

      const store = configureStore({ reducer: productReducer });
      await store.dispatch(fetchCategories());

      const state = store.getState();
      expect(state.categories).toEqual(mockCategories);
      expect(state.loadingProduct).toBe(false);
    });

    it('should handle rejected state', async () => {
      fetchMock.mockReject(new Error('Failed to fetch'));

      const store = configureStore({ reducer: productReducer });
      await store.dispatch(fetchCategories());

      const state = store.getState();
      expect(state.errorProduct).toBe('Failed to load categories.');
      expect(state.loadingProduct).toBe(false);
    });
  });

  // Test addProduct thunk
  describe('addProduct', () => {
    it('should add a product on fulfilled', async () => {
      const mockProduct: ProductData = { id: 1, title: 'New Product' } as ProductData;
      fetchMock.mockResponseOnce(JSON.stringify(mockProduct));

      const store = configureStore({ reducer: productReducer });
      await store.dispatch(addProduct({ title: 'New Product' }));

      const state = store.getState();
      expect(state.products).toContainEqual(mockProduct);
    });
  });

  // Test updateProduct thunk
  describe('updateProduct', () => {
    it('should update a product on fulfilled', async () => {
      const existingProduct: ProductData = { id: 1, title: 'Old Title' } as ProductData;
      const updatedProduct: ProductData = { id: 1, title: 'New Title' } as ProductData;

      fetchMock.mockResponseOnce(JSON.stringify(updatedProduct));

      const store = configureStore({
        reducer: productReducer,
        preloadedState: { ...initialState, products: [existingProduct] },
      });
      await store.dispatch(updateProduct({ id: 1, productData: { title: 'New Title' } }));

      const state = store.getState();
      expect(state.products).toContainEqual(updatedProduct);
    });
  });

  // Test deleteProduct thunk
  describe('deleteProduct', () => {
    it('should delete a product on fulfilled', async () => {
      const productId = 1;
      const productToDelete = { id: productId, title: 'To Delete' } as ProductData;

      fetchMock.mockResponseOnce(JSON.stringify({}), { status: 200 });

      const store = configureStore({
        reducer: productReducer,
        preloadedState: { ...initialState, products: [productToDelete] },
      });
      await store.dispatch(deleteProduct(productId));

      const state = store.getState();
      expect(state.products).not.toContainEqual(productToDelete);
    });
  });
});