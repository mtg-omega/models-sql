import { sequelize, Single, SingleI18N, Edition } from '../../sql';

describe('Sql', () => {
  describe('Single', () => {
    describe('Model', () => {
      it('should be a model', () => {
        expect(Single.name).toBe('single');
        expect(Single.tableName).toBe('singles');

        expect(Single.attributes.id.primaryKey).toBe(true);
        expect(Single.attributes.id.defaultValue).toBeDefined();

        expect(Single.attributes.index.allowNull).toBe(false);

        expect(Single.attributes.power.fieldName).toBe('power');
        expect(Single.attributes.toughness.fieldName).toBe('toughness');
        expect(Single.attributes.loyalty.fieldName).toBe('loyalty');
        expect(Single.attributes.mana.fieldName).toBe('mana');
        expect(Single.attributes.rarity.fieldName).toBe('rarity');
        expect(Single.attributes.artist.fieldName).toBe('artist');

        expect(Single.attributes.createdAt.allowNull).toBe(false);
        // eslint-disable-next-line no-underscore-dangle
        expect(Single.attributes.createdAt._autoGenerated).toBe(true);

        expect(Single.attributes.updatedAt.allowNull).toBe(false);
        // eslint-disable-next-line no-underscore-dangle
        expect(Single.attributes.updatedAt._autoGenerated).toBe(true);

        expect(Single._timestampAttributes.createdAt).toBe('createdAt'); // eslint-disable-line no-underscore-dangle
        expect(Single._timestampAttributes.updatedAt).toBe('updatedAt'); // eslint-disable-line no-underscore-dangle

        expect(Single.associations.i18n).toBeDefined();
        expect(Single.associations.edition).toBeDefined();
      });

      it('should be an international model', () => {
        expect(SingleI18N.name).toBe('single-i18n');
        expect(SingleI18N.tableName).toBe('singles-i18n');

        expect(SingleI18N.attributes.id.primaryKey).toBe(true);
        expect(SingleI18N.attributes.id.defaultValue).toBeDefined();

        expect(SingleI18N.attributes.language.fieldName).toBe('language');
        expect(SingleI18N.attributes.language.type.options.length).toBe(2);

        expect(SingleI18N.attributes.name.fieldName).toBe('name');
        expect(SingleI18N.attributes.typeStr.fieldName).toBe('typeStr');

        expect(SingleI18N.attributes.createdAt.allowNull).toBe(false);
        // eslint-disable-next-line no-underscore-dangle
        expect(SingleI18N.attributes.createdAt._autoGenerated).toBe(true);

        expect(SingleI18N.attributes.updatedAt.allowNull).toBe(false);
        // eslint-disable-next-line no-underscore-dangle
        expect(SingleI18N.attributes.updatedAt._autoGenerated).toBe(true);

        expect(SingleI18N._timestampAttributes.createdAt).toBe('createdAt'); // eslint-disable-line no-underscore-dangle
        expect(SingleI18N._timestampAttributes.updatedAt).toBe('updatedAt'); // eslint-disable-line no-underscore-dangle

        expect(SingleI18N.associations.single).toBeDefined();
      });
    });

    describe('Instance', () => {
      const index = 4;

      const language = 'en';
      const name = 'Single 1';
      const typeStr = 'typeStr';

      const code = 'ccc';

      beforeEach(() => sequelize.sync({ force: true })
        .then(() => Single.create({
          index,
          i18n: { language, name, typeStr },
          edition: { code },
        }, {
          include: [
            { model: SingleI18N, as: 'i18n' },
            { model: Edition },
          ],
        })));

      it('should be an instance of Single', () => Single.findOne({ where: { index } })
        .then((single) => {
          expect(single.dataValues).toBeInstanceOf(Object);
          expect(single.isNewRecord).toBe(false);


          expect(single.id).toMatch(/^.+-.+-.+-.+$/);
          expect(single.index).toBe(index);
          expect(single.createdAt).toBeInstanceOf(Date);
          expect(single.updatedAt).toBeInstanceOf(Date);
        }));

      it('should retrieve 1 Single', () => Single.findAll()
        .then((singles) => {
          expect(singles).toHaveLength(1);

          const [single] = singles;
          expect(single.index).toBe(index);
        }));

      it('should have 1 SingleI18N', () => Single.findOne({ where: { index }, include: [{ model: SingleI18N, as: 'i18n' }] })
        .then((single) => {
          expect(single.i18n).toHaveLength(1);

          const [i18n] = single.i18n;
          expect(i18n.language).toBe(language);
          expect(i18n.name).toBe(name);
          expect(i18n.typeStr).toBe(typeStr);
        }));

      it('should have i18n shortcut', () => Single.findOne({ where: { index }, include: [{ model: SingleI18N, as: 'i18n' }] })
        .then(single => expect(single.getName(language)).toBe(name) || expect(single.getName('fr')).toBeNull()));

      describe('Associations', () => {
        it('should have its edition', () => Single.findOne({ where: { index }, include: [{ model: Edition }] })
          .then(({ edition }) => {
            expect(edition).toBeDefined();
            expect(edition.code).toBe(code);
          }));
      });
    });
  });
});
