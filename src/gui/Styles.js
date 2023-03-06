

let Styles = {}



export default Styles = {
    Button: {
        menu: () => ({
            "border-radius": "20px",
            "background-color": "#7289DA",

        }),
        menuItem: () => ({
            "background-color": "#2C2F33",
            "filter": "brightness(110%)",
            "border-radius": '20px'
        }),
        hoverLighter: () => ({
            "filter": "brightness(120%)"
        }),
        menuItemActive: () => ({
            "background-color": "gray",
            "border-radius": '20px'
        })
    },
    BackGround: {
        menu: () => ({ "background-color": "#2C2F33" }),
        task1: () => ({ "background-color": "#36393e" }),
        verticalContainer: () => ({
            "background-color": "#2C2F33",
            "border-radius": "25px"
        }),
        graphContainer1: () => ({
            "background-color": "#5c5e5c",
            "border-radius": "25px"
        })
    },
    TableCell: {
        main: () => ({
            "box-sizing": "border-box",
            "background-color": "#5c5e5c",
            "border": "2px solid black"
            //'border-right': '5px solid #1C6EA4',
            // 'border-bottom': '5px solid #1C6EA4'
        })
    },
    Table: {
        main: (s, p, obj) => {
            if (obj.isVertical) {
                return {
                    "overflow-x": "hidden",
                    "overflow-y": "auto"
                }
            }
            else {
                return {
                    "overflow-y": "hidden",
                    "overflow-x": "auto"
                }
            }

        }

    }
}