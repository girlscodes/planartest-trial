import { newSpecPage } from '@stencil/core/testing';
import { ComponentGamePlanar } from '../component-game-planar';
describe('component-game-planar', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ComponentGamePlanar],
      html: `<component-game-planar></component-game-planar>`,
    });
    expect(page.root).toEqualHtml(`
      <component-game-planar>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </component-game-planar>
    `);
  });
});
//# sourceMappingURL=component-game-planar.spec.js.map
