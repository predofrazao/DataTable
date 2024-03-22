interface IData {
  headers: string[];
  rows: string[][];
}

interface IDataTableProps {
  container: HTMLElement;
  data: IData;
  classes?: {
    tableElement?: string[];
    tableHeadElement?: string[];
    tableHeadRowElement?: string[];
    tableHeadData?: {
      dataElement?: string[];
      firstDataElement?: string[];
      lastDataElement?: string[];
    };
    tableBodyElement?: string;
    tableBodyRowElement?: string[];
    tableBodyData?: {
      dataElement?: string[];
      firstDataElement?: string[];
      lastDataElement?: string[];
    };
  };
  renderTable?: () => HTMLTableElement;
  onRenderTable?: (table: HTMLTableElement) => void;
  renderHead?: (tableHeadData: HTMLTableCellElement[]) => HTMLTableSectionElement;
  onRenderHead?: (tableHead: HTMLTableSectionElement) => void;
  renderBody?: (tableBodyData: HTMLTableCellElement[][]) => HTMLTableSectionElement;
  onRenderBody?: (tableBody: HTMLTableSectionElement) => void;
}

class DataTable {
  // Public properties
  container: HTMLElement;
  data: IData;
  classes?: {
    tableElement?: string[];
    tableHeadElement?: string[];
    tableHeadRowElement?: string[];
    tableHeadData?: {
      dataElement?: string[];
      firstDataElement?: string[];
      lastDataElement?: string[];
    };
    tableBodyElement?: string;
    tableBodyRowElement?: string[];
    tableBodyData?: {
      dataElement?: string[];
      firstDataElement?: string[];
      lastDataElement?: string[];
    };
  };
  renderTable?: () => HTMLTableElement;
  onRenderTable?: (table: HTMLTableElement) => void;
  renderHead?: (tableHeadData: HTMLTableCellElement[]) => HTMLTableSectionElement;
  onRenderHead?: (tableHead: HTMLTableSectionElement) => void;
  renderBody?: (tableBodyData: HTMLTableCellElement[][]) => HTMLTableSectionElement;
  onRenderBody?: (tableBody: HTMLTableSectionElement) => void;

  // Private properties
  private table: HTMLTableElement;
  private tableHead: HTMLTableSectionElement;
  private tableHeaderData: HTMLTableCellElement[] | null;
  private tableBody: HTMLTableSectionElement;
  private tableBodyData: HTMLTableCellElement[][] | null;

  constructor({
    container,
    data,
    classes,
    renderTable,
    onRenderTable,
    renderHead,
    onRenderHead,
    renderBody,
    onRenderBody,
  }: IDataTableProps) {
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

  applyTableDataClass(
    tableDataElement: HTMLTableCellElement,
    index: number,
    dataArray: string[],
    classObject?: { [key: string]: string[] }
  ) {
    if (!classObject) {
      return;
    } else if (index === 0 && classObject?.["firstDataElement"]) {
      tableDataElement.classList.add(...classObject["firstDataElement"]);
    } else if (index === dataArray.length - 1 && classObject?.["lastDataElement"]) {
      tableDataElement.classList.add(...classObject["lastDataElement"]);
    } else if (classObject?.["dataElement"]) {
      tableDataElement.classList.add(...classObject["dataElement"]);
    }
  }

  private createTableRow(classList?: string[]) {
    const tableRow = document.createElement("tr");

    if (classList) {
      tableRow.classList.add(...classList);
    }

    return tableRow;
  }

  private createTableHeaderData() {
    const tableHeaderData = this.data.headers.map((header, index, arr) => {
      const th = document.createElement("th");
      th.scope = "col";
      th.textContent = header;

      this.applyTableDataClass(th, index, arr, this.classes?.tableHeadData);

      return th;
    });

    this.tableHeaderData = tableHeaderData;
  }

  private createTableBodyData() {
    const tableBodyData = this.data.rows.map((row) =>
      row.map((data, index, arr) => {
        const td = document.createElement("td");
        td.textContent = data;

        this.applyTableDataClass(td, index, arr, this.classes?.tableBodyData);

        return td;
      })
    );

    this.tableBodyData = tableBodyData;
  }

  private buildTableHead() {
    if (this.tableHeaderData) {
      if (this.renderHead) {
        this.tableHead = this.renderHead(this.tableHeaderData);
      } else {
        const headerRow = this.createTableRow(this.classes?.tableHeadRowElement);
        headerRow.append(...this.tableHeaderData);
        this.tableHead.append(headerRow);
      }

      return this.tableHead;
    }
  }

  private buildTableBody() {
    if (this.tableBodyData) {
      if (this.renderBody) {
        this.tableBody = this.renderBody(this.tableBodyData);
      } else {
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

  private buildTable() {
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

  private initDataTable() {
    this.createTableHeaderData();
    this.createTableBodyData();
    this.buildTable();
  }
}

export default DataTable;
