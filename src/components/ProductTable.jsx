import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import useStockCalls from "../service/useGlennAppsCalls";
import useProductServicesCalls from "../service/useProductServicesCalls";

export default function ProductTable({products}) {
  const prevPropRef = React.useRef(null);

  const { deleteData } = useStockCalls();
  // const { products } = useSelector((state) => state.stock);

  const [newproducts , setNewProducts] = React.useState(products);
  const [storageChange, setStorageChange] = React.useState(false);
  const { getpProducts } = useProductServicesCalls();

  const getRowId = (row) => row._id;

  // const columns = [
  //   {
  //     field: "_id",
  //     headerName: "#",
  //     flex: 1,
  //     minWidth: 100,
  //     headerAlign: "center",
  //     align: "center",
  //     sortable: false,
  //     valueGetter: (params) => params.value?.slice(-6),
  //   },
  //   {
  //     field: "categoryId",
  //     headerName: "Category",
  //     flex: 1.5,
  //     minWidth: 150,
  //     headerAlign: "center",
  //     align: "center",
  //     valueGetter: (params) => params.row?.categoryId?.name,
  //   },
  //   {
  //     field: "brandId",
  //     headerName: "Brand",
  //     flex: 1.5,
  //     minWidth: 150,
  //     headerAlign: "center",
  //     align: "center",
  //     valueGetter: (params) => params.row?.brandId?.name,
  //   },
  //   {
  //     field: "name",
  //     headerName: "Name",
  //     flex: 1.5,
  //     minWidth: 150,
  //     headerAlign: "center",
  //     align: "center",
  //   },
  //   {
  //     field: "quantity",
  //     headerName: "Stock",
  //     type: "number",
  //     flex: 1,
  //     minWidth: 100,
  //     headerAlign: "center",
  //     align: "center",
  //   },
  //   {
  //     field: "actions",
  //     headerName: "Actions",
  //     type: "actions",
  //     minWidth: 75,
  //     headerAlign: "center",
  //     align: "center",
  //     getActions: (params) => [
  //       <GridActionsCellItem
  //         icon={<DeleteForeverIcon />}
  //         onClick={() => deleteStock("products", params?.id)}
  //         label="Delete"
  //       />,
  //     ],
  //   },
  // ];

  const columns = [
    {
      field: "_id",
      headerName: "#",
      flex: 1,
      minWidth: 100,
      maxHeight: 100,
      headerAlign: "center",
      align: "center",
      sortable: false,
    },
    {
      field: 'thumbnail',
      headerName: 'Product Image',
      width: 150,
      editable: true,
      renderCell: (params) => <img src={params.value} />, // renderCell will render the component
      sortable: false,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1.5,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "category",
      headerName: "Category",
      flex: 1.5,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    
    {
      field: "price",
      headerName: "Price",
      type: "number",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      minWidth: 75,
      headerAlign: "center",
      align: "center",
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteForeverIcon />}
          onClick={() => deleteData("products", params?._id)}
          label="Delete"
        />,
      ],
    },
  ];


  React.useEffect(() => {
    setNewProducts(products);
    console.log(products, ' products dddd')
    
    // Check if props have changed
    if (prevPropRef.current !== products) {
      // Perform actions based on prop change
      console.log('Props have changed:', products);
      // Update prevPropRef with the current prop value
      prevPropRef.current = products;
    }

    
  }, [products]);

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        autoHeight
        rows={newproducts}
        columns={columns}
        pageSizeOptions={[5, 10, 25, 50, 100]}
        disableRowSelectionOnClick
        getRowId={getRowId}
        slots={{ toolbar: GridToolbar }}
      />
    </Box>
  );
}