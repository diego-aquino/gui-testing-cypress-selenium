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
});
