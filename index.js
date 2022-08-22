import { writeFile } from "fs/promises";
import readline from "readline/promises";

const WIDTH = 800;
const HEIGHT = 600;
const COMPONENT_MAX = 255;
const OUTPUT_FILEPATH = 'output.ppm';
const COLORS = [
    "e71d36",
    "af4319",
    "772014",
    "3f220f",
    "19180a",
];

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

/**
 * @typedef {{r:number, g:number, b:number}} Pixel
 * @type {Pixel[][]}
 */
const pixels = [];
for (let y = 0; y < HEIGHT; y++) {
    const arr = [];
    for (let x = 0; x < WIDTH; x++) {
        arr.push({ r: 0, g: 0, b: 100 });
    }
    pixels.push(arr);
}



/**
 * @typedef {{x: number, y:number}} Vec2
 * @type {Vec2[]}
 */
const seeds = [];

function randomPoint() {
    const x = Math.floor(Math.random() * WIDTH);
    const y = Math.floor(Math.random() * HEIGHT);
    return { x, y };
}

function dist2(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return dx * dx + dy * dy;
}

/**
 * @param {string} hexString 
 * @returns {Pixel}
 */
function colorToPixel(hexString) {
    return {
        r: parseInt(hexString.substring(0, 2), 16),
        g: parseInt(hexString.substring(2, 4), 16),
        b: parseInt(hexString.substring(4, 6), 16),
    };
}

async function seedSetup() {
    const seedInput = await rl.question('How many seeds for the Voronoi diagram? ');
    const seedCount = parseInt(seedInput.trim());
    if (isNaN(seedCount)) throw new Error("Invalid seed input: exiting...");
    rl.close();

    for (let i = 0; i < seedCount; i++) {
        seeds.push(randomPoint());
    }
}

function colorDiagram() {
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            let closestSeedIndex = 0;
            let closestSeedD2 = Number.MAX_SAFE_INTEGER;

            for (let i = 0; i < seeds.length; i++) {
                const curSeed = seeds[i];
                const curSeedD2 = dist2(x, y, curSeed.x, curSeed.y);

                if (closestSeedD2 > curSeedD2) {
                    closestSeedIndex = i;
                    closestSeedD2 = curSeedD2;
                }
            }

            if (closestSeedD2 === 0) {
                pixels[y][x].r = 255;
                pixels[y][x].g = 255;
                pixels[y][x].b = 255;
            } else {
                const seedColor = COLORS[closestSeedIndex % COLORS.length];
                const { r, g, b } = colorToPixel(seedColor);

                pixels[y][x].r = r;
                pixels[y][x].g = g;
                pixels[y][x].b = b;
            }
        }
    }
}

async function savePixels() {
    let fileContent = `P3 ${WIDTH} ${HEIGHT} ${COMPONENT_MAX}\n`;

    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            const px = pixels[y][x];
            fileContent += `${px.r} ${px.g} ${px.b}\n`;
        }
    }

    await writeFile(OUTPUT_FILEPATH, fileContent);
}

async function main() {
    await seedSetup();
    colorDiagram();
    await savePixels();
}

main();
