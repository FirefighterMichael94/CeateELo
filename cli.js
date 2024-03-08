const inquirer = require('inquirer');
const fs = require('fs').promises;

class CLI {
    async run() {
        const answers = this.createLogo();
        const svg = this.generateSVG(answers.text, answers.textColor, answers.shape, answers.shapeColor);
        await this.saveSVG(svg);
        console.log("Generated logo.svg");
    }

    createLogo() {
        return inquirer.prompt([
            {
                type: 'input',
                name: 'shape',
                message: 'What shape would you like the logo to be? (circle, square, rectangle, triangle)'
            },
            {
                type: 'input',
                name: 'text',
                message: 'What letters would you like on your logo?'
            },
            {
                type: 'input',
                name: 'textColor',
                message: 'What color would you like the text to be?'
            },
            {
                type: 'input',
                name: 'shapeColor',
                message: 'What color would you like the background to be?'
            }
        ]);
        return answers;
    }

    generateSVG(text, textColor, shape, shapeColor) {
        let shapeElement;
        const centerX = 150;
        const centerY = 100;
        switch (shape) {
            case 'circle':
                shapeElement = `<circle cx="${centerX}" cy="${centerY}" r="50" fill="${shapeColor}" />`;
                break;
            case 'triangle':
                shapeElement = `<polygon points="${centerX - 50},${centerY + 50} ${centerX},${centerY - 50} ${centerX + 50},${centerY + 50}" fill="${shapeColor}" />`;
                break;
            case 'square':
                shapeElement = `<rect x="${centerX - 50}" y="${centerY - 50}" width="100" height="100" fill="${shapeColor}" />`;
                break;
            default:
                shapeElement = `<rect width="200" height="100" x="50" y="50" fill="${shapeColor}" />`;
                ;
                break;
        }
        const svg = `
          <svg version="1.1" width="300" height="200" xmlns="http://www.w3.org/2000/svg">
            ${shapeElement}
            <text x="50%" y="50%" fill="${textColor}" font-size="48" text-anchor="middle" dominant-baseline="middle">${text}</text>
          </svg>
        `;
        return svg;
    }

    async saveSVG(svg) {
        await fs.writeFile('logo.svg', svg);
    }
}

module.exports = CLI;

const cli = new CLI();
cli.run();
