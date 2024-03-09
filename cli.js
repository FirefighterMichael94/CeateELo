const inquirer = require('inquirer');
const fs = require('fs').promises;

class Shape {
    constructor(centerX, centerY, shapeColor) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.shapeColor = shapeColor;
    }

    generateSVG() {
        // This method should be implemented in subclasses
        return '';
    }
}

class Circle extends Shape {
    constructor(centerX, centerY, shapeColor, radius) {
        super(centerX, centerY, shapeColor);
        this.radius = radius;
    }

    generateSVG() {
        return `<circle cx="${this.centerX}" cy="${this.centerY}" r="${this.radius}" fill="${this.shapeColor}" />`;
    }
}

class Triangle extends Shape {
    constructor(centerX, centerY, shapeColor, sideLength) {
        super(centerX, centerY, shapeColor);
        this.sideLength = sideLength;
    }

    generateSVG() {
        const point1 = `${this.centerX},${this.centerY + this.sideLength / 2}`;
        const point2 = `${this.centerX - this.sideLength / 2},${this.centerY - this.sideLength / 2}`;
        const point3 = `${this.centerX + this.sideLength / 2},${this.centerY - this.sideLength / 2}`;
        return `<polygon points="${point1} ${point2} ${point3}" fill="${this.shapeColor}" />`;
    }
}

class Square extends Shape {
    constructor(centerX, centerY, shapeColor, sideLength) {
        super(centerX, centerY, shapeColor);
        this.sideLength = sideLength;
    }

    generateSVG() {
        return `<rect x="${this.centerX - this.sideLength / 2}" y="${this.centerY - this.sideLength / 2}" width="${this.sideLength}" height="${this.sideLength}" fill="${this.shapeColor}" />`;
    }
}

class Rectangle extends Shape {
    constructor(centerX, centerY, shapeColor, width, height) {
        super(centerX, centerY, shapeColor);
        this.width = width;
        this.height = height;
    }

    generateSVG() {
        return `<rect width="${this.width}" height="${this.height}" x="${this.centerX - this.width / 2}" y="${this.centerY - this.height / 2}" fill="${this.shapeColor}" />`;
    }
}

class CLI {
    async run() {
        const answers = await this.createLogo();
        const svg = this.generateSVG(answers.text, answers.textColor, answers.shape, answers.shapeColor);
        await this.saveSVG(svg); // Save SVG content to file
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
    }

    generateSVG(text, textColor, shape, shapeColor) {
        let shapeElement;
        switch (shape.toLowerCase()) {
            case 'circle':
                shapeElement = new Circle(150, 100, shapeColor, 50);
                break;
            case 'triangle':
                shapeElement = new Triangle(150, 100, shapeColor, 100);
                break;
            case 'square':
                shapeElement = new Square(150, 100, shapeColor, 100);
                break;
            case 'rectangle':
                shapeElement = new Rectangle(150, 100, shapeColor, 200, 100);
                break;
            default:
                throw new Error('Invalid shape');
        }
        return `<svg version="1.1" width="300" height="200" xmlns="http://www.w3.org/2000/svg">
            ${shapeElement.generateSVG()}
            <text x="50%" y="50%" fill="${textColor}" font-size="48" text-anchor="middle" dominant-baseline="middle">${text}</text>
        </svg>`;
    }

    async saveSVG(svg) {
        try {
            await fs.writeFile('logo.svg', svg);
            console.log("SVG file saved as logo.svg");
        } catch (error) {
            console.error("Error saving SVG file:", error);
        }
    }
}

module.exports = CLI;

const cli = new CLI();
cli.run();
