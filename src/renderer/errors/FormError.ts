import HoverBoxService from '../services/HoverBox.js';

export type Issue = {
  element: HTMLElement | null | undefined;
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
    this.issues.forEach((issue, i) => {
      if (!issue.element) return;
      issue.element.addEventListener(
        'input',
        this.boundRemoveIssueHighlight as EventListenerOrEventListenerObject
      );
      HoverBoxService.attach('issue', issue.element, issue.description, {
        eventType: 'mouseenter',
        namespace: 'form-error',
      });
    });
  }

  #removeIssueHighlight(e: InputEvent) {
    if (!e.target) return;
    HoverBoxService.remove('issue');

    (e.target as HTMLElement).classList.remove('error');
    e.target.removeEventListener(
      'input',
      this.boundRemoveIssueHighlight as EventListenerOrEventListenerObject
    );
  }
  boundRemoveIssueHighlight = this.#removeIssueHighlight.bind(this);
}
