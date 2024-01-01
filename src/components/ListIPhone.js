/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import useAuth from '../useAuth';
import axios from "axios";
function ListIPhone() {
    const isAuth = useAuth();
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
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
        fetchProducts();
        setLoading(false);
    }, [isAuth]);
    if (loading) {
        return null;
    }
    return (
        <Container sx={{ py: 8 }} maxWidth="md">
            <Grid container spacing={4}>
                {products.filter((item) => item.type === 'iPhone').map((item) => (
                    <Grid item key={item} xs={4} sm={6} md={4}>
                        <Link style={{ textDecoration: 'none' }} to={`/product/${encodeURIComponent(item.name)}`}>
                            <Card
                                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                            >
                                <CardMedia
                                    component="img"
                                    image={item.Img}
                                    alt="random"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {item.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <div className="box-price-product">
                                            <div className="price-box price-final_price">
                                                <span className="price-container price-final_price tax weee">
                                                    <span className="price-wrapper">
                                                        <span className="price">{item.price}&nbsp;₫</span>
                                                    </span>
                                                </span>
                                            </div><br />
                                            <span className="title">Tặng thêm đến <strong>2 triệu</strong> khi Thu cũ đổi mới. Giảm thêm <strong>800.000đ</strong> khi mở thẻ TPBank</span>
                                        </div>
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}
export default ListIPhone;