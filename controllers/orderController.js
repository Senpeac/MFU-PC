const Order = require('../models/Order');
const Product = require('../models/Product');

/**
 * Create an order for the authenticated user.
 */
exports.createOrder = async (req, res) => {
  try {
    const { items, paymentMethod, shippingAddress } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    const productIds = items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    const orderItems = [];
    for (const item of items) {
      const product = products.find((p) => p._id.toString() === item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }
      if (item.quantity > product.stock) {
        throw new Error(`สินค้า ${product.name} มีสต็อกไม่เพียงพอ`);
      }

      product.stock -= item.quantity;
      await product.save();

      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user._id,
      products: orderItems,
      totalPrice,
      paymentMethod: paymentMethod || 'cod',
      shippingAddress: shippingAddress || req.user.address,
    });

    return res.status(201).json({ message: 'Order created', order });
  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({ message: error.message || 'Server error creating order' });
  }
};

/**
 * Fetch orders for the authenticated user (admin sees all orders via a different handler).
 */
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    return res.json(orders);
  } catch (error) {
    console.error('Get my orders error:', error);
    return res.status(500).json({ message: 'Server error fetching orders' });
  }
};

/**
 * Fetch all orders for admin dashboard.
 */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
    return res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    return res.status(500).json({ message: 'Server error fetching orders' });
  }
};

/**
 * Update order status (admin).
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status || order.status;
    const updatedOrder = await order.save();

    return res.json({ message: 'Order status updated', order: updatedOrder });
  } catch (error) {
    console.error('Update order status error:', error);
    return res.status(500).json({ message: 'Server error updating order' });
  }
};
