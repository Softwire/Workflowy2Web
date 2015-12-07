define([
  'src/utilities'
], function(Util) {
  describe('utilities', function () {
    describe('stripText', function () {
      it('returns an empty string if no string is provided', function () {
        expect(Util.stripText(null)).toBe('');
        expect(Util.stripText()).toBe('');
      });
      it('removes bold tags', function () {
        expect(Util.stripText('Something <b>important</b> here')).toBe('Something important here');
      });
      it('removes italic tags', function () {
        expect(Util.stripText('Something <i>important</i> here')).toBe('Something important here');
      });
      it('trims excess spaces', function () {
        expect(Util.stripText('Something <i>important     </i>')).toBe('Something important');
      });
      it('removes removes all spaces from file names', function () {
        expect(Util.stripText('File name', true)).toBe('Filename');
      });
      it('removes removes all non alpha-numeric characters from file names', function () {
        expect(Util.stripText('[]#~:;File"�$%^&* name!()-+@{}', true)).toBe('Filename');
      });
    });

    describe('isPage', function () {
      it('returns false if title is empty', function () {
        expect(Util.isPage('')).toBe('');
      });
      it('returns false if title is Content', function () {
        expect(Util.isPage('Content')).toBe(false);
      });
      it('returns false if title starts with ~', function () {
        expect(Util.isPage('~Something')).toBe(false);
      });
      it('returns true otherwise', function () {
        expect(Util.isPage('Something~')).toBe(true);
      });
    });
  });
});