/*jslint white: true */
/*jslint sloppy: true */
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

//----------------//
var health = 100;
var MAX_HEALTH = 100;
var fear = 0;
var MAX_FEAR = 100;
var statContainer;
var fogOfWar;
//-------------------//
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
var context;
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
var GameStates = Object.freeze({gameTitle:0, gameInstructions:1, gamePlay:2, gameOver:3});
var GameBoard = Object.freeze({tileWidth: 50, tileHeight: 50, startX: 0, startY: 50, width: 16, height: 11});
var CollisionTiles = ["forest_DirtTree", "forest_GrassTree"];
var PlayerStates = Object.freeze({idle:0, movingUp:1, movingDown: 2, movingLeft:3, movingRight:4, attacking:5});
var board;
var levels;
var queue;
var player = Player();
manifest = [
    {src:"titleScreen.jpg", id:"titleScreen"},
    {src:"instructions.jpg", id:"instructionScreen"},
    {src:"gameOverScreen.jpg", id:"gameOverScreen"},
    {src:"gameplayArea.jpg", id:"gameplayScreen"},
    {src:"buttons.png", id:"button"},
    {src:"Textures/forest_Dirt.png", id:"forest_Dirt"},
    {src:"Textures/forest_DirtPath.png", id:"forest_DirtPath"},
    {src:"Textures/forest_DirtTree.png", id:"forest_DirtTree"},
    {src:"Textures/forest_DirtyGrass.png", id:"forest_DirtyGrass"},
    {src:"Textures/forest_Grass.png", id:"forest_Grass"},
    {src:"Textures/forest_GrassPath.png", id:"forest_GrassPath"},
    {src:"Textures/forest_GrassTree.png", id:"forest_GrassTree"},
    {src:"Textures/invalid.png", id:"invalid"},
    {src:"Textures/unavailable.png", id:"unavailable"},
    {src:"Textures/default.png", id:"default"},
    {src:"Textures/forest_Exit.png", id:"forest_Exit"},
    {src:"playerKnight.png", id:"player"},
    {src:"wispSprite.png", id:"wisp"},
    {src:"level0_TileContents.csv", id:"level0_TC", type:createjs.LoadQueue.TEXT},
    {src:"level0_TileGraphics.csv", id:"level0_TG", type:createjs.LoadQueue.TEXT},
    {src:"level0_TileTriggers.csv", id:"level0_TT", type:createjs.LoadQueue.TEXT},
    {src:"level0_TileEntities.csv", id:"level0_TE", type:createjs.LoadQueue.TEXT},
    {src:"fog.png", id:"fogOfWar"}, 
    {src:"Sounds/SwordSwing.mp3", id:"atkSound"},
    {src:"Sounds/BackgroundSample.mp3", id:"backGroundMus"},
    {src:"Sounds/UpbeatFight.mp3", id:"upbeat"}
    
];

/*------------------------------Setup------------------------------*/
//region Setup
function setupCanvas()
{
    canvas = document.getElementById("game");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver();
    //context = canvas.getContext('2d');
    stage.on("stagemousemove", function(evt){ mouseX = evt.stageX.toFixed(); mouseY = evt.stageY.toFixed();});
}   

if (!!(window.addEventListener))
{
    window.addEventListener("DOMContentLoaded", main);
}
else
{
    //if using internet explorer 
    window.attatchEvent("onload", main);
}

function loadFiles()
{
    setupLoadingBar();
    queue = new createjs.LoadQueue(true, "assets/");
    queue.on("progress", loadProgress, this);
    queue.on("complete", loadComplete, this);
    queue.loadManifest(manifest);
}
    
var loadingBar, loadingBarWidth, loadingBarHeight, progressPercentage, loadProgressLabel, loadingBarContainer, loadingBarColor;
function setupLoadingBar()
{
    loadProgressLabel = new createjs.Text("","18px Arial","black");
    loadProgressLabel.lineWidth = 200;
    loadProgressLabel.textAlign = "center";
    loadProgressLabel.x = canvas.width/2;
    loadProgressLabel.y = canvas.height/2 - 50;
    stage.addChild(loadProgressLabel);
    
    loadingBarContainer = new createjs.Container();
    loadingBarHeight = 20;
    loadingBarWidth = 300;
    loadingBarColor = createjs.Graphics.getRGB(0,0,0);
    loadingBar = new createjs.Shape();
    loadingBar.graphics.beginFill(loadingBarColor).drawRect(0, 0, 1, loadingBarHeight).endFill();

    var frame = new createjs.Shape();
    var padding = 5;
    frame.graphics.setStrokeStyle(1).beginStroke(loadingBarColor).drawRect( -padding / 2, -padding / 2, loadingBarWidth + padding, loadingBarHeight + padding);
    
    loadingBarContainer.addChild(loadingBar, frame);
    loadingBarContainer.x = Math.round(canvas.width / 2 - loadingBarWidth / 2);
    loadingBarContainer.y = canvas.height / 2;
    stage.addChild(loadingBarContainer);
}
    
function loadProgress(evt)
{
    if(queue.progress < 0.25)
    {
        loadingBar.graphics.clear().beginFill(createjs.Graphics.getRGB(255,0,0)).drawRect(0, 0, 1, loadingBarHeight).endFill();
    }
    else if(queue.progress >= 0.25 && queue.progress < 0.75)
    {
        loadingBar.graphics.clear().beginFill(createjs.Graphics.getRGB(255,255,0)).drawRect(0, 0, 1, loadingBarHeight).endFill();
    }
    else
    {
        loadingBar.graphics.clear().beginFill(createjs.Graphics.getRGB(0,255,0)).drawRect(0, 0, 1, loadingBarHeight).endFill();   
    }
    
    loadingBar.scaleX = queue.progress * loadingBarWidth;
 
    progressPercentage = Math.round(queue.progress*100);
    loadProgressLabel.text = progressPercentage + "% Loaded";
    
    stage.update();
}
 
var defaultTile, invalidTile, unavailableTile, forest_Dirt, forest_GrassPath, forest_DirtPath, forest_DirtTree, forest_GrassTree, forest_Grass, forest_DirtyGrass, forest_Exit;
function loadComplete(evt)
{
    stage.removeChild(loadProgressLabel, loadingBarContainer);
    titleScreen = new createjs.Bitmap(queue.getResult("titleScreen"));
    instructionScreen = new createjs.Bitmap(queue.getResult("instructionScreen"));
    gameplayScreen = new createjs.Bitmap(queue.getResult("gameplayScreen"));
    gameOverScreen = new createjs.Bitmap(queue.getResult("gameOverScreen"));
    fogOfWar = new createjs.Bitmap(queue.getResult("fogOfWar"));

    var defaultTile_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("default")],
        frames: [[0,0,50,50,0,0,0],[50,0,50,50,0,0,0],[0,50,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "none"],
            enabled: [1, 1, "enabled"],
            disabled: [2, 2, "disabled"]
        }
    });
    defaultTile = new createjs.Sprite(defaultTile_Sheet); 
    
    var forest_Dirt_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("forest_Dirt")],
        frames: [[0,0,50,50,0,0,0],[50,0,50,50,0,0,0],[0,50,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "none"],
            enabled: [1, 1, "enabled"],
            disabled: [2, 2, "disabled"]
        }
    });
    forest_Dirt = new createjs.Sprite(forest_Dirt_Sheet); 

    var forest_DirtPath_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("forest_DirtPath")],
        frames: [[0,0,50,50,0,0,0],[50,0,50,50,0,0,0],[0,50,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "none"],
            enabled: [1, 1, "enabled"],
            disabled: [2, 2, "disabled"]
        }
    });
    forest_DirtPath = new createjs.Sprite(forest_DirtPath_Sheet); 

    var forest_DirtTree_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("forest_DirtTree")],
        frames: [[0,0,50,50,0,0,0],[50,0,50,50,0,0,0],[0,50,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "none"],
            enabled: [1, 1, "enabled"],
            disabled: [2, 2, "disabled"]
        }
    });
    forest_DirtTree = new createjs.Sprite(forest_DirtTree_Sheet); 

    var forest_DirtyGrass_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("forest_DirtyGrass")],
        frames: [[0,0,50,50,0,0,0],[50,0,50,50,0,0,0],[0,50,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "none"],
            enabled: [1, 1, "enabled"],
            disabled: [2, 2, "disabled"]
        }
    });
    forest_DirtyGrass = new createjs.Sprite(forest_DirtyGrass_Sheet); 

    var forest_Grass_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("forest_Grass")],
        frames: [[0,0,50,50,0,0,0],[50,0,50,50,0,0,0],[0,50,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "none"],
            enabled: [1, 1, "enabled"],
            disabled: [2, 2, "disabled"]
        }
    });
    forest_Grass = new createjs.Sprite(forest_Grass_Sheet); 

    var forest_GrassPath_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("forest_GrassPath")],
        frames: [[0,0,50,50,0,0,0],[50,0,50,50,0,0,0],[0,50,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "none"],
            enabled: [1, 1, "enabled"],
            disabled: [2, 2, "disabled"]
        }
    });
    forest_GrassPath = new createjs.Sprite(forest_GrassPath_Sheet); 

    var forest_GrassTree_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("forest_GrassTree")],
        frames: [[0,0,50,50,0,0,0],[50,0,50,50,0,0,0],[0,50,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "none"],
            enabled: [1, 1, "enabled"],
            disabled: [2, 2, "disabled"]
        }
    });
    forest_GrassTree = new createjs.Sprite(forest_GrassTree_Sheet); 

    var forest_Exit_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("forest_Exit")],
        frames: [[0,0,50,50,0,0,0],[50,0,50,50,0,0,0],[0,50,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "none"],
            enabled: [1, 1, "enabled"],
            disabled: [2, 2, "disabled"]
        }
    });
    forest_Exit = new createjs.Sprite(forest_Exit_Sheet); 

    var invalidTile_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("invalid")],
        frames: [[0,0,50,50,0,0,0],[50,0,50,50,0,0,0],[0,50,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "none"],
            enabled: [1, 1, "enabled"],
            disabled: [2, 2, "disabled"]
        }
    });
    invalidTile = new createjs.Sprite(invalidTile_Sheet); 

    var unavailableTile_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("unavailable")],
        frames: [[0,0,50,50,0,0,0],[50,0,50,50,0,0,0],[0,50,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "none"],
            enabled: [1, 1, "enabled"],
            disabled: [2, 2, "disabled"]
        }
    });
    unavailableTile = new createjs.Sprite(unavailableTile_Sheet);  

    var player_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("player")],
        frames: [[0,0,64,64,0,6.6,5.65],[64,0,64,64,0,6.6,5.65],[128,0,64,64,0,6.6,5.65],[192,0,64,64,0,6.6,5.65],[256,0,64,64,0,6.6,5.65],[320,0,64,64,0,6.6,5.65],[384,0,64,64,0,6.6,5.65],[448,0,64,64,0,6.6,5.65],[0,64,64,64,0,6.6,5.65],[64,64,64,64,0,6.6,5.65],[128,64,64,64,0,6.6,5.65],[192,64,64,64,0,6.6,5.65],[256,64,64,64,0,6.6,5.65],[320,64,64,64,0,6.6,5.65],[384,64,64,64,0,6.6,5.65],[448,64,64,64,0,6.6,5.65],[0,128,64,64,0,6.6,5.65],[64,128,64,64,0,6.6,5.65],[128,128,64,64,0,6.6,5.65],[192,128,64,64,0,6.6,5.65],[256,128,64,64,0,6.6,5.65],[320,128,64,64,0,6.6,5.65],[384,128,64,64,0,6.6,5.65],[448,128,64,64,0,6.6,5.65],[0,192,64,64,0,6.6,5.65],[64,192,64,64,0,6.6,5.65],[128,192,64,64,0,6.6,5.65],[192,192,64,64,0,6.6,5.65],[256,192,64,64,0,6.6,5.65],[320,192,64,64,0,6.6,5.65],[384,192,64,64,0,6.6,5.65],[448,192,64,64,0,6.6,5.65],[0,256,64,64,0,6.6,5.65],[64,256,64,64,0,6.6,5.65],[128,256,64,64,0,6.6,5.65],[192,256,64,64,0,6.6,5.65],[256,256,64,64,0,6.6,5.65],[320,256,64,64,0,6.6,5.65],[384,256,64,64,0,6.6,5.65],[448,256,64,64,0,6.6,5.65],[0,320,64,64,0,6.6,5.65],[64,320,64,64,0,6.6,5.65],[128,320,64,64,0,6.6,5.65],[192,320,64,64,0,6.6,5.65],[256,320,64,64,0,6.6,5.65],[320,320,64,64,0,6.6,5.65],[384,320,64,64,0,6.6,5.65],[448,320,64,64,0,6.6,5.65],[0,384,64,64,0,6.6,5.65],[64,384,64,64,0,6.6,5.65],[128,384,64,64,0,6.6,5.65],[192,384,64,64,0,6.6,5.65],[256,384,64,64,0,6.6,5.65],[320,384,64,64,0,6.6,5.65],[384,384,64,64,0,6.6,5.65],[448,384,64,64,0,6.6,5.65],[0,448,64,64,0,6.6,5.65],[64,448,64,64,0,6.6,5.65],[128,448,64,64,0,6.6,5.65],[192,448,64,64,0,6.6,5.65],[256,448,64,64,0,6.6,5.65],[320,448,64,64,0,6.6,5.65],[384,448,64,64,0,6.6,5.65],[448,448,64,64,0,6.6,5.65],[0,512,64,64,0,6.6,5.65],[64,512,64,64,0,6.6,5.65],[128,512,64,64,0,6.6,5.65],[192,512,64,64,0,6.6,5.65],[256,512,64,64,0,6.6,5.65],[320,512,64,64,0,6.6,5.65],[384,512,64,64,0,6.6,5.65],[448,512,64,64,0,6.6,5.65],[0,576,64,64,0,6.6,5.65],[64,576,64,64,0,6.6,5.65],[128,576,64,64,0,6.6,5.65],[192,576,64,64,0,6.6,5.65],[256,576,64,64,0,6.6,5.65],[320,576,64,64,0,6.6,5.65],[384,576,64,64,0,6.6,5.65],[448,576,64,64,0,6.6,5.65],[0,640,64,64,0,6.6,5.65],[64,640,64,64,0,6.6,5.65],[128,640,64,64,0,6.6,5.65],[192,640,64,64,0,6.6,5.65],[256,640,64,64,0,6.6,5.65],[320,640,64,64,0,6.6,5.65],[384,640,64,64,0,6.6,5.65],[448,640,64,64,0,6.6,5.65],[0,704,64,64,0,6.6,5.65],[64,704,64,64,0,6.6,5.65],[128,704,64,64,0,6.6,5.65],[192,704,64,64,0,6.6,5.65],[256,704,64,64,0,6.6,5.65],[320,704,64,64,0,6.6,5.65],[384,704,64,64,0,6.6,5.65],[448,704,64,64,0,6.6,5.65],[0,768,64,64,0,6.6,5.65],[64,768,64,64,0,6.6,5.65],[128,768,64,64,0,6.6,5.65],[192,768,64,64,0,6.6,5.65],[256,768,64,64,0,6.6,5.65],[320,768,64,64,0,6.6,5.65],[384,768,64,64,0,6.6,5.65],[448,768,64,64,0,6.6,5.65],[0,832,64,64,0,6.6,5.65],[64,832,64,64,0,6.6,5.65],[128,832,64,64,0,6.6,5.65],[192,832,64,64,0,6.6,5.65],[256,832,64,64,0,6.6,5.65],[320,832,64,64,0,6.6,5.65],[384,832,64,64,0,6.6,5.65],[448,832,64,64,0,6.6,5.65],[0,896,64,64,0,6.6,5.65],[64,896,64,64,0,6.6,5.65],[128,896,64,64,0,6.6,5.65],[192,896,64,64,0,6.6,5.65],[256,896,64,64,0,6.6,5.65],[320,896,64,64,0,6.6,5.65],[384,896,64,64,0,6.6,5.65],[448,896,64,64,0,6.6,5.65],[0,960,64,64,0,6.6,5.65],[64,960,64,64,0,6.6,5.65],[128,960,64,64,0,6.6,5.65],[192,960,64,64,0,6.6,5.65],[256,960,64,64,0,6.6,5.65],[320,960,64,64,0,6.6,5.65],[384,960,64,64,0,6.6,5.65],[448,960,64,64,0,6.6,5.65]],
        animations:
        {
            idleUp: [0, 0, "idleUp", 1],
            walkUp: [2, 20, "walkUp", 1],
            attackUp: [22, 31, "attackUp", 1],
            idleRight: [32, 32, "idleRight", 1],
            walkRight: [34, 52, "walkRight", 1],
            attackRight: [54, 63, "attackRight", 1],
            idleDown: [64, 64, "idleDown", 1],
            walkDown: [66, 84, "walkDown", 1],
            attackDown: [86, 95, "attackDown", 1],
            idleLeft: [96, 96, "idleLeft", 1],
            walkLeft: [98, 116, "walkLeft", 1],
            attackLeft: [118, 127, "attackLeft", 1],
        }
    });
    player.graphic = new createjs.Sprite(player_Sheet);

    var wisp_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("wisp")],
        frames: {width:50, height:50, count:30, regX:0, regY:0},
        animations:
        {
            idleUp: [0, 14, "idleUp"],
            walkUp: [0, 14, "walkUp"],
            attackUp: [15, 29, "attackUp"],
            idleRight: [0, 14, "idleRight"],
            walkRight: [0, 14, "walkRight"],
            attackRight: [15, 29, "attackRight"],
            idleDown: [0, 14, "idleDown"],
            walkDown: [0, 14, "walkDown"],
            attackDown: [15, 29, "attackDown"],
            idleLeft: [0, 14, "idleLeft"],
            walkLeft: [0, 14, "walkLeft"],
            attackLeft: [15, 29, "attackLeft"],
        }
    });
    
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

    levelRaws = [];
    levelRaws[0] = [];
    levelRaws[0][0] = queue.getResult("level0_TC");
    levelRaws[0][1] = queue.getResult("level0_TG");
    levelRaws[0][2] = queue.getResult("level0_TT");
    levelRaws[0][3] = queue.getResult("level0_TE");

    level0Map = [];
    level0Map[0] = $.csv.toArrays(levelRaws[0][0]);
    level0Map[1] = $.csv.toArrays(levelRaws[0][1]);
    level0Map[2] = $.csv.toArrays(levelRaws[0][2]);
    level0Map[3] = $.csv.toArrays(levelRaws[0][3]);
    
    initLevels();
    addLevel(0);
    addLevelMap(0, 0, 0, level0Map[1], level0Map[2], level0Map[0], level0Map[3]);

    setupButtons();
    setupTitleScreen();
    setupGameOverScreen();
    setupGameplayScreen();
    setupInstructionScreen();
    
        
    fogOfWar.regX = fogOfWar.width/2;
    fogOfWar.regY = fogOfWar.height/2;
    fogOfWar.x = player.graphic.x;
    fogOfWar.y = player.graphic.y;
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

function initBoard()
{
    board = [];
    
    for(var i = 0; i < GameBoard.height; i++)
    {
        board[i] = [];
        for(var j = 0; j < GameBoard.width; j++)
        {
            board[i][j] = Tile("default", "none", ["none"], "none");
            board[i][j].graphic.x = GameBoard.startX + (j * GameBoard.tileWidth);
            board[i][j].graphic.y = GameBoard.startY + (i * GameBoard.tileHeight);
            gameplayContainer.addChild(board[i][j].graphic);
        }  
    }
}

function initLevels()
{
    levels = [];
}

function addLevel(level)
{
    levels[level] = [];
}

function addLevelMap(level, x, y, graphicNames, triggers, contents, entities)
{
    levels[level][x] = [];
    levels[level][x][y] = Map(graphicNames, triggers, contents, entities);
}

function loadLevelMap(level, x, y)
{
    var isPlayeStartFound = false;
    for(var i = 0; i < GameBoard.height; i++)
    {
        for(var j = 0; j < GameBoard.width; j++)
        {
            gameplayContainer.removeChild(board[i][j].graphic);
            //board[i][j] = levels[level][x][y][i][j];
            board[i][j].contents = $.extend(true, [], levels[level][x][y][i][j].contents);
            board[i][j].trigger = levels[level][x][y][i][j].trigger;
            board[i][j].graphic = levels[level][x][y][i][j].graphic.clone();
            board[i][j].entity = levels[level][x][y][i][j].entity;
            
            board[i][j].graphic.x = GameBoard.startX + (j * GameBoard.tileWidth);
            board[i][j].graphic.y = GameBoard.startY + (i * GameBoard.tileHeight);
            gameplayContainer.addChild(board[i][j].graphic);
            if(!isPlayeStartFound && board[i][j].entity == "player")
            {
                isPlayeStartFound = true;
                player.graphic.x = board[i][j].graphic.x;
                player.graphic.y = board[i][j].graphic.y;
                player.tileX = j;
                player.tileY = i;
                player.tile = board[i][j];
            }
        }  
    }
    
    gameplayContainer.removeChild(player.graphic);
    gameplayContainer.addChild(player.graphic);
}
    
function Map(graphicNames, triggers, contents, entities)
{
    var isPlayerStartDefined = false;
    var gameMap = [];
    for(var i = 0; i < GameBoard.height; i++)
    {
        gameMap[i] = [];
        for(var j = 0; j < GameBoard.width; j++)
        {                 
            gameMap[i][j] = Tile(graphicNames[i][j], triggers[i][j], contents[i][j].split("|"), entities[i][j]);
            gameMap[i][j].graphic.x = GameBoard.startX + (j * GameBoard.tileWidth);
            gameMap[i][j].graphic.y = GameBoard.startY + (i * GameBoard.tileHeight);
            if(isPlayerStartDefined && gameMap[i][j].entity == "player")
            {
                console.log("Player starting area is already defined for this map. The first definition will take priority.");   
            }
            else if(gameMap[i][j].entity == "player")
            {
                isPlayerStartDefined = true;
            }
        }  
    }
    
   if(!isPlayerStartDefined)
   {
    throw "Map_With_Undefined_Player_Starting_Tile_Exception";
   }

    return gameMap;
}

function Tile(graphicName, triggr, contentArray, entiti)
{    
    var tileGraphic;
    switch(graphicName)
    {
        case "forest_Dirt":
            tileGraphic = forest_Dirt.clone();
            tileGraphic.name = "forest_Dirt";
            break;
            
        case "forest_GrassPath":
            tileGraphic = forest_GrassPath.clone();
            tileGraphic.name = "forest_GrassPath";
            break;
            
        case "forest_DirtPath":
            tileGraphic = forest_DirtPath.clone();
            tileGraphic.name = "forest_DirtPath";
            break;
            
        case "forest_DirtTree":
            tileGraphic = forest_DirtTree.clone();
            tileGraphic.name = "forest_DirtTree";
            break;
            
        case "forest_GrassTree":
            tileGraphic = forest_GrassTree.clone();
            tileGraphic.name = "forest_GrassTree";
            break;
            
        case "forest_Grass":
            tileGraphic = forest_Grass.clone();
            tileGraphic.name = "forest_Grass";
            break;
            
        case "forest_DirtyGrass":
            tileGraphic = forest_DirtyGrass.clone();
            tileGraphic.name = "forest_DirtyGrass";
            break;
            
        case "forest_Exit":
            tileGraphic = forest_Exit.clone();
            tileGraphic.name = "forest_Exit";
            break;
            
        case "default":
            tileGraphic = defaultTile.clone();
            tileGraphic.name = "default";
            break;
            
        default:
            console.log("Failed to load tile graphic from string.");
            tileGraphic = invalidTile.clone();
            tileGraphic.name = "invalidNameString";
            break;
    }
            
    switch(triggr)
    {
        case "enabled":
            tileGraphic.gotoAndPlay("enabled");
            break;
        case "disabled":
            tileGraphic.gotoAndPlay("disabled");
            break;
        case "permanent":
            tileGraphic.gotoAndPlay("enabled");
            break;
        case "none":
            tileGraphic.gotoAndPlay("none");
            break;
        case "hidden":
            console.log("Hidden trigger enum not yet supported. Changing to none.");
            triggr = "none";
            tileGraphic.gotoAndPlay("none");
            break;
        default:
            console.log("Failed to load tile trigger from string. Setting to none.");
            triggr = "none";
            tileGraphic.gotoAndPlay("none");
            break;
    }
    
    if(contentArray == null || contentArray.length < 1)
    {
        console.log("Failed to load tile contents from string array. Setting to none.");
        contentArray = ["none"];   
    }
    
    switch(entiti)
    {
        case "player":    
            if(triggr != "none")
            {
                triggr = "none";
                console.log("Player starting tile cannot have trigger in it. Changing trigger to none.");
            }
            break;
        case "wisp":
            break;    
        case "none":
            break;
        default:
            console.log("Failed to load tile entity from string. Setting to none.");
            entiti = "none";
            break;
    }
    
    var tile = {graphic: tileGraphic, contents: contentArray, trigger: triggr, entity: entiti};
    
    return tile;
}

function Player()
{
    var player = {health: 100, fear: 0, tileX: 0, tileY: 0, state: PlayerStates.idle, graphic: null, tile:null};
    
    return player;
}



//---------------------------Health and Fear Bars----------------------------//
statContainer = new createjs.Container();
var healthBar =
{
    x: 0,
    y: 0,
    width: 275,
    height: 50
};
var fearBar =
{
    x: 275,
    y: 0,
    width: 275,
    height: 50
};
function setupBars()
{
    
    //HEALTH
    var percentHealth = health/MAX_HEALTH;
    
    var healthBarBack = new createjs.Shape();
    healthBarBack.graphics.beginFill("#000").drawRect(healthBar.x, healthBar.y, healthBar.width, healthBar.height);
    
    var healthFill = new createjs.Shape();
    healthFill.name = "healthFill";
    healthFill.graphics.beginFill("#F00").drawRect(healthBar.x, healthBar.y, healthBar.width * percentHealth, healthBar.height);
    
    var healthText = new createjs.Text("Life: " + health + "/" + MAX_HEALTH, "18px sans-serif", "White");
    healthText.name = "healthText";
    healthText.x = 20;
    healthText.y = 25;
    
    //FEAR

    var percentFear = fear/MAX_FEAR;
    
    var fearBarBack = new createjs.Shape();
    fearBarBack.graphics.beginFill("#000").drawRect(fearBar.x, fearBar.y, fearBar.width, fearBar.height);
    
    var fearFill = new createjs.Shape();
    fearFill.name = "fearFill";
    fearFill.graphics.beginFill("yellowgreen").drawRect(fearBar.x, fearBar.y, fearBar.width * percentFear, fearBar.height);
    
    var fearText = new createjs.Text("Fear: " + fear + "/" + MAX_FEAR, "18px sans-serif", "Red");
    fearText.name = "fearText";
    fearText.x = 295;
    fearText.y = 25;
    
    
    statContainer.addChild(healthBarBack, healthFill, healthText, fearBarBack, fearFill, fearText);
}


//---------------------------------------------------------------------------//

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
    lastGameState = GameStates.gameTitle;
    frameCount = 0;
    gameTimer = 0;
    gameScore = 0;
    createjs.Ticker.addEventListener("tick", loop);
    createjs.Ticker.setFPS(FPS);
}

var movementKeys = [];
var movementTicks;

var wDown = false;
var aDown = false;
var sDown = false;
var dDown = false;
function handleKeyDown(evt)
{
    if(!evt){ var evt = window.event; }  //browser compatibility
    switch(evt.keyCode) 
    {
        case KC_LEFT:  console.log("LEFT ("+evt.keyCode+") down"); return false;
        case KC_RIGHT: console.log("RIGHT ("+evt.keyCode+") down"); return false;
        case KC_UP:    console.log("UP ("+evt.keyCode+") down"); return false;
        case KC_DOWN:  console.log("DOWN ("+evt.keyCode+") down"); return false;
        case KC_W:
            if(movementKeys.length < 1)
            {
                movementTicks = 0;
            }
            
            if(!wDown)
            {  
                wDown = true;
                movementKeys.push("W");
                //player.graphic.gotoAndPlay("up");
            }
            return false;
        case KC_A:
            if(movementKeys.length < 1)
            {
                movementTicks = 0;
            }
            
            if(!aDown)
            {
                movementKeys.push("A");
                //player.graphic.gotoAndPlay("left");
                aDown = true;
            }
            return false;
        case KC_S:
            if(movementKeys.length < 1)
            {
                movementTicks = 0;
            }
            
            if(!sDown)
            {
                movementKeys.push("S");
                //player.graphic.gotoAndPlay("down");
                sDown = true;
            }
            return false;
        case KC_D:
            if(movementKeys.length < 1)
            {
                movementTicks = 0;
            }
            
            if(!dDown)
            {
                movementKeys.push("D");
                //player.graphic.gotoAndPlay("right");
                dDown = true;
            }
            return false;
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
        case KC_W:
            movementKeys.splice(movementKeys.indexOf("W"), 1);
            wDown = false;
            if(movementKeys.length < 1)
            {
                movementTicks = null;
            }
            break;
        case KC_A:
            aDown = false;
            movementKeys.splice(movementKeys.indexOf("A"), 1);
            if(movementKeys.length < 1)
            {
                movementTicks = null;
            }
            break;
        case KC_S:
            sDown = false;
            movementKeys.splice(movementKeys.indexOf("S"), 1);
            if(movementKeys.length < 1)
            {
                movementTicks = null;
            }
            break;
        case KC_D:
            dDown = false;
            movementKeys.splice(movementKeys.indexOf("D"), 1);
            if(movementKeys.length < 1)
            {
                movementTicks = null;
            }
            break;
        case KC_J:  console.log("J ("+evt.keyCode+") up"); break;
        case KC_SPACE:	console.log("SPACE ("+evt.keyCode+") up"); break;
        case KC_SHIFT:	console.log("SHIFT ("+evt.keyCode+") up"); break;
        case KC_ENTER:  console.log("ENTER ("+evt.keyCode+") up"); break;
    }
}

var fearTimer;
function resetGameTimer()
{
    frameCount = 0;
    gameTimer = 0;
    fearTimer = 0;
}
function runGameTimer()
{
    frameCount += 1;
    if(frameCount%(FPS/10) === 0)
    {
        gameTimer = frameCount/(FPS);
    }
    if(movementTicks != null)
    {
        movementTicks++;
    }
    
    fearTimer += 1;
    if(fearTimer%(150) === 0)
    {
        addFear(1);
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
            handlePlayerMovement();
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
            resetGameOverScreen();
            titleContainer.visible = false;
            instructionContainer.visible = false;
            gameplayContainer.visible = false;
            gameOverContainer.visible = true;
        break;
        case GameStates.gameTitle:
            resetTitleScreen();
            titleContainer.visible = true;
            instructionContainer.visible = false;
            gameplayContainer.visible = false;
            gameOverContainer.visible = false;
        break;
        case GameStates.gamePlay:
            resetGameplayScreen();
            titleContainer.visible = false;
            instructionContainer.visible = false;
            gameplayContainer.visible = true;
            gameOverContainer.visible = false;
        break;
        case GameStates.gameInstructions:
            resetInstructionScreen();
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
function resetTitleScreen()
{
    
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
function resetInstructionScreen()
{
    
}
//endregion
/*----------------------------Game Play----------------------------*/
//region Title
function setupGameplayScreen()
{
    gameplayContainer = new createjs.Container();
    gameplayContainer.addChild(gameplayScreen);
    initBoard();
    gameplayContainer.addChild(fogOfWar);
    setupBars();
    stage.addChild(gameplayContainer);
    gameplayContainer.visible = false;
}
function resetGameplayScreen()
{
    resetGameTimer();
    loadLevelMap(0, 0, 0);
    gameplayContainer.removeChild(fogOfWar);
    gameplayContainer.addChild(fogOfWar);
    gameplayContainer.addChild(statContainer);
    player.health = 100;
    player.state = PlayerStates.idle;
    player.graphic.gotoAndPlay("idleUp");
    resetFear();
    updateHealth();
    createjs.Sound.play("backGroundMus", {loop:-1});
    
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
function resetGameOverScreen()
{
    
}
//endregion
/*----------------------------Collision----------------------------*/
//region Collision
function isTileMoveAllowed(boardY, boardX, _isFlyingCreature)
{
    if(_isFlyingCreature == null)
    {
        _isFlyingCreature = false;   
    }
    
    var isAllowed = true;
    
    if(boardX < 0 || boardX >= GameBoard.tileWidth || boardY < 0 || boardY >= GameBoard.tileHeight)
    {
        isAllowed = false;
    }
    
    if(isAllowed && !_isFlyingCreature && CollisionTiles.indexOf(board[boardX][boardY].graphic.name) > -1)
    {
        isAllowed = false;
    }
    
    return isAllowed;
}
//endregion
/*----------------------------Player----------------------------*/
//region Player Movement
function handlePlayerMovement()
{
    switch(player.state)
    {
        case PlayerStates.idle:
            if(movementKeys.length > 0)
            {
                switch(movementKeys[movementKeys.length - 1])
                {
                    case "W":
                        player.graphic.gotoAndPlay("idleUp");
                        break;
                    case "A":
                        player.graphic.gotoAndPlay("idleLeft");
                        break;
                    case "S":
                        player.graphic.gotoAndPlay("idleDown");
                        break;
                    case "D":
                        player.graphic.gotoAndPlay("idleRight");
                        break;
                }
            }
            pickMovementState();
            break;
        case PlayerStates.movingDown:
            player.graphic.y += 5;
            if(player.graphic.y == board[player.tileY + 1][player.tileX].graphic.y)
            {
                player.tile = board[player.tileY + 1][player.tileX];
                player.tileY++;
        
                onTileEntrance(player.tile);
                if(movementKeys.length > 0 && movementKeys[movementKeys.length - 1] == "S" && isTileMoveAllowed(player.tileX, player.tileY + 1))
                {
                    player.state = PlayerStates.movingDown;     
                }
                else
                {
                    player.state = PlayerStates.idle;
                    pickMovementState();
                    player.graphic.gotoAndPlay("idleDown");
                }
            }
            break;
        case PlayerStates.movingLeft:
            player.graphic.x -= 5;
            if(player.graphic.x == board[player.tileY][player.tileX - 1].graphic.x)
            {
                player.tile = board[player.tileY][player.tileX - 1];
                player.tileX--;
                onTileEntrance(player.tile);
                if(movementKeys.length > 0 && movementKeys[movementKeys.length - 1] == "S" && isTileMoveAllowed(player.tileX - 1, player.tileY))
                {
                    player.state = PlayerStates.movingLeft;     
                }
                else
                {
                    player.state = PlayerStates.idle;
                    pickMovementState();
                    player.graphic.gotoAndPlay("idleLeft");
                }
            }
            break;
        case PlayerStates.movingRight:
            player.graphic.x += 5;
            if(player.graphic.x == board[player.tileY][player.tileX + 1].graphic.x)
            {
                player.tile = board[player.tileY][player.tileX + 1];
                player.tileX++;
                onTileEntrance(player.tile);
                if(movementKeys.length > 0 && movementKeys[movementKeys.length - 1] == "S" && isTileMoveAllowed(player.tileX + 1, player.tileY))
                {
                    player.state = PlayerStates.movingRight;     
                }
                else
                {
                    player.state = PlayerStates.idle;
                    pickMovementState();
                    player.graphic.gotoAndPlay("idleRight");
                }
            }
            break;
        case PlayerStates.movingUp:
            player.graphic.y -= 5;
            if(player.graphic.y == board[player.tileY - 1][player.tileX].graphic.y)
            {
                player.tile = board[player.tileY - 1][player.tileX];
                player.tileY--;
                onTileEntrance(player.tile);
                if(movementKeys.length > 0 && movementKeys[movementKeys.length - 1] == "S" && isTileMoveAllowed(player.tileX, player.tileY - 1))
                {
                    player.state = PlayerStates.movingUp;     
                }
                else
                {
                    player.state = PlayerStates.idle;
                    pickMovementState();
                    player.graphic.gotoAndPlay("idleUp");
                }
            }
            break;
        case PlayerStates.attacking:
            createjs.Sound.play("atkSound", {loop: -1});
            break;
    }
    
    controlFog();
}
function up()
{
    if(isTileMoveAllowed(player.tileX, player.tileY - 1))
    {
        player.state = PlayerStates.movingUp;
        player.graphic.gotoAndPlay("walkUp");
    }
}
function down()
{
    if(isTileMoveAllowed(player.tileX, player.tileY + 1))
    {
        player.state = PlayerStates.movingDown;
        player.graphic.gotoAndPlay("walkDown");
    }
}
function left()
{
    if(isTileMoveAllowed(player.tileX - 1, player.tileY))
    {
        player.state = PlayerStates.movingLeft;
        player.graphic.gotoAndPlay("walkLeft");
    }
}
function right()
{
    if(isTileMoveAllowed(player.tileX + 1, player.tileY ))
    {
        player.state = PlayerStates.movingRight;
        player.graphic.gotoAndPlay("walkRight");
    }
}

function pickMovementState()
{
    if(movementKeys.length > 0 && movementTicks >= 8) 
    {
        switch(movementKeys[movementKeys.length - 1])
        {
            case "W":
                up();
                break;
            case "A":
                left();
                break;
            case "S":
                down();
                break;
            case "D":
                right();
                break;
        }
    }
}

function onTileEntrance(tile)
{
    for(var i = 0; i < tile.contents.length; i++)
    {
        switch(tile.contents[i])   
        {
            case "comfortSheep":
                break;
            case "healthPotion":
                break;
            case "bones":
                break;
        }
    }
    
    switch(tile.trigger)
    {
        case "enabled":
            player.health -= 10;
            addFear(5);
            updateHealth();
            player.tile.trigger = "disabled";
            player.tile.graphic.gotoAndPlay("disabled");
            if(player.health <= 0)
            {
                //gameover
                gameState = GameStates.gameOver;
            }
            break;
        case "permanent":
            player.health -= 10;
            addFear(5);
            updateHealth();
            if(player.health <= 0)
            {
                //gameover
                gameState = GameStates.gameOver;
            }
            break;
        case "hidden":
            player.health -= 10;
            addFear(5);
            updateHealth();
            player.tile.trigger = "disabled";
            player.tile.graphic.gotoAndPlay("disabled");
            if(player.health <= 0)
            {
                //gameover
                gameState = GameStates.gameOver;
            }
            break;
    }
    
    switch(tile.graphic.name)
    {
        case "forest_Exit":
            //next level
            gameState = GameStates.gameOver;
            break;
    }
}

function controlFog()
{   
    fogOfWar.regX = 780;
    fogOfWar.regY = 580;
    fogOfWar.x = player.graphic.x;
    fogOfWar.y = player.graphic.y;
    fogOfWar.alpha = 0.1;
}

//endregion

function updateHealth()
{
    statContainer.getChildByName("healthText").text = "Life: " + player.health+"/"+100;
    statContainer.getChildByName("healthFill").graphics.clear().beginFill("#F00").drawRect(healthBar.x, healthBar.y, healthBar.width * player.health / MAX_HEALTH, healthBar.height);  
}

function addFear(percent)
{
    player.fear += percent;
    if(player.fear > 100)
    {
        player.fear = 100;
    }
    
    statContainer.getChildByName("fearText").text = "Fear: " + player.fear + "/" + MAX_FEAR;
    statContainer.getChildByName("fearFill").graphics.clear().beginFill("yellowgreen").drawRect(fearBar.x, fearBar.y, fearBar.width * player.fear / MAX_FEAR, fearBar.height);
}

function resetFear()
{
    player.fear = 0;    
    statContainer.getChildByName("fearText").text = "Fear: " + player.fear + "/" + MAX_FEAR;
    statContainer.getChildByName("fearFill").graphics.clear().beginFill("yellowgreen").drawRect(fearBar.x, fearBar.y, fearBar.width * player.fear / MAX_FEAR, fearBar.height);
}
