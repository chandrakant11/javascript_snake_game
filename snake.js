const game_ground = document.getElementById("ground");
const ground_context = game_ground.getContext('2d');

const score_board = document.getElementById("borad");
const board_context = score_board.getContext('2d');

const cells_width = 10;
const cells_height = 10;

let score = 0;
let timer = '';
let total_food = 50;

let sum_eat_food = 0;
let sum_eat_candy = 11;

let snake_speed = 100;
let direction = "RIGHT";

// candy timer: 150 millisecond = 15second
let time = [];
for(i=0; i<150; i++) {
	time.push(i);
}

// keep track of all cells the snake body occupies
let snake = [];
for(let i=5; i >= 0; i--) {
	snake.push({x:i,y:25})
}

// listen to keyboard events to move the snake
document.addEventListener("keydown", function(event) {
	// left arrow key | key code of left button = 37
	if (event.keyCode == 37 && direction != "RIGHT") {direction = "LEFT";}
	// up arrow key | key code of up button = 38
	else if (event.keyCode == 38 && direction != "DOWN") {direction = "UP";}
	// right arrow key | key code of right button = 39
	else if (event.keyCode == 39 && direction != "LEFT") {direction = "RIGHT";}
	// down arrow key | key code of down button = 40
	else if (event.keyCode == 40 && direction != "UP") {direction = "DOWN";}
});

function drawSnake(x,y) {
	ground_context.fillStyle = (x == snake[0].x && y == snake[0].y)? "green" : "white";
	ground_context.fillRect(x*cells_width,y*cells_height,cells_width,cells_height);

	ground_context.strokeStyle = "gray";
	ground_context.strokeRect(x*cells_width,y*cells_height,cells_width,cells_height);
}

// get random whole numbers in a specific range(for x -direction)
function getRandomWidth() {
	return Math.floor(Math.random()*(game_ground.width/cells_width));
}

// get random whole numbers in a specific range(for y -direction)
function getRandomHeight() {
	return Math.floor(Math.random()*(game_ground.height/cells_height));
}

// food section
let food = {
    x : getRandomWidth(),
    y : getRandomHeight()
}

function drawFood(x,y) {
	ground_context.fillStyle = "red";
	ground_context.fillRect(x*cells_width, y*cells_height, cells_width, cells_height);
}

// candy section
let candy = {
    x : getRandomWidth(),
    y : getRandomHeight()
}

function drawCandy(x, y) {
	ground_context.fillStyle = "brown";
	ground_context.fillRect(x*cells_width,y*cells_height,cells_width,cells_height);
}

function candyTimer() {
	for(i=0; i< time.length; i++) {
		timer = time[i];
	}
	time.pop();
}

	// game function
	function gameFunction() {
		// refresh canvas
		ground_context.clearRect(0, 0, game_ground.width, game_ground.height);
		board_context.clearRect(0, 0, score_board.width, score_board.height);

		// call drawSnake function with paramater value
		for(let i=0; i<snake.length; i++) {
			let a = snake[i].x;
			let b = snake[i].y;
			drawSnake(a, b);
		}

		// keep track of where snake has been. front of the array is always the head
		let newHead = {
			x:snake[0].x,
			y:snake[0].y
		}
		snake.unshift(newHead);

		// snake controler
		if (direction == "RIGHT") {snake[0].x++;}
		else if (direction == "UP") {snake[0].y--;}
		else if (direction == "LEFT") {snake[0].x--;}
		else if (direction == "DOWN") {snake[0].y++;}

		// wrap snake position horizontally on edge of screen
		if(snake[0].x == 50) {snake[0].x = 0;}
		else if (snake[0].x == -1) {snake[0].x = 50;}

		// wrap snake position vertically on edge of screen
		if (snake[0].y == -1) {snake[0].y = 50;}
		else if (snake[0].y == 50) {snake[0].y = 0;}

		// draw food | drawFood() function call
		drawFood(food.x, food.y);

		// draw candy | drawCandy() function call
		if(snake.length == sum_eat_candy && time != 0) {
			drawCandy(candy.x, candy.y);
			candyTimer();

			// snake eat candy
			if(snake[0].x == candy.x && snake[0].y == candy.y) {
				// reset candy and candyTimer
				candy = {
					x : getRandomWidth(),
					y : getRandomHeight()
				}
				// reset timer
				timer = '';
				time = [];
				for(let i=0; i<150; i++) {
					time.push(i);
				}
				score += 10;
				sum_eat_candy+=6;
			}
		} else if(snake.length == sum_eat_candy && time == 0) {
			timer = '';
			time = [];
			for(let i=0; i<150; i++) {
				time.push(i);
			}
			sum_eat_candy+=6;
		} else if(snake.length != sum_eat_candy && time != 0) {
			timer = '';
			time = [0];
			sum_eat_candy+=6;
		} else if(snake.length != sum_eat_candy && time == 0) {
			timer = '';
			time = [];
			for(let i=0; i<150; i++) {
				time.push(i);
			}
			sum_eat_candy-=6;
		}

		// snake eat food
		if(snake[0].x == food.x && snake[0].y == food.y) {
			food = {
				x : getRandomWidth(),
				y : getRandomHeight()
			}
			sum_eat_food++;
			score += 5;
		} else {
			// remove snake tail as we move away from them
			snake.pop();
		}

		// snake occupies same space as a body part. Game Over
		for(let i=1; i < snake.length; i++) {
			if(snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
				clearInterval(start);
				ground_context.font = "60px Changa one";
				ground_context.fillStyle = "red";
				ground_context.fillText("Game Over",110,250);
			}
		}

		// you win
		if(sum_eat_food == total_food) {
			ground_context.fillStyle = "green";
			ground_context.font = "60px Changa one";
			ground_context.fillText("You Win",130,250);
			ground_context.fillText(`Your Score ${score}`,70,300);
			clearInterval(start);
		}

		board_context.fillStyle = "yellow";
		board_context.font = "20px Arial";
		board_context.fillText("Score:",20,180);
		board_context.fillText(score,90,180);
		board_context.font = "20px Arial";
		board_context.fillText("Food:",20,230);
		board_context.fillText(`${sum_eat_food} / ${total_food}`,80,230);
		board_context.font = "20px Arial";
		board_context.fillText("Candy Timer",20,280);
		board_context.fillText(timer,60,320);
	}

// start the game
let start =	setInterval(gameFunction, snake_speed);
