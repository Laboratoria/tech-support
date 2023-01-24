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
        margin: 0;
        padding: 0;
        list-style: none;
        background-color: #f2f2f2;
        border-radius: 0.4rem;
        display: none;
        position: absolute;
        right: 23px;
        top: 60px;
        z-index: 999;
      }
      .menu li {
        margin: 0;
        padding: 0.5rem 1.65rem;
      }
      .menu li:first-child {
        border-radius: 0.25rem 0.25rem 0 0;
      }
      .menu li:last-child {
        border-radius: 0 0 0.25rem 0.25rem;
      }
      .menu li:hover {
        background-color: #FB5EBF;
      }
      .menu a {
        display: block;
        margin: 0;
        padding: 0.6rem 1.2rem;
        color: #000;
        font-weight: 600;
      }
      .menu ul a {
        background-color: #000;
      }
      </style>
      <a class="open-btn" href="#" title="${__('techSupport')}">
        <svg
          width="32"
          height="32"
          focusable="false"
          aria-hidden="true"
          viewBox="0 0 24 24"
        >
            <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z">
            </path>
        </svg>
      </a>
      <ul class="menu">
        ${listItems}
      </ul>
    `;

    const openBtnEl = shadow.querySelector('.open-btn');
    const menuEl = shadow.querySelector('.menu');

    openBtnEl.addEventListener('click', (event) => {
      event.preventDefault();
      menuEl.style.display = menuEl.style.display === 'block' ? 'none' : 'block';
    });
  }
}

customElements.define('x-tech-support', TechSupport);
