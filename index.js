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

// Middlewares
app.use(express.json());

// Définissez les origines autorisées
const allowedOrigins = [
  "http://localhost:3000",
  "https://esugu.netlify.app"
];

// Appliquez le middleware CORS
app.use(cors({
  origin: (origin, callback) => {
    // Autorise les origines spécifiques et localhost pour le développement
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

// Ajoutez ce middleware pour définir explicitement les en-têtes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});



app.use(cookieParser());
app.use(morgan('dev'));
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Connexion à MongoDB
connectDB();

// Routes
app.get('/', (req, res) => {
    res.send('Bienvenue sur la plateforme de livraison locale !');
});

// Route de déconnexion avec suppression du cookie de token
app.post('/logout', (req, res) => {
    res.clearCookie('token', {

      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Assurez-vous que ce paramètre est activé en production
      sameSite: 'None', // Utiliser 'None' pour la compatibilité avec iOS dans un contexte cross-origin
      // path: '/', // Chemin du cookie
    });
    res.status(200).send({ message: 'Déconnexion réussie et cookie supprimé' });
});

// GLOBAL ROUTES
const userRoutes = require('./routes/users/user.routes');
const livreurRoutes = require('./routes/deliveryRoutes/delivery.routes');
const storeTypeRoutes = require('./routes/storeTypeRoutes/storeType.routes');
const store = require('./routes/shop/shop.routes');
const category = require('./routes/categoryRoutes/category.routes');
const product = require('./routes/productRoutes/product.routes');
const cart = require('./routes/cart/cart.routes');
const orderRoutes = require('./routes/order/order.routes');

// Utilisation des routes utilisateurs (clients)
app.use('/api/users', userRoutes);
app.use('/api/livreur', livreurRoutes);
app.use('/api/store-type', storeTypeRoutes);
app.use('/api/store', store);
app.use('/api/category', category);
app.use('/api/product', product);
app.use('/api/cart', cart);
app.use("/api/orders", orderRoutes);

// Démarrer le serveur
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
