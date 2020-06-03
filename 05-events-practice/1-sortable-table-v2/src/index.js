export default class SortableTable {
    element;
    subElements;
    sortLabelElement;

    headerSortEvent = event => {
        const headerCell = event.target.closest('[data-sortable=true]');
        
        if (headerCell) {
            const field = headerCell.dataset.id;
            const order = this.orderInvert(headerCell.dataset.order);
            this.sort(field, order);

            headerCell.dataset.order = order;
            headerCell.append(this.sortLabelElement);
        }
    }

    constructor (
        header = [], 
        { data = [] } = {},
        { sortField = null, sortOrder = 'asc' } = {}
    ){
        this.header = header;
        this.data = data;

        this.render(sortField, sortOrder);
        
        this.initHeaderSortEvent();
    }

    orderInvert (order) {
        switch (order) {
            case 'desc' :
                return 'asc';
            case 'asc' :
            default :
                return 'desc';
        }
    }

    initHeaderSortEvent () {
        const header = this.subElements.header;

        if (! header) {
            return;
        }

        header.addEventListener('click', this.headerSortEvent);
    }

    removeEvents() {
        const header = this.subElements.header;

        if (! header) {
            return;
        }

        header.removeEventListener('click', this.headerSortEvent);
    }

    render (sortField = null, sortOrder = 'asc') {
        const wrapper = document.createElement('div');

        wrapper.innerHTML = this.sortedLableTemplate;
        this.sortLabelElement = wrapper.firstElementChild;

        // по умолчанию сотрировка по первому sortable столбцу
        const sortObj = this.getSortProperty(sortField, sortOrder);
        const sortedData = this.sortTableData(sortObj);

        wrapper.innerHTML = this.getTable(sortedData, sortObj);

        this.element = wrapper.firstElementChild;
        this.subElements = this.getSubElements(this.element);

        if (sortObj.field) {
            const headerCell = this.getHeaderCellElement(sortObj.field);
            if (headerCell) {
                headerCell.append(this.sortLabelElement);
            }
        }
    }

    getHeaderCellForSort (field) {
        if (field) {
            return this.header.find(item => item.id === field);
        }

        return this.header.find(item => item.sortable);
    }

    getSortProperty (field, order) {
        const folderCell = this.getHeaderCellForSort(field);

        if (folderCell) {
            return {
                order,
                field : field || folderCell.id,
                sortType : folderCell.sortType
            }
        }

        return {};
    }

    get sortedLableTemplate() {
        return `
            <span class="sortable-table__sort-arrow">
              <span class="sort-arrow"></span>
            </span>
        `;
    }

    getTable (data, {field, order} = {}) {
        return `
          <div class="sortable-table">
            ${this.getTableHeader(field, order)}
            ${this.getTableBody(data)}
          </div>
        `;
    }

    getTableHeader(field, order) {
        return `
          <div data-element="header" class="sortable-table__header sortable-table__row">
            ${this.getheaderTemplate(field, order)}
          </div>
        `;
    }

    getheaderTemplate(field, order) {
        return this.header.map(item => this.getHeaderCell(item, field, order)).join('');
    }

    getTableBody(data) {
        return `
          <div data-element="body" class="sortable-table__body">
            ${this.getTableRows(data)}
          </div>
        `;
    }

    getSubElements(element) {
        const elements = element.querySelectorAll('[data-element]');
    
        return [...elements].reduce((accum, subElement) => {
          accum[subElement.dataset.element] = subElement;
    
          return accum;
        }, {});
    }

    getHeaderCell({id, title, sortable, sortType}, field, order) {
        const sortedOrder = (id === field) ? order : '';
        
        return `
            <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="${sortedOrder}" data-sortType="${sortType}">
                <span>${title}</span>
            </div>
        `;
    }

    getTableRows (data) {
        return data.map(rowData => this.getTableRow(rowData)).join('');
    }

    getTableRow (rowData = {}) {
        return `<div class="sortable-table__row">${this.getRowTemlate(rowData)}</div>`;
    }

    getRowTemlate (rowData = {}) {
        return this.header.map(headerData => {
            const cellData = rowData[headerData.id];
            
            if (typeof headerData.template === 'function') {
                if (Array.isArray(cellData) &&  cellData[0]) {
                  return headerData.template(cellData);
                }
                return `<div class="sortable-table__cell"></div>`;
            }
            
            return `<div class="sortable-table__cell">${cellData}</div>`;
        }).join('');
    }

    getHeaderCellElement (field) {
        return [...this.subElements.header.children].find(hCell => hCell.dataset.id === field);
    }

    sort (field = 'title', order = 'asc') {
        const sortObj = {
            order,
            field,
            order,
            sortType : 'string',
            isSortable : false
        }
        
        const headerCell = this.getHeaderCellElement(field);
        
        if (! headerCell) { 
            return; 
        }

        sortObj.isSortable = Boolean(headerCell.dataset.sortable === 'true');
        sortObj.sortType = headerCell.dataset.sorttype;

        if (sortObj.isSortable) {
            const sordtedRows = this.sortTableData(sortObj);
            this.subElements.body.innerHTML = this.getTableRows(sordtedRows);
        }
    }

    sortTableData ({sortType = '', order = 'asc', field}) {
        let direction;
        
        switch (order) {
            case 'asc':
                direction = 1;
                break;

            case 'desc':
            default:
                direction = -1;
        }

        const arrForSort = [...this.data];
        
        arrForSort.sort((i, ii) => {
            const iValue = i[field];
            const iiValue = ii[field];
            
            switch (sortType) {
                case 'number':
                    return direction * (parseFloat(iValue) - parseFloat(iiValue));
                
                case 'status':
                    return direction * (parseInt(iValue, 10) - parseInt(iiValue, 10));
                
                case 'string':
                    return direction * iValue.localeCompare(iiValue, 'ru', {caseFirst: 'upper'});
                
                default:
                    return 0;
            }
        });

        return arrForSort;
    }

    remove() {
        this.removeEvents();
        this.element.remove();
    }

    destroy() {
        this.remove();
    }
}