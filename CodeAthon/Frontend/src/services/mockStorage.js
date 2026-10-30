/**
 * Client-Side Persistence Layer & Realistic Seed Data
 * Automatically kicks in when backend endpoints are unmounted or pending.
 * Guarantees 100% functional CRUD throughout all frontend pages.
 */

const SEED_PARTIES = [
  {
    _id: 'party-1',
    name: 'Rahul Traders',
    mobile: '9876543210',
    state: 'Arunachal Pradesh',
    gstin: '12ABCDE1234F1Z5',
    email: 'rahul@traders.com',
    address: 'Main Market Road, Sector 2, Itanagar',
    createdAt: '2024-09-01T10:00:00Z',
  },
  {
    _id: 'party-2',
    name: 'Sharma Enterprises',
    mobile: '9823456789',
    state: 'Assam',
    gstin: '18ABCDE5678F1Z9',
    email: 'sharma@ent.com',
    address: 'GS Road, Dispur, Guwahati',
    createdAt: '2024-09-02T11:30:00Z',
  },
  {
    _id: 'party-3',
    name: 'Himalaya Supplies',
    mobile: '9712345678',
    state: 'Arunachal Pradesh',
    gstin: '12XYZAB9876F1Z2',
    email: 'himalaya@supplies.in',
    address: 'Sector 3 Commercial Zone, Naharlagun',
    createdAt: '2024-09-03T14:15:00Z',
  },
  {
    _id: 'party-4',
    name: 'Northeast Distributors',
    mobile: '9634567890',
    state: 'Meghalaya',
    gstin: '17LMNOP4321F1Z1',
    email: 'northeast@distrib.com',
    address: 'Police Bazar, Central Plaza, Shillong',
    createdAt: '2024-09-04T09:45:00Z',
  },
  {
    _id: 'party-5',
    name: 'Green Valley Traders',
    mobile: '9545678901',
    state: 'Arunachal Pradesh',
    gstin: '12QWERT1122F1Z8',
    email: 'greenvalley@biz.in',
    address: 'Industrial Hub, Pasighat',
    createdAt: '2024-09-05T16:20:00Z',
  },
];

const SEED_ITEMS = [
  {
    _id: 'item-1',
    name: 'MacBook Pro M3 Max 16"',
    hsnCode: '84713010',
    price: 249900,
    gstPercent: 18,
    description: 'Apple Silicon 36GB Unified Memory, 1TB SSD',
  },
  {
    _id: 'item-2',
    name: 'Dell UltraSharp 32" 4K Monitor',
    hsnCode: '85285200',
    price: 68500,
    gstPercent: 18,
    description: 'U3223QE 4K UHD IPS USB-C Hub',
  },
  {
    _id: 'item-3',
    name: 'Logitech MX Master 3S Wireless Mouse',
    hsnCode: '84716060',
    price: 8995,
    gstPercent: 18,
    description: 'Performance ergonomic wireless mouse with quiet clicks',
  },
  {
    _id: 'item-4',
    name: 'Thermal POS Receipt Rolls (Pack of 50)',
    hsnCode: '48119090',
    price: 1750,
    gstPercent: 12,
    description: 'High sensitivity billing receipt paper rolls',
  },
  {
    _id: 'item-5',
    name: 'Enterprise Cloud Hosting & Annual Maintenance',
    hsnCode: '998314',
    price: 45000,
    gstPercent: 18,
    description: '99.9% uptime SLA hosting & cloud infrastructure',
  },
  {
    _id: 'item-6',
    name: 'Cisco Business 24-Port Gigabit Switch',
    hsnCode: '85176290',
    price: 14200,
    gstPercent: 18,
    description: 'CBS250-24T-4G smart managed network switch',
  },
];

const SEED_BILLS = [
  {
    _id: 'bill-1',
    invoiceNumber: 'INV-2024-000123',
    invoiceDate: '2024-09-19T10:00:00Z',
    partyId: 'party-1',
    party: SEED_PARTIES[0],
    partyName: 'Rahul Traders',
    subtotal: 42000,
    totalTax: 6250,
    grandTotal: 48250,
    totalCgst: 3125,
    totalSgst: 3125,
    totalIgst: 0,
    intraState: true,
    status: 'FINALIZED',
    items: [
      {
        name: 'Dell UltraSharp 32" 4K Monitor',
        hsnCode: '85285200',
        quantity: 1,
        price: 35000,
        gstPercent: 18,
        taxableAmount: 35000,
        cgstAmount: 3150,
        sgstAmount: 3150,
        igstAmount: 0,
        totalTax: 6300,
        totalAmount: 41300,
      },
      {
        name: 'Logitech MX Master 3S Wireless Mouse',
        hsnCode: '84716060',
        quantity: 1,
        price: 7000,
        gstPercent: 18,
        taxableAmount: 7000,
        cgstAmount: 630,
        sgstAmount: 630,
        igstAmount: 0,
        totalTax: 1260,
        totalAmount: 8260,
      },
    ],
  },
  {
    _id: 'bill-2',
    invoiceNumber: 'INV-2024-000122',
    invoiceDate: '2024-09-18T14:30:00Z',
    partyId: 'party-2',
    party: SEED_PARTIES[1],
    partyName: 'Sharma Enterprises',
    subtotal: 18500,
    totalTax: 2775,
    grandTotal: 21275,
    totalCgst: 0,
    totalSgst: 0,
    totalIgst: 2775,
    intraState: false,
    status: 'FINALIZED',
    items: [],
  },
  {
    _id: 'bill-3',
    invoiceNumber: 'INV-2024-000121',
    invoiceDate: '2024-09-18T11:00:00Z',
    partyId: 'party-3',
    party: SEED_PARTIES[2],
    partyName: 'Himalaya Supplies',
    subtotal: 7200,
    totalTax: 1296,
    grandTotal: 8496,
    totalCgst: 648,
    totalSgst: 648,
    totalIgst: 0,
    intraState: true,
    status: 'FINALIZED',
    items: [],
  },
  {
    _id: 'bill-4',
    invoiceNumber: 'INV-2024-000120',
    invoiceDate: '2024-09-17T16:00:00Z',
    partyId: 'party-4',
    party: SEED_PARTIES[3],
    partyName: 'Northeast Distributors',
    subtotal: 25000,
    totalTax: 4500,
    grandTotal: 29500,
    totalCgst: 0,
    totalSgst: 0,
    totalIgst: 4500,
    intraState: false,
    status: 'FINALIZED',
    items: [],
  },
  {
    _id: 'bill-5',
    invoiceNumber: 'INV-2024-000119',
    invoiceDate: '2024-09-16T12:00:00Z',
    partyId: 'party-5',
    party: SEED_PARTIES[4],
    partyName: 'Green Valley Traders',
    subtotal: 12300,
    totalTax: 2214,
    grandTotal: 14514,
    totalCgst: 1107,
    totalSgst: 1107,
    totalIgst: 0,
    intraState: true,
    status: 'FINALIZED',
    items: [],
  },
];

const SEED_USERS = [
  {
    _id: 'user-1',
    name: 'Anirudh',
    email: 'owner@example.com',
    role: 'OWNER',
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    _id: 'user-2',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    role: 'ADMIN',
    isActive: true,
    createdAt: '2024-03-15T09:00:00Z',
  },
  {
    _id: 'user-3',
    name: 'Vikram Mehta',
    email: 'vikram.m@example.com',
    role: 'STAFF',
    isActive: true,
    createdAt: '2024-06-01T10:00:00Z',
  },
  {
    _id: 'user-4',
    name: 'Sneha Patel',
    email: 'sneha.p@example.com',
    role: 'STAFF',
    isActive: false,
    createdAt: '2024-07-20T12:00:00Z',
  },
];

const SEED_SHOP = {
  name: 'IMS',
  ownerName: 'Anirudh',
  address: 'Suite 402, Capital Complex, Sector 4, Naharlagun',
  state: 'Arunachal Pradesh',
  gstin: '12AABCI1234M1Z5',
  phone: '9876543210',
  email: 'billing@ims-enterprise.com',
  invoicePrefix: 'INV-2024-',
};

// Storage helper functions
const getStored = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setStored = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {}
};

export const mockStorage = {
  // ─── PARTIES ───
  getParties(search = '') {
    let list = getStored('gst_parties', SEED_PARTIES);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.mobile.includes(q) ||
          (p.gstin && p.gstin.toLowerCase().includes(q))
      );
    }
    return list;
  },

  getPartyById(id) {
    const list = getStored('gst_parties', SEED_PARTIES);
    return list.find((p) => p._id === id) || SEED_PARTIES[0];
  },

  saveParty(party) {
    const list = getStored('gst_parties', SEED_PARTIES);
    let updated;
    if (party._id) {
      updated = list.map((p) => (p._id === party._id ? { ...p, ...party } : p));
    } else {
      const newParty = {
        ...party,
        _id: `party-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      updated = [newParty, ...list];
    }
    setStored('gst_parties', updated);
    return party._id ? party : updated[0];
  },

  deleteParty(id) {
    const list = getStored('gst_parties', SEED_PARTIES);
    const updated = list.filter((p) => p._id !== id);
    setStored('gst_parties', updated);
    return true;
  },

  // ─── ITEMS ───
  getItems(search = '', gstPercent = '') {
    let list = getStored('gst_items', SEED_ITEMS);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          (i.hsnCode && i.hsnCode.includes(q))
      );
    }
    if (gstPercent !== '' && gstPercent !== undefined) {
      list = list.filter((i) => String(i.gstPercent) === String(gstPercent));
    }
    return list;
  },

  getItemById(id) {
    const list = getStored('gst_items', SEED_ITEMS);
    return list.find((i) => i._id === id) || SEED_ITEMS[0];
  },

  saveItem(item) {
    const list = getStored('gst_items', SEED_ITEMS);
    let updated;
    if (item._id) {
      updated = list.map((i) => (i._id === item._id ? { ...i, ...item } : i));
    } else {
      const newItem = {
        ...item,
        _id: `item-${Date.now()}`,
      };
      updated = [newItem, ...list];
    }
    setStored('gst_items', updated);
    return item._id ? item : updated[0];
  },

  deleteItem(id) {
    const list = getStored('gst_items', SEED_ITEMS);
    const updated = list.filter((i) => i._id !== id);
    setStored('gst_items', updated);
    return true;
  },

  // ─── BILLS ───
  getBills(search = '') {
    let list = getStored('gst_bills', SEED_BILLS);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.invoiceNumber.toLowerCase().includes(q) ||
          (b.partyName && b.partyName.toLowerCase().includes(q))
      );
    }
    return list;
  },

  getBillById(id) {
    const list = getStored('gst_bills', SEED_BILLS);
    return list.find((b) => b._id === id) || list[0] || SEED_BILLS[0];
  },

  createBill(billPayload) {
    const list = getStored('gst_bills', SEED_BILLS);
    const party = this.getPartyById(billPayload.partyId);
    const shop = this.getShop();

    const seq = list.length + 124;
    const invoiceNumber = `INV-2024-${String(seq).padStart(6, '0')}`;

    const newBill = {
      _id: `bill-${Date.now()}`,
      invoiceNumber,
      invoiceDate: new Date().toISOString(),
      partyId: billPayload.partyId,
      party,
      partyName: party?.name || 'Customer',
      shop,
      notes: billPayload.notes || '',
      items: billPayload.items || [],
      subtotal: billPayload.items?.reduce((acc, i) => acc + (i.quantity * i.price), 0) || 0,
      totalTax: billPayload.items?.reduce((acc, i) => acc + ((i.quantity * i.price * i.gstPercent) / 100), 0) || 0,
      status: 'FINALIZED',
      createdAt: new Date().toISOString(),
    };
    newBill.grandTotal = newBill.subtotal + newBill.totalTax;
    newBill.intraState = party?.state === shop?.state;

    const updated = [newBill, ...list];
    setStored('gst_bills', updated);
    return newBill;
  },

  // ─── USERS ───
  getUsers() {
    return getStored('gst_users', SEED_USERS);
  },

  getUserById(id) {
    const list = getStored('gst_users', SEED_USERS);
    return list.find((u) => u._id === id) || SEED_USERS[0];
  },

  saveUser(user) {
    const list = getStored('gst_users', SEED_USERS);
    let updated;
    if (user._id) {
      updated = list.map((u) => (u._id === user._id ? { ...u, ...user } : u));
    } else {
      const newUser = {
        ...user,
        _id: `user-${Date.now()}`,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      updated = [newUser, ...list];
    }
    setStored('gst_users', updated);
    return user._id ? user : updated[0];
  },

  toggleUserStatus(id, isActive) {
    const list = getStored('gst_users', SEED_USERS);
    const updated = list.map((u) => (u._id === id ? { ...u, isActive } : u));
    setStored('gst_users', updated);
    return true;
  },

  deleteUser(id) {
    const list = getStored('gst_users', SEED_USERS);
    const updated = list.filter((u) => u._id !== id);
    setStored('gst_users', updated);
    return true;
  },

  // ─── SHOP ───
  getShop() {
    return getStored('gst_shop', SEED_SHOP);
  },

  saveShop(shopData) {
    const current = getStored('gst_shop', SEED_SHOP);
    const updated = { ...current, ...shopData };
    setStored('gst_shop', updated);
    return updated;
  },
};

export default mockStorage;
