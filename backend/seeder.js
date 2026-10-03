const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'root',
    database: process.env.DB_NAME || 'nexcart',
});

const importData = async () => {
    try {
        console.log('Starting seed process...');
        
        // Clear existing data (in correct order to respect foreign keys)
        await pool.query('DELETE FROM order_items');
        await pool.query('DELETE FROM orders');
        await pool.query('DELETE FROM cart_items');
        await pool.query('DELETE FROM cart');
        await pool.query('DELETE FROM reviews');
        await pool.query('DELETE FROM product_images');
        await pool.query('DELETE FROM products');
        await pool.query('DELETE FROM categories');
        await pool.query('DELETE FROM users');

        // Insert Admin User
        const salt = await bcrypt.genSalt(10);
        const adminPass = await bcrypt.hash('admin123', salt);
        const [adminResult] = await pool.query(
            `INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)`,
            ['Admin', 'User', 'admin@nexcart.ai', adminPass, 'admin']
        );
        const adminId = adminResult.insertId;

        // Insert Categories
        const categories = [
            { name: 'Electronics', slug: 'electronics', desc: 'Latest gadgets and devices' },
            { name: 'Fashion', slug: 'fashion', desc: 'Trendy clothing and accessories' },
            { name: 'Home & Kitchen', slug: 'home-kitchen', desc: 'Appliances and home decor' },
            { name: 'Sports', slug: 'sports', desc: 'Sports equipment and gear' },
            { name: 'Books', slug: 'books', desc: 'Books, magazines and more' }
        ];

        const catIds = {};
        for (const cat of categories) {
            const [res] = await pool.query(
                'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)',
                [cat.name, cat.slug, cat.desc]
            );
            catIds[cat.name] = res.insertId;
        }

        // Insert 30 Products
        const products = [];
        for (let i = 1; i <= 30; i++) {
            const categoryName = Object.keys(catIds)[i % 5];
            const categoryId = catIds[categoryName];
            products.push({
                name: `${categoryName} Product ${i}`,
                slug: `${categoryName.toLowerCase().replace('&', '').replace(' ', '-')}-product-${i}`,
                description: `This is a high-quality ${categoryName} product designed to provide excellent value. Experience the best in class features and durability.`,
                category_id: categoryId,
                brand: `Brand${(i % 5) + 1}`,
                price: (Math.random() * 500 + 10).toFixed(2),
                stock: Math.floor(Math.random() * 100),
                rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3.0 and 5.0
                num_reviews: Math.floor(Math.random() * 50),
                is_featured: i % 4 === 0 // every 4th product is featured
            });
        }

        for (const p of products) {
            await pool.query(
                `INSERT INTO products (name, slug, description, category_id, brand, price, stock, rating, num_reviews, is_featured) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [p.name, p.slug, p.description, p.category_id, p.brand, p.price, p.stock, p.rating, p.num_reviews, p.is_featured]
            );
        }

        console.log('Data Imported successfully!');
        process.exit();
    } catch (error) {
        console.error('Error with import data', error);
        process.exit(1);
    }
};

importData();
