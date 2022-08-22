import { writeFile } from "fs/promises";
import readline from "readline/promises";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const WIDTH = 800;
const HEIGHT = 800;
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

async function main() {
    const seedInput = await rl.question('How many seeds for the Voronoi diagram?');
    const seedCount = parseInt(seedInput);
    if (isNaN(seedCount)) throw new Error("Invalid seed input: exiting...");

    const seeds = []
    for (let i = 0; i < seedCount; i++) {
        seeds.push(randomPoint());
    }

    
}

main();
