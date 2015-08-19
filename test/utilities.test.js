describe('utilities', function() {
  describe('stripText', function() {
    it('returns an empty string if no string is provided', function() {
      expect(stripText(null)).toBe('');
      expect(stripText()).toBe('');
    });
    it('removes bold tags', function() {
      expect(stripText('Something <b>important</b> here')).toBe('Something important here');
    });
    it('removes italic tags', function() {
      expect(stripText('Something <i>important</i> here')).toBe('Something important here');
    });
    it('trims excess spaces', function() {
      expect(stripText('Something <i>important     </i>')).toBe('Something important');
    });
    it('removes removes all spaces from file names', function() {
      expect(stripText('File name', true)).toBe('Filename');
    });
    it('removes removes all non alpha-numeric characters from file names', function() {
      expect(stripText('[]#~:;File"£$%^&* name!()-+@{}', true)).toBe('Filename');
    });
  });

  describe('isPage', function() {
    it('returns false if title is empty', function() {
      expect(isPage('')).toBe('');
    });
    it('returns false if title is Content', function() {
      expect(isPage('Content')).toBe(false);
    });
    it('returns false if title contains "no sub-nav"', function() {
      expect(isPage('abc-no sub-nav-def')).toBe(false);
    });
    it('returns false if title starts with ~', function() {
      expect(isPage('~Something')).toBe(false);
    });
    it('returns true otherwise', function() {
      expect(isPage('Something~')).toBe(true);
    });
  });
});