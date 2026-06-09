const bcrypt = require('bcryptjs');
const { initializeDatabase, pool, getDb } = require('./config/db');
require('dotenv').config();

const seed = async () => {
  try {
    console.log('🌱 Starting database seed for SQLite...\n');

    // Initialize tables
    await initializeDatabase();

    // Clear existing data
    await pool.query('DELETE FROM chat_history');
    await pool.query('DELETE FROM products');
    await pool.query('DELETE FROM categories');
    await pool.query('DELETE FROM users');

    // Reset auto-increment in SQLite
    const db = await getDb();
    await db.run("DELETE FROM sqlite_sequence WHERE name='chat_history'");
    await db.run("DELETE FROM sqlite_sequence WHERE name='products'");
    await db.run("DELETE FROM sqlite_sequence WHERE name='categories'");
    await db.run("DELETE FROM sqlite_sequence WHERE name='users'");

    console.log('✅ Cleared existing data\n');

    // ─── USERS ────────────────────────────────────────
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Admin User', 'admin@example.com', adminPassword, 'admin']
    );
    await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['John Doe', 'user@example.com', userPassword, 'user']
    );

    console.log('✅ Created users:');
    console.log('   Admin: admin@example.com / admin123');
    console.log('   User:  user@example.com / user123\n');

    // ─── CATEGORIES ───────────────────────────────────
    const categories = [
      { name: 'Laptops', description: 'Notebooks and ultrabooks for work, gaming, and creativity', image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400' },
      { name: 'Smartphones', description: 'Latest mobile phones with cutting-edge features', image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400' },
      { name: 'Headphones', description: 'Wireless and wired headphones for music and calls', image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
      { name: 'Tablets', description: 'Portable tablets for entertainment and productivity', image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400' },
      { name: 'Cameras', description: 'Digital cameras for photography enthusiasts', image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400' },
      { name: 'Smartwatches', description: 'Wearable tech for fitness and connectivity', image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' },
    ];

    for (const cat of categories) {
      await pool.query(
        'INSERT INTO categories (name, description, image_url) VALUES (?, ?, ?)',
        [cat.name, cat.description, cat.image_url]
      );
    }
    console.log(`✅ Created ${categories.length} categories\n`);

    // ─── PRODUCTS ─────────────────────────────────────
    const products = [
      // LAPTOPS (category_id: 1)
      {
        name: 'Dell Inspiron 15 5530',
        description: 'Powerful laptop for everyday computing with 13th Gen Intel Core i5, perfect for students and professionals. Features a vibrant 15.6" FHD display and long battery life.',
        price: 54990,
        category_id: 1,
        image_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400',
        specifications: { processor: 'Intel Core i5-1335U', ram: '8GB DDR5', storage: '512GB SSD', display: '15.6" FHD', battery: '54Wh', os: 'Windows 11', weight: '1.65 kg' },
        rating: 4.2,
        stock: 25,
        brand: 'Dell',
      },
      {
        name: 'HP Pavilion 14 (2024)',
        description: 'Sleek and portable laptop with AMD Ryzen 5, ideal for office work and entertainment. Ultra-thin design with premium build quality.',
        price: 49990,
        category_id: 1,
        image_url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400',
        specifications: { processor: 'AMD Ryzen 5 7530U', ram: '16GB DDR4', storage: '512GB SSD', display: '14" FHD IPS', battery: '43Wh', os: 'Windows 11', weight: '1.41 kg' },
        rating: 4.3,
        stock: 18,
        brand: 'HP',
      },
      {
        name: 'Lenovo IdeaPad Gaming 3',
        description: 'Budget gaming laptop with dedicated NVIDIA graphics, designed for gamers who want performance without breaking the bank.',
        price: 62990,
        category_id: 1,
        image_url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
        specifications: { processor: 'AMD Ryzen 5 6600H', ram: '16GB DDR5', storage: '512GB SSD', display: '15.6" FHD 120Hz', gpu: 'NVIDIA RTX 3050 4GB', battery: '45Wh', weight: '2.32 kg' },
        rating: 4.1,
        stock: 12,
        brand: 'Lenovo',
      },
      {
        name: 'ASUS VivoBook 15 OLED',
        description: 'Stunning OLED display laptop for creative professionals and content consumers. Vivid colors and deep blacks for an immersive experience.',
        price: 57990,
        category_id: 1,
        image_url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
        specifications: { processor: 'Intel Core i5-1340P', ram: '16GB DDR4', storage: '512GB SSD', display: '15.6" FHD OLED', battery: '50Wh', os: 'Windows 11', weight: '1.7 kg' },
        rating: 4.5,
        stock: 15,
        brand: 'ASUS',
      },
      {
        name: 'Apple MacBook Air M2',
        description: 'Ultra-thin and powerful laptop with Apple M2 chip. Exceptional battery life, stunning Liquid Retina display, and silent fanless design.',
        price: 99900,
        category_id: 1,
        image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
        specifications: { processor: 'Apple M2 (8-core)', ram: '8GB Unified', storage: '256GB SSD', display: '13.6" Liquid Retina', battery: '18 hours', os: 'macOS', weight: '1.24 kg' },
        rating: 4.7,
        stock: 20,
        brand: 'Apple',
      },

      // SMARTPHONES (category_id: 2)
      {
        name: 'Samsung Galaxy S24',
        description: 'Flagship smartphone with Galaxy AI features, pro-grade camera system, and all-day battery. Experience the future of mobile AI.',
        price: 74999,
        category_id: 2,
        image_url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
        specifications: { processor: 'Snapdragon 8 Gen 3', ram: '8GB', storage: '256GB', display: '6.2" Dynamic AMOLED 2X 120Hz', camera: '50MP + 12MP + 10MP', battery: '4000mAh', os: 'Android 14' },
        rating: 4.5,
        stock: 30,
        brand: 'Samsung',
      },
      {
        name: 'iPhone 15',
        description: 'Apple\'s latest with Dynamic Island, 48MP camera, and USB-C. Ceramic Shield front, aerospace-grade aluminum design.',
        price: 69900,
        category_id: 2,
        image_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
        specifications: { processor: 'A16 Bionic', ram: '6GB', storage: '128GB', display: '6.1" Super Retina XDR', camera: '48MP + 12MP', battery: '3877mAh', os: 'iOS 17' },
        rating: 4.6,
        stock: 35,
        brand: 'Apple',
      },
      {
        name: 'OnePlus 12',
        description: 'Performance powerhouse with Hasselblad camera system, 100W SUPERVOOC charging, and buttery smooth display.',
        price: 64999,
        category_id: 2,
        image_url: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400',
        specifications: { processor: 'Snapdragon 8 Gen 3', ram: '12GB', storage: '256GB', display: '6.82" LTPO AMOLED 120Hz', camera: '50MP + 64MP + 48MP', battery: '5400mAh', os: 'Android 14 OxygenOS' },
        rating: 4.4,
        stock: 22,
        brand: 'OnePlus',
      },
      {
        name: 'Xiaomi 14',
        description: 'Leica-powered photography beast with Snapdragon 8 Gen 3. Compact flagship with professional camera capabilities.',
        price: 49999,
        category_id: 2,
        image_url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400',
        specifications: { processor: 'Snapdragon 8 Gen 3', ram: '12GB', storage: '256GB', display: '6.36" LTPO AMOLED 120Hz', camera: '50MP Leica + 50MP + 50MP', battery: '4610mAh', os: 'Android 14 HyperOS' },
        rating: 4.3,
        stock: 28,
        brand: 'Xiaomi',
      },
      {
        name: 'Nothing Phone (2)',
        description: 'Unique Glyph Interface with customizable LED lights. Clean software experience with powerful performance.',
        price: 37999,
        category_id: 2,
        image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        specifications: { processor: 'Snapdragon 8+ Gen 1', ram: '8GB', storage: '128GB', display: '6.7" OLED LTPO 120Hz', camera: '50MP + 50MP', battery: '4700mAh', os: 'Android 14 Nothing OS' },
        rating: 4.2,
        stock: 15,
        brand: 'Nothing',
      },

      // HEADPHONES (category_id: 3)
      {
        name: 'Sony WH-1000XM5',
        description: 'Industry-leading noise cancellation with exceptional sound quality. 30-hour battery life and premium comfort for all-day listening.',
        price: 26990,
        category_id: 3,
        image_url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400',
        specifications: { type: 'Over-Ear Wireless', driver: '30mm', noise_cancellation: 'Active (Industry Leading)', battery: '30 hours', bluetooth: '5.2', weight: '250g', features: 'Multipoint, LDAC, Speak-to-Chat' },
        rating: 4.7,
        stock: 40,
        brand: 'Sony',
      },
      {
        name: 'Apple AirPods Pro (2nd Gen)',
        description: 'Adaptive Audio with personalized spatial audio. USB-C charging, IP54 water resistance, and up to 6 hours listening.',
        price: 24900,
        category_id: 3,
        image_url: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400',
        specifications: { type: 'In-Ear True Wireless', driver: 'Custom Apple', noise_cancellation: 'Active + Adaptive Transparency', battery: '6 hours (30 with case)', bluetooth: '5.3', weight: '5.3g per bud', features: 'Spatial Audio, Find My, USB-C' },
        rating: 4.6,
        stock: 50,
        brand: 'Apple',
      },
      {
        name: 'JBL Tune 770NC',
        description: 'Affordable noise cancelling headphones with JBL Pure Bass sound. Lightweight design, foldable, and multi-point connection.',
        price: 4999,
        category_id: 3,
        image_url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
        specifications: { type: 'Over-Ear Wireless', driver: '40mm', noise_cancellation: 'Active', battery: '44 hours', bluetooth: '5.3', weight: '252g', features: 'JBL Pure Bass, Foldable, Multipoint' },
        rating: 4.1,
        stock: 60,
        brand: 'JBL',
      },
      {
        name: 'boAt Rockerz 551ANC',
        description: 'Budget-friendly ANC headphones with powerful 40mm drivers. Made in India, with up to 100 hours playback without ANC.',
        price: 2499,
        category_id: 3,
        image_url: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=400',
        specifications: { type: 'Over-Ear Wireless', driver: '40mm', noise_cancellation: 'Active (Hybrid)', battery: '40 hours (ANC) / 100 hours', bluetooth: '5.2', weight: '260g', features: 'Dual EQ Modes, ENx Mic, Foldable' },
        rating: 3.9,
        stock: 80,
        brand: 'boAt',
      },
      {
        name: 'Bose QuietComfort Ultra',
        description: 'World-class noise cancellation with immersive spatial audio. Premium materials and unmatched comfort for audiophiles.',
        price: 29900,
        category_id: 3,
        image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400',
        specifications: { type: 'Over-Ear Wireless', driver: 'Custom Bose', noise_cancellation: 'Active (World-Class)', battery: '24 hours', bluetooth: '5.3', weight: '250g', features: 'Immersive Audio, CustomTune, Aware Mode' },
        rating: 4.8,
        stock: 15,
        brand: 'Bose',
      },

      // TABLETS (category_id: 4)
      {
        name: 'Apple iPad (10th Gen)',
        description: 'Versatile tablet with A14 Bionic chip, 10.9" Liquid Retina display, and USB-C. Perfect for notes, entertainment, and light productivity.',
        price: 39900,
        category_id: 4,
        image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
        specifications: { processor: 'A14 Bionic', ram: '4GB', storage: '64GB', display: '10.9" Liquid Retina', camera: '12MP + 12MP Front', battery: '10 hours', os: 'iPadOS 17', weight: '477g' },
        rating: 4.4,
        stock: 25,
        brand: 'Apple',
      },
      {
        name: 'Samsung Galaxy Tab S9 FE',
        description: 'Feature-packed Android tablet with S Pen included. IP68 water resistance and vibrant 10.9" display for creativity and entertainment.',
        price: 34999,
        category_id: 4,
        image_url: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400',
        specifications: { processor: 'Exynos 1380', ram: '6GB', storage: '128GB', display: '10.9" TFT LCD', camera: '8MP + 12MP Front', battery: '8000mAh', os: 'Android 14 One UI', weight: '523g', extras: 'S Pen Included, IP68' },
        rating: 4.2,
        stock: 18,
        brand: 'Samsung',
      },
      {
        name: 'Xiaomi Pad 6',
        description: 'Value-for-money tablet with Snapdragon 870, 144Hz display, and quad speakers. Excellent for media consumption and gaming.',
        price: 24999,
        category_id: 4,
        image_url: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400',
        specifications: { processor: 'Snapdragon 870', ram: '6GB', storage: '128GB', display: '11" IPS LCD 144Hz', camera: '13MP + 8MP Front', battery: '8840mAh', os: 'Android 13 MIUI', weight: '490g' },
        rating: 4.3,
        stock: 30,
        brand: 'Xiaomi',
      },

      // CAMERAS (category_id: 5)
      {
        name: 'Canon EOS R50',
        description: 'Compact mirrorless camera perfect for content creators and beginners. 4K video, advanced autofocus, and lightweight body.',
        price: 62995,
        category_id: 5,
        image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
        specifications: { sensor: '24.2MP APS-C CMOS', video: '4K 30fps', autofocus: 'Dual Pixel CMOS AF II', iso: '100-32000', display: '3" Vari-angle Touchscreen', battery: '310 shots', weight: '375g', mount: 'Canon RF' },
        rating: 4.4,
        stock: 10,
        brand: 'Canon',
      },
      {
        name: 'Sony Alpha a6400',
        description: 'Professional-grade mirrorless with world\'s fastest autofocus. Ideal for photography enthusiasts and vloggers.',
        price: 72990,
        category_id: 5,
        image_url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400',
        specifications: { sensor: '24.2MP APS-C Exmor CMOS', video: '4K 30fps', autofocus: '425-point Phase Detection', iso: '100-32000', display: '3" Tilting Touchscreen', battery: '410 shots', weight: '403g', mount: 'Sony E-mount' },
        rating: 4.6,
        stock: 8,
        brand: 'Sony',
      },
      {
        name: 'Nikon Z50',
        description: 'Lightweight mirrorless camera with excellent image quality. Great for travel photography with weather sealing.',
        price: 68990,
        category_id: 5,
        image_url: 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=400',
        specifications: { sensor: '20.9MP APS-C CMOS', video: '4K 30fps', autofocus: '209-point Hybrid AF', iso: '100-51200', display: '3.2" Tilting Touchscreen', battery: '320 shots', weight: '395g', mount: 'Nikon Z' },
        rating: 4.3,
        stock: 12,
        brand: 'Nikon',
      },

      // SMARTWATCHES (category_id: 6)
      {
        name: 'Apple Watch Series 9',
        description: 'Most advanced Apple Watch with S9 chip, double-tap gesture, and brighter display. Comprehensive health and fitness tracking.',
        price: 41900,
        category_id: 6,
        image_url: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400',
        specifications: { display: '1.9" LTPO OLED Always-On', processor: 'S9 SiP', battery: '18 hours', water_resistance: 'WR50', sensors: 'Heart Rate, SpO2, Temperature, ECG', os: 'watchOS 10', connectivity: 'GPS + Cellular option' },
        rating: 4.6,
        stock: 20,
        brand: 'Apple',
      },
      {
        name: 'Samsung Galaxy Watch 6',
        description: 'Premium Android smartwatch with BioActive sensor, sapphire crystal display, and comprehensive health monitoring.',
        price: 26999,
        category_id: 6,
        image_url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400',
        specifications: { display: '1.5" Super AMOLED', processor: 'Exynos W930', battery: '40 hours', water_resistance: '5ATM + IP68', sensors: 'Heart Rate, SpO2, BIA, Temperature', os: 'Wear OS 4', connectivity: 'GPS + Bluetooth + LTE option' },
        rating: 4.3,
        stock: 25,
        brand: 'Samsung',
      },
      {
        name: 'Noise ColorFit Pro 5',
        description: 'Feature-rich budget smartwatch with 1.85" AMOLED display, Bluetooth calling, and 100+ sports modes. Best value in its range.',
        price: 3499,
        category_id: 6,
        image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        specifications: { display: '1.85" AMOLED', processor: 'Custom SoC', battery: '7 days', water_resistance: 'IP68', sensors: 'Heart Rate, SpO2', os: 'Noise Health Suite', connectivity: 'Bluetooth 5.3', extras: 'Bluetooth Calling, 100+ Sports' },
        rating: 4.0,
        stock: 100,
        brand: 'Noise',
      },
      {
        name: 'Amazfit GTR 4',
        description: 'Premium smartwatch with dual-band GPS, AMOLED display, and 14-day battery life. Professional-grade fitness tracking.',
        price: 14999,
        category_id: 6,
        image_url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400',
        specifications: { display: '1.43" AMOLED', processor: 'Custom SoC', battery: '14 days', water_resistance: '5ATM', sensors: 'Heart Rate, SpO2, Stress', os: 'Zepp OS', connectivity: 'Dual-band GPS + Bluetooth', extras: 'Bluetooth Calling, 150+ Sports' },
        rating: 4.2,
        stock: 35,
        brand: 'Amazfit',
      },

      // More budget smartphones
      {
        name: 'Realme 12 Pro+',
        description: 'Camera-focused mid-range phone with periscope telephoto lens. Sony IMX890 sensor for professional photography at an affordable price.',
        price: 29999,
        category_id: 2,
        image_url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400',
        specifications: { processor: 'Snapdragon 7s Gen 2', ram: '8GB', storage: '128GB', display: '6.7" AMOLED 120Hz', camera: '50MP Sony IMX890 + 8MP Periscope + 2MP', battery: '5000mAh', os: 'Android 14 Realme UI' },
        rating: 4.1,
        stock: 40,
        brand: 'Realme',
      },

      // Budget laptop
      {
        name: 'Acer Aspire Go 15',
        description: 'Most affordable laptop for basic computing, browsing, and office tasks. Great for students on a tight budget.',
        price: 29990,
        category_id: 1,
        image_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400',
        specifications: { processor: 'Intel Core i3-N305', ram: '8GB DDR5', storage: '256GB SSD', display: '15.6" FHD', battery: '8 hours', os: 'Windows 11', weight: '1.86 kg' },
        rating: 3.8,
        stock: 35,
        brand: 'Acer',
      },

      // Premium gaming laptop
      {
        name: 'MSI Katana 15',
        description: 'High-performance gaming laptop with RTX 4060 graphics. Ready for AAA gaming with 144Hz display and aggressive cooling.',
        price: 84990,
        category_id: 1,
        image_url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
        specifications: { processor: 'Intel Core i7-13620H', ram: '16GB DDR5', storage: '512GB SSD', display: '15.6" FHD 144Hz', gpu: 'NVIDIA RTX 4060 8GB', battery: '53.5Wh', weight: '2.25 kg' },
        rating: 4.3,
        stock: 8,
        brand: 'MSI',
      },
    ];

    for (const product of products) {
      await pool.query(
        `INSERT INTO products (name, description, price, category_id, image_url, specifications, rating, stock, brand) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.name,
          product.description,
          product.price,
          product.category_id,
          product.image_url,
          JSON.stringify(product.specifications),
          product.rating,
          product.stock,
          product.brand,
        ]
      );
    }

    console.log(`✅ Created ${products.length} products\n`);
    console.log('🎉 Database seeded successfully!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();
