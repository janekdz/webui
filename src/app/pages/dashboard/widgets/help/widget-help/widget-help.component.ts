import {
  ChangeDetectionStrategy, Component, computed, input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCard, MatCardContent } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { map } from 'rxjs';
import { productTypeLabels } from 'app/enums/product-type.enum';
import { helptextAbout } from 'app/helptext/about';
import { IxIconComponent } from 'app/modules/ix-icon/ix-icon.component';
import { CopyrightLineComponent } from 'app/modules/layout/copyright-line/copyright-line.component';
import { TestDirective } from 'app/modules/test-id/test.directive';
import { SlotSize } from 'app/pages/dashboard/types/widget.interface';
import { AppState } from 'app/store';
import { selectIsEnterprise, selectProductType } from 'app/store/system-info/system-info.selectors';

@Component({
  selector: 'ix-widget-help',
  templateUrl: './widget-help.component.html',
  styleUrl: './widget-help.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    TestDirective,
    IxIconComponent,
    CopyrightLineComponent,
    TranslateModule,
  ],
})
export class WidgetHelpComponent {
  size = input.required<SlotSize>();
  fullSize = computed(() => this.size() === SlotSize.Full);

  product = toSignal(this.store$.select(selectProductType).pipe(map((type) => productTypeLabels.get(type))));
  isEnterprise = toSignal(this.store$.select(selectIsEnterprise));

  protected readonly helptext = helptextAbout;

  constructor(private store$: Store<AppState>) {}
}
