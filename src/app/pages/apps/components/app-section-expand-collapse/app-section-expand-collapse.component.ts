import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  OnChanges,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'ix-app-section-expand-collapse',
  templateUrl: './app-section-expand-collapse.component.html',
  styleUrls: ['./app-section-expand-collapse.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppSectionExpandCollapseComponent implements OnChanges, AfterContentChecked {
  section = viewChild<ElementRef<HTMLElement>>('section');
  maxHeight = input<number>(250);
  height = signal<number>(this.maxHeight());
  isCollapsed = signal<boolean>(true);
  showButton = computed<boolean>(() => {
    return this.height() >= this.maxHeight();
  });

  ngOnChanges(): void {
    this.isCollapsed.set(true);
    this.section().nativeElement.style.maxHeight = `${this.maxHeight()}px`;
  }

  ngAfterContentChecked(): void {
    if (this.isCollapsed()) {
      this.setHeight();
      this.section().nativeElement.style.maxHeight = `${this.maxHeight()}px`;
    }
  }

  changeCollapsed(): void {
    this.setHeight();
    this.isCollapsed.set(!this.isCollapsed());
    this.section().nativeElement.style.maxHeight = this.isCollapsed() ? `${this.maxHeight()}px` : 'none';
  }

  setHeight(): void {
    this.height.set(this.section().nativeElement.offsetHeight || this.maxHeight());
  }

  onResize(): void {
    this.setHeight();
  }
}
