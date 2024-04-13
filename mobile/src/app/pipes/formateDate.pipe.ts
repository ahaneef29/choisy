// import { Pipe } from '@angular/core';
// import { format, parseISO } from 'date-fns';

// import { AppConstant } from '../modules/universal/app-constant';

// @Pipe({
//   name: 'formateDate',
// })
// export class FormateDatePipe {
//   constructor() {}

//   transform(date: any, ft?: string) {
//     return new Promise((resolve, reject) => {
//       if (!date) {
//         resolve(null);
//       } else {
//         if (!ft) {
//           ft = AppConstant.DATETIME_FORMAT;
//         }

//         let fd = null;
//         if (date instanceof Date) {
//           fd = format(date, ft);
//         } else {
//           fd = format(parseISO(date), ft);
//         }
//         resolve(fd);
//       }
//     });
//   }
// }
