import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
    element;
    subElements;
    sortLabelElement;
    urlObject;
    ROWS_STEP = 30;
    isLoaded = false;

    headerSortEvent = event => {
        const headerCell = event.target.closest('[data-sortable=true]');
        
        if (headerCell) {
            const field = headerCell.dataset.id;
            const order = this.orderInvert(headerCell.dataset.order);
            this.sortOnServer(field, order);
        }
    }

    tableScrollEvent = event => {
        if (
            this.isLoaded || 
            this.element.classList.contains("sortable-table_loading") || 
            this.element.classList.contains("sortable-table_empty")
        ){
            return;
        }

        if (this.element.getBoundingClientRect().bottom < document.documentElement.clientHeight) {
            this.loadMoreRows();
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
        
    }

    orderInvert (order) {
        const obj = {
            desc : 'asc',
            asc : 'desc'
        };

        return obj[order] || 'asc';
    }

    initEventListeners () {
        const { header } = this.subElements;

        header.addEventListener('pointerdown', this.headerSortEvent);
        window.addEventListener('scroll', this.tableScrollEvent);
    }

    removeEventListeners() {
        const { header } = this.subElements;

        header.removeEventListener('pointerdown', this.headerSortEvent);
        window.removeEventListener('scroll', this.tableScrollEvent);
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

        this.initEventListeners();
    }

    async update (sortObj) {
        const url = new URL(this.url, BACKEND_URL);

        for (const [param, val] of Object.entries(sortObj)) {
            url.searchParams.set(param, val);
        }

        this.urlObject = url;

        const { body } = this.subElements;
        const element = this.element;
        
        body.innerHTML = '';
        element.classList.remove('sortable-table_empty');
        element.classList.add('sortable-table_loading');

        const data = await this.loadData(url);

        if (data.length === 0) {
            element.classList.add('sortable-table_empty');
        } else {
            body.innerHTML = this.getTableRows(data);
        }

        this.checkIsLoaded(data);

        element.classList.remove('sortable-table_loading');
    }

    checkIsLoaded (data) {
        if (data.length < this.ROWS_STEP) {
            this.isLoaded = true;
        } else {
            this.isLoaded = false;
        }
    }

    async loadData(url) {
        const response = await fetchJson(url);

        if (response && response.length) {
            return response;
        }

        return [];
    }

    async loadMoreRows () {
        const element = this.element;
        const { body } = this.subElements;
        element.classList.add('sortable-table_loading');

        const url = this.urlObject;

        const prevEnd = parseInt(url.searchParams.get('_end'), 10);
        const start = prevEnd + 1;
        const end = start + this.ROWS_STEP;

        url.searchParams.set('_start', start);
        url.searchParams.set('_end', end);

        const data = await this.loadData(url);

        if (data.length) {
            body.insertAdjacentHTML("beforeend", this.getTableRows(data));
        } else {
            element.classList.add('sortable-table_loading');
        }

        this.checkIsLoaded(data);

        element.classList.remove('sortable-table_loading');
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
                _end : this.ROWS_STEP
            }
        }

        return {
            _embed : 'subcategory.category',
            _start : 0,
            _end : this.ROWS_STEP
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
                return template(cellData);
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
        this.removeEventListeners();
        this.element.remove();
    }

    destroy() {
        this.remove();
    }

}
