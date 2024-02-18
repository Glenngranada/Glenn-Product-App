import { useDispatch } from "react-redux";
import {
  getStocksSuccess,
  fetchFail,
  fetchStart,
  getPurchasesTableSuccess,
  getSalesTableSuccess,
  getProductTableSuccess,
} from "../features/stockSlice";
import useAxios from "./useAxios";
import { toastErrorNotify, toastSuccessNotify } from "../helper/ToastNotify";

import useIndexedDBService from './useIndexedDandLocalStorageService'

const useStockCalls = () => {
  const dispatch = useDispatch();
  const { axiosWithToken } = useAxios();

  const { getItems, addItem, deleteItem }  = useIndexedDBService();
  //Custom Glenn App LocalStorage---------
  const getData = async (storeName) => {
    dispatch(fetchStart());
    try {
      const data  = await getItems(storeName);
      const apiData = data;
      dispatch(getStocksSuccess({ apiData, url: storeName }));
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify("Error accessing data information.");
      console.log(error);
    }
  };

  const addData = async (storeName, newData) => {
    dispatch(fetchStart());
    try {
      await addItem(storeName, newData);
      toastSuccessNotify("The operation was successful.");
      getData(storeName)
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify("The operation has failed.");
      console.log(error);
    }
  };

  //Custom Glenn App---------
  // const getData = async (storeName) => {
  //   dispatch(fetchStart());
  //   try {
  //     const data  = await getItems(storeName);
  //     console.log(data, 'data from glenn calls', storeName);
  //     const apiData = data;
  //     dispatch(getStocksSuccess({ apiData, url: storeName }));
  //   } catch (error) {
  //     dispatch(fetchFail());
  //     toastErrorNotify("Error accessing data information.");
  //     console.log(error);
  //   }
  // };

  // const addData = async (storeName, newData) => {
  //   dispatch(fetchStart());
  //   try {
  //     await addItem(storeName, newData);
  //     toastSuccessNotify("The operation was successful.");
  //     getData(storeName)
  //   } catch (error) {
  //     dispatch(fetchFail());
  //     toastErrorNotify("The operation has failed.");
  //     console.log(error);
  //   }
  // };

  const deleteData = async (storeName, id) => {
    dispatch(fetchStart());
    try {
      await deleteItem(storeName, id);
      toastSuccessNotify("Data information deleted.");
      getData(storeName);
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify("Data could not be deleted");
      console.log(error);
    }
  };

  // Custom Glenn ends--------

  const getStocks = async (url) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken(`/${url}/`);
      const apiData = data.data;
      dispatch(getStocksSuccess({ apiData, url }));
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify("Error accessing data information.");
      console.log(error);
    }
  };

  const getPurchasesTable = async () => {
    dispatch(fetchStart());
    try {
      const [products, purchases, brands, firms] = await Promise.all([
        axiosWithToken("/products/"),
        axiosWithToken("/purchases/"),
        axiosWithToken("/brands/"),
        axiosWithToken("/firms/"),
      ])
      dispatch(getPurchasesTableSuccess([
        products?.data?.data,
        purchases?.data?.data,
        brands?.data?.data,
        firms?.data?.data,
      ]))
    } catch (error) {
      dispatch(fetchFail());
    }
  }

  const getSalesTable = async () => {
    dispatch(fetchStart());
    try {
      const [sales, brands, products] = await Promise.all([
        axiosWithToken("/sales/"),
        axiosWithToken("/brands/"),
        axiosWithToken("/products/"),
      ])
      dispatch(getSalesTableSuccess([
        sales?.data?.data,
        brands?.data?.data,
        products?.data?.data,
      ]))
    } catch (error) {
      dispatch(fetchFail());
    }
  }

  const getProductTable = async () => {
    dispatch(fetchStart());
    try {
      const [products, categories, brands] = await Promise.all([
        axiosWithToken("/products/"),
        axiosWithToken("/categories/"),
        axiosWithToken("/brands/"),
      ])
      dispatch(getProductTableSuccess([
        products?.data?.data,
        categories?.data?.data,
        brands?.data?.data,
      ]))
    } catch (error) {
      dispatch(fetchFail());
    }
  }

  const deleteStock = async (url, id) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.delete(`/${url}/${id}/`);
      toastSuccessNotify("Data information deleted.");
      getStocks(url);
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify("Data could not be deleted");
      console.log(error);
    }
  };

  const addStock = async (url, newData) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.post(`/${url}/`, newData);
      toastSuccessNotify("The operation was successful.");
      getStocks(url)
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify("The operation has failed.");
      console.log(error);
    }
  };


  const updateStock = async (url, data) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.put(`/${url}/${data._id}/`, data);
      toastSuccessNotify("Data information has been updated.");
      getStocks(url);
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify("Data could not be updated.");
      console.log(error);
    }
  };

  return { getStocks, deleteStock, addStock, updateStock, getPurchasesTable, getSalesTable, getProductTable, getData, addData, deleteData };

};

export default useStockCalls;