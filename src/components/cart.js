import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';
import { ToastContainer,toast } from 'react-toastify';

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get('http://localhost:5050/cart');
      // Kiểm tra nếu không có sản phẩm trong giỏ hàng
      if (response.data.cart && response.data.cart.items.length === 0) {
        console.log('Không có sản phẩm trong giỏ hàng');
        return;
      }
      setCartItems(response.data.cart.items);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin giỏ hàng:', error);
    }
  };  
  const handleQuantityChange = async (_id, newQuantity) => {
    try {
      const response = await axios.post(
        'http://localhost:5050/cart/updateQuantity',
        { _id, quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const updatedCartItems = cartItems.map((item) => {
        if (item._id === _id) {
          return {
            ...item,
            quantity: response.data.updatedItem.quantity,
          };
        }
        return item;
      });
      setCartItems(updatedCartItems);
    } catch (error) {
      console.error('Lỗi khi cập nhật số lượng sản phẩm:', error);
    }
  };


  const deleteProduct = async (productId) => {
    try {
      await axios.delete('http://localhost:5050/cart/delete', { data: productId });
      setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  

  const submitBuy = async (name) => {
    try {
      const response = await axios.post('http://localhost:5050/purchase', { name });

      if (response.status === 200) {
        toast.success("Mua hàng thành công", {
          position: toast.POSITION.TOP_CENTER
        });
        fetchCartItems();
      } else {
        console.error('Lỗi mua hàng:', response.data);
      }
    } catch (error) {
      console.error('Lỗi mua hàng:', error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Hình Ảnh</TableCell>
            <TableCell>Sản phẩm</TableCell>
            <TableCell align="center">Giá</TableCell>
            <TableCell align="center">Số lượng</TableCell>
            <TableCell align="right">Thành tiền</TableCell>
            <TableCell align="right"></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cartItems.map((item) => (
            <TableRow key={item.itemId}>
              <TableCell>
                <img src={item.Img} alt={item.name} style={{ maxWidth: '100px', maxHeight: '100px' }} />
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell align="center">{item.price}</TableCell>
              <TableCell align="center">
                <TextField
                  align="center"
                  type="number"
                  variant="outlined"
                  min="1"
                  value={item.quantity}
                  onChange={(event) => handleQuantityChange(item._id, event.target.value)}
                />
              </TableCell>
              {/* <TableCell align="right">{item.price * calculateItemCount(item.itemId)}</TableCell> */}
              <TableCell align="right">{item.quantity * item.price}</TableCell>
              <TableCell align="right">
                <Button variant="outlined" color="warning" onClick={() => submitBuy(item.name)}>
                  mua ngay
                </Button>
              </TableCell>
              <TableCell align="right">
                <Button variant="outlined" color="secondary" onClick={() => deleteProduct(item._id)}>
                  Xóa
                </Button>
              </TableCell>
            </TableRow>
          ))}

        </TableBody>
      </Table>
      <ToastContainer/>
    </TableContainer>
  );
}

export default Cart;
