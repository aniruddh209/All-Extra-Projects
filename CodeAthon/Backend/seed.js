import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

import Shop from './models/Shop.js';
import User from './models/User.js';
import Party from './models/Party.js';
import Item from './models/Item.js';
import Bill from './models/Bill.js';
import Counter from './models/Counter.js';
import gstService from './services/gst.service.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gst-billing';

async function seedDatabase() {
  console.log(' Connecting to MongoDB at:', MONGO_URI);
  await mongoose.connect(MONGO_URI);
  console.log(' Connected to database successfully.');

  // Clean collections
  console.log(' Cleaning existing database collections...');
  await Promise.all([
    Shop.deleteMany({}),
    User.deleteMany({}),
    Party.deleteMany({}),
    Item.deleteMany({}),
    Bill.deleteMany({}),
    Counter.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash('Password123!', 12);

  // 1. Create Shop
  console.log(' Creating Primary Shop: Apex Tech Solutions Private Limited...');
  const shop = new Shop({
    businessName: 'Apex Tech Solutions Private Limited',
    ownerName: 'Anirudh Parmar',
    address: '123, Tech Park, Prahlad Nagar, Sector 4, Naharlagun',
    state: 'Arunachal Pradesh',
    gstin: '24ABCDE1234F1Z5',
    phone: '9876543210',
    email: 'billing@apextech.com',
    invoicePrefix: 'INV-2026',
    ownerId: new mongoose.Types.ObjectId(), // Will update after owner creation
  });
  await shop.save();

  // 2. Create Users
  console.log(' Creating Users with RBAC roles...');
  const ownerUser = await User.create({
    shopId: shop._id,
    name: 'Anirudh Parmar',
    email: 'anirudh@example.com',
    password: passwordHash,
    role: 'OWNER',
    isActive: true,
  });

  // Also create owner@example.com for convenience
  await User.create({
    shopId: shop._id,
    name: 'Anirudh Parmar',
    email: 'owner@example.com',
    password: passwordHash,
    role: 'OWNER',
    isActive: true,
  });

  await User.create({
    shopId: shop._id,
    name: 'Rohan Shah',
    email: 'admin@example.com',
    password: passwordHash,
    role: 'ADMIN',
    isActive: true,
  });

  await User.create({
    shopId: shop._id,
    name: 'Priya Patel',
    email: 'staff@example.com',
    password: passwordHash,
    role: 'STAFF',
    isActive: true,
  });

  await User.create({
    shopId: shop._id,
    name: 'Amit Kumar',
    email: 'amit@example.com',
    password: passwordHash,
    role: 'STAFF',
    isActive: true,
  });

  // Link owner back to shop
  shop.ownerId = ownerUser._id;
  await shop.save();

  // 3. Create Parties (8 Customers)
  console.log(' Creating 8 Business Client Parties...');
  const partiesData = [
    {
      name: 'Rahul Traders',
      mobile: '9876543210',
      email: 'rahul@traders.com',
      address: 'Shop 12, Main Market, Ring Road, Surat',
      state: 'Gujarat',
      gstin: '24ABCDE1234F1Z5',
    },
    {
      name: 'Sharma Enterprises',
      mobile: '9823456789',
      email: 'sharma@ent.com',
      address: 'Plot 45, MIDC Industrial Area, Andheri East, Mumbai',
      state: 'Maharashtra',
      gstin: '27ABCDE5678F1Z9',
    },
    {
      name: 'Himalaya Supplies',
      mobile: '9765432100',
      email: 'himalaya@supplies.com',
      address: 'Mall Road, Commercial Complex, Shimla',
      state: 'Himachal Pradesh',
      gstin: '02ABCDE9181F1Z2',
    },
    {
      name: 'Northeast Distributors',
      mobile: '9654321098',
      email: 'northeast@dist.com',
      address: 'GS Road, Dispur, Guwahati',
      state: 'Assam',
      gstin: '18ABCDE1122F1Z4',
    },
    {
      name: 'Green Valley Traders',
      mobile: '9543210987',
      email: 'greenvalley@biz.in',
      address: 'Industrial Area, Haridwar',
      state: 'Uttarakhand',
      gstin: '05ABCDE3344F1Z7',
    },
    {
      name: 'Apex Retailers',
      mobile: '9845123456',
      email: 'retail@apexretail.in',
      address: 'Sector 3 Commercial Zone, Naharlagun',
      state: 'Arunachal Pradesh', // Same state!
      gstin: '12ABCDE9988F1Z3',
    },
    {
      name: 'TechZone Solutions',
      mobile: '9911223344',
      email: 'contact@techzone.io',
      address: 'Connaught Place, Barakhamba Road, New Delhi',
      state: 'Delhi',
      gstin: '07ABCDE4455F1Z4',
    },
    {
      name: 'Modern Office Mart',
      mobile: '9788990011',
      email: 'orders@officemart.com',
      address: 'Capital Complex, Sector 4, Itanagar',
      state: 'Arunachal Pradesh', // Same state!
      gstin: '12ABCDE6677F1Z6',
    },
  ];

  const parties = await Promise.all(
    partiesData.map((p) => Party.create({ ...p, shopId: shop._id }))
  );

  // 4. Create Items (12 Products)
  console.log(' Creating 12 Inventory Catalog Items...');
  const itemsData = [
    {
      name: 'Laptop ThinkPad T14 Gen 4',
      hsnCode: '84713010',
      price: 65000,
      gstPercent: 18,
      description: 'Intel Core i7 13th Gen, 16GB RAM, 512GB SSD',
    },
    {
      name: 'Logitech MX Master 3S Wireless Mouse',
      hsnCode: '84716060',
      price: 8995,
      gstPercent: 18,
      description: 'Precision wireless ergonomic mouse',
    },
    {
      name: 'Mechanical RGB Backlit Keyboard',
      hsnCode: '84716060',
      price: 3499,
      gstPercent: 18,
      description: 'Custom mechanical keyboard with hot-swappable switches',
    },
    {
      name: 'Dell UltraSharp 27" 4K Monitor',
      hsnCode: '85285200',
      price: 38500,
      gstPercent: 18,
      description: 'IPS UHD USB-C Hub Monitor U2723QE',
    },
    {
      name: 'Epson EcoTank L3250 Wi-Fi All-in-One Printer',
      hsnCode: '84433200',
      price: 15499,
      gstPercent: 18,
      description: 'High-yield color ink tank printer',
    },
    {
      name: 'High-Back Ergonomic Mesh Office Chair',
      hsnCode: '94013000',
      price: 12800,
      gstPercent: 18,
      description: 'Adjustable lumbar support with breathable mesh',
    },
    {
      name: 'Enterprise Tower Workstation Computer',
      hsnCode: '84715000',
      price: 85000,
      gstPercent: 18,
      description: 'Intel Xeon, 32GB ECC RAM, NVIDIA RTX graphics',
    },
    {
      name: 'Anker 8-in-1 USB-C Multiport Hub',
      hsnCode: '84718000',
      price: 3200,
      gstPercent: 18,
      description: 'Power Delivery 100W, 4K HDMI, Gigabit Ethernet',
    },
    {
      name: 'Logitech C920 Pro HD Webcam 1080p',
      hsnCode: '85258090',
      price: 6800,
      gstPercent: 18,
      description: 'Stereo audio dual mics, auto light correction',
    },
    {
      name: 'TP-Link Archer AX73 Dual-Band Wi-Fi 6 Router',
      hsnCode: '85176290',
      price: 7999,
      gstPercent: 18,
      description: '5400 Mbps gigabit router with 6 antennas',
    },
    {
      name: 'Samsung 980 PRO 1TB PCIe 4.0 NVMe M.2 SSD',
      hsnCode: '84717020',
      price: 8400,
      gstPercent: 18,
      description: 'Read speed up to 7,000 MB/s',
    },
    {
      name: 'APC Back-UPS Pro 1500VA Inverter UPS',
      hsnCode: '85044090',
      price: 16500,
      gstPercent: 18,
      description: 'Automatic Voltage Regulation (AVR) battery backup',
    },
  ];

  const items = await Promise.all(
    itemsData.map((i) => Item.create({ ...i, shopId: shop._id }))
  );

  // 5. Create 15 Finalized Invoices with varying dates & customers
  console.log(' Generating 15 Finalized Historical Invoices with GST breakdowns...');

  // Initialize counter
  await Counter.create({ shopId: shop._id, sequence: 123 });

  const invoiceConfigs = [
    { partyIdx: 0, itemIndices: [0, 1], daysAgo: 0, seq: 123 }, // Today
    { partyIdx: 5, itemIndices: [3, 2], daysAgo: 0, seq: 122 }, // Today (Same state!)
    { partyIdx: 1, itemIndices: [4, 7], daysAgo: 1, seq: 121 },
    { partyIdx: 2, itemIndices: [1, 2], daysAgo: 1, seq: 120 },
    { partyIdx: 3, itemIndices: [6], daysAgo: 2, seq: 119 },
    { partyIdx: 4, itemIndices: [5, 7], daysAgo: 3, seq: 118 },
    { partyIdx: 5, itemIndices: [0, 3], daysAgo: 4, seq: 117 }, // Same state!
    { partyIdx: 6, itemIndices: [8, 9], daysAgo: 5, seq: 116 },
    { partyIdx: 7, itemIndices: [10, 11], daysAgo: 6, seq: 115 }, // Same state!
    { partyIdx: 0, itemIndices: [2, 7], daysAgo: 7, seq: 114 },
    { partyIdx: 1, itemIndices: [3], daysAgo: 8, seq: 113 },
    { partyIdx: 2, itemIndices: [5], daysAgo: 9, seq: 112 },
    { partyIdx: 3, itemIndices: [0], daysAgo: 10, seq: 111 },
    { partyIdx: 4, itemIndices: [1, 8], daysAgo: 12, seq: 110 },
    { partyIdx: 7, itemIndices: [4, 11], daysAgo: 14, seq: 109 }, // Same state!
  ];

  for (const cfg of invoiceConfigs) {
    const party = parties[cfg.partyIdx];
    const selectedItems = cfg.itemIndices.map((idx) => {
      const item = items[idx];
      return {
        itemId: item._id,
        name: item.name,
        hsnCode: item.hsnCode,
        quantity: idx === 1 || idx === 2 ? 2 : 1,
        price: item.price,
        gstPercent: item.gstPercent,
      };
    });

    const totals = gstService.calculateInvoiceTotals(shop.state, party.state, selectedItems);

    const invoiceDate = new Date();
    invoiceDate.setDate(invoiceDate.getDate() - cfg.daysAgo);
    invoiceDate.setHours(10 + (cfg.seq % 8), (cfg.seq * 7) % 60, 0, 0);

    await Bill.create({
      shopId: shop._id,
      invoiceNumber: `INV-2026-${String(cfg.seq).padStart(6, '0')}`,
      invoiceDate,
      partyId: party._id,
      partySnapshot: {
        name: party.name,
        mobile: party.mobile,
        email: party.email,
        address: party.address,
        state: party.state,
        gstin: party.gstin,
      },
      shopSnapshot: {
        name: shop.businessName,
        businessName: shop.businessName,
        ownerName: shop.ownerName,
        address: shop.address,
        state: shop.state,
        gstin: shop.gstin,
        phone: shop.phone,
        email: shop.email,
      },
      items: totals.items,
      intraState: totals.intraState,
      subtotal: totals.subtotal,
      totalCgst: totals.totalCgst,
      totalSgst: totals.totalSgst,
      totalIgst: totals.totalIgst,
      totalTax: totals.totalTax,
      grandTotal: totals.grandTotal,
      notes: '1. Goods once sold will not be taken back or exchanged. 2. Invoices are computer-generated.',
      status: 'FINALIZED',
      createdBy: ownerUser._id,
      createdAt: invoiceDate,
    });
  }

  console.log('\n  ═══════════════════════════════════════════════════════════');
  console.log('   DATABASE SEEDED SUCCESSFULLY!');
  console.log('  ═══════════════════════════════════════════════════════════');
  console.log('  Shop:     Apex Tech Solutions Private Limited (Arunachal Pradesh)');
  console.log('  Users:    4 Users seeded');
  console.log('            - OWNER: anirudh@example.com  | Password123!');
  console.log('            - OWNER: owner@example.com    | Password123!');
  console.log('            - ADMIN: admin@example.com    | Password123!');
  console.log('            - STAFF: staff@example.com    | Password123!');
  console.log('  Parties:  8 Customers seeded across Gujarat, Maharashtra, Assam, etc.');
  console.log('  Items:    12 Catalog Items seeded with 18% GST');
  console.log('  Invoices: 15 Finalized Bills generated (INV-2026-000109 to 000123)');
  console.log('  ═══════════════════════════════════════════════════════════\n');

  await mongoose.disconnect();
}

seedDatabase().catch((err) => {
  console.error(' Seeding failed:', err);
  process.exit(1);
});
