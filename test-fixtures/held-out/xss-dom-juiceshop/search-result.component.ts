// Adapted from juice-shop/juice-shop frontend search-result.component.ts (MIT). See NOTICE.
// Query parameter marked trusted HTML and bound into the template.
import { Component, inject } from "@angular/core";
import { DomSanitizer, type SafeHtml } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-search-result",
  templateUrl: "./search-result.component.html",
})
export class SearchResultComponent {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly route = inject(ActivatedRoute);
  public searchValue: SafeHtml | undefined;

  filterTable() {
    let queryParam: string = this.route.snapshot.queryParams.q;
    if (queryParam) {
      queryParam = queryParam.trim();
      this.searchValue = this.sanitizer.bypassSecurityTrustHtml(queryParam);
    }
  }
}
