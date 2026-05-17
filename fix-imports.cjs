const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('../../../services') || content.includes('../../../store')) {
        content = content.replace(/\.\.\/\.\.\/\.\.\/services/g, '../../services');
        content = content.replace(/\.\.\/\.\.\/\.\.\/store/g, '../../store');
        fs.writeFileSync(fullPath, content);
        console.log('Fixed', fullPath);
      }
    }
  }
}

replaceInDir(path.join(__dirname, 'src'));
