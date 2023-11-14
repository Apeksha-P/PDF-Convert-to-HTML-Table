

// URL of the PDF file
const pdfUrl = 'DOC-20231109-WA0044..pdf';

// Function to load and parse the PDF
const loadPDF = async () => {
    try {
        const pdfDoc = await pdfjsLib.getDocument(pdfUrl).promise;
        const numPages = pdfDoc.numPages;

        // Fetch text content for each page
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const page = await pdfDoc.getPage(pageNum);
            const textContent = await page.getTextContent();
            processTextContent(textContent, pageNum);
        }
    } catch (error) {
        console.error('Error loading or parsing the PDF:', error);
    }
};

// Function to process the text content and extract table data
const processTextContent = (textContent, pageNum) => {
    const lines = textContent.items.map(item => item.str);

    // Find the index where "Team NS" is present in the line
    const startIndex = lines.findIndex(line => line.includes('Team NS'));

    // If "Team NS" is found, extract data and create HTML table
    if (startIndex !== -1) {
        const tableData = extractTableData(lines.slice(startIndex));
        const htmlTable = createHTMLTable(tableData, pageNum);

        // Create a new HTML page for each table
        const newPage = document.createElement('div');
        newPage.classList.add('pdf-page');
        newPage.innerHTML = `<h1>Table on Page ${pageNum}</h1>` + htmlTable;

        // Append the new page to the pdf-container div
        document.getElementById('pdf-container').appendChild(newPage);
    }
};

// Function to extract table data from text content
const extractTableData = (lines) => {
    const tableData = [];

    // Assuming each line represents a row in the table
    lines.forEach(line => {
        const rowData = line.split(','); // Adjust the delimiter based on your PDF
        tableData.push(rowData);
    });

    return tableData;
};

// Function to create an HTML table from extracted data
const createHTMLTable = (tableData, pageNum) => {
    let htmlTable = `<table style="border:1px solid black; style="table-layout: fixed; width: 100%;">`;

    // Add table headers with equal width
    htmlTable += `<tr>
                    <th colspan="2" style="font-weight: bold; width: 5%;border:1px solid black;">Team NS</th>
                    <th colspan="2" style="font-weight: bold; width: 5%;border:1px solid black;">Team EO</th>
                    <th colspan="3" style="font-weight: bold; width: 5%;border:1px solid black;">Contrat</th>
                    <th colspan="2" style="font-weight: bold; width: 5%;border:1px solid black;">Déclarant</th>
                    <th colspan="3" style="font-weight: bold; width: 5%;border:1px solid black;">Entame</th>
                    <th colspan="2" style="font-weight: bold; width: 5%;border:1px solid black;">Résultat</th>
                    <th colspan="1" style="font-weight: bold; width: 5%;border:1px solid black;">Score NS</th>
                    <th colspan="2" style="font-weight: bold; width: 5%;border:1px solid black;">Score EO</th>
                    <th colspan="2" style="font-weight: bold; width: 5%;border:1px solid black;">Note NS</th>
                    <th colspan="2" style="font-weight: bold; width: 5%;border:1px solid black;">Note EO</th>
                </tr>`;
    htmlTable += `<tr style="border:1px solid black;"><td colspan="20" style="width: 5%; min-width: 50px; height: 30px;text-align:center;">Section A</td></tr>`;
    

    for (let i = 22; i < tableData.length - 7; i++) {
        const currentRow = tableData[i];

        if (['1SA', '2SA', '3SA'].includes(currentRow[0])) {
            const combinedCells = currentRow.slice(0, 2).join('<br>');
            const remainingCells = currentRow.slice(2);

            htmlTable += `<tr>`;
            htmlTable += `<td style="width: 5%; height: 30px;" rowspan="20">${combinedCells}</td>`;
            htmlTable += remainingCells.map(cell => `<td style="width: 5%; height: 30px;">${cell}</td>`).join('');
            htmlTable += `</tr>`;

            htmlTable += `<td style="width: 5%; min-width: 50px; height: 30px;" rowspan="20"></td>`;
        } else {
            const combinedCells = currentRow.slice(0, 2).join('<br>');
            const remainingCells = currentRow.slice(2);

            htmlTable += `<tr>`;
            htmlTable += `<td style="width: 5%; min-width: 50px; height: 30px; position:relative;" rowspan="20" >${combinedCells}</td>`;
            htmlTable += remainingCells.map(cell => `<td style="width: 5%; min-width: 50px; height: 30px;">${cell}</td>`).join('');
            htmlTable += `</tr>`;

        }
    }

    htmlTable += '</table>';
    return htmlTable;
};


// Call the loadPDF function to start the process
loadPDF();

