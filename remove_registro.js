const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'public');
const files = fs.readdirSync(directoryPath).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(directoryPath, file), 'utf8');
    
    // Remove the registration link from the nav bar
    content = content.replace(/<li><a href="registro\.html" id="nav-register">Registro<\/a><\/li>/g, '');
    
    fs.writeFileSync(path.join(directoryPath, file), content);
});

// Delete registro.html if it exists
if (fs.existsSync(path.join(directoryPath, 'registro.html'))) {
    fs.unlinkSync(path.join(directoryPath, 'registro.html'));
}

console.log('Removed nav-register and registro.html');
