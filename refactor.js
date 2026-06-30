const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'public');

const cssLinks = `
    <link rel="stylesheet" href="css/variables.css">
    <link rel="stylesheet" href="css/base.css">
    <link rel="stylesheet" href="css/layout.css">
    <link rel="stylesheet" href="css/components.css">
`;

const jsScript = `    <script type="module" src="js/app.js"></script>\n</body>`;

const files = fs.readdirSync(directoryPath).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(directoryPath, file), 'utf8');
    
    // Replace old css link
    content = content.replace(/<link rel="stylesheet" href="styles\.css">/g, cssLinks);
    
    // Replace links
    content = content.replace(/pedidos\.html/g, 'carrito.html');
    content = content.replace(/registrar\.html/g, 'registro.html');
    
    // Add IDs to nav links
    content = content.replace(/<a href="login\.html">Mi Perfil<\/a>/g, '<a href="login.html" id="nav-profile">Mi Perfil</a>');
    content = content.replace(/<a href="registro\.html">Registro<\/a>/g, '<a href="registro.html" id="nav-register">Registro</a>');
    
    // Inject module script
    if(!content.includes('js/app.js')) {
        // remove old inline scripts in menu.html and ofertas.html if any
        content = content.replace(/<script>[\s\S]*?<\/script>/g, '');
        content = content.replace(/<\/body>/g, jsScript);
    }

    fs.writeFileSync(path.join(directoryPath, file), content);
});

// Rename files
if (fs.existsSync(path.join(directoryPath, 'pedidos.html'))) {
    fs.renameSync(path.join(directoryPath, 'pedidos.html'), path.join(directoryPath, 'carrito.html'));
}
if (fs.existsSync(path.join(directoryPath, 'registrar.html'))) {
    fs.renameSync(path.join(directoryPath, 'registrar.html'), path.join(directoryPath, 'registro.html'));
}

console.log('Refactoring complete');
