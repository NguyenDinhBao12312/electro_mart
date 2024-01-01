import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import style from './Home.css';
import { Container, Row, Col } from 'react-bootstrap';
import useAuth from './useAuth';
import { Button } from '@mui/material';
import axios from 'axios';

function Home() {
    const isAuth = useAuth();
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    useEffect(() => {
        setLoading(false);
    }, [isAuth]);
    //   const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async (_id) => {
            try {
                const response = await axios.get('http://localhost:5050/products', { _id });
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách sản phẩm:', error);
                setLoading(false);
            }
        };
        if (loading) {
            fetchProducts();
        }
    }, [loading]);
    // home.js

    // Hàm addToCart - Thêm sản phẩm vào giỏ hàng
    const AddToCart = async (productId) => {
        try {
            const response = await axios.post('http://localhost:5050/carts/items', { _id: productId });
            console.log(response.data.message); // In ra thông báo thành công
        } catch (error) {
            console.error('Lỗi add to cart:', error);
        }
    };

    return (
        <div>
            <Carousel fade>
                <Carousel.Item>
                    <img className="d-block w-100" src="https://cdn.didongviet.vn/pub/media/mageplaza/bannerslider/banner/image/1/0/1024x340-kredivo.jpg" alt="slide-1" />
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100" src="https://cdn.didongviet.vn/pub/media/mageplaza/bannerslider/banner/image/d/a/danh-muc--tpbank.jpg" alt="slide-2" />
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100" src="https://cdn.didongviet.vn/pub/media/mageplaza/bannerslider/banner/image/1/0/1024x340_2__24.jpg" alt="slide-3" />
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100" src="https://cdn.didongviet.vn/pub/media/mageplaza/bannerslider/banner/image/1/0/1024x340_168.jpg" alt="slide-4" />
                </Carousel.Item>
            </Carousel>

            <div>
                <Container fluid>
                    <Row className="slider-header">
                        <Col xs={12} sm={12} md={6}>
                            <h2 className="slider-title pb-16 bold">iPhone VN/A</h2>
                        </Col>
                        <Col xs={12} sm={12} md={6}>
                            <div className="sub-links">
                                <a href="https://didongviet.vn/iphone-14.html" target="_blank" rel="noreferrer">iPhone 14</a>
                                <a href="https://didongviet.vn/iphone-13" target="_blank" rel="noreferrer">iPhone 13</a>
                                <a href="https://didongviet.vn/iphone-12" target="_blank" rel="noreferrer">iPhone 12</a>
                            </div>
                        </Col>
                    </Row>
                </Container>
                <Container style={{ textAlign: 'center' }} className={style.MyStyle}>
                    <Row>
                        {products.filter((item) => item.type === 'iPhone').map((item) => (
                            <Col key={item.id} xs={6} sm={6} md={4}>
                                <Typography gutterBottom variant="h5" style={{ fontWeight: 'bold' }} component="div">
                                    {item.name}
                                </Typography>
                                <Link to={`/product/${encodeURIComponent(item.name)}`}>
                                    <img src={`${item.Img}`} alt={item.name} style={{ height: 150, width: 150 }} title="#" />
                                </Link><br/>
                                <Link to={'/cart'}>
                                    <Button onClick={() => AddToCart(item._id)} variant="contained" color="error">
                                        Add to cart
                                    </Button>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>
            <br />
            <br />

            <div>
                <Container fluid>
                    <Row className="slider-header">
                        <Col xs={12} sm={12} md={6}>
                            <h2 className="slider-title pb-16 bold">MacBook | iMac & Tablet</h2>
                        </Col>
                        <Col xs={12} sm={12} md={6}>
                            <div className="sub-links">
                                <a href="https://didongviet.vn/mac-m1" target="_blank" rel="noreferrer">Macbook Pro M1</a>
                                <a href="https://didongviet.vn/mac-m1" target="_blank" rel="noreferrer">Macbook Air M1</a>
                                <a href="https://didongviet.vn/apple-imac.html" target="_blank" rel="noreferrer">iMac</a>
                            </div>
                        </Col>
                    </Row>
                </Container>
                <Container style={{ textAlign: 'center' }} className={style.MyStyle}>
                    <Row>
                        {products.filter((item) => item.type === 'iPad').map((item) => (
                            <Col key={item.id} xs={6} sm={6} md={4}>
                                <Typography gutterBottom variant="h5" style={{ fontWeight: 'bold' }} component="div">
                                    {item.name}
                                </Typography>
                                <Link to={`/product/${encodeURIComponent(item.name)}`}>
                                    <img src={`${item.Img}`} alt={item.name} style={{ height: 150, width: 150 }} title="#" />
                                </Link>
                                <p style={{ color: 'red', fontFamily: 'Roboto' }}>{item.price}$</p>
                                <Link to={'/cart'}>
                                    <Button onClick={() => AddToCart(item._id)} variant="contained" color="error">
                                        Add to cart
                                    </Button>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>
            <br />
            <br />

            <div>
                <Container fluid>
                    <Row className="slider-header">
                        <Col xs={12} sm={12} md={6}>
                            <h2 className="slider-title pb-16 bold">Đồng hồ thông minh</h2>
                        </Col>
                        <Col xs={12} sm={12} md={6}>
                            <div className="sub-links">
                                <a href="https://didongviet.vn/dong-ho-apple-watch.html" target="_blank" rel="noreferrer">
                                    Apple Watch
                                </a>
                                <a href=" https://didongviet.vn/dong-ho-thong-minh-huawei.html " target="_blank" rel="noreferrer">
                                    Đồng hồ Huawei
                                </a>
                                <a href="https://didongviet.vn/galaxy-watch-5.html" target="_blank" rel="noreferrer">
                                    Galaxy Watch 5
                                </a>
                            </div>
                        </Col>
                    </Row>
                </Container>
                <Container style={{ textAlign: 'center' }} className={style.MyStyle}>
                    <Row>
                        {products.filter((item) => item.type === 'dongho').map((item) => (
                            <Col key={item.id} xs={6} sm={6} md={4}>
                                <Typography gutterBottom variant="h5" style={{ fontWeight: 'bold' }} component="div">
                                    {item.name}
                                </Typography>
                                <Link to={`/product/${encodeURIComponent(item.name)}`}>
                                    <img src={`${item.Img}`} alt={item.name} style={{ height: 150, width: 150 }} title="#" />
                                </Link>
                                <p style={{ color: 'red', fontFamily: 'Roboto' }}>{item.price}$</p>
                                <Link to={'/cart'}>
                                    <Button onClick={() => AddToCart(item._id)} variant="contained" color="error">
                                        Add to cart
                                    </Button>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>
        </div>
    );
}

export default Home;
