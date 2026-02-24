const fs = require("fs/promises");
const path = require("path");
const os = require("os");

/**
 * Setup Script for Google Antigravity IDE Integration
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
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function writeJsonFile(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

async function copyDirRecursive(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDirRecursive(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

/**
 * Merge GitNexus MCP entry safely.
 */
function mergeMcpConfig(existing) {
  if (!existing || typeof existing !== "object") existing = {};
  if (!existing.mcpServers || typeof existing.mcpServers !== "object")
    existing.mcpServers = {};

  existing.mcpServers.gitnexus = {
    command: "npx",
    args: ["-y", "gitnexus@latest", "mcp"],
  };
  return existing;
}

async function configureMCP(antigravityDir) {
  const mcpPath = path.join(antigravityDir, "mcp.json");
  try {
    const existing = await readJsonFile(mcpPath);
    const updated = mergeMcpConfig(existing);
    await writeJsonFile(mcpPath, updated);
    console.log("✅ Configured GitNexus MCP Server in Antigravity");
  } catch (err) {
    console.error(`❌ Failed to configure MCP: ${err.message}`);
  }
}

async function installSkills(antigravityDir) {
  const srcSkillsDir = path.join(__dirname, "skills");
  const destSkillsDir = path.join(antigravityDir, "skills");

  if (!(await dirExists(srcSkillsDir))) {
    console.log("⚠️ No source skills found to copy.");
    return;
  }

  try {
    const skills = await fs.readdir(srcSkillsDir);
    let count = 0;
    for (const skillFile of skills) {
      if (!skillFile.endsWith('.md')) continue;

      const skillName = path.basename(skillFile, '.md');
      const srcPath = path.join(srcSkillsDir, skillFile);
      const destDir = path.join(destSkillsDir, `gitnexus-${skillName}`);
      
      await fs.mkdir(destDir, { recursive: true });
      await fs.copyFile(srcPath, path.join(destDir, 'SKILL.md'));
      count++;
    }
    console.log(`✅ Installed ${count} GitNexus Agent Skills`);
  } catch (err) {
    console.error(`❌ Failed to install skills: ${err.message}`);
  }
}

async function installHooks(antigravityDir) {
  const srcHooksDir = path.join(
    __dirname,
    "hooks",
    "antigravity",
    ".agent",
    "rules",
  );
  const destHooksDir = path.join(antigravityDir, "rules");

  if (!(await dirExists(srcHooksDir))) {
    console.log("⚠️ No source hook rules found to copy.");
    return;
  }

  try {
    await fs.mkdir(destHooksDir, { recursive: true });
    const rules = await fs.readdir(srcHooksDir);
    let count = 0;
    for (const rule of rules) {
      if (!rule.endsWith(".md")) continue;
      await fs.copyFile(
        path.join(srcHooksDir, rule),
        path.join(destHooksDir, rule),
      );
      count++;
    }
    console.log(`✅ Installed ${count} PreToolUse Hook Rules`);
  } catch (err) {
    console.error(`❌ Failed to install hook rules: ${err.message}`);
  }
}

async function main() {
  console.log("== GitNexus Antigravity Integration Setup ==\n");
  const antigravityDir = path.join(os.homedir(), ".gemini", "antigravity");

  if (!(await dirExists(antigravityDir))) {
    console.log(
      "⚠️ Google Antigravity IDE is not installed on this system. Skipping setup.",
    );
    return;
  }

  await configureMCP(antigravityDir);
  await installHooks(antigravityDir);
  await installSkills(antigravityDir);

  console.log("\n🚀 Setup Complete. Restart Antigravity IDE to apply changes.");
}

main().catch(console.error);
