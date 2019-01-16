$(document).ready(function(){

document.body.onmousedown = function() { return false; } //so page is unselectable

    //Canvas element  is stored to the canvas variable .The ctx variable is used to store the 2d rendering context
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext("2d");
    //The below variables are used to define the canvas and screen
    var w = $("#canvas").width();
    var h = $("#canvas").height();
    //The below variables are used to define the canvas and game dimensions
    var b2w = 200;
    var b2h = 50;
    var b2x= w/2-(b2w/2);
    var b2y= h/2-(b2h/2)+200;
    var mx, my;
    var maxH = 0;
    // The below variables are used to define the ball dimensions and defining the bar's dimensions
    var Radiusofball = 10;
    var barHeight = 10;
    var barWidth = 75;
    var barX1 = (canvas.width-barWidth)/2;
    //Setting up the variables to define bricks width,height,number of rows and columns of bricks and the spacing between them
    var RowbrickCnt = 7;
    var ColumnbrickCnt = 10;
    var Widthofbrick = 75;
    var Heightofbrick = 20;
    var Paddingofbrick = 10;
    var brickofsT = 30;
    var brickofsL = 30;
    //Intial defination of the tally, timer and screen fields is set to zero
    var tally = 0;
    var Chances = 3;
    var screen= 0;
    var timer = 0;
    //keypress variables
    var rightArrowPress = false;
    var leftArrowPress = false;


    var image = new Image();
    image.src='atomcollision.jpg';

    function draw(n){
        ctx.drawImage(image,w/4 + 150/n - 10, h/4 + 150/n - 50, 80/n *10, 80/n *10 );
        if(n<8) //base case - when n is less than 8 draw
            draw(n+1);// recursive case will run if n is less than 8
    }


    //defining the brick object
    function Brick(x,y){
        this.x = x;
        this.y = y;
        this.status = 1;
    }

    //creating array of bricks
    var bricks = [];
    for(c=0; c<ColumnbrickCnt; c++) {
        bricks[c] = [];
        for(r=0; r<RowbrickCnt; r++) {
            var brickX = (r*(Widthofbrick+Paddingofbrick))+brickofsL;
            var brickY = (c*(Heightofbrick+Paddingofbrick))+brickofsT;
            bricks[c][r] = new Brick(brickX, brickY);
        }
    }
    //defining ball object
    function Ball(x, y, sx, sy){
        this.x = x;
        this.y = y;
        this.sx = sx;
        this.sy = sy;
    }
    // creating ball array
    var balls = [];
    balls.push(new Ball(canvas.width/2, canvas.height-30, 2, -2));





    /////////////////////////////////
    ////////////////////////////////
    ////////    GAME INIT
    /////// Runs this code right away, as soon as the page loads.
    //////  Use this code to get everything in order before your game starts
    //////////////////////////////
    /////////////////////////////
    function init()
    {


    //////////
    ///STATE VARIABLES

    //////////////////////
    ///GAME ENGINE START
    //  This starts your game/program
    //  "paint is the piece of code that runs over and over again, so put all the stuff you want to draw in here
    //  "60" sets how fast things should go
    //  Once you choose a good speed for your program, you will never need to update this file ever again.

    if(typeof game_loop != "undefined") clearInterval(game_loop);
        game_loop = setInterval(paint, 15);
    }

    init();


     screen=0; //setting the start screen to 0


    ///////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    ////////    Main Game Engine
    ////////////////////////////////////////////////////
    ///////////////////////////////////////////////////
    function paint()
    {

        if (screen==0){
            //creating start button
            ctx.fillStyle = 'yellow';
            ctx.fillRect(0,0, w, h);
            ctx.fillStyle = 'blue';
            ctx.fillRect(b2x-200,b2y-50,b2w-60,b2h);
            ctx.font="50px sans";
            ctx.fillStyle = 'white';
            ctx.fillText("Start",b2x-180,b2y-10);
            draw(0);

            ctx.fillStyle = 'black';
            ctx.font="70px sans";
            ctx.fillText("BRICK BREAKER",40,80);
            ctx.fillStyle = 'yellow';
        }

        else if (screen==1){
        //this portion which makes the bricks move down as time increases
            timer += 1
            if (timer > 1000){
                timer = timer % 1000; //start and reset every 1000 frames
                for (var x = 0; x < bricks.length; x++){
                    for (var y = 0; y < bricks[x].length; y++){
                        bricks[x][y].y += 50;
                        }
                }
            }

            if (Math.floor(Math.random() * 1700) == 3){
                balls.push(new Ball(canvas.width/2, canvas.height-30, 2, -2));//pushes new ball when Math.random muliplied by 1700 equals 1
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            maxH = drawBricks();
            //if the brick position is canvas.height-20 the page will alert gameover
            if(maxH >= (canvas.height-20)) {
                alert("You lose");
                document.location.reload();
            }
            drawBars();
            drawtally();
            drawChances();

            for (var i = 0; i < balls.length; i++){
                balls[i] = collisionDetection(balls[i]);
                drawBall(balls[i]);
                if(balls[i].x + balls[i].sx > canvas.width-Radiusofball || balls[i].x + balls[i].sx < Radiusofball) {
                    balls[i].sx = -balls[i].sx;
                }
                if(balls[i].y + balls[i].sy < Radiusofball) {
                    balls[i].sy = -balls[i].sy;
                }
                else if(balls[i].y + balls[i].sy > canvas.height-Radiusofball) {
                    if(balls[i].x > barX1 && balls[i].x < barX1 + barWidth) {
                        balls[i].sy = -balls[i].sy;
                    }
                        else {
                            Chances--;
                            if(!Chances) {
                                alert("You lose");
                                document.location.reload();
                            }
                            else {
                                balls = [];
                                balls.push(new Ball(canvas.width/2, canvas.height-30, 2, -2));
                                barX1 = (canvas.width-barWidth)/2;
                                break;
                            }
                        }
                }
                    balls[i].x += balls[i].sx;
                    balls[i].y += balls[i].sy;
            }

                if(rightArrowPress && barX1 < canvas.width-barWidth) {
                    barX1 += 6;
                }
                else if(leftArrowPress && barX1 > 0) {
                    barX1 -= 6;
                }
          }
    }////////////////////////////////////////////////////////////////////////////////END PAINT/ GAME ENGINE

    function drawBall(ball) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, Radiusofball, 0, Math.PI*2);
        ctx.fillStyle = "yellow";
        ctx.fill();
        ctx.closePath();
    }
    function drawBars() {
        ctx.beginPath();
        ctx.rect(barX1, canvas.height-barHeight, barWidth, barHeight);
        ctx.fillStyle = "yellow";
        ctx.fill();
        ctx.closePath();
    }
    //Logic for Brick drawing in which the position of x is set by looping through the rows
    //and columns  parameters .position of y is set by looping through the width and height parameters
    //By calculating the exact positions of the bricks while painting the canvas each brick is placed in such
    // a manner that it has padding in between
   function drawBricks() {
        var lMaxH = 0;
        for(c=0; c<ColumnbrickCnt; c++) {
            for(r=0; r<RowbrickCnt; r++) {
                if(bricks[c][r].status == 1) {
                    ctx.beginPath();
                    ctx.rect(bricks[c][r].x, bricks[c][r].y, Widthofbrick, Heightofbrick);
                    ctx.fillStyle = "red";
                    ctx.fill();
                    ctx.closePath();

                    if (bricks[c][r].y > lMaxH) {
                        lMaxH = bricks[c][r].y;
                    }

                }
            }
        }

       return lMaxH;
    }
    function collisionDetection(ball) {
        for(c=0; c<ColumnbrickCnt; c++) {
            for(r=0; r<RowbrickCnt; r++) {
                var b = bricks[c][r];
                if(b.status == 1) {
                    if(ball.x > b.x && ball.x < b.x+Widthofbrick && ball.y > b.y && ball.y < b.y+Heightofbrick) {
                        ball.sy = -ball.sy;
                        b.status = 0;
                        tally++;
                        if(tally == RowbrickCnt*ColumnbrickCnt) {
                            alert("You have won, Hazaaaa!");
                            document.location.reload();
                        }
                    }
                }
            }
        }
        return ball;
    }

    function drawChances() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "yellow";
        ctx.fillText("Chances: "+Chances, canvas.width-95, 20);
    }

    function drawtally() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "yellow";
        ctx.fillText("Tally: "+tally, 8, 20);
    }



    ////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////
    /////   MOUSE LISTENER
    //////////////////////////////////////////////////////
    /////////////////////////////////////////////////////






    /////////////////
    // Mouse Click
    ///////////////
    canvas.addEventListener('click', function (evt){
        //screen++;
        console.log(evt);
        // if (mx > b2x && mx < b2x + b2w && my > b2y && my <b2y + b2h ) {
        if (b2x === 220 && b2y === 302) { 
            console.log('here');
            screen++;
        }else {
          screen++;
          console.log('outslide');
          console.log(b2x + 'b2x');
          console.log(b2y + 'b2y');
          console.log(mx + 'mx');
          console.log(my + 'my');

        }

        if (screen > 2)screen=0;

    }, false);

    function getMousePos(canvas, evt)
    {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
            };
    }

     document.addEventListener("mousemove", mouseMoveHandler, false);
     //The mouse cursor is set by calculating the value of relativeX . This value is calculated as
     //the difference between the
     // horizontal mouse position and the distance between the left edge of canvas and viewport
    function mouseMoveHandler(a) {
        var Xrelative = a.clientX - canvas.offsetLeft;
        if(Xrelative > 0 && Xrelative < canvas.width) {
            barX1 = Xrelative - barWidth/2;
        }
    }

    ///////////////////////////////////
    //////////////////////////////////
    ////////    KEY BOARD INPUT
    ////////////////////////////////




    document.addEventListener("keydown", keyDownHandler, false);
    //When the keydown event is fired on the keyboard (when it is pressed) this function is executed
    function keyDownHandler(a) {
        if(a.keyInput == 39) {
            rightArrowPress = true;
        }
        else if(a.keyInput == 37) {
            leftArrowPress = true;
        }
    }
    document.addEventListener("keyup", keyUpHandler, false);
    //Executed when the up key is pressed
    function keyUpHandler(a) {
        if(a.keyInput == 39) {
            rightArrowPress = false;
        }
        else if(a.keyInput == 37) {
            leftArrowPress = false;
        }
    }



})
