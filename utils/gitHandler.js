const simpleGit = require('simple-git');

// Initialisation de simple-git
const git = simpleGit();

// URL du dépôt avec authentification via le token GitHub
const remoteUrl = `https://${process.env.GITHUB_TOKEN}@github.com/Sidibe8/https://github.com/Sidibe8/sugu.git`; // Remplace <USERNAME> et <REPO>

// Fonction pour pousser un fichier
const pushFileToGitHub = async (filePath) => {
  try {
    // Configure le dépôt distant si ce n'est pas encore fait
    await git.addRemote('origin', remoteUrl).catch(() => console.log('Remote already exists'));

    // Ajoute le fichier au suivi Git
    await git.add(filePath);
    console.log(`File added to Git: ${filePath}`);

    // Crée un commit
    await git.commit(`Add new file: ${filePath}`);
    console.log(`Committed: ${filePath}`);

    // Pousse les modifications vers le dépôt distant
    await git.push('origin', 'main'); // Remplace 'main' par ta branche si nécessaire
    console.log(`File successfully pushed to GitHub!`);
  } catch (err) {
    console.error('Error while pushing file to GitHub:', err.message);
  }
};

module.exports = { pushFileToGitHub };
