import React from 'react';
import { useLocation } from 'react-router-dom';

function Products() {
  const location = useLocation();
  const searchKeyword = location.state?.searchKeyword;
  const products = location.state?.products || [];

  return (
    <div>
      {searchKeyword && <h2>Kết quả tìm kiếm cho: {searchKeyword}</h2>}
      {products.length > 0 ? (
        products.map(product => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
          </div>
        ))
      ) : (
        <p>Không tìm thấy sản phẩm</p>
      )}
    </div>
  );
}

export default Products;
