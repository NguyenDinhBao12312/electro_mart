import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import React from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import {  Form, FormControl } from 'react-bootstrap';
import axios from 'axios';
import { useState } from 'react';
export default function Menu() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      axios.get(`http://localhost:5000/products/find?keyword=${searchKeyword}`)
        .then(response => {
          // Chuyển hướng đến trang Products và truyền từ khóa tìm kiếm
          navigate({
            pathname: '/products',
            search: `?keyword=${searchKeyword}`,
            state: { products: response.data }
          });
        })
        .catch(error => {
          console.log('Error searching products:', error);
        });
    }
  }
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">Shop</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/iPhone">Phone</Nav.Link>
            <NavDropdown title="Device" id="collasible-nav-dropdown">
              <NavDropdown.Item href="/iPad">iPad</NavDropdown.Item>
              <NavDropdown.Item href="/AppleWatch">AppleWatch</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form inline onSubmit={handleSearch}>
            <FormControl type="text" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} placeholder="Tìm kiếm sản phẩm" />
          </Form>
          <Nav.Link href='/cart'>
            <ShoppingCartIcon sx={{ color: 'red' }} />
          </Nav.Link>
          <Nav>
            <Nav.Link href="/Login">Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
