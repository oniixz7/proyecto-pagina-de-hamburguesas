const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'public');
const files = ['menu.html', 'ofertas.html', 'carrito.html', 'login.html'];

const newHeader = `        <header class="app-header">
            <div class="brand-bar">
                <i class="brand-icon"></i>
                <a class="brand" href="index.html">BurgerGO</a>
            </div>
            <nav class="main-nav" aria-label="Navegacion principal">
                <ul>
                    <li><a href="index.html">HOME</a></li>
                    <li><a href="menu.html">MENU</a></li>
                    <li><a href="ofertas.html">OFERTAS</a></li>
                    <li><a href="carrito.html">CARRITO <span class="nav-badge">0</span></a></li>
                    <li><a href="login.html" id="nav-profile">LOGIN</a></li>
                </ul>
            </nav>
        </header>`;

files.forEach(file => {
    let content = fs.readFileSync(path.join(directoryPath, file), 'utf8');
    
    // Replace the old header
    const headerRegex = /<header class="app-header">[\s\S]*?<\/header>/;
    content = content.replace(headerRegex, newHeader);
    
    // Si la pagina necesita .pattern-bg alrededor del header (opcional, vamos a poner el header siempre amarillo)
    // El css hace que el header sea amarillo. El pattern lo dejamos solo en index.html o lo ponemos en el header
    
    fs.writeFileSync(path.join(directoryPath, file), content);
});

console.log('Headers updated in all pages.');
