/*jslint white: true */
/*jslint sloppy: true */
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

var KC_LEFT = 37;
var KC_UP = 38;
var KC_RIGHT = 39;
var KC_DOWN = 40;
var KC_W = 87;
var KC_A = 65;
var KC_S = 83;
var KC_D = 68;
var KC_J = 74;
var KC_SPACE = 32;
var KC_SHIFT = 16;
var KC_ENTER = 13;

var canvasWidth = 800;
var canvasHeight = 600;
var stage;
var FPS = 30;
var btnPlay, btnInstruct, btnMenu, btnContinue;
var titleScreen, instructionScreen, gameplayScreen, gameOverScreen;
var titleContainer, instructionContainer, gameplayContainer, gameOverContainer;
var gameState;
var frameCount, gameTimer;
var mouseX, mouseY;
var GameStates = { gameTitle:0, gameInstructions:1, gamePlay:2, gameOver:3};
var queue;
manifest = [
    {src:"titleScreen.jpg", id:"titleScreen"},
    {src:"instructions.jpg", id:"instructionScreen"},
    {src:"gameOverScreen.jpg", id:"gameOverScreen"},
    {src:"gameplayArea.jpg", id:"gameplayScreen"},
    {src:"buttons.png", id:"button"},
];

/*------------------------------Setup------------------------------*/
//region Setup
function setupCanvas()
{
    var canvas = document.getElementById("game");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver();
    stage.on("stagemousemove", function(evt){ mouseX = evt.stageX.toFixed(); mouseY = evt.stageY.toFixed();});
}   

if (!!(window.addEventListener)) {
    window.addEventListener("DOMContentLoaded", main);
} else {//if using internet explorer 
    window.attatchEvent("onload", main);
}

function loadFiles()
{
    queue = new createjs.LoadQueue(true, "assets/");
    queue.on("complete", loadComplete, this);
    queue.loadManifest(manifest);
}
function loadComplete(evt)
{
    titleScreen = new createjs.Bitmap(queue.getResult("titleScreen"));
    instructionScreen = new createjs.Bitmap(queue.getResult("instructionScreen"));
    gameplayScreen = new createjs.Bitmap(queue.getResult("gameplayScreen"));
    gameOverScreen = new createjs.Bitmap(queue.getResult("gameOverScreen"));
    var buttonSheet = new createjs.SpriteSheet({
        images: [queue.getResult("button")],
        frames: {width: 93, height: 33, regX: 46, regY: 15},
        animations: {
            playUp: [0, 0, "playUp"],
            playOver: [1, 1, "playOver"],
            playDown: [2, 2, "playDown"],
            instructUp: [3, 3, "instructUp"],
            instructOver: [4, 4, "instructOver"],
            instructDown: [5, 5, "instructDown"],
            menuUp: [6, 6, "menuUp"],
            menuOver: [7, 7, "menuOver"],
            menuDown: [8, 8, "menuDown"],
            continueUp: [9, 9, "continueUp"],
            continueOver: [10, 10, "continueOver"],
            continueDown: [11, 11, "continueDown"]
        }
    });
    btnPlay = new createjs.Sprite(buttonSheet);
    btnInstruct = new createjs.Sprite(buttonSheet);
    btnMenu = new createjs.Sprite(buttonSheet);
    btnContinue = new createjs.Sprite(buttonSheet);
    
    setupButtons();
    setupTitleScreen();
    setupGameOverScreen();
    setupGameplayScreen();
    setupInstructionScreen();
}
function setupButtons()
{
    btnPlay.gotoAndPlay("playUp");
    btnPlay.on("click", function(evt) { btnPlay.gotoAndPlay("playDown"); gameState = GameStates.gamePlay; });
    btnPlay.on("mouseover", function(evt) { btnPlay.gotoAndPlay("playOver"); });
    btnPlay.on("mouseout", function(evt) { btnPlay.gotoAndPlay("playUp");});
    btnPlay.on("mousedown", function(evt) { btnPlay.gotoAndPlay("playDown");});
    
    btnInstruct.gotoAndPlay("instructUp");
    btnInstruct.on("click", function(evt) { btnInstruct.gotoAndPlay("instructDown"); gameState = GameStates.gameInstructions; });
    btnInstruct.on("mouseover", function(evt) { btnInstruct.gotoAndPlay("instructOver");});
    btnInstruct.on("mouseout", function(evt) { btnInstruct.gotoAndPlay("instructUp");});
    btnInstruct.on("mousedown", function(evt) { btnInstruct.gotoAndPlay("instructDown");});
    
    btnMenu.gotoAndPlay("menuUp");
    btnMenu.on("click", function(evt) { btnMenu.gotoAndPlay("menuDown"); gameState = GameStates.gameTitle; });
    btnMenu.on("mouseover", function(evt) { btnMenu.gotoAndPlay("menuOver");});
    btnMenu.on("mouseout", function(evt) { btnMenu.gotoAndPlay("menuUp");});
    btnMenu.on("mousedown", function(evt) { btnMenu.gotoAndPlay("menuDown");});
    
    btnContinue.gotoAndPlay("continueUp");
    btnContinue.on("click", function(evt) { btnContinue.gotoAndPlay("continueDown"); gameState = GameStates.gameTitle; });
    btnContinue.on("mouseover", function(evt) { btnContinue.gotoAndPlay("continueOver");});
    btnContinue.on("mouseout", function(evt) { btnContinue.gotoAndPlay("continueUp");});
    btnContinue.on("mousedown", function(evt) { btnContinue.gotoAndPlay("continueDown");});
}
//endregion
/*----------------------------Main Loop----------------------------*/
//region Main
function loop()
{
    gameStateAction();
    stage.update();
}

function main()
{
    setupCanvas();
    loadFiles();
    gameState = GameStates.gameTitle;
    frameCount = 0;
    gameTimer = 0;
    gameScore = 0;
    createjs.Ticker.addEventListener("tick", loop);
    createjs.Ticker.setFPS(FPS);
}

function handleKeyDown(evt)
{
    if(!evt){ var evt = window.event; }  //browser compatibility
    switch(evt.keyCode) 
    {
        case KC_LEFT:  console.log("LEFT ("+evt.keyCode+") down"); return false;
        case KC_RIGHT: console.log("RIGHT ("+evt.keyCode+") down"); return false;
        case KC_UP:    console.log("UP ("+evt.keyCode+") down"); return false;
        case KC_DOWN:  console.log("DOWN ("+evt.keyCode+") down"); return false;
        case KC_W: console.log("W ("+evt.keyCode+") down"); return false;
        case KC_A: console.log("A ("+evt.keyCode+") down"); return false;
        case KC_S: console.log("S ("+evt.keyCode+") down"); return false;
        case KC_D: console.log("D ("+evt.keyCode+") down"); return false;
        case KC_J: console.log("J ("+evt.keyCode+") down"); return false;
        case KC_SPACE:  console.log("SPACE ("+evt.keyCode+") down"); return false;
        case KC_SHIFT:  console.log("SHIFT ("+evt.keyCode+") down"); return false;
        case KC_ENTER:  console.log("ENTER ("+evt.keyCode+") down"); return false;
    }
}

function handleKeyUp(evt) 
{
    if(!evt){ var evt = window.event; }  //browser compatibility
    switch(evt.keyCode) 
    {
        case KC_LEFT:console.log("LEFT ("+evt.keyCode+") up"); break;
        case KC_RIGHT: console.log("RIGHT ("+evt.keyCode+") up"); break;
        case KC_UP:	console.log("UP ("+evt.keyCode+") up"); break;
        case KC_DOWN:	console.log("DOWN ("+evt.keyCode+") up"); break;
        case KC_W:	console.log("W ("+evt.keyCode+") up"); break;
        case KC_A:	console.log("A ("+evt.keyCode+") up"); break;
        case KC_S:	console.log("S ("+evt.keyCode+") up"); break;
        case KC_D:	console.log("D ("+evt.keyCode+") up"); break;
        case KC_J:  console.log("J ("+evt.keyCode+") up"); break;
        case KC_SPACE:	console.log("SPACE ("+evt.keyCode+") up"); break;
        case KC_SHIFT:	console.log("SHIFT ("+evt.keyCode+") up"); break;
        case KC_ENTER:  console.log("ENTER ("+evt.keyCode+") up"); break;
    }
}

function resetGameTimer()
{
    frameCount = 0;
    gameTimer = 0;
}
function runGameTimer()
{
    frameCount += 1;
    if(frameCount%(FPS/10) === 0)
    {
        gameTimer = frameCount/(FPS);
    }
}

var lastGameState;
function gameStateAction()
{
    if(gameState != lastGameState)
    {
        gameStateSwitch();
    }
    lastGameState = gameState;
    switch(gameState)
    {
        case GameStates.gameOver:
            
        break;
        case GameStates.gameTitle:
            
        break;
        case GameStates.gamePlay:
            runGameTimer();
            //if(end game condition)
            //{
            // gameState = GameStates.gameOver;
            //}
        break;
        case GameStates.gameInstructions:
            
        break;
    }
}

//run once when the game state has changed
function gameStateSwitch()
{
    switch(gameState)
    {
        case GameStates.gameOver:
            titleContainer.visible = false;
            instructionContainer.visible = false;
            gameplayContainer.visible = false;
            gameOverContainer.visible = true;
        break;
        case GameStates.gameTitle:
            titleContainer.visible = true;
            instructionContainer.visible = false;
            gameplayContainer.visible = false;
            gameOverContainer.visible = false;
        break;
        case GameStates.gamePlay:
            startGameplay();
            titleContainer.visible = false;
            instructionContainer.visible = false;
            gameplayContainer.visible = true;
            gameOverContainer.visible = false;
        break;
        case GameStates.gameInstructions:
            titleContainer.visible = false;
            instructionContainer.visible = true;
            gameplayContainer.visible = false;
            gameOverContainer.visible = false;
        break;
    }
}

//endregion
/*---------------------------Title Screen---------------------------*/
//region Title
function setupTitleScreen()
{
    btnPlay.x = canvasWidth/2;
    btnPlay.y = canvasHeight/2;
    
    btnInstruct.x = (canvasWidth/2);
    btnInstruct.y = (canvasHeight/2)+50;
    
    titleContainer = new createjs.Container();
    titleContainer.addChild(titleScreen, btnPlay, btnInstruct);
    stage.addChild(titleContainer);
    titleContainer.visible = true;
}
function resetTitle()
{
    btnPlay.x = canvasWidth/2;
    btnPlay.y = canvasHeight/2;
    
    btnInstruct.x = (canvasWidth/2);
    btnInstruct.y = (canvasHeight/2)+50;
}
//endregion
/*---------------------------Instructions---------------------------*/
//region Title
function setupInstructionScreen()
{
    btnMenu.x = canvasWidth/2;
    btnMenu.y = canvasHeight-80;
    
    instructionContainer = new createjs.Container();
    instructionContainer.addChild(instructionScreen, btnMenu);
    stage.addChild(instructionContainer);
    instructionContainer.visible = false;
}
//endregion
/*----------------------------Game Play----------------------------*/
//region Title
function setupGameplayScreen()
{
    gameplayContainer = new createjs.Container();
    gameplayContainer.addChild(gameplayScreen);
    stage.addChild(gameplayContainer);
    gameplayContainer.visible = false;
}
function startGameplay()
{
    resetGameTimer();
}
//endregion
/*----------------------------Game Over----------------------------*/
//region Title
function setupGameOverScreen()
{
    btnContinue.x = canvasWidth/2;
    btnContinue.y = canvasHeight/2+100;
    
    gameOverContainer = new createjs.Container();
    gameOverContainer.addChild(gameOverScreen, btnContinue);
    stage.addChild(gameOverContainer);
    gameOverContainer.visible = false;
}
//endregion