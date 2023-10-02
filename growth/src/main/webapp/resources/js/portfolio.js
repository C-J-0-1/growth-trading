document.addEventListener('DOMContentLoaded', function () {

    const stockTable = document.getElementById('stock-table');

    getPortfolio();
    function getPortfolio(){
        const cookie = getCookies();
        const token = cookie['token'];

        // Construct the API URL
        const apiUrl = `http://localhost:8080/portfolios`;
        const options = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        };

        // Make an API request
        fetch(apiUrl, options)
            .then(response => response.json())
            .then(data => {
                loadPortfolio(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    function loadPortfolio(data){
        const cookie = getCookies();
        const token = cookie['token'];

        // Create the table header
        const headerRow = document.createElement('tr');
        const headerCell = document.createElement('th');
        headerCell.colSpan = '8';
        headerCell.textContent = `Portfolio`;
        headerRow.appendChild(headerCell);
        stockTable.appendChild(headerRow);

        // Create the table headers for the data columns
        const headerRow2 = document.createElement('tr');
        const headers = ['Stock Name', 'Shares', 'Price per Share', 'Total Value', ''];
        headers.forEach(headerText => {
            const headerCell = document.createElement('th');
            headerCell.textContent = headerText;
            headerRow2.appendChild(headerCell);
        });
        stockTable.appendChild(headerRow2);

        let i = 0;
        // Create the table rows for the portfolio data
        Object.entries(data).forEach(stock => {
            const entry = stock[1];
            const row = document.createElement('tr');

            // creating selling option
            const div = document.createElement('div');
            div.className = "options";
            const decrease = document.createElement('button');
            const increase = document.createElement('button');;
            decrease.className = "quantity-button";
            increase.className = "quantity-button";
            const input = document.createElement('input');
            const sellButton = document.createElement('button');

            increase.setAttribute('id', 'increase-quantity-'+i);
            decrease.setAttribute('id', 'decrease-quantity-'+i);
            input.setAttribute('id', 'stock-quantity-'+i);
            input.setAttribute('type', 'number');
            input.setAttribute('value', '1');
            input.setAttribute('min', 1);
            input.setAttribute('max', `${entry['shares']}`);
            sellButton.setAttribute('id', 'sell-option-'+i);
            sellButton.innerHTML = 'Sell';

            div.appendChild(decrease);
            div.appendChild(input);
            div.appendChild(increase);
            div.appendChild(sellButton);

            decrease.addEventListener("click", function () {
                let quantity = parseInt(input.value);
                if (quantity > 1) {
                    quantity--;
                    input.value = quantity;
                }
            });

            increase.addEventListener("click", function () {
                let quantity = parseInt(input.value);
                quantity++;
                input.value = quantity;
            });

            sellButton.addEventListener('click', () => {
                const cookie = getCookies();
                const token = cookie['token'];

                // Construct the API URL
                const apiUrl = `http://localhost:8080/sell`;
                const options = {
                    method: 'POST',
                    body: JSON.stringify({
                          symbol: entry['stockName'],
                          quantity: input.value,
                          price: entry['price']
                      }),
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    }
                };

                // Make an API request
                fetch(apiUrl, options)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                    });
            });


            const rowData = [entry['stockName'], entry['shares'], entry['price'], entry['price']];
            rowData.forEach(cellText => {
                const cell = document.createElement('td');
                cell.textContent = cellText;
                row.appendChild(cell);
            });
            row.appendChild(div);
            stockTable.appendChild(row);
            i++;
        });

    }

    function getCookies() {
        let cookies = document.cookie.split(';').reduce(
            (cookies, cookie) => {
                const [name, val] = cookie.split('=').map(c => c.trim());
                cookies[name] = val;
                return cookies;
            }, {});
        return cookies;
    }
});