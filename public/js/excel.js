/*eslint-disable */
const endpoint = "http://localhost:3000/admin/newsletterData";
const excelBtn = document.querySelector(".excelBtn");

const objectToCsv = function(data) {
  const csvRows = [];

  // get the headers
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(","));

  // loop over the rows
  for (const row of data) {
    const values = headers.map(header => (row[header]));
    csvRows.push(values.join(","));
  }

  // return csvRows
  return (csvRows.join("\n"));
}

const downloadCsv = function(data){
  const blob = new Blob([data], {type: "text/csv"});
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", "newsletterData.csv");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

excelBtn.addEventListener("click", async() => {
  const res = await fetch(endpoint);
  let data = await res.json();
  data = Object.entries(data)[0][1];
  data = data.map((row, index) => ({
    index: index + 1,
    email: row.email 
  }));

  const csvData = objectToCsv(data);
  downloadCsv(csvData);
})