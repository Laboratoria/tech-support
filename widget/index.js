import templates from './templates.json';

const intl = {
  es: {
    techSupport: 'Tech support',
    close: 'Cerrar',
  },
  pt: {
    techSupport: 'Tech support',
    close: 'Fechar',
  },
};

const createTranslator = lang => key => intl[lang][key] || key;

const createEnvSection = lang => `

***

## Entorno

**Location**: \`${window.location}\`
**User Agent**: \`${navigator.userAgent}\`
**Navigator Language**: \`${navigator.language}\`
**Selected Language**: \`${lang}\`
`;

const createURLBuilder = (repo, lang) => ({
  title,
  body,
  labels,
  assignees,
  template,
}) => {
  const qsObj = {
    ...(!!title && { title }),
    ...(!!labels && { labels }),
    ...(!!assignees && { assignees }),
    ...(!!template && { template }),
    body: `${body}${createEnvSection(lang)}`,
  };

  const qs = Object.keys(qsObj).reduce(
    (memo, key) => `${memo ? `${memo}&` : ''}${key}=${encodeURIComponent(`${qsObj[key]}`)}`,
    '',
  );

  return `https://github.com/${repo}/issues/new?${qs}`;
};

class TechSupport extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const repo = this.getAttribute('repo') || 'Laboratoria/tech-support';
    const lang = this.getAttribute('lang') || 'es';

    if (!['es', 'pt'].includes(lang)) {
      return alert(`[TechSupport] Unsupported lang: ${lang}`);
    }

    const filteredTemplates = templates.filter(t => t.lang === lang);

    const __ = createTranslator(lang);
    const buildURL = createURLBuilder(repo, lang);
    const shadow = this.attachShadow({ mode: 'open' });

    const listItems = filteredTemplates.reduce(
      (memo, template) => {
        const url = buildURL({ ...template.headers, body: template.body });
        return `${memo}
          <li>
            <a href="${url}" target="_blank">
              ${template.headers.name}
            </a>
          </li>
        `;
      },
      '',
    );

    shadow.innerHTML = `
      <style>
      a {
        text-decoration: none;
        font-family: Open Sans, sans-serif;
      }
      .menu {
        background-color: rgba(0, 0, 0, 0.7);
        display: none;
        position: absolute;
        width: 100%;
        height: 100vh;
        left: 0;
        top: -5px;
        margin: 0;
        padding: 0;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        list-style: none;
        z-index: 999;
      }
      .menu ul {
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        list-style: none;
      }
      .menu li {
        margin: 0;
        padding: 0;
      }
      .menu a {
        display: block;
        margin: 0.3rem;
        padding: 0.6rem 1.2rem;
        color: #fff;
      }
      .menu ul a {
        background-color: #000;
        border-radius: 0.4rem;
      }
      </style>
      <a class="open-btn" href="#" title="${__('techSupport')}">🛟</a>
      <div class="menu">
        <ul>
          ${listItems}
        </ul>
        <a class="close-btn" href="#">✖️ ${__('close')}</a>
      </div>
    `;

    const openBtnEl = shadow.querySelector('.open-btn');
    const closeBtnEl = shadow.querySelector('.close-btn');
    const menuEl = shadow.querySelector('.menu');

    openBtnEl.addEventListener('click', (event) => {
      event.preventDefault();
      menuEl.style.display = menuEl.style.display === 'flex' ? 'none' : 'flex';
    });

    closeBtnEl.addEventListener('click', (event) => {
      event.preventDefault();
      menuEl.style.display = 'none';
    });
  }
}

customElements.define('x-tech-support', TechSupport);
