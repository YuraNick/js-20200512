// import SortableList from '../../../09-tests-routes-browser-history-api/2-sortable-list/solution/index.js';
import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';
const PRODUCTS_API = 'api/rest/products';
const CATEGIRIES_API = 'api/rest/categories?_sort=weight&_refs=subcategory';
const SAVE_IMAGE_API = 'https://api.imgur.com/3/image';

export default class ProductForm {
    element;
    subElements;
    subCategory = [];

    constructor (productId) {
        this.productId = productId;

        this.render();
        

    }

    async loadData(productId) {
        const categoriesResponse = await fetchJson(`${BACKEND_URL}/${CATEGIRIES_API}`);

        if (categoriesResponse && categoriesResponse.length) {
            this.getCategories(categoriesResponse);
            
            // с таким подходом меньше обращений к DOM, чем через new Option (?)
            this.subElements.subCategoryList.innerHTML = this.categoriesTemplate(this.subCategory);
        }
    }

    imageTemplate ({url = '', source = ''} = {}) {
        return `
        <li class="products-edit__imagelist-item sortable-list__item" style="">
          <input type="hidden" name="url" value="${url}">
          <input type="hidden" name="source" value="${source}">
          <span>
            <img src="icon-grab.svg" data-grab-handle alt="grab">
            <img class="sortable-table__cell-img" alt="Image" src="${url}">
            <span>${source}</span>
          </span>
          <button type="button">
            <img src="icon-trash.svg" data-delete-handle alt="delete">
          </button>
          </li>
        `
    }

    getCategories (categories) {
        const subCategory = [];

        categories.forEach( category => {
            const { title : categoryTitle, subcategories } = category;
            
            this.addSubCategories(subCategory, {categoryTitle, subcategories});
        });

        this.subCategory = subCategory;
    }

    addSubCategories (accum, { categoryTitle = '', subcategories = [] } = {}) {
        subcategories.forEach( subCategory => {
            const { id : subCategoryTitleId, title : subCategoryTitle } = subCategory;
            
            accum.push({ subCategoryTitleId, categoryTitle, subCategoryTitle });
        });

        return accum;
    }

    async render () {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.template();

        const element = wrapper.firstElementChild;
        this.element = element;

        this.subElements = this.getSubElements(element);

        this.loadData(this.productId);

        return this.element;
    }

    categoriesTemplate(subCategory) {
        return subCategory.map(subCategoryItem => this.categoryTemplate(subCategoryItem)).join('');
    }

    categoryTemplate({ subCategoryTitleId, categoryTitle, subCategoryTitle }) {
        return `<option value="${subCategoryTitleId}">${categoryTitle} &gt; ${subCategoryTitle}</option>`;
    }

    nameDescriptionTemplate () {
        return `
            <div class="form-group form-group__half_left">
                <fieldset>
                  <label class="form-label">Название товара</label>
                  <input required="" type="text" name="title" class="form-control" placeholder="Название товара">
                </fieldset>
            </div>
            <div class="form-group form-group__wide">
                <label class="form-label">Описание</label>
                <textarea required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
            </div>
        `;
    }

    imagesTemplate() {
        return `
        <div class="form-group form-group__wide" data-element="sortable-list-container">
            <label class="form-label">Фото</label>
            
            <div data-element="imageListContainer">
                <ul class="sortable-list"></ul>
            </div>
            
            <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
        </div>
        `;
    }

    template () {
        return `
        <div class="product-form">
            <form data-element="productForm" class="form-grid">
                ${this.nameDescriptionTemplate()}
                ${this.imagesTemplate()}
                ${this.propertyTemplate()}
            </form>
        </div>    
        `;
    }

    propertyTemplate() {
        return `
        <div class="form-group form-group__half_left">
            <label class="form-label">Категория</label>
            <select data-element="subCategoryList" class="form-control" name="subcategory">
            </select>
        </div>

        <div class="form-group form-group__half_left form-group__two-col">
            <fieldset>
            <label class="form-label">Цена ($)</label>
            <input required="" type="number" name="price" class="form-control" placeholder="100">
            </fieldset>
            <fieldset>
            <label class="form-label">Скидка ($)</label>
            <input required="" type="number" name="discount" class="form-control" placeholder="0">
            </fieldset>
        </div>

        <div class="form-group form-group__part-half">
            <label class="form-label">Количество</label>
            <input required="" type="number" class="form-control" name="quantity" placeholder="1">
        </div>

        <div class="form-group form-group__part-half">
            <label class="form-label">Статус</label>
            <select class="form-control" name="status">
            <option value="1">Активен</option>
            <option value="0">Неактивен</option>
            </select>
        </div>
        
        <div class="form-buttons">
            <button type="submit" name="save" class="button-primary-outline">
            Сохранить товар
            </button>
        </div>
        `;
    }

    getSubElements (element) {
        const elements = element.querySelectorAll('[data-element]');
    
        return [...elements].reduce((accum, subElement) => {
          accum[subElement.dataset.element] = subElement;
    
          return accum;
        }, {});
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
    }

}
