import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonAccordionGroup } from '@ionic/angular';

@Component({
  selector: 'help-icon',
  template: `
    <ion-button
      class="help-button button-no-border"
      fill="clear"
      (click)="onHelpClicked()"
    >
      <ion-icon
        ios="help-circle-outline"
        md="help-circle-outline"
        *ngIf="!accordionGroup.value"
      ></ion-icon>
      <ion-icon
        ios="close-circle-outline"
        md="close-circle-outline"
        *ngIf="accordionGroup.value"
      ></ion-icon>
    </ion-button>
    <ion-accordion-group #accordionGroup>
      <ion-accordion value="first">
        <div slot="content" class="help-content">
          <span>
            <ion-icon
              ios="information-circle-outline"
              md="information-circle-outline"
            ></ion-icon>
            <strong
              >{{ 'common.explanation' | localizedresource | async }}:</strong
            >
          </span>
          <p [innerHTML]="text"></p>
        </div>
      </ion-accordion>
    </ion-accordion-group>
  `,
  styles: [
    `
      :host {
        display: inline-block;
        width: 100%;
      }

      .help-button {
        position: absolute;
        right: 0;
        top: 16px;
        z-index: 9999;
        height: 36px;
      }

      .help-content {
        position: relative;
        margin-top: 10px;
        background: var(--ion-color-primary);
        color: #fff;
        padding: 10px;
      }

      .help-content::after {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border-width: 10px;
        border-style: solid;
        border-color: transparent transparent var(--ion-color-primary)
          transparent;
        top: -19px;
        left: 35px;
      }

      .help-content span {
        display: flex;
        align-items: center;
      }

      .help-content span ion-icon {
        font-size: 24px;
      }

      .help-content p {
        margin-left: 24px;
      }
    `,
  ],
})
export class HelpIconComponent implements OnInit {
  @Input() text: string;
  @ViewChild('accordionGroup', { static: true })
  accordionGroup: IonAccordionGroup;

  constructor() {}

  ngOnInit() {
    if (!this.text) {
      this.text = 'Please add some help text';
    }
  }

  onHelpClicked() {
    const nativeEl = this.accordionGroup;
    if (nativeEl.value === 'first') {
      nativeEl.value = undefined;
    } else {
      nativeEl.value = 'first';
    }
  }
}
