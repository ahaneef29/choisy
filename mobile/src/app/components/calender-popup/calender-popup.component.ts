import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'calender-popup',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="dismiss()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button
            (click)="dismiss(selectedDate)"
            [disabled]="!selectedDate"
          >
            <ion-icon name="checkmark"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-datetime
        size="cover"
        [value]="date"
        style="width: 100%;"
        (ionChange)="onDepartureDateChanged($event)"
        [presentation]="presentation"
      ></ion-datetime>
    </ion-content>
  `,
  styles: [
    `
      .calender-modal {
        --background: transparent;
      }

      .calender-modal calender-popup {
        width: 365px;
        margin: auto;
        height: 405px !important;
        position: absolute !important;
      }

      .calender-modal calender-popup ion-content {
        --overflow: hidden;
        --padding-top: 10px;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class CalenderPopupComponent implements OnInit, AfterViewInit {
  @Input() date;
  @Input() presentation = 'date';

  selectedDate = null;

  private _loaded = false;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    if (!this.date && this.presentation == 'time') {
      this.date = `00:00`;
    }
  }

  async ngAfterViewInit() {
    this._loaded = true;
  }

  onDepartureDateChanged(ev: any) {
    //fix: prevent firing change event during component load
    if (!this._loaded) {
      return;
    }

    const { value } = ev.detail;
    this.selectedDate = value;
  }

  async dismiss(data?) {
    await this.modalCtrl.dismiss(data);
  }
}
