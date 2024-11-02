// controllers/userController.js
const User = require("../../models/users/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Inscription d'un nouvel utilisateur
exports.registerUser = async (req, res) => {
  try {
    const { name, surname, number, email, password } = req.body;

    // Vérification si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      surname,
      number,
      email,
      password: hashedPassword,
      profileImage: req.file ? req.file.path : "", // Chemin de l'image de profil
    });

    await newUser.save();

    console.log("User saved", newUser)

     // Générer le token après la création de l'utilisateur
     const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "48h" }
    );

    // Configurer le cookie
   // Dans userController.js, lors de la définition du cookie
res.cookie("token", token, {
  maxAge: 5 * 24 * 60 * 60 * 1000, // 5 jours
  httpOnly: true,
  secure: true, // HTTPS en production
  sameSite: 'None', // Cross-origin cookies
  domain: 'sugu.onrender.com', // Explicit domain
});


    
    // Renvoie les informations de l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = newUser._doc; // Exclure le mot de passe
    res
      .status(201)
      .json({
        message: "User registered successfully",
        user: userWithoutPassword,
      });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

// Connexion d'un utilisateur
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "48h" }
    );

   // Dans userController.js, lors de la définition du cookie
res.cookie("token", token, {
  maxAge: 5 * 24 * 60 * 60 * 1000, // 5 jours
  httpOnly: true,
  secure: true, // HTTPS en production
  sameSite: 'None', // Cross-origin cookies
  domain: 'sugu.onrender.com', // Explicit domain
});


    
    

    // Renvoie les informations de l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = user._doc; // Exclure le mot de passe
    res.json({ message: "Login successful", user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};


// Mettre à jour les informations d'un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.userId; // Récupérer l'ID de l'utilisateur depuis le token
    const updates = req.body;

    // Met à jour le chemin de l'image de profil si elle est téléchargée
    if (req.file) {
      updates.profileImage = req.file.path;
    }

    const user = await User.findByIdAndUpdate(userId, updates, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user.userId; // Récupérer l'ID de l'utilisateur depuis le token

    await User.findByIdAndDelete(userId);
    res.status(204).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};


// Récupérer tous les utilisateurs avec les détails du panier
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('cart.product'); // Peupler le champ 'product' dans le cart
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

// Récupérer un utilisateur par ID avec les détails du panier
exports.getUserById = async (req, res) => {
  const { id } = req.params; // Récupérer l'ID de l'utilisateur à partir des paramètres de la requête

  try {
    const user = await User.findById(id).populate('cart.product'); // Peupler le champ 'product' dans le cart
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};


/* 
{
    "message": "User registered successfully",
    "user": {
        "name": "admin",
        "surname": "user",
        "number": "78019342",
        "email": "user@admin.com",
        "profileImage": "",
        "orders": [],
        "loyaltyPoints": 0,
        "role": "client",
        "_id": "670e4437b91a163319d5597b",
        "cart": [],
        "createdAt": "2024-10-15T10:30:15.155Z",
        "__v": 0
    }
}

*/