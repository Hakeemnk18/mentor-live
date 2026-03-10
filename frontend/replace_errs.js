const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
}

const featuresDir = path.join(__dirname, 'src', 'features', 'admin');
const importStmt = "import { handleApiError } from \"../../../shared/utils/handle.api.error\";\n";
const importStmt2 = "import { handleApiError } from \"../../shared/utils/handle.api.error\";\n"; // for pages
const importStmt4 = "import { handleApiError } from \"../../../../shared/utils/handle.api.error\";\n"; // for deeper components

let filesModified = 0;

walk(featuresDir, (filePath) => {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace .catch(() => toast.error(...)) or .catch((e) => toast.error(...))
  content = content.replace(/\.catch\(\s*\([^)]*\)\s*=>\s*toast\.error\([^)]*\)\s*\)/g, '.catch((err) => handleApiError(err))');

  // Replace standard catch blocks that contain toast.error(...) 
  // e.g. catch (err: any) { toast.error(...) }
  // We'll look for `catch (err_name) { ... toast.error(...) ... }`
  content = content.replace(/catch\s*\(\s*([^)]+)\s*\)\s*\{([^}]*)toast\.error\([^)]*\);?([^}]*)\}/g, (match, errArg, before, after) => {
    // If it's just replacing the toast.error line
    // e.g. catch (err: any) { \n toast.error(...); \n } 
    // We want to replace just the toast.error part with handleApiError(errTypeRemoved)
    const errName = errArg.split(':')[0].trim();
    return `catch (${errArg}) {${before}handleApiError(${errName});${after}}`;
  });

  // Catch blocks without args: catch { toast.error(...) }
  content = content.replace(/catch\s*\{([^}]*)toast\.error\([^)]*\);?([^}]*)\}/g, (match, before, after) => {
    return `catch (err) {${before}handleApiError(err);${after}}`;
  });

  if (content !== originalContent) {
    // Add import
    if (!content.includes('handleApiError')) {
      // should never happen if we just added it, but let's check if the import exists
    }
    if (!originalContent.includes('handleApiError')) {
      // Determine relative path based on file depth
      const depth = filePath.split(path.sep).length - featuresDir.split(path.sep).length;
      let importToAdd = importStmt;
      if (filePath.includes('pages\\') || filePath.includes('pages/')) {
        importToAdd = "import { handleApiError } from \"../../../shared/utils/handle.api.error\";\n";
      } else if (filePath.includes('components\\') || filePath.includes('components/')) {
        importToAdd = "import { handleApiError } from \"../../../shared/utils/handle.api.error\";\n";
      }
      
      // Inject after the last import
      const lastImportMatch = [...content.matchAll(/^import.*$/gm)].pop();
      if (lastImportMatch) {
        const insertIndex = lastImportMatch.index + lastImportMatch[0].length;
        content = content.slice(0, insertIndex) + '\n' + importToAdd + content.slice(insertIndex);
      } else {
        content = importToAdd + content;
      }
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    filesModified++;
    console.log(`Updated: ${filePath}`);
  }
});

console.log(`Total files modified: ${filesModified}`);
