class DataTable {
    // Public properties
    container;
    data;
    classes;
    renderTable;
    onRenderTable;
    renderHead;
    onRenderHead;
    renderBody;
    onRenderBody;
    // Private properties
    table;
    tableHead;
    tableHeaderData;
    tableBody;
    tableBodyData;
    constructor({ container, data, classes, renderTable, onRenderTable, renderHead, onRenderHead, renderBody, onRenderBody, }) {
        // Public properties
        this.container = container;
        this.data = data;
        this.classes = classes;
        this.renderTable = renderTable;
        this.onRenderTable = onRenderTable;
        this.renderHead = renderHead;
        this.onRenderHead = onRenderHead;
        this.renderBody = renderBody;
        this.onRenderBody = onRenderBody;
        // Private properties
        this.table = document.createElement("table");
        if (this.classes?.tableElement) {
            this.table.classList.add(...this.classes.tableElement);
        }
        this.tableHead = document.createElement("thead");
        if (this.classes?.tableHeadElement) {
            this.tableHead.classList.add(...this.classes.tableHeadElement);
        }
        this.tableHeaderData = null;
        this.tableBody = document.createElement("tbody");
        if (this.classes?.tableBodyElement) {
            this.tableBody.classList.add(...this.classes.tableBodyElement);
        }
        this.tableBodyData = null;
        this.initDataTable();
    }
    applyTableDataClass(tableDataElement, index, dataArray, classes) {
        if (index === 0 && classes?.["firstDataElement"]) {
            tableDataElement.classList.add(...classes["firstDataElement"]);
        }
        else if (index === dataArray.length - 1 && classes?.["lastDataElement"]) {
            tableDataElement.classList.add(...classes["lastDataElement"]);
        }
        else if (classes?.["dataElement"]) {
            tableDataElement.classList.add(...classes["dataElement"]);
        }
    }
    createTableRow(classList) {
        const tableRow = document.createElement("tr");
        if (classList) {
            tableRow.classList.add(...classList);
        }
        return tableRow;
    }
    createTableHeaderData() {
        const tableHeaderData = this.data.headers.map((header, index, arr) => {
            const th = document.createElement("th");
            th.scope = "col";
            th.textContent = header;
            this.applyTableDataClass(th, index, arr, this.classes?.tableHeadData);
            return th;
        });
        this.tableHeaderData = tableHeaderData;
    }
    createTableBodyData() {
        const tableBodyData = this.data.rows.map((row) => row.map((data, index, arr) => {
            const td = document.createElement("td");
            td.textContent = data;
            this.applyTableDataClass(td, index, arr, this.classes?.tableBodyData);
            return td;
        }));
        this.tableBodyData = tableBodyData;
    }
    buildTableHead() {
        if (this.tableHeaderData) {
            if (this.renderHead) {
                this.tableHead = this.renderHead(this.tableHeaderData);
            }
            else {
                const headerRow = this.createTableRow(this.classes?.tableHeadRowElement);
                headerRow.append(...this.tableHeaderData);
                this.tableHead.append(headerRow);
            }
            return this.tableHead;
        }
    }
    buildTableBody() {
        if (this.tableBodyData) {
            if (this.renderBody) {
                this.tableBody = this.renderBody(this.tableBodyData);
            }
            else {
                const dataRows = this.tableBodyData.map((rowData) => {
                    const bodyRow = this.createTableRow(this.classes?.tableBodyRowElement);
                    bodyRow.append(...rowData);
                    return bodyRow;
                });
                this.tableBody.append(...dataRows);
            }
            return this.tableBody;
        }
    }
    buildTable() {
        if (this.renderTable) {
            this.table = this.renderTable();
        }
        const tableHead = this.buildTableHead();
        if (tableHead) {
            this.onRenderHead && this.onRenderHead(tableHead);
            this.table.append(tableHead);
        }
        const tableBody = this.buildTableBody();
        if (tableBody) {
            this.onRenderBody && this.onRenderBody(tableBody);
            this.table.append(tableBody);
        }
        this.onRenderTable && this.onRenderTable(this.table);
        this.container.append(this.table);
    }
    initDataTable() {
        this.createTableHeaderData();
        this.createTableBodyData();
        this.buildTable();
    }
}
export default DataTable;
