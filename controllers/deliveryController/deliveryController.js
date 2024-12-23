// controllers/deliveryController.js
const DeliveryPerson = require("../../models/DeliveryPerson/DeliveryPerson");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pushFilesToGitHub } = require("../../utils/gitHandler"); // Importer la fonction pushFilesToGitHub

// Inscription d'un nouveau livreur
exports.registerDeliveryPerson = async (req, res) => {
  try {
    const { name, surname, number, email, password, location } = req.body;

    // Vérification si le livreur existe déjà
    const existingDeliveryPerson = await DeliveryPerson.findOne({ email });
    if (existingDeliveryPerson) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newDeliveryPerson = new DeliveryPerson({
      name,
      surname,
      number,
      email,
      password: hashedPassword,
      location,
      profileImage: req.file ? req.file.path : "", // Chemin de l'image de profil
    });

    await newDeliveryPerson.save();

    // Si des fichiers sont téléchargés (images de profils, etc.)
    const filesToPush = [];
    if (req.file) {
      filesToPush.push(req.file.path); // Ajoute l'image de profil si présente
    }

    // Si plusieurs fichiers doivent être ajoutés à GitHub
    if (filesToPush.length > 0) {
      try {
        await pushFilesToGitHub(filesToPush); // Pousser tous les fichiers vers GitHub
        console.log("Files pushed to GitHub successfully");
      } catch (error) {
        console.error("Failed to push files to GitHub", error);
        return res.status(500).json({ message: "Delivery person saved, but GitHub push failed", error });
      }
    }

    const token = jwt.sign(
      { deliveryPersonId: newDeliveryPerson._id, role: newDeliveryPerson.role },
      process.env.JWT_SECRET,
      { expiresIn: "48h" }
    );

    res.cookie("token", token, {
      maxAge: 5 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    const { password: _, ...deliveryPersonWithoutPassword } =
      newDeliveryPerson._doc;
    res.status(201).json({
      message: "Delivery person registered successfully",
      deliveryPerson: deliveryPersonWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering delivery person", error });
  }
};

// Mise à jour du profil du livreur
exports.updateDeliveryPerson = async (req, res) => {
  try {
    const deliveryPersonId = req.user.deliveryPersonId; // Récupérer l'ID du livreur depuis le token
    const updates = req.body;

    if (req.file) {
      updates.profileImage = req.file.path; // Met à jour le chemin de l'image de profil si téléchargée
    }

    const updatedDeliveryPerson = await DeliveryPerson.findByIdAndUpdate(
      deliveryPersonId,
      updates,
      { new: true }
    );

    // Si des fichiers sont téléchargés pour la mise à jour
    const filesToPush = [];
    if (req.file) {
      filesToPush.push(req.file.path); // Ajoute l'image de profil si présente
    }

    // Si plusieurs fichiers doivent être ajoutés à GitHub
    if (filesToPush.length > 0) {
      try {
        await pushFilesToGitHub(filesToPush); // Pousser les fichiers vers GitHub
        console.log("Files pushed to GitHub successfully");
      } catch (error) {
        console.error("Failed to push files to GitHub", error);
      }
    }

    res.json(updatedDeliveryPerson);
  } catch (error) {
    res.status(500).json({ message: "Error updating delivery person", error });
  }
};

// Connexion d'un livreur
exports.loginDeliveryPerson = async (req, res) => {
  try {
    const { email, password } = req.body;
    const deliveryPerson = await DeliveryPerson.findOne({ email });

    if (
      !deliveryPerson ||
      !(await bcrypt.compare(password, deliveryPerson.password))
    ) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { deliveryPersonId: deliveryPerson._id, role: deliveryPerson.role },
      process.env.JWT_SECRET,
      { expiresIn: "48h" }
    );

    // Envoyer le cookie qui expire dans 5 jours
    res.cookie("token", token, {
      maxAge: 5 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    // Renvoie les informations du livreur sans le mot de passe
    const { password: _, ...deliveryPersonWithoutPassword } =
      deliveryPerson._doc;
    res.json({
      message: "Login successful",
      deliveryPerson: deliveryPersonWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};
