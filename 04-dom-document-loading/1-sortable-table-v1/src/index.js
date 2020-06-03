export default class SortableTable {
    element;
    rowsElement;
    headerElement;

    constructor (header = [], { data = [] } = {}) {
        this.header = header;
        this.data = data;
        this.render();
        
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.getTable(this.data);

        this.element = wrapper.firstElementChild;
        this.subElements = this.getSubElements(this.element);
    }

    getTable(data) {
        return `
          <div class="sortable-table">
            ${this.getTableHeader()}
            ${this.getTableBody(data)}
          </div>
        `;
    }

    getTableHeader() {
        return `
          <div data-element="header" class="sortable-table__header sortable-table__row">
            ${this.headerTemplate}
          </div>
        `;
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

    get headerTemplate() {
        return this.header.map(item => this.getHeaderCell(item)).join('');
    }

    getHeaderCell({id, title, sortable, sortType}) {
        return `
            <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-sortType="${sortType}">
                ${title}
            </div>
        `;
    }

    getTableRows(data) {
        return data.map(rowData => this.getRowTemlate(rowData)).join('');
    }

    getRowTemlate (rowData = {}) {
        const innerHtml = this.header.map(headerData => {
            const cellData = rowData[headerData.id];
            
            if (typeof headerData.template === 'function') {
                if (Array.isArray(cellData) &&  cellData[0]) {
                  return headerData.template(cellData);
                }
                return `<div class="sortable-table__cell"></div>`;
            }
            
            return `<div class="sortable-table__cell">${cellData}</div>`;
        }).join('');

        return `<div class="sortable-table__row">${innerHtml}</div>`;
    }

    sort (field = 'title', order = 'asc') {
        const sortObj = {
            headerNum : 0,
            order,
            field,
            direction : 1,
            sortType : 'string',
            isSortable : false
        }

        switch (order) {
            case 'asc':
                sortObj.direction = 1;
                break;
            case 'desc':
            default:
                sortObj.direction = -1;
        }


        const headerCell = [...this.subElements.header.children].find(hCell => hCell.dataset.id === field);

        if (! headerCell) { 
            return; 
        }

        sortObj.isSortable = Boolean(headerCell.dataset.sortable === 'true');
        sortObj.sortType = headerCell.dataset.sorttype;

        if (sortObj.isSortable) {
            this.sortBody(sortObj);
        }

    }

    sortBody ({sortType, direction, field}) {
        const rowsForSort = [...this.data];
        rowsForSort.sort((i, ii) => {
            const iValue = i[field];
            const iiValue = ii[field];
            
            if (sortType === 'number') {
                return direction * (parseFloat(iValue) - parseFloat(iiValue));
            }
            
            return direction * iValue.localeCompare(iiValue, 'ru', {caseFirst: 'upper'});
        });

        this.subElements.body.innerHTML = this.getTableRows(rowsForSort);
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
    }


}