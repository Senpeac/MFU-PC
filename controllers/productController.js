const Product = require('../models/Product');

/**
 * Fetch products with optional filters for search, category, brand and price range.
 */
exports.getProducts = async (req, res) => {
  try {
    const { search, category, brand, minPrice, maxPrice, limit } = req.query;
    const query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    if (brand) {
      query.brand = brand;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let dbQuery = Product.find(query).sort('-createdAt');

    if (limit) {
      dbQuery = dbQuery.limit(Number(limit));
    }

    const products = await dbQuery;
    return res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    return res.status(500).json({ message: 'Server error fetching products' });
  }
};

/**
 * Fetch a single product by its ID.
 */
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    return res.status(500).json({ message: 'Server error fetching product' });
  }
};

/**
 * Create a new product (admin only).
 */
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, brand, imageUrl } = req.body;

    if (!name || !description || price === undefined || stock === undefined || !category) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลสินค้าให้ครบถ้วน' });
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      brand,
      imageUrl,
    });
    return res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    console.error('Create product error:', error);
    return res.status(500).json({ message: 'Server error creating product' });
  }
};

/**
 * Update product data by ID (admin only).
 */
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json({ message: 'Product updated', product });
  } catch (error) {
    console.error('Update product error:', error);
    return res.status(500).json({ message: 'Server error updating product' });
  }
};

/**
 * Delete a product by ID (admin only).
 */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    return res.status(500).json({ message: 'Server error deleting product' });
  }
};
