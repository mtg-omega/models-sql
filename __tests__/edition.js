import { sequelize, Edition, EditionI18N, Single } from '../src';

describe('Sql', () => {
  describe('Edition', () => {
    describe('Model', () => {
      it('should be a model', () => {
        expect(Edition.name).toBe('edition');
        expect(Edition.tableName).toBe('editions');

        expect(Edition.attributes.code.primaryKey).toBe(true);
        expect(Edition.attributes.code.allowNull).toBe(false);

        expect(Edition.attributes.createdAt.allowNull).toBe(false);
        // eslint-disable-next-line no-underscore-dangle
        expect(Edition.attributes.createdAt._autoGenerated).toBe(true);

        expect(Edition.attributes.updatedAt.allowNull).toBe(false);
        // eslint-disable-next-line no-underscore-dangle
        expect(Edition.attributes.updatedAt._autoGenerated).toBe(true);

        // eslint-disable-next-line no-underscore-dangle
        expect(Edition._timestampAttributes.createdAt).toBe('createdAt');
        // eslint-disable-next-line no-underscore-dangle
        expect(Edition._timestampAttributes.updatedAt).toBe('updatedAt');

        expect(Edition.associations.i18n).toBeDefined();
        expect(Edition.associations.singles).toBeDefined();
      });

      it('should be an international model', () => {
        expect(EditionI18N.name).toBe('edition-i18n');
        expect(EditionI18N.tableName).toBe('editions-i18n');

        expect(EditionI18N.attributes.id.primaryKey).toBe(true);
        expect(EditionI18N.attributes.id.defaultValue).toBeDefined();

        expect(EditionI18N.attributes.language.fieldName).toBe('language');
        expect(EditionI18N.attributes.language.type.options.length).toBe(2);

        expect(EditionI18N.attributes.name.fieldName).toBe('name');

        expect(EditionI18N.attributes.createdAt.allowNull).toBe(false);
        // eslint-disable-next-line no-underscore-dangle
        expect(EditionI18N.attributes.createdAt._autoGenerated).toBe(true);

        expect(EditionI18N.attributes.updatedAt.allowNull).toBe(false);
        // eslint-disable-next-line no-underscore-dangle
        expect(EditionI18N.attributes.updatedAt._autoGenerated).toBe(true);

        // eslint-disable-next-line no-underscore-dangle
        expect(EditionI18N._timestampAttributes.createdAt).toBe('createdAt');
        // eslint-disable-next-line no-underscore-dangle
        expect(EditionI18N._timestampAttributes.updatedAt).toBe('updatedAt');

        expect(EditionI18N.associations.edition).toBeDefined();
      });
    });

    describe('Instance', () => {
      const code = 'aaa';

      const language = 'en';
      const name = 'Edition 1';

      const index = 5;

      beforeEach(() => sequelize.sync({ force: true })
        .then(() => Edition.create({
          code,
          i18n: [{ language, name }],
          singles: [{ index }],
        }, {
          include: [
            { model: EditionI18N, as: 'i18n' },
            { model: Single },
          ],
        })));

      it('should be an instance of Edition', () => Edition.findOne({ where: { code } })
        .then((edition) => {
          expect(edition.dataValues).toBeInstanceOf(Object);
          expect(edition.isNewRecord).toBe(false);


          expect(edition.code).toBe(code);
          expect(edition.createdAt).toBeInstanceOf(Date);
          expect(edition.updatedAt).toBeInstanceOf(Date);
        }));

      it('should retrieve 1 edition', () => Edition.findAll()
        .then((editions) => {
          expect(editions).toHaveLength(1);

          const [edition] = editions;
          expect(edition.code).toBe(code);
        }));

      it('should have 1 EditionI18N', () => Edition.findOne({ where: { code }, include: [{ model: EditionI18N, as: 'i18n' }] })
        .then((edition) => {
          expect(edition.i18n).toHaveLength(1);

          const [i18n] = edition.i18n;
          expect(i18n.language).toBe(language);
          expect(i18n.name).toBe(name);
        }));

      it('should have i18n shortcut', () => Edition.findOne({ where: { code }, include: [{ model: EditionI18N, as: 'i18n' }] })
        .then(edition => expect(edition.getName(language)).toBe(name) || expect(edition.getName('fr')).toBeNull()));

      describe('Associations', () => {
        it('should have the singles', () => Edition.findOne({ where: { code }, include: [{ model: Single }] })
          .then((edition) => {
            expect(edition.singles).toHaveLength(1);

            const [single] = edition.singles;
            expect(single.index).toBe(index);

            return single.getEdition();
          })
          .then(edition => expect(edition).toBeDefined() || expect(edition.code).toBe(code)));
      });
    });
  });
});
