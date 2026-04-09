// ─── Firebase ─────────────────────────────────────────────────────────────────
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, off, remove } from "firebase/database";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, TrendingDown, CheckSquare,
  Plus, Trash2, Pencil, CreditCard, DollarSign, PiggyBank, Wallet
} from "lucide-react";

const firebaseConfig = {
  apiKey: "AIzaSyAdOlLe8EjxjkFIA7Sw9Pv50L0mlRpmOjU",
  authDomain: "budget-master-129b5.firebaseapp.com",
  databaseURL: "https://burleson-budgets-master-default-rtdb.firebaseio.com",
  projectId: "budget-master-129b5",
  storageBucket: "budget-master-129b5.firebasestorage.app",
  messagingSenderId: "1061329783875",
  appId: "1:1061329783875:web:006fae8903734f7d7418f6",
  measurementId: "G-0WWVM83NR4",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);
const ROOT = "burleson";

// Firebase helpers
const fbSet = (path, value) => set(ref(db, `${ROOT}/${path}`), value);
const fbRemove = (path) => remove(ref(db, `${ROOT}/${path}`));

function fbListen(path, cb) {
  const r = ref(db, `${ROOT}/${path}`);
  onValue(r, (snap) => cb(snap.val()));
  return () => off(r);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);

const TODAY = new Date().toISOString().split("T")[0];
const MONTH_KEY = (() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
})();
const DEFAULT_PERIOD = new Date().getDate() <= 14 ? 1 : 2;

const DEFAULT_CONFIG = {
  p1: { jaci_check: 2978, conner_check: 2000, jaci_savings: 1246, conner_savings: 840, checking_bills: 246.15, reserve: 375, cushion: 37 },
  p2: { jaci_check: 2980, conner_check: 2000, jaci_savings: 1246, conner_savings: 840, checking_bills: 1018.49, reserve: 375, cushion: 38 },
};

// Computed value, never stored
const calcAvailable = (c) =>
  c.jaci_check + c.conner_check - c.jaci_savings - c.conner_savings - c.checking_bills - c.reserve - c.cushion;

const DEFAULT_BILLS = [
  { id: "b1", name: "Geico Car Insurance", amount: 142.35, dueDay: 2, account: "AmFirst", method: "auto", period: 1 },
  { id: "b2", name: "Netflix", amount: 29.14, dueDay: 6, account: "AmFirst", method: "auto", period: 1 },
  // ...rest of bills
];

const DEFAULT_BILL_AMOUNTS = Object.fromEntries(DEFAULT_BILLS.map((b) => [b.id, b.amount]));
