import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
function Details() {
    let { name } = useParams();
    const [products, setProducts] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5050/products`)
            .then(response => response.json())
            .then(data => {
                const showProduct = data.find(item => item.name === name);
                setProducts(showProduct);
            })
            .catch(error => {
                console.error(error);
                setProducts(null);
            });
    }, [name]);
    
    if (!products) {
        return <div>Loading...</div>;
    }
    const AddToCart = async (productId) => {
        try {
            const response = await axios.post('http://localhost:5050/carts/items', { _id: productId });
            console.log(response.data.message); // In ra thông báo thành công
        } catch (error) {
            console.error('Lỗi add to cart:', error);
        }
    };
    return (
        <div className="container">
            <div className="row">
                <div className="card mt-5 mb-5 w-100">
                    <div className="card-body">
                        <div className='row'>
                            <div className='col-5'>
                                <img src={products.Img} width="400px" alt="" />
                            </div>
                            <div className='col-7 text-left'>
                                <h2>{products.name}</h2>
                                <h4 className='text-danger'>{products.price}$</h4>
                                <Button onClick={() => AddToCart(products._id)} title="Add To Cart" variant="contained" color="error">
                                    <span>Add To Cart</span>
                                </Button><br />
                                <Link to='/Home' >Back to Home</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Details;
