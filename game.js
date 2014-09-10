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
var jMode = false;
var FOG_STATE;
var creditSprite;
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
var KC_M = 77;
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
var CollisionTiles = ["forest_DirtTree", "forest_GrassTree", "cave_rockBoulder", "cave_rockHole", "cave_lava", "cave_rockLava"];
var PlayerStates = Object.freeze({idle:0, movingUp:1, movingDown: 2, movingLeft:3, movingRight:4, attacking:5});
var Directions = Object.freeze({Up:0, Right:1, Down:2, Left:3});
var LEVEL = Object.freeze({TG: 0, TC: 1, TTT:2, TTS:3, TE:4});
var board;
var levels;
var activeLevel = {currentLevel: -1, currentMapX: -1, currentMapY: -1, maps: []};
var queue;
var player = Player();
var enemies = [];
var items = [];
var triggers = [];
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
	{src:"Textures/cave_rock.png", 					id:"cave_rock"},
	{src:"Textures/cave_rockLight.png", 			id:"cave_rockLight"},
	{src:"Textures/cave_rockDark.png", 				id:"cave_rockDark"},
	{src:"Textures/cave_rockBoulder.png", 			id:"cave_rockBoulder"},
	{src:"Textures/cave_rockHole.png", 				id:"cave_rockHole"},
	{src:"Textures/cave_rockMossy.png", 			id:"cave_rockMossy"},
	{src:"Textures/cave_rockWatery.png", 			id:"cave_rockWatery"},
	{src:"Textures/cave_rockWaterPuddle.png",	    id:"cave_rockWaterPuddle"},
	{src:"Textures/cave_rockBloody.png", 			id:"cave_rockBloody"},
	{src:"Textures/cave_rockBloodPuddle.png", 		id:"cave_rockBloodPuddle"},
	{src:"Textures/cave_rockLava.png", 				id:"cave_rockLava"},
	{src:"Textures/cave_sandstone.png", 			id:"cave_sandstone"},
	{src:"Textures/cave_sandstoneMossy.png",		id:"cave_sandstoneMossy"},
	{src:"Textures/cave_sandstoneWatery.png",		id:"cave_sandstoneWatery"},
	{src:"Textures/cave_lava.png",					id:"cave_lava"},
    {src:"playerKnight.png", id:"player"},
    {src:"Levels/currentLevel_TileContents.csv", id:"currentLevel_TC", type:createjs.LoadQueue.TEXT},
    {src:"Levels/currentLevel_TileGraphics.csv", id:"currentLevel_TG", type:createjs.LoadQueue.TEXT},
    {src:"Levels/currentLevel_TileTriggerStates.csv", id:"currentLevel_TTS", type:createjs.LoadQueue.TEXT},
    {src:"Levels/currentLevel_TileTriggerTypes.csv", id:"currentLevel_TTT", type:createjs.LoadQueue.TEXT},
    {src:"Levels/currentLevel_TileEntities.csv", id:"currentLevel_TE", type:createjs.LoadQueue.TEXT},
    {src:"fogSprite.png", id:"fogOfWar"},
	{src:"Credits.png", id:"Credits"},
    {src:"weaponBar.png", id:"weaponBar"},
    {src:"healthPotion.png", id:"healthPotion"},
	{src:"comfortSheepSmall.png", id:"comfortSheep"},
    {src:"bone.png", id:"bones"},
	{src:"bearTrapSprite.png", id:"bearTrap"},
	{src:"Traps/bearTrap.png", id:"cursedBearTrap"},
	{src:"Traps/hands.png", id:"slowMovement"},
	{src:"Traps/portal.png", id:"telporter"},
	{src:"Traps/spikes.png", id:"spikes"},
	{src:"blankSprite.png", id:"blank"},
	{src:"Sounds/Wind.mp3", id:"TeleportTrapSnd"},
	{src:"Sounds/UpbeatBoss.mp3", id:"upbeat"},
	{src:"Sounds/SwordSwing.mp3", id:"atkSound"},
	{src:"Sounds/Sticky.mp3", id:"StickySnd"},
	{src:"Sounds/Spikes.mp3", id:"SpikeSnd"},
	{src:"Sounds/metalSwing.mp3", id:"enemyAtkSnd"},
	{src:"Sounds/MainMenu.mp3", id:"mainMenuSnd"},
	{src:"Sounds/Heartbeat1.mp3", id:"heart1Snd"},
	{src:"Sounds/Heartbeat2.mp3", id:"heart2Snd"},
	{src:"Sounds/Heartbeat3.mp3", id:"heart3Snd"},
	{src:"Sounds/Heartbeat4.mp3", id:"heart4Snd"},
	{src:"Sounds/Heartbeat5.mp3", id:"heart5Snd"},
	{src:"Sounds/GotHIt.mp3", id:"hitSnd"},
	{src:"Sounds/GenClick.mp3", id:"BtnSnd"},
	{src:"Sounds/Credits.mp3", id:"CreditSnd"},
	{src:"Sounds/Bomb.mp3", id:"BombSnd"},
	{src:"Sounds/BGround.mp3", id:"backGroundMus"},
	{src:"Sounds/BearTrap.mp3", id:"BearSnd"},
	{src:"Sounds/gameOver.mp3", id:"gameOverSnd"},
	{src:"Textures/cave_exitShineYellow.png", id:"cave_exitShineYellow"},
	{src:"Textures/cave_exitShineWhite.png", id:"cave_exitShineWhite"},
	{src:"Textures/cave_exitShineRed.png", id:"cave_exitShineRed"},
	{src:"Textures/cave_exitShinePurple.png", id:"cave_exitShinePurple"},
	{src:"Textures/cave_exitShineOrange.png", id:"cave_exitShineOrange"},
	{src:"Textures/cave_exitShineGreen.png", id:"cave_exitShineGreen"},
	{src:"Textures/cave_exitShineCyan.png", id:"cave_exitShineCyan"},
	{src:"Textures/cave_exitShineBlue.png", id:"cave_exitShineBlue"},
	{src:"Textures/cave_exitShineBlack.png", id:"cave_exitShineBlack"},
	{src:"Mobs/crawlerTan.png", id:"crawlerTan"},
	{src:"Mobs/skeletonBlueRed.png", id:"skeletonBlueRed"},
	{src:"Mobs/skeletonDark.png", id:"skeletonDark"},
	{src:"Mobs/skeletonGold.png", id:"skeletonGold"},
	{src:"Mobs/skeletonGray.png", id:"skeletonGray"},
	{src:"Mobs/wispBlackBlue.png", id:"wispBlackBlue"},
	{src:"Mobs/wispBlackGreen.png", id:"wispBlackGreen"},
	{src:"Mobs/wispBlackPurple.png", id:"wispBlackPurple"},
	{src:"Mobs/wispBlackRed.png", id:"wispBlackRed"},
	{src:"Mobs/wispWhiteBlue.png", id:"wispWhiteBlue"},
	{src:"Mobs/wispWhiteGreen.png", id:"wispWhiteGreen"},
	{src:"Mobs/wispWhitePurple.png", id:"wispWhitePurple"},
	{src:"Mobs/wispWhiteRed.png", id:"wispWhiteRed"},
];

var cave_exitShineYellow, cave_exitShineWhite, cave_exitShineRed, cave_exitShinePurple, cave_exitShineOrange, cave_exitShineGreen, cave_exitShineCyan, cave_exitShineBlue, cave_exitShineBlack;

var crawlerTan, skeletonBlueRed, skeletonDark, skeletonGold, skeletonGray,
wispBlackBlue, wispBlackGreen, wispBlackPurple, wispBlackRed, wispWhiteBlue,
wispWhiteGreen, wispWhitePurple, wispWhiteRed;

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
    //stage.on("stagemousedown", handleMouseDown(evt));
    stage.on("stagemousedown", function(evt){handleMouseDown(evt);});
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
    createjs.Sound.alternateExtensions = ["mp3"];
    queue.installPlugin(createjs.Sound);
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
var cave_rock, cave_rockLight, cave_rockDark, cave_rockBoulder, cave_rockHole, cave_rockMossy, cave_rockWatery, cave_rockWaterPuddle, cave_rockBloody,cave_rockBloodPuddle, cave_rockLava, cave_sandstone, cave_sandstoneMossy,cave_sandstoneWatery, cave_lava;
var wispTemplate, bearTrap, cursedBearTrap, telporter, spikes, slowMovement;
var weaponBarGraphic, healthPotion, bones, jump, comfortSheep;
function loadComplete(evt)
{
    stage.removeChild(loadProgressLabel, loadingBarContainer);
    titleScreen = new createjs.Bitmap(queue.getResult("titleScreen"));
    instructionScreen = new createjs.Bitmap(queue.getResult("instructionScreen"));
    gameplayScreen = new createjs.Bitmap(queue.getResult("gameplayScreen"));
    gameOverScreen = new createjs.Bitmap(queue.getResult("gameOverScreen"));
    weaponBarGraphic = new createjs.Bitmap(queue.getResult("weaponBar"));
    bones = new createjs.Bitmap(queue.getResult("bones"));
	bones.name = "bones"
    healthPotion = new createjs.Bitmap(queue.getResult("healthPotion"));
	healthPotion.name = "healthPotion";
	comfortSheep = new createjs.Bitmap(queue.getResult("comfortSheep"));
    comfortSheep.name = "comfortSheep";
	
	var fogOfWar_Sheet = new createjs.SpriteSheet(
	{
		images: [queue.getResult("fogOfWar")],
		frames: [[0,0,1600,1200,0,800,600],[1600,0,1600,1200,0,800,600],[3200,0,1600,1200,0,800,600],[4800,0,1600,1200,0,800,600],[6400,0,1600,1200,0,800,600],[0,1200,1600,1200,0,800,600],[1600,1200,1600,1200,0,800,600],[3200,1200,1600,1200,0,800,600],[4800,1200,1600,1200,0,800,600],[6400,1200,1600,1200,0,800,600],[0,2400,1600,1200,0,800,600],[1600,2400,1600,1200,0,800,600],[3200,2400,1600,1200,0,800,600],[4800,2400,1600,1200,0,800,600],[6400,2400,1600,1200,0,800,600],[0,3600,1600,1200,0,800,600],[1600,3600,1600,1200,0,800,600],[3200,3600,1600,1200,0,800,600],[4800,3600,1600,1200,0,800,600],[6400,3600,1600,1200,0,800,600],[0,4800,1600,1200,0,800,600],[1600,4800,1600,1200,0,800,600]],
		animations:
		{
			p1: [0, 0, "p1"],
			p1_p2: [0, 3, "p1_p2", .4],
			p2: [3, 3, "p2"],
			p2_p3: [3, 6, "p2_p3", .4],
			p3: [6, 6, "p3"],
			p3_p4: [6, 9, "p3_p4", .4],
			p4: [9, 9, "p4"],
			p4_p5: [9, 12, "p4_p5", .4],
			p5: [12, 12, "p5"],
			p5_p6: [12, 15, "p5_p6", .4],
			p6: [15, 15, "p6"],
			p6_p7: [15, 18, "p6_p7", .4],
			p7: [18, 18, "p7"],
			p7_p8: [18, 21, "p7_p8", .4],
			p8: [21, 21, "p8"], 
		}
	});
	
	fogOfWar = new createjs.Sprite(fogOfWar_Sheet); 
	fogOfWar.regX = -25;
    fogOfWar.regY = -25;
	fogOfWar.alpha = 1.0;
	
	
	var creditSprite_Sheet = new createjs.SpriteSheet(
	{
		images: [queue.getResult("Credits")],
		frames: [[0,0,801,168,0,354.3,71.15],[801,0,804,163,0,355.3,69.15],[1605,0,807,157,0,356.3,67.15],[2412,0,811,154,0,358.3,67.15],[3223,0,814,150,0,359.3,66.15],[0,168,817,147,0,360.3,66.15],[817,168,821,144,0,362.3,66.15],[1638,168,824,142,0,363.3,66.15],[2462,168,827,142,0,364.3,66.15],[0,315,831,141,0,366.3,66.15],[831,315,834,141,0,367.3,66.15],[1665,315,837,141,0,368.3,67.15],[2502,315,842,141,0,370.3,67.15],[0,456,845,140,0,371.3,67.15],[845,456,848,140,0,372.3,67.15],[1693,456,853,140,0,374.3,67.15],[2546,456,856,139,0,375.3,67.15],[0,596,859,140,0,376.3,68.15],[859,596,864,139,0,378.3,68.15],[1723,596,867,139,0,379.3,68.15],[2590,596,870,138,0,380.3,68.15],[0,736,874,138,0,381.3,68.15],[874,736,878,137,0,383.3,68.15],[1752,736,881,137,0,384.3,68.15],[2633,736,885,137,0,385.3,69.15],[0,874,889,137,0,387.3,69.15],[889,874,892,137,0,388.3,69.15],[1781,874,896,136,0,389.3,69.15],[2677,874,900,136,0,391.3,69.15],[0,1011,903,136,0,392.3,70.15],[903,1011,907,136,0,393.3,70.15],[1810,1011,911,136,0,395.3,71.15],[2721,1011,914,136,0,396.3,71.15],[0,1147,918,136,0,397.3,72.15],[918,1147,922,136,0,399.3,72.15],[1840,1147,925,136,0,400.3,73.15],[2765,1147,929,137,0,401.3,74.15],[0,1284,933,137,0,403.3,74.15],[933,1284,936,138,0,404.3,75.15],[1869,1284,940,141,0,405.3,76.15],[2809,1284,944,143,0,407.3,76.15],[0,1427,947,147,0,408.3,77.15],[947,1427,951,150,0,409.3,78.15],[1898,1427,955,152,0,411.3,78.15],[2853,1427,958,155,0,412.3,79.15],[0,1582,953,152,0,411.3,78.15],[953,1582,947,150,0,409.3,77.15],[1900,1582,941,147,0,408.3,76.15],[2841,1582,936,145,0,407.3,76.15],[0,1734,930,142,0,406.3,75.15],[930,1734,924,139,0,404.3,74.15],[1854,1734,919,137,0,403.3,74.15],[2773,1734,913,136,0,402.3,74.15],[0,1876,908,136,0,401.3,73.15],[908,1876,901,136,0,399.3,73.15],[1809,1876,896,137,0,398.3,73.15],[2705,1876,891,136,0,397.3,72.15],[0,2013,885,136,0,396.3,72.15],[885,2013,879,137,0,394.3,72.15],[1764,2013,873,137,0,393.3,72.15],[2637,2013,868,136,0,392.3,71.15],[0,2150,863,137,0,391.3,71.15],[863,2150,856,137,0,389.3,71.15],[1719,2150,851,137,0,388.3,70.15],[2570,2150,845,137,0,387.3,70.15],[0,2287,840,137,0,386.3,70.15],[840,2287,834,138,0,384.3,70.15],[1674,2287,828,137,0,383.3,69.15],[2502,2287,823,137,0,382.3,69.15],[0,2425,817,138,0,381.3,69.15],[817,2425,811,137,0,379.3,68.15],[1628,2425,806,137,0,378.3,68.15],[2434,2425,800,138,0,377.3,68.15],[3234,2425,795,138,0,376.3,68.15],[0,2563,788,138,0,374.3,67.15],[788,2563,783,138,0,373.3,67.15],[1571,2563,778,138,0,372.3,67.15],[2349,2563,772,138,0,371.3,66.15],[3121,2563,766,138,0,369.3,66.15],[0,2701,761,138,0,368.3,66.15],[761,2701,756,139,0,367.3,66.15],[1517,2701,749,138,0,365.3,65.15],[2266,2701,744,141,0,364.3,65.15],[3010,2701,739,143,0,363.3,65.15],[0,2844,734,145,0,362.3,64.15],[734,2844,728,148,0,360.3,64.15],[1462,2844,723,150,0,359.3,64.15],[2185,2844,718,153,0,358.3,64.15],[2903,2844,713,154,0,357.3,63.150000000000006],[0,2998,707,157,0,355.3,63.150000000000006],[707,2998,707,153,0,356.3,64.15],[1414,2998,706,151,0,356.3,66.15],[2120,2998,706,152,0,357.3,68.15],[2826,2998,705,157,0,357.3,70.15],[0,3155,704,161,0,357.3,72.15],[704,3155,704,166,0,358.3,74.15],[1408,3155,703,170,0,358.3,76.15],[2111,3155,703,175,0,359.3,78.15],[2814,3155,702,179,0,359.3,80.15],[0,3334,701,184,0,359.3,82.15],[701,3334,702,189,0,360.3,84.15],[1403,3334,701,193,0,360.3,86.15],[2104,3334,701,198,0,361.3,88.15],[2805,3334,701,202,0,361.3,90.15],[0,3536,700,207,0,361.3,92.15],[700,3536,700,211,0,362.3,94.15],[1400,3536,700,216,0,362.3,96.15],[2100,3536,700,221,0,363.3,99.15],[2800,3536,699,226,0,363.3,101.15],[0,3762,699,230,0,363.3,103.15],[699,3762,699,235,0,364.3,105.15],[1398,3762,698,240,0,364.3,107.15],[2096,3762,699,244,0,365.3,109.15],[2795,3762,698,249,0,365.3,111.15],[0,4011,697,253,0,365.3,113.15],[697,4011,698,258,0,366.3,115.15],[1395,4011,697,262,0,366.3,117.15],[2092,4011,698,268,0,367.3,120.15],[2790,4011,697,272,0,367.3,122.15],[0,4283,696,277,0,367.3,124.15],[696,4283,697,281,0,368.3,126.15],[1393,4283,696,286,0,368.3,128.15],[2089,4283,696,291,0,369.3,130.15],[2785,4283,696,295,0,369.3,132.15],[0,4578,695,301,0,369.3,135.15],[695,4578,695,305,0,370.3,137.15],[1390,4578,695,310,0,370.3,139.15],[2085,4578,695,314,0,371.3,141.15],[2780,4578,695,319,0,371.3,143.15],[0,4897,694,324,0,371.3,145.15],[694,4897,694,329,0,372.3,147.15],[1388,4897,694,337,0,372.3,149.15],[2082,4897,694,346,0,373.3,152.15],[2776,4897,693,355,0,373.3,155.15],[0,5252,693,363,0,373.3,158.15],[693,5252,693,372,0,374.3,161.15]],
		animations:
		{
			JeremyCred: [0,0, "JeremyCred"],
			J_C_Transition: [1, 44, "J_C_Transition"],
			CoreyCred: [44, 44, "CoreyCred"],
			C_T_Transition: [45, 89, "C_T_Transition"],
			TaylorCred: [89, 89, "TaylorCred"],
			T_Design_Transition: [90, 134, "T_Design_Transition"],
			Design: [134, 134, "Design"],
		}
	});
	
	creditSprite = new createjs.Sprite(creditSprite_Sheet);
	
	var bearTrap_Sheet = new createjs.SpriteSheet(
	{
	    images: [queue.getResult("bearTrap")],
        frames: [[0,0,70,70,0,9.95,9.65],[70,0,70,70,0,9.95,9.65],[140,0,70,70,0,9.95,9.65],[0,70,70,70,0,9.95,9.65],[70,70,70,70,0,9.95,9.65],[140,70,70,70,0,9.95,9.65]],
        animations:
        {
            enabled: [0, 0, "enabled"],
            disabled: [4, 4, "disabled"],
            hidden: [5, 5, "hidden"],
			hiddenToPermanent: [5, 5, "hiddenToPermanent"],
			permanent: [0, 0, "permanent"],
			closing: [0, 4, "closing"]
        }
	});
	bearTrap = new createjs.Sprite(bearTrap_Sheet); 
	bearTrap.name = "bearTrap";
	
	///////////////
	
	var cursedBearTrap_Sheet = new createjs.SpriteSheet(
	{
	    images: [queue.getResult("cursedBearTrap")],
        frames: [[0,0,70,70,0,9.95,9.65],[70,0,70,70,0,9.95,9.65],[140,0,70,70,0,9.95,9.65],[0,70,70,70,0,9.95,9.65],[70,70,70,70,0,9.95,9.65],[140,70,70,70,0,9.95,9.65]],
        animations:
        {
            enabled: [0, 0, "enabled"],
            disabled: [4, 4, "disabled"],
            hidden: [5, 5, "hidden"],
			hiddenToPermanent: [5, 5, "hiddenToPermanent"],
			permanent: [0, 0, "permanent"],
			closing: [0, 4, "closing"]
        }
	});
	cursedBearTrap = new createjs.Sprite(cursedBearTrap_Sheet); 
	cursedBearTrap.name = "cursedBearTrap";
	
	var slowMovement_Sheet = new createjs.SpriteSheet(
	{
	    images: [queue.getResult("slowMovement")],
        frames: [[0,0,51,51,0,-0.05,-0.05],[51,0,51,51,0,-0.05,-0.05],[0,51,51,51,0,-0.05,-0.05]],
        animations:
        {
            enabled: [0, 0, "enabled"],
            disabled: [1, 1, "disabled"],
            hidden: [2, 2, "hidden"],
			hiddenToPermanent: [2, 2, "hiddenToPermanent"],
			permanent: [0, 0, "permanent"],
        }
	});
	slowMovement = new createjs.Sprite(bearTrap_Sheet); 
	slowMovement.name = "slowMovement";
	
	var telporter_Sheet = new createjs.SpriteSheet(
	{
	    images: [queue.getResult("telporter")],
        frames: [[0,0,51,51,0,-0.1,-0.1],[51,0,51,51,0,-0.1,-0.1],[102,0,51,51,0,-0.1,-0.1],[153,0,51,51,0,-0.1,-0.1],[204,0,51,51,0,-0.1,-0.1],[0,51,51,51,0,-0.1,-0.1],[51,51,51,51,0,-0.1,-0.1],[102,51,51,51,0,-0.1,-0.1],[153,51,51,51,0,-0.1,-0.1],[204,51,51,51,0,-0.1,-0.1],[0,102,51,51,0,-0.1,-0.1],[51,102,51,51,0,-0.1,-0.1],[102,102,51,51,0,-0.1,-0.1],[153,102,51,51,0,-0.1,-0.1],[204,102,51,51,0,-0.1,-0.1],[0,153,51,51,0,-0.1,-0.1],[51,153,51,51,0,-0.1,-0.1],[102,153,51,51,0,-0.1,-0.1],[153,153,51,51,0,-0.1,-0.1],[204,153,51,51,0,-0.1,-0.1],[0,204,51,51,0,-0.1,-0.1],[51,204,51,51,0,-0.1,-0.1],[102,204,51,51,0,-0.1,-0.1],[153,204,51,51,0,-0.1,-0.1],[204,204,51,51,0,-0.1,-0.1],[0,255,51,51,0,-0.1,-0.1],[51,255,51,51,0,-0.1,-0.1],[102,255,51,51,0,-0.1,-0.1],[153,255,51,51,0,-0.1,-0.1],[204,255,51,51,0,-0.1,-0.1],[0,306,51,51,0,-0.1,-0.1],[51,306,51,51,0,-0.1,-0.1],[102,306,51,51,0,-0.1,-0.1],[153,306,51,51,0,-0.1,-0.1],[204,306,51,51,0,-0.1,-0.1],[0,357,51,51,0,-0.1,-0.1]],
        animations:
        {
            enabled: [0, 36, "enabled"],
            disabled: [0, 36, "disabled"],
            hidden: [0, 36, "hidden"],
			hiddenToPermanent: [0, 36, "hiddenToPermanent"],
			permanent: [0, 36, "permanent"],
        }
	});
	telporter = new createjs.Sprite(telporter_Sheet); 
	telporter.name = "telporter";
	
	var spikes_Sheet = new createjs.SpriteSheet(
	{
	    images: [queue.getResult("spikes")],
        frames: [[0,0,51,50,0,-0.05,0],[51,0,51,50,0,-0.05,0],[0,50,51,50,0,-0.05,0]],
        animations:
        {
            enabled: [0, 0, "enabled"],
            disabled: [1, 1, "disabled"],
            hidden: [2, 2, "hidden"],
			hiddenToPermanent: [2, 2, "hiddenToPermanent"],
			permanent: [0, 0, "permanent"],
        }
	});
	spikes = new createjs.Sprite(spikes_Sheet); 
	spikes.name = "spikes";
	
	
	/////////////////
	
	var blank_Sheet = new createjs.SpriteSheet(
	{
		images: [queue.getResult("blank")],
        frames: [[0,0,51,51,0,-0.05,0],[51,0,51,51,0,-0.05,0],[0,51,51,51,0,-0.05,0]],
        animations:
        {
            enabled: [0, 0, "enabled"],
            disabled: [1, 1, "disabled"],
            hidden: [2, 2, "hidden"]
        }
	});
	
	jump = new createjs.Sprite(blank_Sheet);
	jump.name = "jump";
	
	//cursedBearTrap, telporter, spikes, slowMovement;
	
    var defaultTile_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("default")],
        frames: [[0,0,50,50,0,0,0],[50,0,50,50,0,0,0],[0,50,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "still"],
            enabled: [0, 0, "animated"]
        }
    });
    defaultTile = new createjs.Sprite(defaultTile_Sheet); 
    
    var forest_Dirt_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("forest_Dirt")],
        frames: [[0,0,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "still"],
            enabled: [0, 0, "animated"]
        }
    });
    forest_Dirt = new createjs.Sprite(forest_Dirt_Sheet); 

    var forest_DirtPath_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("forest_DirtPath")],
        frames: [[0,0,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "still"],
            enabled: [0, 0, "animated"]
        }
    });
    forest_DirtPath = new createjs.Sprite(forest_DirtPath_Sheet); 

    var forest_DirtTree_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("forest_DirtTree")],
        frames: [[0,0,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "still"],
            enabled: [0, 0, "animated"]
        }
    });
    forest_DirtTree = new createjs.Sprite(forest_DirtTree_Sheet); 

    var forest_DirtyGrass_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("forest_DirtyGrass")],
        frames: [[0,0,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "still"],
            enabled: [0, 0, "animated"]
        }
    });
    forest_DirtyGrass = new createjs.Sprite(forest_DirtyGrass_Sheet); 

    var forest_Grass_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("forest_Grass")],
        frames: [[0,0,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "still"],
            enabled: [0, 0, "animated"]
        }
    });
    forest_Grass = new createjs.Sprite(forest_Grass_Sheet); 

    var forest_GrassPath_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("forest_GrassPath")],
        frames: [[0,0,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "still"],
            enabled: [0, 0, "animated"]
        }
    });
	
    forest_GrassPath = new createjs.Sprite(forest_GrassPath_Sheet); 

    var forest_GrassTree_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("forest_GrassTree")],
        frames: [[0,0,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "still"],
            enabled: [0, 0, "animated"]
        }
    });
    forest_GrassTree = new createjs.Sprite(forest_GrassTree_Sheet); 
	
    var forest_Exit_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("forest_Exit")],
        frames: [[0,0,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "still"],
            enabled: [0, 0, "animated"]
        }
    });
    forest_Exit = new createjs.Sprite(forest_Exit_Sheet); 

    var cave_rock_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("cave_rock")],
        frames: [[0,0,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "still"],
            enabled: [0, 0, "animated"]
        }
    });
    cave_rock = new createjs.Sprite(cave_rock_Sheet); 
	
	var cave_rockLight_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("cave_rockLight")],
        frames: [[0,0,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "still"],
            enabled: [0, 0, "animated"]
        }
    });
    cave_rockLight = new createjs.Sprite(cave_rockLight_Sheet); 
	
	var cave_rockDark_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("cave_rockDark")],
        frames: [[0,0,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "still"],
            enabled: [0, 0, "animated"]
        }
    });
    cave_rockDark = new createjs.Sprite(cave_rockDark_Sheet); 
	
	var cave_rockBoulder_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("cave_rockBoulder")],
        frames: [[0,0,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "still"],
            enabled: [0, 0, "animated"]
        }
    });
    cave_rockBoulder = new createjs.Sprite(cave_rockBoulder_Sheet); 
	
	var cave_rockHole_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("cave_rockHole")],
        frames: [[0,0,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "still"],
            enabled: [0, 0, "animated"]
        }
    });
    cave_rockHole = new createjs.Sprite(cave_rockHole_Sheet); 
	
	var cave_rockMossy_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("cave_rockMossy")],
        frames: [[0,0,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "still"],
            enabled: [0, 0, "animated"]
        }
    });
    cave_rockMossy = new createjs.Sprite(cave_rockMossy_Sheet); 
	
	var cave_rockWatery_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("cave_rockWatery")],
        frames: [[0,0,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "still"],
            enabled: [0, 0, "animated"]
        }
    });
    cave_rockWatery = new createjs.Sprite(cave_rockWatery_Sheet); 
	
	var cave_rockWaterPuddle_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("cave_rockWaterPuddle")],
        frames: [[0,0,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "still"],
            enabled: [0, 0, "animated"]
        }
    });
    cave_rockWaterPuddle = new createjs.Sprite(cave_rockWaterPuddle_Sheet); 
	
	var cave_rockBloody_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("cave_rockBloody")],
        frames: [[0,0,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "still"],
            enabled: [0, 0, "animated"]
        }
    });
    cave_rockBloody = new createjs.Sprite(cave_rockBloody_Sheet); 
	
	var cave_rockBloodPuddle_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("cave_rockBloodPuddle")],
        frames: [[0,0,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "still"],
            enabled: [0, 0, "animated"]
        }
    });
    cave_rockBloodPuddle = new createjs.Sprite(cave_rockBloodPuddle_Sheet); 
	
	var cave_rockLava_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("cave_rockLava")],
        frames: [[0,0,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "still"],
            enabled: [0, 0, "animated"]
        }
    });
    cave_rockLava = new createjs.Sprite(cave_rockLava_Sheet); 
	
	var cave_sandstone_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("cave_sandstone")],
        frames: [[0,0,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "still"],
            enabled: [0, 0, "animated"]
        }
    });
    cave_sandstone = new createjs.Sprite(cave_sandstone_Sheet); 
	
	var cave_sandstoneMossy_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("cave_sandstoneMossy")],
        frames: [[0,0,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "still"],
            enabled: [0, 0, "animated"]
        }
    });
    cave_sandstoneMossy = new createjs.Sprite(cave_sandstoneMossy_Sheet); 
	
	var cave_sandstoneWatery_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("cave_sandstoneWatery")],
        frames: [[0,0,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "still"],
            enabled: [0, 0, "animated"]
        }
    });
    cave_sandstoneWatery = new createjs.Sprite(cave_sandstoneWatery_Sheet); 
	
	var cave_lava_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("cave_lava")],
        frames: [[0,0,50,50,0,0,0]],
        animations:
        {
            none: [0, 0, "still"],
            enabled: [0, 0, "animated"]
        }
    });
    cave_lava = new createjs.Sprite(cave_lava_Sheet); 
//////////////////////
	
	var cave_exitShineBlack_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("cave_exitShineBlack")],
        frames: [[0,0,50,50,0,0,0],[50,0,50,50,0,0,0],[0,50,50,50,0,0,0],[50,50,50,50,0,0,0]],
        animations:
        {
            none: [0, 3, "still"],
            enabled: [0, 3, "animated"]
        }
    });
	cave_exitShineBlack = new createjs.Sprite(cave_exitShineBlack_Sheet); 
	
	var cave_exitShineBlue_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("cave_exitShineBlue")],
        frames: [[0,0,50,50,0,0,0],[50,0,50,50,0,0,0],[0,50,50,50,0,0,0],[50,50,50,50,0,0,0]],
        animations:
        {
            none: [0, 3, "still"],
            enabled: [0, 3, "animated"]
        }
    });
	cave_exitShineBlue = new createjs.Sprite(cave_exitShineBlue_Sheet); 
	
		var cave_exitShineCyan_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("cave_exitShineCyan")],
        frames: [[0,0,50,50,0,0,0],[50,0,50,50,0,0,0],[0,50,50,50,0,0,0],[50,50,50,50,0,0,0]],
        animations:
        {
            none: [0, 3, "still"],
            enabled: [0, 3, "animated"]
        }
    });
	cave_exitShineCyan = new createjs.Sprite(cave_exitShineCyan_Sheet); 
	
		var cave_exitShineGreen_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("cave_exitShineGreen")],
        frames: [[0,0,50,50,0,0,0],[50,0,50,50,0,0,0],[0,50,50,50,0,0,0],[50,50,50,50,0,0,0]],
        animations:
        {
            none: [0, 3, "still"],
            enabled: [0, 3, "animated"]
        }
    });
	cave_exitShineGreen = new createjs.Sprite(cave_exitShineGreen_Sheet); 
	
		var cave_exitShineOrange_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("cave_exitShineOrange")],
        frames: [[0,0,50,50,0,0,0],[50,0,50,50,0,0,0],[0,50,50,50,0,0,0],[50,50,50,50,0,0,0]],
        animations:
        {
            none: [0, 3, "still"],
            enabled: [0, 3, "animated"]
        }
    });
	cave_exitShineOrange = new createjs.Sprite(cave_exitShineOrange_Sheet); 
	
		var cave_exitShinePurple_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("cave_exitShinePurple")],
        frames: [[0,0,50,50,0,0,0],[50,0,50,50,0,0,0],[0,50,50,50,0,0,0],[50,50,50,50,0,0,0]],
        animations:
        {
            none: [0, 3, "still"],
            enabled: [0, 3, "animated"]
        }
    });
	cave_exitShinePurple = new createjs.Sprite(cave_exitShinePurple_Sheet); 
	
		var cave_exitShineRed_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("cave_exitShineRed")],
        frames: [[0,0,50,50,0,0,0],[50,0,50,50,0,0,0],[0,50,50,50,0,0,0],[50,50,50,50,0,0,0]],
        animations:
        {
            none: [0, 3, "still"],
            enabled: [0, 3, "animated"]
        }
    });
	cave_exitShineRed = new createjs.Sprite(cave_exitShineRed_Sheet); 
	
		var cave_exitShineWhite_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("cave_exitShineWhite")],
        frames: [[0,0,50,50,0,0,0],[50,0,50,50,0,0,0],[0,50,50,50,0,0,0],[50,50,50,50,0,0,0]],
        animations:
        {
            none: [0, 3, "still"],
            enabled: [0, 3, "animated"]
        }
    });
	cave_exitShineWhite = new createjs.Sprite(cave_exitShineWhite_Sheet); 
	
		var cave_exitShineYellow_Sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("cave_exitShineYellow")],
        frames: [[0,0,50,50,0,0,0],[50,0,50,50,0,0,0],[0,50,50,50,0,0,0],[50,50,50,50,0,0,0]],
        animations:
        {
            none: [0, 3, "still"],
            enabled: [0, 3, "animated"]
        }
    });
	cave_exitShineYellow = new createjs.Sprite(cave_exitShineYellow_Sheet); 
	
	///////
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


	//////////////////////////
	var wispBlackBlue_sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("wispBlackBlue")],
        frames: {width:50, height:50, count:30, regX:25, regY:25},
        animations:
        {
            idle: [0, 14, "idle"],
            walk: [0, 14, "walk"],
            attack: [15, 29, "attack"],
        }
    });
    wispBlackBlue = new createjs.Sprite(wispBlackBlue_sheet);
    wispBlackBlue.gotoAndPlay("idle");
	wispBlackBlue.name = "fly";
	
	var wispBlackGreen_sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("wispBlackGreen")],
        frames: {width:50, height:50, count:30, regX:25, regY:25},
        animations:
        {
            idle: [0, 14, "idle"],
            walk: [0, 14, "walk"],
            attack: [15, 29, "attack"],
        }
    });
    wispBlackGreen = new createjs.Sprite(wispBlackGreen_sheet);
    wispBlackGreen.gotoAndPlay("idle");
	wispBlackGreen.name = "fly";
	
	var wispBlackPurple_sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("wispBlackPurple")],
        frames: {width:50, height:50, count:30, regX:25, regY:25},
        animations:
        {
            idle: [0, 14, "idle"],
            walk: [0, 14, "walk"],
            attack: [15, 29, "attack"],
        }
    });
    wispBlackPurple = new createjs.Sprite(wispBlackPurple_sheet);
    wispBlackPurple.gotoAndPlay("idle");
	wispBlackPurple.name = "fly";
	
		var wispBlackRed_sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("wispBlackRed")],
        frames: {width:50, height:50, count:30, regX:25, regY:25},
        animations:
        {
            idle: [0, 14, "idle"],
            walk: [0, 14, "walk"],
            attack: [15, 29, "attack"],
        }
    });
    wispBlackRed = new createjs.Sprite(wispBlackRed_sheet);
    wispBlackRed.gotoAndPlay("idle");
	wispBlackRed.name = "fly";
	
		var wispWhiteBlue_sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("wispWhiteBlue")],
        frames: {width:50, height:50, count:30, regX:25, regY:25},
        animations:
        {
            idle: [0, 14, "idle"],
            walk: [0, 14, "walk"],
            attack: [15, 29, "attack"],
        }
    });
    wispWhiteBlue = new createjs.Sprite(wispWhiteBlue_sheet);
    wispWhiteBlue.gotoAndPlay("idle");
	wispWhiteBlue.name = "fly";
	
		var wispWhiteGreen_sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("wispWhiteGreen")],
        frames: {width:50, height:50, count:30, regX:25, regY:25},
        animations:
        {
            idle: [0, 14, "idle"],
            walk: [0, 14, "walk"],
            attack: [15, 29, "attack"],
        }
    });
    wispWhiteGreen = new createjs.Sprite(wispWhiteGreen_sheet);
    wispWhiteGreen.gotoAndPlay("idle");
	wispWhiteGreen.name = "fly";
	
		var wispWhitePurple_sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("wispWhitePurple")],
        frames: {width:50, height:50, count:30, regX:25, regY:25},
        animations:
        {
            idle: [0, 14, "idle"],
            walk: [0, 14, "walk"],
            attack: [15, 29, "attack"],
        }
    });
    wispWhitePurple = new createjs.Sprite(wispWhitePurple_sheet);
    wispWhitePurple.gotoAndPlay("idle");
	wispWhitePurple.name = "fly";
	
	var wispWhiteRed_sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("wispWhiteRed")],
        frames: {width:50, height:50, count:30, regX:25, regY:25},
        animations:
        {
            idle: [0, 14, "idle"],
            walk: [0, 14, "walk"],
            attack: [15, 29, "attack"],
        }
    });
    wispWhiteRed = new createjs.Sprite(wispWhiteRed_sheet);
    wispWhiteRed.gotoAndPlay("idle");
	wispWhiteRed.name = "fly";
	
	/////////////////////////////////
	
	var skeletonBlueRed_sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("skeletonBlueRed")],
        frames: {width:50, height:50, count:60, regX:25, regY:25},
        animations:
        {
            idle: [0, 29, "idle", .75],
            walk: [30, 44, "walk", .75],
            attack: [45, 59, "attack", .75],
        }
    });
    skeletonBlueRed = new createjs.Sprite(skeletonBlueRed_sheet);
    skeletonBlueRed.gotoAndPlay("idle");
	skeletonBlueRed.name = "ground";
	
		var skeletonDark_sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("skeletonDark")],
        frames: {width:50, height:50, count:60, regX:25, regY:25},
        animations:
        {
            idle: [0, 29, "idle", .75],
            walk: [30, 44, "walk", .75],
            attack: [45, 59, "attack", .75],
        }
    });
    skeletonDark = new createjs.Sprite(skeletonDark_sheet);
    skeletonDark.gotoAndPlay("idle");
	skeletonDark.name = "ground";
	
		var skeletonGold_sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("skeletonGold")],
        frames: {width:50, height:50, count:60, regX:25, regY:25},
        animations:
        {
            idle: [0, 29, "idle", .75],
            walk: [30, 44, "walk", .75],
            attack: [45, 59, "attack", .75],
        }
    });
    skeletonGold = new createjs.Sprite(skeletonGold_sheet);
    skeletonGold.gotoAndPlay("idle");
	skeletonGold.name = "ground";
	
		var skeletonGray_sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("skeletonGray")],
        frames: {width:50, height:50, count:60, regX:25, regY:25},
        animations:
        {
            idle: [0, 29, "idle", .75],
            walk: [30, 44, "walk", .75],
            attack: [45, 59, "attack", .75],
        }
    });
    skeletonGray = new createjs.Sprite(skeletonGray_sheet);
    skeletonGray.gotoAndPlay("idle");
	skeletonGray.name = "ground";
	
	/////////////////////////////////
    
		var crawlerTan_sheet = new createjs.SpriteSheet(
    {
        images: [queue.getResult("crawlerTan")],
        frames: {width:50, height:50, count:75, regX:25, regY:25},
        animations:
        {
            idle: [0, 29, "idle", .5],
            walk: [30, 59, "walk", .5],
            attack: [60, 74, "attack", .5],
        }
    });
    crawlerTan = new createjs.Sprite(crawlerTan_sheet);
    crawlerTan.gotoAndPlay("idle");
	crawlerTan.name = "crawlerTan";
	
	/////////////////////////////////
	
    var buttonSheet = new createjs.SpriteSheet({
        images: [queue.getResult("button")],
        frames: {width: 285, height: 98, regX: 142, regY: 49},
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

    var levelRaws = [];
    levelRaws[0] = [];
	levelRaws[0][0] = [];
	levelRaws[0][0][0] = [];
	levelRaws[1] = [];
	levelRaws[1][0] = [];
	levelRaws[1][0][0] = [];
	levelRaws[1][0][1] = [];
	//[LEVEL][MAP_X][MAP_Y][RAW_LOAD_TYPE]
	levelRaws[0][0][0][LEVEL.TG] 		= queue.getResult("currentLevel_TG");
	levelRaws[0][0][0][LEVEL.TC] 		= queue.getResult("currentLevel_TC");
    levelRaws[0][0][0][LEVEL.TTT] 	= queue.getResult("currentLevel_TTT");
	levelRaws[0][0][0][LEVEL.TTS] 	= queue.getResult("currentLevel_TTS");
    levelRaws[0][0][0][LEVEL.TE]		= queue.getResult("currentLevel_TE");
	//levelRaws[1][0][0][LEVEL.TG] 		= queue.getResult("test_0-0_V1_Jeremy_TG");
	//levelRaws[1][0][0][LEVEL.TC] 		= queue.getResult("test_0-0_V1_Jeremy_TC");
	//levelRaws[1][0][0][LEVEL.TTT] 	= queue.getResult("test_0-0_V1_Jeremy_TTT");
	//levelRaws[1][0][0][LEVEL.TTS] 	= queue.getResult("test_0-0_V1_Jeremy_TTS");
	//levelRaws[1][0][0][LEVEL.TE] 		= queue.getResult("test_0-0_V1_Jeremy_TE");
	//levelRaws[1][0][1][LEVEL.TG]  	= queue.getResult("test_0-1_V1_Jeremy_TG");
	//levelRaws[1][0][1][LEVEL.TC]  	= queue.getResult("test_0-1_V1_Jeremy_TC");
	//levelRaws[1][0][1][LEVEL.TTT]	= queue.getResult("test_0-1_V1_Jeremy_TTT");
	//levelRaws[1][0][1][LEVEL.TTS]	= queue.getResult("test_0-1_V1_Jeremy_TTS");
	//levelRaws[1][0][1][LEVEL.TE]  	= queue.getResult("test_0-1_V1_Jeremy_TE");

    var preMap = [];
	preMap[0] = [];
	preMap[0][0] = [];
	preMap[0][0][0] = [];
	//preMap[1] = [];
	//preMap[1][0] = [];
	//preMap[1][0][0] = [];
	//preMap[1][0][1] = [];
	
	preMap[0][0][0][LEVEL.TG] 		= $.csv.toArrays(levelRaws[0][0][0][LEVEL.TG])
	preMap[0][0][0][LEVEL.TC] 		= $.csv.toArrays(levelRaws[0][0][0][LEVEL.TC])
    preMap[0][0][0][LEVEL.TTT] 	= $.csv.toArrays(levelRaws[0][0][0][LEVEL.TTT])
	preMap[0][0][0][LEVEL.TTS] 	= $.csv.toArrays(levelRaws[0][0][0][LEVEL.TTS])
    preMap[0][0][0][LEVEL.TE]		= $.csv.toArrays(levelRaws[0][0][0][LEVEL.TE])
	//preMap[1][0][0][LEVEL.TG] 		= $.csv.toArrays(levelRaws[1][0][0][LEVEL.TG])
	//preMap[1][0][0][LEVEL.TC] 		= $.csv.toArrays(levelRaws[1][0][0][LEVEL.TC])
	//preMap[1][0][0][LEVEL.TTT] 	= $.csv.toArrays(levelRaws[1][0][0][LEVEL.TTT])
	//preMap[1][0][0][LEVEL.TTS] 	= $.csv.toArrays(levelRaws[1][0][0][LEVEL.TTS])
	//preMap[1][0][0][LEVEL.TE] 		= $.csv.toArrays(levelRaws[1][0][0][LEVEL.TE])
	//preMap[1][0][1][LEVEL.TG]  	= $.csv.toArrays(levelRaws[1][0][1][LEVEL.TG])
	//preMap[1][0][1][LEVEL.TC]  	= $.csv.toArrays(levelRaws[1][0][1][LEVEL.TC])
	//preMap[1][0][1][LEVEL.TTT]		= $.csv.toArrays(levelRaws[1][0][1][LEVEL.TTT])
	//preMap[1][0][1][LEVEL.TTS]	= $.csv.toArrays(levelRaws[1][0][1][LEVEL.TTS])
	//preMap[1][0][1][LEVEL.TE]  	= $.csv.toArrays(levelRaws[1][0][1][LEVEL.TE])
	
    initLevels();
    addLevel(0);
    //addLevelMap(0, 0, 0, level0Map[0], level0Map[1], level0Map[2], level0Map[3], level0Map[4]);
	addLevelMap(0, 0, 0, preMap[0][0][0]);
	//addLevel(1);
	//addLevelMap(1, 0, 0, preMap[1][0][0]);
	//addLevelMap(1, 0, 1, preMap[1][0][1]);
	
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

function initBoard()
{   
    board = [];
    
    for(var i = 0; i < GameBoard.height; i++)
    {
        board[i] = [];
        for(var j = 0; j < GameBoard.width; j++)
        {
			//graphicName, contentArray, triggrType, triggrState, entit
            board[i][j] = Tile("default", ["none"], "none", "none", "none");
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

function addLevelMap(level, x, y, levelData)//graphicNames, contents, triggerTypes, triggerStates, entities)
{
	if(levels[level][x]  == null)
	{
		levels[level][x] = [];
	}
    levels[level][x][y] = Map(levelData[LEVEL.TG], levelData[LEVEL.TC], levelData[LEVEL.TTT], levelData[LEVEL.TTS], levelData[LEVEL.TE])
	//graphicNames, contents, triggerTypes, triggerStates, entities);
}

function loadLevelMap(level, x, y, _flag)
{
	clearThings();
	//console.log(level + " " + x + " " + y);
	//if(activeLevel.number == level && activeLevel.maps[x][y] != null)
	//{
	//	loadActiveLevelMap(level, x, y);
	//}
	//else
	//{
		activeLevel.currentLevel = level;
		activeLevel.currentMapX = x;
		activeLevel.currentMapY = y;
	//	clearActiveLevels();
	//}

    var isPlayeStartFound = false;
    for(var i = 0; i < GameBoard.height; i++)
    {
        for(var j = 0; j < GameBoard.width; j++)
        {
            gameplayContainer.removeChild(board[i][j].graphic);
            //board[i][j] = levels[x][y][i][j];
            board[i][j].contents = $.extend(true, [], levels[level][x][y][i][j].contents);
            board[i][j].triggerState = levels[level][x][y][i][j].triggerState;
			board[i][j].triggerType = levels[level][x][y][i][j].triggerType;
            board[i][j].graphic = levels[level][x][y][i][j].graphic.clone();
            board[i][j].entity = levels[level][x][y][i][j].entity;
            board[i][j].isEntityMovingTo = levels[level][x][y][i][j].isEntityMovingTo;
            
            board[i][j].graphic.x = GameBoard.startX + (j * GameBoard.tileWidth);
            board[i][j].graphic.y = GameBoard.startY + (i * GameBoard.tileHeight);
            gameplayContainer.addChild(board[i][j].graphic);
            if(!isPlayeStartFound && board[i][j].entity == "player" && _flag == null)
            {
                isPlayeStartFound = true;
                player.graphic.x = board[i][j].graphic.x;
                player.graphic.y = board[i][j].graphic.y;
                player.tileX = j;
                player.tileY = i;
                player.tile = board[i][j];
            }
            
			///////ITEMS/////////
            for(var k = 0; k < board[i][j].contents.length; k++)
            {
                if(board[i][j].contents[k] == "healthPotion")
                {
                    items.push(healthPotion.clone());
                    items[items.length-1].x = board[i][j].graphic.x;
                    items[items.length-1].y = board[i][j].graphic.y;
                    gameplayContainer.addChild(items[items.length-1]);
                }
                else if(board[i][j].contents[k] == "bones")
                {
                    items.push(bones.clone());
                    items[items.length-1].x = board[i][j].graphic.x;
                    items[items.length-1].y = board[i][j].graphic.y;
                    gameplayContainer.addChild(items[items.length-1]);
                }
				else if(board[i][j].contents[k] == "comfortSheep")
                {
                    items.push(comfortSheep.clone());
                    items[items.length-1].x = board[i][j].graphic.x;
                    items[items.length-1].y = board[i][j].graphic.y;
                    gameplayContainer.addChild(items[items.length-1]);
                }
            }
			
            ///////TRIGGERS/////////
			if(board[i][j].triggerType == "bearTrap")
			{
				triggers.push(bearTrap.clone());
				triggers[triggers.length-1].gotoAndPlay(board[i][j].triggerState);
				triggers[triggers.length-1].x = board[i][j].graphic.x;
                triggers[triggers.length-1].y = board[i][j].graphic.y;
                gameplayContainer.addChild(triggers[triggers.length-1]);
			}
			else if(board[i][j].triggerType == "jump")
			{
				triggers.push(jump.clone());
				triggers[triggers.length-1].gotoAndPlay(board[i][j].triggerState);
				triggers[triggers.length-1].x = board[i][j].graphic.x;
                triggers[triggers.length-1].y = board[i][j].graphic.y;
                gameplayContainer.addChild(triggers[triggers.length-1]);
			}
			else if(board[i][j].triggerType == "telporter")
			{
				triggers.push(jump.clone());
				triggers[triggers.length-1].gotoAndPlay(board[i][j].triggerState);
				triggers[triggers.length-1].x = board[i][j].graphic.x;
                triggers[triggers.length-1].y = board[i][j].graphic.y;
                gameplayContainer.addChild(triggers[triggers.length-1]);
			}
			else if(board[i][j].triggerType == "spikes")
			{
				triggers.push(spikes.clone());
				triggers[triggers.length-1].gotoAndPlay(board[i][j].triggerState);
				triggers[triggers.length-1].x = board[i][j].graphic.x;
                triggers[triggers.length-1].y = board[i][j].graphic.y;
                gameplayContainer.addChild(triggers[triggers.length-1]);
			}
			else if(board[i][j].triggerType == "slowMovement")
			{
				triggers.push(slowMovement.clone());
				triggers[triggers.length-1].gotoAndPlay(board[i][j].triggerState);
				triggers[triggers.length-1].x = board[i][j].graphic.x;
                triggers[triggers.length-1].y = board[i][j].graphic.y;
                gameplayContainer.addChild(triggers[triggers.length-1]);
			}
			else if(board[i][j].triggerType == "cursedBearTrap")
			{
				triggers.push(cursedBearTrap.clone());
				triggers[triggers.length-1].gotoAndPlay(board[i][j].triggerState);
				triggers[triggers.length-1].x = board[i][j].graphic.x;
                triggers[triggers.length-1].y = board[i][j].graphic.y;
                gameplayContainer.addChild(triggers[triggers.length-1]);
			}
			
			///////ENEMIES/////////
            if(board[i][j].entity !== "none" && board[i][j].entity !== "player")
            {
                enemies.push(new Enemy(board[i][j].entity));
				console.log(enemies[enemies.length-1]);
                enemies[enemies.length-1].graphic.x = board[i][j].graphic.x + 25;
                enemies[enemies.length-1].graphic.y = board[i][j].graphic.y + 25;
                enemies[enemies.length-1].tileX = j;
                enemies[enemies.length-1].tileY = i;
                enemies[enemies.length-1].tile = board[i][j];
            }
        }  
    }
    
    for(var i = 0; i < enemies.length; i++)
    {
        //gameplayContainer.removeChild(player.graphic);
        gameplayContainer.addChild(enemies[i].graphic);
    }
    
    gameplayContainer.removeChild(player.graphic);
    gameplayContainer.addChild(player.graphic);
}

function clearActiveLevels()
{
	activeLevel.maps = [];
}

function loadActiveLevelMap(level, x, y)
{
	if(activeLevel.maps == null || activeLevel.maps[x] == null || activeLevel.maps[x][y] == null)
	{
		loadLevelMap(level, x, y, true);
	}
	else{
	clearThings();
	activeLevel.currentLevel = level;
	activeLevel.currentMapX = x;
	activeLevel.currentMapY = y;
    for(var i = 0; i < GameBoard.height; i++)
    {
        for(var j = 0; j < GameBoard.width; j++)
        {
            gameplayContainer.removeChild(board[i][j].graphic);
            board[i][j].contents = $.extend(true, [], activeLevel.maps[x][y][i][j].contents);
            board[i][j].triggerState = activeLevel.maps[x][y][i][j].triggerState;
			board[i][j].triggerType = activeLevel.maps[x][y][i][j].triggerType;
            board[i][j].graphic = activeLevel.maps[x][y][i][j].graphic.clone();
            board[i][j].entity = activeLevel.maps[x][y][i][j].entity;
            board[i][j].isEntityMovingTo = activeLevel.maps[x][y][i][j].isEntityMovingTo;
            
            board[i][j].graphic.x = GameBoard.startX + (j * GameBoard.tileWidth);
            board[i][j].graphic.y = GameBoard.startY + (i * GameBoard.tileHeight);
            gameplayContainer.addChild(board[i][j].graphic);
            
			///////ITEMS/////////
            for(var k = 0; k < board[i][j].contents.length; k++)
            {
                if(board[i][j].contents[k] == "healthPotion")
                {
                    items.push(healthPotion.clone());
                    items[items.length-1].x = board[i][j].graphic.x;
                    items[items.length-1].y = board[i][j].graphic.y;
                    gameplayContainer.addChild(items[items.length-1]);
                }
                else if(board[i][j].contents[k] == "bones")
                {
                    items.push(bones.clone());
                    items[items.length-1].x = board[i][j].graphic.x;
                    items[items.length-1].y = board[i][j].graphic.y;
                    gameplayContainer.addChild(items[items.length-1]);
                }
				else if(board[i][j].contents[k] == "comfortSheep")
                {
                    items.push(comfortSheep.clone());
                    items[items.length-1].x = board[i][j].graphic.x;
                    items[items.length-1].y = board[i][j].graphic.y;
                    gameplayContainer.addChild(items[items.length-1]);
                }
            }
			
            ///////TRIGGERS/////////
			if(board[i][j].triggerType == "bearTrap")
			{
				triggers.push(bearTrap.clone());
				triggers[triggers.length-1].gotoAndPlay(board[i][j].triggerState);
				triggers[triggers.length-1].x = board[i][j].graphic.x;
                triggers[triggers.length-1].y = board[i][j].graphic.y;
                gameplayContainer.addChild(triggers[triggers.length-1]);
			}
			else if(board[i][j].triggerType == "jump")
			{
				triggers.push(jump.clone());
				triggers[triggers.length-1].gotoAndPlay(board[i][j].triggerState);
				triggers[triggers.length-1].x = board[i][j].graphic.x;
                triggers[triggers.length-1].y = board[i][j].graphic.y;
                gameplayContainer.addChild(triggers[triggers.length-1]);
			}
			else if(board[i][j].triggerType == "telporter")
			{
				triggers.push(jump.clone());
				triggers[triggers.length-1].gotoAndPlay(board[i][j].triggerState);
				triggers[triggers.length-1].x = board[i][j].graphic.x;
                triggers[triggers.length-1].y = board[i][j].graphic.y;
                gameplayContainer.addChild(triggers[triggers.length-1]);
			}
			else if(board[i][j].triggerType == "spikes")
			{
				triggers.push(spikes.clone());
				triggers[triggers.length-1].gotoAndPlay(board[i][j].triggerState);
				triggers[triggers.length-1].x = board[i][j].graphic.x;
                triggers[triggers.length-1].y = board[i][j].graphic.y;
                gameplayContainer.addChild(triggers[triggers.length-1]);
			}
			else if(board[i][j].triggerType == "slowMovement")
			{
				triggers.push(slowMovement.clone());
				triggers[triggers.length-1].gotoAndPlay(board[i][j].triggerState);
				triggers[triggers.length-1].x = board[i][j].graphic.x;
                triggers[triggers.length-1].y = board[i][j].graphic.y;
                gameplayContainer.addChild(triggers[triggers.length-1]);
			}
			else if(board[i][j].triggerType == "cursedBearTrap")
			{
				triggers.push(cursedBearTrap.clone());
				triggers[triggers.length-1].gotoAndPlay(board[i][j].triggerState);
				triggers[triggers.length-1].x = board[i][j].graphic.x;
                triggers[triggers.length-1].y = board[i][j].graphic.y;
                gameplayContainer.addChild(triggers[triggers.length-1]);
			}
			
			///////ENEMIES/////////
            if(board[i][j].entity !== "none" && board[i][j].entity !== "player")
            {
				console.log(board[i][j].entity);
                enemies.push(new Enemy(board[i][j].entity));
                enemies[enemies.length-1].graphic.x = board[i][j].graphic.x + 25;
                enemies[enemies.length-1].graphic.y = board[i][j].graphic.y + 25;
                enemies[enemies.length-1].tileX = j;
                enemies[enemies.length-1].tileY = i;
                enemies[enemies.length-1].tile = board[i][j];
            }
        }  
    }
    
    for(var i = 0; i < enemies.length; i++)
    {
        //gameplayContainer.removeChild(player.graphic);
        gameplayContainer.addChild(enemies[i].graphic);
    }
    
    gameplayContainer.removeChild(player.graphic);
    gameplayContainer.addChild(player.graphic);
	}
	
	if(player.tileX == 0)
	{
	    player.graphic.x = board[player.tileY][GameBoard.width - 1].graphic.x;
        player.graphic.y = board[player.tileY][GameBoard.width - 1].graphic.y;
        player.tileX = GameBoard.width - 1;
        player.tileY = player.tileY;
        player.tile = board[player.tileY][player.tileX];
	}
	else if(player.tileX == GameBoard.width - 1)
	{
		player.graphic.x = board[player.tileY][0].graphic.x;
        player.graphic.y = board[player.tileY][0].graphic.y;
        player.tileX = 0;
        player.tileY = player.tileY;
        player.tile = board[player.tileY][player.tile];
	}
	else if(player.tileY == 0)
	{
		player.graphic.x = board[GameBoard.height - 1][player.tileX].graphic.x;
        player.graphic.y = board[GameBoard.height - 1][player.tileX].graphic.y;
        player.tileX = player.tileX;
        player.tileY = GameBoard.height - 1;
        player.tile = board[player.tileY][player.tileX];
	}
	else if(player.tileY ==  GameBoard.height - 1)
	{
		player.graphic.x = board[0][player.tileX].graphic.x;
        player.graphic.y = board[0][player.tileX].graphic.y;
        player.tileX = player.tileX;
        player.tileY = 0;
        player.tile = board[player.tileY][player.tileX];
	}
	else
	{
		console.log(player);
		throw "Loading_Area_While_Player_Isnt_At_Edge_Exception";
	}
}

function saveActiveLevelMap(level, x, y)
{
	if(activeLevel.maps == null)
	{
		activeLevel.maps = [];
	}
	
	if(activeLevel.maps[x] == null)
	{
		activeLevel.maps[x] = [];
	}
	
	activeLevel.maps[x][y] = [];
	
	activeLevel.maps[x][y] = $.extend(true, [], levels[level][x][y]);
	
	    for(var i = 0; i < GameBoard.height; i++)
		{
			for(var j = 0; j < GameBoard.width; j++)
			{
				activeLevel.maps[x][y][i][j].entity = "none"
				activeLevel.maps[x][y][i][j].contents = ["none"];
				activeLevel.maps[x][y][i][j].triggerType = "none";
				activeLevel.maps[x][y][i][j].triggerState = "none";
			}
		}
		
		//////////////////////Only one item is carrying over atm/////////////////
		for(var i = 0; i < items.length; i++)
		{
			activeLevel.maps[x][y][items[i].y / 50 - 1][items[i].x / 50 ].contents[0] = items[i].name;
		}
		
		for(var i = 0; i < enemies.length; i++)
		{
			activeLevel.maps[x][y][enemies[i].tileY][enemies[i].tileX].entity = enemies[i].name;
		}
		
		for(var i = 0; i < triggers.length; i++)
		{
			activeLevel.maps[x][y][triggers[i].y / 50 - 1][triggers[i].x / 50].triggerState = triggers[i].currentAnimation;
			activeLevel.maps[x][y][triggers[i].y / 50 - 1][triggers[i].x / 50].triggerType = triggers[i].name;
		}
}
    
function Map(graphicNames, contents, triggerTypes, triggerStates, entities)
{
    var isPlayerStartDefined = false;
    var gameMap = [];
    for(var i = 0; i < GameBoard.height; i++)
    {
        gameMap[i] = [];
        for(var j = 0; j < GameBoard.width; j++)
        {                 
            gameMap[i][j] = Tile(graphicNames[i][j], contents[i][j].split("|"), triggerTypes[i][j], triggerStates[i][j], entities[i][j]);
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

function Tile(graphicName, contentArray, triggrType, triggrState, entiti)
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

        case "cave_rock":
            tileGraphic = cave_rock.clone();
            tileGraphic.name = "cave_rock";
            break;			
  
         case "cave_rockLight":
            tileGraphic = cave_rockLight.clone();
            tileGraphic.name = "cave_rockLight";
            break;
			
        case "cave_rockDark":
            tileGraphic = cave_rockDark.clone();
            tileGraphic.name = "cave_rockDark";
            break;
			
        case "cave_rockBoulder":
            tileGraphic = cave_rockBoulder.clone();
            tileGraphic.name = "cave_rockBoulder";
            break;
			
        case "cave_rockHole":
            tileGraphic = cave_rockHole.clone();
            tileGraphic.name = "cave_rockHole";
            break;
			
        case "cave_rockMossy":
            tileGraphic = cave_rockMossy.clone();
            tileGraphic.name = "cave_rockMossy";
            break;
			
        case "cave_rockWatery":
            tileGraphic = cave_rockWatery.clone();
            tileGraphic.name = "cave_rockWatery";
            break;
			
        case "cave_rockWaterPuddle":
            tileGraphic = cave_rockWaterPuddle.clone();
            tileGraphic.name = "cave_rockWaterPuddle";
            break;
			
        case "cave_rockBloody":
            tileGraphic = cave_rockBloody.clone();
            tileGraphic.name = "cave_rockBloody";
            break;
			
        case "cave_rockBloodPuddle":
            tileGraphic = cave_rockBloodPuddle.clone();
            tileGraphic.name = "cave_rockBloodPuddle";
            break;
			
        case "cave_rockLava":
            tileGraphic = cave_rockLava.clone();
            tileGraphic.name = "cave_rockLava";
            break;
			
        case "cave_sandstone":
            tileGraphic = cave_sandstone.clone();
            tileGraphic.name = "cave_sandstone";
            break;
			
        case "cave_sandstoneMossy":
            tileGraphic = cave_sandstoneMossy.clone();
            tileGraphic.name = "cave_sandstoneMossy";
            break;
			
        case "cave_sandstoneWatery":
            tileGraphic = cave_sandstoneWatery .clone();
            tileGraphic.name = "cave_sandstoneWatery ";
            break;
			
        case "cave_lava":
            tileGraphic = cave_lava.clone();
            tileGraphic.name = "cave_lava";
            break;					
	
        case "default":
            tileGraphic = defaultTile.clone();
            tileGraphic.name = "default";
            break;
		
		case "cave_exitShineBlack":
			tileGraphic = cave_exitShineBlack.clone();
            tileGraphic.name = "cave_exitShineBlack";
			break;
			
					case "cave_exitShineBlue":
			tileGraphic = cave_exitShineBlue.clone();
            tileGraphic.name = "cave_exitShineBlue";
			break;
			
					case "cave_exitShineCyan":
			tileGraphic = cave_exitShineCyan.clone();
            tileGraphic.name = "cave_exitShineCyan";
			break;
			
					case "cave_exitShineGreen":
			tileGraphic = cave_exitShineGreen.clone();
            tileGraphic.name = "cave_exitShineGreen";
			break;
			
					case "cave_exitShineOrange":
			tileGraphic = cave_exitShineOrange.clone();
            tileGraphic.name = "cave_exitShineOrange";
			break;
			
					case "cave_exitShinePurple":
			tileGraphic = cave_exitShinePurple.clone();
            tileGraphic.name = "cave_exitShinePurple";
			break;
			
					case "cave_exitShineRed":
			tileGraphic = cave_exitShineRed.clone();
            tileGraphic.name = "cave_exitShineRed";
			break;
			
					case "cave_exitShineWhite":
			tileGraphic = cave_exitShineWhite.clone();
            tileGraphic.name = "cave_exitShineWhite";
			break;
			
					case "cave_exitShineYellow":
			tileGraphic = cave_exitShineYellow.clone();
            tileGraphic.name = "cave_exitShineYellow";
			break;
            
        default:
            console.log("Failed to load tile graphic from string: " +  graphicName);
            tileGraphic = invalidTile.clone();
            tileGraphic.name = "invalidNameString";
            break;
    }
            
    switch(triggrState)
    {
        case "enabled":
            break;
        case "disabled":
            break;
        case "permanent":
            break;
        case "hidden":
            break;
		case "hiddenToPermanent":
			break;
		case "none":
			triggrType = "none";
            break;
        default:
            console.log("Failed to load tile trigger state from string. Setting to none.");
            triggrState = "none";
			triggrType = "none";
            break;
    }
	if(triggrState != "none")
	{
		switch(triggrType)
		{
			case "bearTrap":
				break;
			case "jump":
				break;
			case "cursedBearTrap":
				break;
			case "spikes":
				break;
			case "telporter":
				break;
			case "slowMovement":
				break;
			default:
				console.log("Failed to load tile trigger type from string. Setting to none.");
				triggrState = "none";
				triggrType = "none";
				break;
		}
	}
    
    if(contentArray == null || contentArray.length < 1)
    {
        console.log("Failed to load tile contents from string array. Setting to none.");
        contentArray = ["none"];   
    }
    
    switch(entiti)
    {
        case "player":    
            if(triggrState != "none" || triggrType != "none")
            {
                triggrState = "none";
				triggrType = "none";
                console.log("Player starting tile cannot have trigger in it. Changing trigger type and state to none.");
            }
            break;
        case "none":
            break;
        default:
            console.log("Failed to load tile entity from string. Setting to none: " + entiti);
            entiti = "none";
            break;
			
			case "crawlerTan":

				break;
							case "skeletonBlueRed":

				break;
							case "skeletonDark":

				break;
							case "skeletonGold":

				break;
							case "skeletonGray":

				break;	
            case "wispBlackBlue":

                break;
        case "wispBlackGreen":

                break;
        case "wispBlackPurple":

                break;
        case "wispBlackRed":
     
                break;
        case "wispWhiteBlue":

                break;
        case "wispWhiteGreen":

                break;
        case "wispWhitePurple":
 
                break;
        case "wispWhiteRed":

                break;	
    }
    
    var tile = {graphic: tileGraphic, contents: contentArray, triggerType: triggrType, triggerState: triggrState, entity: entiti, isEntityMovingTo: false};

    return tile;
}

function Trigger(triggerState, triggerType)
{
	//var trigger = {state: triggerState, type: triggerType, graphic: null};
	

	
	return trigger;
}

function Player()
{
    var player = {health: 100, attack: 5, fear: 0, tileX: 0, tileY: 0, state: PlayerStates.idle, graphic: null, tile:null, direction: Directions.Up};
    
    return player;
}

function Enemy(enemyName)
{
    var enemy = {health: 0, attack: 0, tileX:0, tileY:0, state: PlayerStates.idle, graphic:null, tile:null, wantsToMove:false, isFlying: false};
    
    if(enemyName != null)
    {
        switch(enemyName)
        {
			case "crawlerTan":
				enemy = CrawlerTan();
				break;
							case "skeletonBlueRed":
				enemy = SkeletonBlueRed();
				break;
							case "skeletonDark":
				enemy = SkeletonDark();
				break;
							case "skeletonGold":
				enemy = SkeletonGold();
				break;
							case "skeletonGray":
				enemy = SkeletonGray();
				break;	
            case "wispBlackBlue":
                enemy = WispBlackBlue();
                break;
        case "wispBlackGreen":
                enemy = WispBlackGreen();
                break;
        case "wispBlackPurple":
                enemy = WispBlackPurple();
                break;
        case "wispBlackRed":
                enemy = WispBlackRed();
                break;
        case "wispWhiteBlue":
                enemy = WispWhiteBlue();
                break;
        case "wispWhiteGreen":
                enemy = WispWhiteGreen();
                break;
        case "wispWhitePurple":
                enemy = WispWhitePurple();
                break;
        case "wispWhiteRed":
                enemy = WispWhiteRed();
                break;				
        }
    }
	
    return enemy;
}

function WispBlackBlue()
{
     var wisp = {health: 10, attack: 5, tileX:0, tileY:0, state: PlayerStates.idle, graphic:wispBlackBlue.clone(), tile:null, wantsToMove:false, isFlying: true};
    return wisp;
}

function WispBlackGreen()
{
     var wisp = {health: 10, attack: 5, tileX:0, tileY:0, state: PlayerStates.idle, graphic:wispBlackGreen.clone(), tile:null, wantsToMove:false, isFlying: true};
    return wisp;
}

function WispBlackPurple()
{
     var wisp = {health: 10, attack: 5, tileX:0, tileY:0, state: PlayerStates.idle, graphic:wispBlackPurple.clone(), tile:null, wantsToMove:false, isFlying: true};
    return wisp;
}

function WispBlackRed()
{
     var wisp = {health: 10, attack: 5, tileX:0, tileY:0, state: PlayerStates.idle, graphic:wispBlackRed.clone(), tile:null, wantsToMove:false, isFlying: true};
    return wisp;
}

function WispWhiteBlue()
{
     var wisp = {health: 10, attack: 5, tileX:0, tileY:0, state: PlayerStates.idle, graphic:wispWhiteBlue.clone(), tile:null, wantsToMove:false, isFlying: true};
    return wisp;
}

function WispWhiteGreen()
{
     var wisp = {health: 10, attack: 5, tileX:0, tileY:0, state: PlayerStates.idle, graphic:wispWhiteGreen.clone(), tile:null, wantsToMove:false, isFlying: true};
    return wisp;
}

function WispWhitePurple()
{
     var wisp = {health: 10, attack: 5, tileX:0, tileY:0, state: PlayerStates.idle, graphic:wispWhitePurple.clone(), tile:null, wantsToMove:false, isFlying: true};
    return wisp;
}

function WispWhiteRed()
{
     var wisp = {health: 10, attack: 5, tileX:0, tileY:0, state: PlayerStates.idle, graphic:wispWhiteRed.clone(), tile:null, wantsToMove:false, isFlying: true};
    return wisp;
}

function SkeletonBlueRed()
{
     var wisp = {health: 20, attack: 10, tileX:0, tileY:0, state: PlayerStates.idle, graphic:skeletonBlueRed.clone(), tile:null, wantsToMove:false, isFlying: false};
    return wisp;
}

function SkeletonDark()
{
     var wisp = {health: 20, attack: 10, tileX:0, tileY:0, state: PlayerStates.idle, graphic:skeletonDark.clone(), tile:null, wantsToMove:false, isFlying: false};
    return wisp;
}

function SkeletonGold()
{
     var wisp = {health: 20, attack: 10, tileX:0, tileY:0, state: PlayerStates.idle, graphic:skeletonGold.clone(), tile:null, wantsToMove:false, isFlying: false};
    return wisp;
}

function SkeletonGray()
{
     var wisp = {health: 20, attack: 10, tileX:0, tileY:0, state: PlayerStates.idle, graphic:skeletonGray.clone(), tile:null, wantsToMove:false, isFlying: false};
    return wisp;
}

function CrawlerTan()
{
     var wisp = {health: 40, attack: 20, tileX:0, tileY:0, state: PlayerStates.idle, graphic:crawlerTan.clone(), tile:null, wantsToMove:false, isFlying: false};
    return wisp;
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

var score = 0;
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
    
    weaponBarGraphic.x = 800-250;
    
    var scoreText = new createjs.Text(score, "36px sans-serif", "Red");
    scoreText.name = "scoreText";
    scoreText.x = weaponBarGraphic.x + 20;
    scoreText.y = weaponBarGraphic.y + 5;
    
    
    statContainer.addChild(healthBarBack, healthFill, healthText, fearBarBack, fearFill, fearText, weaponBarGraphic, scoreText);
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

function updateEntityHealth()
{
    updateHealth();
    if(player.health <= 0)
    {
        killPlayer();
    }
    for(var i = 0; i < enemies.length; i++)
    {
        if(enemies[i].health <= 0)
        {
            killEnemy(enemies[i]);
            enemies.splice(i, 1);
            i-=1;
        }
    }
}
function killEnemy(enemy)
{
    console.log("enemy DEAD");
    enemy.graphic.visible = false;
    gameplayContainer.removeChild(enemy.graphic);
		
	if(enemy.state == PlayerStates.movingDown)
	{
		board[enemy.tileY + 1][enemy.tileX].isEntityMovingTo = false;
	}
	else if(enemy.state == PlayerStates.movingLeft)
	{
		board[enemy.tileY][enemy.tileX - 1].isEntityMovingTo = false;
	}
	else if(enemy.state == PlayerStates.movingRight)
	{
		board[enemy.tileY][enemy.tileX + 1].isEntityMovingTo = false;
	}
		else if(enemy.state == PlayerStates.movingUp)
	{
		board[enemy.tileY - 1][enemy.tileX].isEntityMovingTo = false;
	}
}
function killPlayer()
{
    gameState = GameStates.gameOver;
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
        case KC_LEFT:  
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
        case KC_RIGHT:
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
        case KC_UP:
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
        case KC_DOWN:
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
        case KC_W:
            if(movementKeys.length < 1)
            {
                movementTicks = 0;
            }
            
            if(!wDown && playerStoppedTicks < 1)
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
            
            if(!aDown && playerStoppedTicks < 1)
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
            
            if(!sDown && playerStoppedTicks < 1)
            {
                movementKeys.push("S");
                sDown = true;
            }
            return false;
        case KC_D:
            if(movementKeys.length < 1)
            {
                movementTicks = 0;
            }
            
            if(!dDown && playerStoppedTicks < 1)
            {
                movementKeys.push("D");
                dDown = true;
            }
            return false;
        case KC_J: return false;
        case KC_SPACE: return false;
        case KC_SHIFT: return false;
        case KC_ENTER: return false;
    }
}

function handleKeyUp(evt) 
{
    if(!evt){ var evt = window.event; }  //browser compatibility
    switch(evt.keyCode) 
    {
        case KC_LEFT:
            aDown = false;
            movementKeys.splice(movementKeys.indexOf("A"), 1);
            if(movementKeys.length < 1)
            {
                movementTicks = null;
            }
            break;
        case KC_RIGHT: 
            dDown = false;
            movementKeys.splice(movementKeys.indexOf("D"), 1);
            if(movementKeys.length < 1)
            {
                movementTicks = null;
            }
            break;
        case KC_UP:	
            movementKeys.splice(movementKeys.indexOf("W"), 1);
            wDown = false;
            if(movementKeys.length < 1)
            {
                movementTicks = null;
            }
            break;
        case KC_DOWN:	
            sDown = false;
            movementKeys.splice(movementKeys.indexOf("S"), 1);
            if(movementKeys.length < 1)
            {
                movementTicks = null;
            }
            break;
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
        case KC_J:
			jMode = !jMode;
			if(jMode)
			{
				player.health = 100;
				fogOfWar.alpha = 0.0;
				updateHealth();
			}
			else
			{
				fogOfWar.alpha = 1;
				updateHealth();
			}
        case KC_SPACE: break;
        case KC_SHIFT: break;
        case KC_ENTER: break;
		case KC_M:
		    if(backGroundMus.getMute() !== 0)
            {
                backGroundMus.setMute(0);
            }
            else
            {
                backGroundMus.setMute(1);
            }
            break;
    }
}

function handleMouseDown(evt)
{
    if(gameState === GameStates.gamePlay)
    {
        if(player.state === PlayerStates.idle)
        {
            player.state = PlayerStates.attacking;
            //player.tileX
            //player.tileY
            switch(player.direction)
            {
                case Directions.Up:
                    player.graphic.gotoAndPlay("attackUp");
                    player.graphic.on("animationend", function(evt){player.state = PlayerStates.idle; player.graphic.gotoAndPlay("idleUp"); evt.remove();});
                    var target = enemyAtTile(player.tileY-1, player.tileX);
                    if(target!==null)
                    {
                        target.health-=player.attack;
                    }
                    break;
                case Directions.Right:
                    player.graphic.gotoAndPlay("attackRight");
                    player.graphic.on("animationend", function(evt){player.state = PlayerStates.idle; player.graphic.gotoAndPlay("idleRight"); evt.remove();});
                    var target = enemyAtTile(player.tileY, player.tileX+1);
                    if(target!==null)
                    {
                        target.health-=player.attack;
                    }
                    break;
                case Directions.Down:
                    player.graphic.gotoAndPlay("attackDown");
                    player.graphic.on("animationend", function(evt){player.state = PlayerStates.idle; player.graphic.gotoAndPlay("idleDown"); evt.remove();});
                    var target = enemyAtTile(player.tileY+1, player.tileX);
                    if(target!==null)
                    {
                        target.health-=player.attack;
                    }
                    break;
                case Directions.Left:
                    player.graphic.gotoAndPlay("attackLeft");
                    player.graphic.on("animationend", function(evt){player.state = PlayerStates.idle; player.graphic.gotoAndPlay("idleLeft"); evt.remove();});
                    var target = enemyAtTile(player.tileY, player.tileX-1);
                    if(target!==null)
                    {
                        target.health-=player.attack;
                    }
                    break;
            }
        }
    }
}

var fearTimer;
var enemyTimer;
function resetGameTimer()
{
    frameCount = 0;
    gameTimer = 0;
    fearTimer = 0;
    enemyTimer = 0;
	playerStoppedTicks = 0;
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
    if(fearTimer%(90) === 0)
    {
        addFear(1);
    }
	
	if(playerStoppedTicks > 0)
	{
		playerStoppedTicks -= 1;
	}
    
    enemyTimer++;
    if(enemyTimer%(30) == 0)
    {
        enemyTimer = 0;
        for(var i = 0; i < enemies.length; i++)
        {
            enemies[i].wantsToMove = true;   
        }
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
            updateEntityHealth();
            handlePlayerMovement();
            handleEnemyMovement();
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
			createjs.Sound.play("gameOverSnd");
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
			createjs.Sound.play("backGroundMus", {loop: -1});
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
	createjs.Sound.stop("backGroundMus");
	createjs.Sound.play("mainMenuSnd", {loop: -1});
    btnPlay.x = 142;
    btnPlay.y = canvasHeight/2;
    
    btnInstruct.x = (canvasWidth-150);
    btnInstruct.y = (canvasHeight/2)
    
    titleContainer = new createjs.Container();
    titleContainer.addChild(titleScreen, btnPlay, btnInstruct);
    stage.addChild(titleContainer);
    titleContainer.visible = true;
}
function resetTitleScreen()
{
    createjs.Sound.stop("backGroundMus");
	createjs.Sound.play("mainMenuSnd", {loop: -1});
}
//endregion
/*---------------------------Instructions---------------------------*/
//region Title
function setupInstructionScreen()
{
    btnMenu.x = 145;
    btnMenu.y = canvasHeight/3;
    
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
	console.log("setupGameplayScreen");
    gameplayContainer = new createjs.Container();
    gameplayContainer.addChild(gameplayScreen);
    initBoard();
    gameplayContainer.addChild(fogOfWar);
    setupBars();
    stage.addChild(gameplayContainer);
	gameplayContainer.visible = false;
}

var backGroundMus;
function resetGameplayScreen()
{
	createjs.Sound.play("backGroundMus", {loop: -1});
	createjs.Sound.stop("mainMenuSnd");
	score = -1;
	addScore(1);
	clearThings();
	resetFear();
	FOG_STATE = "p1";
	fogFearControl();

    resetGameTimer();
    loadLevelMap(0, 0, 0);
    gameplayContainer.removeChild(fogOfWar);
    gameplayContainer.addChild(fogOfWar);
    gameplayContainer.addChild(statContainer);
    player.health = 100;
    player.state = PlayerStates.idle;
    player.graphic.gotoAndPlay("idleUp");
    updateHealth();
}

function clearThings()
{
	clearEnemies();
	clearItems();
	clearTriggers();
}
	
function clearEnemies()
{
	for(var i = 0; i < enemies.length; i++)
	{
		gameplayContainer.removeChild(enemies[i].graphic);  
	}
	enemies = [];
}

function clearItems()
{
	for(var i = 0; i < items.length; i++)
	{
		gameplayContainer.removeChild(items[i]);  
	}
	
	items = [];
}

function clearTriggers()
{
	
	for(var i = 0; i < triggers.length; i++)
	{
		gameplayContainer.removeChild(triggers[i]);  
	}
    
	triggers = [];
}
//endregion
/*----------------------------Game Over----------------------------*/
//region Title
function setupGameOverScreen()
{
    btnContinue.x = (canvasWidth/2)-140;
    btnContinue.y = (canvasHeight/2);
	btnContinue.rotation = 45;
    
    gameOverContainer = new createjs.Container();
    gameOverContainer.addChild(gameOverScreen, btnContinue);
    stage.addChild(gameOverContainer);
    gameOverContainer.visible = false;
}
function resetGameOverScreen()
{
	createjs.Sound.play("gameOverSnd");
	createjs.Sound.stop("hitSnd");
    createjs.Sound.stop("backGroundMus");
}
//endregion
/*----------------------------Collision----------------------------*/
//region Collision
function isTileMoveAllowed(boardX, boardY, _isFlyingCreature)
{
    if(_isFlyingCreature == null)
    {
        _isFlyingCreature = false;   
    }
    
    var isAllowed = true;
    
    if(boardX < 0 || boardX >= GameBoard.width || boardY < 0 || boardY >= GameBoard.height)
    {
        isAllowed = false;
    }
    else if(isAllowed && !_isFlyingCreature && CollisionTiles.indexOf(board[boardY][boardX].graphic.name) > -1)
    {
        isAllowed = false;
    }
    else if(playerAtTile(boardY, boardX) != null)
    {
        isAllowed = false;
    }
    else if(enemyAtTile(boardY, boardX) != null)
    {
        isAllowed = false;
    }
    else if(board[boardY][boardX].isEntityMovingTo)
    {
        isAllowed = false;
    }
    return isAllowed;
}

function playerAtTile(boardY, boardX)
{
    var playerAtTile = null;
    
    if(player.tileY == boardY && player.tileX == boardX)
    {
        playerAtTile = player;
    }
    
    return playerAtTile;
}

function enemyAtTile(boardY, boardX)
{
    var enemyAtTile = null;
    
    for(var i = 0; i < enemies.length; i++)
    {
        if(enemies[i].tileY == boardY && enemies[i].tileX == boardX)
        {
            enemyAtTile = enemies[i];
            break;
        }
    }
        
    return enemyAtTile;
}
//endregion
/*----------------------------Player----------------------------*/
//region Player Movement
var isPlaying = false;
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
                        player.direction = Directions.Up;
                        break;
                    case "A":
                        player.graphic.gotoAndPlay("idleLeft");
                        player.direction = Directions.Left;
                        break;
                    case "S":
                        player.graphic.gotoAndPlay("idleDown");
                        player.direction = Directions.Down;
                        break;
                    case "D":
                        player.graphic.gotoAndPlay("idleRight");
                        player.direction = Directions.Right;
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
                board[player.tileY][player.tileX].isEntityMovingTo = false;
                onTileEntrance(player.tile);
                if(movementKeys.length > 0 && movementKeys[movementKeys.length - 1] == "S" && isTileMoveAllowed(player.tileX, player.tileY + 1))
                {
                    player.state = PlayerStates.movingDown;    
                    player.direction = Directions.Down;
                }
                else
                {
                    player.state = PlayerStates.idle;
                    player.direction = Directions.Down;
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
                board[player.tileY][player.tileX].isEntityMovingTo = false;
                onTileEntrance(player.tile);
                if(movementKeys.length > 0 && movementKeys[movementKeys.length - 1] == "A" && isTileMoveAllowed(player.tileX - 1, player.tileY))
                {
                    player.state = PlayerStates.movingLeft;
                    player.direction = Directions.Left;
                }
                else
                {
                    player.state = PlayerStates.idle;
                    player.direction = Directions.Left;
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
                board[player.tileY][player.tileX].isEntityMovingTo = false;
                onTileEntrance(player.tile);
                if(movementKeys.length > 0 && movementKeys[movementKeys.length - 1] == "D" && isTileMoveAllowed(player.tileX + 1, player.tileY))
                {
                    player.state = PlayerStates.movingRight;
                    player.direction = Directions.Right;
                }
                else
                {
                    player.state = PlayerStates.idle;
                    player.direction = Directions.Right;
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
                board[player.tileY][player.tileX].isEntityMovingTo = false;
                onTileEntrance(player.tile);
                if(movementKeys.length > 0 && movementKeys[movementKeys.length - 1] == "W" && isTileMoveAllowed(player.tileX, player.tileY - 1))
                {
                    player.state = PlayerStates.movingUp;
                    player.direction = Directions.Up;
                }
                else
                {
                    player.state = PlayerStates.idle;
                    player.direction = Directions.Up;
                    player.graphic.gotoAndPlay("idleUp");
                }
            }
            break;
        case PlayerStates.attacking:
			if(!isPlaying)
			{
				isPlaying = true;
				createjs.Sound.play("atkSound");
			}
            break;
    }
	
	if(player.state != PlayerStates.attacking)
	{
		isPlaying = false;
	}
    
    controlFog();
}
function up()
{
    if(isTileMoveAllowed(player.tileX, player.tileY - 1))
    {
        player.state = PlayerStates.movingUp;
        player.direction = Directions.Up;
        player.graphic.gotoAndPlay("walkUp");
        board[player.tileY - 1][player.tileX].isEntityMovingTo = true;
    }
}
function down()
{
    if(isTileMoveAllowed(player.tileX, player.tileY + 1))
    {
        player.state = PlayerStates.movingDown;
        player.direction = Directions.Down;
        player.graphic.gotoAndPlay("walkDown");
        board[player.tileY + 1][player.tileX].isEntityMovingTo = true;
    }
}
function left()
{
    if(isTileMoveAllowed(player.tileX - 1, player.tileY))
    {
        player.state = PlayerStates.movingLeft;
        player.direction = Directions.Left;
        player.graphic.gotoAndPlay("walkLeft");
        board[player.tileY][player.tileX - 1].isEntityMovingTo = true;
    }
}
function right()
{
    if(isTileMoveAllowed(player.tileX + 1, player.tileY ))
    {
        player.state = PlayerStates.movingRight;
        player.direction = Directions.Right;
        player.graphic.gotoAndPlay("walkRight");
        board[player.tileY][player.tileX + 1].isEntityMovingTo = true;
    }
}

function pickMovementState()
{
    if(movementKeys.length > 0 && movementTicks >= 6) 
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

var playerStoppedTicks = 0;
function onTileEntrance(tile)
{
    for(var i = 0; i < tile.contents.length; i++)
    {
        switch(tile.contents[i])   
        {
            case "comfortSheep":
                tile.contents[i] = "none";
                //player.fear += 50;
                addFear(-50);
                break;
            case "healthPotion":
                tile.contents[i] = "none";
                player.health += 50;
                if(player.health > 100)
                {
                    player.health = 100;   
                }
                updateHealth();
                break;
            case "bones":
                addScore(1);
                tile.contents[i] = "none";
                break;
        }
    }
    
    for(var j = 0; j < items.length; j++)
    {
        if(items[j].x == tile.graphic.x && items[j].y == tile.graphic.y)
        {
            gameplayContainer.removeChild(items[j]);
            items.splice(j, 1);
        }
    }
    
	if(tile.triggerState != "disabled" && tile.triggerState != "none")
	{
		switch(tile.triggerType)
		{
			case "bearTrap":
				//tile.triggerState = "closing";
				for(var i = 0; i < triggers.length; i++)
				{
					if(triggers[i].x == tile.graphic.x && triggers[i].y == tile.graphic.y)
					{
						triggers[i].on("animationend", function(evt)
						{
							if(board[this.y / 50 - 1][this.x / 50 ].triggerState == "hiddenToPermanent")
							{
								board[this.y / 50 - 1][this.x / 50 ].triggerState = "permanent"; 
								this.gotoAndPlay("permanent");
							}
							else if(board[this.y / 50 - 1][this.x / 50 ].triggerState == "permanent")
							{
								board[this.y / 50 - 1][this.x / 50].triggerState = "permanent"; 
								this.gotoAndPlay("permanent");
							}
							else
							{
								board[this.y / 50 - 1][this.x / 50 ].triggerState = "disabled"; 
								this.gotoAndPlay("disabled");
							}
							
							
							evt.remove();
						});
						triggers[i].gotoAndPlay("closing");
						createjs.Sound.play("BearSnd");
						break;
					}
				}
			    player.health -= 10;
				addFear(5);
				updateHealth();
				if(player.health <= 0)
				{
					//gameover
					gameState = GameStates.gameOver;
				}
				 break;
			case "jump":
				saveActiveLevelMap(activeLevel.currentLevel, activeLevel.currentMapX, activeLevel.currentMapY);
				if(player.tileX == 0)
				{
					loadActiveLevelMap(activeLevel.currentLevel, activeLevel.currentMapX - 1, activeLevel.currentMapY);
				}
				else if(player.tileX == GameBoard.width - 1)
				{
					loadActiveLevelMap(activeLevel.currentLevel, activeLevel.currentMapX + 1, activeLevel.currentMapY);
				}
				else if(player.tileY == 0)
				{
					loadActiveLevelMap(activeLevel.currentLevel, activeLevel.currentMapX, activeLevel.currentMapY - 1);

				}
				else if(player.tileY ==  GameBoard.height - 1)
				{
					loadActiveLevelMap(activeLevel.currentLevel, activeLevel.currentMapX, activeLevel.currentMapY + 1);
				}
				else
				{
					throw "Loading_Area_While_Player_Isnt_At_Edge_Exception_2";
				}
				break;
			case "telporter":
				createjs.Sound.play("TeleportTrapSnd");
				var newY = Math.floor(Math.random(0, GameBoard.width));
				var newX = Math.floor(Math.random(0, GameBoard.height));
				
				while(!isTileMoveAllowed(newX, newY))
				{
					var newY = Math.floor(Math.random(0, GameBoard.width));
					var newX = Math.floor(Math.random(0, GameBoard.height));
				}
				
				player.graphic.x = board[newY][newX].graphic.x;
				player.graphic.y = board[newY][newX].graphic.y;
				player.tileX = newX;
				player.tileY = newYl
				player.tile = board[player.tileY][player.tileX];
				break;
			case "spikes":
				createjs.Sound.play("SpikeSnd");
				player.health -= 15;
				addFear(30);
				updateHealth();
				if(player.health <= 0)
				{
					//gameover
					gameState = GameStates.gameOver;
				}
				break;
			case "slowMovement":
				playerStoppedTicks += 30 * 4;
				break;
			case "cursedBearTrap":
				createjs.Sound.play("BearSnd");
				player.health -= 10;
				addFear(5);
				updateHealth();
				if(player.health <= 0)
				{
					//gameover
					gameState = GameStates.gameOver;
				}
				playerStoppedTicks += 30;
				break;
		}
	}	
	
    switch(tile.triggerState)
    {
        case "enabled":
			player.tile.triggerState = "disabled";
			for(var i = 0; i < triggers.length; i++)
			{
				if(triggers[i].x == player.graphic.x && triggers[i].y == player.graphic.y)
				{
					triggers[i].gotoAndPlay("disabled");
					break;
				}
			}
            break;
        case "hidden":
			player.tile.triggerState = "disabled";
			for(var i = 0; i < triggers.length; i++)
			{
				if(triggers[i].x == player.graphic.x && triggers[i].y == player.graphic.y)
				{
					triggers[i].gotoAndPlay("disabled");
					break;
				}
			}
            break;
		case "hiddenToPermanent":
			player.tile.triggerState = "permanent";
			for(var i = 0; i < triggers.length; i++)
			{
				if(triggers[i].x == player.graphic.x && triggers[i].y == player.graphic.y)
				{
					triggers[i].gotoAndPlay("permanent");
					break;
				}
			}
            break;
    }
    
    switch(tile.graphic.name)
    {
        case "forest_Exit":
            goToNextLevel(1);
            break;
		case "cave_exitShineBlack":
		    gameState = GameStates.gameOver;
            break;
					case "cave_exitShineBlue":
		    gameState = GameStates.gameOver;
            break;
					case "cave_exitShineCyan":
		    gameState = GameStates.gameOver;
            break;
					case "cave_exitShineGreen":
		    gameState = GameStates.gameOver;
            break;
					case "cave_exitShineOrange":
		    goToNextLevel(2);
            break;
					case "cave_exitShinePurple":
		    gameState = GameStates.gameOver;
            break;
					case "cave_exitShineRed":
		    gameState = GameStates.gameOver;
            break;
					case "cave_exitShineWhite":
		    gameState = GameStates.gameOver;
            break;
					case "cave_exitShineYellow":
		    gameState = GameStates.gameOver;
            break;
    }
}

function controlFog()
{   
    fogOfWar.x = player.graphic.x;
    fogOfWar.y = player.graphic.y;
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
	else if(player.fear < 0)
	{
		player.fear = 0;
	}
	
	fogFearControl();
    
    statContainer.getChildByName("fearText").text = "Fear: " + player.fear + "/" + MAX_FEAR;
    statContainer.getChildByName("fearFill").graphics.clear().beginFill("yellowgreen").drawRect(fearBar.x, fearBar.y, fearBar.width * player.fear / MAX_FEAR, fearBar.height);
}

function resetFear()
{
    player.fear = 0;    
    statContainer.getChildByName("fearText").text = "Fear: " + player.fear + "/" + MAX_FEAR;
    statContainer.getChildByName("fearFill").graphics.clear().beginFill("yellowgreen").drawRect(fearBar.x, fearBar.y, fearBar.width * player.fear / MAX_FEAR, fearBar.height);
}

function addScore(number)
{
    score += number;
    if(score == 10)
    {
        statContainer.getChildByName("scoreText").x -= 12;
    }
    statContainer.getChildByName("scoreText").text = score;
}

//---------------------------------------FEAR AND FOG COHERANCE CONTROL----------------------------//

function fogFearControl()
{
	if(FOG_STATE != "ANIMATING")
	{
		if(player.fear < 40)
		{
			FOG_STATE = "p1";
			fogOfWar.gotoAndPlay("p1");
		}
		
		if(player.fear >= 40 && player.fear < 50)
		{
			if(FOG_STATE == "p1")
			{
				fogOfWar.on("animationend", function(evt){fogOfWar.gotoAndPlay("p2"); FOG_STATE = "p2"; evt.remove();});
				FOG_STATE = "ANIMATING";
				fogOfWar.gotoAndPlay("p1_p2");
			}
			else
			{
				fogOfWar.gotoAndPlay("p2");
				FOG_STATE = "p2";
			}
		}
		
		if(player.fear >= 50 && player.fear < 60)
		{
			if(FOG_STATE == "p2")
			{
				fogOfWar.on("animationend", function(evt){FOG_STATE = "p3";  fogOfWar.gotoAndPlay(FOG_STATE); evt.remove();});
				FOG_STATE = "ANIMATING";
				fogOfWar.gotoAndPlay("p2_p3");
			}
			else
			{
				FOG_STATE = "p3";
				fogOfWar.gotoAndPlay(FOG_STATE);
			}
		}
		
		if(player.fear >= 60 && player.fear < 70)
		{
			if(FOG_STATE == "p3")
			{
				fogOfWar.on("animationend", function(evt){FOG_STATE = "p4";  fogOfWar.gotoAndPlay(FOG_STATE); evt.remove();});
				FOG_STATE = "ANIMATING";
				fogOfWar.gotoAndPlay("p3_p4");
			}
			else
			{
				FOG_STATE = "p4";
				fogOfWar.gotoAndPlay(FOG_STATE);
			}
		}
		
		if(player.fear >= 70 && player.fear < 80)
		{
			if(FOG_STATE == "p4")
			{
				fogOfWar.on("animationend", function(evt){FOG_STATE = "p5";  fogOfWar.gotoAndPlay(FOG_STATE); evt.remove();});
				FOG_STATE = "ANIMATING";
				fogOfWar.gotoAndPlay("p4_p5");
			}
			else
			{
				FOG_STATE = "p5";
				fogOfWar.gotoAndPlay(FOG_STATE);
			}
		}
		
		if(player.fear >= 80 && player.fear < 90)
		{
			if(FOG_STATE == "p5")
			{
				fogOfWar.on("animationend", function(evt){FOG_STATE = "p6";  fogOfWar.gotoAndPlay(FOG_STATE); evt.remove();});
				FOG_STATE = "ANIMATING";
				fogOfWar.gotoAndPlay("p5_p6");
			}
			else
			{
				FOG_STATE == "p6";
				fogOfWar.gotoAndPlay(FOG_STATE);
			}
		}
		
		if(player.fear >= 90 && player.fear < 100)
		{
			if(FOG_STATE == "p6")
			{
				fogOfWar.on("animationend", function(evt){FOG_STATE = "p7";  fogOfWar.gotoAndPlay(FOG_STATE); evt.remove();});
				FOG_STATE = "ANIMATING";
				fogOfWar.gotoAndPlay("p6_p7");
			}
			else
			{
				FOG_STATE = "p7";
				fogOfWar.gotoAndPlay(FOG_STATE);
			}
		}
		
		if(player.fear === 100)
		{
			if(FOG_STATE == "p7")
			{
				fogOfWar.on("animationend", function(evt){FOG_STATE = "p8";  fogOfWar.gotoAndPlay(FOG_STATE); evt.remove();});
				FOG_STATE = "ANIMATING";
				fogOfWar.gotoAndPlay("p7_p8");
			}
			else
			{
				FOG_STATE = "p8";
				fogOfWar.gotoAndPlay(FOG_STATE);
			}
		}
	}

}
//-------------------------------------------------------------------------------------------------//




/*----------------------------Enemy----------------------------*/
//functioning only for wisps right now


function handleEnemyMovement()
{
	for(var i = 0; i < enemies.length; i++)
	{
        switch(enemies[i].state)
        {
            case PlayerStates.idle:
                var up = playerAtTile(enemies[i].tileY-1,enemies[i].tileX);
                var right = playerAtTile(enemies[i].tileY,enemies[i].tileX+1);
                var down = playerAtTile(enemies[i].tileY+1,enemies[i].tileX);
                var left = playerAtTile(enemies[i].tileY,enemies[i].tileX-1);
                if(up!==null || right!==null || down!==null || left!==null)
                {
                    enemies[i].state = PlayerStates.attacking;
					console.log("getting called");
                    enemies[i].graphic.gotoAndPlay("attack");
                    var en = enemies[i];
                    enemies[i].graphic.on("animationend", function(evt){console.log(evt);en.state = PlayerStates.idle; en.graphic.gotoAndPlay("idle"); evt.remove();                     if((player.state == PlayerStates.idle || player.state == PlayerStates.attacking) && (playerAtTile(en.tileY-1,en.tileX) != null || playerAtTile(en.tileY,en.tileX+1) != null || playerAtTile(en.tileY+1,en.tileX) != null || playerAtTile(en.tileY,en.tileX-1)))
                    {
                        player.health-=en.attack;
						createjs.Sound.play("hitSnd");
                    }});
                    //if((player.state == PlayerStates.idle || player.state == PlayerStates.attacking) && (playerAtTile(enemies[i].tileY-1,enemies[i].tileX) != null || playerAtTile(enemies[i].tileY,enemies[i].tileX+1) != null || playerAtTile(enemies[i].tileY+1,enemies[i].tileX) != null || playerAtTile(enemies[i].tileY,enemies[i].tileX-1)))
                    //{
                        //player.health-=enemies[i].attack;
                    //}
                }
				else if(enemies[i].wantsToMove)
				{
					if(Math.floor((Math.random() * 10) + 1) > 7)
					{
						switch(Math.floor((Math.random() * 4)))
						{
							case 0:
								enemyDown(enemies[i]);
								break;
							case 1:
								enemyLeft(enemies[i]);
								break;
							case 2:
								enemyRight(enemies[i]);
								break;
							case 3:
								enemyUp(enemies[i]);
								break;
						}
					}
				}
                break;
            case PlayerStates.movingDown:
				//enemies[i].graphic.rotation = 180;
				if(enemies[i].graphic.name === "crawlerTan")
				{
					enemies[i].graphic.y += 1;
				}
				else
				{
					enemies[i].graphic.y += 5;
				}
                if(enemies[i].graphic.y - 25 == board[enemies[i].tileY + 1][enemies[i].tileX].graphic.y)
                {
                    enemies[i].tile = board[enemies[i].tileY + 1][enemies[i].tileX];
                    enemies[i].tileY++;
                    board[enemies[i].tileY][enemies[i].tileX].isEntityMovingTo = false;
                    enemies[i].state = PlayerStates.idle;
                    enemies[i].graphic.gotoAndPlay("idle");
                }
                break;
            case PlayerStates.movingLeft:
			//enemies[i].graphic.rotation = 90;
				if(enemies[i].graphic.name === "crawlerTan")
				{
					enemies[i].graphic.x -= 1;
				}
				else
				{
					enemies[i].graphic.x -= 5;
				}
                if(enemies[i].graphic.x - 25 == board[enemies[i].tileY][enemies[i].tileX - 1].graphic.x)
                {
                    enemies[i].tile = board[enemies[i].tileY][enemies[i].tileX - 1];
                    enemies[i].tileX--;
                    board[enemies[i].tileY][enemies[i].tileX].isEntityMovingTo = false;
                    enemies[i].state = PlayerStates.idle;
                    enemies[i].graphic.gotoAndPlay("idle");  
                }
                break;
            case PlayerStates.movingRight:
				//enemies[i].graphic.rotation = 270;
                
				if(enemies[i].graphic.name === "crawlerTan")
				{
					enemies[i].graphic.x += 1;
				}
				else
				{
					enemies[i].graphic.x += 5;
				}
                if(enemies[i].graphic.x - 25 == board[enemies[i].tileY][enemies[i].tileX + 1].graphic.x)
                {
                    enemies[i].tile = board[enemies[i].tileY][enemies[i].tileX + 1];
                    enemies[i].tileX++;
                    board[enemies[i].tileY][enemies[i].tileX].isEntityMovingTo = false;
					enemies[i].state = PlayerStates.idle;
                    enemies[i].graphic.gotoAndPlay("idle");
                }
                break;
            case PlayerStates.movingUp:
			//enemies[i].graphic.rotation = 0;
				if(enemies[i].graphic.name === "crawlerTan")
				{
				console.log("called");
					enemies[i].graphic.y -= 1;
				}
				else
				{
					enemies[i].graphic.y -= 5;
				}
                if(enemies[i].graphic.y - 25 == board[enemies[i].tileY - 1][enemies[i].tileX].graphic.y)
                {
                    enemies[i].tile = board[enemies[i].tileY - 1][enemies[i].tileX];
                    enemies[i].tileY--;
                    board[enemies[i].tileY][enemies[i].tileX].isEntityMovingTo = false;
                    enemies[i].state = PlayerStates.idle;
                    enemies[i].graphic.gotoAndPlay("idle");
                }
                break;
            case PlayerStates.attacking:
                //createjs.Sound.play("atkSound");
                break;
        }
    }
}
	
function enemyUp(enemy)
{
    if(isTileMoveAllowed(enemy.tileX, enemy.tileY - 1, enemy.isFlying))
    {
		enemy.graphic.rotation = 0;
        enemy.state = PlayerStates.movingUp;
        enemy.graphic.gotoAndPlay("walk");
		enemy.wantsToMove = false;
        board[enemy.tileY - 1][enemy.tileX].isEntityMovingTo = true;
    }
}
function enemyDown(enemy)
{
    if(isTileMoveAllowed(enemy.tileX, enemy.tileY + 1, enemy.isFlying))
    {
		enemy.graphic.rotation = 180;
        enemy.state = PlayerStates.movingDown;
        enemy.graphic.gotoAndPlay("walk");
		enemy.wantsToMove = false;
        board[enemy.tileY + 1][enemy.tileX].isEntityMovingTo = true;
    }
}
function enemyLeft(enemy)
{
    if(isTileMoveAllowed(enemy.tileX - 1, enemy.tileY, enemy.isFlying))
    {
		enemy.graphic.rotation = 270;
        enemy.state = PlayerStates.movingLeft;
        enemy.graphic.gotoAndPlay("walk");
		enemy.wantsToMove = false;
        board[enemy.tileY][enemy.tileX - 1].isEntityMovingTo = true;
    }
}
function enemyRight(enemy)
{
    if(isTileMoveAllowed(enemy.tileX + 1, enemy.tileY, enemy.isFlying))
    {
		var ex = enemy.x;
		var ey = enemies.y;
		enemy.graphic.rotation = 90;
		enemy.x = ex;
		enemies.y = ey;

        enemy.state = PlayerStates.movingRight;
        enemy.graphic.gotoAndPlay("walk");
		enemy.wantsToMove = false;
        board[enemy.tileY][enemy.tileX + 1].isEntityMovingTo = true;
    }
}

function goToNextLevel(level)
{
	clearThings();

	if(level == 1)
	{
	
	}
	else if(level == 2)
	{
	
	}
	else if (level == 3)
	{
	
	}
	else if (level == 4)
	{
	
	}
}
