import { EmsPage } from './app.po';

describe('ems App', () => {
  let page: EmsPage;

  beforeEach(() => {
    page = new EmsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
