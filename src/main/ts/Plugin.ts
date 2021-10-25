import { Editor, TinyMCE } from 'tinymce';
import 'mathlive'
import {MathfieldElement} from "mathlive";
const style = `
  .tox .tox-dialog, .tox .tox-dialog__body-content {
    overflow: visible
  }
  .ML__keyboard {
    z-index: 9998
  }
`

declare const tinymce: TinyMCE;
const ID = 'formula'
const mathjaxClassName = 'math-tex'
const mathjaxTempClassName = mathjaxClassName + '-original'
const mathjaxSymbols = {start: '\\(', end: '\\)'}
const getMathText = (value) => {
  return `${mathjaxSymbols.start} ${value} ${mathjaxSymbols.end}`
}

const setup = (editor: Editor): void => {

  const checkElement = (element) => {
    if (element.childNodes.length != 2) {
      element.setAttribute('contenteditable', false);
      element.style.cursor = 'pointer';
      const latex = element.getAttribute('data-latex') || element.innerHTML;
      element.setAttribute('data-latex', latex);
      element.innerHTML = '';

      const math = editor.dom.create('span');
      math.innerHTML = latex;
      math.classList.add(mathjaxTempClassName);
      element.appendChild(math);

      const dummy = editor.dom.create('span');
      dummy.classList.add('dummy');
      dummy.innerHTML = 'dummy';
      dummy.setAttribute('hidden', 'hidden');
      element.appendChild(dummy);
    }
  }
  editor.on("click", function (e) {
    const closest = e.target.closest('.' + mathjaxClassName);
    if (closest) {
      editor.execCommand('open', closest)
    }
  });

  editor.on('init', () => {
    const configScript = editor.dom.create('script', {
      id: 'mathjax-config',
      type: 'text/javascript',
    })
    configScript.innerHTML = 'MathJax = {' +
      'loader: {load: [\'[tex]/physics\']},' +
      'tex: {packages: {\'[+]\': [\'physics\']}}' +
      '}'
    const script = editor.dom.create('script', { id: 'mathjax', type: 'text/javascript', src: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.0/es5/tex-mml-chtml.min.js'})
    editor.getDoc().getElementsByTagName('head')[0].appendChild(configScript)
    editor.getDoc().getElementsByTagName('head')[0].appendChild(script)
  })

  editor.on('BeforeSetContent', (e) => {
    const div = editor.dom.create('div')
    div.innerHTML = e.content
    const elements = div.querySelectorAll('.' + mathjaxClassName)
    for (let i = 0 ; i < elements.length; i++) {
      checkElement(elements[i])
    }
    e.content = div.innerHTML
  })

  editor.on('SetContent', () => {
    if (editor.getDoc().defaultView.MathJax && editor.getDoc().defaultView.MathJax.startup) {
      editor.getDoc().defaultView.MathJax.startup.getComponents()
      editor.getDoc().defaultView.MathJax.typeset()
    }
  })
  //
  editor.on('Change', () => {
    const elements = editor.dom.getRoot().querySelectorAll('.' + mathjaxClassName);
    if (elements.length) {
      for (let i = 0 ; i < elements.length; i++) {
        checkElement(elements[i]);
      }
      if (editor.getDoc().defaultView.MathJax) {
        editor.getDoc().defaultView.MathJax.startup.getComponents();
        editor.getDoc().defaultView.MathJax.typeset();
      }
    }
  })

  editor.addCommand('insert', (_ui: undefined, data) => {
    if (!data) {
      return
    }
    const { value } = data
    const content = editor.getDoc().createElement('span')
    content.innerHTML = getMathText(value)
    content.classList.add(mathjaxClassName)
    checkElement(content)

    editor.insertContent(content.outerHTML)
    editor.getDoc().defaultView.MathJax.startup.getComponents()
    editor.getDoc().defaultView.MathJax.typeset()
  })

  editor.addCommand('open', (target) => {
    editor.windowManager.open({
      title: 'Enter your math expression',
      body: {
        type: 'panel',
        items: [
          {
            type: 'htmlpanel',
            html: `<math-field id="${ID}" virtual-keyboard-mode="manual"></math-field><style>${style}</style>`,
          }
        ]
      },
      buttons: [
        {
          type: 'cancel',
          text: 'close',
        },
        {
          type: 'submit',
          text: 'insert',
          primary: true,
        },
      ],
      onSubmit: () => {
        editor.execCommand('insert', undefined, document.getElementById(ID))
        editor.windowManager.close()
      },
    })
    if (target) {
      let latex = ''
      const latexAttribute = target.getAttribute('data-latex')
      if (latexAttribute.length >= (mathjaxSymbols.start + mathjaxSymbols.end).length) {
        latex = latexAttribute.substr(mathjaxSymbols.start.length, latexAttribute.length - (mathjaxSymbols.start + mathjaxSymbols.end).length);
      }
      const mf = document.getElementById(ID) as MathfieldElement
      mf.value = latex
    }
  })




  editor.ui.registry.addButton('tinymce-mathlive', {
    text: 'f(x)',
    onAction: () => {
      editor.execCommand('open')
    }
  });
};

export default (): void => {
  tinymce.PluginManager.add('tinymce-mathlive', setup);
};
