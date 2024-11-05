const inquirer = require('inquirer');
const fs = require('fs-extra');
const TemplateManager = require('./src/templateManager');

async function main() {
    const questions = [
        {
            type: 'input',
            name: 'name',
            message: 'What is your name?'
        },
        {
            type: 'input',
            name: 'title',
            message: 'What is your professional title?'
        },
        {
            type: 'input',
            name: 'about',
            message: 'Write a brief description about yourself:'
        },
        {
            type: 'input',
            name: 'skills',
            message: 'List your skills (comma separated):'
        },
        {
            type: 'input',
            name: 'github',
            message: 'Your GitHub username:'
        }
    ];

    try {
        const answers = await inquirer.prompt(questions);
        const templateManager = new TemplateManager();
        const readme = templateManager.generateReadme(answers);
        
        await fs.writeFile('README.md', readme);
        console.log('✨ README.md has been generated successfully!');
    } catch (error) {
        console.error('Error generating README:', error);
    }
}

main();
