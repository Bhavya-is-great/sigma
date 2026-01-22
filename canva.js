// The Dom elements goes here
let canvas = document.getElementById("canvas");
let addRectangleBtn = document.getElementById("addRectangle");
let addTextbox = document.getElementById("addTextbox");
let getImagebtn = document.getElementById("getImage");
let panel = document.getElementById("panel");

// The array show the elememts
let elements = [];

addRectangleBtn.addEventListener("click", addRectangle);
addTextbox.addEventListener("click", () => {});
getImagebtn.addEventListener("click", () => {});


function addRectangle() {
    let newRectangle = new rectangle();
    newRectangle.addElement();
    elements.push(newRectangle);
    updateElements();
}

class rectangle {
    constructor() {
        this.type = "rectangle";
        this.x = 0;
        this.y = 0;
        this.width = "60px";
        this.height = "40px";
        this.classes = ["rectangle", "select"];
        this.Bgcolor = `rgba(${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)})`;
        this.borderRadius = "2px";
        this.rotationDeg = "0deg";
        this.id = `rectangle ${elements.length}`;
        this.element = document.createElement('div');
        this.element.classList.add(...this.classes);
        this.element.style.width = this.width;
        this.element.style.height = this.height;
        this.element.style.left = this.x;
        this.element.style.top = this.y;
        this.element.style.transform = `rotate(${this.rotationDeg})`;
        this.element.id = this.id;
        this.element.style.background = this.Bgcolor;
        this.element.style.zIndex = elements.length;
    }

    addElement() {
        canvas.appendChild(this.element);
    }
}

function updateElements() {
    panel.innerHTML = "";
    elements.forEach(ele => {
        panel.appendChild(makePanelElement(ele))
    });
}

function makePanelElement(ele) {
    // created the main layer
    const newEle = document.createElement('div');
    newEle.classList.add('layer');

    // Applied the name of the layer
    const name = document.createElement('span');
    name.innerText = ele.id;
    name.classList.add("name");

    // made a div to contain buttons
    const arrowButtons = document.createElement('div');
    arrowButtons.classList.add("arrowBtn");

    // made a up button
    const upButton = document.createElement('button');
    upButton.classList.add('upBtn');

    //add a image to it 
    const upImg = document.createElement('img');
    upImg.src = "./svgs/arrowup.svg";
    upImg.classList.add('upImg');

    // made a down button
    const downButton = document.createElement('button');
    downButton.classList.add('downBtn');

    //added and styled the image to it
    const downImg = document.createElement('img');
    downImg.src = "./svgs/arrowup.svg";
    downImg.classList.add('downImg');
    downImg.style.transform = "rotate(180deg)";
    

    //combinig and appending
    newEle.appendChild(name);
    upButton.appendChild(upImg);
    arrowButtons.appendChild(upButton)
    downButton.appendChild(downImg);
    arrowButtons.appendChild(downButton);
    newEle.appendChild(arrowButtons);

    return newEle;
}