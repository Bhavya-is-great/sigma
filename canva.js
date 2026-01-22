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
        this.rotationDeg = "0deg"
        this.element = document.createElement('div');
        this.element.classList.add(...this.classes);
        this.element.style.width = this.width;
        this.element.style.height = this.height;
        this.element.style.left = this.x;
        this.element.style.top = this.y;
        this.element.style.transform = `rotate(${this.rotationDeg})`;
        this.element.id = elements.length;
        this.element.style.background = this.Bgcolor;
        this.element.style.zIndex = this.element.id;
    }

    addElement() {
        canvas.appendChild(this.element);
    }
}

function updateElements() {
    panel.innerHTML = "";
    elements.forEach(ele => {
        panel.appendChild(ele)
    });
}