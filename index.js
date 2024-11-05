#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import templateManager from './src/templateManager.js';

// Offline CLI-like interface for README generation
class ReadmeGenerator {
  constructor() {
    this.templatesDir = path.join(process.cwd(), 'templates');
    this.profilesDir = path.join(process.cwd(), 'profiles');
    this.outputDir = path.join(process.cwd(), 'output');

    this.ensureDirectories();
  }

  ensureDirectories() {
    [this.templatesDir, this.profilesDir, this.outputDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  createInitialResources() {
    // Create default templates if none exist
    const defaultTemplates = [
      {
        name: 'basic',
        content: `# {{name}}'s GitHub Profile

## About Me
{{bio}}

### My Skills
{{skills}}

### Connect with Me
- GitHub: {{githubProfile}}
- LinkedIn: {{linkedinProfile}}
`
      },
      {
        name: 'professional',
        content: `# Professional Profile: {{name}}

## Summary
{{professionalSummary}}

### Technical Expertise
{{technicalSkills}}

### Professional Experience
{{workExperience}}
`
      }
    ];

    defaultTemplates.forEach(template => {
      const templatePath = path.join(this.templatesDir, `${template.name}.md`);
      if (!fs.existsSync(templatePath)) {
        fs.writeFileSync(templatePath, template.content);
      }
    });

    // Create sample profile if none exist
    const sampleProfilePath = path.join(this.profilesDir, 'sample_profile.json');
    if (!fs.existsSync(sampleProfilePath)) {
      const sampleProfile = {
        name: 'Your Name',
        bio: 'Passionate developer creating innovative solutions',
        skills: '- JavaScript\n- Python\n- React',
        githubProfile: 'https://github.com/yourusername',
        linkedinProfile: 'https://linkedin.com/in/yourusername'
      };
      fs.writeFileSync(sampleProfilePath, JSON.stringify(sampleProfile, null, 2));
    }
  }

  listTemplates() {
    return templateManager.listTemplates();
  }

  listProfiles() {
    return templateManager.listProfiles();
  }

  generateReadme(templateName, profileName) {
    try {
      const readme = templateManager.generateReadme(templateName, profileName);
      const outputPath = path.join(this.outputDir, `README_${profileName}_${templateName}.md`);
      
      fs.writeFileSync(outputPath, readme);
      return outputPath;
    } catch (error) {
      console.error(`Error generating README: ${error.message}`);
      return null;
    }
  }

  createProfile(profileName, profileData) {
    templateManager.saveProfile(profileName, profileData);
  }

  createTemplate(templateName, sections) {
    templateManager.createCustomTemplate(templateName, sections);
  }
}

// Simple CLI handler
const generator = new ReadmeGenerator();
generator.createInitialResources();

// Basic CLI argument handling
const [,, command, ...args] = process.argv;

switch(command) {
  case 'templates':
    console.log('Available Templates:', generator.listTemplates());
    break;
  case 'profiles':
    console.log('Available Profiles:', generator.listProfiles());
    break;
  case 'generate':
    if (args.length !== 2) {
      console.log('Usage: node index.js generate <template_name> <profile_name>');
      break;
    }
    const outputPath = generator.generateReadme(args[0], args[1]);
    if (outputPath) {
      console.log(`README generated: ${outputPath}`);
    }
    break;
  default:
    console.log(`
Offline GitHub Profile README Generator

Commands:
- templates: List available templates
- profiles: List available profiles
- generate <template> <profile>: Generate a README
`);
}

export default generator;
