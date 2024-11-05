import fs from 'fs';
import path from 'path';

class TemplateManager {
  constructor() {
    this.templatesDir = path.join(process.cwd(), 'templates');
    this.profilesDir = path.join(process.cwd(), 'profiles');
    
    // Ensure directories exist
    this.ensureDirectories();
  }

  ensureDirectories() {
    [this.templatesDir, this.profilesDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  // Offline template management
  listTemplates() {
    return fs.readdirSync(this.templatesDir)
      .filter(file => file.endsWith('.md'))
      .map(file => path.basename(file, '.md'));
  }

  loadTemplate(templateName) {
    const templatePath = path.join(this.templatesDir, `${templateName}.md`);
    
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template ${templateName} not found`);
    }
    
    return fs.readFileSync(templatePath, 'utf-8');
  }

  saveTemplate(templateName, content) {
    const templatePath = path.join(this.templatesDir, `${templateName}.md`);
    fs.writeFileSync(templatePath, content);
  }

  // Personalization profile management
  saveProfile(profileName, profileData) {
    const profilePath = path.join(this.profilesDir, `${profileName}.json`);
    fs.writeFileSync(profilePath, JSON.stringify(profileData, null, 2));
  }

  loadProfile(profileName) {
    const profilePath = path.join(this.profilesDir, `${profileName}.json`);
    
    if (!fs.existsSync(profilePath)) {
      throw new Error(`Profile ${profileName} not found`);
    }
    
    return JSON.parse(fs.readFileSync(profilePath, 'utf-8'));
  }

  listProfiles() {
    return fs.readdirSync(this.profilesDir)
      .filter(file => file.endsWith('.json'))
      .map(file => path.basename(file, '.json'));
  }

  // Template personalization
  generateReadme(templateName, profileName) {
    const template = this.loadTemplate(templateName);
    const profile = this.loadProfile(profileName);

    // Simple template replacement
    return Object.entries(profile).reduce((readme, [key, value]) => {
      return readme.replace(`{{${key}}}`, value);
    }, template);
  }

  // Advanced template creation
  createCustomTemplate(name, sections) {
    const templateContent = sections.map(section => 
      `## ${section.title}\n${section.content}`
    ).join('\n\n');

    this.saveTemplate(name, templateContent);
  }
}

export default new TemplateManager();
