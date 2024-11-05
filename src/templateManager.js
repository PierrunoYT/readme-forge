const marked = require('marked');

class TemplateManager {
    constructor() {
        this.defaultTemplate = `
# Hi there 👋, I'm {{name}}

## {{title}}

{{about}}

### 🛠 Skills
{{skills}}

### 📫 How to reach me:
- GitHub: [@{{github}}](https://github.com/{{github}})

### 📊 GitHub Stats
![{{name}}'s GitHub stats](https://github-readme-stats.vercel.app/api?username={{github}}&show_icons=true&theme=radical)
        `;
    }

    generateReadme(data) {
        let readme = this.defaultTemplate;
        
        // Replace template variables with actual data
        Object.keys(data).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            readme = readme.replace(regex, data[key]);
        });

        // Convert skills array to bullet points if it's a comma-separated string
        if (data.skills) {
            const skillsArray = data.skills.split(',').map(skill => skill.trim());
            const skillsList = skillsArray.map(skill => `- ${skill}`).join('\n');
            readme = readme.replace('{{skills}}', skillsList);
        }

        return readme;
    }
}

module.exports = TemplateManager;
