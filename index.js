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
// app.use(cors());
// Définissez les origines autorisées
const allowedOrigins = [
  "http://localhost:3000",
  "https://esugu.netlify.app"
];

// Appliquez le middleware CORS
app.use(cors({
  origin: allowedOrigins,
  credentials: true, // Autorise les cookies
}));
// app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));





// GLOBAL ROUTES
const userRoutes = require('./routes/users/user.routes');
const livreurRoutes = require('./routes/deliveryRoutes/delivery.routes');
const storeTypeRoutes = require('./routes/storeTypeRoutes/storeType.routes');
const store = require('./routes/shop/shop.routes');
const category = require('./routes/categoryRoutes/category.routes');
const product = require('./routes/productRoutes/product.routes');
const cart = require('./routes/cart/cart.routes');
const orderRoutes = require('./routes/order/order.routes');


// Connexion à MongoDB
connectDB();

// Routes
app.get('/', (req, res) => {
    res.send('Bienvenue sur la plateforme de livraison locale !');
});

app.post('/logout', (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax', // Correspond à la configuration du cookie
      path: '/', // Assurez-vous que le chemin est correct
    });
    res.status(200).send({ message: 'Déconnexion réussie et cookie supprimé' });
  });
  
// Utilisation des routes utilisateurs (clients)
app.use('/api/users', userRoutes)
app.use('/api/livreur', livreurRoutes)
app.use('/api/store-type', storeTypeRoutes)
app.use('/api/store', store)
app.use('/api/category', category)
app.use('/api/product', product)
app.use('/api/cart', cart)
// Use the order routes
app.use("/api/orders", orderRoutes);

// Démarrer le serveur
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
