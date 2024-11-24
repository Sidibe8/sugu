// Importations des modules
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const connectDB = require('./config/db/db');

// Initialisation de dotenv
dotenv.config();

// Création de l'application Express
const app = express();

// Middleware globaux
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Configuration des fichiers statiques
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Connexion à MongoDB
connectDB();

// Configuration de CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://esugu.netlify.app",
];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Autoriser les cookies cross-origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Configuration des en-têtes CORS supplémentaires
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Middlewares pour le débogage
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Gestionnaire global des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack); // Log l’erreur pour le débogage
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Routes principales
app.get('/', (req, res) => {
  res.send('Bienvenue sur la plateforme de livraison locale !');
});

app.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Utilisez true en production
    sameSite: 'None', // Compatibilité iOS avec le contexte cross-origin
  });
  res.status(200).send({ message: 'Déconnexion réussie et cookie supprimé' });
});

// Importation des routes
const userRoutes = require('./routes/users/user.routes');
const livreurRoutes = require('./routes/deliveryRoutes/delivery.routes');
const storeTypeRoutes = require('./routes/storeTypeRoutes/storeType.routes');
const storeRoutes = require('./routes/shop/shop.routes');
const categoryRoutes = require('./routes/categoryRoutes/category.routes');
const productRoutes = require('./routes/productRoutes/product.routes');
const cartRoutes = require('./routes/cart/cart.routes');
const orderRoutes = require('./routes/order/order.routes');

// Utilisation des routes
app.use('/api/users', userRoutes);
app.use('/api/livreur', livreurRoutes);
app.use('/api/store-type', storeTypeRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
