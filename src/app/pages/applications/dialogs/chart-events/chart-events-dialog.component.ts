import {
  OnInit, Component, Inject,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { forkJoin } from 'rxjs';
import { appImagePlaceholder } from 'app/constants/catalog.constants';
import helptext from 'app/helptext/apps/apps';
import { ChartReleaseEvent } from 'app/interfaces/chart-release-event.interface';
import { ChartContainerImage, ChartRelease } from 'app/interfaces/chart-release.interface';
import { ApplicationsService } from 'app/pages/applications/applications.service';
import { AppLoaderService } from 'app/services/app-loader/app-loader.service';
import { LocaleService } from 'app/services/locale.service';

@UntilDestroy()
@Component({
  selector: 'chart-events-dialog',
  styleUrls: ['./chart-events-dialog.component.scss'],
  templateUrl: './chart-events-dialog.component.html',
})
export class ChartEventsDialog implements OnInit {
  catalogApp: ChartRelease;
  containerImages: { [key: string]: ChartContainerImage } = {};
  chartEvents: ChartReleaseEvent[] = [];
  imagePlaceholder = appImagePlaceholder;
  helptext = helptext;

  constructor(
    public dialogRef: MatDialogRef<ChartEventsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ChartRelease,
    protected localeService: LocaleService,
    private loader: AppLoaderService,
    public appService: ApplicationsService,
  ) {
    this.catalogApp = data;
  }

  ngOnInit(): void {
    this.loader.open();
    forkJoin([
      this.appService.getChartReleaseWithResources(this.catalogApp.name),
      this.appService.getChartReleaseEvents(this.catalogApp.name),
    ]).pipe(untilDestroyed(this)).subscribe(([charts, events]) => {
      this.loader.close();
      if (charts) {
        this.catalogApp = charts[0];
      }
      if (events) {
        this.chartEvents = events;
      }
    });
  }

  // return the container image status
  containerImageStatus(containerImage: { value: ChartContainerImage }): string {
    if (containerImage.value.update_available) {
      return helptext.chartEventDialog.statusUpdateAvailable;
    }
    return helptext.chartEventDialog.statusUpToDate;
  }

  // return the chart app status
  appStatus(): string {
    let label: string;
    if (!this.catalogApp.update_available && !this.catalogApp.container_images_update_available) {
      label = helptext.chartEventDialog.statusUpToDate;
    } else if (this.catalogApp.update_available || this.catalogApp.container_images_update_available) {
      label = helptext.chartEventDialog.statusUpdateAvailable;
    }
    return label;
  }

  // return the tooltip string for the version availabe to update
  getUpdateVersionTooltip(): string {
    let label: string;
    if (this.catalogApp.update_available) {
      label = helptext.chartEventDialog.statusUpdateAvailableTo + this.catalogApp.human_latest_version;
    } else if (this.catalogApp.container_images_update_available) {
      label = helptext.chartEventDialog.containerImageStatusUpdateAvailableTo;
      const updateAvailableImages = Object.keys(this.containerImages)
        .filter((imageName) => this.containerImages[imageName].update_available);
      label += updateAvailableImages.join(',');
    }

    return label;
  }

  refreshEvents(): void {
    this.loader.open();
    this.appService.getChartReleaseEvents(this.catalogApp.name).pipe(untilDestroyed(this)).subscribe((evt) => {
      this.loader.close();
      this.chartEvents = evt;
    });
  }
}
