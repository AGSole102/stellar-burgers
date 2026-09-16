import ingredientsResponse from '../fixtures/ingredients.json';
import orderResponse from '../fixtures/order.json';

const burgerConstructorSelector = '[data-cy=burger-constructor]';
const bunTopSelector = '[data-cy=constructor-bun-top]';
const bunBottomSelector = '[data-cy=constructor-bun-bottom]';
const constructorIngredientsSelector = '[data-cy=constructor-ingredients]';
const modalSelector = '[data-cy=modal]';
const modalCloseSelector = '[data-cy=modal-close]';
const modalOverlaySelector = '[data-cy=modal-overlay]';
const ingredientDetailsSelector = '[data-cy=ingredient-details]';
const orderNumberSelector = '[data-cy=order-number]';

const accessToken = 'Bearer test-access-token';
const refreshToken = 'test-refresh-token';

const ingredients = ingredientsResponse.data;
const [bun, anotherBun] = ingredients.filter(({ type }) => type === 'bun');
const [main] = ingredients.filter(({ type }) => type === 'main');
const [sauce] = ingredients.filter(({ type }) => type === 'sauce');

const getIngredientSelector = (id: string) => `[data-cy=ingredient-${id}]`;

const addIngredient = (id: string) => {
  cy.get(getIngredientSelector(id)).contains('button', 'Добавить').click();
};

const openIngredientModal = (id: string) => {
  cy.get(getIngredientSelector(id)).find('a').click();
  cy.get(modalSelector).should('be.visible');
};

describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.wait('@getIngredients');
    });

    it('добавляет булку в верхнюю и нижнюю часть бургера', () => {
      cy.get(bunTopSelector).should('not.exist');
      cy.get(bunBottomSelector).should('not.exist');

      addIngredient(bun._id);

      cy.get(bunTopSelector).should('contain', `${bun.name} (верх)`);
      cy.get(bunBottomSelector).should('contain', `${bun.name} (низ)`);
    });

    it('заменяет ранее добавленную булку новой', () => {
      addIngredient(bun._id);
      addIngredient(anotherBun._id);

      cy.get(bunTopSelector)
        .should('contain', `${anotherBun.name} (верх)`)
        .and('not.contain', bun.name);
      cy.get(bunBottomSelector)
        .should('contain', `${anotherBun.name} (низ)`)
        .and('not.contain', bun.name);
    });

    it('добавляет начинку и соус в центральную часть бургера', () => {
      addIngredient(main._id);
      addIngredient(sauce._id);

      cy.get(constructorIngredientsSelector)
        .find('li')
        .should('have.length', 2);
      cy.get(constructorIngredientsSelector)
        .should('contain', main.name)
        .and('contain', sauce.name);
      cy.get(bunTopSelector).should('not.exist');
    });
  });

  describe('Модальное окно ингредиента', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.wait('@getIngredients');
    });

    it('открывает модальное окно с данными выбранного ингредиента', () => {
      cy.get(modalSelector).should('not.exist');

      openIngredientModal(main._id);

      cy.location('pathname').should('eq', `/ingredients/${main._id}`);
      cy.get(ingredientDetailsSelector)
        .should('contain', main.name)
        .and('contain', main.calories)
        .and('contain', main.proteins)
        .and('contain', main.fat)
        .and('contain', main.carbohydrates)
        .and('not.contain', bun.name);
    });

    it('закрывает модальное окно по клику на крестик', () => {
      openIngredientModal(main._id);

      cy.get(modalCloseSelector).click();

      cy.get(modalSelector).should('not.exist');
      cy.location('pathname').should('eq', '/');
    });

    it('закрывает модальное окно по клику на оверлей', () => {
      openIngredientModal(main._id);

      cy.get(modalOverlaySelector).click('topLeft');

      cy.get(modalSelector).should('not.exist');
      cy.location('pathname').should('eq', '/');
    });
  });

  describe('Оформление заказа', () => {
    beforeEach(() => {
      cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as(
        'getUser'
      );
      cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
        'createOrder'
      );
      cy.intercept('GET', 'api/orders/all', { fixture: 'feed.json' }).as(
        'getFeeds'
      );

      window.localStorage.setItem('refreshToken', refreshToken);
      cy.setCookie('accessToken', accessToken);

      cy.visit('/');
      cy.wait(['@getIngredients', '@getUser']);
    });

    afterEach(() => {
      window.localStorage.removeItem('refreshToken');
      cy.clearCookie('accessToken');
    });

    it('оформляет заказ, показывает его номер и очищает конструктор', () => {
      addIngredient(bun._id);
      addIngredient(main._id);
      addIngredient(sauce._id);

      cy.get(burgerConstructorSelector)
        .contains('button', 'Оформить заказ')
        .click();

      cy.wait('@createOrder').then(({ request }) => {
        expect(request.headers.authorization).to.equal(accessToken);
        expect(request.body).to.deep.equal({
          ingredients: [bun._id, main._id, sauce._id, bun._id]
        });
      });

      cy.get(modalSelector).should('be.visible');
      cy.get(orderNumberSelector).should(
        'have.text',
        String(orderResponse.order.number)
      );

      cy.get(modalCloseSelector).click();
      cy.get(modalSelector).should('not.exist');

      cy.get(bunTopSelector).should('not.exist');
      cy.get(bunBottomSelector).should('not.exist');
      cy.get(constructorIngredientsSelector).find('li').should('not.exist');
      cy.get(burgerConstructorSelector)
        .should('contain', 'Выберите булки')
        .and('contain', 'Выберите начинку');
    });
  });
});
