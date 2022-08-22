import { writeFile } from "fs/promises";
import readline from "readline/promises";

const WIDTH = 800;
const HEIGHT = 800;
const COMPONENT_MAX = 255;
const OUTPUT_FILEPATH = 'output.ppm';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

/**
 * @typedef {{r:number, g:number, b:number}} Pixel
 * @type {Pixel[][]}
 */
const pixels = Array(WIDTH).fill(
    Array(HEIGHT).fill(
        { r: 0, g: 0, b: 100 }
    )
);

function randomPoint() {
    const x = Math.floor(Math.random() * WIDTH);
    const y = Math.floor(Math.random() * HEIGHT);
    return { x, y };
}

async function seedSetup() {
    const seedInput = await rl.question('How many seeds for the Voronoi diagram? ');
    const seedCount = parseInt(seedInput.trim());
    if (isNaN(seedCount)) throw new Error("Invalid seed input: exiting...");
    rl.close();

    const seeds = [];
    for (let i = 0; i < seedCount; i++) {
        seeds.push(randomPoint());
    }
}

async function savePixels() {
    let fileContent = `P3 ${WIDTH} ${HEIGHT} ${COMPONENT_MAX}\n`;
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < HEIGHT; x++) {
            const px = pixels[y][x];
            fileContent += `${px.r} ${px.g} ${px.b}\n`;
        }
    }
    writeFile(OUTPUT_FILEPATH, fileContent);
}

async function main() {
    await seedSetup();
    await savePixels();
}

main();
