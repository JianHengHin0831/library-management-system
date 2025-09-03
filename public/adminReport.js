const initialYearSelect = document.getElementById('initialYear');
const initialMonthSelect = document.getElementById('initialMonth');
const initialDateSelect = document.getElementById('initialDate');
const lastYearSelect = document.getElementById('lastYear');
const lastMonthSelect = document.getElementById('lastMonth');
const lastDateSelect = document.getElementById('lastDate');

function populateDropdowns(select, start, end) {
    select.style.display = 'none';
    for (let i = start; i <= end; i++) {
        const option = document.createElement('option');
        option.text = i;
        option.value = i;
        select.add(option);
    }
}
populateDropdowns(initialYearSelect, 2023, new Date().getFullYear());
populateDropdowns(initialMonthSelect, 1, 12);
populateDropdowns(initialDateSelect, 1, 31);
populateDropdowns(lastYearSelect, 2023, new Date().getFullYear());
populateDropdowns(lastMonthSelect, 1, 12);
populateDropdowns(lastDateSelect, 1, 31);




let myChart = null;


function generateColorPalette(length) {
    const colors = [];
    for (let i = 0; i < length; i++) {
        const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`;
        colors.push(color);
    }
    return colors;
}

document.querySelectorAll('.select-date').forEach(select => {
    select.addEventListener('change', function() {
        if (localStorage.getItem('chart') === 'pie') {
            const type = localStorage.getItem('type');
            const book = localStorage.getItem('book');
            showPieChart(type, book);
        }
        if (localStorage.getItem('chart') === 'bar') {
            const type = localStorage.getItem('type');
            const book = localStorage.getItem('book');
            const compare = localStorage.getItem('compare');
            showBarChart(type, book,compare);
        }
        if (localStorage.getItem('chart') === 'line') {
            const type = localStorage.getItem('type');
            const book = localStorage.getItem('book');
            const compare = localStorage.getItem('compare');
            showLineChart(type, book,compare);
        }
    });
});


function populateResultIntoTable(data, compare,chart){
    const reportDetails = document.getElementById('reportDetails');
    reportDetails.innerHTML="";

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    var headers=null;
    if(chart=="bar"){
        headers = ['Label', compare.charAt(0).toUpperCase()+compare.slice(1), 'Value'];
    }else if(chart=="line"){
       headers = [ compare.charAt(0).toUpperCase()+compare.slice(1), 'Value'];
    }else if(chart=="pie"){
        headers = [ 'Label', 'Value'];
    }
    
    const headerRow = document.createElement('tr');
    headers.forEach(headerText => {
    const th = document.createElement('th');
    th.textContent = headerText;
    headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    data.forEach(rowData => {
    const row = document.createElement('tr');
    Object.values(rowData).forEach(value => {
        const cell = document.createElement('td');
        cell.textContent = value;
        row.appendChild(cell);
    });
    tbody.appendChild(row);
    });
    table.appendChild(tbody);

    reportDetails.appendChild(table)
}

function showBarChart(type, book, compare){
    localStorage.setItem('chart','bar')
    localStorage.setItem('type', type);
    localStorage.setItem('book', book);
    localStorage.setItem('compare',compare)

    if (myChart) {
        myChart.destroy(); 
    }



    const initialYearSelect = document.getElementById('initialYear').value;
    const initialMonthSelect = document.getElementById('initialMonth').value;
    const initialDateSelect = document.getElementById('initialDate').value;
    const lastYearSelect = document.getElementById('lastYear').value;
    const lastMonthSelect = document.getElementById('lastMonth').value;
    const lastDateSelect = document.getElementById('lastDate').value;

    
    const bookText = book ? book : 'All';

    let chartTitle;
    if (compare == "year") {
        document.getElementById('initialYear').style.display = 'flex';
        document.getElementById('initialMonth').style.display = 'none';
        document.getElementById('initialDate').style.display = 'none';
        document.getElementById('lastYear').style.display = 'flex';
        document.getElementById('lastMonth').style.display = 'none';
        document.getElementById('lastDate').style.display = 'none';

        document.getElementById('initialYearLabel').style.display = 'flex';
        document.getElementById('initialMonthLabel').style.display = 'none';
        document.getElementById('initialDateLabel').style.display = 'none';
        document.getElementById('lastYearLabel').style.display = 'flex';
        document.getElementById('lastMonthLabel').style.display = 'none';
        document.getElementById('lastDateLabel').style.display = 'none';

        chartTitle = `Bar Chart of ${type} book for ${bookText} category from ${initialYearSelect} to ${lastYearSelect}`;
    } else if (compare == "month") {
        document.getElementById('initialYear').style.display = 'flex';
        document.getElementById('initialMonth').style.display = 'flex';
        document.getElementById('initialDate').style.display = 'none';
        document.getElementById('lastYear').style.display = 'none';
        document.getElementById('lastMonth').style.display = 'flex';
        document.getElementById('lastDate').style.display = 'none';

        document.getElementById('initialYearLabel').style.display = 'flex';
        document.getElementById('initialMonthLabel').style.display = 'flex';
        document.getElementById('initialDateLabel').style.display = 'none';
        document.getElementById('lastYearLabel').style.display = 'none';
        document.getElementById('lastMonthLabel').style.display = 'flex';
        document.getElementById('lastDateLabel').style.display = 'none';

        chartTitle = `Bar Chart of ${type} book for ${bookText} category from ${initialYearSelect}.${initialMonthSelect} to ${initialYearSelect}.${lastMonthSelect}`;
    } else if (compare == "date") {
        document.getElementById('initialYear').style.display = 'flex';
        document.getElementById('initialMonth').style.display = 'flex';
        document.getElementById('initialDate').style.display = 'flex';
        document.getElementById('lastYear').style.display = 'none';
        document.getElementById('lastMonth').style.display = 'none';
        document.getElementById('lastDate').style.display = 'flex';

        document.getElementById('initialYearLabel').style.display = 'flex';
        document.getElementById('initialMonthLabel').style.display = 'flex';
        document.getElementById('initialDateLabel').style.display = 'flex';
        document.getElementById('lastYearLabel').style.display = 'none';
        document.getElementById('lastMonthLabel').style.display = 'none';
        document.getElementById('lastDateLabel').style.display = 'flex';
        
        chartTitle = `Pie Chart of ${type} book for ${bookText} category from ${initialYearSelect}.${initialMonthSelect}.${initialDateSelect} to ${initialYearSelect}.${initialMonthSelect}.${lastDateSelect}`;
    }

    document.getElementById("title").textContent = chartTitle;

    if(type==='Borrow'){
        console.log("hi");
        let sqlQuery = `
        SELECT `;
    
    if (book === '') {
        sqlQuery += `book.subject_area AS label, `;
    } else {
        sqlQuery += `book.title AS label, `;
    }
    
    if(compare==='year'){
        sqlQuery += `
            YEAR(circulation.check_out_date) AS year,`
    }else if(compare==='month'){
        sqlQuery += `
            MONTH(circulation.check_out_date) AS year,`
    }else if(compare==='date'){
        sqlQuery += `
            circulation.check_out_date AS year,`
    }
    

    sqlQuery+=`
            COUNT(*) AS value
        FROM 
            circulation
        JOIN 
            copies ON circulation.accession_number = copies.accession_number
        JOIN 
            book ON copies.ISBN = book.ISBN
        WHERE`;

    if (book !== '') {
        sqlQuery += `
                book.subject_area = '${book}' AND`;
    }

    if(compare==='year'){
        sqlQuery += `
        circulation.check_out_date >= '${initialYearSelect}-01-01'
        AND circulation.check_out_date <= '${lastYearSelect}-12-31'`;
    }else if(compare==='month'){
        sqlQuery += `
        circulation.check_out_date >= '${initialYearSelect}-${initialMonthSelect}-01'
        AND circulation.check_out_date <= '${initialYearSelect}-${lastMonthSelect}-31'`;
    }else if(compare==='date'){
        sqlQuery += `
        circulation.check_out_date >= '${initialYearSelect}-${initialMonthSelect}-${initialDateSelect}'
        AND circulation.check_out_date <= '${initialYearSelect}-${initialMonthSelect}-${lastDateSelect}'`;
    }

    if (book === '') {
        sqlQuery += ` GROUP BY 
            book.subject_area`;
    } else {
        sqlQuery += ` GROUP BY 
            book.title`;
    }

    if(compare==='year'){
        sqlQuery+=`, YEAR(circulation.check_out_date)`
    }else if(compare==='month'){
        sqlQuery+=`, MONTH(circulation.check_out_date)`
    }

       console.log(sqlQuery);
    fetch('http://localhost:3000/getChartData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sqlQuery }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.data);
        populateResultIntoTable(data.data,compare,"bar");
        const labels = [];
        const years = [];
        const datasets = {};

        data.data.forEach(entry => {
            if (!labels.includes(entry.label)) {
                labels.push(entry.label);
            }

            if (!years.includes(entry.year)) {
                years.push(entry.year);
            }
        });

        labels.forEach(label => {
            datasets[label] = {};
            years.forEach(year => {
                datasets[label][year] = 0;
            });
        });

        data.data.forEach(entry => {
            datasets[entry.label][entry.year] = entry.value;
        });

        years.sort();

        const colorPalette = generateColorPalette(years.length);
        const datasetsArray = years.map(year => {
            const dataValues = labels.map(label => datasets[label][year]);
            return {
                label: year,
                data: dataValues,
                backgroundColor: colorPalette[years.indexOf(year)],
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            };
        });

        const ctx = document.getElementById('chart').getContext('2d');
        if (myChart) {
            myChart.destroy();
        }
        // myChart = new Chart(ctx, {
        //     type: 'bar',
        //     data: {
        //         labels: labels,
        //         datasets: datasetsArray
        //     },
        //     options: {
        //         scales: {
        //             y: {
        //                 beginAtZero: true
        //             }
        //         }
        //     }
        // });

        // ---------- updated (10/4/2024 3:07pm)
        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasetsArray
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: chartTitle,
                        font: {
                            family: 'Josefin Sans',
                            size: 18
                        }
                    },
                    legend: {
                        labels: {
                            font: {
                                family: 'Josefin Sans',
                                size: 14
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: {
                                family: 'Josefin Sans',
                                size: 12
                            }
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                family: 'Josefin Sans',
                                size: 12
                            }
                        }
                    }
                },
                onResize: function(chart, size) {
                    const width = size.width;
                    let labelSize;
        
                    if (width < 300) {
                        labelSize = 10;
                    } else if (width < 1000) {
                        labelSize = 12;
                    } else {
                        labelSize = 14;
                    }
        
                    chart.options.scales.x.ticks.font.size = labelSize;
                    chart.options.scales.y.ticks.font.size = labelSize;
                    chart.options.plugins.title.font.size = labelSize + 2;  // Increase title font size
        
                    chart.update();
                }
            }
        });
    })
    .catch(error => console.error('Error fetching data:', error));
    }

    else if(type==='Return'){
        console.log("hi");
        let sqlQuery = `
        SELECT `;
    
    if (book === '') {
        sqlQuery += `book.subject_area AS label, `;
    } else {
        sqlQuery += `book.title AS label, `;
    }
    
    if(compare==='year'){
        sqlQuery += `
            YEAR(circulation.returned_date) AS year,`
    }else if(compare==='month'){
        sqlQuery += `
            MONTH(circulation.returned_date) AS year,`
    }else if(compare==='date'){
        sqlQuery += `
            circulation.returned_date AS year,`
    }
    

    sqlQuery+=`
            COUNT(*) AS value
        FROM 
            circulation
        JOIN 
            copies ON circulation.accession_number = copies.accession_number
        JOIN 
            book ON copies.ISBN = book.ISBN
        WHERE`;

    if (book !== '') {
        sqlQuery += `
                book.subject_area = '${book}' AND`;
    }

    if(compare==='year'){
        sqlQuery += `
        circulation.returned_date >= '${initialYearSelect}-01-01'
        AND circulation.returned_date <= '${lastYearSelect}-12-31'`;
    }else if(compare==='month'){
        sqlQuery += `
        circulation.returned_date >= '${initialYearSelect}-${initialMonthSelect}-01'
        AND circulation.returned_date <= '${initialYearSelect}-${lastMonthSelect}-31'`;
    }else if(compare==='date'){
        sqlQuery += `
        circulation.returned_date >= '${initialYearSelect}-${initialMonthSelect}-${initialDateSelect}'
        AND circulation.returned_date <= '${initialYearSelect}-${initialMonthSelect}-${lastDateSelect}'`;
    }

    if (book === '') {
        sqlQuery += ` GROUP BY 
            book.subject_area`;
    } else {
        sqlQuery += ` GROUP BY 
            book.title`;
    }

    if(compare==='year'){
        sqlQuery+=`, YEAR(circulation.returned_date)`
    }else if(compare==='month'){
        sqlQuery+=`, MONTH(circulation.returned_date)`
    }

       console.log(sqlQuery);
    fetch('http://localhost:3000/getChartData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sqlQuery }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.data);
        const labels = [];
        const years = [];
        const datasets = {};

        data.data.forEach(entry => {
            if (!labels.includes(entry.label)) {
                labels.push(entry.label);
            }

            if (!years.includes(entry.year)) {
                years.push(entry.year);
            }
        });

        labels.forEach(label => {
            datasets[label] = {};
            years.forEach(year => {
                datasets[label][year] = 0;
            });
        });

        data.data.forEach(entry => {
            datasets[entry.label][entry.year] = entry.value;
        });

        years.sort();

        const colorPalette = generateColorPalette(years.length);
        const datasetsArray = years.map(year => {
            const dataValues = labels.map(label => datasets[label][year]);
            return {
                label: year,
                data: dataValues,
                backgroundColor: colorPalette[years.indexOf(year)],
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            };
        });

        const ctx = document.getElementById('chart').getContext('2d');
        if (myChart) {
            myChart.destroy();
        }
        // myChart = new Chart(ctx, {
        //     type: 'bar',
        //     data: {
        //         labels: labels,
        //         datasets: datasetsArray
        //     },
        //     options: {
        //         scales: {
        //             y: {
        //                 beginAtZero: true
        //             }
        //         }
        //     }
        // });

        // ---------- updated (10/4/2024 4:08pm)
        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasetsArray
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: chartTitle,
                        font: {
                            family: 'Josefin Sans',
                            size: 18
                        }
                    },
                    legend: {
                        labels: {
                            font: {
                                family: 'Josefin Sans',
                                size: 14
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: {
                                family: 'Josefin Sans',
                                size: 12
                            }
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                family: 'Josefin Sans',
                                size: 12
                            }
                        }
                    }
                },
                onResize: function(chart, size) {
                    const width = size.width;
                    let labelSize;
        
                    if (width < 300) {
                        labelSize = 10;
                    } else if (width < 1000) {
                        labelSize = 12;
                    } else {
                        labelSize = 14;
                    }
        
                    chart.options.scales.x.ticks.font.size = labelSize;
                    chart.options.scales.y.ticks.font.size = labelSize;
                    chart.options.plugins.title.font.size = labelSize + 2;  // Increase title font size
        
                    chart.update();
                }
            }
        });
    })
    .catch(error => console.error('Error fetching data:', error));
    }
    
    else if(type==='Overdue'){
        console.log("hi");
        let sqlQuery = `
        SELECT `;
    
    if (book === '') {
        sqlQuery += `book.subject_area AS label, `;
    } else {
        sqlQuery += `book.title AS label, `;
    }
    
    if(compare==='year'){
        sqlQuery += `
            YEAR(circulation.due_date) AS year,`
    }else if(compare==='month'){
        sqlQuery += `
            MONTH(circulation.due_date) AS year,`
    }else if(compare==='date'){
        sqlQuery += `
            circulation.due_date AS year,`
    }
    

    sqlQuery+=`
            COUNT(*) AS value
        FROM 
            circulation
        JOIN 
            copies ON circulation.accession_number = copies.accession_number
        JOIN 
            book ON copies.ISBN = book.ISBN
        WHERE
            circulation.borrow_status='Overdue' AND`;

    if (book !== '') {
        sqlQuery += `
                book.subject_area = '${book}' AND`;
    }

    if(compare==='year'){
        sqlQuery += `
        circulation.due_date >= '${initialYearSelect}-01-01'
        AND circulation.due_date <= '${lastYearSelect}-12-31'`;
    }else if(compare==='month'){
        sqlQuery += `
        circulation.due_date >= '${initialYearSelect}-${initialMonthSelect}-01'
        AND circulation.due_date <= '${initialYearSelect}-${lastMonthSelect}-31'`;
    }else if(compare==='date'){
        sqlQuery += `
        circulation.due_date >= '${initialYearSelect}-${initialMonthSelect}-${initialDateSelect}'
        AND circulation.due_date <= '${initialYearSelect}-${initialMonthSelect}-${lastDateSelect}'`;
    }

    if (book === '') {
        sqlQuery += ` GROUP BY 
            book.subject_area`;
    } else {
        sqlQuery += ` GROUP BY 
            book.title`;
    }

    if(compare==='year'){
        sqlQuery+=`, YEAR(circulation.due_date)`
    }else if(compare==='month'){
        sqlQuery+=`, MONTH(circulation.due_date)`
    }

       console.log(sqlQuery);
    fetch('http://localhost:3000/getChartData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sqlQuery }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.data);
        const labels = [];
        const years = [];
        const datasets = {};

        data.data.forEach(entry => {
            if (!labels.includes(entry.label)) {
                labels.push(entry.label);
            }

            if (!years.includes(entry.year)) {
                years.push(entry.year);
            }
        });

        labels.forEach(label => {
            datasets[label] = {};
            years.forEach(year => {
                datasets[label][year] = 0;
            });
        });

        data.data.forEach(entry => {
            datasets[entry.label][entry.year] = entry.value;
        });

        years.sort();

        const colorPalette = generateColorPalette(years.length);
        const datasetsArray = years.map(year => {
            const dataValues = labels.map(label => datasets[label][year]);
            return {
                label: year,
                data: dataValues,
                backgroundColor: colorPalette[years.indexOf(year)],
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            };
        });

        const ctx = document.getElementById('chart').getContext('2d');
        if (myChart) {
            myChart.destroy();
        }
        // myChart = new Chart(ctx, {
        //     type: 'bar',
        //     data: {
        //         labels: labels,
        //         datasets: datasetsArray
        //     },
        //     options: {
        //         scales: {
        //             y: {
        //                 beginAtZero: true
        //             }
        //         }
        //     }
        // });

        // ------ updated (10/4/2024 2:45pm)
        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasetsArray
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: chartTitle,
                        font: {
                            family: 'Josefin Sans',
                            size: 18
                        }
                    },
                    legend: {
                        labels: {
                            font: {
                                family: 'Josefin Sans',
                                size: 14
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: {
                                family: 'Josefin Sans',
                                size: 12
                            }
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                family: 'Josefin Sans',
                                size: 12
                            }
                        }
                    }
                },
                onResize: function(chart, size) {
                    const width = size.width;
                    let labelSize;
        
                    if (width < 300) {
                        labelSize = 10;
                    } else if (width < 1000) {
                        labelSize = 12;
                    } else {
                        labelSize = 14;
                    }
        
                    chart.options.scales.x.ticks.font.size = labelSize;
                    chart.options.scales.y.ticks.font.size = labelSize;
                    chart.options.plugins.title.font.size = labelSize + 2;  // Increase title font size
        
                    chart.update();
                }
            }
        });
    })
    .catch(error => console.error('Error fetching data:', error));
    }

    else if(type==='Reserve'){
        console.log("hi");
        let sqlQuery = `
        SELECT `;
    
    if (book === '') {
        sqlQuery += `book.subject_area AS label, `;
    } else {
        sqlQuery += `book.title AS label, `;
    }
    
    if(compare==='year'){
        sqlQuery += `
            YEAR(reservation.reserve_date) AS year,`
    }else if(compare==='month'){
        sqlQuery += `
            MONTH(reservation.reserve_date) AS year,`
    }else if(compare==='date'){
        sqlQuery += `
            reservation.reserve_date AS year,`
    }
    

    sqlQuery+=`
            COUNT(*) AS value
        FROM 
            reservation
        JOIN 
            copies ON reservation.accession_number = copies.accession_number
        JOIN 
            book ON copies.ISBN = book.ISBN
        WHERE
            reservation.reserve_status='Confirmed' AND`;

    if (book !== '') {
        sqlQuery += `
                book.subject_area = '${book}' AND`;
    }

    if(compare==='year'){
        sqlQuery += `
        reservation.reserve_date >= '${initialYearSelect}-01-01'
        AND reservation.reserve_date <= '${lastYearSelect}-12-31'`;
    }else if(compare==='month'){
        sqlQuery += `
        reservation.reserve_date >= '${initialYearSelect}-${initialMonthSelect}-01'
        AND reservation.reserve_date <= '${initialYearSelect}-${lastMonthSelect}-31'`;
    }else if(compare==='date'){
        sqlQuery += `
        reservation.reserve_date >= '${initialYearSelect}-${initialMonthSelect}-${initialDateSelect}'
        AND reservation.reserve_date <= '${initialYearSelect}-${initialMonthSelect}-${lastDateSelect}'`;
    }

    if (book === '') {
        sqlQuery += ` GROUP BY 
            book.subject_area`;
    } else {
        sqlQuery += ` GROUP BY 
            book.title`;
    }

    if(compare==='year'){
        sqlQuery+=`, YEAR(reservation.reserve_date)`
    }else if(compare==='month'){
        sqlQuery+=`, MONTH(reservation.reserve_date)`
    }

       console.log(sqlQuery);
    fetch('http://localhost:3000/getChartData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sqlQuery }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.data);
        const labels = [];
        const years = [];
        const datasets = {};

        data.data.forEach(entry => {
            if (!labels.includes(entry.label)) {
                labels.push(entry.label);
            }

            if (!years.includes(entry.year)) {
                years.push(entry.year);
            }
        });

        labels.forEach(label => {
            datasets[label] = {};
            years.forEach(year => {
                datasets[label][year] = 0;
            });
        });

        data.data.forEach(entry => {
            datasets[entry.label][entry.year] = entry.value;
        });

        years.sort();

        const colorPalette = generateColorPalette(years.length);
        const datasetsArray = years.map(year => {
            const dataValues = labels.map(label => datasets[label][year]);
            return {
                label: year,
                data: dataValues,
                backgroundColor: colorPalette[years.indexOf(year)],
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            };
        });

        const ctx = document.getElementById('chart').getContext('2d');
        // if (myChart) {
        //     myChart.destroy();
        // }
        // myChart = new Chart(ctx, {
        //     type: 'bar',
        //     data: {
        //         labels: labels,
        //         datasets: datasetsArray
        //     },
        //     options: {
        //         scales: {
        //             y: {
        //                 beginAtZero: true
        //             }
        //         }
        //     }
        // });
        
        // ---------- updated (10/4/2024 3:10pm)
        // ---------- updated (10/4/2024 4:08pm)
        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasetsArray
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: chartTitle,
                        font: {
                            family: 'Josefin Sans',
                            size: 18
                        }
                    },
                    legend: {
                        labels: {
                            font: {
                                family: 'Josefin Sans',
                                size: 14
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: {
                                family: 'Josefin Sans',
                                size: 12
                            }
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                family: 'Josefin Sans',
                                size: 12
                            }
                        }
                    }
                },
                onResize: function(chart, size) {
                    const width = size.width;
                    let labelSize;
        
                    if (width < 300) {
                        labelSize = 10;
                    } else if (width < 1000) {
                        labelSize = 12;
                    } else {
                        labelSize = 14;
                    }
        
                    chart.options.scales.x.ticks.font.size = labelSize;
                    chart.options.scales.y.ticks.font.size = labelSize;
                    chart.options.plugins.title.font.size = labelSize + 2;  // Increase title font size
        
                    chart.update();
                }
            }
        });
    })
    .catch(error => console.error('Error fetching data:', error));
    }

    else if(type==='Patrons'){
        console.log("hi");
        let sqlQuery = `
        SELECT `;
    
    if (book === '') {
        sqlQuery+=`users.department AS label, `
    } else {
        sqlQuery+=`CASE 
            WHEN users.user_role = 'U' THEN 'Lecturer'
            ELSE 'Student'
        END AS label, `
    }
    
    if(compare==='year'){
        sqlQuery += `
            YEAR(users.sign_up_date) AS year,`
    }else if(compare==='month'){
        sqlQuery += `
            MONTH(users.sign_up_date) AS year,`
    }else if(compare==='date'){
        sqlQuery += `
        users.sign_up_date AS year,`
    }
    

    sqlQuery+=`
            COUNT(*) AS value
        FROM 
            users WHERE`;

    if (book !== '') {
        sqlQuery += `
                users.department = '${book}' AND`;
    }

    if(compare==='year'){
        sqlQuery += `
        users.sign_up_date >= '${initialYearSelect}-01-01'
        AND users.sign_up_date <= '${lastYearSelect}-12-31'`;
    }else if(compare==='month'){
        sqlQuery += `
        users.sign_up_date >= '${initialYearSelect}-${initialMonthSelect}-01'
        AND users.sign_up_date <= '${initialYearSelect}-${lastMonthSelect}-31'`;
    }else if(compare==='date'){
        sqlQuery += `
        users.sign_up_date >= '${initialYearSelect}-${initialMonthSelect}-${initialDateSelect}'
        AND users.sign_up_date <= '${initialYearSelect}-${initialMonthSelect}-${lastDateSelect}'`;
    }

    if (book === '') {
        sqlQuery += ` GROUP BY 
            users.department`;
    } else {
        sqlQuery += ` GROUP BY 
            users.user_role`;
    }

    if(compare==='year'){
        sqlQuery+=`, YEAR(users.sign_up_date)`
    }else if(compare==='month'){
        sqlQuery+=`, MONTH(users.sign_up_date)`
    }

       console.log(sqlQuery);
    fetch('http://localhost:3000/getChartData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sqlQuery }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.data);
        const labels = [];
        const years = [];
        const datasets = {};

        data.data.forEach(entry => {
            if (!labels.includes(entry.label)) {
                labels.push(entry.label);
            }

            if (!years.includes(entry.year)) {
                years.push(entry.year);
            }
        });

        labels.forEach(label => {
            datasets[label] = {};
            years.forEach(year => {
                datasets[label][year] = 0;
            });
        });

        data.data.forEach(entry => {
            datasets[entry.label][entry.year] = entry.value;
        });

        years.sort();

        const colorPalette = generateColorPalette(years.length);
        const datasetsArray = years.map(year => {
            const dataValues = labels.map(label => datasets[label][year]);
            return {
                label: year,
                data: dataValues,
                backgroundColor: colorPalette[years.indexOf(year)],
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            };
        });

        const ctx = document.getElementById('chart').getContext('2d');
        if (myChart) {
            myChart.destroy();
        }
        // myChart = new Chart(ctx, {
        //     type: 'bar',
        //     data: {
        //         labels: labels,
        //         datasets: datasetsArray
        //     },
        //     options: {
        //         scales: {
        //             y: {
        //                 beginAtZero: true
        //             }
        //         }
        //     }
        // });

        // ---------- updated (10/4/2024 3:11pm)
        // ---------- updated (10/4/2024 4:08pm)
        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasetsArray
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: chartTitle,
                        font: {
                            family: 'Josefin Sans',
                            size: 18
                        }
                    },
                    legend: {
                        labels: {
                            font: {
                                family: 'Josefin Sans',
                                size: 14
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: {
                                family: 'Josefin Sans',
                                size: 12
                            }
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                family: 'Josefin Sans',
                                size: 12
                            }
                        }
                    }
                },
                onResize: function(chart, size) {
                    const width = size.width;
                    let labelSize;
        
                    if (width < 300) {
                        labelSize = 10;
                    } else if (width < 1000) {
                        labelSize = 12;
                    } else {
                        labelSize = 14;
                    }
        
                    chart.options.scales.x.ticks.font.size = labelSize;
                    chart.options.scales.y.ticks.font.size = labelSize;
                    chart.options.plugins.title.font.size = labelSize + 2;  // Increase title font size
        
                    chart.update();
                }
            }
        });
    })
    .catch(error => console.error('Error fetching data:', error));
    }

    else if(type==='Book'){
        console.log("hi");
        let sqlQuery = `
        SELECT `;
    
    if (book === '') {
        sqlQuery += `book.subject_area AS label, `;
    } else {
        sqlQuery += `book.title AS label, `;
    }
    
    if(compare==='year'){
        sqlQuery += `
            YEAR(copies.acquisition_date) AS year,`
    }else if(compare==='month'){
        sqlQuery += `
            MONTH(copies.acquisition_date) AS year,`
    }else if(compare==='date'){
        sqlQuery += `
            copies.acquisition_date AS year,`
    }
    

    sqlQuery+=`
            COUNT(*) AS value
        FROM 
            copies 
        JOIN 
            book ON copies.ISBN = book.ISBN WHERE`;

    if (book !== '') {
        sqlQuery += `
                book.subject_area = '${book}' AND`;
    }

    if(compare==='year'){
        sqlQuery += `
        copies.acquisition_date >= '${initialYearSelect}-01-01'
        AND copies.acquisition_date <= '${lastYearSelect}-12-31'`;
    }else if(compare==='month'){
        sqlQuery += `
        copies.acquisition_date >= '${initialYearSelect}-${initialMonthSelect}-01'
        AND copies.acquisition_date <= '${initialYearSelect}-${lastMonthSelect}-31'`;
    }else if(compare==='date'){
        sqlQuery += `
        copies.acquisition_date >= '${initialYearSelect}-${initialMonthSelect}-${initialDateSelect}'
        AND copies.acquisition_date <= '${initialYearSelect}-${initialMonthSelect}-${lastDateSelect}'`;
    }

    if (book === '') {
        sqlQuery += ` GROUP BY 
            book.subject_area`;
    } else {
        sqlQuery += ` GROUP BY 
            book.title`;
    }

    if(compare==='year'){
        sqlQuery+=`, YEAR(copies.acquisition_date)`
    }else if(compare==='month'){
        sqlQuery+=`, MONTH(copies.acquisition_date)`
    }

    fetch('http://localhost:3000/getChartData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sqlQuery }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.data);
        const labels = [];
        const years = [];
        const datasets = {};

        data.data.forEach(entry => {
            if (!labels.includes(entry.label)) {
                labels.push(entry.label);
            }

            if (!years.includes(entry.year)) {
                years.push(entry.year);
            }
        });

        labels.forEach(label => {
            datasets[label] = {};
            years.forEach(year => {
                datasets[label][year] = 0;
            });
        });

        data.data.forEach(entry => {
            datasets[entry.label][entry.year] = entry.value;
        });

        years.sort();

        const colorPalette = generateColorPalette(years.length);
        const datasetsArray = years.map(year => {
            const dataValues = labels.map(label => datasets[label][year]);
            return {
                label: year,
                data: dataValues,
                backgroundColor: colorPalette[years.indexOf(year)],
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            };
        });

        const ctx = document.getElementById('chart').getContext('2d');
        if (myChart) {
            myChart.destroy();
        }
        // myChart = new Chart(ctx, {
        //     type: 'bar',
        //     data: {
        //         labels: labels,
        //         datasets: datasetsArray
        //     },
        //     options: {
        //         scales: {
        //             y: {
        //                 beginAtZero: true
        //             }
        //         }
        //     }
        // });

        // ---------- updated (10/4/2024 4:11pm)
        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasetsArray
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: chartTitle,
                        font: {
                            family: 'Josefin Sans',
                            size: 18
                        }
                    },
                    legend: {
                        labels: {
                            font: {
                                family: 'Josefin Sans',
                                size: 14
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: {
                                family: 'Josefin Sans',
                                size: 12
                            }
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                family: 'Josefin Sans',
                                size: 12
                            }
                        }
                    }
                },
                onResize: function(chart, size) {
                    const width = size.width;
                    let labelSize;
        
                    if (width < 300) {
                        labelSize = 10;
                    } else if (width < 1000) {
                        labelSize = 12;
                    } else {
                        labelSize = 14;
                    }
        
                    chart.options.scales.x.ticks.font.size = labelSize;
                    chart.options.scales.y.ticks.font.size = labelSize;
                    chart.options.plugins.title.font.size = labelSize + 2;  // Increase title font size
        
                    chart.update();
                }
            }
        });
    })
    .catch(error => console.error('Error fetching data:', error));
    }
    // changeReportType('bar');
}


function showLineChart(type,book,compare){
    localStorage.setItem('chart','line')
    localStorage.setItem('type', type);
    localStorage.setItem('book', book);
    localStorage.setItem('compare',compare)

    if (myChart) {
        myChart.destroy(); 
    }

    // chartType = type;
    // chartBook = book;
    // chartCompare = chartCompare;

    const initialYearSelect = document.getElementById('initialYear').value;
    const initialMonthSelect = document.getElementById('initialMonth').value;
    const initialDateSelect = document.getElementById('initialDate').value;
    const lastYearSelect = document.getElementById('lastYear').value;
    const lastMonthSelect = document.getElementById('lastMonth').value;
    const lastDateSelect = document.getElementById('lastDate').value;

    // const bookText = book ? book : 'All';
    // if(compare=="year"){
    //     document.getElementById("title").textContent = `Line Chart of ${type} book for ${bookText} category from ${initialYearSelect} to ${lastYearSelect}`;
    // }else if(compare=="month"){
    //     document.getElementById("title").textContent = `Line Chart of ${type} book for ${bookText} category from ${initialYearSelect}.${initialMonthSelect} to ${initialYearSelect}.${lastMonthSelect}`;
    // }else if(compare=="date"){
    //     document.getElementById("title").textContent = `Line Chart of ${type} book for ${bookText} category from ${initialYearSelect}.${initialMonthSelect}.${initialDateSelect} to ${initialYearSelect}.${initialMonthSelect}.${lastDateSelect}`;
    // }

    let chartTitle;
    const bookText = book ? book : 'All';

    if (compare == "year") {
        document.getElementById('initialYear').style.display = 'flex';
        document.getElementById('initialMonth').style.display = 'none';
        document.getElementById('initialDate').style.display = 'none';
        document.getElementById('lastYear').style.display = 'flex';
        document.getElementById('lastMonth').style.display = 'none';
        document.getElementById('lastDate').style.display = 'none';

        document.getElementById('initialYearLabel').style.display = 'flex';
        document.getElementById('initialMonthLabel').style.display = 'none';
        document.getElementById('initialDateLabel').style.display = 'none';
        document.getElementById('lastYearLabel').style.display = 'flex';
        document.getElementById('lastMonthLabel').style.display = 'none';
        document.getElementById('lastDateLabel').style.display = 'none';

        chartTitle = `Line Chart of ${type} book for ${bookText} category from ${initialYearSelect} to ${lastYearSelect}`;
    } else if (compare == "month") {
        document.getElementById('initialYear').style.display = 'flex';
        document.getElementById('initialMonth').style.display = 'flex';
        document.getElementById('initialDate').style.display = 'none';
        document.getElementById('lastYear').style.display = 'none';
        document.getElementById('lastMonth').style.display = 'flex';
        document.getElementById('lastDate').style.display = 'none';

        document.getElementById('initialYearLabel').style.display = 'flex';
        document.getElementById('initialMonthLabel').style.display = 'flex';
        document.getElementById('initialDateLabel').style.display = 'none';
        document.getElementById('lastYearLabel').style.display = 'none';
        document.getElementById('lastMonthLabel').style.display = 'flex';
        document.getElementById('lastDateLabel').style.display = 'none';

        chartTitle = `Line Chart of ${type} book for ${bookText} category from ${initialYearSelect}.${initialMonthSelect} to ${initialYearSelect}.${lastMonthSelect}`;
    } else if (compare == "date") {
        document.getElementById('initialYear').style.display = 'flex';
        document.getElementById('initialMonth').style.display = 'flex';
        document.getElementById('initialDate').style.display = 'flex';
        document.getElementById('lastYear').style.display = 'none';
        document.getElementById('lastMonth').style.display = 'none';
        document.getElementById('lastDate').style.display = 'flex';

        document.getElementById('initialYearLabel').style.display = 'flex';
        document.getElementById('initialMonthLabel').style.display = 'flex';
        document.getElementById('initialDateLabel').style.display = 'flex';
        document.getElementById('lastYearLabel').style.display = 'none';
        document.getElementById('lastMonthLabel').style.display = 'none';
        document.getElementById('lastDateLabel').style.display = 'flex';
     
        chartTitle = `Line Chart of ${type} book for ${bookText} category from ${initialYearSelect}.${initialMonthSelect}.${initialDateSelect} to ${initialYearSelect}.${initialMonthSelect}.${lastDateSelect}`;
    }

    document.getElementById("title").textContent = chartTitle;

    const initialYear = parseInt(initialYearSelect);
    const initialMonth = parseInt(initialMonthSelect)
    const initialDate = parseInt(initialDateSelect)

    const lastYear = parseInt(lastYearSelect);
    const lastMonth =parseInt(lastMonthSelect)
    const lastDate = parseInt(lastDateSelect)


    if (type === 'Borrow') {
        console.log("hi");
        let sqlQuery = `
        SELECT `;
    
        if (compare === 'year') {
            sqlQuery += `
                YEAR(circulation.check_out_date) AS year,`
        } else if (compare === 'month') {
            sqlQuery += `
                MONTH(circulation.check_out_date) AS year,`
        } else if (compare === 'date') {
            sqlQuery += `
                DAY(circulation.check_out_date) AS year,`
        }
    
        sqlQuery += `
                COUNT(*) AS value
            FROM 
                circulation
            JOIN 
                copies ON circulation.accession_number = copies.accession_number
            JOIN 
                book ON copies.ISBN = book.ISBN
            WHERE`;
    
        if (book !== '') {
            sqlQuery += `
                    book.subject_area = '${book}' AND`;
        }
    
        if (compare === 'year') {
            sqlQuery += `
            circulation.check_out_date >= '${initialYearSelect}-01-01'
            AND circulation.check_out_date <= '${lastYearSelect}-12-31'`;
        } else if (compare === 'month') {
            sqlQuery += `
            circulation.check_out_date >= '${initialYearSelect}-${initialMonthSelect}-01'
            AND circulation.check_out_date <= '${initialYearSelect}-${lastMonthSelect}-31'`;
        } else if (compare === 'date') {
            sqlQuery += `
            circulation.check_out_date >= '${initialYearSelect}-${initialMonthSelect}-${initialDateSelect}'
            AND circulation.check_out_date <= '${initialYearSelect}-${initialMonthSelect}-${lastDateSelect}'`;
        }
    
        if (compare === 'year') {
            sqlQuery += `GROUP BY YEAR(circulation.check_out_date)`
        } else if (compare === 'month') {
            sqlQuery += `GROUP BY MONTH(circulation.check_out_date)`
        }
    
        console.log(sqlQuery);
        fetch('http://localhost:3000/getChartData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sqlQuery }),
        })
        .then(response => response.json())
        .then(data => {
            const labels = [];
            const years = [];
            const datasets = {};
            populateResultIntoTable(data.data,compare,"line");
    
            if(compare==='month'){
                for (let i = initialMonth; i <= lastMonth; i++) {
                years.push(i);
            }
            }else if(compare==='year'){
                for (let i = initialYear; i <= lastYear; i++) {
                years.push(i);
            }
            }
            else if(compare==='date'){
                for (let i = initialDate; i <= lastDate; i++) {
                years.push(i);
            }
            }
            

            data.data.forEach(entry => {
                if (!labels.includes(entry.label)) {
                    labels.push(entry.label);
                }
            });

            labels.forEach(label => {
                datasets[label] = {};
                years.forEach(year => {
                    datasets[label][year] = 0;
                });
            });

            data.data.forEach(entry => {
                datasets[entry.label][entry.year] = entry.value;
            });

            const colorPalette = generateColorPalette(years.length);
            const datasetsArray = labels.map(label => {
                const dataValues = years.map(year => datasets[label][year]);
                return {
                    label: "Line Chart",
                    data: dataValues,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: colorPalette[labels.indexOf(label)],
                    borderWidth: 2,
                    fill: false
                };
            });

            const ctx = document.getElementById('chart').getContext('2d');
            if (myChart) {
                myChart.destroy();
            }
            // myChart = new Chart(ctx, {
            //     type: 'line',
            //     data: {
            //         labels: years.map(String),
            //         datasets: datasetsArray
            //     },
            //     options: {
            //         scales: {
            //             y: {
            //                 beginAtZero: true
            //             }
            //         }
            //     }
            // });

            // ---------- updated (10/4/2024 4:17pm)
            myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: years.map(String),
                    datasets: datasetsArray
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: chartTitle,
                            font: {
                                family: 'Josefin Sans',
                                size: 18
                            }
                        },
                        legend: {
                            labels: {
                                font: {
                                    family: 'Josefin Sans',
                                    size: 14
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                font: {
                                    family: 'Josefin Sans',
                                    size: 12
                                }
                            }
                        },
                        x: {
                            ticks: {
                                font: {
                                    family: 'Josefin Sans',
                                    size: 12
                                }
                            }
                        }
                    },
                    onResize: function(chart, size) {
                        const width = size.width;
                        let labelSize;
            
                        if (width < 500) {
                            labelSize = 10;
                        } else if (width < 1000) {
                            labelSize = 12;
                        } else {
                            labelSize = 14;
                        }
            
                        chart.options.scales.x.ticks.font.size = labelSize;
                        chart.options.scales.y.ticks.font.size = labelSize;
                        chart.options.plugins.title.font.size = labelSize + 4;  // Increase title font size
            
                        chart.update();
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));
    }

    if (type === 'Return') {
        console.log("hi");
        let sqlQuery = `
        SELECT `;
    
        if (compare === 'year') {
            sqlQuery += `
                YEAR(circulation.returned_date) AS year,`
        } else if (compare === 'month') {
            sqlQuery += `
                MONTH(circulation.returned_date) AS year,`
        } else if (compare === 'date') {
            sqlQuery += `
                DAY(circulation.returned_date) AS year,`
        }
    
        sqlQuery += `
                COUNT(*) AS value
            FROM 
                circulation
            JOIN 
                copies ON circulation.accession_number = copies.accession_number
            JOIN 
                book ON copies.ISBN = book.ISBN
            WHERE`;
    
        if (book !== '') {
            sqlQuery += `
                    book.subject_area = '${book}' AND`;
        }
    
        if (compare === 'year') {
            sqlQuery += `
            circulation.returned_date >= '${initialYearSelect}-01-01'
            AND circulation.returned_date <= '${lastYearSelect}-12-31'`;
        } else if (compare === 'month') {
            sqlQuery += `
            circulation.returned_date >= '${initialYearSelect}-${initialMonthSelect}-01'
            AND circulation.returned_date <= '${initialYearSelect}-${lastMonthSelect}-31'`;
        } else if (compare === 'date') {
            sqlQuery += `
            circulation.returned_date >= '${initialYearSelect}-${initialMonthSelect}-${initialDateSelect}'
            AND circulation.returned_date <= '${initialYearSelect}-${initialMonthSelect}-${lastDateSelect}'`;
        }
    
        if (compare === 'year') {
            sqlQuery += `GROUP BY YEAR(circulation.returned_date)`
        } else if (compare === 'month') {
            sqlQuery += `GROUP BY MONTH(circulation.returned_date)`
        }
    
        console.log(sqlQuery);
        fetch('http://localhost:3000/getChartData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sqlQuery }),
        })
        .then(response => response.json())
        .then(data => {
            const labels = [];
            const years = [];
            const datasets = {};
    
            if(compare==='month'){
                for (let i = initialMonth; i <= lastMonth; i++) {
                years.push(i);
            }
            }else if(compare==='year'){
                for (let i = initialYear; i <= lastYear; i++) {
                years.push(i);
            }
            }
            else if(compare==='date'){
                for (let i = initialDate; i <= lastDate; i++) {
                years.push(i);
            }
            }
            

            data.data.forEach(entry => {
                if (!labels.includes(entry.label)) {
                    labels.push(entry.label);
                }
            });

            labels.forEach(label => {
                datasets[label] = {};
                years.forEach(year => {
                    datasets[label][year] = 0;
                });
            });

            data.data.forEach(entry => {
                datasets[entry.label][entry.year] = entry.value;
            });

            const colorPalette = generateColorPalette(years.length);
            const datasetsArray = labels.map(label => {
                const dataValues = years.map(year => datasets[label][year]);
                return {
                    label: label,
                    data: dataValues,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: colorPalette[labels.indexOf(label)],
                    borderWidth: 2,
                    fill: false
                };
            });

            const ctx = document.getElementById('chart').getContext('2d');
            if (myChart) {
                myChart.destroy();
            }
            // myChart = new Chart(ctx, {
            //     type: 'line',
            //     data: {
            //         labels: years.map(String),
            //         datasets: datasetsArray
            //     },
            //     options: {
            //         scales: {
            //             y: {
            //                 beginAtZero: true
            //             }
            //         }
            //     }
            // });

            // ---------- updated (10/4/2024 6:59pm)
            myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: years.map(String),
                    datasets: datasetsArray
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: chartTitle,
                            font: {
                                family: 'Josefin Sans',
                                size: 18
                            }
                        },
                        legend: {
                            labels: {
                                font: {
                                    family: 'Josefin Sans',
                                    size: 14
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                font: {
                                    family: 'Josefin Sans',
                                    size: 12
                                }
                            }
                        },
                        x: {
                            ticks: {
                                font: {
                                    family: 'Josefin Sans',
                                    size: 12
                                }
                            }
                        }
                    },
                    onResize: function(chart, size) {
                        const width = size.width;
                        let labelSize;
            
                        if (width < 500) {
                            labelSize = 10;
                        } else if (width < 1000) {
                            labelSize = 12;
                        } else {
                            labelSize = 14;
                        }
            
                        chart.options.scales.x.ticks.font.size = labelSize;
                        chart.options.scales.y.ticks.font.size = labelSize;
                        chart.options.plugins.title.font.size = labelSize + 4;  // Increase title font size
            
                        chart.update();
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));
    }

    if (type === 'Overdue') {
        console.log("hi");
        let sqlQuery = `
        SELECT `;
    
        if (compare === 'year') {
            sqlQuery += `
                YEAR(circulation.due_date) AS year,`
        } else if (compare === 'month') {
            sqlQuery += `
                MONTH(circulation.due_date) AS year,`
        } else if (compare === 'date') {
            sqlQuery += `
                DAY(circulation.due_date) AS year,`
        }
    
        sqlQuery += `
                COUNT(*) AS value
            FROM 
                circulation
            JOIN 
                copies ON circulation.accession_number = copies.accession_number
            JOIN 
                book ON copies.ISBN = book.ISBN
            WHERE`;
    
        if (book !== '') {
            sqlQuery += `
                    book.subject_area = '${book}' AND`;
        }
    
        if (compare === 'year') {
            sqlQuery += `
            circulation.due_date >= '${initialYearSelect}-01-01'
            AND circulation.due_date <= '${lastYearSelect}-12-31'`;
        } else if (compare === 'month') {
            sqlQuery += `
            circulation.due_date >= '${initialYearSelect}-${initialMonthSelect}-01'
            AND circulation.due_date <= '${initialYearSelect}-${lastMonthSelect}-31'`;
        } else if (compare === 'date') {
            sqlQuery += `
            circulation.due_date >= '${initialYearSelect}-${initialMonthSelect}-${initialDateSelect}'
            AND circulation.due_date <= '${initialYearSelect}-${initialMonthSelect}-${lastDateSelect}'`;
        }
    
        if (compare === 'year') {
            sqlQuery += `GROUP BY YEAR(circulation.due_date)`
        } else if (compare === 'month') {
            sqlQuery += `GROUP BY MONTH(circulation.due_date)`
        }
    
        console.log(sqlQuery);
        fetch('http://localhost:3000/getChartData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sqlQuery }),
        })
        .then(response => response.json())
        .then(data => {
            const labels = [];
            const years = [];
            const datasets = {};
    
            if(compare==='month'){
                for (let i = initialMonth; i <= lastMonth; i++) {
                years.push(i);
            }
            }else if(compare==='year'){
                for (let i = initialYear; i <= lastYear; i++) {
                years.push(i);
            }
            }
            else if(compare==='date'){
                for (let i = initialDate; i <= lastDate; i++) {
                years.push(i);
            }
            }
            

            data.data.forEach(entry => {
                if (!labels.includes(entry.label)) {
                    labels.push(entry.label);
                }
            });

            labels.forEach(label => {
                datasets[label] = {};
                years.forEach(year => {
                    datasets[label][year] = 0;
                });
            });

            data.data.forEach(entry => {
                datasets[entry.label][entry.year] = entry.value;
            });

            const colorPalette = generateColorPalette(years.length);
            const datasetsArray = labels.map(label => {
                const dataValues = years.map(year => datasets[label][year]);
                return {
                    label: label,
                    data: dataValues,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: colorPalette[labels.indexOf(label)],
                    borderWidth: 2,
                    fill: false
                };
            });

            const ctx = document.getElementById('chart').getContext('2d');
            if (myChart) {
                myChart.destroy();
            }
            // myChart = new Chart(ctx, {
            //     type: 'line',
            //     data: {
            //         labels: years.map(String),
            //         datasets: datasetsArray
            //     },
            //     options: {
            //         scales: {
            //             y: {
            //                 beginAtZero: true
            //             }
            //         }
            //     }
            // });

            // ---------- updated (10/4/2024 7:04pm)
            myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: years.map(String),
                    datasets: datasetsArray
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: chartTitle,
                            font: {
                                family: 'Josefin Sans',
                                size: 18
                            }
                        },
                        legend: {
                            labels: {
                                font: {
                                    family: 'Josefin Sans',
                                    size: 14
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                font: {
                                    family: 'Josefin Sans',
                                    size: 12
                                }
                            }
                        },
                        x: {
                            ticks: {
                                font: {
                                    family: 'Josefin Sans',
                                    size: 12
                                }
                            }
                        }
                    },
                    onResize: function(chart, size) {
                        const width = size.width;
                        let labelSize;
            
                        if (width < 500) {
                            labelSize = 10;
                        } else if (width < 1000) {
                            labelSize = 12;
                        } else {
                            labelSize = 14;
                        }
            
                        chart.options.scales.x.ticks.font.size = labelSize;
                        chart.options.scales.y.ticks.font.size = labelSize;
                        chart.options.plugins.title.font.size = labelSize + 4;  // Increase title font size
            
                        chart.update();
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));
    }

    if (type === 'Reserve') {
        console.log("hi");
        let sqlQuery = `
        SELECT `;
    
        if (compare === 'year') {
            sqlQuery += `
                YEAR(reservation.reserve_date) AS year,`
        } else if (compare === 'month') {
            sqlQuery += `
                MONTH(reservation.reserve_date) AS year,`
        } else if (compare === 'date') {
            sqlQuery += `
                DAY(reservation.reserve_date) AS year,`
        }
    
        sqlQuery += `
            COUNT(*) AS value
        FROM 
            reservation
        JOIN 
            copies ON reservation.accession_number = copies.accession_number
        JOIN 
            book ON copies.ISBN = book.ISBN
        WHERE
            reservation.reserve_status='Confirmed' AND`;
    
        if (book !== '') {
            sqlQuery += `
                    book.subject_area = '${book}' AND`;
        }
    
        if (compare === 'year') {
            sqlQuery += `
            reservation.reserve_date >= '${initialYearSelect}-01-01'
            AND reservation.reserve_date <= '${lastYearSelect}-12-31'`;
        } else if (compare === 'month') {
            sqlQuery += `
            reservation.reserve_date >= '${initialYearSelect}-${initialMonthSelect}-01'
            AND reservation.reserve_date <= '${initialYearSelect}-${lastMonthSelect}-31'`;
        } else if (compare === 'date') {
            sqlQuery += `
            reservation.reserve_date >= '${initialYearSelect}-${initialMonthSelect}-${initialDateSelect}'
            AND reservation.reserve_date <= '${initialYearSelect}-${initialMonthSelect}-${lastDateSelect}'`;
        }
    
        if (compare === 'year') {
            sqlQuery += `GROUP BY YEAR(reservation.reserve_date)`
        } else if (compare === 'month') {
            sqlQuery += `GROUP BY MONTH(reservation.reserve_date)`
        }
    
        console.log(sqlQuery);
        fetch('http://localhost:3000/getChartData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sqlQuery }),
        })
        .then(response => response.json())
        .then(data => {
            const labels = [];
            const years = [];
            const datasets = {};
    
            if(compare==='month'){
                for (let i = initialMonth; i <= lastMonth; i++) {
                years.push(i);
            }
            }else if(compare==='year'){
                for (let i = initialYear; i <= lastYear; i++) {
                years.push(i);
            }
            }
            else if(compare==='date'){
                for (let i = initialDate; i <= lastDate; i++) {
                years.push(i);
            }
            }
            

            data.data.forEach(entry => {
                if (!labels.includes(entry.label)) {
                    labels.push(entry.label);
                }
            });

            labels.forEach(label => {
                datasets[label] = {};
                years.forEach(year => {
                    datasets[label][year] = 0;
                });
            });

            data.data.forEach(entry => {
                datasets[entry.label][entry.year] = entry.value;
            });

            const colorPalette = generateColorPalette(years.length);
            const datasetsArray = labels.map(label => {
                const dataValues = years.map(year => datasets[label][year]);
                return {
                    label: label,
                    data: dataValues,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: colorPalette[labels.indexOf(label)],
                    borderWidth: 2,
                    fill: false
                };
            });

            const ctx = document.getElementById('chart').getContext('2d');
            if (myChart) {
                myChart.destroy();
            }
            // myChart = new Chart(ctx, {
            //     type: 'line',
            //     data: {
            //         labels: years.map(String),
            //         datasets: datasetsArray
            //     },
            //     options: {
            //         scales: {
            //             y: {
            //                 beginAtZero: true
            //             }
            //         }
            //     }
            // });

            // ---------- updated (10/4/2024 7:04pm)
            myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: years.map(String),
                    datasets: datasetsArray
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: chartTitle,
                            font: {
                                family: 'Josefin Sans',
                                size: 18
                            }
                        },
                        legend: {
                            labels: {
                                font: {
                                    family: 'Josefin Sans',
                                    size: 14
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                font: {
                                    family: 'Josefin Sans',
                                    size: 12
                                }
                            }
                        },
                        x: {
                            ticks: {
                                font: {
                                    family: 'Josefin Sans',
                                    size: 12
                                }
                            }
                        }
                    },
                    onResize: function(chart, size) {
                        const width = size.width;
                        let labelSize;
            
                        if (width < 500) {
                            labelSize = 10;
                        } else if (width < 1000) {
                            labelSize = 12;
                        } else {
                            labelSize = 14;
                        }
            
                        chart.options.scales.x.ticks.font.size = labelSize;
                        chart.options.scales.y.ticks.font.size = labelSize;
                        chart.options.plugins.title.font.size = labelSize + 4;  // Increase title font size
            
                        chart.update();
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));
    }

    if (type === 'Patrons') {
        console.log("hi");
        let sqlQuery = `
        SELECT `;
    
        if (compare === 'year') {
            sqlQuery += `
                YEAR(users.sign_up_date) AS year,`
        } else if (compare === 'month') {
            sqlQuery += `
                MONTH(users.sign_up_date) AS year,`
        } else if (compare === 'date') {
            sqlQuery += `
                DAY(users.sign_up_date) AS year,`
        }
    
        sqlQuery += `
                COUNT(*) AS value
            FROM 
                users WHERE`;
    
        if (book !== '') {
            sqlQuery += `
            users.department = '${book}' AND`;
        }
    
        if (compare === 'year') {
            sqlQuery += `
            users.sign_up_date >= '${initialYearSelect}-01-01'
            AND users.sign_up_date <= '${lastYearSelect}-12-31'`;
        } else if (compare === 'month') {
            sqlQuery += `
            users.sign_up_date >= '${initialYearSelect}-${initialMonthSelect}-01'
            AND users.sign_up_date <= '${initialYearSelect}-${lastMonthSelect}-31'`;
        } else if (compare === 'date') {
            sqlQuery += `
            users.sign_up_date >= '${initialYearSelect}-${initialMonthSelect}-${initialDateSelect}'
            AND users.sign_up_date <= '${initialYearSelect}-${initialMonthSelect}-${lastDateSelect}'`;
        }
    
        if (compare === 'year') {
            sqlQuery += `GROUP BY YEAR(users.sign_up_date)`
        } else if (compare === 'month') {
            sqlQuery += `GROUP BY MONTH(users.sign_up_date)`
        }
    
        console.log(sqlQuery);
        fetch('http://localhost:3000/getChartData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sqlQuery }),
        })
        .then(response => response.json())
        .then(data => {
            const labels = [];
            const years = [];
            const datasets = {};
    
            if(compare==='month'){
                for (let i = initialMonth; i <= lastMonth; i++) {
                years.push(i);
            }
            }else if(compare==='year'){
                for (let i = initialYear; i <= lastYear; i++) {
                years.push(i);
            }
            }
            else if(compare==='date'){
                for (let i = initialDate; i <= lastDate; i++) {
                years.push(i);
            }
            }
            

            data.data.forEach(entry => {
                if (!labels.includes(entry.label)) {
                    labels.push(entry.label);
                }
            });

            labels.forEach(label => {
                datasets[label] = {};
                years.forEach(year => {
                    datasets[label][year] = 0;
                });
            });

            data.data.forEach(entry => {
                datasets[entry.label][entry.year] = entry.value;
            });

            const colorPalette = generateColorPalette(years.length);
            const datasetsArray = labels.map(label => {
                const dataValues = years.map(year => datasets[label][year]);
                return {
                    label: label,
                    data: dataValues,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: colorPalette[labels.indexOf(label)],
                    borderWidth: 2,
                    fill: false
                };
            });

            const ctx = document.getElementById('chart').getContext('2d');
            if (myChart) {
                myChart.destroy();
            }
            // myChart = new Chart(ctx, {
            //     type: 'line',
            //     data: {
            //         labels: years.map(String),
            //         datasets: datasetsArray
            //     },
            //     options: {
            //         scales: {
            //             y: {
            //                 beginAtZero: true
            //             }
            //         }
            //     }
            // });

            // ---------- updated (10/4/2024 7:05pm)
            myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: years.map(String),
                    datasets: datasetsArray
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: chartTitle,
                            font: {
                                family: 'Josefin Sans',
                                size: 18
                            }
                        },
                        legend: {
                            labels: {
                                font: {
                                    family: 'Josefin Sans',
                                    size: 14
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                font: {
                                    family: 'Josefin Sans',
                                    size: 12
                                }
                            }
                        },
                        x: {
                            ticks: {
                                font: {
                                    family: 'Josefin Sans',
                                    size: 12
                                }
                            }
                        }
                    },
                    onResize: function(chart, size) {
                        const width = size.width;
                        let labelSize;
            
                        if (width < 500) {
                            labelSize = 10;
                        } else if (width < 1000) {
                            labelSize = 12;
                        } else {
                            labelSize = 14;
                        }
            
                        chart.options.scales.x.ticks.font.size = labelSize;
                        chart.options.scales.y.ticks.font.size = labelSize;
                        chart.options.plugins.title.font.size = labelSize + 4;  // Increase title font size
            
                        chart.update();
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));
    }


    if (type === 'Book') {
        console.log("hi");
        let sqlQuery = `
        SELECT `;
    
        if (compare === 'year') {
            sqlQuery += `
                YEAR(copies.acquisition_date) AS year,`
        } else if (compare === 'month') {
            sqlQuery += `
                MONTH(copies.acquisition_date) AS year,`
        } else if (compare === 'date') {
            sqlQuery += `
                DAY(copies.acquisition_date) AS year,`
        }
    
        sqlQuery += `
                COUNT(*) AS value
            FROM 
                copies 
            JOIN 
                book ON copies.ISBN = book.ISBN WHERE`;
    
        if (book !== '') {
            sqlQuery += `
                    book.subject_area = '${book}' AND`;
        }
    
        if (compare === 'year') {
            sqlQuery += `
            copies.acquisition_date >= '${initialYearSelect}-01-01'
            AND copies.acquisition_date <= '${lastYearSelect}-12-31'`;
        } else if (compare === 'month') {
            sqlQuery += `
            copies.acquisition_date >= '${initialYearSelect}-${initialMonthSelect}-01'
            AND copies.acquisition_date <= '${initialYearSelect}-${lastMonthSelect}-31'`;
        } else if (compare === 'date') {
            sqlQuery += `
            copies.acquisition_date >= '${initialYearSelect}-${initialMonthSelect}-${initialDateSelect}'
            AND copies.acquisition_date <= '${initialYearSelect}-${initialMonthSelect}-${lastDateSelect}'`;
        }
    
        if (compare === 'year') {
            sqlQuery += `GROUP BY YEAR(copies.acquisition_date)`
        } else if (compare === 'month') {
            sqlQuery += `GROUP BY MONTH(copies.acquisition_date)`
        }
    
        console.log(sqlQuery);
        fetch('http://localhost:3000/getChartData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sqlQuery }),
        })
        .then(response => response.json())
        .then(data => {
            const labels = [];
            const years = [];
            const datasets = {};
    
            if(compare==='month'){
                for (let i = initialMonth; i <= lastMonth; i++) {
                years.push(i);
            }
            }else if(compare==='year'){
                for (let i = initialYear; i <= lastYear; i++) {
                years.push(i);
            }
            }
            else if(compare==='date'){
                for (let i = initialDate; i <= lastDate; i++) {
                years.push(i);
            }
            }
            

            data.data.forEach(entry => {
                if (!labels.includes(entry.label)) {
                    labels.push(entry.label);
                }
            });

            labels.forEach(label => {
                datasets[label] = {};
                years.forEach(year => {
                    datasets[label][year] = 0;
                });
            });

            data.data.forEach(entry => {
                datasets[entry.label][entry.year] = entry.value;
            });

            const colorPalette = generateColorPalette(years.length);
            const datasetsArray = labels.map(label => {
                const dataValues = years.map(year => datasets[label][year]);
                return {
                    label: label,
                    data: dataValues,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: colorPalette[labels.indexOf(label)],
                    borderWidth: 2,
                    fill: false
                };
            });

            const ctx = document.getElementById('chart').getContext('2d');
            if (myChart) {
                myChart.destroy();
            }
            // myChart = new Chart(ctx, {
            //     type: 'line',
            //     data: {
            //         labels: years.map(String),
            //         datasets: datasetsArray
            //     },
            //     options: {
            //         scales: {
            //             y: {
            //                 beginAtZero: true
            //             }
            //         }
            //     }
            // });

            // ---------- updated (10/4/2024 7:05pm)
            myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: years.map(String),
                    datasets: datasetsArray
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: chartTitle,
                            font: {
                                family: 'Josefin Sans',
                                size: 18
                            }
                        },
                        legend: {
                            labels: {
                                font: {
                                    family: 'Josefin Sans',
                                    size: 14
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                font: {
                                    family: 'Josefin Sans',
                                    size: 12
                                }
                            }
                        },
                        x: {
                            ticks: {
                                font: {
                                    family: 'Josefin Sans',
                                    size: 12
                                }
                            }
                        }
                    },
                    onResize: function(chart, size) {
                        const width = size.width;
                        let labelSize;
            
                        if (width < 500) {
                            labelSize = 10;
                        } else if (width < 1000) {
                            labelSize = 12;
                        } else {
                            labelSize = 14;
                        }
            
                        chart.options.scales.x.ticks.font.size = labelSize;
                        chart.options.scales.y.ticks.font.size = labelSize;
                        chart.options.plugins.title.font.size = labelSize + 4;  // Increase title font size
            
                        chart.update();
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));
    }
    // changeReportType('line');
    
}

// ---------- SHOW PIE CHART start
function showPieChart(type,book){
    localStorage.setItem('chart','pie')
    localStorage.setItem('type', type);
    localStorage.setItem('book', book);

    if (myChart) {
        myChart.destroy(); 
    }
    document.getElementById('initialYear').style.display = 'flex';
    document.getElementById('initialMonth').style.display = 'flex';
    document.getElementById('initialDate').style.display = 'flex';
    document.getElementById('lastYear').style.display = 'flex';
    document.getElementById('lastMonth').style.display = 'flex';
    document.getElementById('lastDate').style.display = 'flex';

    document.getElementById('initialYearLabel').style.display = 'flex';
    document.getElementById('initialMonthLabel').style.display = 'flex';
    document.getElementById('initialDateLabel').style.display = 'flex';
    document.getElementById('lastYearLabel').style.display = 'flex';
    document.getElementById('lastMonthLabel').style.display = 'flex';
    document.getElementById('lastDateLabel').style.display = 'flex';


    const initialYearSelect = document.getElementById('initialYear').value;
    const initialMonthSelect = document.getElementById('initialMonth').value;
    const initialDateSelect = document.getElementById('initialDate').value;
    const lastYearSelect = document.getElementById('lastYear').value;
    const lastMonthSelect = document.getElementById('lastMonth').value;
    const lastDateSelect = document.getElementById('lastDate').value;

    const bookText = book ? book : 'All';
    document.getElementById("title").textContent = `Pie Chart of ${type} book for ${bookText} category from ${initialYearSelect}.${initialMonthSelect}.${initialDateSelect} to ${lastYearSelect}.${lastMonthSelect}.${lastDateSelect}`;
  
    if(type==='Borrow'){
        let sqlQuery = `
        SELECT `;
        if(book===''){
            sqlQuery+=`book.subject_area AS label, `
        }else{
            sqlQuery+=`book.title AS label, `
        }
           sqlQuery+=` 
            COUNT(*) AS value
        FROM 
            circulation
        JOIN 
            copies ON circulation.accession_number = copies.accession_number
        JOIN 
            book ON copies.ISBN = book.ISBN WHERE`;

    if (book !== '') {
        sqlQuery += `
                book.subject_area = '${book}' AND`;
    }

    sqlQuery += `
                circulation.check_out_date >= '${initialYearSelect}-${initialMonthSelect}-${initialDateSelect}'
                AND circulation.check_out_date <= '${lastYearSelect}-${lastMonthSelect}-${lastDateSelect}'`;
    if(book ===''){
        sqlQuery+=` GROUP BY 
            book.subject_area`;
    }else{
        sqlQuery+=` GROUP BY 
            book.title`;
    }
       
    fetch('http://localhost:3000/getChartData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sqlQuery }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.data);
        populateResultIntoTable(data.data, "","pie")
        const labels = data.data.map(entry => entry.label);
        const values = data.data.map(entry => entry.value);

        const ctx = document.getElementById('chart').getContext('2d');
        myChart = new Chart(ctx, {
            type: 'pie', 
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: [
                        '#ED6161',
                        '#7ABCDC',
                        '#C9D9AF',
                        '#FFD058',
                        '#FFA800'
                    ],
                }],
            },
        });       
    })
    .catch(error => console.error('Error fetching data:', error));
    }
    
    else if(type==='Return'){
        let sqlQuery = `
        SELECT `;
        if(book===''){
            sqlQuery+=`book.subject_area AS label, `
        }else{
            sqlQuery+=`book.title AS label, `
        }
           sqlQuery+=` 
            COUNT(*) AS value
        FROM 
            circulation
        JOIN 
            copies ON circulation.accession_number = copies.accession_number
        JOIN 
            book ON copies.ISBN = book.ISBN WHERE`;

    if (book !== '') {
        sqlQuery += `
                book.subject_area = '${book}' AND`;
    }

    sqlQuery += `
                circulation.returned_date >= '${initialYearSelect}-${initialMonthSelect}-${initialDateSelect}'
                AND circulation.returned_date <= '${lastYearSelect}-${lastMonthSelect}-${lastDateSelect}'`;
    if(book ===''){
        sqlQuery+=` GROUP BY 
            book.subject_area`;
    }else{
        sqlQuery+=` GROUP BY 
            book.title`;
    }
       
    fetch('http://localhost:3000/getChartData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sqlQuery }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.data);
        const labels = data.data.map(entry => entry.label);
        const values = data.data.map(entry => entry.value);

        const ctx = document.getElementById('chart').getContext('2d');
        myChart = new Chart(ctx, {
            type: 'pie', 
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: [
                        'red',
                        'blue',
                        'green'
                    ],
                }],
            },
        });
    })
    .catch(error => console.error('Error fetching data:', error));
    }

    else if(type==='Overdue'){
        let sqlQuery = `
        SELECT `;
        if(book===''){
            sqlQuery+=`book.subject_area AS label, `
        }else{
            sqlQuery+=`book.title AS label, `
        }
           sqlQuery+=` 
            COUNT(*) AS value
        FROM 
            circulation
        JOIN 
            copies ON circulation.accession_number = copies.accession_number
        JOIN 
            book ON copies.ISBN = book.ISBN WHERE`;

    if (book !== '') {
        sqlQuery += `
                book.subject_area = '${book}' AND`;
    }

    sqlQuery += `
                circulation.borrow_status = 'Overdue'
                AND circulation.due_date >= '${initialYearSelect}-${initialMonthSelect}-${initialDateSelect}'
                AND circulation.due_date <= '${lastYearSelect}-${lastMonthSelect}-${lastDateSelect}'`;
    if(book ===''){
        sqlQuery+=` GROUP BY 
            book.subject_area`;
    }else{
        sqlQuery+=` GROUP BY 
            book.title`;
    }
       
    fetch('http://localhost:3000/getChartData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sqlQuery }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.data);
        const labels = data.data.map(entry => entry.label);
        const values = data.data.map(entry => entry.value);

        const ctx = document.getElementById('chart').getContext('2d');
        myChart = new Chart(ctx, {
            type: 'pie', 
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: [
                        'red',
                        'blue',
                        'green'
                    ],
                }],
            },
        });
    })
    .catch(error => console.error('Error fetching data:', error));
    }

    else if(type==='Reserve'){
        let sqlQuery = `
        SELECT `;
        if(book===''){
            sqlQuery+=`book.subject_area AS label, `
        }else{
            sqlQuery+=`book.title AS label, `
        }
           sqlQuery+=` 
            COUNT(*) AS value
        FROM 
            reservation
        JOIN 
            copies ON reservation.accession_number = copies.accession_number
        JOIN 
            book ON copies.ISBN = book.ISBN WHERE`;

    if (book !== '') {
        sqlQuery += `
                book.subject_area = '${book}' AND`;
    }

    sqlQuery += `
                reservation.reserve_status = 'Confirmed'
                AND reservation.reserve_date >= '${initialYearSelect}-${initialMonthSelect}-${initialDateSelect}'
                AND reservation.reserve_date <= '${lastYearSelect}-${lastMonthSelect}-${lastDateSelect}'`;
    if(book ===''){
        sqlQuery+=` GROUP BY 
            book.subject_area`;
    }else{
        sqlQuery+=` GROUP BY 
            book.title`;
    }
       
    fetch('http://localhost:3000/getChartData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sqlQuery }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.data);
        const labels = data.data.map(entry => entry.label);
        const values = data.data.map(entry => entry.value);

        const ctx = document.getElementById('chart').getContext('2d');
        myChart = new Chart(ctx, {
            type: 'pie', 
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: [
                        'red',
                        'blue',
                        'green'
                    ],
                }],
            },
        });
    })
    .catch(error => console.error('Error fetching data:', error));
    }

    else if(type==='Patrons'){
        let sqlQuery = `
        SELECT `;
        if(book===''){
            sqlQuery+=`users.department AS label, `
        }else{
            sqlQuery+=`CASE 
            WHEN users.user_role = 'U' THEN 'Lecturer'
            ELSE 'Student'
        END AS label, `
        }
           sqlQuery+=` 
            COUNT(*) AS value
        FROM 
            users WHERE`

    if (book !== '') {
        sqlQuery += `
                users.department = '${book}' AND`;
    }

    sqlQuery += `
                users.sign_up_date >= '${initialYearSelect}-${initialMonthSelect}-${initialDateSelect}'
                AND users.sign_up_date <= '${lastYearSelect}-${lastMonthSelect}-${lastDateSelect}'`;
    if(book ===''){
        sqlQuery+=` GROUP BY 
        users.department`;
    }else{
        sqlQuery+=` GROUP BY 
        users.user_role`;
    }
       
    fetch('http://localhost:3000/getChartData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sqlQuery }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.data);
        const labels = data.data.map(entry => entry.label);
        const values = data.data.map(entry => entry.value);

        const ctx = document.getElementById('chart').getContext('2d');
        myChart = new Chart(ctx, {
            type: 'pie', 
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: [
                        'red',
                        'blue',
                        'green'
                    ],
                }],
            },
        });
    })
    .catch(error => console.error('Error fetching data:', error));
    }

    else if(type==='Patrons'){
        let sqlQuery = `
        SELECT `;
        if(book===''){
            sqlQuery+=`users.department AS label, `
        }else{
            sqlQuery+=`CASE 
            WHEN users.user_role = 'U' THEN 'Lecturer'
            ELSE 'Student'
        END AS label, `
        }
           sqlQuery+=` 
            COUNT(*) AS value
        FROM 
            users WHERE`

    if (book !== '') {
        sqlQuery += `
                users.department = '${book}' AND`;
    }

    sqlQuery += `
                users.sign_up_date >= '${initialYearSelect}-${initialMonthSelect}-${initialDateSelect}'
                AND users.sign_up_date <= '${lastYearSelect}-${lastMonthSelect}-${lastDateSelect}'`;
    if(book ===''){
        sqlQuery+=` GROUP BY 
        users.department`;
    }else{
        sqlQuery+=` GROUP BY 
        users.user_role`;
    }
       
    fetch('http://localhost:3000/getChartData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sqlQuery }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.data);
        const labels = data.data.map(entry => entry.label);
        const values = data.data.map(entry => entry.value);

        const ctx = document.getElementById('chart').getContext('2d');
        myChart = new Chart(ctx, {
            type: 'pie', 
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: [
                        'red',
                        'blue',
                        'green'
                    ],
                }],
            },
        });
    })
    .catch(error => console.error('Error fetching data:', error));
    }

    else if(type==='Book'){
        let sqlQuery = `
        SELECT `;
        if(book===''){
            sqlQuery+=`book.subject_area AS label, `
        }else{
            sqlQuery+=`book.title AS label, `
        }
           sqlQuery+=` 
            COUNT(*) AS value
        FROM 
            copies 
        JOIN 
            book ON copies.ISBN = book.ISBN WHERE`;

    if (book !== '') {
        sqlQuery += `
                book.subject_area = '${book}' AND`;
    }

    sqlQuery += `
                copies.acquisition_date >= '${initialYearSelect}-${initialMonthSelect}-${initialDateSelect}'
                AND copies.acquisition_date <= '${lastYearSelect}-${lastMonthSelect}-${lastDateSelect}'`;
    if(book ===''){
        sqlQuery+=` GROUP BY 
            book.subject_area`;
    }else{
        sqlQuery+=` GROUP BY 
            book.title`;
    }
       
    fetch('http://localhost:3000/getChartData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sqlQuery }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.data);
        const labels = data.data.map(entry => entry.label);
        const values = data.data.map(entry => entry.value);

        const ctx = document.getElementById('chart').getContext('2d');
        myChart = new Chart(ctx, {
            type: 'pie', 
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: [
                        'red',
                        'blue',
                        'green',
                        'yellow',
                        'orange', 
                        'purple'
                    ],
                }],
            },
        });
    })
    .catch(error => console.error('Error fetching data:', error));
    }
    // changeReportType('pie');

}
// ---------- SHOW PIE CHART end


function exportPNG() { 
    const canvas = document.getElementById("chart");
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'report.png'; 
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
};

// --------------------SIDEBAR MENU START

function expand() {
    const sidebar = document.querySelector('.sidebar');
    const contentSection = document.querySelector("main");
    contentSection.classList.toggle('expand');
    const menuText = document.querySelectorAll('.text');
    menuText.forEach(function(text, index){
    setTimeout(() => {
        text.classList.toggle('open2');
    }, index * 50);
})
    sidebar.classList.toggle("close");
};

// --------------------SIDEBAR MENU END
    












    










