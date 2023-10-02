document.addEventListener('DOMContentLoaded', function () {

    const stockTable = document.getElementById('stock-table');

    getTransactions();
    function getTransactions(){
        const cookie = getCookies();
        const token = cookie['token'];

        // Construct the API URL
        const apiUrl = `http://localhost:8080/transactions`;
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
                loadTransactions(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    function loadTransactions(data){

        // Create the table header
        const headerRow = document.createElement('tr');
        const headerCell = document.createElement('th');
        headerCell.colSpan = '8';
        headerCell.textContent = `Transaction History`;
        headerRow.appendChild(headerCell);
        stockTable.appendChild(headerRow);

        // Create the table headers for the data columns
        const headerRow2 = document.createElement('tr');
        const headers = ['Date', 'Transaction Type', 'Stock Name', 'Shares', 'Price per Share'];
        headers.forEach(headerText => {
            const headerCell = document.createElement('th');
            headerCell.textContent = headerText;
            headerRow2.appendChild(headerCell);
        });
        stockTable.appendChild(headerRow2);

        // Create the table rows for the portfolio data
        Object.entries(data).forEach(stock => {
            const entry = stock[1];
            const row = document.createElement('tr');
            const rowData = [entry['date'], entry['stockName'], entry['transactionType'], entry['shares'], entry['price']];
            rowData.forEach(cellText => {
                const cell = document.createElement('td');
                cell.textContent = cellText;
                row.appendChild(cell);
            });
            stockTable.appendChild(row);
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