   let appleCount = 0;
   //поле
   const canvas = document.getElementById('game'),

   //двухмерный контент
   context = canvas.getContext('2d'),

   //размер 1 клетки на поле = 16пикселей
   grid = 16;

   //скорость змейки
   let count = 0,

   //змейка
    snake = {
       //начальные координаты
       x: 160,
       y: 160,
       // Скорость змейки — в каждом новом кадре змейка смещается по оси Х или У. 
       //На старте будет двигаться горизонтально, поэтому скорость по игреку равна нулю.
       dx: grid,
       dy: 0,
       //хвост. пока пустой
       cells: [],
       //стартовая длина = 4
       maxCells: 4
   };

//то, что змейка кушает
const apple = {
   x: 320,
   y: 320
};



// Делаем генератор случайных чисел в заданном диапазоне
//получаем на вход два числа и получаем рандомное в этом диапазоне.
function getRandomInt(min, max) {
   return Math.floor(Math.random() * (max - min)) + min;
}


// Игровой цикл — основной процесс, внутри которого будет всё происходить 
function loop() {
    requestAnimationFrame(loop);
   // Дальше будет хитрая функция, которая замедляет скорость игры с 60 кадров в секунду до 15.
   // Для этого она пропускает три кадра из четырёх, то есть срабатывает каждый четвёртый кадр игры.
   // Было 60 кадров в секунду, станет 15
   // requestAnimationFrame(loop);

   // Игровой код выполнится только один раз из четырёх, в этом и суть замедления кадров,
   // а пока переменная count меньше четырёх, код выполняться не будет.
   if (++count < 4) {
       return;
   }

   // Обнуляем переменную скорости 
   count = 0;

   // Очищаем игровое поле
   context.clearRect(0, 0, canvas.width, canvas.height);

   // Двигаем змейку с нужной скоростью
   snake.x += snake.dx;
   snake.y += snake.dy;

   // Если змейка достигла края поля по горизонтали — продолжаем её движение с противоположной стороны
   if (snake.x < 0) {
       snake.x = canvas.width - grid;
   } else if (snake.x >= canvas.width) {
       snake.x = 0;
   }

   // Делаем то же самое для движения по вертикали 
   if (snake.y < 0) {
       snake.y = canvas.height - grid;
   } else if (snake.y >= canvas.height) {
       snake.y = 0;
   }

   // Продолжаем двигаться в выбранном направлении.
   // Голова всегда впереди, поэтому добавляем её координаты в начало массива, который отвечает за всю змейку. 
   snake.cells.unshift({
       x: snake.x,
       y: snake.y
   });

   // Сразу после этого удаляем последний элемент из массива змейки,
   // потому что она движется и постоянно особождает клетки после себя 
   if (snake.cells.length > snake.maxCells) {
       snake.cells.pop();
   }

   // Рисуем еду — красное яблоко
   context.fillStyle = 'red';
   context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

   // Одно движение змейки — один новый нарисованный квадратик
   context.fillStyle = 'green';

   // Обрабатываем каждый элемент змейки
   snake.cells.forEach(function (cell, index) {

       // Чтобы создать эффект клеточек, делаем зелёные квадратики меньше на один пиксель, 
       //чтобы вокруг них образовалась чёрная граница
       context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

       // Если змейка добралась до яблока...
       if (cell.x === apple.x && cell.y === apple.y) {
        
           // увеличиваем длину змейки
           snake.maxCells++;
           appleCount++;
           localStorage.setItem('score', appleCount);
           localStorage.setItem('best', appleCount);
           score.innerHTML = `SCORE: ${localStorage.getItem('score')}`;
           // Рисуем новое яблочко
           // Помним, что размер холста у нас 400x400, при этом он разбит на ячейки — 25 в каждую сторону
           apple.x = getRandomInt(0, 25) * grid;
           apple.y = getRandomInt(0, 25) * grid;
       }
       // Проверяем, не столкнулась ли змея сама с собой 
       // Для этого перебираем весь массив и смотрим,
       // есть ли у нас в массиве змейки две клетки с одинаковыми координатами 
       for (var i = index + 1; i < snake.cells.length; i++) {
           // Если такие клетки есть — начинаем игру заново 
           if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
               // Задаём стартовые параметры основным переменным 
               
               snake.x = 160;
               snake.y = 160;
               snake.cells = [];
               snake.maxCells = 4;
               snake.dx = grid;
               snake.dy = 0;
               appleCount = 0;
               // Ставим яблочко в случайное место 
               apple.x = getRandomInt(0, 25) * grid;
               apple.y = getRandomInt(0, 25) * grid;
               
           }
       }
   });


}






//управление

// Смотрим, какие нажимаются клавиши, и реагируем на них нужным образом
document.addEventListener('keydown', function (e) {
   // Дополнительно проверяем такой момент: если змейка движется, например, влево,
   // то ещё одно нажатие влево или вправо ничего не поменяет — змейка продолжит двигаться в ту же сторону,
   // что и раньше. Это сделано для того, чтобы не разворачивать весь массив со змейкой 
   //на лету и не усложнять код игры.

   // Стрелка влево
   // Если нажата стрелка влево, и при этом змейка никуда не движется по горизонтали…
   if (e.which === 37 && snake.dx === 0) {
       // то даём ей движение по горизонтали, влево, а вертикальное — останавливаем
       // Та же самая логика будет и в остальных кнопках
       snake.dx = -grid;
       snake.dy = 0;
   }
   // Стрелка вверх
   else if (e.which === 38 && snake.dy === 0) {
       snake.dy = -grid;
       snake.dx = 0;
   }
   // Стрелка вправо
   else if (e.which === 39 && snake.dx === 0) {
       snake.dx = grid;
       snake.dy = 0;
   }
   // Стрелка вниз
   else if (e.which === 40 && snake.dy === 0) {
       snake.dy = grid;
       snake.dx = 0;
   }
});




// дорабатываю

// const board = document.querySelector('.board');
// var score = document.createElement('h1');
// score.innerHTML = `SCORE: ${localStorage.getItem('score')}`;
// board.prepend(score);
let score = document.getElementById('score');
score.innerHTML = `SCORE: ${localStorage.getItem('score')}`;

let best = document.getElementById('best');
best.innerHTML = `BEST: ${localStorage.getItem('best')}`;

const play = document.getElementById('play');

    play.addEventListener('click', () => {
        localStorage.setItem('score', 0);
        count = 0;
        requestAnimationFrame(loop);
    });

    // localStorage.setItem('best', appleCount);
    // if (localStorage.best < appleCount) {
    //     localStorage.setItem('best', appleCount);
    // }