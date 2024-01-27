

let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();
let month_offset = 12;

const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

let abcdef = JSON.parse(`{
    "sensor_datas": {
        "01/12/23": {
            "bpm": 70,
            "weight": 150,
            "exercise_minutes": 90
        },
        "08/12/23": {
            "bpm": 78,
            "weight": 156,
            "exercise_minutes": 98
        },
        "15/12/23": {
            "bpm": 85,
            "weight": 163,
            "exercise_minutes": 105
        },
        "22/12/23": {
            "bpm": 92,
            "weight": 170,
            "exercise_minutes": 112
        },
        "29/12/23": {
            "bpm": 97,
            "weight": 175,
            "exercise_minutes": 117
        },
        "05/01/24": {
            "bpm": 104,
            "weight": 182,
            "exercise_minutes": 124
        },
        "12/01/24": {
            "bpm": 113,
            "weight": 191,
            "exercise_minutes": 133
        },
        "19/01/24": {
            "bpm": 122,
            "weight": 200,
            "exercise_minutes": 142
        },
        "26/01/24": {
            "bpm": 131,
            "weight": 209,
            "exercise_minutes": 151
        },
        "02/02/24": {
            "bpm": 140,
            "weight": 218,
            "exercise_minutes": 160
        },
        "09/02/24": {
            "bpm": 149,
            "weight": 227,
            "exercise_minutes": 169
        },
        "16/02/24": {
            "bpm": 158,
            "weight": 236,
            "exercise_minutes": 178
        },
        "23/02/24": {
            "bpm": 167,
            "weight": 245,
            "exercise_minutes": 187
        }
    }
}`);

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
        ctx.fillText(weekday_names[(i - 4 + 28) % 7], (i + 1) * graph.width / 8, graph.height - graph.height / 22 + 6)
    }

    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle';

    for (i = 0; i < 21; i++) {
        ctx.fillStyle = '#4C566A';
        ctx.fillRect(graph.width / 8, (i + 1) * graph.height / 22, graph.width * 6/8, 1);

        ctx.fillStyle = '#D8DEE9';
        ctx.fillText(200 - i * 10, graph.width * 7/8 + 6, (i + 1) * graph.height / 22)
    }

    ctx.textAlign = 'center'
    ctx.fillStyle = '#5E81AC';
    ctx.font = '18px Arial';

    // ctx.fillText('Day', graph.width / 2, graph.height - graph.height / 22 * 2/7);
    // ctx.fillText('Chance %', graph.width - graph.width / 21 * 4/3, graph.height / 21 * 2/5);
}

function draw_last_week() {
    ctx.lineWidth = 3;

    console.log("aaa");
    let [dyear, dmonth] = shifted_month_year(year, month);
    let ad = 0;
    for (const datum in categories) {
        let dataa = [];



        ctx.strokeStyle = `hsl(${(ad) * 360/3} 30% 50%)`;
        ctx.moveTo(-graph.width / 2, graph.height);
        ctx.beginPath();    
        
        for (let [date_a, data_b] of Object.entries(abcdef["sensor_datas"])) {
            if (data_b[cat[ad]] ) {
            
                let yeear = +date_a.slice(6, 8);
                let moonth = +date_a.slice(3, 5);
                let daay = +date_a.slice(0, 2) + first_day(dyear, dmonth) - 2;
                let weeek = +Math.floor(daay / 7);
    
                if (Math.abs(daay - date.getDate()) < 7) {

                    for (let i = 0; i < 7; i++) {
                        let x = graph.width / 8 + (i) * graph.width / 8;
                        let y = data_b[cat[ad]]

                        console.log(x, y);
                        ctx.lineTo(x, y)
                    }
                }
            }
        }

        ctx.stroke();

        ad += 1;
    }
    
}

function set_categories() {
    for (const i in row_list) {
        row_list[i].childNodes[1].firstElementChild.value = categories[i];
    }
}






function days_in_month(year, month) {
    return new Date(year, month, 0).getDate();
}

function first_day(year, month) {
    return new Date(year, month, 0).getDay();
}

function add_week() {
    calendar.appendChild(document.createElement('tr'));

    for (j=0; j<7; j++) {
        let cell = document.createElement('th');
        let button = document.createElement('button');

        button.classList.add('day');
        button.id = j * 100 + calendar.children.length - 2;
        cell.appendChild(button);

        

        calendar.lastChild.appendChild(cell);

        // document.getElementById('calendar').lastChild.lastChild.id = j *101;

        document.getElementById(j * 100 + calendar.children.length - 2).addEventListener('click', function(e) {
            // abcdef[`${date.getDate()}/${month}/${year - 2000}`]
            // console.log(`${Date(Math.floor(e.target.id / 100))}/${month}/${year - 2000}`);
            // console.log(e.target.id);
          });
    }


}

function shifted_month_year(year, month) {
    return [year + Math.floor((month + month_offset) / 12), (month + month_offset) % 12];
}

function reset() {
    let calendar = document.getElementById('calendar');

    for (i in calendar.children) {
        if (calendar.children[i].tagName == "TR") {
            calendar.children[i].remove();
        }
    }
}

function setup() {
    reset();
    reset();
    reset();

    let calendar = document.getElementById('calendar');
    let day = 0;
    let week = 0;
    let idate = 1;

    let [dyear, dmonth] = shifted_month_year(year, month);

    let day_1 = first_day(dyear, dmonth);

    calendar.firstElementChild.firstElementChild.firstElementChild.innerHTML = MONTHS[dmonth];

    add_week();

    for (i=1; i<=40; i++) {
        day += 1;

        if (day >= 7) {
            day = 0;
            week += 1;

            add_week();
        }

        if (!(week == 0 && day < day_1 - 1  ) && !(i >= days_in_month(dyear, dmonth + 1) + day_1 - 1)) {
            calendar.children[week + 1].children[day].firstElementChild.innerHTML = idate;

            idate += 1;
        }
        
        if (i == date.getDate()) {
            calendar.children[week + 1].children[day].firstElementChild.classList.add('today');
        }
    }

    for (i in calendar.children) {
        if (i == 0) { continue }

        if (calendar.children[i].tagName == "TR") {
            let f = calendar.children[i].firstElementChild.firstElementChild.innerHTML;
            let l = calendar.children[i].lastElementChild.firstElementChild.innerHTML;

            if (f == '' && l == '') {
                calendar.children[i].remove();
            }
        }
    }

    load_data(0)
}

function month_up() {
    month_offset += 1;

    setup()
}

function month_down() {
    month_offset -= 1;

    setup()
}

let  cat = [
    'bpm',
    'weight',
    'exercise_hours'
];

function load_data(c) {
    let [dyear, dmonth] = shifted_month_year(year, month);
    let day_12 = first_day(dyear, dmonth);


    for (let [date_a, data_b] of Object.entries(abcdef["sensor_datas"])) {
        if (data_b[cat[c]] ) {
            let yeear = +date_a.slice(6, 8);
            let moonth = +date_a.slice(3, 5);

            if (moonth == dmonth + 1 && yeear == dyear - 2001) {
                let daay = +date_a.slice(0, 2) + day_12 - 2;
                let weeek = +Math.floor(daay / 7);

                calendar.childNodes[weeek + 2].children[daay % 7].firstElementChild.style.backgroundColor = `hsl(${(c) * 360/(3)} 30% 50%)`;
            }

            //  new_row.firstElementChild.firstElementChild.style['background-color'] = `hsl(${(i+1) * 360/(rows+1)} 30% 50%)`;
        }
    }
}

function fix_buttons() {
    for (i = 0; i < 3; i++) {
        document.getElementById('percent_to_cards').firstElementChild.children[i + 1].children[1].firstChild.id = i;

        document.getElementById(i).addEventListener('click', function(e) {
            load_data(e.target.id);
          });
          
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


setup();

fix_buttons();

calculate();



