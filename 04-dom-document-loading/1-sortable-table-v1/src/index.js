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
        const element = document.createElement('div');
        element.className = 'sortable-table';

        const headerElement = document.createElement('div');
        headerElement.className = 'sortable-table__header sortable-table__row';   
        headerElement.setAttribute('data-element', 'header');  
        headerElement.innerHTML = this.headerTemplate;
        
        const rowsElement = document.createElement('div');
        rowsElement.className = 'sortable-table__body';
        rowsElement.setAttribute('data-element', 'body');
        rowsElement.innerHTML = this.bodyTemplate;

        element.append(headerElement);
        element.append(rowsElement);

        this.headerElement = headerElement;
        this.rowsElement = rowsElement;
        this.element = element;
    }

    get subElements() {
        return {
            header : this.headerElement,
            body : this.rowsElement
        };
    }

    get headerTemplate() {
        let innerHtml = '';
        for (const headerData of this.header) {
            const isSortable = headerData.sortable ? 'true' : 'false';
            innerHtml +=  `
                <div class="sortable-table__cell" data-id="${headerData.id}" data-sortable="${isSortable}" data-sortType="${headerData.sortType}">
                  ${headerData.title}
                </div>
            `;
        }
        return innerHtml;

    }

    get bodyTemplate() {
        let innerHtml = '';
        for (const rowData of this.data) {
            innerHtml += this.getRowTemlate(rowData);
        }
        return innerHtml;
    }

    getRowTemlate (rowData = {}) {
        let innerHtml = '';

        for (const headerData of this.header) {
            const cellData = rowData[headerData.id];
        
            if (typeof headerData.template === 'function') {
                if (Array.isArray(cellData) && '0' in cellData) {
                  innerHtml += headerData.template(cellData);
                } else {
                  innerHtml += `<div class="sortable-table__cell"></div>`;
                }
            } else {
                innerHtml += `<div class="sortable-table__cell">${cellData}</div>`;
            }
        }

        return `<div class="sortable-table__row">${innerHtml}</div>`;
    }

    sort (fieldValue = 'title', orderValue = 'asc') {
        const sortObj = {
            headerNum : 0,
            orderValue,
            direction : 1,
            sortType : 'string',
            isSortable : false
        }

        switch (orderValue) {
            case 'asc':
                sortObj.direction = -1;
                break;
            case 'desc':
            default:
                sortObj.direction = 1;
        }

        const tableHeader = Array.from(this.headerElement.children);
        
        for (const headerCell of tableHeader) {
            if (headerCell.dataset.id === fieldValue) {
                sortObj.isSortable = Boolean(headerCell.dataset.sortable === 'true');
                sortObj.sortType = headerCell.dataset.sorttype;
                break;
            }
            sortObj.headerNum++;
        }

        if (sortObj.isSortable) {
            this.sortBody(sortObj);
        }

    }

    sortBody (sortObj = {}) {
        const rowsArray = Array.from(this.rowsElement.children).sort((i, ii) => {
            const iValue = i.children[sortObj.headerNum].innerHTML;
            const iiValue = ii.children[sortObj.headerNum].innerHTML;
            if (sortObj.sortType === 'number') {
                return sortObj.direction * (parseFloat(iValue) - parseFloat(iiValue));
            }
            return sortObj.direction * iValue.localeCompare(iiValue, 'ru', {caseFirst: 'upper'});
        });

        for (const row of rowsArray) {
            this.rowsElement.prepend(row);
        }
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
    }


}