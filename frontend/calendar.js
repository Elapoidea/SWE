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
        cell.appendChild(button);

        calendar.lastChild.appendChild(cell);
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
}

function month_up() {
    month_offset += 1;

    setup()
}

function month_down() {
    month_offset -= 1;

    setup()
}

// funcion load_data() {

// }

setup();