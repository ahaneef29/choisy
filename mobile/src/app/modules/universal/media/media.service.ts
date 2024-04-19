import { Injectable } from "@angular/core";
import { AppConstant } from "../app-constant";

import { BaseService } from "../base.service";
// import { ICommonApiResponse } from "./common-response.model";
import { IoService } from "./io.service";
import { IAyncUploadPictureResponse } from "./download";

@Injectable({
    providedIn: 'root'
})
export class MediaService extends BaseService {
    constructor(private ioSvc: IoService) {
        super();
    }

    promptAndGetPicture() {
        return new Promise<IAyncUploadPictureResponse | null>(async (resolve, reject) => {
            const result = await this.ioSvc.selectImage();
            if(!result || (result && !result.length)) {
              return resolve(null);
            }


            const name = `${this.helperSvc.generateGuid()}.${result[0].name.split('.')[1]}`;
            const data = new FormData();
            data.append('image', result[0].blob, name);
            data.append('qqfilename', name);

            const url = `${AppConstant.BASE_API_URL}download/asyncUploadPicture`;
            const response = await this.postData<IAyncUploadPictureResponse>({
                url: url,
                overrideUrl: true,
                body: data,
                ignoreContentType: true
            });

            return resolve(response);
        });
    }
}