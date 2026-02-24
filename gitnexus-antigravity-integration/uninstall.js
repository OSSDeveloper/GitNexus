const fs = require('fs/promises');
const path = require('path');
const os = require('os');

/**
 * Uninstall Script for Google Antigravity IDE Integration
 */

async function dirExists(dirPath) {
  try {
    const stat = await fs.stat(dirPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

async function readJsonFile(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function writeJsonFile(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

async function removeMCPConfig(antigravityDir) {
  const mcpPath = path.join(antigravityDir, 'mcp_config.json');
  try {
    const existing = await readJsonFile(mcpPath);
    if (existing && existing.mcpServers && existing.mcpServers.gitnexus) {
      delete existing.mcpServers.gitnexus;
      await writeJsonFile(mcpPath, existing);
      console.log('✅ Removed GitNexus MCP Server from Antigravity');
    }
  } catch (err) {
    console.error(`❌ Failed to remove MCP config: ${err.message}`);
  }
}

async function removeSkills(antigravityDir) {
  const destSkillsDir = path.join(antigravityDir, 'skills');
  const SKILL_NAMES = ['exploring', 'debugging', 'impact-analysis', 'refactoring'];
  
  if (!(await dirExists(destSkillsDir))) return;

  try {
    let count = 0;
    for (const skillName of SKILL_NAMES) {
      const destDir = path.join(destSkillsDir, `gitnexus-${skillName}`);
      if (await dirExists(destDir)) {
        await fs.rm(destDir, { recursive: true, force: true });
        count++;
      }
    }
    if (count > 0) {
      console.log(`✅ Removed ${count} GitNexus Agent Skills`);
    }
  } catch (err) {
    console.error(`❌ Failed to remove skills: ${err.message}`);
  }
}

async function removeHooks(antigravityDir) {
  const destHooksDir = path.join(antigravityDir, 'rules');
  const hookFile = path.join(destHooksDir, 'gitnexus_pre_search_hook.md');
  
  try {
    await fs.rm(hookFile, { force: true });
    console.log(`✅ Removed GitNexus PreToolUse rules`);
  } catch (err) {
    // File likely already deleted, suppress
  }
}

async function main() {
  console.log('== GitNexus Antigravity Integration Uninstall ==\n');
  const antigravityDir = path.join(os.homedir(), '.gemini', 'antigravity');

  if (!(await dirExists(antigravityDir))) {
    return;
  }

  await removeMCPConfig(antigravityDir);
  await removeHooks(antigravityDir);
  await removeSkills(antigravityDir);
  
  console.log('\n🗑️ Uninstallation Complete.');
}

main().catch(console.error);
