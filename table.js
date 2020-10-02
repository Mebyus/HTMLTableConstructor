let table = document.createElement('table')
document.body.appendChild(table)

let head = table.createTHead()

let config = {
    layout: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        {
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
            id: 1,
            source: 'row_number',
            caption: '№ п/п',
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

function traverse(layout) {
    let result = {
        depth: 0,
        width: 0,
    }
    for (let i = 0; i < layout.length; i++) {
        if (layout[i].subcolumns) {
            let subresult = traverse(layout[i].subcolumns)
            if (subresult.depth > result.depth) {
                result.depth = subresult.depth
            }
            result.width += subresult.width
        } else {
            result.width++
        }
    }
    result.depth++
    return result
}

function constructTableHeader(head, config) {
    let depth = traverse(config.layout)
    let rows = []
    for (let i = 0; i < depth; i++) {
        rows.push(head.insertRow())
    }
    
}

function mapColumns(columns) {
    let m = new Map()
    for (let i = 0; i < columns.length; i++) {
        m.set(columns[i].id, columns[i])
    }
    return m
} 

console.log('Header grid:', traverse(config.layout))
console.log('Columns map:', mapColumns(config.columns))