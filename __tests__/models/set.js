import { sequelize, Set } from '../../index';

describe('Set', () => {
  describe('Class', () => {
    it('should be a valid model', () => {
      expect(Set).toBeDefined();
      expect(Set.rawAttributes).toBeDefined();
    });

    it('should have all the attributes', () => {
      expect(Set.rawAttributes.code).toBeDefined();
      expect(Set.rawAttributes.code.allowNull).toBe(false);
      expect(Set.rawAttributes.code.primaryKey).toBe(true);

      expect(Set.rawAttributes.language).toBeDefined();
      expect(Set.rawAttributes.language.allowNull).toBe(false);
      expect(Set.rawAttributes.language.primaryKey).toBe(true);

      expect(Set.rawAttributes.name).toBeDefined();
      expect(Set.rawAttributes.name.allowNull).toBe(false);

      expect(Set.rawAttributes.createdAt).toBeDefined();
      // eslint-disable-next-line no-underscore-dangle
      expect(Set._timestampAttributes.createdAt).toBe('createdAt');

      expect(Set.rawAttributes.updatedAt).toBeDefined();
      // eslint-disable-next-line no-underscore-dangle
      expect(Set._timestampAttributes.updatedAt).toBe('updatedAt');
    });
  });

  describe('Instance', () => {
    const code = 'aaa';
    const language = 'en';
    const name = 'set a';

    beforeEach(() => sequelize.sync({ force: true })
      .then(() => Promise.all([
        Set.create({ code, language, name }),
      ])));

    it('should have 1 row', () => Set.findAll()
      .then(sets => expect(sets).toHaveLength(1)));

    it('should have the "aaa" row', () => Set.findOne({ where: { code } })
      .then((set) => {
        expect(set).toBeDefined();
        expect(set).toBeInstanceOf(Object);
        expect(set.name).toBe(name);
      }));

    describe('Validation', () => {
      it('should not create a row without the "code" field', () => Set.create({ language, name })
        .then(() => { throw new Error('This test should throw an exception'); })
        .catch((err) => {
          expect(err).toBeDefined();
          expect(err.name).toBe('SequelizeValidationError');
          expect(err.errors[0].path).toBe('code');
        }));

      it('should not create a row without the "language" field', () => Set.create({ code, name })
        .then(() => { throw new Error('This test should throw an exception'); })
        .catch((err) => {
          expect(err).toBeDefined();
          expect(err.name).toBe('SequelizeValidationError');
          expect(err.errors[0].path).toBe('language');
        }));

      it('should not create a row without the "name" field', () => Set.create({ code, language })
        .then(() => { throw new Error('This test should throw an exception'); })
        .catch((err) => {
          expect(err).toBeDefined();
          expect(err.name).toBe('SequelizeValidationError');
          expect(err.errors[0].path).toBe('name');
        }));
    });
  });
});