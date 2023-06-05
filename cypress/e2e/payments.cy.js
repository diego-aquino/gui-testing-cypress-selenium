// We recommend testing this file using the Cypress interface (cypress open), which usually results in less flaky tests.
// If you encounter a "Permission denied" or log in error, please rerun the tests one or more times and they should pass.

describe('payments', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.findByLabelText('Username').type('sylius');
    cy.findByLabelText('Password').type('sylius');
    cy.findByRole('button', { name: 'Login' }).click();
  });

  // Test 1
  it('should complete a new payment', () => {
    cy.findByRole('link', { name: 'Payments' }).click();

    cy.findByRole('combobox', { name: 'State' }).select('New');
    cy.findByRole('button', { name: 'Filter' }).click();
    cy.findAllByRole('button', { name: 'Complete' }).first().click();

    cy.findByText('Payment has been completed.').should('exist');
  });

  // Test 2
  it('should clear payment filters', () => {
    cy.findByRole('link', { name: 'Payments' }).click();

    cy.findByRole('combobox', { name: 'State' }).select('New');
    cy.findByRole('combobox', { name: 'Channel' }).select('Fashion Web Store');
    cy.findByRole('button', { name: 'Filter' }).click();
    cy.findByRole('link', { name: 'Clear filters' }).click();

    cy.findByRole('combobox', { name: 'State' }).should('have.value', '');
    cy.findByRole('combobox', { name: 'Channel' }).should('have.value', '');
  });

  // Test 3
  it('should show a message if no payments were found with the current filters', () => {
    cy.findByRole('link', { name: 'Payments' }).click();

    cy.findByRole('combobox', { name: 'State' }).select('Failed');
    cy.findByRole('combobox', { name: 'Channel' }).select('Fashion Web Store');
    cy.findByRole('button', { name: 'Filter' }).click();

    cy.findByText('There are no results to display').should('exist');
  });

  // Test 4
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

    cy.findByRole('combobox', { name: 'State' }).select('Failed');
    cy.findByRole('combobox', { name: 'Channel' }).select('Fashion Web Store');
    cy.findByRole('button', { name: 'Filter' }).click();

    cy.findAllByRole('link', { name: 'Previous' }).should('not.exist');
    cy.findAllByRole('link', { name: 'Next' }).should('not.exist');
  });

  // Test 5
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

    cy.findByRole('combobox', { name: 'State' }).select('Failed');
    cy.findByRole('combobox', { name: 'Channel' }).select('Fashion Web Store');
    cy.findByRole('button', { name: 'Filter' }).click();

    cy.findAllByRole('link', { name: '1' }).should('not.exist');
    cy.findAllByRole('link', { name: '2' }).should('not.exist');
  });

  // Test 6
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

  // Test 7
  it('should order orders by Date', () => {
    cy.findByRole('link', { name: 'Payments' }).click();

    cy.findByText('Date').click();
    // sorting[createdAt] => sorting%5BcreatedAt%5D
    cy.url().should('include', 'sorting%5BcreatedAt%5D=asc');

    cy.findByText('Date').click();
    cy.url().should('include', 'sorting%5BcreatedAt%5D=desc');

    cy.findAllByRole('link', { name: '2' }).first().click();
    cy.url().should('include', 'sorting%5BcreatedAt%5D=desc');
  })

  // Test 8
  it('order link should go to the correct order', () => {
    cy.findByRole('link', { name: 'Payments' }).click();

    cy.findByRole('combobox', { name: 'State' }).select('Completed');
    cy.findByRole('button', { name: 'Filter' }).click();

    cy.findAllByRole('link', { name: /#\d+/ }).first().invoke('text').then(order => {
      cy.log('order number is', order);
      const orderId = parseInt(order.replace('#', ''), 10);
      cy.log('order id is', orderId);

      cy.findByRole('link', { name: order }).click();

      cy.url().should('include', '/admin/orders/' + orderId);
      cy.findByText("Order " + order).should('exist');

      cy.findByRole('link', { name: 'Payments' }).click();

      cy.findByRole('combobox', { name: 'State' }).select('Completed');
      cy.findByRole('button', { name: 'Filter' }).click();

      cy.findByText(order).should('exist');
    });
  })

  // Test 9
  it('should refund orders', () => {
    cy.findByRole('link', { name: 'Payments' }).click();

    cy.findByRole('combobox', { name: 'State' }).select('Completed');
    cy.findByRole('button', { name: 'Filter' }).click();

    cy.findAllByRole('link', { name: /#\d+/ }).first().invoke('text').then(order => {
      cy.log('order number is', order)

      cy.findByRole('link', { name: order }).click();

      cy.findByRole('button', { name: "Refund" }).click();

      cy.findByText('Payment has been successfully refunded.').should('exist');

      cy.findByRole('link', { name: 'Payments' }).click();

      cy.findByRole('combobox', { name: 'State' }).select('Refunded');
      cy.findByRole('button', { name: 'Filter' }).click();

      cy.findByText(order).should('exist');
    });
  })

  // Test 10
  it('should filter payments by State', () => {
    cy.findByRole('link', { name: 'Payments' }).click();

    cy.findByRole('combobox', { name: 'State' }).select('Completed');
    cy.findByRole('button', { name: 'Filter' }).click();

    cy.findByText('New', { selector: 'span.ui.olive.label'}).should('not.exist');
    cy.findByText('Refunded', { selector: 'span.ui.purple.label' }).should('not.exist');
    cy.findAllByText('Completed', { selector: 'span.ui.green.label' }).should('exist');

    cy.findByRole('combobox', { name: 'State' }).select('New');
    cy.findByRole('button', { name: 'Filter' }).click();

    cy.findByText('Refunded', { selector: 'span.ui.purple.label' }).should('not.exist');
    cy.findByText('Completed', { selector: 'span.ui.green.label' }).should('not.exist');
    cy.findAllByText('New', { selector: 'span.ui.olive.label'}).should('exist');
  })

  // Test 11 (extra)
  it('should complete a new payment through its page', () => {
    cy.findByRole('link', { name: 'Payments' }).click();

    cy.findByRole('combobox', { name: 'State' }).select('New');
    cy.findByRole('button', { name: 'Filter' }).click();

    cy.findAllByRole('link', { name: /#\d+/ }).first().invoke('text').then(order => {
      cy.log('order number is', order)

      cy.findByRole('link', { name: order }).click();

      cy.findByRole('button', { name: "Complete" }).click();

      cy.findByText('Payment has been successfully updated.').should('exist');

      cy.findByRole('link', { name: 'Payments' }).click();

      cy.findByRole('combobox', { name: 'State' }).select('Completed');
      cy.findByRole('button', { name: 'Filter' }).click();

      cy.findByText(order).should('exist');
    });
  });
});
