import { Component, inject } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";

@Component({ selector: "app-safe", template: "<div>{{ searchValue }}</div>" })
export class SafeComponent {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly route = inject(ActivatedRoute);
  public searchValue = "";

  filterTable() {
    // Plain interpolation binding — Angular auto-escapes. No bypass call.
    this.searchValue = (this.route.snapshot.queryParams.q ?? "").trim();
  }
}
