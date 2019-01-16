$(document).ready(function(){

document.body.onmousedown = function() { return false; } //so page is unselectable


	//Canvas stuff

	var canvas = $("#canvas")[0];

	var ctx = canvas.getContext("2d");


	var w = $("#canvas").width();

	var h = $("#canvas").height();

	var mx, my;
	
	var shot;
	shot= 0;
	var mx, my;
    var b2w = 200;
	var b2h = 50; 
	var b2x= w/2-(b2w/2);
	var b2y= h/2-(b2h/2)+200;
	var screen= 0;
	
	var timer=20;
	var win=false;
	function rand(n){

		return Math.floor(Math.random() * n)

	}

	
//Parent Class

	function Creator(){

		this.x = 0;
		this.y = 0;
		this.sx=0;	//speed x
		this.sy=0;	//speed y
		this.ax = 0;	//acceleration x
		this.ay = 0;	//acceleration y
		this.maxS = 5;	//max speed of 5
		this.move = function (){
			this.sx += this.ax;
			this.sy += this.ay;
			//move, apply acceleration and restrict speed based on terminal velocity
			if(this.sx > this.maxS) this.sx = this.maxS;
			else if(this.sx < -this.maxS) this.sx = -this.maxS;
			
			if(this.sy > this.maxS) this.sy = this.maxS;
			else if(this.sy < -this.maxS) this.sy = -this.maxS;
			
			this.x += this.sx;
			this.y += this.sy;
			
		}
		
		
		
	}

	//Child Class(1) 

	function Aliens(x,y){
		Creator.apply(this);	
		this.x = x;
		this.y = y;
		this.w=25;
		this.h=25;
	
		this.draw = function(){
			ctx.fillStyle = "purple"; 
			ctx.fillRect(this.x,this.y,this.w,this.h); 
		}
		
		this.rectangleCollision=function(obj){
			if (this.x > obj.x + obj.w) return false;
			else if (this.x + this.w < obj.x) return false;
			else if (this.y > obj.y + obj.h) return false;
			else if (this.y + this.h < obj.y) return false;
			else return true;
		}
		
		this.pseudoRectangleCollision=function(circle){	
			if (this.x > circle.x+circle.r) return false;
			else if (this.x + this.w < circle.x-circle.r) return false;
			else if (this.y > circle.y+ circle.r) return false;
			else if (this.y + this.h < circle.y-circle.r) return false;
			else return true;
		}
		
	}
	
		

	//Child Class(2) 	
	function Asteroids(){
	Creator.apply(this);	
	
		this.x = rand(w-100); 
		this.y = rand(h-100); 
		this.r=13;
		this.color = "chartreuse";		
		this.sx= rand(10); 
		this.sy=rand(10);		
		this.draw = function(){
			ctx.fillStyle="grey"; 
			ctx.beginPath();
			ctx.arc(this.x,this.y,this.r,Math.PI/7,-Math.PI/7,false);
			ctx.lineTo(this.x,this.y);
			ctx.fill();
			this.y+= this.sy;
			this.x+= this.sx;
				if( this.x > w+150||this.x<-50){ 
					this.sx *= -1;
				}
				if( this.y > h+150 || this.y <-50){ 
					this.sy *= -1;
				}
		}
			
		this.home = function(){
			if(this.x < mx) this.ax = 0.2
			else this.ax = -0.2
			
			if(this.y < my) this.ay = 0.2
			else this.ay = -0.2
		
		}
	}
	
	
	
	
	function Laserbeam(a,b){
		Creator.apply(this);
		this.x = a;
		this.y = b;
		this.shoot=false;
		this.draw = function(){
			ctx.beginPath();
			ctx.moveTo(this.x, this.y);
			ctx.lineTo(this.x + this.ax*20, this.y + this.ay * 20);
			ctx.lineWidth = 3;
			ctx.strokeStyle = 'red';
			ctx.stroke();
			ctx.closePath();
			
			ctx.globalAlpha = 0.5
			ctx.beginPath();
			ctx.moveTo(this.x, this.y);
			ctx.lineTo(this.x + this.sx*5, this.y + this.sy * 5);
			ctx.lineWidth = 3;
			ctx.strokeStyle = 'red';
			ctx.stroke();
			ctx.closePath();
			ctx.globalAlpha = 1;
		
		}
	
		this.home = function(){
			var minDist=0; 
			var nearestAsteroid=0;
			for(var i=0;i<asteroids.length-1;i++){
					if(i==0)minDist= dist( this.x, this.y, asteroids[i].x, asteroids[i].y )
					if( minDist > dist( this.x, this.y, asteroids[i+1].x, asteroids[i+1].y )){
						minDist= dist( this.x, this.y, asteroids[i+1].x, asteroids[i+1].y );
						nearestAsteroid=i+1;		
					}							
			}
			if(this.x < asteroids[nearestAsteroid].x) this.ax = 0.3;
			else this.ax = -0.3;
			
			if(this.y < asteroids[nearestAsteroid].y) this.ay = 0.5;
			else this.ay = -0.1
		}
	} 
		

	var bots= new Asteroids();

	var  laserbeams = [];

	var aliens = [];
	for (i = 0; i < 2; i++){ 

		aliens.push(new Aliens(20,20));
		
		}
	var asteroids = [];

	for(i=0;i<30;i++){
	asteroids.push(new Asteroids());
	
	}

	
	

	/////////////////////////////////

	////////////////////////////////

	////////	GAME INIT

	///////	Runs this code right away, as soon as the page loads.

	//////	Use this code to get everything in order before your game starts 

	//////////////////////////////

	/////////////////////////////

	function init()

	{

		
	 screen=0; 
		

	//////////

	///STATE VARIABLES

	

	//////////////////////

	///GAME ENGINE START

	//	This starts your game/program

	//	"paint is the piece of code that runs over and over again, so put all the stuff you want to draw in here

	//	"60" sets how fast things should go

	//	Once you choose a good speed for your program, you will never need to update this file ever again.


	if(typeof game_loop != "undefined") clearInterval(game_loop);

		game_loop = setInterval(paint, 60);

	}


	init();	

	
	function dist( p1x, p1y, p2x, p2y )
	{
  		var xs = 0;
  		var ys = 0;
 
 	 	xs = p2x - p1x;
 	 	xs = xs * xs;
 
 	 	ys = p2y - p1y;
 	 	ys = ys * ys;
 
 	 	return Math.sqrt( xs + ys );
	}

	    

	///////////////////////////////////////////////////////

	//////////////////////////////////////////////////////

	////////	Main Game Engine

	////////////////////////////////////////////////////

	///////////////////////////////////////////////////

	function paint()

	{

		if (screen==0){

		ctx.fillStyle = 'white';

		ctx.fillRect(0,0, w, h);	

		for(var i = 0; i < aliens.length; i++){ 

			aliens[i].draw();
		}
			
		for(var i = 0; i < asteroids.length; i++){ 

			asteroids[i].draw();
			
		}
		if(asteroids.length<20){
			for(i=0;i<5;i++){
				asteroids.push(new Asteroids());
	
			}
		}
		
		

		for(var i=0; i<laserbeams.length;i++){
			if(laserbeams[i].y > h) laserbeams[i].sy *= -1;
			if(laserbeams[i].x > w || laserbeams[i].x < 0) laserbeams[i].sx *= -1;
		
			laserbeams[i].home();
			laserbeams[i].move();
			laserbeams[i].draw();		
		
		if(dist(laserbeams[i].x, laserbeams[i].y, bots.x, bots.y) <50){
		
			if(bots.x< laserbeams[i].x) bots.sx = -20
			else bots.sx= 10;
			
			if(bots.y < laserbeams[i].y) bots.sy = -10
				else bots.sy = 10;
				
				laserbeams.splice(i, 1)
				i--;
		bots.home();
		bots.move();
		bots.draw();
			
			
			
		
		}
		}
	for(var i=0; i< asteroids.length; i++){
			for(var j=0; j< laserbeams.length; j++){
				if(dist(laserbeams[j].x,laserbeams[j].y, asteroids[i].x,asteroids[i].y)< asteroids[i].r){
				asteroids.splice(i,1);
				}
			}
			}
		
	timer=timer-60/1000;
	ctx.font="30px sans";
	ctx.fillText(timer.toFixed(2),b2x+20,b2y+20);
	if(timer<0){
	win=true;
	screen=1;
	}	
	
	}
	else if (screen==1){
		ctx.fillStyle = 'black';
		ctx.fillRect(0,0, w, h);
		ctx.fillStyle="red";
		ctx.fillRect(b2x,b2y,b2w,b2h);
		ctx.fillStyle="blue";
		ctx.textBaseline="hanging";
		if(!win){
			ctx.font="60px sans";
			ctx.fillText("You Lose",b2x+10,b2y-200);
		}
		else if(win){
			ctx.font="60px sans";
			ctx.fillText("You Win",b2x+10,b2y-200);
			}
		ctx.font="30px sans";
		ctx.fillText("Try Again",b2x+20,b2y+20);
		
	}
	for(var i=0; i<aliens.length; i++){
			for(var j=0;j<asteroids.length;j++){
				if(aliens[i].pseudoRectangleCollision(asteroids[j])) {
					//stuff to display when game ends
					screen=1;
				}
			}
		}
	
	}////////////////////////////////////////////////////////////////////////////////END PAINT/ GAME ENGINE

	

	

	

	////////////////////////////////////////////////////////

	///////////////////////////////////////////////////////

	/////	MOUSE LISTENER 

	//////////////////////////////////////////////////////

	/////////////////////////////////////////////////////

	



	/////////////////

	// Mouse Click

	///////////////

	canvas.addEventListener('click', function (evt){
		if (mx > b2x && mx < b2x + b2w && my > b2y && my <b2y + b2h ) {
			 screen--;
			}
		if (screen > 1)screen=0;		
			location.reload();
		
			

	}, false);


	

	


	canvas.addEventListener ('mouseout', function(){pause = true;}, false);

	canvas.addEventListener ('mouseover', function(){pause = false;}, false);


      	canvas.addEventListener('mousemove', function(evt) {

        	var mousePos = getMousePos(canvas, evt);


		mx = mousePos.x;

		my = mousePos.y;


      	}, false);



	function getMousePos(canvas, evt) 

	{

	        var rect = canvas.getBoundingClientRect();

        	return {

          		x: evt.clientX - rect.left,

          		y: evt.clientY - rect.top

        		};

      	}

      


	///////////////////////////////////

	//////////////////////////////////

	////////	KEY BOARD INPUT

	////////////////////////////////



	


	window.addEventListener('keydown', function(evt){

		var key = evt.keyCode;
	
	/////Spacebar
		laserbeams.push(new Laserbeam(aliens[0].x+12.5, aliens[0].y+12.5));

			if(laserbeams[shot].shoot==true){
				shot++;
			
			
			
			}	      
	
	
		//LEFT

	
    if(key == 37)
	{  
	
		for (var i = 0; i < aliens.length; i++){ 
      aliens[i].x -= 50;
	  }
		
        }

//RIGHT

    if(key == 39){

	for(var i = 0; i < aliens.length; i++){ 
      aliens[i].x += 50;
	  }

    }   

//DOWN 

	if(key == 40){

	for(var i = 0; i < aliens.length; i++){ 
		aliens[i].y += 50;
	}

    }   

	

//UP

	if(key == 38){

	for(var i = 0; i < aliens.length; i++){ 
		aliens[i].y -= 50;
	 }

    }   
	

	//p 80

	//r 82

	//1 49

	//2 50

	//3 51

		

	}, false);





})
