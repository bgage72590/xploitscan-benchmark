import { Component, inject } from "@angular/core";
import { DomSanitizer, type SafeHtml } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";

@Component({ selector: "app-search", template: "<div [innerHTML]='searchValue'></div>" })
export class SearchComponent {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly route = inject(ActivatedRoute);
  public searchValue: SafeHtml | undefined;

  filterTable() {
    const q: string = this.route.snapshot.queryParams.q;
    // User input marked as trusted HTML — defeats Angular's sanitizer.
    this.searchValue = this.sanitizer.bypassSecurityTrustHtml(q);
  }
}
