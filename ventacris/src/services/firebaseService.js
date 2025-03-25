import { auth, db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

let cachedUserData = null; // Caché para los datos del usuario

// Auth Service
export const registerUser = async (email, password, userData) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const userId = userCredential.user.uid;

  // Agregar datos del usuario con rol predeterminado
  await addDoc(doc(db, "users", userId), {
    ...userData,
    role: "user", // Rol predeterminado
  });
};

export const loginUser = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// Limpiar el caché al cerrar sesión
export const logoutUser = async () => {
  cachedUserData = null;
  return await signOut(auth);
};

// Obtener los datos del usuario autenticado desde Firestore
export const getUserData = async () => {
  if (cachedUserData) return cachedUserData; // Usar caché si está disponible

  const user = auth.currentUser;
  if (!user) throw new Error("Usuario no autenticado");

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists()) throw new Error("Datos del usuario no encontrados");

  cachedUserData = userDoc.data(); // Guardar en caché
  return cachedUserData;
};

// Obtener datos del usuario autenticado con validación de roles
export const getUserDataWithRole = async (requiredRole) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuario no autenticado");

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists()) throw new Error("Datos del usuario no encontrados");

  const userData = userDoc.data();
  if (requiredRole && userData.role !== requiredRole) {
    throw new Error("Acceso denegado: rol insuficiente");
  }

  return userData;
};

// Actualizar datos del usuario
export const updateUserData = async (updatedData) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuario no autenticado");

  return await updateDoc(doc(db, "users", user.uid), updatedData);
};

// Sales Service
export const addSale = async (saleData) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuario no autenticado");

  return await addDoc(collection(db, "sales"), {
    ...saleData,
    customerName: saleData.customerName || "N/A", // Asegurar que siempre haya un nombre
    userId: user.uid, // Guardar el UID del usuario
  });
};

export const getSales = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuario no autenticado");

  const salesQuery = query(collection(db, "sales"), where("userId", "==", user.uid));
  const querySnapshot = await getDocs(salesQuery);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const deleteSale = async (saleId) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuario no autenticado");

  return await deleteDoc(doc(db, "sales", saleId));
};

export const updateSale = async (saleId, updatedData) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuario no autenticado");

  return await updateDoc(doc(db, "sales", saleId), updatedData);
};

// Products Service
export const getProducts = async () => {
  const productsQuery = collection(db, "products");
  const querySnapshot = await getDocs(productsQuery);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addProduct = async (productData) => {
  return await addDoc(collection(db, "products"), productData);
};

export const deleteProduct = async (productId) => {
  return await deleteDoc(doc(db, "products", productId));
};

export const updateProduct = async (productId, updatedData) => {
  return await updateDoc(doc(db, "products", productId), updatedData);
};

// Suppliers Service
export const getSuppliers = async () => {
  const suppliersQuery = collection(db, "suppliers");
  const querySnapshot = await getDocs(suppliersQuery);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addSupplier = async (supplierData) => {
  return await addDoc(collection(db, "suppliers"), supplierData);
};

export const deleteSupplier = async (supplierId) => {
  return await deleteDoc(doc(db, "suppliers", supplierId));
};

// Invoices Service
export const addInvoice = async (invoiceData) => {
  return await addDoc(collection(db, "invoices"), invoiceData);
};

export const getInvoices = async () => {
  const invoicesQuery = collection(db, "invoices");
  const querySnapshot = await getDocs(invoicesQuery);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const deleteInvoice = async (invoiceId) => {
  return await deleteDoc(doc(db, "invoices", invoiceId));
};
