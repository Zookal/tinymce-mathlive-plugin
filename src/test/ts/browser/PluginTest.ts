import { TinyAssertions, TinyHooks, TinyUiActions } from '@ephox/mcagar';

import Plugin from '../../../main/ts/Plugin';

// This an example of a browser test of the editor.
describe('browser.PluginTest', () => {
  const hook = TinyHooks.bddSetup({
    plugins: 'tinymce-mathlive',
    toolbar: 'tinymce-mathlive'
  }, [ Plugin ]);

  it('test click on button', () => {
    const editor = hook.editor();
    TinyUiActions.clickOnToolbar(editor, 'button:contains("tinymce-mathlive button")');
    TinyAssertions.assertContent(editor, '<p>content added from tinymce-mathlive</p>');
  });
});
