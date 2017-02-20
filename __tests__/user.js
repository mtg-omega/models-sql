import { sequelize, User } from '../src';

describe('Sql', () => {
  describe('User', () => {
    describe('Model', () => {
      it('should be a model', () => {
        expect(User.name).toBe('user');
        expect(User.tableName).toBe('users');

        expect(User.attributes.id.primaryKey).toBe(true);
        expect(User.attributes.id.defaultValue).toBeDefined();

        expect(User.attributes.email.allowNull).toBe(false);
        expect(User.attributes.email.unique).toBe(true);
        expect(User.attributes.email.validate.isEmail).toBe(true);

        expect(User.attributes.password.field).toBe('password');
        expect(User.attributes.password.set).toBeDefined();
        expect(User.attributes.password.get).toBeDefined();

        expect(User.attributes.createdAt.allowNull).toBe(false);
        // eslint-disable-next-line no-underscore-dangle
        expect(User.attributes.createdAt._autoGenerated).toBe(true);

        expect(User.attributes.updatedAt.allowNull).toBe(false);
        // eslint-disable-next-line no-underscore-dangle
        expect(User.attributes.updatedAt._autoGenerated).toBe(true);

        // eslint-disable-next-line no-underscore-dangle
        expect(User._timestampAttributes.createdAt).toBe('createdAt');
        // eslint-disable-next-line no-underscore-dangle
        expect(User._timestampAttributes.updatedAt).toBe('updatedAt');
      });
    });

    describe('Instance', () => {
      const email = 'foo@bar.com';

      beforeEach(() => sequelize.sync({ force: true })
        .then(() => User.create({ email })));

      it('should retrieve 1 user', () => User.findAll()
        .then((users) => {
          expect(users).toHaveLength(1);

          const [user] = users;
          expect(user.email).toBe(email);
        }));

      it('should retrieve the user', () => User.findOne({ where: { email } })
        .then(user => expect(user.email).toBe(email)));

      describe('Password', () => {
        const password = 'foo';

        it('should encrypt the password', () => User.findOne({ where: { email } })
          .then((user) => {
            user.password = password; // eslint-disable-line no-param-reassign

            const encrypted = user.getDataValue('password');
            expect(encrypted).toBeDefined();

            const isValid = user.validatePassword(password);
            expect(isValid).toBe(true);
          }));
      });
    });
  });
});
