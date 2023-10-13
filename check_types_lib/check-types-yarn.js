const fs = require('fs');
const { execSync } = require('child_process');

const packageJson = JSON.parse(fs.readFileSync('../package.json', 'utf-8'));

const dependencies = Object.keys(packageJson.dependencies || {});
const devDependencies = Object.keys(packageJson.devDependencies || {});

const allDeps = [...dependencies, ...devDependencies];

async function checkAndInstallTypes() {
  for (const dep of allDeps) {
    try {
      // Check if the types for the dependency exist
      execSync(`yarn info @types/${dep} version --silent`, { stdio: 'ignore' });
      console.log(`✅  @types/${dep} exists! Installing...`);
      
      // Install the type definition using yarn
      execSync(`yarn add @types/${dep} --dev`, { stdio: 'inherit' });
      
    } catch (error) {
      console.log(`❌  @types/${dep} does NOT exist.`);
    }
  }
}

checkAndInstallTypes();
