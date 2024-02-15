
import { toastErrorNotify, toastSuccessNotify } from "../helper/ToastNotify";
import { v4 as uuidv4 } from 'uuid';

const useProductServicesCalls = () => {

  const getCategories = async (res) => {
    console.log('was called but never returned');
    const category = JSON.parse(localStorage.getItem('category'));
    res(category);
  }

  const getpProducts = async (res) => {
    console.log('was called but never returned');
    const products = JSON.parse(localStorage.getItem('products'));
    console.log(products, 'producsts on service');
    res(products || []);
  }

  const addProduct = async (data) => {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const p_uid = uuidv4();
    data['_id'] = String(p_uid);
    products.push(data);
    localStorage.setItem('products' ,JSON.stringify(products))
    toastSuccessNotify("Product addedd successfully.");
  }

  
  return { getCategories, addProduct, getpProducts };

};

export default useProductServicesCalls;
