import Gui from "./gui/Gui.js"
import { Label } from "./gui/Label.js"
import Styles from "./gui/Styles.js"

export default class SimpleDataFrame {
    constructor(rowNames) {
        this.df = []
        this.df.push(rowNames)
        this.fontSize = 0.6
        this.isVertical = false
        this.options = {
            showRowNames: true
        }
    }
    isEmpty() {
        return this.df[0] == undefined
    }
    addArray(array) {

        for (const value of array) {
            if (!this.addDictionary(value)) {

                this.df.push(array)
                break;
            }
        }
    }
    addDictionary(dict) {
        if (!Array.isArray(dict) && dict instanceof Object) {

            let arr = []
            for (const row of this.df[0]) {
                arr.push(dict.get(row, undefined))
            }
            this.df.push(arr)
            return true
        }
        else
            return false
    }
    createTable() {
        this.table = new Gui()
        this.table.setDecoration(Styles.Table.main)
        /**
         * @type {Gui[][]}
         */
        this.tableComponents = [[]]

    }
    getWidth() {
        return this.isEmpty() ? 0 : this.df[0].length
    }
    getHeight() {
        return this.df.length
    }

    sortByRow(row) {
        let rowIndex = this.df[0].indexOf(row)

        if (rowIndex == -1)
            return

        this.df = [this.df[0]].concat(this.df.slice(1).sort((a, b) => a[rowIndex] > b[rowIndex] ? 1 : -1))



    }
    getColumn(name) {
        let index = this.df[0].indexOf(name)
        if (index == -1)
            return []
        let result = []
        for (let i = 1; i < this.getHeight(); i++) {
            result.push(this.df[i][index])
        }
        return result
    }

    refreshTable() {
        if (this.table == undefined)
            this.createTable()

        this.maxsize = this.table.size
        let rowWidths = this.getCellBuildingInfo()
        let tableLength = (rowWidths.sum + rowWidths.length) * this.fontSize * 0.5
        this.table.setSize(Math.min(this.maxsize.x, tableLength), this.maxsize.y)


        if (!this.options.showRowNames)
            rowWidths = [0].concat(rowWidths)

        let accumulatedWidth = 0
        for (let i = +!this.options.showRowNames; i < this.getHeight(); i++) {
            if (this.tableComponents[i] == undefined)
                this.tableComponents[i] = new Array()
            if (this.isVertical) accumulatedWidth = 0
            for (let j = 0; j < this.getWidth(); j++) {

                if (this.tableComponents[i][j] == undefined) {
                    this.tableComponents[i][j] = new Label().addParent(this.table)

                }

                this.tableComponents[i][j]
                    .setFontSize(this.fontSize)
                    .setText(this.df[i][j].toString())
                    .setDecoration(Styles.TableCell.main)
                    .setColor("white")
                if (this.isVertical) {
                    this.tableComponents[i][j]
                        .setPosition(accumulatedWidth, (i + +!this.options.showRowNames) * this.fontSize * 1.25)
                        .setSize((rowWidths[j] + 1) * this.fontSize * 0.5, this.fontSize * 1.25)
                        .centerText()
                } else {
                    this.tableComponents[i][j]
                        .setPosition(accumulatedWidth, j * this.fontSize * 1.25)
                        .setSize((rowWidths[i] + 1) * this.fontSize * 0.5, this.fontSize * 1.25)
                        .centerText()
                }

                if (this.isVertical) accumulatedWidth += (rowWidths[j] + 1) * this.fontSize * 0.5
            }
            if (!this.isVertical) accumulatedWidth += (rowWidths[i] + 1) * this.fontSize * 0.5
        }

        return this
    }
    setFontSize(size) {
        this.fontSize = size
        if (this.table)
            this.refreshTable()
    }
    addColumn(name, data) {

        for (let i = 0; i <= data.length; i++) {
            if (this.df[i] == undefined)
                this.df[i] = []
            this.df[i].push(i == 0 ? name : data[i - 1])
        }
    }


    getCellBuildingInfo() {
        let rowWidths = []
        if (this.isVertical) {
            for (let i = 0; i < this.getWidth(); i++) {
                let rowMax = 0
                for (let j = +!this.options.showRowNames; j < this.getHeight(); j++) {
                    if (rowMax < (this.df[j][i] + "").length) {

                        rowMax = (this.df[j][i] + "").length
                    }
                }
                rowWidths.push(rowMax)
            }
        }
        else {
            for (let i = +!this.options.showRowNames; i < this.getHeight(); i++) {
                let rowMax = 0
                for (let j = 0; j < this.getWidth(); j++) {
                    if (rowMax < (this.df[i][j] + "").length) {

                        rowMax = (this.df[i][j] + "").length
                    }
                }
                rowWidths.push(rowMax)
            }
        }
        return rowWidths
    }


    getTable() {
        if (this.table == undefined)
            this.createTable()
        return this.table
    }
}