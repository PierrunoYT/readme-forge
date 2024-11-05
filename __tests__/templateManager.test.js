import fs from 'fs';
import path from 'path';
import TemplateManager from '../src/templateManager.js';

// Mock fs module
jest.mock('fs');

describe('TemplateManager', () => {
  let originalCwd;
  const mockTemplatesDir = '/mock/templates';
  const mockProfilesDir = '/mock/profiles';

  beforeEach(() => {
    // Reset mocks
    fs.existsSync.mockClear();
    fs.mkdirSync.mockClear();
    fs.readdirSync.mockClear();
    fs.readFileSync.mockClear();
    fs.writeFileSync.mockClear();

    // Mock process.cwd to return a consistent path
    originalCwd = process.cwd;
    process.cwd = jest.fn(() => '/mock/project');

    // Setup initial mock directory structure
    fs.existsSync.mockImplementation((path) => {
      return path === mockTemplatesDir || path === mockProfilesDir;
    });
  });

  afterEach(() => {
    // Restore original process.cwd
    process.cwd = originalCwd;
  });

  describe('ensureDirectories', () => {
    it('should create directories if they do not exist', () => {
      fs.existsSync.mockReturnValue(false);
      
      TemplateManager.ensureDirectories();

      expect(fs.mkdirSync).toHaveBeenCalledTimes(2);
      expect(fs.mkdirSync).toHaveBeenCalledWith(expect.stringContaining('templates'), { recursive: true });
      expect(fs.mkdirSync).toHaveBeenCalledWith(expect.stringContaining('profiles'), { recursive: true });
    });

    it('should not create directories if they already exist', () => {
      fs.existsSync.mockReturnValue(true);
      
      TemplateManager.ensureDirectories();

      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
  });

  describe('listTemplates', () => {
    it('should return list of template names', () => {
      fs.readdirSync.mockReturnValue(['template1.md', 'template2.md', 'not-a-template.txt']);
      
      const templates = TemplateManager.listTemplates();

      expect(templates).toEqual(['template1', 'template2']);
    });
  });

  describe('loadTemplate', () => {
    it('should load template content successfully', () => {
      const mockTemplateContent = '# Mock Template\n{{name}}';
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(mockTemplateContent);
      
      const template = TemplateManager.loadTemplate('mockTemplate');

      expect(template).toBe(mockTemplateContent);
    });

    it('should throw error if template does not exist', () => {
      fs.existsSync.mockReturnValue(false);
      
      expect(() => {
        TemplateManager.loadTemplate('nonexistentTemplate');
      }).toThrow('Template nonexistentTemplate not found');
    });
  });

  describe('saveTemplate', () => {
    it('should save template content', () => {
      const mockTemplateContent = '# New Template\n{{details}}';
      
      TemplateManager.saveTemplate('newTemplate', mockTemplateContent);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('newTemplate.md'), 
        mockTemplateContent
      );
    });
  });

  describe('saveProfile', () => {
    it('should save profile data', () => {
      const mockProfileData = { name: 'John Doe', skills: ['JavaScript'] };
      
      TemplateManager.saveProfile('johnDoe', mockProfileData);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('johnDoe.json'), 
        JSON.stringify(mockProfileData, null, 2)
      );
    });
  });

  describe('loadProfile', () => {
    it('should load profile data successfully', () => {
      const mockProfileData = { name: 'Jane Doe', skills: ['Python'] };
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(mockProfileData));
      
      const profile = TemplateManager.loadProfile('janeDoe');

      expect(profile).toEqual(mockProfileData);
    });

    it('should throw error if profile does not exist', () => {
      fs.existsSync.mockReturnValue(false);
      
      expect(() => {
        TemplateManager.loadProfile('nonexistentProfile');
      }).toThrow('Profile nonexistentProfile not found');
    });
  });

  describe('listProfiles', () => {
    it('should return list of profile names', () => {
      fs.readdirSync.mockReturnValue(['profile1.json', 'profile2.json', 'not-a-profile.txt']);
      
      const profiles = TemplateManager.listProfiles();

      expect(profiles).toEqual(['profile1', 'profile2']);
    });
  });

  describe('generateReadme', () => {
    it('should generate readme by replacing template placeholders', () => {
      const mockTemplate = 'Hello, my name is {{name}} and I am a {{role}}';
      const mockProfile = { name: 'Alice', role: 'Developer' };
      
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync
        .mockReturnValueOnce(mockTemplate)
        .mockReturnValueOnce(JSON.stringify(mockProfile));
      
      const readme = TemplateManager.generateReadme('mockTemplate', 'aliceProfile');

      expect(readme).toBe('Hello, my name is Alice and I am a Developer');
    });
  });

  describe('createCustomTemplate', () => {
    it('should create a custom template with sections', () => {
      const sections = [
        { title: 'About', content: 'I am a developer' },
        { title: 'Skills', content: 'JavaScript, Python' }
      ];
      
      TemplateManager.createCustomTemplate('customTemplate', sections);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('customTemplate.md'),
        '## About\nI am a developer\n\n## Skills\nJavaScript, Python'
      );
    });
  });
});
