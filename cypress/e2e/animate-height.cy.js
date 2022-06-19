const ANIMATION_STARTED_TIME = 100;
const ANIMATION_FINISHED_TIME = 500;

describe('React AnimateHeight', function () {
  Cypress.on('window:before:load', (win) => {
    cy.spy(win.console, 'warn');
  });

  it('Animates content to correct height and applies accessibility properties', function () {
    cy.visit('http://localhost:8080');

    cy.window().then((win) => {
      let element;
      let nativeElement;
      let contentElement;

      // Animate to auto
      function toAuto() {
        cy.get('#test-1-auto').click();

        cy.wait(ANIMATION_STARTED_TIME).then(() => {
          contentElement = cy.get('#test-1 > div');
          contentElement.invoke('css', 'height').then((contentHeight) => {
            element = cy.get('#test-1');
            element.should('have.css', 'height', contentHeight);
          });
        });

        cy.wait(ANIMATION_FINISHED_TIME).then(() => {
          contentElement = cy.get('#test-1 > div');
          contentElement.invoke('css', 'height').then((contentHeight) => {
            cy.expect(nativeElement.style.height).to.equal('auto');
            cy.expect(nativeElement.getAttribute('aria-hidden')).to.equal(
              'false'
            );

            element = cy.get('#test-1');
            element.should('have.css', 'height', contentHeight);

            contentElement.should('have.css', 'display', 'block');
          });
        });
      }

      // Animate to zero
      function toZero() {
        cy.get('#test-1-0').click();

        cy.wait(ANIMATION_STARTED_TIME).then(() => {
          element = cy.get('#test-1');
          element.should('have.css', 'height', '0px');
        });

        cy.wait(ANIMATION_FINISHED_TIME).then(() => {
          cy.expect(nativeElement.style.height).to.equal('0px');

          cy.expect(nativeElement.getAttribute('aria-hidden')).to.equal('true');

          element = cy.get('#test-1');
          element.should('have.css', 'height', '0px');

          contentElement = cy.get('#test-1 > div');
          contentElement.should('have.css', 'display', 'none');
        });
      }

      // Animate to specific
      function toSpecific() {
        cy.get('#test-1-100').click();

        cy.wait(ANIMATION_STARTED_TIME).then(() => {
          element = cy.get('#test-1');
          element.should('have.css', 'height', '100px');
        });

        cy.wait(ANIMATION_FINISHED_TIME).then(() => {
          cy.expect(nativeElement.style.height).to.equal('100px');

          cy.expect(nativeElement.getAttribute('aria-hidden')).to.equal(
            'false'
          );

          element = cy.get('#test-1');
          element.should('have.css', 'height', '100px');

          contentElement = cy.get('#test-1 > div');
          contentElement.should('have.css', 'display', 'block');
        });
      }

      // Animate to percentage height
      function toPercentage() {
        cy.get('#test-1-50percent').click();

        cy.wait(ANIMATION_STARTED_TIME).then(() => {
          element = cy.get('#test-1');
          element.should('have.css', 'height', '250px');
        });

        cy.wait(ANIMATION_FINISHED_TIME).then(() => {
          cy.expect(nativeElement.style.height).to.equal('50%');

          cy.expect(nativeElement.getAttribute('aria-hidden')).to.equal(
            'false'
          );

          element = cy.get('#test-1');
          element.should('have.css', 'height', '250px');

          contentElement = cy.get('#test-1 > div');
          contentElement.should('have.css', 'display', 'block');
        });
      }

      cy.get('#test-1').then((cyElement) => {
        nativeElement = cyElement[0];

        element = cy.get('#test-1');
        element.should('have.css', 'height', '0px');

        contentElement = cy.get('#test-1 > div');

        toAuto();
        toZero();
        toSpecific();
        toZero();
        toPercentage();
        toZero();
      });
    });
  });

  it('Applies CSS classes', function () {
    cy.visit('http://localhost:8080');

    cy.window().then((win) => {
      let element;

      // Animate to auto
      function toAuto() {
        cy.get('#test-1-auto').click();

        cy.wait(ANIMATION_STARTED_TIME).then(() => {
          element = cy.get('#test-1');

          element.should('have.class', 'rah-animating');
        });

        cy.wait(ANIMATION_FINISHED_TIME).then(() => {
          element = cy.get('#test-1');

          element.should('have.class', 'rah-static');
          element.should('have.class', 'rah-static--height-auto');
        });
      }

      // Animate to zero
      function toZero() {
        cy.get('#test-1-0').click();

        cy.wait(ANIMATION_STARTED_TIME).then(() => {
          element = cy.get('#test-1');

          element.should('have.class', 'rah-animating');
          element.should('have.class', 'rah-animating--up');
        });

        cy.wait(ANIMATION_FINISHED_TIME).then(() => {
          element = cy.get('#test-1');

          element.should('have.class', 'rah-static');
        });
      }

      // Animate to specific
      function toSpecific(from) {
        cy.get('#test-1-100').click();

        cy.wait(ANIMATION_STARTED_TIME).then(() => {
          element = cy.get('#test-1');

          element.should('have.class', 'rah-animating');
          element.should(
            'have.class',
            `rah-animating--${from === 'auto' ? 'up' : 'down'}`
          );
          element.should('have.class', 'rah-animating--to-height-specific');
        });

        cy.wait(ANIMATION_FINISHED_TIME).then(() => {
          element = cy.get('#test-1');

          element.should('have.class', 'rah-static');
          element.should('have.class', 'rah-static--height-specific');
        });
      }

      toAuto();
      toZero();
      toSpecific(0);
      toZero();
      toAuto();
      toSpecific('auto');
    });
  });

  it('Executes callbacks', function () {
    cy.visit('http://localhost:8080');
    cy.window().then((win) => {
      // Enable callbacks
      cy.get('#test-1-toggle-callbacks').click();

      // To auto
      cy.get('#test-1-auto').click();

      cy.wait(ANIMATION_STARTED_TIME).then(() => {
        cy.expect(win.console.warn).to.have.callCount(1);
      });

      cy.wait(ANIMATION_FINISHED_TIME).then(() => {
        cy.expect(win.console.warn).to.have.callCount(2);
      });

      // To zero
      cy.get('#test-1-0').click();

      cy.wait(ANIMATION_STARTED_TIME).then(() => {
        cy.expect(win.console.warn).to.have.callCount(3);
      });

      cy.wait(ANIMATION_FINISHED_TIME).then(() => {
        cy.expect(win.console.warn).to.have.callCount(4);

        // Disable callbacks
        cy.get('#test-1-toggle-callbacks').click();
      });
    });
  });
});
