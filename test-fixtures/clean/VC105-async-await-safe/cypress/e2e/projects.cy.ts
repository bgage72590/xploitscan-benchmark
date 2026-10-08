describe("Projects", () => {
  beforeEach(() => {
    cy.task("db:reset");
  });

  it("shows a newly created project on its page", () => {
    // Cypress commands are queued, not promises, so they chain with .then()
    // and cannot be awaited.
    cy.request("POST", "/api/test/users", { email: "owner@example.com" })
      .then(({ body: user }) =>
        cy.request("POST", "/api/test/projects", { ownerId: user.id, name: "Launch plan" }),
      )
      .then(({ body: project }) => {
        cy.visit(`/projects/${project.id}`);
        return cy.wrap(project);
      })
      .then((project) => {
        cy.get("h1").should("have.text", project.name);
      });
  });
});
