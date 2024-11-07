const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Configuration du transporteur d'emails
const transporter = nodemailer.createTransport({
  service: 'gmail', // Ou un autre fournisseur
  auth: {
    user: 'syoro4663@gmail.com', // Remplacez par votre email
    pass: 'vprm ieer llsz ssoo', 
  }
});

const sendActivationEmail = async (ownerEmail, ownerName, shopName, shopId, profileImage) => {
  const activationLink = `https://votresite.com/accept-terms?id=${shopId}`; // Lien vers la page où les conditions doivent être acceptées

  // Définir le chemin de l'image de la plateforme (Logo)
  const platformImagePath = path.join(__dirname, '..', 'public', 'logo.png'); // Remonte d'un niveau pour accéder à 'public'

  console.log("Chemin absolu du logo : ", platformImagePath);

  // Vérifier si les fichiers existent
  if (!fs.existsSync(profileImage)) {
    console.error('Le chemin de l\'image de profil est incorrect ou le fichier n\'existe pas.');
    return;
  }

  if (!fs.existsSync(platformImagePath)) {
    console.error('Le logo de la plateforme est introuvable.', platformImagePath);
    return;
  }

  const mailOptions = {
    from: 'votre-email@gmail.com',
    to: ownerEmail,
    subject: 'Bienvenue sur E-sugu - Activez votre compte',
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; text-align: left; padding: 20px; background-color: white; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #ff6f61;">Félicitations et Bienvenue sur E-sugu !</h1>
            <p>Bonjour ${ownerName},</p>
            <p>Merci d'avoir créé votre boutique <strong>"${shopName}"</strong> sur E-sugu.</p>
            
            <p>Avant d'activer votre compte, vous devez accepter nos <strong>Conditions Générales d'Utilisation</strong>. Cliquez sur le lien ci-dessous pour lire et accepter les conditions :</p>
            
            <p>En tant que vendeur, vous acceptez de payer un pourcentage de <strong>10% sur chaque vente</strong> réalisée sur votre boutique. Ce pourcentage sera automatiquement prélevé lors du paiement des commandes. En échange, nous nous occupons de promouvoir votre boutique via des publicités et d'autres actions marketing pour améliorer sa visibilité.</p>
            
            <ul style="text-align: left; margin-left: 20px; text-align: left;">
              <li>Nous nous réservons le droit de supprimer votre boutique si vous violez nos conditions.</li>
              <li>Nous nous engageons à vous aider à développer votre activité en ligne grâce à des outils et services de marketing.</li>
              <li>Le pourcentage de 10% est appliqué sur le montant total de chaque commande validée et est prélevé automatiquement lors du paiement.</li>
            </ul>

            <p>Pour activer votre compte, veuillez accepter les conditions générales en cliquant sur le bouton ci-dessous :</p>

            <p><em>En cliquant sur "Activer mon compte", vous acceptez nos conditions d'utilisation.</em></p>
            <a href="${activationLink}" style="background-color: #ff6f61; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Activer mon compte</a>
            
            <div style="display: flex; justify-content: center; gap: 30px; margin-top: 30px;">
              <div style="text-align: left;">
                <img src="cid:profile-image" alt="Image de la boutique" style="max-width: 150px; height: auto; border-radius: 8px;" />
              </div>
              <div style="text-align: left;">
                <img src="cid:platform-logo" alt="Logo E-sugu" style="max-width: 150px; height: auto; border-radius: 8px;" />
              </div>
            </div>

            <p style="margin-top: 20px;">Merci de faire partie de notre communauté !</p>

            <footer style="margin-top: 50px; font-size: 12px; color: #888;">
              <p>© ${new Date().getFullYear()} E-sugu. Tous droits réservés.</p>
            </footer>
          </div>
        </body>
      </html>
    `,
    attachments: [
      {
        filename: 'profile-image.jpg', // Nom de l'image de profil
        path: profileImage, // Chemin vers l'image téléchargée
        cid: 'profile-image', // Identifiant unique pour la référence dans le HTML
      },
      {
        filename: 'platform-logo.png', // Nom de l'image de la plateforme
        path: platformImagePath, // Chemin vers l'image de la plateforme
        cid: 'platform-logo', // Identifiant unique pour la référence dans le HTML
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email envoyé avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email", error);
  }
};

module.exports = { sendActivationEmail };
