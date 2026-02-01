const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach(function (childItemName) {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

const source = "C:\\Users\\Usuario\\Documents\\DECADA DIGITAL 2025\\Joblandia\\next-portfolio\\out";
const target = "C:\\Users\\Usuario\\Documents\\DECADA DIGITAL 2025\\portfolio_definitiv";

try {
    console.log(`Starting migration from ${source} to ${target}...`);
    copyRecursiveSync(source, target);
    console.log("Migration completed successfully!");
} catch (err) {
    console.error("Migration failed:", err.message);
}
