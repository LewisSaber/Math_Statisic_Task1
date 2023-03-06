import mainGui, { functionMerger, getImg, mergeObject, NumberRange } from "./gui/Utility.js"
import Gui from "./gui/Gui.js"
import { Button } from "./gui/Button.js"
import Styles from "./gui/Styles.js"
import SimpleDataFrame from "./SimpleDataFrame.js"
import discreteDataSample from "../data.js"
import { Label } from "./gui/Label.js"

export default class App {
    constructor() {
        if (App.instance)
            return App.instance
        App.instance = this

        this.mainGui = mainGui()
        this.mainGui.open()

        let menuButton = new Button().setPosition(0.1, 0.1).setSize(1, 1).setIcon(getImg("3lines"), 0.2, 0.2).addParent(this.mainGui).setZLayer(2).setDecoration(Styles.Button.menu)

        let menuHeight = 1.2
        this.topMenu = new Gui().setSize(-1, menuHeight).setDecoration(Styles.BackGround.menu).addParent(this.mainGui, "top").setZLayer(1)
        menuButton.addEventListener("mousedown", () => {
            this.topMenu.toggle()
        })

        this.taskGUIs = [
            new Gui().setSize(-1, 39).setDecoration(Styles.BackGround.task1),
            new Gui().setSize(-1, 40).setDecoration(Styles.BackGround.task1)
        ]


        let taskButtons = [
            {
                name: "Дискретна",
                gui: this.taskGUIs[0],
            },
            {
                name: "Інтервальна",
                gui: this.taskGUIs[1],
            },
            // {
            //     name: "#Task2",
            //     gui: this.Task2(),
            // }
        ]
        let x_offset = 2
        let iter = 0
        for (let pair of taskButtons) {
            this.mainGui.addComponent(pair.gui, "main")
            let button = new Button().setText(pair.name, 0.7, "lightgray", undefined, 0.13).setSize(5, menuHeight * 0.9).setPosition(x_offset, menuHeight * 0.05)
            button.addParent(this.topMenu, "main")
            this.addLeftMenuButtonBehaviour(button, pair.gui)
            button.show()
            x_offset += 6;
            if (iter == 0)
                button.dispatchEvent("mousedown")
            iter++
        }
        // let aboutButton = new Button().setText("About", 0.7, "lightgray", undefined, 0.15).setSize(4, menuHeight * 0.9).setPosition(0, menuHeight * .05).positionFromRight().addParent(this.topMenu, "main").show()
        // let aboutGui = this.createAboutGUI().addParent(this.mainGui, "main")
        //this.addLeftMenuButtonBehaviour(aboutButton, aboutGui)


        this.Task1()
        this.Task2()
    }
    Task1() {
        let statistical_data = {}
        let df = this.normalizeDiscreteSample("23, 45, 67, 89, 12, 34, 56, 78, 7, 55, 66, 21, 43, 65, 87, 66, 76, 54, 32, 10, 9, 8, 7, 6, 52, 7, 7, 34, 66, 11, 22, 33, 44, 55, 66, 77, 88, 7, 55, 91, 92, 93, 94, 76, 76, 66, 88, 8, 70, 61, 52, 43, 34, 25, 16, 27, 42, 49, 50, 55, 42, 33, 24, 15, 6, 17, 28, 39, 60, 71, 82, 93, 8, 75, 66, 56, 48, 39, 30, 21, 12, 23, 34, 45, 56, 67, 78, 89, 7, 81, 72, 63, 54, 45, 27, 27, 18, 9, 9, 75")
        df.sortByRow("Число")
        let containers = this.CreateVerticalContainers(
            [4, 7, 9, 6, 4, 3],
            1.3,
            this.taskGUIs[0]
        )

        //window.df = df
        containers[0].addComponent(df.getTable().setSize(23, 2).positionCenter())
        let lable_vibirka = new Label()
            .setText("Варіаційний Ряд")
            .setColor("white")
            .setSize(-1, 1)
            .centerText()
            .setPosition(0, 0.2)
            .setFontSize(0.5)
            .addParent(containers[0])
        df.refreshTable()
        //Полігон Частот
        {
            let poligon_chastot = new Gui().setSize(10, 5.4).setPosition(1, 1).setDecoration(Styles.BackGround.graphContainer1).addParent(containers[1])
            let lable_poligon_chastot = new Label()
                .setText("Полігон Частот")
                .setColor("white")
                .setSize(poligon_chastot.getSize().x, 1)
                .centerText()
                .setPosition(1, 0.2)
                .setFontSize(0.5)
                .addParent(containers[1])
            Plotly.newPlot(poligon_chastot.getContainer(), [{
                x: df.getColumn("Число"),
                y: df.getColumn("Частота"),


            }], {
                paper_bgcolor: 'rgba(0,0,0,0)',
                bgcolor: 'rgba(0,0,0,0)',
                xaxis: {
                    tickfont: {
                        color: 'white'
                    },
                    linecolor: 'white',
                    tickcolor: 'white'
                },
                yaxis: {
                    tickfont: {
                        color: 'white'
                    },
                    linecolor: 'white',
                    tickcolor: 'white'
                },
                bargap: 0.2
            });
            poligon_chastot.addEventListener("guiresize", () => {
                let size_ = poligon_chastot.getSizeinPixels()
                let m_mult = .09
                Plotly.update(poligon_chastot.getContainer(), {}, {
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    width: size_.x,
                    height: size_.y,
                    margin: { l: size_.x * m_mult, r: size_.x * m_mult, t: size_.y * m_mult, b: size_.y * m_mult * 1.2 },
                    xaxis: {
                        tickfont: {
                            color: 'white',
                            size: size_.x * .03
                        },
                        linecolor: 'white',
                        tickcolor: 'white'
                    },
                    yaxis: {
                        tickfont: {
                            color: 'white',
                            size: size_.x * .03
                        },
                        linecolor: 'white',
                        tickcolor: 'white'
                    },
                })
            })
            poligon_chastot.resize()

        }
        //Гістограма частот
        {
            let gistograma_chastot = new Gui().setSize(9, 5.4).setPosition(12, 1).setDecoration(Styles.BackGround.graphContainer1).addParent(containers[1])
            let lable_gistograma_chastot = new Label()
                .setText("Гістограма Частот")
                .setColor("white")
                .setSize(gistograma_chastot.getSize().x, 1)
                .centerText()
                .setPosition(12, 0.2)
                .setFontSize(0.5)
                .addParent(containers[1])
            Plotly.newPlot(gistograma_chastot.getContainer(), [{
                x: df.getColumn("Число"),
                y: df.getColumn("Частота"),
                type: 'bar'

            }], {
                connectgaps: true,
                paper_bgcolor: 'rgba(0,0,0,0)',
                bgcolor: 'rgba(0,0,0,0)',
                xaxis: {
                    tickfont: {
                        color: 'white'
                    },
                    linecolor: 'white',
                    tickcolor: 'white'
                },
                yaxis: {
                    tickfont: {
                        color: 'white'
                    },
                    linecolor: 'white',
                    tickcolor: 'white'
                },
                bargap: 0
            });
            gistograma_chastot.addEventListener("guiresize", () => {
                let size_ = gistograma_chastot.getSizeinPixels()
                let m_mult = .09
                Plotly.update(gistograma_chastot.getContainer(), {}, {
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    width: size_.x,
                    height: size_.y,
                    margin: { l: size_.x * m_mult, r: size_.x * m_mult, t: size_.y * m_mult, b: size_.y * m_mult * 1.2 },
                    xaxis: {
                        tickfont: {
                            color: 'white',
                            size: size_.x * .03
                        },
                        linecolor: 'white',
                        tickcolor: 'white'
                    },
                    yaxis: {
                        tickfont: {
                            color: 'white',
                            size: size_.x * .03
                        },
                        linecolor: 'white',
                        tickcolor: 'white'
                    },
                })
            })
            gistograma_chastot.resize()
        }
        //Функція Розподілу
        {
            let df_rozpodil = new SimpleDataFrame(["Діапазон", "Розподіл"])
            df_rozpodil.setFontSize(0.4)
            let numbers = df.getColumn("Число")
            let freq = df.getColumn("Частота")
            df_rozpodil.addDictionary({
                "Діапазон": `x<${numbers[0]}`,
                "Розподіл": 0
            })
            let acc_sum = 0
            let sum = freq.sum
            for (let i = 0; i < numbers.length; i++) {
                let diapazon = i + 1 == numbers.length ?
                    `≥ ${numbers[i]}` :
                    `${numbers[i]} < x ≤ ${numbers[i + 1]}`
                acc_sum += freq[i] / sum
                df_rozpodil.addDictionary({
                    "Діапазон": diapazon,
                    "Розподіл": +acc_sum.toFixed(3)
                })
            }
            df_rozpodil.isVertical = false
            containers[2].addComponent(df_rozpodil.getTable().setSize(23, 1.3).setPosition(0, 1.2).positionCenter(true, false))
            df_rozpodil.refreshTable()
            let gistograma_rozpodil = new Gui().setSize(10, 5.4).setPosition(0, 3).positionCenter(true, false).setDecoration(Styles.BackGround.graphContainer1).addParent(containers[2])
            let lable_gistograma_rozpodil = new Label()
                .setText("Розподіл Частот")
                .setColor("white")
                .setPosition(0, 0.2)
                .setSize(-1, 1)
                .centerText()
                .setFontSize(0.6)
                .addParent(containers[2])


            Plotly.newPlot(gistograma_rozpodil.getContainer(), [{
                x: [numbers[0] - 1].concat(numbers),
                y: df_rozpodil.getColumn("Розподіл"),
                type: 'bar',


            }], {
                tickmode: "array",
                paper_bgcolor: 'rgba(0,0,0,0)',
                connectgaps: true,
                bargap: 0
            });
            gistograma_rozpodil.addEventListener("guiresize", () => {
                let size_ = gistograma_rozpodil.getSizeinPixels()
                let m_mult = .09
                Plotly.update(gistograma_rozpodil.getContainer(), {}, {
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    width: size_.x,
                    height: size_.y,
                    margin: { l: size_.x * m_mult, r: size_.x * m_mult, t: size_.y * m_mult, b: size_.y * m_mult * 1.2 },
                    xaxis: {
                        tickfont: {
                            color: 'white',
                            size: size_.x * .03
                        },
                        linecolor: 'white',
                        tickcolor: 'white'
                    },
                    yaxis: {
                        tickfont: {
                            color: 'white',
                            size: size_.x * .03
                        },
                        linecolor: 'white',
                        tickcolor: 'white'
                    },

                })
            })
            gistograma_rozpodil.resize()

        }
        let locationLable = new Label()
            .setColor("white")
            .setText(`С-ки локації`)
            .setPosition(0.2, 0.2)
            .setSize(5, 0)
            .centerText()
            .setFontSize(0.6)
            .addParent(containers[3])
        //Медіана
        {
            let numbers = df.getColumn("Число")
            let freq = df.getColumn("Частота")
            let totalNumbers = freq.sum
            let mediana_at = totalNumbers / 2 >> 0
            let isOdd = totalNumbers % 2
            let mediana = 0
            let sum = 0

            for (let i = 0; i < freq.length; i++) {

                sum += freq[i]
                if (isOdd) {

                    if (sum >= mediana_at + 1) {
                        mediana = numbers[i]
                        break
                    }
                }
                else {
                    if (sum == mediana_at) {

                        mediana = (numbers[i] + numbers[i + 1]) / 2
                        break
                    }
                    else if (sum > mediana) {
                        mediana = numbers[i]
                        break
                    }
                }

            }
            let medianaLable = new Label()
                .setColor("white")
                .setText(`Медіана: ${mediana}`)
                .setPosition(0.2, 1.2)
                .setSize(5, 0)
                .centerText()
                .setFontSize(0.6)
                .addParent(containers[3])
            statistical_data.mediana = mediana
        }
        //Мода
        {
            let max = [0, 0]
            let numbers = df.getColumn("Число")
            let freq = df.getColumn("Частота")
            for (let i = 0; i < numbers.length; i++) {
                if (freq[i] > max[1])
                    max = [numbers[i], freq[i]]
            }
            let modaLable = new Label()
                .setColor("white")
                .setText(`Мода: ${max[0]}`)
                .setPosition(0.2, 2.2)
                .setSize(5, 0)
                .centerText()
                .setFontSize(0.6)
                .addParent(containers[3])
            statistical_data.moda = max[0]
        }
        //Cереднє арифметичне
        {
            let freq = df.getColumn("Частота")
            let numbers = df.getColumn("Число")
            let average = 0
            for (let i = 0; i < numbers.length; i++) {
                average += numbers[i] * freq[i]

            }
            average /= freq.sum
            let averageLable = new Label()
                .setColor("white")
                .setText(`Середнє ${average.toFixed(3)}`)
                .setPosition(0.2, 3.2)
                .setSize(5, 0)
                .centerText()
                .setFontSize(0.6)
                .addParent(containers[3])
            statistical_data.average = +average.toFixed(3)
        }
        //Девіація
        {
            let deviation = 0
            let freq = df.getColumn("Частота")
            let numbers = df.getColumn("Число")
            for (let i = 0; i < numbers.length; i++) {
                deviation += freq[i] * (numbers[i] - statistical_data.average) ** 2

            }
            let deviationLable = new Label()
                .setColor("white")
                .setText(`Девіація ${deviation.toFixed(3)}`)
                .setPosition(0.2, 4.2)
                .setSize(5, 0)
                .centerText()
                .setFontSize(0.6)
                .addParent(containers[3])
            statistical_data.deviation = deviation
        }
        let rozsiyanyaLable = new Label()
            .setColor("white")
            .setText(`С-ки розсіювання`)
            .setPosition(5.2, 0.2)
            .setSize(6, 0)
            .centerText()
            .setFontSize(0.6)
            .addParent(containers[3])
        //Розмах
        {
            let numbers = df.getColumn("Число")
            let rozmah = numbers.max - numbers.min
            statistical_data.rozmah = rozmah
            let rozmahLable = new Label()
                .setColor("white")
                .setText(`Розмах ${rozmah}`)
                .setPosition(5.2, 1.2)
                .setSize(6, 0)
                .centerText()
                .setFontSize(0.6)
                .addParent(containers[3])

        }
        //Варіанса
        {
            let freq = df.getColumn("Частота")
            let variance = statistical_data.deviation / (freq.sum - 1)


            let varianceLable = new Label()
                .setColor("white")
                .setText(`Варіанса ${variance.toFixed(3)}`)
                .setPosition(5.2, 2.2)
                .setSize(6, 0)
                .centerText()
                .setFontSize(0.6)
                .addParent(containers[3])
            statistical_data.variance = variance
        }
        //стандарт
        {
            let standart = statistical_data.variance ** 0.5
            let standartLable = new Label()
                .setColor("white")
                .setText(`Стандарт ${standart.toFixed(3)}`)
                .setPosition(5.2, 3.2)
                .setSize(6, 0)
                .centerText()
                .setFontSize(0.6)
                .addParent(containers[3])
            statistical_data.standart = standart
        }
        // //Вибіркова дисперсія
        {
            //     let vibirk_dispersia = statistical_data.deviation
            //     let vibirk_dispersiaLable = new Label()
            //         .setColor("white")
            //         .setText(`Вибіркова Дисперсія ${vibirk_dispersia.toFixed(3)}`)
            //         .setPosition(5.2, 4.2)
            //         .setSize(6, 0)
            //         .centerText()
            //         .setFontSize(0.6)
            //         .addParent(containers[3])
            //     statistical_data.vibirk_dispersia = vibirk_dispersia
        }
        //Варіація
        {
            let variantion = statistical_data.standart / statistical_data.average
            let variantionLable = new Label()
                .setColor("white")
                .setText(`Варіація ${variantion.toFixed(3)}`)
                .setPosition(5.2, 4.2)
                .setSize(6, 0)
                .centerText()
                .setFontSize(0.6)
                .addParent(containers[3])
            statistical_data.variantion = variantion
        }
        //Моменти
        {
            statistical_data.moments = {
                central: [1, 0],
                starting: [1, statistical_data.average]
            }
            const COUNT_MOMENTS = 11
            for (let k = 2; k < COUNT_MOMENTS; k++) {
                let freq = df.getColumn("Частота")
                //starting

                let numbers = df.getColumn("Число")
                let starting_momentum = numbers.map((x) => x ** k).sum / freq.sum
                statistical_data.moments.starting[k] = starting_momentum
                //central
                let central_momentum = 0
                numbers = df.getColumn("Число")

                for (let i = 0; i < numbers.length; i++) {
                    central_momentum += freq[i] * (numbers[i] - statistical_data.average) ** k
                }
                central_momentum /= freq.sum
                statistical_data.moments.central[k] = central_momentum
            }
            let df_momentum = new SimpleDataFrame(["Момент", "Початковий(m)", "Центральний(m)"])
            for (let i = 0; i < COUNT_MOMENTS; i++) {
                df_momentum.addDictionary({
                    "Момент": i,
                    "Початковий(m)": +statistical_data.moments.starting[i].toFixed(2),
                    "Центральний(m)": +statistical_data.moments.central[i].toFixed(2)
                })
            }
            df_momentum.isVertical = false
            df_momentum.refreshTable()
            containers[4].addComponent(
                df_momentum.getTable()
                    .setSize(21, 2.6)
                    .setPosition(0, 1.2)
                    .positionCenter(true, false)

            )
            let moments_lable = new Label()
                .setColor("white")
                .setText(`Моменти`)
                .setSize(-1, 1)
                .centerText()
                .setFontSize(0.6)
                .addParent(containers[4])
        }
        //Квантилі
        {
            let quantils = this.Find_Quantils(df.getColumn("Частота"), df.getColumn("Число"), 4, "Q")
            let decils = this.Find_Quantils(df.getColumn("Частота"), df.getColumn("Число"), 10, "D")
            statistical_data.quantils = quantils
            statistical_data.decils = decils

            let quantilContainer = new Gui().setSize(4, 2.5).setPosition(3, 0.2).addParent(containers[5])
            new Label()
                .setText("Квантилі")
                .setColor("white")
                .setFontSize(0.6)
                .setSize(-1, 1)
                .centerText()
                .addParent(quantilContainer)
            quantils.options.showRowNames = false
            quantils.getTable()
                .setSize(-1, 2.6)
                .positionCenter(true, false)
                .setPosition(0, .8)
                .addParent(quantilContainer)
            quantils.refreshTable()


            let decilsContainer = new Gui().setSize(10, 2.5).setPosition(10, 0.2).addParent(containers[5])
            new Label()
                .setText("Децилі")
                .setColor("white")
                .setFontSize(0.6)
                .setSize(-1, 1)
                .centerText()
                .addParent(decilsContainer)
            decils.options.showRowNames = false
            decils.getTable()
                .setSize(-1, 2.6)
                .positionCenter(true, false)
                .setPosition(0, .8)
                .addParent(decilsContainer)
            decils.refreshTable()

        }
        let formLable = new Label()
            .setColor("white")
            .setText(`С-ки форми`)
            .setPosition(10.2, 0.2)
            .setSize(6, 0)
            .centerText()
            .setFontSize(0.6)
            .addParent(containers[3])
        //Асиметрія
        {

            let asymetry = +(statistical_data.moments.central[3] / (statistical_data.moments.central[2] ** 1.5)).toFixed(3)
            statistical_data.asymetry = asymetry
            let asymetryLable = new Label()
                .setColor("white")
                .setText(`Асиметрія ${asymetry}`)
                .setPosition(10.2, 1.2)
                .setSize(6, 0)
                .centerText()
                .setFontSize(0.6)
                .addParent(containers[3])

        }
        //Ексцес
        {

            let exces = +(statistical_data.moments.central[4] / (statistical_data.moments.central[2] ** 2) - 3).toFixed(3)

            let excesLable = new Label()
                .setColor("white")
                .setText(`Ексцес ${exces.toFixed(3)}`)
                .setPosition(10.2, 2.2)
                .setSize(6, 0)
                .centerText()
                .setFontSize(0.6)
                .addParent(containers[3])
            statistical_data.exces = exces
        }

    }

    Task2() {
        let statistical_data = {}
        let df = this.getIntervalDataSample()

        let containers = this.CreateVerticalContainers(
            [5, 7, 9, 6, 4, 3],
            1.3,
            this.taskGUIs[1]
        )
        window.df = df
        containers[0].addComponent(df.getTable().setSize(23, 3).setPosition(0, 1.2).positionCenter(true, false))
        let lable_vibirka = new Label()
            .setText("Варіаційний Ряд")
            .setColor("white")
            .setSize(-1, 1)
            .centerText()
            .setPosition(0, 0.2)
            .setFontSize(0.5)
            .addParent(containers[0])

        //Wi
        {
            let freq = df.getColumn("n")
            let total = freq.sum
            let Wi = freq.map((x) => x / total)
            df.addColumn("w", Wi)
        }
        //Zi
        {
            df.addColumn("z", df.getColumn("x").map((x) => x.middle()))
        }
        df.refreshTable()
        //Гістограма і полоігон частот
        {
            let gistograma_chastot = new Gui().setSize(9, 5.4).setPosition(12, 1).setDecoration(Styles.BackGround.graphContainer1).addParent(containers[1])
            let intervals = df.getColumn("x")
            let freq = df.getColumn("n")
            let x = []
            for (let interval of intervals) {
                x = x.concat(interval.allValues())
            }

            let y = []

            for (let i = 0; i < intervals.length; i++) {

                for (let j = 0; j < intervals[i].length(); j++) {
                    y.push(freq[i])
                }
            }

            let poligon_chastot = new Gui().setSize(10, 5.4).setPosition(1, 1).setDecoration(Styles.BackGround.graphContainer1).addParent(containers[1])
            let lable_poligon_chastot = new Label()
                .setText("Полігон Частот")
                .setColor("white")
                .setSize(poligon_chastot.getSize().x, 1)
                .centerText()
                .setPosition(1, 0.2)
                .setFontSize(0.5)
                .addParent(containers[1])
            Plotly.newPlot(poligon_chastot.getContainer(), [{
                x: x,
                y: y,


            }], {
                paper_bgcolor: 'rgba(0,0,0,0)',
                bgcolor: 'rgba(0,0,0,0)',
                bargap: 0.2
            });
            poligon_chastot.addEventListener("guiresize", () => {
                let size_ = poligon_chastot.getSizeinPixels()
                let m_mult = .09
                Plotly.update(poligon_chastot.getContainer(), {}, {
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    width: size_.x,
                    height: size_.y,
                    margin: { l: size_.x * m_mult, r: size_.x * m_mult, t: size_.y * m_mult, b: size_.y * m_mult * 1.2 },
                    xaxis: {
                        tickfont: {
                            color: 'white',
                            size: size_.x * .03
                        },
                        linecolor: 'white',
                        tickcolor: 'white'
                    },
                    yaxis: {
                        tickfont: {
                            color: 'white',
                            size: size_.x * .03
                        },
                        linecolor: 'white',
                        tickcolor: 'white'
                    },
                })
            })
            poligon_chastot.resize()

            let lable_gistograma_chastot = new Label()
                .setText("Гістограма Частот")
                .setColor("white")
                .setSize(gistograma_chastot.getSize().x, 1)
                .centerText()
                .setPosition(12, 0.2)
                .setFontSize(0.5)
                .addParent(containers[1])
            Plotly.newPlot(gistograma_chastot.getContainer(), [{
                x: x,
                y: y,
                type: 'bar'

            }], {
                //connectgaps: true,
                paper_bgcolor: 'rgba(0,0,0,0)',
                bgcolor: 'rgba(0,0,0,0)',
                xaxis: {
                    tickfont: {
                        color: 'white'
                    },
                    linecolor: 'white',
                    tickcolor: 'white'
                },
                yaxis: {
                    tickfont: {
                        color: 'white'
                    },
                    linecolor: 'white',
                    tickcolor: 'white'
                },
                bargap: 0
            });
            gistograma_chastot.addEventListener("guiresize", () => {
                let size_ = gistograma_chastot.getSizeinPixels()
                let m_mult = .09
                Plotly.update(gistograma_chastot.getContainer(), {}, {
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    width: size_.x,
                    height: size_.y,
                    margin: { l: size_.x * m_mult, r: size_.x * m_mult, t: size_.y * m_mult, b: size_.y * m_mult * 1.2 },
                    xaxis: {
                        tickfont: {
                            color: 'white',
                            size: size_.x * .03
                        },
                        linecolor: 'white',
                        tickcolor: 'white'
                    },
                    yaxis: {
                        tickfont: {
                            color: 'white',
                            size: size_.x * .03
                        },
                        linecolor: 'white',
                        tickcolor: 'white'
                    },
                })
            })
            gistograma_chastot.resize()
        }
        //Функція Розподілу
        {
            let df_rozpodil = new SimpleDataFrame(["Діапазон", "Розподіл"])
            df_rozpodil.setFontSize(0.4)
            let numbers = df.getColumn("x")
            let freq = df.getColumn("n")
            df_rozpodil.addDictionary({
                "Діапазон": `x<${numbers[0].start}`,
                "Розподіл": 0
            })
            let acc_sum = 0
            let sum = freq.sum
            for (let i = 0; i < numbers.length; i++) {
                let diapazon = `${numbers[i].start} ≤ x < ${numbers[i].end}`
                acc_sum += freq[i] / sum
                df_rozpodil.addDictionary({
                    "Діапазон": diapazon,
                    "Розподіл": +acc_sum.toFixed(3)
                })
            }
            df_rozpodil.isVertical = false
            containers[2].addComponent(df_rozpodil.getTable().setSize(23, 1.3).setPosition(0, 1.2).positionCenter(true, false))
            df_rozpodil.refreshTable()
            let gistograma_rozpodil = new Gui().setSize(10, 5.4).setPosition(0, 3).positionCenter(true, false).setDecoration(Styles.BackGround.graphContainer1).addParent(containers[2])
            let lable_gistograma_rozpodil = new Label()
                .setText("Розподіл Частот")
                .setColor("white")
                .setPosition(0, 0.2)
                .setSize(-1, 1)
                .centerText()
                .setFontSize(0.6)
                .addParent(containers[2])

            let intervals = df.getColumn("x")
            let cumul = df_rozpodil.getColumn("Розподіл")
            let x = []
            for (let interval of intervals) {
                x = x.concat(interval.allValues())
            }

            let y = []

            for (let i = 0; i < intervals.length; i++) {

                for (let j = 0; j < intervals[i].length(); j++) {
                    y.push(cumul[i + 1])
                }
            }

            Plotly.newPlot(gistograma_rozpodil.getContainer(), [{
                x: x,
                y: y,
                type: 'bar',


            }], {

                paper_bgcolor: 'rgba(0,0,0,0)',
                //connectgaps: true,
                bargap: 0
            });
            gistograma_rozpodil.addEventListener("guiresize", () => {
                let size_ = gistograma_rozpodil.getSizeinPixels()
                let m_mult = .09
                Plotly.update(gistograma_rozpodil.getContainer(), {}, {
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    width: size_.x,
                    height: size_.y,
                    margin: { l: size_.x * m_mult, r: size_.x * m_mult, t: size_.y * m_mult, b: size_.y * m_mult * 1.2 },
                    xaxis: {
                        tickfont: {
                            color: 'white',
                            size: size_.x * .03
                        },
                        linecolor: 'white',
                        tickcolor: 'white',

                    },
                    yaxis: {
                        tickfont: {
                            color: 'white',
                            size: size_.x * .03
                        },
                        linecolor: 'white',
                        tickcolor: 'white'
                    },

                })
            })
            gistograma_rozpodil.resize()

        }
        let locationLable = new Label()
            .setColor("white")
            .setText(`С-ки локації`)
            .setPosition(0.2, 0.2)
            .setSize(5, 0)
            .centerText()
            .setFontSize(0.6)
            .addParent(containers[3])
        //Медіана
        {
            let numbers = df.getColumn("x")
            let freq = df.getColumn("n")
            let totalNumbers = freq.sum
            let mediana_at = totalNumbers / 2

            let mediana = 0
            let sum = 0

            for (let i = 0; i < freq.length; i++) {
                sum += freq[i]
                if (sum >= mediana_at) {
                    let percent = (mediana_at - (sum - freq[i])) / freq[i]
                    let h = numbers[i].length()

                    mediana = numbers[i].start + percent * h
                    break
                }

            }


            let medianaLable = new Label()
                .setColor("white")
                .setText(`Медіана: ${mediana}`)
                .setPosition(0.2, 1.2)
                .setSize(5, 0)
                .centerText()
                .setFontSize(0.6)
                .addParent(containers[3])
            statistical_data.mediana = mediana
        }
        //Мода
        {
            let max = [0, 0]
            let numbers = df.getColumn("x")
            let freq = df.getColumn("n")
            for (let i = 0; i < numbers.length; i++) {
                if (freq[i] > max[1])
                    max = [i, freq[i]]
            }
            let h = numbers[max[0]].length()
            let premodal = max[0] == 0 ? 0 : freq[max[0] - 1]
            let aftermodal = freq.get(max[0] + 1, 0)

            let moda = numbers[max[0]].start + ((freq[max[0]] - premodal) / (2 * freq[max[0]] - premodal - aftermodal)) * h

            let modaLable = new Label()
                .setColor("white")
                .setText(`Мода: ${moda.toFixed(2)}`)
                .setPosition(0.2, 2.2)
                .setSize(5, 0)
                .centerText()
                .setFontSize(0.6)
                .addParent(containers[3])
            statistical_data.moda = moda
        }
        //Cереднє арифметичне
        {
            let freq = df.getColumn("n")
            let numbers = df.getColumn("x")
            let middle = df.getColumn("z")
            let average = 0
            for (let i = 0; i < numbers.length; i++) {
                average += middle[i] * freq[i]

            }
            average /= freq.sum
            let averageLable = new Label()
                .setColor("white")
                .setText(`Середнє ${average.toFixed(3)}`)
                .setPosition(0.2, 3.2)
                .setSize(5, 0)
                .centerText()
                .setFontSize(0.6)
                .addParent(containers[3])
            statistical_data.average = +average.toFixed(3)
        }
        //Девіація
        {
            let deviation = 0
            let freq = df.getColumn("n")
            let middle = df.getColumn("z")

            for (let i = 0; i < freq.length; i++) {
                deviation += freq[i] * (middle[i] - statistical_data.average) ** 2

            }
            let deviationLable = new Label()
                .setColor("white")
                .setText(`Девіація ${deviation.toFixed(3)}`)
                .setPosition(0.2, 4.2)
                .setSize(5, 0)
                .centerText()
                .setFontSize(0.6)
                .addParent(containers[3])
            statistical_data.deviation = deviation
        }
        let rozsiyanyaLable = new Label()
            .setColor("white")
            .setText(`С-ки розсіювання`)
            .setPosition(5.2, 0.2)
            .setSize(6, 0)
            .centerText()
            .setFontSize(0.6)
            .addParent(containers[3])
        //Розмах
        {
            let numbers = df.getColumn("x")

            let rozmah = numbers.at(-1).end - numbers[0].start
            statistical_data.rozmah = rozmah
            let rozmahLable = new Label()
                .setColor("white")
                .setText(`Розмах ${rozmah}`)
                .setPosition(5.2, 1.2)
                .setSize(6, 0)
                .centerText()
                .setFontSize(0.6)
                .addParent(containers[3])

        }
        //Варіанса
        {
            let freq = df.getColumn("n")
            let variance = statistical_data.deviation / (freq.sum - 1)


            let varianceLable = new Label()
                .setColor("white")
                .setText(`Варіанса ${variance.toFixed(3)}`)
                .setPosition(5.2, 2.2)
                .setSize(6, 0)
                .centerText()
                .setFontSize(0.6)
                .addParent(containers[3])
            statistical_data.variance = variance
        }
        //стандарт
        {
            let standart = statistical_data.variance ** 0.5
            let standartLable = new Label()
                .setColor("white")
                .setText(`Стандарт ${standart.toFixed(3)}`)
                .setPosition(5.2, 3.2)
                .setSize(6, 0)
                .centerText()
                .setFontSize(0.6)
                .addParent(containers[3])
            statistical_data.standart = standart
        }
        // //Вибіркова дисперсія
        {
            //     let vibirk_dispersia = statistical_data.deviation
            //     let vibirk_dispersiaLable = new Label()
            //         .setColor("white")
            //         .setText(`Вибіркова Дисперсія ${vibirk_dispersia.toFixed(3)}`)
            //         .setPosition(5.2, 4.2)
            //         .setSize(6, 0)
            //         .centerText()
            //         .setFontSize(0.6)
            //         .addParent(containers[3])
            //     statistical_data.vibirk_dispersia = vibirk_dispersia
        }
        //Варіація
        {
            let variantion = statistical_data.standart / statistical_data.average
            let variantionLable = new Label()
                .setColor("white")
                .setText(`Варіація ${variantion.toFixed(3)}`)
                .setPosition(5.2, 4.2)
                .setSize(6, 0)
                .centerText()
                .setFontSize(0.6)
                .addParent(containers[3])
            statistical_data.variantion = variantion
        }
        //Моменти
        {
            statistical_data.moments = {
                central: [1, 0],
                starting: [1, statistical_data.average]
            }
            const COUNT_MOMENTS = 6
            for (let k = 2; k < COUNT_MOMENTS; k++) {
                let freq = df.getColumn("n")
                //starting

                let numbers = df.getColumn("z")
                let starting_momentum = numbers.map((x) => x ** k).sum / freq.sum
                statistical_data.moments.starting[k] = starting_momentum
                //central
                let central_momentum = 0
                numbers = df.getColumn("z")

                for (let i = 0; i < numbers.length; i++) {
                    central_momentum += freq[i] * (numbers[i] - statistical_data.average) ** k
                }
                central_momentum /= freq.sum
                statistical_data.moments.central[k] = central_momentum
            }
            let df_momentum = new SimpleDataFrame(["Момент", "Початковий(m)", "Центральний(m)"])
            for (let i = 0; i < COUNT_MOMENTS; i++) {
                df_momentum.addDictionary({
                    "Момент": i,
                    "Початковий(m)": +statistical_data.moments.starting[i].toFixed(2),
                    "Центральний(m)": +statistical_data.moments.central[i].toFixed(2)
                })
            }
            df_momentum.isVertical = false
            df_momentum.refreshTable()
            containers[4].addComponent(
                df_momentum.getTable()
                    .setSize(21, 2.6)
                    .setPosition(0, 1.2)
                    .positionCenter(true, false)

            )
            let moments_lable = new Label()
                .setColor("white")
                .setText(`Моменти`)
                .setSize(-1, 1)
                .centerText()
                .setFontSize(0.6)
                .addParent(containers[4])
        }
        //Квантилі
        {
            let quantils = this.Find_Quantils_Range(df.getColumn("n"), df.getColumn("x"), 4, "Q")
            let decils = this.Find_Quantils_Range(df.getColumn("n"), df.getColumn("x"), 10, "D")
            statistical_data.quantils = quantils
            statistical_data.decils = decils

            let quantilContainer = new Gui().setSize(8, 2.5).setPosition(1, 0.2).addParent(containers[5])
            new Label()
                .setText("Квантилі")
                .setColor("white")
                .setFontSize(0.6)
                .setSize(-1, 1)
                .centerText()
                .addParent(quantilContainer)
            quantils.options.showRowNames = false
            quantils.getTable()
                .setSize(-1, 1.8)
                .setPosition(0, .8)
                .positionCenter(true, false)
                .addParent(quantilContainer)
            quantils.refreshTable()


            let decilsContainer = new Gui().setSize(15, 2.5).setPosition(10, 0.2).addParent(containers[5])
            new Label()
                .setText("Децилі")
                .setColor("white")
                .setFontSize(0.6)
                .setSize(-1, 1)
                .centerText()
                .addParent(decilsContainer)
            decils.options.showRowNames = false
            decils.getTable()
                .setSize(-1, 1.8)
                .setPosition(0, .8)
                .positionCenter(true, false)
                .addParent(decilsContainer)
            decils.refreshTable()

        }
        let formLable = new Label()
            .setColor("white")
            .setText(`С-ки форми`)
            .setPosition(10.2, 0.2)
            .setSize(6, 0)
            .centerText()
            .setFontSize(0.6)
            .addParent(containers[3])
        //Асиметрія
        {

            let asymetry = +(statistical_data.moments.central[3] / (statistical_data.moments.central[2] ** 1.5)).toFixed(3)
            statistical_data.asymetry = asymetry
            let asymetryLable = new Label()
                .setColor("white")
                .setText(`Асиметрія ${asymetry}`)
                .setPosition(10.2, 1.2)
                .setSize(6, 0)
                .centerText()
                .setFontSize(0.6)
                .addParent(containers[3])

        }
        //Ексцес
        {

            let exces = +(statistical_data.moments.central[4] / (statistical_data.moments.central[2] ** 2) - 3).toFixed(3)

            let excesLable = new Label()
                .setColor("white")
                .setText(`Ексцес ${exces.toFixed(3)}`)
                .setPosition(10.2, 2.2)
                .setSize(6, 0)
                .centerText()
                .setFontSize(0.6)
                .addParent(containers[3])
            statistical_data.exces = exces
        }

    }


    CreateVerticalContainers(sizes, startHeight, parent, decoration = Styles.BackGround.verticalContainer) {
        let containers = []
        let width = this.mainGui.size.x - 0.5

        for (let size of sizes) {
            let gui = new Gui().setSize(width, size).setPosition(0.25, startHeight).setDecoration(decoration).addParent(parent)
            containers.push(gui)
            startHeight += size + 0.8
        }
        return containers

    }
    Find_Quantils(freq, numbers, number_of_quantils, marking) {

        let total = freq.sum
        let quantil_line = []
        for (let i = 1; i < number_of_quantils; i++) {
            quantil_line.push(total * i / number_of_quantils)
        }
        let quantil_result = new SimpleDataFrame(["Квантиль", " "])
        let quantilCounter = 0
        let sum = 0
        for (let i = 0; i < freq.length; i++) {
            sum += freq[i]
            while (sum >= quantil_line[quantilCounter] && quantilCounter < number_of_quantils - 1) {
                quantil_result.addDictionary({
                    "Квантиль": marking + quantilCounter,// (quantilCounter / number_of_quantils).toFixed(Math.log10(number_of_quantils) >> 0),

                    " ": numbers[i]

                })
                quantilCounter++
            }
        }
        return quantil_result
    }
    Find_Quantils_Range(freq, numbers, number_of_quantils, marking) {

        let total = freq.sum
        let quantil_line = []
        for (let i = 1; i < number_of_quantils; i++) {
            quantil_line.push(total * i / number_of_quantils)
        }
        console.log({ quantil_line })
        let quantil_result = new SimpleDataFrame(["Квантиль", " "])
        let quantilCounter = 0
        let sum = 0
        for (let i = 0; i < freq.length; i++) {
            sum += freq[i]
            while (sum >= quantil_line[quantilCounter] && quantilCounter < number_of_quantils - 1) {
                let quantil = numbers[i].start + (quantil_line[quantilCounter] - (sum - freq[i])) / freq[i] * numbers[i].length()


                quantil_result.addDictionary({
                    "Квантиль": marking + quantilCounter,// (quantilCounter / number_of_quantils).toFixed(Math.log10(number_of_quantils) >> 0),

                    " ": +quantil.toFixed(3)

                })
                quantilCounter++
            }
        }
        return quantil_result
    }
    getIntervalDataSample() {
        let df = new SimpleDataFrame(["x", "n"])
        // let sample = [
        //     [10, new NumberRange(0, 8)],
        //     [15, new NumberRange(8, 16)],
        //     [20, new NumberRange(16, 24)],
        //     [25, new NumberRange(24, 32)],
        //     [20, new NumberRange(32, 40)],
        //     [10, new NumberRange(40, 48)]
        // ]
        let sample = [
            [6, new NumberRange(0, 4)],
            [14, new NumberRange(4, 8)],
            [20, new NumberRange(8, 12)],
            [25, new NumberRange(12, 16)],
            [30, new NumberRange(16, 20)],
            [5, new NumberRange(20, 24)]
        ]

        for (const pair of sample) {
            df.addDictionary({
                "x": pair[1],
                "n": pair[0]
            })
        }

        return df
    }

    normalizeDiscreteSample(sample) {
        let arr = sample.split(", ").map(Number)
        // let counter = {
        //     '0': 35,
        //     '1': 38,
        //     '2': 20,
        //     '3': 6,
        //     '4': 1,
        // }
        let counter = {
            '-1': 200,
            '-2': 40,
            '-3': 60,
            '-4': 10,
            '-5': 102,
            '0': 150,
            '1': 230,
            '2': 70,
            '3': 80,
            '4': 102,
            '5': 50,
            '6': 2
        }
        // let counter = {
        //     '0': 6 / 4,
        //     '1': 6 / 4,
        //     '2': 6 / 4,
        //     '3': 6 / 4,

        //     '4': 14 / 4,
        //     '5': 14 / 4,
        //     '6': 14 / 4,
        //     '7': 14 / 4,

        //     '8': 20 / 4,
        //     '9': 20 / 4,
        //     '10': 20 / 4,
        //     '11': 20 / 4,

        //     '12': 25 / 4,
        //     '13': 25 / 4,
        //     '14': 25 / 4,
        //     '15': 25 / 4,

        //     '16': 30 / 4,
        //     '17': 30 / 4,
        //     '18': 30 / 4,
        //     '19': 30 / 4,

        //     '20': 5 / 4,
        //     '21': 5 / 4,
        //     '22': 5 / 4,
        //     '23': 5 / 4,
        // }
        //let counter = this.countSymbols(arr)
        let df = new SimpleDataFrame(["Число", "Частота"])
        for (const number in counter) {
            df.addDictionary({
                "Число": +number,
                "Частота": counter[number]
            }

            )
        }
        return df
    }


    countSymbols(text) {
        let counter = {}
        for (let symbol of text) {
            counter[symbol] = counter.get(symbol, 0) + 1
        }
        return counter
    }




    createAboutGUI() {
        let gui = new Gui().setName("about")
        return gui
    }



    addLeftMenuButtonBehaviour(button, gui) {
        button.setDecoration(Styles.Button.menuItem)
        button.addEventListener("mouseenter", () => {
            if (button._isActive)
                button.setDecoration(functionMerger(Styles.Button.menuItemActive, Styles.Button.hoverLighter))
            else
                button.setDecoration(functionMerger(Styles.Button.menuItem, Styles.Button.hoverLighter))
        })
        button.addEventListener("mouseleave", () => {
            if (button._isActive)
                button.setDecoration(Styles.Button.menuItemActive)
            else
                button.setDecoration(Styles.Button.menuItem)
        })
        button.addEventListener("mousedown", () => {
            button.setDecoration(functionMerger(Styles.Button.menuItemActive, Styles.Button.hoverLighter))
            button._isActive = true
            button.open()
            gui.open()

        })

        button.close = () => {

            button._isActive = false
            button.dispatchEvent("mouseleave")
        }

    }



}