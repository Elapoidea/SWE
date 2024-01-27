const table = document.getElementById('percent_to_cards');
const input_row = document.getElementById('input_row');
const graph = document.getElementById('graph');
const ctx = graph.getContext('2d');
let data = [];

let weekday_names = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
]

let categories = [
    'BPM',
    'Weight',
    'Exercise Minutes'
]

let abcd = JSON.parse(`{
    "sensor_datas": {
        "01/12/23": {
            "bpm": 70,
            "weight": 150,
            "exercise_hours": 90
        },
        "02/12/23": {
            "bpm": 72,
            "weight": 152,
            "exercise_hours": 92
        },
        "03/12/23": {
            "bpm": 71,
            "weight": 149,
            "exercise_hours": 91
        },
        "04/12/23": {
            "bpm": 73,
            "weight": 151,
            "exercise_hours": 93
        },
        "05/12/23": {
            "bpm": 75,
            "weight": 153,
            "exercise_hours": 95
        },
        "06/12/23": {
            "bpm": 74,
            "weight": 152,
            "exercise_hours": 94
        },
        "07/12/23": {
            "bpm": 76,
            "weight": 154,
            "exercise_hours": 96
        },
        "08/12/23": {
            "bpm": 78,
            "weight": 156,
            "exercise_hours": 98
        },
        "09/12/23": {
            "bpm": 77,
            "weight": 155,
            "exercise_hours": 97
        },
        "10/12/23": {
            "bpm": 80,
            "weight": 158,
            "exercise_hours": 100
        },
        "11/12/23": {
            "bpm": 79,
            "weight": 157,
            "exercise_hours": 99
        },
        "12/12/23": {
            "bpm": 82,
            "weight": 160,
            "exercise_hours": 102
        },
        "13/12/23": {
            "bpm": 81,
            "weight": 159,
            "exercise_hours": 101
        },
        "14/12/23": {
            "bpm": 83,
            "weight": 161,
            "exercise_hours": 103
        },
        "15/12/23": {
            "bpm": 85,
            "weight": 163,
            "exercise_hours": 105
        },
        "16/12/23": {
            "bpm": 84,
            "weight": 162,
            "exercise_hours": 104
        },
        "17/12/23": {
            "bpm": 86,
            "weight": 164,
            "exercise_hours": 106
        },
        "18/12/23": {
            "bpm": 88,
            "weight": 166,
            "exercise_hours": 108
        },
        "19/12/23": {
            "bpm": 87,
            "weight": 165,
            "exercise_hours": 107
        },
        "20/12/23": {
            "bpm": 90,
            "weight": 168,
            "exercise_hours": 110
        },
        "21/12/23": {
            "bpm": 89,
            "weight": 167,
            "exercise_hours": 109
        },
        "22/12/23": {
            "bpm": 92,
            "weight": 170,
            "exercise_hours": 112
        },
        "23/12/23": {
            "bpm": 91,
            "weight": 169,
            "exercise_hours": 111
        },
        "24/12/23": {
            "bpm": 94,
            "weight": 172,
            "exercise_hours": 114
        },
        "25/12/23": {
            "bpm": 93,
            "weight": 171,
            "exercise_hours": 113
        },
        "26/12/23": {
            "bpm": 96,
            "weight": 174,
            "exercise_hours": 116
        },
        "27/12/23": {
            "bpm": 95,
            "weight": 173,
            "exercise_hours": 115
        },
        "28/12/23": {
            "bpm": 98,
            "weight": 176,
            "exercise_hours": 118
        },
        "29/12/23": {
            "bpm": 97,
            "weight": 175,
            "exercise_hours": 117
        },
        "30/12/23": {
            "bpm": 100,
            "weight": 178,
            "exercise_hours": 120
        },
        "31/12/23": {
            "bpm": 99,
            "weight": 177,
            "exercise_hours": 119
        },
        "01/01/24": {
            "bpm": 101,
            "weight": 179,
            "exercise_hours": 121
        },
        "02/01/24": {
            "bpm": 103,
            "weight": 181,
            "exercise_hours": 123
        },
        "03/01/24": {
            "bpm": 102,
            "weight": 180,
            "exercise_hours": 122
        },
        "04/01/24": {
            "bpm": 105,
            "weight": 183,
            "exercise_hours": 125
        },
        "05/01/24": {
            "bpm": 104,
            "weight": 182,
            "exercise_hours": 124
        },
        "06/01/24": {
            "bpm": 107,
            "weight": 185,
            "exercise_hours": 127
        },
        "07/01/24": {
            "bpm": 106,
            "weight": 184,
            "exercise_hours": 126
        },
        "08/01/24": {
            "bpm": 109,
            "weight": 187,
            "exercise_hours": 129
        },
        "09/01/24": {
            "bpm": 108,
            "weight": 186,
            "exercise_hours": 128
        },
        "10/01/24": {
            "bpm": 111,
            "weight": 189,
            "exercise_hours": 131
        },
        "11/01/24": {
            "bpm": 110,
            "weight": 188,
            "exercise_hours": 130
        },
        "12/01/24": {
            "bpm": 113,
            "weight": 191,
            "exercise_hours": 133
        },
        "13/01/24": {
            "bpm": 112,
            "weight": 190,
            "exercise_hours": 120
        }
    }
}`);

function add_rows(rows) {
    for (i = 0; i < rows; i++) {
        let new_row = input_row.cloneNode(true);

        new_row.firstElementChild.firstElementChild.style['background-color'] = `hsl(${(i+1) * 360/(rows+1)} 30% 50%)`;
        new_row.children[1].firstElementChild.style['background-color'] = `hsl(${(i+1) * 360/(rows+1)} 30% 50%)`;

        table.firstElementChild.appendChild(new_row);
    }
}

function read_table() {
    let inputs = [];

    for (const i in row_list) {
        let parsed_row = {
            category: row_list[i].childNodes[1].firstElementChild.value,
        };

        if (!(parsed_row.draws && parsed_row.success)) {
            continue;
        }
        
        inputs.push(parsed_row);
    }

    return inputs;
}

function calculate() {
    data = read_table();

    let answer = '';
    let overall_success = 1;
    let total_cards = 0;

    for (const datum of data) {
        answer = parseFloat(root(at_least_one, 32, datum.draws, datum.success).toFixed(1));
            
        overall_success *= datum.success / 100;
        total_cards += answer;

        row_list[datum.id].childNodes[7].firstElementChild.innerHTML = answer;
    }

    data = read_table();

    create_graph();
    draw_last_week();
}


function create_graph() {
    ctx.clearRect(0, 0, graph.width, graph.height)
    ctx.font = '10px Arial';

    ctx.textAlign = 'center'
    ctx.textBaseline = 'top';

    for (i = 0; i < 7; i++) {
        ctx.fillStyle = '#4C566A';
        ctx.fillRect((i + 1) * graph.width / 8, graph.height / 22, 1, graph.height * 20/22);

        ctx.fillStyle = '#D8DEE9';
        ctx.fillText(weekday_names[i], (i + 1) * graph.width / 8, graph.height - graph.height / 22 + 6)
    }

    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle';

    for (i = 0; i < 21; i++) {
        ctx.fillStyle = '#4C566A';
        ctx.fillRect(graph.width / 8, (i + 1) * graph.height / 22, graph.width * 6/8, 1);

        ctx.fillStyle = '#D8DEE9';
        ctx.fillText(100 - i * 5, graph.width * 7/8 + 6, (i + 1) * graph.height / 22)
    }

    ctx.textAlign = 'center'
    ctx.fillStyle = '#5E81AC';
    ctx.font = '18px Arial';

    // ctx.fillText('Day', graph.width / 2, graph.height - graph.height / 22 * 2/7);
    // ctx.fillText('Chance %', graph.width - graph.width / 21 * 4/3, graph.height / 21 * 2/5);
}

function draw_last_week() {
    ctx.lineWidth = 3;
    
    for (const datum of data) {
        ctx.strokeStyle = `hsl(${(datum.id) * 360/10} 30% 50%)`;
        ctx.moveTo(-graph.width / 2, graph.height);
        ctx.beginPath();    
       
        for (let i = 0; i < 21; i++) {
            let x = (i + 1) * graph.width / 22;
            let y = graph.height * 21/22 - at_least_one(datum.cards, i + 7) * graph.height * 20/22

            ctx.lineTo(x, y)
        }
        
        ctx.stroke();
    }

    ctx.font = '15px Arial';

    for (const datum of data) {
        ctx.fillStyle = `hsl(${(datum.id) * 360/10} 30% 50%)`;   
       
        let x = (datum.draws - 7 + 1) * graph.width / 22;
        let y =  graph.height * 21/22 - at_least_one(datum.cards, datum.draws) * graph.height * 20/22;

        ctx.beginPath();
        ctx.arc(x + 1, y, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText(datum.category, x, y - 12);
    }
    
}

function set_categories() {
    for (const i in row_list) {
        row_list[i].childNodes[1].firstElementChild.value = categories[i];
    }
}

add_rows(2);


let row_list = [];

for (i = 0; i < table.childNodes[1].childElementCount + 2; i++) {
    row = table.childNodes[1].childNodes[i];

    if (row.id == 'input_row') {
        row_list.push(row);
    }
}

set_categories(); 
create_graph();

// function getMousePos(graph, event) {
//     let bounding_box = graph.getBoundingClientRect();

//     return {
//       x: event.clientX - bounding_box.left,
//       y: event.clientY - bounding_box.top
//     };
// }

// graph.addEventListener('mousemove', function(evt) { 
//     let mouse = getMousePos(graph, evt);

//     create_graph(); 
//     draw_line(mouse.x, mouse.y); 
//     draw_probability(); 
// }, false);


