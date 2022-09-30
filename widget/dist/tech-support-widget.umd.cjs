(function(c){typeof define=="function"&&define.amd?define(c):c()})(function(){"use strict";const c=[{fname:"bug_report.es.md",id:"bug_report",lang:"es",headers:{name:"Reporta un problema",about:"Reporta un problema que hayas identificado para ayudarnos a mejorar",title:"[Bug] Reemplaza este texto con el t\xEDtulo",labels:"bug",assignees:"",lang:"es"},body:`**Describe el problema**
Descripci\xF3n clara y concisa de cu\xE1l es el problema.

**Para reproducirlo**
Pasos para reproducir el problema:
1. Ir a '...'
2. Hacer click en '....'
3. Hacer scroll hacia abajo hasta '....'
4. Ver error

**Comportamiento esperado**
Descripci\xF3n clara y concisa de qu\xE9 esperabas que ocurriera.

**Screenshots**
Si es posible, agrega screenshots (capturas de pantalla) para ayudar a entender
el problema.

**Contexto adicional**
Agrega cualquier otra cosa que pueda ayudar a entender el contexto en el que
ocurre el problema.`},{fname:"feature_request.es.md",id:"feature_request",lang:"es",headers:{name:"Sugiere una mejora",about:"Prop\xF3n una idea de mejora que te gustar\xEDa ver",title:"[Mejora] Reemplaza este texto con el t\xEDtulo",labels:"enhancement",assignees:""},body:`**La mejora que quieres proponer hace relaci\xF3n a un problema?**
Descripci\xF3n clara y concisa de cu\xE1l es el problema. Por ejemplo, siempre me
frustro cuando [...]

**Describe la soluci\xF3n que te gustar\xEDa**
Descripci\xF3n clara y concisa de qu\xE9 te gustar\xEDa que ocurra.

**\xBFQu\xE9 alternativas has considerado?**
Descripci\xF3n clara y concisa de otras solucioines alternativas que hayas
considerado.

**Contexto adicional**
Agrega cualquier otra cosa que pueda ayudar a entender el contexto en el que
ocurre el problema.`},{fname:"question.es.md",id:"question",lang:"es",headers:{name:"Haz una pregunta",about:"\xBFTienes alguna duda o comentario?",title:"[Pregunta] Reemplaza este texto con el t\xEDtulo",labels:"question",assignees:""},body:"En este espacio puedes agregar el contexto necesario: texto, screenshots, etc."}],g={es:{techSupport:"Tech support",close:"Cerrar"},pt:{techSupport:"Tech support",close:"Fechar"}},b=t=>r=>g[t][r]||r,h=t=>`

***

## Entorno

**Location**: \`${window.location}\`
**User Agent**: \`${navigator.userAgent}\`
**Navigator Language**: \`${navigator.language}\`
**Selected Language**: \`${t}\`
`,f=(t,r)=>({title:e,body:d,labels:s,assignees:l,template:n})=>{const i={...!!e&&{title:e},...!!s&&{labels:s},...!!l&&{assignees:l},...!!n&&{template:n},body:`${d}${h(r)}`},p=Object.keys(i).reduce((u,o)=>`${u?`${u}&`:""}${o}=${encodeURIComponent(`${i[o]}`)}`,"");return`https://github.com/${t}/issues/new?${p}`};class y extends HTMLElement{constructor(){super()}connectedCallback(){const r=this.getAttribute("repo")||"Laboratoria/tech-support",e=this.getAttribute("lang")||"es";if(!["es","pt"].includes(e))return alert(`[TechSupport] Unsupported lang: ${e}`);const d=c.filter(a=>a.lang===e),s=b(e),l=f(r,e),n=this.attachShadow({mode:"open"}),i=d.reduce((a,m)=>{const q=l({...m.headers,body:m.body});return`${a}
          <li>
            <a href="${q}" target="_blank">
              ${m.headers.name}
            </a>
          </li>
        `},"");n.innerHTML=`
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
      <a class="open-btn" href="#" title="${s("techSupport")}">\u{1F6DF}</a>
      <div class="menu">
        <ul>
          ${i}
        </ul>
        <a class="close-btn" href="#">\u2716\uFE0F ${s("close")}</a>
      </div>
    `;const p=n.querySelector(".open-btn"),u=n.querySelector(".close-btn"),o=n.querySelector(".menu");p.addEventListener("click",a=>{a.preventDefault(),o.style.display=o.style.display==="flex"?"none":"flex"}),u.addEventListener("click",a=>{a.preventDefault(),o.style.display="none"})}}customElements.define("x-tech-support",y)});
