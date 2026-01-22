// The Dom elements goes here
let canvas = document.getElementById("canvas");
let addRectangleBtn = document.getElementById("addRectangle");
let addTextbox = document.getElementById("addTextbox");
let getImagebtn = document.getElementById("getImage");
let panel = document.getElementById("panel");

// The array show the elememts
let elements = [];

// Come Event listeners Lie here
addRectangleBtn.addEventListener("click", addRectangle);
addTextbox.addEventListener("click", addTextBox);
getImagebtn.addEventListener("click", () => { });

// Counstructors lie Below 
class rectangle {
    constructor() {

        // Creating a div
        this.name = `rectangle ${elements.length}`
        this.type = "rectangle";
        this.x = 0;
        this.y = 0;
        this.width = "200px";
        this.height = "60px";
        this.classes = ["rectangle", "select"];
        this.Bgcolor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
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

class textBox {
    constructor() {

        // Creating a div
        this.name = `textBox ${elements.length}`
        this.type = "textBox";
        this.x = 0;
        this.y = 0;
        this.width = "200px";
        this.height = "60px";
        this.classes = ["textBox", "select"];
        this.Bgcolor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
        this.borderRadius = "2px";
        this.rotationDeg = "0deg";
        this.id = `textBox${elements.length}`;
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
        this.value = "";
        this.Retype();
        this.focus = 0;
    }

    addElement() {
        canvas.appendChild(this.element);
    }

    takeInput() {
        this.inputDiv = document.createElement('input');
        this.inputDiv.type = "text";
        this.inputDiv.classList.add("inputBox");
        this.inputDiv.id = `textBox ${elements.length}Input`;
        this.element.appendChild(this.inputDiv);
        this.addEvent();
    }

    focusELe() {
        this.inputDiv.focus();
    }

    addEvent() {
        this.inputDiv.addEventListener("keypress", (e) => {
            if(e.key == "Enter") {
                this.value = this.inputDiv.value.trim();
                this.inputDiv.remove();
                this.element.innerText = this.value;
            }
        });
        document.addEventListener('click', () => {
            if(document.activeElement.id == this.inputDiv.id) {
                this.focus = 1;
            }else {
                this.value = this.inputDiv.value.trim();
                this.inputDiv.remove();
                this.element.innerText = this.value;
                this.focus = 0;
            }
        })
    }

    Retype() {
        this.element.addEventListener("dblclick", () => {
            this.element.innerText = "";
            this.element.appendChild(this.inputDiv);
            this.inputDiv.focus()
        });
    }
}

// Functions lie Below
function makePanelElement(ele) {
    // created the main layer
    const newEle = document.createElement('div');
    newEle.classList.add('layer');

    // Applied the name of the layer
    const name = document.createElement('span');
    name.innerText = ele.name;
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

function addRectangle() {
    const newRectangle = new rectangle();
    newRectangle.addElement();
    elements.push(newRectangle);
    updateElements();
}

function addTextBox() {
    const newTextBox = new textBox();
    newTextBox.takeInput();
    newTextBox.addElement();
    elements.push(newTextBox);
    updateElements();
    newTextBox.focusELe();
}

function updateElements() {
    panel.innerHTML = "";
    elements.forEach(ele => {
        panel.appendChild(makePanelElement(ele))
    });
}