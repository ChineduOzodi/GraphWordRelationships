var canvas;
var inputValue;
var wordList = [];
var wordRelationshipData = {};
var wordObjectList = [];
var lineObjectsList = [];
var showName = true;
var showCircle = true;
var stopwords = ['all', 'just', 'being', 'over', 'both', 'through', 'yourselves', 'its', 'before', 'herself', 'had', 'should', 'to', 'only', 'under', 'ours', 'has', 'do', 'them', 'his', 'very', 'they', 'not', 'during', 'now', 'him', 'nor', 'did', 'this', 'she', 'each', 'further', 'where', 'few', 'because', 'doing', 'some', 'are', 'our', 'ourselves', 'out', 'what', 'for', 'while', 'does', 'above', 'between', 't', 'be', 'we', 'who', 'were', 'here', 'hers', 'by', 'on', 'about', 'of', 'against', 's', 'or', 'own', 'into', 'yourself', 'down', 'your', 'from', 'her', 'their', 'there', 'been', 'whom', 'too', 'themselves', 'was', 'until', 'more', 'himself', 'that', 'but', 'don', 'with', 'than', 'those', 'he', 'me', 'myself', 'these', 'up', 'will', 'below', 'can', 'theirs', 'my', 'and', 'then', 'is', 'am', 'it', 'an', 'as', 'itself', 'at', 'have', 'in', 'any', 'if', 'again', 'no', 'when', 'same', 'how', 'other', 'which', 'you', 'after', 'most', 'such', 'why', 'a', 'off', 'i', 'yours', 'so', 'the', 'having', 'once'];

var maxObjSize = 20;
//text sizee
var textMinObjSize = 0;
var textMaxObjSize = 20;
var textScale = 1;

var minTextSlider;
var maxTextSlider;
var textScaleSlider;

//Camera work
var oldCenterOfMassX = 0;
var oldCenterOfMassY = 0;
var centerOfMassX = 0;
var centerOfMassY = 0;
var totalMass = 0;

var changeCenterOfMassX = 0;
var changeCenterOfMassY = 0;

function setup() {
    canvas = createCanvas(1200, 800);
    canvas.id('sketch');
    background(255);
    fill(100, 200, 100);
    ellipse(width / 2, height / 2, 20, 20);
    inputValue = createInput("Make fancy scatter and linear plots that update in real time. Display histograms in the vertical and horizontal directions.Add several layers with different properties to the same plot.It works both with linear and logarithmic scales.Automatic axis tick determination.Interactive zooming and panning. Make your data move!Add labels to your points and display them with one click.You can use images to represent your points.Highly customizable. Defaults are nice, but you can tweak almost everything.Processing coding style. If you are used to work with Processing (or p5.js), grafica.js will be very easy.It comes with a good set of examples. Check them live at openprocessing and JSFiddle.It's open source. grafica.js is under the GNU Lesser General Public License. You can find the complete source code here.");
    calculateButton = createButton('Calculate');
    calculateButton.mousePressed(createData);
    showNameButton = createButton("Names")
    showNameButton.mousePressed(showNames);
    showCircleButton = createButton("Circles")
    showCircleButton.mousePressed(toggleCircles);
    textScaleSlider = createSlider(.5, 5, 1, .1);
    textScaleSlider.input(textScaleChange);
    button = createButton("Select All");
    button.mousePressed(activateAll);
    button = createButton("Deselect All");
    button.mousePressed(deactivateAll);
    minTextSlider = createSlider(0, textMaxObjSize - 1, 0);
    minTextSlider.input(minTextSliderChanged);

    maxTextSlider = createSlider(2, 50, 50);
    maxTextSlider.input(maxTextSliderChanged);
}
function activateAll() {
    for (var i = 0; i < wordObjectList.length; i++) {
        wordObjectList[i].active = true;
    }
}

function deactivateAll() {
    for (var i = 0; i < wordObjectList.length; i++) {
        wordObjectList[i].active = false;
    }
}

function maxTextSliderChanged() {
    textMaxObjSize = this.value();
    minTextSlider.attribute("max", this.value() - 1);
}

function minTextSliderChanged() {
    textMinObjSize = this.value();
}
function textScaleChange() {
    textScale = this.value();
}

function toggleCircles() {
    showCircle = !showCircle;
}
function showNames() {
    showName = !showName;
}

function createData() {

    //Reset Data
    lineObjectsList = [];
    wordList = [];
    wordRelationshipData = {};

    var s = str(inputValue.value());
    var punctuationless = s.replace(/[^\w\s]|_/g, "");
    var finalString = punctuationless.replace(/\s+/g, " ");
    var allWords = str(finalString.toLowerCase()).split(" ");
    wordList = allWords.filter(x => !(stopwords.includes(x) || x.length < 2));

    print(allWords.length + ' - ' + wordList.length);

    // Create the data in the object
    for (var i = 0; i < wordList.length; i++) {
        // Check and add new words to object
        if (!(wordList[i] in wordRelationshipData)) {
            wordRelationshipData[wordList[i]] = [];
        }
        //add words to the left of word to the words array
        if (i > 0) {
            //Check to make sure the word isn't itself 
            if (wordList[i] != wordList[i - 1]) {
                //check to see if word alread added to relationship list
                if (lineObjectsList.find((x) => wordList[i] == x.beginWord && wordList[i - 1] == x.endWord) != undefined) {
                    //increase the line width
                    var oldLine = lineObjectsList.find((x) => wordList[i] == x.beginWord && wordList[i - 1] == x.endWord);
                    oldLine.width += 10;
                }
                else {
                    wordRelationshipData[wordList[i]].push(wordList[i - 1]);

                    lineObjectsList.push(new wordLine());
                    var newLine = lineObjectsList[lineObjectsList.length - 1];
                    newLine.beginWord = wordList[i];
                    newLine.endWord = wordList[i - 1];
                }

            }

        }
        //add words to the right of word to the words array
        if (i < wordList.length - 1) {
            if (wordList[i] != wordList[i + 1]) {
                if (lineObjectsList.find((x) => wordList[i] == x.beginWord && wordList[i + 1] == x.endWord) != undefined) {
                    //increase the line width
                    var oldLine = lineObjectsList.find((x) => wordList[i] == x.beginWord && wordList[i + 1] == x.endWord);
                    oldLine.width += 20;
                }
                else {
                    wordRelationshipData[wordList[i]].push(wordList[i + 1]);

                    lineObjectsList.push(new wordLine());
                    var newLine = lineObjectsList[lineObjectsList.length - 1];
                    newLine.beginWord = wordList[i];
                    newLine.endWord = wordList[i + 1];
                }

            }
        }
    }

    setWordGraph();

}

function setWordGraph() {
    //Reset data
    wordObjectList = [];
    centerOfMassX = 0;
    centerOfMassY = 0;
    totalMass = 0;

    //Create objects in lise
    for (var i = 0; i < wordList.length; i++) {
        //add words to the left of word to the words array
        if (wordObjectList.length < 1 || wordObjectList.findIndex((x) => x.name == wordList[i]) < 0) {
            wordObjectList.push(new word());
            var newWord = wordObjectList[wordObjectList.length - 1];
            newWord.x = random(0, width);
            newWord.y = random(0, height);
            newWord.name = wordList[i];



            var filteredLines = lineObjectsList.filter(x => x.beginWord == newWord.name);
            // print(filteredLines);
            for (b = 0; b < filteredLines.length; b++) {
                newWord.size += filteredLines[b].width * .1;
            }

            //set maxTextSlider
            if (newWord.size > textMaxObjSize){
                textMaxObjSize = newWord.size;
                maxTextSlider.attribute("max", textMaxObjSize);
                minTextSlider.attribute("max", textMaxObjSize- 1);
                maxObjSize = newWord.size;

                maxTextSlider.value(textMaxObjSize);
            }

            //add to center of mass
            centerOfMassX += newWord.x * newWord.size;
            centerOfMassY += newWord.y * newWord.size;
            totalMass += newWord.size;
        }

    }

    calculateCenterOfMass();
}

function word() {
    this.x = 0;
    this.y = 0;
    this.velX = 0;
    this.velY = 0;
    this.forceX = 0;
    this.forceY = 0;
    this.size = 0;
    this.name = "";
    this.alphaScale = 1;
    this.active = true;

    this.colorR = random(0,200);
    this.colorG = random(0,200);
    this.colorB = random(50,255);

    this.display = function () {

        if (this.active && this.size > textMinObjSize && this.size <= textMaxObjSize) {
            this.alphaScale = 1;
        }
        else {
            this.alphaScale = .1;
        }

        if (showCircle) {
            stroke(50);
            noStroke();
            fill(this.colorR, this.colorG, this.colorB, 255 * this.alphaScale);
            ellipse(this.x, this.y, this.size, this.size);
        }


        if (textScale * this.size / 2 + 5 > 0) {
            strokeWeight(1);
            stroke(255, 255, 255, 255 * this.alphaScale);
        }
        else {
            noStroke();
        }
        fill(0, 0, 0);
        if (showName && this.active && this.size > textMinObjSize && this.size <= textMaxObjSize) {
            textSize(textScale * this.size / 1.2 + 5);
            text(this.name, this.x, this.y); // Text wraps within text box
            textAlign(CENTER, CENTER);
        }
    }

    this.clicked = function () {
        if (dist(this.x, this.y, mouseX, mouseY) <= this.size) {
            this.active = !this.active;
            // for (var i = 0; i < lineObjectsList.length; i++) {
            //     if (lineObjectsList[i].beginWord == this.name){
            //         var endWord = wordObjectList.find((x) => x.name == lineObjectsList[i].endWord);
            //         endWord.active = true;
            //     }
            // }
        }
    }

    this.move = function () {

        // print('force: ' + this.forceX + ' ' + this.forceY);

        //apply drag force
        if (this.velX < 0) {
            this.forceX += .5 * this.velX * this.velX;
        }
        else {
            this.forceX -= .5 * this.velX * this.velX;
        }

        if (this.velY < 0) {
            this.forceY += .5 * this.velY * this.velY;
        }
        else {
            this.forceY -= .5 * this.velY * this.velY;
        }

        //Gravitational push forces

        for (var i = 0; i < wordObjectList.length; i++) {
            var obj = wordObjectList[i];
            if (obj.name != this.name) {
                var distance = dist(this.x, this.y, obj.x, obj.y);
                var transX = this.x - obj.x;
                var transY = this.y - obj.y;
                var biggesTrans = abs(transX);
                if (abs(transY) > biggesTrans) {
                    biggesTrans = abs(transY);
                }
                var forceChangeX = .1 * (transX / biggesTrans) * this.size * obj.size * this.size * obj.size / (distance * distance);
                var forceChangeY = .1 * (transY / biggesTrans) * this.size * obj.size * this.size * obj.size / (distance * distance);
                if (distance < this.size + obj.size){
                    forceChangeX *= 10;
                    forceChangeY *= 10;
                }
                if (!isNaN(forceChangeX)){
                    this.forceX += forceChangeX;
                }
                if(!isNaN(forceChangeY)){
                    this.forceY += forceChangeY;
                }
            }
        }

        forceLimit = 50;
        //Set accel Limit
        if (this.forceX > forceLimit) {
            this.forceX = forceLimit;
        }
        if (this.forceX < -forceLimit) {
            this.forceX = -forceLimit;
        }
        if (this.forceY > forceLimit) {
            this.forceY = forceLimit;
        }
        if (this.forceY < -forceLimit) {
            this.forceY = -forceLimit;
        }

        // print('new force: ' + this.forceX + ' ' + this.forceY);

        //apply force to velocity; assume 60 frames per second
        this.velX += this.forceX / frameRate() / this.size - changeCenterOfMassX * frameRate();
        this.velY += this.forceY / frameRate() / this.size - changeCenterOfMassY * frameRate();

        //apply movement; assume 60 frames per second
        // print('vel: ' + this.velX + ' ' + this.velY);

        this.x += this.velX / frameRate();
        this.y += this.velY / frameRate();

        //Set boundaries

        if (this.x > width - 20) {
            this.x = width - 20;
        }
        if (this.x < 20) {
            this.x = 20;
        }
        if (this.y > height - 20) {
            this.y = height - 20;
        }
        if (this.y < 20) {
            this.y = 20;
        }

        //add to center of mass
        centerOfMassX += this.x * this.size;
        centerOfMassY += this.y * this.size;
        totalMass += this.size;
        //reset force
        this.forceX = 0;
        this.forceY = 0;
        // print('pos: ' + this.x + ' ' + this.x);
    }

}

function wordLine() {
    this.beginWord = "";
    this.endWord = "";
    this.length = 0;
    this.width = 20;
    this.currentLength = 0;
    this.alphaScale = 1;

    this.pushPull = function () {
        //pull/push end word object towards desired length
        var beginWord = wordObjectList.find((x) => x.name == this.beginWord);
        var endWord = wordObjectList.find((x) => x.name == this.endWord);
        this.currentLength = dist(beginWord.x, beginWord.y, endWord.x, endWord.y);
        var transX = beginWord.x - endWord.x;
        var transY = beginWord.y - endWord.y;
        var biggesTrans = abs(transX);
        var speed = .5;
        this.length = pow(beginWord.size + endWord.size, 1.5) / 2 + 50;
        if (abs(transY) > biggesTrans) {
            biggesTrans = abs(transY);
        }
        //Pull object
        //  print(beginWord.name + ' l: ' + this.currentLength+ ' pulling ' + endWord.name);
        endWord.forceX += transX / biggesTrans * speed * beginWord.size * (this.currentLength - this.length);
        endWord.forceY += transY / biggesTrans * speed * beginWord.size * (this.currentLength - this.length);

        //Make colors more similar
        if ( abs(beginWord.colorR - endWord.colorR) > (beginWord.size + endWord.size) * .5){
            endWord.colorR += (beginWord.colorR - endWord.colorR) * .01;
        }
        else{
            endWord.colorR -= (beginWord.colorR - endWord.colorR) * .01;
        }
        if ( abs(beginWord.colorG - endWord.colorG) > (beginWord.size + endWord.size) * .5){
            endWord.colorG += (beginWord.colorG - endWord.colorG) * .01;
        }
        else{
            endWord.colorG -= (beginWord.colorG - endWord.colorG) * .01;
        }
        if ( abs(beginWord.colorB - endWord.colorB) > (beginWord.size + endWord.size) * .5){
            endWord.colorB += (beginWord.colorB - endWord.colorB) * .01;
        }
        else{
            endWord.colorB -= (beginWord.colorB - endWord.colorB) * .01;
        }

        //Add limits to the color
        if(endWord.colorR > 255){
            endWord.colorR = 255;
        }
        if(endWord.colorG > 255){
            endWord.colorG = 255;
        }
        if(endWord.colorB > 255){
            endWord.colorB = 255;
        }
        if(endWord.colorR < 0){
            endWord.colorR = 0;
        }
        if(endWord.colorG < 0){
            endWord.colorG = 0;
        }
        if(endWord.colorB < 0){
            endWord.colorB = 0;
        }
    }

    this.display = function () {
        var beginWord = wordObjectList.find((x) => x.name == this.beginWord);
        var endWord = wordObjectList.find((x) => x.name == this.endWord);

        if (beginWord.active && beginWord.size > textMinObjSize && beginWord.size <= textMaxObjSize) {
            this.alphaScale = 1;
        }
        else {
            this.alphaScale = .1;
        }

        // print(beginWord);
        if (beginWord && endWord) {
            stroke((beginWord.colorR + endWord.colorR) / 2 ,(beginWord.colorG + endWord.colorG) / 2 ,(beginWord.colorB + endWord.colorB) / 2 , this.alphaScale * 255 * .5);
            strokeWeight(this.width / 10);
            line(beginWord.x, beginWord.y, endWord.x, endWord.y);
        }

    }
}

function mousePressed() {
    for (var i = 0; i < wordObjectList.length; i++) {
        wordObjectList[i].clicked();
    }
}

function calculateCenterOfMass(){
    oldCenterOfMassX = centerOfMassX / (totalMass * lineObjectsList.length);
    oldCenterOfMassY = centerOfMassY / (totalMass * lineObjectsList.length);

    //Reset
    centerOfMassX = 0;
    centerOfMassY = 0;
    totalMass = 0;
}

function calculateCenterOfMassChange(){
    newCenterOfMassX = centerOfMassX / (totalMass * lineObjectsList.length);
    newCenterOfMassY = centerOfMassY / (totalMass * lineObjectsList.length);
    changeCenterOfMassX = newCenterOfMassX - oldCenterOfMassX;
    changeCenterOfMassY = newCenterOfMassY - oldCenterOfMassY;

    //Reset
    centerOfMassX = 0;
    centerOfMassY = 0;
    totalMass = 0;
}

function draw() {
    background(255);
    // print(wordList);


    for (var i = 0; i < lineObjectsList.length; i++) {
        lineObjectsList[i].display();
    }

    for (var i = 0; i < wordObjectList.length; i++) {
        wordObjectList[i].display();
    }

    for (var i = 0; i < lineObjectsList.length; i++) {
        lineObjectsList[i].pushPull();
    }

    for (var i = 0; i < wordObjectList.length; i++) {
        wordObjectList[i].move();
    }
    if (wordObjectList.length > 0){
        calculateCenterOfMassChange();
    }
}


