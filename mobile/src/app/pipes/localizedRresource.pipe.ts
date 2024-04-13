import { Pipe, PipeTransform } from '@angular/core';
import { LocalizationService } from '../modules/universal/localization.service';

@Pipe({
  name: 'localizedresource',
})
export class LocalizedResourcePipe implements PipeTransform {
  constructor(private localizationService: LocalizationService) {}

  transform(resourceKey: string, workingLanguage?: string) {
    return new Promise<string>((resolve, reject) => {
      if (!resourceKey) {
        resolve(null as any);
      } else {
        this.localizationService
          .getResource(resourceKey, workingLanguage)
          .then((value) => {
            resolve(value);
          });
      }
    });
  }
}
