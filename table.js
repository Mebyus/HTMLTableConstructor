let table = document.createElement('table')
document.body.appendChild(table)

let config = {
    layout: [
        { id: 1 }, 
        { id: 2 },
        { 
            // data column
            id: 3, // = id from columns config
            caption: 'Какой-то другой заголовок', // you can override column caption here
        },
        { id: 4 },
        { id: 5 },
        {
            // column with subcolumns (union) can't be data column
            caption: 'Не распознан РЗ',
            subcolumns: [
                { id: 6 },
                { id: 7 },
            ],
        },
        {
            caption: 'Ошибки АПВГК',
            subcolumns: [
                {
                    caption: 'Ошибка измерения габаритных размеров',
                    subcolumns: [
                        { id: 8 },
                        { id: 9 },
                        { id: 10 },
                    ],
                },
                {
                    caption: 'Ошибка измерения весовых параметров',
                    subcolumns: [
                        { id: 11 },
                        { id: 12 },
                    ],
                },
                { id: 13 },
                { id: 14 },
                { id: 15 },
            ],
        },
        { id: 16 },
    ],
    columns: [
        {
            id: 1, // data column id
            source: 'row_number',
            caption: '№',
            type: 'integer',
            gravity: 10,
            displaySort: false,
        },
        {
            id: 2,
            source: 'detector_info',
            caption: 'Название и серийный номер АПВГК',
            type: 'string',
            gravity: 30,
            displaySort: true,
        },
        {
            id: 3,
            source: 'location',
            caption: 'Место установки',
            type: 'string',
            gravity: 30,
            displaySort: true,
        },
        {
            id: 4,
            source: 'direction',
            caption: 'Направление',
            type: 'string',
            gravity: 15,
            displaySort: false,
        },
        {
            id: 5,
            source: 'defect_total',
            caption: 'Всего',
            type: 'integer',
            gravity: 15,
            displaySort: true,
        },
        {
            id: 6,
            source: 'car_number_defect_deception',
            caption: 'Умышленное сокрытие водителем',
            type: 'integer',
            gravity: 15,
            displaySort: true,
        },
        {
            id: 7,
            source: 'car_number_defect_technical',
            caption: 'Технические причины',
            type: 'integer',
            gravity: 15,
            displaySort: true,
        },
        {
            id: 8,
            source: 'dimensions_measurement_length',
            caption: 'Длина',
            type: 'integer',
            gravity: 15,
            displaySort: true,
        },
        {
            id: 9,
            source: 'dimensions_measurement_width',
            caption: 'Ширина',
            type: 'integer',
            gravity: 15,
            displaySort: true,
        },
        {
            id: 10,
            source: 'dimensions_measurement_height',
            caption: 'Высота',
            type: 'integer',
            gravity: 15,
            displaySort: true,
        },
        {
            id: 11,
            source: 'weight_measurement_total',
            caption: 'Общая масса',
            type: 'integer',
            gravity: 15,
            displaySort: true,
        },
        {
            id: 12,
            source: 'weight_measurement_axles',
            caption: 'Осевые нагрузки',
            type: 'integer',
            gravity: 15,
            displaySort: true,
        },
        {
            id: 13,
            source: 'vehicle_type_detection_error',
            caption: 'Ошибка определения типа ТС',
            type: 'integer',
            gravity: 15,
            displaySort: true,
        },
        {
            id: 14,
            source: 'axles_detection_error',
            caption: 'Ошибка определения расположения осей',
            type: 'integer',
            gravity: 15,
            displaySort: true,
        },
        {
            id: 15,
            source: 'wheel_type_detection_error',
            caption: 'Ошибка определения количества скатов/колес',
            type: 'integer',
            gravity: 15,
            displaySort: true,
        },
        {
            id: 16,
            source: 'other_defect_reason',
            caption: 'Прочие',
            type: 'integer',
            gravity: 15,
            displaySort: true,
        },
    ],
}

function traverse(layout, billet, depth) {
    let width = 0
    let nextDepth = 1 + (depth || 0)
    for (let i = 0; i < layout.length; i++) {
        if (layout[i].subcolumns) {
            let subwidth = traverse(layout[i].subcolumns, billet, nextDepth)
            billet.insert({ type: 'union', colspan: subwidth, caption: layout[i].caption }, depth || 0)
            width += subwidth
        } else {
            billet.insert({ type: 'data', id: layout[i].id, caption: layout[i].caption }, depth || 0)
            width++
        }
    }
    return width
}

function mapColumns(columns) {
    let m = new Map()
    for (let i = 0; i < columns.length; i++) {
        m.set(columns[i].id, columns[i])
    }
    return m
}

class HeaderBillet {
    constructor() {
        this.rows = []
    }

    /**
     * 
     * @param {*} cell 
     * @param {number} depth 
     */
    insert(cell, depth) {
        for (let i = this.rows.length; i <= depth; i++) {
            this.rows.push([])
        }
        this.rows[depth].push(cell)
    }

    tweak(columns) {
        let map = mapColumns(columns)
        let height = this.rows.length
        for (let i = 0; i < this.rows.length; i++) {
            let rowConfig = this.rows[i]
            for (let j = 0; j < rowConfig.length; j++) {
                let cellConfig = rowConfig[j]
                if (cellConfig.type === 'data') {
                    cellConfig.rowspan = height - i
                    cellConfig.caption = cellConfig.caption || map.get(cellConfig.id).caption
                }
            }
        }
    }

    /**
     * Fills table header with rows and cells
     * @param {HTMLTableSectionElement} header 
     */
    mold(header) {
        for (let i = 0; i < this.rows.length; i++) {
            let rowConfig = this.rows[i]
            let row = header.insertRow()
            for (let j = 0; j < rowConfig.length; j++) {
                let cellConfig = rowConfig[j]
                let cell = row.insertCell()
                cell.innerText = cellConfig.caption || ''
                let colspan = cellConfig.colspan || 1
                if (colspan > 1) cell.setAttribute('colspan', colspan)
                let rowspan = cellConfig.rowspan || 1
                if (rowspan > 1) cell.setAttribute('rowspan', rowspan)
            }
        }
    }
}

/**
 * 
 * @param {HTMLTableElement} table 
 * @param {*} config
 */
function insertHeader(table, config) {
    let header = table.createTHead()
    let billet = new HeaderBillet()
    traverse(config.layout, billet)
    billet.tweak(config.columns)
    billet.mold(header)
}

insertHeader(table, config)