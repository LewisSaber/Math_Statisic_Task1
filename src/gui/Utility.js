import { Button } from "./Button.js";
import Gui from "./Gui.js";


export function loadUtility() {
    HTMLElement.prototype.setSize = function (sizeVector, type = "px") {

        this.style.width = sizeVector.x + type
        this.style.height = sizeVector.y + type
    }
    HTMLElement.prototype.setPosition = function (pozitionVector, type = "px") {
        this.style.left = pozitionVector.x + type
        this.style.top = pozitionVector.y + type
    }
    HTMLElement.prototype.setBackgroundImage = function (url) {

        this.style.backgroundImage = url == "none" ? url : `url(${url})`
    }
    HTMLElement.prototype.setZLayer = function (layer) {
        this.style.zIndex = layer
    }
    HTMLElement.prototype.disablePointerEvents = function () {
        this.style.pointerEvents = "none"
    }
    HTMLElement.prototype.disableContextMenu = function () {
        this.oncontextmenu = () => false
    }
    HTMLElement.prototype.applyStyle = function (style) {
        if (style instanceof Object)

            for (const key in style) {
                this.style.setProperty(key, style[key])
            }
        else {
            console.warn("applying bad style", style)
        }

    }
    HTMLElement.prototype.applyAttributes = function (attributes) {

        if (attributes instanceof Object) {

            for (const key in attributes) {
                this.setAttribute(key, attributes[key])
            }
        }
        else {
            console.warn("applying bad attribute", attributes)
        }

    }

    String.prototype.color = function (color) {
        let elem = document.createElement("span")
        elem.style.color = color
        elem.innerHTML = this
        return elem.outerHTML
    }

    String.prototype.capitalize = function () {

        return this[0].toUpperCase() + this.substring(1)
    }


    Object.defineProperty(Object.prototype, 'get', {
        get: function () {
            return function (key, default_value = 0) {
                return this[key] || default_value;
            };
        },
        configurable: true,
        enumerable: false,

    });


    Object.defineProperty(Array.prototype, 'sum', {
        get: function () {
            let sum = 0
            for (let i = 0; i < this.length; i++) {
                sum += this[i]
            }
            return sum
        },
        enumerable: false
    });

    Object.defineProperty(Array.prototype, 'max', {
        get: function () {
            let max = 0
            for (let i = 0; i < this.length; i++) {
                if (max < this[i])
                    max = this[i]
            }
            return max
        },
        enumerable: false
    });

    Object.defineProperty(Array.prototype, 'min', {
        get: function () {
            let min = Infinity
            for (let i = 0; i < this.length; i++) {
                if (min > this[i])
                    min = this[i]
            }
            return min
        },
        enumerable: false
    });

}


export function createEmptyArray(width, height) {
    let result = new Array(height)
    for (let i = 0; i < height; i++) {
        result[i] = new Array(width)
    }
    return result
}

export class NumberRange {
    constructor(start = 0, end = 0) {
        this.start = start
        this.end = end
    }
    isNumberIn_inclusive(number) {
        return number >= this.start && number <= this.end
    }
    isNumberIn_exclusive(number) {
        return number >= this.start && number < this.end
    }
    toString() {
        return `${this.start} - ${this.end}`
    }
    middle() {
        return (this.start + this.end) / 2
    }
    allValues(inclusive = false) {
        let result = []
        for (let i = this.start; i < this.end + inclusive; i++) {
            result.push(i)
        }
        return result
    }
    length(inclusive = false) {
        return this.end - this.start + inclusive
    }

}
let next_id = 0
export function getUniqueIdentificator() {
    next_id++
    return next_id
}
/**
 * Will overwrite every property of original object with properties of pulling_from 
 * @example {a:2,b:7} + {b:9,c:6} => {a:2,b:9,c:6}
 * @param {Object} original 
 * @param {Object} pulling_from 
 * @returns 
 */
export function mergeObject(original, pulling_from) {
    if (original == undefined)
        original = pulling_from
    else
        for (const key in pulling_from) {
            if (pulling_from[key] instanceof Object) {
                if (original[key] == undefined)
                    original[key] = pulling_from[key]
                else
                    original[key] = mergeObject(original[key], pulling_from[key])
            }
            else
                original[key] = pulling_from[key]

        }
    return original
}
/** Reverses keys and items of  object */
export function reverseObject(object) {
    let result = {}
    for (const key in object) {
        result[object[key]] = key
    }
    return result
}

export function closingButton() {
    let button = new Button()
        .setSize(0.5, 0.5)
        .setPosition(.7, .2)
        .positionFromRight()

        .setText("X", 0.3)
        .addAction(() => { button.parent.close() })
        .setBackGround(getImg("background"))
    return button
}

export function getImg(img, extension = "png") {
    return './src/assets/' + img + "." + extension
}

export default function mainGui(height = 12) {
    let mainGui = new Gui().setParentSize().setHeight(height).setFontSize(0.3).build()

    window.addEventListener("resize", function () {

        mainGui.computeSize().resize()
    })
    document.getElementById("body").appendChild(mainGui.getContainer())
    return mainGui
}

export function functionMerger(...funcs) {
    let list = funcs
    let merger = (...args) => {
        let obj = {}
        for (const func of list) {
            obj = mergeObject(obj, func(args))
        }
        return obj
    }
    return merger
}