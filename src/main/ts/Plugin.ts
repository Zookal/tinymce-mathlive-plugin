import { Editor, TinyMCE } from 'tinymce';
import { MathfieldElement} from 'mathlive';

declare const tinymce: TinyMCE;

const setup = (editor: Editor, _url: string): void => {
  editor.ui.registry.addButton('tinymce-mathlive', {
    text: 'f(x)',
    onAction: () => {
      const mfe = new MathfieldElement({virtualKeyboardMode: 'manual'})
      // const styleLoader = new tinymce.dom.StyleSheetLoader(document, {})
      // styleLoader.load('../style.css', () => {
      //   console.log(1)
      // })

      // tinymce.ScriptLoader.load('https://unpkg.com/mathlive/dist/mathlive.min.js')
      editor.windowManager.open({
        title: 'Enter your math expression',
        body: {
          type: 'panel',
          items: [
            {
              type: 'htmlpanel',
              html: mfe.outerHTML
            }
          ]
        },
        buttons: [],

      })
    }
  });
};

export default (): void => {
  tinymce.PluginManager.add('tinymce-mathlive', setup);
};
