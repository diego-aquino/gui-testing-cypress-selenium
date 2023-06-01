describe('payments', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.findByLabelText('Username').type('sylius');
    cy.findByLabelText('Password').type('sylius');
    cy.findByRole('button', { name: 'Login' }).click();
  });

  it('should complete a new payment', () => {
    cy.findByRole('link', { name: 'Payments' }).click();

    cy.findByRole('combobox', { name: 'State' }).select('New');
    cy.findByRole('button', { name: 'Filter' }).click();
    cy.findAllByRole('button', { name: 'Complete' }).first().click();

    cy.findByText('Payment has been completed.').should('exist');
  });

  it('should clear payment filters', () => {
    cy.findByRole('link', { name: 'Payments' }).click();

    cy.findByRole('combobox', { name: 'State' }).select('New');
    cy.findByRole('combobox', { name: 'Channel' }).select('Fashion Web Store');
    cy.findByRole('link', { name: 'Clear filters' }).click();

    cy.findByRole('combobox', { name: 'State' }).should('have.value', '');
    cy.findByRole('combobox', { name: 'Channel' }).should('have.value', '');
  });

  it('should show a message if no payments were found with the current filters', () => {
    cy.findByRole('link', { name: 'Payments' }).click();

    cy.findByRole('combobox', { name: 'State' }).select('Refunded');
    cy.findByRole('combobox', { name: 'Channel' }).select('Fashion Web Store');
    cy.findByRole('button', { name: 'Filter' }).click();

    cy.findByText('There are no results to display').should('exist');
  });

  it('should navigate between payment list pages by clicking on "Next" and "Previous"', () => {
    cy.findByRole('link', { name: 'Payments' }).click();
    cy.url().should('not.include', 'page=1');
    cy.findAllByRole('link', { name: 'Previous' }).should('not.exist');

    cy.findAllByRole('link', { name: 'Next' }).first().click();
    cy.url().should('include', 'page=2');
    cy.findAllByRole('link', { name: 'Next' }).should('not.exist');

    cy.findAllByRole('link', { name: 'Previous' }).first().click();
    cy.url().should('include', 'page=1');
    cy.findAllByRole('link', { name: 'Previous' }).should('not.exist');
    cy.findAllByRole('link', { name: 'Next' }).first().should('exist');

    cy.findByRole('combobox', { name: 'State' }).select('Refunded');
    cy.findByRole('combobox', { name: 'Channel' }).select('Fashion Web Store');
    cy.findByRole('button', { name: 'Filter' }).click();

    cy.findAllByRole('link', { name: 'Previous' }).should('not.exist');
    cy.findAllByRole('link', { name: 'Next' }).should('not.exist');
  });

  it('should navigate between payment list pages by clicking on each page number', () => {
    cy.findByRole('link', { name: 'Payments' }).click();
    cy.url().should('not.include', 'page=1');
    cy.findAllByRole('link', { name: '1' }).should('not.exist');

    cy.findAllByRole('link', { name: '2' }).first().click();
    cy.url().should('include', 'page=2');
    cy.findAllByRole('link', { name: '2' }).should('not.exist');

    cy.findAllByRole('link', { name: '1' }).first().click();
    cy.url().should('include', 'page=1');
    cy.findAllByRole('link', { name: '1' }).should('not.exist');

    cy.findByRole('combobox', { name: 'State' }).select('Refunded');
    cy.findByRole('combobox', { name: 'Channel' }).select('Fashion Web Store');
    cy.findByRole('button', { name: 'Filter' }).click();

    cy.findAllByRole('link', { name: '1' }).should('not.exist');
    cy.findAllByRole('link', { name: '2' }).should('not.exist');
  });

  it('should limit the payment list', () => {
    cy.findByRole('link', { name: 'Payments' }).click();
    cy.url().should('not.include', 'limit=10');

    cy.findByText('Show 10').click();
    cy.findByRole('link', { name: '25' }).click();
    cy.url().should('include', 'limit=25');

    cy.findByText('Show 25').click();
    cy.findByRole('link', { name: '50' }).click();
    cy.url().should('include', 'limit=50');

    cy.findByText('Show 50').click();
    cy.findByRole('link', { name: '10' }).click();
    cy.url().should('include', 'limit=10');
  });
});
