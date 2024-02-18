import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { modalStyle } from "../styles/globalStyles";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";


import { MuiFileInput } from 'mui-file-input'

import useStockCalls from "../service/useGlennAppsCalls";


export default function ProductModal({ open, handleClose, data, setData }) {
  const { categories } = useSelector((state) => state.stock);

  const { addData, getData } = useStockCalls();

  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    console.log(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addData('products' ,data);
    handleClose();
    setThumbnail('');
    setFile(null);
  };
  

  const handleFileChange = (newFile) => {
    setFile(newFile)
    const f = newFile;
    if (f) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result);
        data['thumbnail'] = reader.result;
        // setData({ ...data, 'thumbnail': reader.result });
        console.log(data);
      };
      reader.readAsDataURL(f);
    }
  }

  useEffect(() => {
    getData("categories");
  }, []);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            component="form"
            onSubmit={handleSubmit}
          >
            <FormControl fullWidth>
              <InputLabel id="category-select-label">Categories</InputLabel>
              <Select
                labelId="category-select-label"
                id="category-select"
                name="category"
                value={data?.category || ""}
                label="Categories"
                onChange={handleChange}
                required
              >
                {categories?.map((category) => (
                  <MenuItem key={category.name} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Price"
              name="price"
              id="price"
              type="text"
              variant="outlined"
              value={data.price || ''}
              onChange={handleChange}
              required
            />

            <TextField
              label="Product Name"
              name="name"
              id="name"
              type="text"
              variant="outlined"
              value={data.name || ''}
              onChange={handleChange}
              required
            />

            <MuiFileInput name value={file} onChange={handleFileChange} />
            {thumbnail && (
              <div style={{'display': 'flex', 'justifyContent': 'center','alignItems': 'center'}}>
                <img src={thumbnail} alt="Thumbnail" style={{ maxWidth: '100px', maxHeight: '100px' }} />
              </div>
            )}

            <Button type="submit" variant="contained" size="large">
              add product
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}