const intl = {
  es: {
    bugReport: 'Reporta un problema',
    bugTitle: '[Bug] Reemplaza este texto con el título',
    bugBody: `**Describe el problema**
Descripción clara y concisa de cuál es el problema.

**Para reproducirlo**
Pasos para reproducir el problema:
1. Ir a '...'
2. Hacer click en '....'
3. Hacer scroll hacia abajo hasta '....'
4. Ver error

**Comportamiento esperado**
Descripción clara y concisa de qué esperabas que ocurriera.

**Screenshots**
Si es posible, agrega screenshots (capturas de pantalla) para ayudar a entender
el problema.

**Contexto adicional**
Agrega cualquier otra cosa que pueda ayudar a entender el contexto en el que
ocurre el problema.
`,

    featureRequest: 'Sugiere una mejora',
    featureTitle: '[Mejora] Reemplaza este texto con el título',
    featureBody: `**La mejora que quieres proponer hace relación a un problema?**
Descripción clara y concisa de cuál es el problema. Por ejemplo, siempre me
frustro cuando [...]

**Describe la solución que te gustaría**
Descripción clara y concisa de qué te gustaría que ocurra.

**¿Qué alternativas has considerado?**
Descripción clara y concisa de otras solucioines alternativas que hayas
considerado.

**Contexto adicional**
Agrega cualquier otra cosa que pueda ayudar a entender el contexto en el que
ocurre el problema.
`,
    questionAsk: 'Haz una pregunta',
    questionTitle: '[Pregunta] Reemplaza este texto con el título',
    questionBody: `En este espacio puedes agregar el contexto necesario:
texto, screenshots, etc.
`,
  },
  pt: {},
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

    const __ = createTranslator(lang);
    const buildURL = createURLBuilder(repo, lang);
    const shadow = this.attachShadow({ mode: 'open' });

    const bugURL = buildURL({
      title: __('bugTitle'),
      body: __('bugBody'),
      labels: ['bug'],
    });

    const featureURL = buildURL({
      title: __('featureTitle'),
      body: __('featureBody'),
      labels: ['enhancement'],
    });

    const otherURL = buildURL({
      title: __('questionTitle'),
      body: __('questionBody'),
      labels: ['question'],
    });

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
      <a class="toggle" href="#" title="Tech support">🛟</a>
      <div class="menu">
        <ul>
          <li>
            <a href="${bugURL}" target="_blank">
              ${__('bugReport')}
            </a>
          </li>
          <li>
            <a href="${featureURL}" target="_blank">
              ${__('featureRequest')}
            </a>
          </li>
          <li>
            <a href="${otherURL}" target="_blank">
              ${__('questionAsk')}
            </a>
          </li>
        </ul>
        <a class="close-btn" href="#">✖️ Cerrar</a>
      </div>
    `;

    const toggleEl = shadow.querySelector('.toggle');
    const menuEl = shadow.querySelector('.menu');
    const closeBtnEl = shadow.querySelector('.close-btn');

    toggleEl.addEventListener('click', (event) => {
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
