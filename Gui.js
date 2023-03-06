

import { Vector } from "./math.js"
import { getUniqueIdentificator, mergeObject } from "./Utility.js"


export default class Gui {
    constructor() {
        this.name = "name"
        this.size = new Vector(0, 0)

        this.isOpen = false
        this.position = new Vector()
        this.components = []
        this.queue = []
        this.z_layer_additional = 0
        this.z_layer_parental = 0
        this.activeGuis = {}
        this.positionalOptions = {
            fromButtom: false,
            fromRight: false,
            centered: {
                x: false,
                y: false
            }
        }
        this.attributes = {}
        this.decorations = {}
        this.isBuilt = false
        this.isDraggable = false
        this.isResizable = false
        this.subscribers = {}
    }
    addAttributes(attributes) {

        this.attributes = mergeObject(this.attributes, attributes)
        if (this.isBuilt)
            this.applyAttributes()
        return this
    }
    applyAttributes() {
        this.container.applyAttributes(this.attributes)
    }

    applyResize() {

        this.container.style.resize = this.isResizable ? "both" : "none"

    }
    setBackGround(img) {
        this.backgroundImg = img
        return this
    }
    getName() {
        return this.name
    }

    decorationGrid(size) {
        let pixelsize = this.getPixelSize()
        return {


            'background-image': 'linear-gradient(rgba(0, 255, 0, .7) .05em, transparent .1em), linear-gradient(90deg, rgba(0, 255, 0, .7) .1em, transparent .1em)',
            'background-size': `${pixelsize.x}px ${pixelsize.y}px`
        }
    }
    getFontSize() {
        return this.fontSize || this.parent.getFontSize()
    }
    setName(name) {
        this.name = name
        return this
    }

    setFontSize(fontSize) {
        this.fontSize = fontSize
        if (this.isBuilt)
            this.applyFontSize(this.getPixelSize())
        return this
    }
    applyFontSize(pixelSize) {
        this.container.style.fontSize = this.getFontSize() * (Math.min(pixelSize.x, pixelSize.y)) + "px"
    }

    setPosition(x, y) {
        if (x instanceof Vector)
            this.position = x
        else {

            if (x == -2)
                x = this.position.x
            if (y == -2)
                y = this.position.y


            this.position = new Vector(x, y)
            if (this.isBuilt)
                this.resizePosition()
        }
        return this
    }
    setDraggable(state = true) {
        this.isDraggable = state
        return this
    }
    setResizable(state = true) {
        this.isResizable = state
        if (this.isBuilt)
            this.applyResize()
        return this
    }

    setDecoration(decoration) {
        this.decorations["main"] = decoration
        if (this.isBuilt)
            this.applyDecoration()
        return this
    }

    setSize(x, y) {
        if (x instanceof Vector) {
            this.size = x
        }
        else {
            if (x == -2)
                x = this.size.x
            if (y == -2)
                y = this.size.y
            this.size = new Vector(x, y)
        }
        if (this.isBuilt) {
            this.computeSize()
            this.resize()
        }
        return this
    }

    applyDecoration() {
        if (this.decorations['main'])
            this.container.applyStyle(this.decorations["main"](this.size.multiply(this.getPixelSize()), this.position.multiply(this.getPixelSize()), this))
    }

    setWidth(width) {
        if (width <= 0) {
            console.error("Wrong width", width)
        }
        this.size.x = width
        return this
    }

    setHeight(height) {
        if (height <= 0) {
            console.error("Wrong width", height)
        }
        this.size.y = height
        return this
    }

    getWindowSize() {
        return new Vector(window.innerWidth, window.innerHeight)
    }

    getChannel() {
        return this.channel
    }
    computeSize() {
        if (this.parent == undefined) {

            let windowSize = this.getWindowSize()
            this.pixelSize = new Vector()
            if (this.size.y == -1) {
                if (this.size.x == -1) {
                    console.error("Gui", this.name, "got 0 vector size")
                    return
                }
                this.pixelSize.x = windowSize.x / this.size.x
                this.pixelSize.y = this.pixelSize.x
                this.size.y = windowSize.y / this.pixelSize.y
            } else
                if (this.size.x == -1) {
                    if (this.size.y == -1) {
                        console.error("Gui", this.name, "got 0 vector size")
                        return
                    }
                    this.pixelSize.y = windowSize.y / this.size.y
                    this.pixelSize.x = this.pixelSize.y
                    this.size.x = windowSize.x / this.pixelSize.x
                } else {
                    this.pixelSize.y = windowSize.y / this.size.y
                    this.pixelSize.x = this.pixelSize.y
                }
        }
        else {
            let size = this.parent.getSize()
            if (this.size.x == -1)
                this.size.x = size.x - this.position.x
            if (this.size.y == -1)
                this.size.y = size.y - this.position.y
        }
        return this
        // this.size = windowSize
    }
    setParentSize() {
        this.size = new Vector(-1, -1)
        return this
    }
    createHTMLElement() {
        this.container = document.createElement("div")
    }

    createContainer() {
        this.createHTMLElement()
        this.container.style.display = "none"
        this.container.style.position = "absolute"
        this.container.style.pointerEvents = true ? "all" : "none"
        this.container.disableContextMenu()
        return this
    }

    attachContainer(container) {
        this.container.appendChild(container)
        return this
    }

    detachContainer(container) {
        this.container.removeChild(container)
    }

    getContainer() {

        return this.container
    }
    addListeners() {
        this.container.addEventListener("mouseenter", (evt) => { this.onmouseenter(evt) })
        this.container.addEventListener("mouseleave", (evt) => { this.onmouseleave(evt) })
        this.container.addEventListener("mousedown", (evt) => { this.onmousedown(evt) })
        this.container.addEventListener("mouseup", (evt) => { this.onmouseup(evt) })

    }
    build() {
        this.computeSize()
        this.createContainer()
        this.addListeners()
        this.applyZLayer()
        this.applyResize()
        this.applyAttributes()
        if (this.backgroundImg)
            this.getContainer().setBackgroundImage(this.backgroundImg)
        this.isBuilt = true
        for (let component of this.queue) {

            this.addComponent(component.component, component.channel)

        }
        delete this.queue

        return this
    }
    open() {

        if (this.parent && this.parent.isOpen) {
            if (this.getChannel() != "none")
                this.parent.handleComponentOpen(this)
        }
        this.container.style.display = "block"
        this.isOpen = true

    }
    resizePosition(pixelSize = this.getPixelSize()) {
        let position = this.position.copy()
        if (this.parent) {
            if (this.positionalOptions.centered) {
                if (this.positionalOptions.centered.x) {
                    position.x = (this.parent.size.x - this.size.x) * 0.5
                }
                if (this.positionalOptions.centered.y) {
                    position.y = (this.parent.size.y - this.size.y) * 0.5
                }

            }

            if (this.positionalOptions.fromButtom) {
                position.y = this.parent.size.y - this.position.y - this.size.y
            }
            if (this.positionalOptions.fromRight) {
                position.x = this.parent.size.x - this.position.x - this.size.x
            }
        }
        this.container.setPosition(position.multiply(pixelSize))
    }

    resize() {
        let pixelSize = this.getPixelSize()
        this.container.setSize(this.size.multiply(pixelSize))

        this.resizePosition()


        for (let channel in this.components) {
            for (let component in this.components[channel]) {

                this.components[channel][component].resize()
            }
        }
        this.applyDecoration()
        this.applyFontSize(pixelSize)
        this.dispatchEvent("guiresize")
    }
    show() {
        if (this.isBuilt)
            this.container.style.display = "block"
        return this
    }
    hide() {
        if (this.isBuilt)
            this.container.style.display = "none"
        return this
    }
    close() {
        this.hide()
        this.isOpen = false
        return this
    }
    handleComponentOpen(component) {
        this.activeGuis[component.getChannel()] = component.getName()
        for (const component_in in this.components[component.getChannel()]) {
            if (component.getId() == this.components[component.getChannel()][component_in].getId()) {

                continue
            }
            this.components[component.getChannel()][component_in].close()
        }

    }
    positionCenter(x = true, y = true) {
        this.positionalOptions.centered = {
            x: x,
            y: y
        }
        if (this.isBuilt) {
            this.resizePosition()
        }
        return this
    }
    positionFromButtom() {
        this.positionalOptions.fromButtom = true
        return this
    }

    positionFromRight() {
        this.positionalOptions.fromRight = true
        return this
    }

    addComponent(component, channel = "none") {
        if (!this.isBuilt) {

            this.queue.push({
                component: component,
                channel: channel
            })
            return this
        }

        component.setId().setChannel(channel).setParent(this).setParentalZLayer(this.getZLayer() + 1)
        if (component.isBuilt == false)
            component.build()
        let shouldOpen = false
        if (this.components[channel] == undefined || Object.keys(this.components[channel]).length == 0) {
            shouldOpen = true
            this.components[channel] = {}

        }
        if (channel == "none") {
            shouldOpen = true
        }
        this.components[channel][component.getId()] = component

        component.resize()

        if (shouldOpen)
            component.open()
        this.attachContainer(component.getContainer())
        return this
    }
    removeComponents() {

        if (this.isBuilt) {
            for (let channel in this.components) {
                for (let component in this.components[channel]) {

                    this.removeComponent(this.components[channel][component])
                }
            }
        }
        else {
            this.queue = []
        }
    }

    removeComponent(component) {

        if (component.isBuilt) {
            delete this.components[component.getChannel()][component.getId()]
            this.detachContainer(component.getContainer())
        }
        else {
            console.log("unimplemented")
        }
    }

    setChannel(channel) {
        this.channel = channel
        return this
    }

    setId() {
        this.id = getUniqueIdentificator()
        return this
    }

    getId() {
        return this.id
    }
    addParent(parent, channel) {
        if (parent instanceof Gui) {
            parent.addComponent(this, channel)
        }
        else
            console.error(parent, "is not valid parent")
        return this
    }
    setParent(parent) {
        this.parent = parent
        return this
    }

    getPixelSize() {
        return this.pixelSize || this.parent.getPixelSize()
    }

    getSize() {
        return this.size.isZero() ? this.parent.getSize() : this.size
    }
    getSizeinPixels() {
        return this.getSize().multiply(this.getPixelSize())
    }

    getActiveGui(channel) {
        return this.activeGuis.get(channel, "none")
    }

    setParentalZLayer(layer) {
        this.z_layer_parental = layer
        if (this.isBuilt) {
            this.applyZLayer()
        }
        return this
    }

    setZLayer(layer) {
        this.z_layer_additional = layer
        if (this.isBuilt) {
            this.applyZLayer()
        }
        return this

    }

    applyZLayer() {
        this.getContainer().setZLayer(this.z_layer_parental + this.z_layer_additional)
        return this
    }
    getZLayer() {
        return this.z_layer_parental + this.z_layer_additional
    }
    addTooltipText(text) {
        this.tooltip = () => text
        return this
    }
    addTooltipFunction(func) {
        this.tooltip = func
        return this
    }
    onmouseenter(evt) {
        if (this.tooltip) {
            window.game.getCursor().makeTooltip(this.tooltip, true)
        }

        this.dispatchEvent("mouseenter", evt)
    }
    onmouseleave(evt) {
        if (this.tooltip) {
            window.game.getCursor().clearTooltip()
        }
        this.dispatchEvent("mouseleave", evt)
    }
    drag(evt) {


        let newMousePos = new Vector(evt.clientX, evt.clientY)
        let newPos = this.position.add_vec(newMousePos.sub_vec(this.mousePos).div_vec(this.getPixelSize()))
        this.setPosition(newPos.x, newPos.y)
        this.mousePos = newMousePos
    }

    onmousedown(evt) {

        if (this.isDraggable) {


            evt.preventDefault()
            evt.stopPropagation()
            this.drag_func_listener = this.drag.bind(this)
            this.mousePos = new Vector(evt.clientX, evt.clientY)
            this.container.addEventListener("mousemove", this.drag_func_listener)
        }
        this.dispatchEvent("mousedown", evt)
    }
    onmouseup(evt) {

        if (this.isDraggable) {
            this.container.removeEventListener("mousemove", this.drag_func_listener)
            delete this.mousePos
        }
        this.dispatchEvent("mouseup", evt)
    }
    toggle() {
        if (this.isOpen) [
            this.close()
        ]
        else
            this.open()
    }

    addEventListener(eventType, func) {
        if (this.subscribers[eventType] == undefined)
            this.subscribers[eventType] = {}
        let id = getUniqueIdentificator()
        this.subscribers[eventType][id] = func;
        return id;
    }
    removeEventListener(id, type) {
        delete this.subscribers[type][id]
        return this
    }
    dispatchEvent(eventType, data) {

        if (this.subscribers[eventType])

            for (const subscriber in this.subscribers[eventType]) {

                this.subscribers[eventType][subscriber](data)
            }
        return this
    }
}




