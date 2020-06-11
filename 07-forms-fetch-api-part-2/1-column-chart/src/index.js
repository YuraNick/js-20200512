export default class ColumnChart {
  domen = 'course-js.javascript.ru';
  element;
  subElements = {};
  chartHeight = 50;
  loadingClass = 'column-chart_loading';

  constructor (
    {
        url = 'api/dashboard/orders',
        range = {
          from: new Date('2020-04-06'),
          to: new Date('2020-05-06'),
        },
        label = 'orders',
        link = '#',
        value = 0,
        formatHeading = data => `${data}`
      } = {}
  ) {
      this.url = url;
      this.label = label;
      this.link = link;
      this.value = value;
      this.formatHeading = formatHeading;
      
      const { from, to } = range;

      this.render();
      this.update(from, to);
  }

  update (from, to) {
    this.element.classList.add(this.loadingClass);

    const response = this.getResponse(this.url, {from, to});
    
    response.then(responseData => {
        this.data = responseData;
        this.value = Object.values(responseData).reduce((summ, val) => summ += val, 0);
        this.refresh();
    });
  }

  refresh () {
    this.subElements.header.textContent = this.formatHeading(this.value);
    this.subElements.body.innerHTML = this.getColumnBody(this.data);
    this.element.classList.remove(this.loadingClass);
  }

  async getResponse (urlApi, params) {
    const url = new URL(urlApi, `https://${this.domen}`);

    for (const [name, val] of Object.entries(params)) {
        url.searchParams.set(name, val);
    }
    
    let response;

    try {
      response = await fetch(url.toString());
    } catch (err) {
      throw new Error('Fetch: Network error has occurred.');
    }

    if (response.ok) {
        try {
            return await response.json();
        } catch {
            throw new Error('Fetch: Error converting from json.');
        }
    }

    let errorText = response.statusText;
    throw new Error(`Fetch: Error network status: ${errorText}`);
  }

  getColumnBody (data) {
    const values = Object.values(data);

    const maxValue = Math.max(...values);

    return values
    .map(item => {
      const scale = this.chartHeight / maxValue;
      const percent = (item / maxValue * 100).toFixed(0);

      return `<div style="--value: ${Math.floor(item * scale)}" data-tooltip="${percent}%"></div>`;
    })
    .join('');
  }

  getLink () {
    return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
  }

  get template () {
    return `
      <div class="column-chart ${this.loadingClass}" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          Total ${this.label}
          ${this.getLink()}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">
            ${this.formatHeading(this.value)}
          </div>
          <div data-element="body" class="column-chart__chart">
            -
          </div>
        </div>
      </div>
    `;
  }

  render () {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template;

    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements(this.element);
  }

  getSubElements (element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  remove () {
    this.element.remove();
  }

  destroy () {
    this.remove();
    this.subElements = {};
  }

}
