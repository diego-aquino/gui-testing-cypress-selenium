describe('payments', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.findByLabelText('Username').type('sylius');
    cy.findByLabelText('Password').type('sylius');
    cy.findByRole('button', { name: 'Login' }).click();
  });

  it('complete a new payment', () => {
    cy.findByRole('link', { name: 'Payments' }).click();

    cy.findByRole('combobox', { name: 'State' }).select('New');
    cy.findByRole('button', { name: 'Filter' }).click();
    cy.findByRole('button', { name: 'Complete' }).click();

    cy.findByText('Payment has been completed.').should('exist');
  });

  it('clear payment filters', () => {
    cy.findByRole('link', { name: 'Payments' }).click();

    cy.findByRole('combobox', { name: 'State' }).select('New');
    cy.findByRole('combobox', { name: 'Channel' }).select('Fashion Web Store');
    cy.findByRole('link', { name: 'Clear filters' }).click();

    cy.findByRole('combobox', { name: 'State' }).should('have.value', '');
    cy.findByRole('combobox', { name: 'Channel' }).should('have.value', '');
  });
});
