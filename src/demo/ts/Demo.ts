import { TinyMCE } from 'tinymce';

import Plugin from '../../main/ts/Plugin';

declare let tinymce: TinyMCE;

Plugin();

tinymce.init({
  selector: 'textarea.tinymce',
  plugins: 'code tinymce-mathlive',
  toolbar: 'tinymce-mathlive',
  content_css: ['https://cdn.jsdelivr.net/npm/mathlive@0.69.7/dist/mathlive-fonts.css', 'https://cdn.jsdelivr.net/npm/mathlive@0.69.7/dist/mathlive-static.css']
});