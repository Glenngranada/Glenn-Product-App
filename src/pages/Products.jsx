import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import ProductModal from "../components/ProductModal";
import ProductTable from "../components/ProductTable";
import TableSkeleton, { ErrorMsg, NoDataMsg } from "../components/DataFetchMsg";
import { useSelector } from "react-redux";
import useStockCalls from "../service/useGlennAppsCalls";


const Products = () => {
  const { products, loading, error } = useSelector((state) => state.stock);
  const { getData } = useStockCalls();
  

  const [data, setData] = useState({
    name: "", //product name
    category: "", //category id
    price: 0, // product price
    thumbnail: '', // product thumbnail
  });

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setData({
      name: "", //product name
      category: "", //category id
      price: 0, // product price
      thumbnail: '', // product thumbnail
    });
  };

  useEffect(() => {
    getData("products");
    getData("categories");

  }, []);

  return (
    <div>
      <Typography variant="h4" color="error" mb={3}>
        Products
      </Typography>
      <Button variant="contained" onClick={handleOpen} sx={{ mb: 3 }}>
        New Product
      </Button>

      <ProductModal
        open={open}
        handleClose={handleClose}
        data={data}
        setData={setData}
      />

      {error && <ErrorMsg />}

      {loading && products.map((item) => <TableSkeleton key={item} />)}

      {!error && !loading && !products.length && <NoDataMsg />}

      {!loading && !error && products.length > 0 && <ProductTable products={products}/>}
    </div>
  );
};

export default Products;
