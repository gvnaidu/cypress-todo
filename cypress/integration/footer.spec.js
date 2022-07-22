describe('Footer', () => {
    context('with a single todo', () => {
        it('Displays a singular todo in count', () => {
            cy.seedAndVisit([{id: 1, name: 'Buy Milk', isComplete: false}])
            cy.get('.todo-count')
                .should('contain', '1 todo left')
        })
    })

    context('with multiple todos', () => {
        beforeEach( () => {
            cy.seedAndVisit()
        })
        
        it('Displays multiple todos in count', () => {            
            cy.get('.todo-count')
                .should('contain', ' todos left')
        })

        it('Handles filter links', () => {
            const filters = [
                {link: 'Active', size: 3},
                {link: 'Completed', size: 1},
                {link: 'All', size: 4}
            ]
            cy.wrap(filters)
                .each( filter =>{
                    cy.contains(filter.link)
                        .click()

                    cy.get('.todo-list li')
                        .should('have.length', filter.size)
                })
            
        })

    })
})