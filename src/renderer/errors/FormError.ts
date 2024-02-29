export type Issue = {
  element: Element | null;
  description: string;
};

export default class FormError extends Error {
  issues: Issue[];
  constructor(displayError: boolean = true, ...issues: Issue[]) {
    super();
    this.issues = issues ?? [];
    if (!displayError) return;
    this.issues.forEach((issue) => {
      if (!issue.element) return;
      issue.element.classList.add('error');
    });
    this.#addListeners();
  }

  #addListeners() {
    this.issues.forEach((issue) => {
      if (!issue.element) return;
      issue.element.addEventListener(
        'input',
        this.boundRemoveIssueHighlight as EventListenerOrEventListenerObject
      );
    });
  }

  #removeIssueHighlight(e: InputEvent) {
    if (!e.target) return;
    (e.target as HTMLElement).classList.remove('error');
    e.target.removeEventListener(
      'input',
      this.boundRemoveIssueHighlight as EventListenerOrEventListenerObject
    );
  }
  boundRemoveIssueHighlight = this.#removeIssueHighlight.bind(this);
}
