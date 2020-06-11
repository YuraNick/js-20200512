import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
    element;
    subElements;
    sortLabelElement;

    headerSortEvent = event => {
        const headerCell = event.target.closest('[data-sortable=true]');
        
        if (headerCell) {
            const field = headerCell.dataset.id;
            const order = this.orderInvert(headerCell.dataset.order);
            this.sortOnServer(field, order);
        }
    }

    constructor (
        header = [], 
        { 
            sortField = null, 
            sortOrder = 'asc', 
            url 
        } = {}
    ){
        this.header = header;
        this.url = url;

        this.render(sortField, sortOrder);
        this.initHeaderSortEvent();
    }

    orderInvert (order) {
        const obj = {
            desc : 'asc',
            asc : 'desc'
        };

        return obj[order] || 'asc';
    }

    initHeaderSortEvent () {
        const { header } = this.subElements;

        if (header) {
            header.addEventListener('pointerdown', this.headerSortEvent);
        }
    }

    removeEvents() {
        const { header } = this.subElements;

        if (header) {
            header.removeEventListener('pointerdown', this.headerSortEvent);
        }
    }

    render (sortField = null, sortOrder = 'asc') {
        const wrapper = document.createElement('div');

        wrapper.innerHTML = this.sortedLableTemplate;
        this.sortLabelElement = wrapper.firstElementChild;

        // по умолчанию сотрировка по первому возможному столбцу
        const sortObj = this.getSortProperty(sortField, sortOrder);
        const { _sort : field } = sortObj;
        
        wrapper.innerHTML = this.getTable(sortObj);
        
        this.element = wrapper.firstElementChild;
        this.subElements = this.getSubElements(this.element);

        if (field) {
            const headerCell = this.getHeaderCellElement(field);
            
            if (headerCell) {
                headerCell.append(this.sortLabelElement);
            }
        }

        this.update(sortObj);
    }

    update (sortObj) {
        const url = new URL(this.url, BACKEND_URL);

        for (const [param, val] of Object.entries(sortObj)) {
            url.searchParams.set(param, val);
        }

        const { body } = this.subElements;
        const { element } = this;
        
        body.innerHTML = '';
        element.classList.remove('sortable-table_empty');
        element.classList.add('sortable-table_loading');
        
        const response = fetchJson(url);
        
        response.then(data => {
            if (data.length === 0) {
                element.classList.add('sortable-table_empty');
            } else {
                body.innerHTML = this.getTableRows(data);
            }

            element.classList.remove('sortable-table_loading');
        });
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
                _embed : 'subcategory.category',
                _order : order,
                _sort : field || folderCell.id,
                _start : 0,
                _end : 30
            }
        }

        return {
            _embed : 'subcategory.category',
            _start : 0,
            _end : 30
        };
    }

    get sortedLableTemplate() {
        return `
            <span class="sortable-table__sort-arrow">
              <span class="sort-arrow"></span>
            </span>
        `;
    }

    getTable ({_sort, _order} = {}) {
        return `
          <div class="sortable-table">
            ${this.getTableHeader(_sort, _order)}
            ${this.tableBody}
            ${this.tableLoading}
            ${this.emptyPlaceholder}
          </div>
        `;
    }

    get tableLoading () {
        return `
            <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
        `;
    }

    get emptyPlaceholder() {
        return `
            <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
            <div>
                <p>No products satisfies your filter criteria</p>
                <button type="button" class="button-primary-outline">Reset all filters</button>
            </div>
            </div>
        `;
    }

    getTableHeader (field, order) {
        return `
          <div data-element="header" class="sortable-table__header sortable-table__row">
            ${this.getheaderTemplate(field, order)}
          </div>
        `;
    }

    getheaderTemplate (field, order) {
        return this.header.map(item => this.getHeaderCell(item, field, order)).join('');
    }

    get tableBody () {
        return `<div data-element="body" class="sortable-table__body"></div>`;
    }

    getSubElements (element) {
        const elements = element.querySelectorAll('[data-element]');
    
        return [...elements].reduce((accum, subElement) => {
          accum[subElement.dataset.element] = subElement;
    
          return accum;
        }, {});
    }

    getHeaderCell ({id, title, sortable, sortType}, field, order) {
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
            const { template } = headerData;

            if (template) {
                try {
                    // Перчатки iGlover без картинки - отсюда ошибка, как лучше сделать ?
                    return template(cellData);
                } catch (error) {
                    console.error(error);
                }
            }
            
            return `<div class="sortable-table__cell">${cellData}</div>`;
        }).join('');
    }

    getHeaderCellElement (field) {
        return [...this.subElements.header.children].find(hCell => hCell.dataset.id === field);
    }

    sortOnServer (field = 'title', order = 'asc', headerCell) {
        headerCell = headerCell || this.getHeaderCellElement(field);
        
        if (! headerCell) { 
            return; 
        }

        const isSortable = Boolean(headerCell.dataset.sortable === 'true');

        if (isSortable) {
            headerCell.dataset.order = order;
            headerCell.append(this.sortLabelElement);
            
            const sortObj = this.getSortProperty(field, order);
            this.update(sortObj);
        }
    }

    remove() {
        this.removeEvents();
        this.element.remove();
    }

    destroy() {
        this.remove();
    }

}
