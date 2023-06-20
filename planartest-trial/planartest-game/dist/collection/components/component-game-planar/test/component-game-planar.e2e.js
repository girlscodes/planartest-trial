import { newE2EPage } from '@stencil/core/testing';
describe('component-game-planar', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<component-game-planar></component-game-planar>');
    const element = await page.find('component-game-planar');
    expect(element).toHaveClass('hydrated');
  });
});
//# sourceMappingURL=component-game-planar.e2e.js.map
