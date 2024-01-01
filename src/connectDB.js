require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const expressSession = require('express-session');
// const crypto = require('crypto-js');

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
    expressSession({
      secret: 'sakld@@(#@___@!++@)10kjsdlas*O@&@__@#@!!@sdasdhasL23789',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: true },
    })
  );

// Kết nối tới MongoDB Atlas
const uri = process.env.MONGODB_URI;
const dbName1 = process.env.MONGODB_DBNAME;
const dbName2 = process.env.MONGODB_SECOND;

// Kết nối tới cơ sở dữ liệu user
const connectDB1 = async () => {
    try {
        await mongoose.createConnection(uri + dbName1, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log(`Đã kết nối tới cơ sở dữ liệu: ${dbName1}`);
        const Session = require('./models/session');
        function generateUniqueSessionId() {
            // Tạo sessionId duy nhất, ví dụ: sử dụng thời gian hiện tại và một chuỗi ngẫu nhiên
            const timestamp = Date.now().toString();
            const randomString = Math.random().toString(36).substring(2, 8);
            const sessionId = timestamp + '-' + randomString;
            return sessionId;
        }
        // Hàm tạo phiên làm việc mới và lưu trữ userId trong MongoDB
        async function createSession(userId) {
            const sessionId = generateUniqueSessionId();
            const session = new Session({ sessionId, userId });
            await session.save();
            return sessionId;
        }
        const User = require('./models/user');
        app.post('/register', async (req, res) => {
            try {
                const { name, email, password } = req.body;

                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    return res.status(400).json({ message: 'Email đã được sử dụng' });
                }
                const hashedPassword = await bcrypt.hash(password, 10);
                const user = new User({ name, email, password: hashedPassword });
                await user.save();
                res.status(201).json({ message: 'Đăng ký thành công' });
            } catch (error) {
                console.error('Lỗi khi đăng ký:', error);
                res.status(500).json({ message: 'Lỗi server' });
            }
        });
        app.post('/login', async (req, res) => {
            try {
                const { email, password } = req.body;

                // Kiểm tra thông tin đăng nhập
                const user = await User.findOne({ email });
                if (!user) {
                    return res.status(401).json({ message: 'Email không tồn tại' });
                }

                const passwordMatch = await bcrypt.compare(password, user.password);
                if (!passwordMatch) {
                    return res.status(401).json({ message: 'Mật khẩu không đúng' });
                }

                const userId = user._id;
                const sessionId = createSession(userId);
                res.status(200).json({ message: 'Đăng nhập thành công', sessionId });

            } catch (error) {
                console.error('Lỗi khi xác thực đăng nhập:', error);
                res.status(500).json({ message: 'Lỗi server' });
            }
        });
        app.get('/cart', async (req, res) => {
            // Kiểm tra xem người dùng đã đăng nhập chưa
            if (req.session && req.session.userId) {
              const userId = req.session.userId;
              // Truy vấn cơ sở dữ liệu để lấy thông tin giỏ hàng của người dùng
              const cart = await Cart.findOne({ userId });          
              res.json({ cart });
            } else {
              // Nếu chưa đăng nhập, trả về thông tin giỏ hàng trong phiên làm việc
              res.json({ cart: req.session.cart || [] });
            }
          });
    } catch (error) {
        console.error(`Lỗi kết nối tới cơ sở dữ liệu ${dbName1}: ${error}`);
    }
};
connectDB1();
// Kết nối tới cơ sở dữ liệu test
const connectDB2 = async () => {
    try {
        await mongoose.connect(uri + dbName2, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log(`Đã kết nối tới cơ sở dữ liệu: ${dbName2}`);
    } catch (error) {
        console.error(`Lỗi kết nối tới cơ sở dữ liệu ${dbName2}: ${error}`);
    }
};
connectDB2();
const Product = require('./models/products');
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});
const Cart = require('./models/cart');
const Session = require('./models/session');
app.post('/carts/items', async (req, res) => {
    const { _id, sessionId } = req.body;

    // Kiểm tra _id và sessionId có tồn tại hay không
    if (typeof _id === 'undefined') {
        return res.status(400).json({ error: 'Invalid _id' });
    }

    try {
        const product = await Product.findById(_id);

        // Kiểm tra sản phẩm có tồn tại hay không
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }
        const session = await Session.findOne(sessionId);
        const userId = session && session.userId;
        const cart = await Cart.findOne({ userId });

        if (cart && cart.items) {
            const existingItem = cart.items.find(item => item.name === product.name);
            if (existingItem) {
                return res.status(409).json({ message: 'Sản phẩm đã có trong giỏ hàng' });
            } else {
                // Tạo một object mới cho sản phẩm khác trong giỏ hàng
                const newItem = {
                    product: _id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    Img: product.Img,
                    type: product.type
                };
                await Cart.updateOne({ userId }, { $push: { items: newItem } }); // 
            }
        } else {
            // Nếu giỏ hàng không tồn tại, tạo giỏ hàng mới và thêm mục sản phẩm
            const newCart = new Cart({
                userId: userId,
                items: [{
                    product: _id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    Img: product.Img,
                    type: product.type
                }]
            });
            await newCart.save();
        }
        res.json({ message: 'Thêm sản phẩm vào giỏ hàng thành công' });
    } catch (error) {
        console.error('Lỗi add to cart:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});
app.post('/cart/updateQuantity', async (req, res) => {
    const { _id, quantity } = req.body;
    try {
        // Nếu số lượng sản phẩm xuống 0, thực hiện xóa sản phẩm khỏi giỏ hàng
        if (parseInt(quantity) === 0) {
            const cart = await Cart.findOneAndUpdate(
                { 'items._id': _id },
                { $pull: { items: { _id } } },
                { new: true }
            );
            res.json({ message: 'Sản phẩm đã được xóa khỏi giỏ hàng', cart });
        } else {
            // Nếu số lượng sản phẩm khác 0, cập nhật số lượng sản phẩm trong giỏ hàng
            const cart = await Cart.findOneAndUpdate(
                { 'items._id': _id },
                { $set: { 'items.$.quantity': quantity } },
                { new: true }
            );
            const updatedItem = cart.items.find(item => item._id.toString() === _id);
            res.json({ updatedItem });
        }
    } catch (error) {
        console.error('Lỗi update quantity:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});
app.get('/cart', async (req, res) => {
    try {
        const cart = await Cart.findOne();
        if (!cart) {
            return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
        }
        res.status(200).json({ cart });
    } catch (error) {
        console.error('Không có sản phẩm trong giỏ hàng:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

app.delete('/cart/delete', async (req, res) => {
    const { productId } = req.body;
    try {
        const cart = await Cart.findOne();
        // Tìm đối tượng sản phẩm cần xóa trong mảng items
        const itemIndex = cart.items.filter(item => item.product && item.product.toString() === String(productId));
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
        }

        // Xóa 1 object sản phẩm từ mảng items
        cart.items.splice(itemIndex, 1);
        // Nếu không còn sản phẩm nào trong giỏ hàng
        if (cart.items.length === 0) {
            await Cart.deleteOne({ _id: cart._id }); // Xóa items
        } else {
            await cart.save();
        }
        res.json({ message: 'Xóa sản phẩm thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});


const Order = require('./models/order')
app.post('/purchase', async (req, res) => {
    const { name, sessionId } = req.body;

    try {
        // Kiểm tra người dùng đã đăng nhập bằng sessionId
        const session = await Session.findOne(sessionId);
        const userId = session.userId;
        // Tìm giỏ hàng 
        const cart = await Cart.findOne({ userId });
        console.log(userId)
        if (!cart) {
            return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
        }

        // Tạo đơn hàng mới từ thông tin giỏ hàng
        const NewOrder = new Order({
            userId: userId,
            items: cart.items,
            total: cart.items.reduce((total, item) => total + item.price * item.quantity, 0)
        });
        await NewOrder.save();
        // Xóa giỏ hàng sau khi đã tạo đơn hàng thành công
        await Cart.findOneAndDelete({ userId });
        // Cập nhật số lượng tồn của từng sản phẩm trong giỏ hàng
        for (const item of cart.items) {
            const product = await Product.findOne({ name: item.name });
            // res.json(product);
            if (product) {
                product.quantity -= item.quantity;
                await product.save();
            }
        }
        // Trả về thông tin đơn hàng đã tạo
        res.status(200).json({ message: 'Đặt hàng thành công', Order });
    } catch (error) {
        console.error('Lỗi khi đặt hàng:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

app.get('/products/find', (req, res) => {
    const keyword = req.query.keyword;
    Product.find({ name: { $regex: keyword, $options: 'iph', $options: 'i', $options: 'A', $options: 'H', $options: 'V'  } })
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        console.log('Error retrieving products:', error);
        res.status(500).json({ error: 'Failed to retrieve products' });
      });
  });

app.listen(5050, () => {
    console.log('Server đã khởi động');
});