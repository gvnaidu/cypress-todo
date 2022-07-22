describe('Smoke tests', () => {
    beforeEach(() => {
        cy.request('GET', '/api/todos')
            .its('body')
            .each(todo => cy.request('DELETE', `/api/todos/${todo.id}`))
    })

    context('With no todos', () => {
        it('Saves new todos', () => {
            const todos = [
                {item: 'Buy Milk', size: 1},
                {item: 'Buy Eggs', size: 2},
                {item: 'Buy Carrots', size: 3}
            ]
            cy.visit('/')
            cy.server()
            cy.route('POST', '/api/todos')
                .as('remotecall')

            cy.wrap(todos)
                .each( (todo) => {
                cy.focused()
                    .type(todo.item)
                    .type('{enter}')
    
                cy.wait('@remotecall')
    
                cy.get('.todo-list li')
                    .should('have.length', todo.size)
            })
            
        })
    })

    context('With active todos', () => {
        beforeEach(() => {
            cy.fixture('todos')
                .each(todo => {
                    const newTodo = Cypress._.merge(todo, {isComplete: false})
                    cy.request('POST', '/api/todos', newTodo)
                })
            cy.visit('/')
        })

        it('Loads existing data from the DB', () => {
            cy.get('.todo-list li')
                .should('have.length', 4)
        })

        it('Deletes todos', () => {
            cy.server()
            cy.route('DELETE', '/api/todos/*')
                .as('delete')

            cy.get('.todo-list li')
                .each($el => {
                    cy.wrap($el)
                        .find('.destroy')
                        .invoke('show')
                        .click()

                    cy.wait('@delete')
                })
                .should('not.exist')
        })

        it('Toggling todos', () => {
            const clickAndWait = ($el) => {
                cy.wrap($el)
                    .as('item')
                    .find('.toggle')
                    .click()

                cy.wait('@update')
            }

            cy.server()
            cy.route('PUT', '/api/todos/*')
                .as('update')
            
            cy.get('.todo-list li')
                .each($el => {
                    clickAndWait($el)    
                    cy.get('@item')
                        .should('have.class', 'completed')
                })
                .each($el => {
                    clickAndWait($el)
                    cy.get('@item')
                        .should('not.have.class', 'completed')
                })
        })
    })
})