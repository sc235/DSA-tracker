const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = [
    ...walk(path.join(__dirname, 'src')),
    ...walk(path.join(__dirname, 'app')),
    ...walk(path.join(__dirname, 'server')),
    path.join(__dirname, 'eslint.config.js'),
    path.join(__dirname, 'strip_comments.js'),
    path.join(__dirname, 'supabase_setup.sql')
].filter(fs.existsSync);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    if (file.endsWith('.sql')) {
        content = content.replace(/^[ \t]*--[^\n]*\r?\n/gm, '');
        content = content.replace(/[ \t]*--[^\n]*$/gm, '');
    } else {
        content = content.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
        content = content.replace(/\/\*[\s\S]*?\*\
        content = content.replace(/^[ \t]*(?<!:)\/\/[^\n]*\r?\n/gm, '');
        content = content.replace(/(?<!:)\/\/[^\n]*$/gm, '');
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log('Stripped comments from:', file);
});
