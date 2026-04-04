#!/usr/bin/env bun
// Interactive Skill Runner - CLI interface for career intelligence skills

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { resolve, join } from 'path';
import { spawn } from 'child_process';

class SkillRunner {
    constructor() {
        this.skillsDir = resolve(import.meta.dir, '../skills');
        this.availableSkills = this.loadAvailableSkills();
    }

    // Load available skills from directory
    loadAvailableSkills() {
        const skills = {};

        try {
            const skillDirs = readdirSync(this.skillsDir, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name);

            skillDirs.forEach(skillName => {
                const skillPath = join(this.skillsDir, skillName);
                const skillFile = join(skillPath, 'SKILL.md');

                if (existsSync(skillFile)) {
                    const content = readFileSync(skillFile, 'utf8');
                    const descMatch = content.match(/description:\s*(.+)/);

                    skills[skillName] = {
                        name: skillName,
                        description: descMatch ? descMatch[1] : 'No description available',
                        path: skillPath,
                        scripts: this.loadSkillScripts(skillPath)
                    };
                }
            });
        } catch (error) {
            console.error('Warning: Could not load skills directory:', error.message);
        }

        return skills;
    }

    // Load scripts available for a skill
    loadSkillScripts(skillPath) {
        const scripts = {};
        const scriptsDir = join(skillPath, 'scripts');

        if (existsSync(scriptsDir)) {
            try {
                const files = readdirSync(scriptsDir);
                files.filter(f => f.endsWith('.js')).forEach(file => {
                    scripts[file.replace('.js', '')] = join(scriptsDir, file);
                });
            } catch (error) {
                // Scripts directory exists but can't read it
            }
        }

        return scripts;
    }

    // Display available skills
    displaySkills() {
        console.log('🎯 Career Intelligence Plugin - Available Skills\n');

        Object.values(this.availableSkills).forEach((skill, index) => {
            const hasScripts = Object.keys(skill.scripts).length > 0;
            const scriptInfo = hasScripts ? `(${Object.keys(skill.scripts).length} scripts)` : '';

            console.log(`${index + 1}. ${skill.name} ${scriptInfo}`);
            console.log(`   ${skill.description}\n`);
        });
    }

    // Interactive skill selection
    async promptSkillSelection() {
        this.displaySkills();

        console.log('Select a skill to run:');
        const skillNames = Object.keys(this.availableSkills);

        skillNames.forEach((name, index) => {
            console.log(`  ${index + 1}) ${name}`);
        });

        console.log(`  q) Quit\n`);

        // Simulate user input (in real CLI, this would use readline)
        return new Promise((resolve) => {
            process.stdin.once('data', (input) => {
                const choice = input.toString().trim();

                if (choice.toLowerCase() === 'q') {
                    resolve(null);
                    return;
                }

                const skillIndex = parseInt(choice) - 1;
                if (skillIndex >= 0 && skillIndex < skillNames.length) {
                    resolve(skillNames[skillIndex]);
                } else {
                    console.log('❌ Invalid selection. Please try again.');
                    resolve(this.promptSkillSelection());
                }
            });
        });
    }

    // Run specific skill
    async runSkill(skillName, args = []) {
        const skill = this.availableSkills[skillName];

        if (!skill) {
            console.error(`❌ Skill '${skillName}' not found`);
            return false;
        }

        console.log(`🚀 Running skill: ${skillName}`);
        console.log(`📝 ${skill.description}\n`);

        // Check if skill has scripts
        if (Object.keys(skill.scripts).length > 0) {
            console.log('Available scripts:');
            Object.entries(skill.scripts).forEach(([scriptName, scriptPath]) => {
                console.log(`  • ${scriptName}: ${scriptPath}`);
            });

            // If specific script requested
            if (args.length > 0 && skill.scripts[args[0]]) {
                return this.runSkillScript(skill.scripts[args[0]], args.slice(1));
            }

            // If only one script, run it automatically
            if (Object.keys(skill.scripts).length === 1) {
                const [scriptName, scriptPath] = Object.entries(skill.scripts)[0];
                console.log(`\n⚡ Auto-running: ${scriptName}`);
                return this.runSkillScript(scriptPath, args);
            }
        }

        // No scripts or multiple scripts - show guidance
        console.log(`💡 Guidance for using ${skillName}:`);
        console.log('   This skill is designed to be used within Claude Code interface.');
        console.log(`   Run: /career-intelligence-plugin:${skillName}`);

        if (Object.keys(skill.scripts).length > 0) {
            console.log('\n   Or run specific scripts:');
            Object.entries(skill.scripts).forEach(([scriptName, scriptPath]) => {
                console.log(`   bun ${scriptPath} [args]`);
            });
        }

        return true;
    }

    // Execute skill script
    runSkillScript(scriptPath, args = []) {
        return new Promise((resolve) => {
            console.log(`📦 Executing: bun ${scriptPath} ${args.join(' ')}\n`);

            const child = spawn('bun', [scriptPath, ...args], {
                stdio: 'inherit',
                cwd: process.cwd()
            });

            child.on('close', (code) => {
                if (code === 0) {
                    console.log('\n✅ Script completed successfully');
                    resolve(true);
                } else {
                    console.log(`\n❌ Script exited with code ${code}`);
                    resolve(false);
                }
            });

            child.on('error', (error) => {
                console.error(`❌ Error running script: ${error.message}`);
                resolve(false);
            });
        });
    }

    // Interactive mode
    async interactiveMode() {
        console.log('🎯 Career Intelligence Plugin - Interactive Mode\n');

        while (true) {
            const skillName = await this.promptSkillSelection();

            if (!skillName) {
                console.log('👋 Goodbye!');
                break;
            }

            await this.runSkill(skillName);
            console.log('\n' + '='.repeat(50) + '\n');
        }
    }

    // Generate skill usage examples
    generateExamples() {
        console.log('📚 Usage Examples:\n');

        Object.entries(this.availableSkills).forEach(([skillName, skill]) => {
            console.log(`# ${skillName}`);
            console.log(`/${skillName}  # Run in Claude Code`);

            if (Object.keys(skill.scripts).length > 0) {
                Object.entries(skill.scripts).forEach(([scriptName, scriptPath]) => {
                    const relativePath = scriptPath.replace(process.cwd(), '.');
                    console.log(`bun ${relativePath} [args]  # Direct script execution`);
                });
            }
            console.log();
        });
    }

    // Check skill health (dependencies, files, etc.)
    checkSkillHealth(skillName = null) {
        const skillsToCheck = skillName ? [skillName] : Object.keys(this.availableSkills);
        const healthReport = {};

        skillsToCheck.forEach(name => {
            const skill = this.availableSkills[name];
            if (!skill) {
                healthReport[name] = { status: 'not_found' };
                return;
            }

            const health = {
                status: 'healthy',
                issues: [],
                scripts: Object.keys(skill.scripts).length,
                path: skill.path
            };

            // Check if SKILL.md exists and is valid
            const skillFile = join(skill.path, 'SKILL.md');
            if (!existsSync(skillFile)) {
                health.status = 'unhealthy';
                health.issues.push('Missing SKILL.md file');
            }

            // Check scripts
            Object.entries(skill.scripts).forEach(([scriptName, scriptPath]) => {
                if (!existsSync(scriptPath)) {
                    health.issues.push(`Missing script: ${scriptName}`);
                    health.status = 'unhealthy';
                }
            });

            healthReport[name] = health;
        });

        return healthReport;
    }

    // Display health report
    displayHealthReport(skillName = null) {
        const healthReport = this.checkSkillHealth(skillName);

        console.log('🏥 Skill Health Report\n');

        Object.entries(healthReport).forEach(([name, health]) => {
            const statusIcon = health.status === 'healthy' ? '✅' :
                             health.status === 'unhealthy' ? '❌' : '❓';

            console.log(`${statusIcon} ${name}`);

            if (health.scripts > 0) {
                console.log(`   📦 Scripts: ${health.scripts}`);
            }

            if (health.issues.length > 0) {
                console.log('   🚨 Issues:');
                health.issues.forEach(issue => {
                    console.log(`      • ${issue}`);
                });
            }
            console.log();
        });
    }
}

// CLI interface
if (import.meta.main) {
    const args = process.argv.slice(2);
    const runner = new SkillRunner();

    if (args.length === 0) {
        console.log(`
🎯 Career Intelligence Plugin - Skill Runner

Usage:
  bun skill-runner.js                          # Interactive mode
  bun skill-runner.js <skill-name> [args]      # Run specific skill
  bun skill-runner.js list                     # List available skills
  bun skill-runner.js health [skill-name]      # Check skill health
  bun skill-runner.js examples                 # Show usage examples

Examples:
  bun skill-runner.js                          # Interactive selection
  bun skill-runner.js resume-optimizer         # Run resume optimizer
  bun skill-runner.js profile-setup            # Run profile setup
  bun skill-runner.js health resume-optimizer  # Check specific skill
        `);

        // Start interactive mode
        runner.interactiveMode();
    } else {
        const command = args[0];

        switch (command) {
            case 'list':
                runner.displaySkills();
                break;

            case 'health':
                runner.displayHealthReport(args[1]);
                break;

            case 'examples':
                runner.generateExamples();
                break;

            default:
                // Try to run as skill name
                runner.runSkill(command, args.slice(1));
                break;
        }
    }
}

export default SkillRunner;