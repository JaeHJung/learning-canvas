"use strict";
const canvas = document.getElementById("tutorial");
const ctx = canvas.getContext("2d");

const hslGreen = `hsla(92, 100%, 50%, 1)`;
const hslGrey = `hsla(0, 0%, 45%, 1)`;

let square = 10;

canvas.addEventListener(
	"contextmenu",
	function (e) {
		e.preventDefault();
	},
	false
);
function drawGrid() {
	let canvasW = canvas.clientWidth;
	let canvasH = canvas.clientHeight;

	ctx.beginPath();
	for (let i = 0; i < canvasW + square; i += square) {
		ctx.moveTo(i + 0.5, 0);
		ctx.lineTo(i + 0.5, canvasH);
	}

	for (let i = 0; i < canvasH + square; i += square) {
		ctx.moveTo(0, i + 0.5);
		ctx.lineTo(canvasW, i + 0.5);
	}

	ctx.stroke();
}

drawGrid();
let timer = null;
let mouseDownFlag = false;
let cells = false;
canvas.addEventListener("mousedown", function (e) {
	mouseDownFlag = true;
	switch (e.button) {
		case 0:
			cells = true;
			drawCells(e);
			break;
	}
});

canvas.addEventListener("mouseup", function (e) {
	mouseDownFlag = false;
	cells = false;
});

canvas.addEventListener("mouseleave", function (e) {
	mouseDownFlag = false;
	cells = false;
});

canvas.addEventListener("mousemove", function (e) {
	if (mouseDownFlag && cells) {
		drawCells(e);
	}
});

let map = [];
let mapW = Math.floor(canvas.clientWidth / square);
let mapH = Math.floor(canvas.clientHeight / square);

let buffer = [];

// Initialize the grid in array form
for (let i = 0; i < mapW; i++) {
	map[i] = [];
	buffer[i] = [];
	for (let j = 0; j < mapH; j++) {
		map[i][j] = 0;
		buffer[i][j] = 0;
	}
}

function drawOnGrid(x, y) {
	let newX = Math.floor(x / square) * square;
	let newY = Math.floor(y / square) * square;

	ctx.fillRect(newX + 1.5, newY + 1.5, square - 1.5, square - 1.5);
}

function earseGrid() {
	for (let i = 0; i < mapW; i++) {
		for (let j = 0; j < mapH; j++) {
			let arrayCords = arrayCordToPixels(i, j);
			ctx.clearRect(
				arrayCords[0] + 1.5,
				arrayCords[1] + 1.5,
				square - 1.5,
				square - 1.5
			);
		}
	}
}

function arrayCordToPixels(x, y) {
	let pixelCordX = x * square;
	let pixelCordY = y * square;
	return [pixelCordX, pixelCordY];
}

function pixelCordToArray(x, y) {
	let arrayX = Math.floor(x / square);
	let arrayY = Math.floor(y / square);
	return [arrayX, arrayY];
}

function drawCells(e) {
	let cRect = canvas.getBoundingClientRect();
	let canvasX = Math.round(e.clientX - cRect.left);
	let canvasY = Math.round(e.clientY - cRect.top);
	ctx.fillStyle = hslGreen;
	drawOnGrid(canvasX, canvasY);
	updateMap(canvasX, canvasY, 1);
}

/* function drawWalls(e) {
	let cRect = canvas.getBoundingClientRect();
	let canvasX = Math.round(e.clientX - cRect.left);
	let canvasY = Math.round(e.clientY - cRect.top);
	ctx.fillStyle = hslGrey;
	drawOnGrid(canvasX, canvasY);
	updateMap(canvasX, canvasY, 2);
} */

function updateMap(x, y, value) {
	let newX = Math.floor(x / square) * square;
	let newY = Math.floor(y / square) * square;

	let arrayCords = pixelCordToArray(newX, newY);

	map[arrayCords[1]][arrayCords[0]] = value;
	/* console.log(map); */
}

function updateGrid() {
	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[i].length; j++) {
			checkLife(map, i, j);
		}
	}

	for (let i = 0; i < buffer.length; i++) {
		for (let j = 0; j < buffer[i].length; j++) {
			let cords = arrayCordToPixels(i, j);
			if (buffer[i][j] == 1) {
				ctx.fillStyle = hslGreen;

				drawOnGrid(cords[1], cords[0]);
			}
			if (buffer[i][j] == 0) {
				ctx.fillStyle = "White";

				drawOnGrid(cords[1], cords[0]);
			}
		}
	}
	// reset map array to zero
	for (let i = 0; i < mapW; i++) {
		for (let j = 0; j < mapH; j++) {
			map[i][j] = 0;
		}
	}

	map = JSON.parse(JSON.stringify(buffer));
	for (let i = 0; i < mapW; i++) {
		for (let j = 0; j < mapH; j++) {
			buffer[i][j] = 0;
		}
	}
}

function checkLife(array, x, y) {
	let counter = 0;
	// check Dead cells if it can spring to life
	if (array[x][y] == 0) {
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				if (
					x + i < 0 ||
					y + j < 0 ||
					x + i >= array.length ||
					y + j >= array.length ||
					(i == 0 && j == 0)
				) {
					continue;
				}

				if (array[x + i][y + j] == 1) {
					counter++;
				}
			}
		}
		if (counter == 3) {
			buffer[x][y] = 1;
		}
	}
	// check Alive cells if it will die
	if (array[x][y] == 1) {
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				if (
					x + i < 0 ||
					y + j < 0 ||
					x + i >= array.length ||
					y + j >= array.length ||
					(i == 0 && j == 0)
				) {
					continue;
				}

				if (array[x + i][y + j] == 1) {
					counter++;
				}
			}
		}
		if (counter == 2 || counter == 3) {
			buffer[x][y] = 1;
		}
	}
}

window.addEventListener("keydown", (e) => {
	updateGrid();
});
