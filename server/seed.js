require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Promotion = require('./models/Promotion');

const IMG = {
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=70',
  burger2: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=600&q=70',
  chicken: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=70',
  chicken2: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&w=600&q=70',
  fries: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=70',
  pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=70',
  wrap: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=70',
  sandwich: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=70',
  drink: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=600&q=70',
  shake: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=70',
  dessert: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=600&q=70',
  sauce: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=600&q=70'
};

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const burgerCustom = [
  { name: 'Size', type: 'single', required: true, options: [{ label: 'Regular', price: 0 }, { label: 'Large', price: 100 }] },
  { name: 'Extras', type: 'multi', required: false, options: [
    { label: 'Extra Cheese', price: 80 }, { label: 'Extra Patty', price: 180 },
    { label: 'Extra Mayo', price: 30 }, { label: 'Extra Sauce', price: 25 }
  ]}
];
const drinkCustom = [{ name: 'Size', type: 'single', required: true, options: [{ label: 'Regular', price: 0 }, { label: 'Large', price: 60 }] }];
const friesCustom = [{ name: 'Size', type: 'single', required: true, options: [{ label: 'Regular', price: 0 }, { label: 'Large', price: 100 }] }];
const pizzaCustom = [
  { name: 'Size', type: 'single', required: true, options: [{ label: 'Medium', price: 0 }, { label: 'Large', price: 400 }] },
  { name: 'Extras', type: 'multi', required: false, options: [{ label: 'Extra Cheese', price: 150 }] }
];

const run = async () => {
  await connectDB();
  await Promise.all([User.deleteMany({}), Category.deleteMany({}), Product.deleteMany({}), Promotion.deleteMany({})]);

  const hash = (p) => bcrypt.hashSync(p, 10);
  await User.create([
    { name: 'NUST Café Admin', email: 'admin@nustcafe.pk', phone: '03000000001', password: hash('admin123'), role: 'admin' },
    { name: 'Kitchen Staff', email: 'kitchen@nustcafe.pk', phone: '03000000002', password: hash('kitchen123'), role: 'kitchen' },
    { name: 'Delivery Rider', email: 'delivery@nustcafe.pk', phone: '03000000003', password: hash('delivery123'), role: 'delivery' },
    { name: 'Pickup Desk', email: 'pickup@nustcafe.pk', phone: '03000000004', password: hash('pickup123'), role: 'pickup' },
    { name: 'Demo Customer', email: 'customer@nustcafe.pk', phone: '03000000005', password: hash('customer123'), role: 'customer' }
  ]);

  const catNames = ['Burgers', 'Fried Chicken', 'Buckets & Sharing', 'Combo Meals', 'Fries & Sides',
    'Snacks', 'Wraps & Sandwiches', 'Pizza', 'Beverages', 'Desserts', 'Sauces & Extras'];
  const cats = {};
  for (let i = 0; i < catNames.length; i++) {
    const c = await Category.create({ name: catNames[i], slug: slugify(catNames[i]), displayOrder: i + 1 });
    cats[catNames[i]] = c._id;
  }

  const list = [
    // Burgers
    { name: 'Zinger Burger', cat: 'Burgers', price: 550, image: IMG.burger, desc: 'Crispy chicken fillet, lettuce and mayo in a toasted bun.', f: { isFeatured: true, isBestseller: true }, c: burgerCustom },
    { name: 'Crispy Chicken Burger', cat: 'Burgers', price: 500, image: IMG.burger2, desc: 'Golden crispy chicken with fresh veggies.', c: burgerCustom },
    { name: 'Spicy Chicken Burger', cat: 'Burgers', price: 520, image: IMG.burger, desc: 'Spicy fillet with hot sauce and jalapeños.', c: burgerCustom },
    { name: 'Classic Chicken Burger', cat: 'Burgers', price: 450, image: IMG.burger2, desc: 'The timeless chicken burger.', c: burgerCustom },
    { name: 'Double Chicken Burger', cat: 'Burgers', price: 750, image: IMG.burger, desc: 'Two crispy fillets for the truly hungry.', f: { isBestseller: true }, c: burgerCustom },
    { name: 'Beef Burger', cat: 'Burgers', price: 600, image: IMG.burger2, desc: 'Juicy grilled beef patty with fresh toppings.', c: burgerCustom },
    { name: 'Double Beef Burger', cat: 'Burgers', price: 850, image: IMG.burger, desc: 'Double beef, double flavour.', c: burgerCustom },
    { name: 'Cheese Burger', cat: 'Burgers', price: 650, image: IMG.burger2, desc: 'Loaded with melted cheddar.', f: { isFeatured: true }, c: burgerCustom },
    { name: 'BBQ Burger', cat: 'Burgers', price: 700, image: IMG.burger, desc: 'Smoky BBQ sauce and crispy onions.', c: burgerCustom },
    { name: 'Grilled Chicken Burger', cat: 'Burgers', price: 580, image: IMG.burger2, desc: 'Flame-grilled chicken fillet.', c: burgerCustom },

    // Fried Chicken
    { name: 'Hot & Crispy Chicken (2 pcs)', cat: 'Fried Chicken', price: 480, image: IMG.chicken, desc: 'Two pieces of signature hot & crispy chicken.', f: { isBestseller: true } },
    { name: 'Spicy Fried Chicken (2 pcs)', cat: 'Fried Chicken', price: 500, image: IMG.chicken2, desc: 'Extra heat, extra crunch.' },
    { name: 'Chicken Drumsticks (4 pcs)', cat: 'Fried Chicken', price: 520, image: IMG.chicken, desc: 'Juicy drumsticks fried to perfection.' },
    { name: 'Chicken Wings (6 pcs)', cat: 'Fried Chicken', price: 450, image: IMG.chicken2, desc: 'Six saucy wings.', f: { isFeatured: true } },
    { name: 'Chicken Tenders (5 pcs)', cat: 'Fried Chicken', price: 550, image: IMG.chicken, desc: 'Boneless tenders with dip.' },
    { name: 'Chicken Nuggets (8 pcs)', cat: 'Fried Chicken', price: 350, image: IMG.chicken2, desc: 'Bite-sized nuggets, golden and crisp.' },

    // Buckets
    { name: '8-Piece Chicken Bucket', cat: 'Buckets & Sharing', price: 2200, image: IMG.chicken, desc: 'Eight pieces of hot & crispy chicken to share.', f: { isFeatured: true } },
    { name: '12-Piece Family Bucket', cat: 'Buckets & Sharing', price: 3200, image: IMG.chicken2, desc: 'The complete family feast.' },
    { name: 'Wings Bucket', cat: 'Buckets & Sharing', price: 1500, image: IMG.chicken, desc: 'A bucket full of our best wings.' },
    { name: 'Mixed Chicken Bucket', cat: 'Buckets & Sharing', price: 2500, image: IMG.chicken2, desc: 'A mix of drumsticks, wings and tenders.' },

    // Combos
    { name: 'Zinger Burger Meal', cat: 'Combo Meals', price: 850, image: IMG.burger, desc: 'Zinger burger, fries and a drink.', f: { isBestseller: true, isFeatured: true } },
    { name: 'Chicken Pieces Meal', cat: 'Combo Meals', price: 900, image: IMG.chicken, desc: 'Two pieces of chicken with fries and drink.' },
    { name: 'Nuggets Meal', cat: 'Combo Meals', price: 700, image: IMG.chicken2, desc: 'Eight nuggets, fries and a drink.' },
    { name: 'Student Deal', cat: 'Combo Meals', price: 550, image: IMG.burger2, desc: 'Burger, fries and drink — student-friendly price.', f: { isFeatured: true } },

    // Fries & Sides
    { name: 'Regular Fries', cat: 'Fries & Sides', price: 250, image: IMG.fries, desc: 'Golden, crispy and perfectly salted.', f: { isBestseller: true }, c: friesCustom },
    { name: 'Large Fries', cat: 'Fries & Sides', price: 350, image: IMG.fries, desc: 'Bigger portion of our signature fries.', c: friesCustom },
    { name: 'Loaded Cheese Fries', cat: 'Fries & Sides', price: 450, image: IMG.fries, desc: 'Fries smothered in cheese sauce.', f: { isFeatured: true }, c: friesCustom },
    { name: 'Masala Fries', cat: 'Fries & Sides', price: 300, image: IMG.fries, desc: 'Fries tossed in desi masala.', c: friesCustom },
    { name: 'Onion Rings', cat: 'Fries & Sides', price: 300, image: IMG.fries, desc: 'Crispy battered onion rings.' },

    // Snacks
    { name: 'Chicken Popcorn', cat: 'Snacks', price: 350, image: IMG.chicken2, desc: 'Bite-sized crispy chicken popcorn.' },
    { name: 'Dynamite Chicken', cat: 'Snacks', price: 550, image: IMG.chicken, desc: 'Chicken tossed in creamy dynamite sauce.', f: { isFeatured: true } },
    { name: 'Chicken Cheese Balls (6)', cat: 'Snacks', price: 400, image: IMG.chicken2, desc: 'Cheesy, crispy and irresistible.' },

    // Wraps & Sandwiches
    { name: 'Zinger Wrap', cat: 'Wraps & Sandwiches', price: 480, image: IMG.wrap, desc: 'Crispy zinger fillet wrapped with fresh veggies.', f: { isBestseller: true } },
    { name: 'Chicken Shawarma', cat: 'Wraps & Sandwiches', price: 350, image: IMG.wrap, desc: 'Classic chicken shawarma with garlic sauce.' },
    { name: 'Club Sandwich', cat: 'Wraps & Sandwiches', price: 500, image: IMG.sandwich, desc: 'Triple-decker club with chicken and egg.' },

    // Pizza
    { name: 'Chicken Tikka Pizza', cat: 'Pizza', price: 1200, image: IMG.pizza, desc: 'Desi tikka flavours on a cheesy base.', f: { isFeatured: true }, c: pizzaCustom },
    { name: 'Chicken Fajita Pizza', cat: 'Pizza', price: 1250, image: IMG.pizza, desc: 'Peppers, onions and seasoned chicken.', c: pizzaCustom },
    { name: 'Special NUST Pizza', cat: 'Pizza', price: 1500, image: IMG.pizza, desc: 'The house special with a loaded topping.', c: pizzaCustom },

    // Beverages
    { name: 'Coca-Cola (Regular)', cat: 'Beverages', price: 150, image: IMG.drink, desc: 'Chilled 500ml bottle.', c: drinkCustom },
    { name: 'Pepsi (Regular)', cat: 'Beverages', price: 150, image: IMG.drink, desc: 'Chilled 500ml bottle.', c: drinkCustom },
    { name: 'Chocolate Shake', cat: 'Beverages', price: 350, image: IMG.shake, desc: 'Rich chocolate milkshake.', f: { isFeatured: true }, c: drinkCustom },
    { name: 'Fresh Lemonade', cat: 'Beverages', price: 200, image: IMG.drink, desc: 'Freshly squeezed lemonade.', c: drinkCustom },

    // Desserts
    { name: 'Chocolate Lava Cake', cat: 'Desserts', price: 400, image: IMG.dessert, desc: 'Warm chocolate cake with a molten centre.', f: { isFeatured: true } },
    { name: 'Chocolate Brownie', cat: 'Desserts', price: 300, image: IMG.dessert, desc: 'Fudgy brownie, freshly baked.' },
    { name: 'Ice Cream Sundae', cat: 'Desserts', price: 350, image: IMG.dessert, desc: 'Vanilla ice cream with chocolate sauce.' },

    // Sauces
    { name: 'Garlic Mayo Dip', cat: 'Sauces & Extras', price: 80, image: IMG.sauce, desc: 'Creamy garlic mayo dip.' },
    { name: 'Extra Cheese Slice', cat: 'Sauces & Extras', price: 120, image: IMG.sauce, desc: 'A slice of melted cheddar.' },
    { name: 'BBQ Sauce', cat: 'Sauces & Extras', price: 50, image: IMG.sauce, desc: 'Smoky BBQ sauce sachet.' }
  ];

  const docs = list.map((p) => ({
    name: p.name,
    slug: `${slugify(p.name)}-${Math.random().toString(36).slice(2, 6)}`,
    description: p.desc,
    category: cats[p.cat],
    image: p.image,
    price: p.price,
    discountPrice: 0,
    customizations: p.c || [],
    preparationTime: 15,
    isAvailable: true,
    isFeatured: !!p.f?.isFeatured,
    isBestseller: !!p.f?.isBestseller
  }));
  await Product.insertMany(docs);

  await Promotion.create([
    { code: 'WELCOME10', description: '10% off your first order', type: 'percent', value: 10, minOrder: 500, maxDiscount: 300, isActive: true },
    { code: 'NUST200', description: 'Rs. 200 off orders above Rs. 1200', type: 'fixed', value: 200, minOrder: 1200, isActive: true },
    { code: 'FREESHIP', description: 'Free delivery on orders above Rs. 1000', type: 'free_delivery', value: 0, minOrder: 1000, isActive: true }
  ]);

  console.log(`✅ Seeded ${docs.length} products, ${catNames.length} categories, 3 promotions`);
  console.log('Admin     → admin@nustcafe.pk / admin123');
  console.log('Kitchen   → kitchen@nustcafe.pk / kitchen123');
  console.log('Delivery  → delivery@nustcafe.pk / delivery123');
  console.log('Pickup    → pickup@nustcafe.pk / pickup123');
  console.log('Customer  → customer@nustcafe.pk / customer123');

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => { console.error(err); process.exit(1); });