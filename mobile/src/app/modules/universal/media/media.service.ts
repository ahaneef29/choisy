import { Injectable } from "@angular/core";
import { AppConstant } from "../app-constant";

import { BaseService } from "../base.service";
// import { ICommonApiResponse } from "./common-response.model";
import { IoService } from "./io.service";
import { IAyncUploadPictureResponse, IAyncUploadResponse } from "./download";

@Injectable({
    providedIn: 'root'
})
export class MediaService extends BaseService {
    constructor(private ioSvc: IoService) {
        super();
    }

    promptAndUploadPicture() {
        return new Promise<IAyncUploadPictureResponse | null>(async (resolve, reject) => {
            const result = await this.ioSvc.promptAndGetImage();
            if(!result || (result && !result.length)) {
              return resolve(null);
            }


            const nameWithExtension = `${this.helperSvc.generateGuid()}.${result[0].name.split('.')[1]}`;
            const data = new FormData();
            data.append('image', result[0].blob, nameWithExtension);
            data.append('qqfilename', nameWithExtension);

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

    uploadFile(file: File) {
        return new Promise<IAyncUploadResponse | null>(async (resolve, reject) => {
            // const result = await this.ioSvc.promptAndGetImage();
            if(!file) {
              return resolve(null);
            }

            let reader = new FileReader();
            reader.onload = async (e) => {
                const arrayBuffer: any = reader.result;

                //binary
                let blob = new Blob([arrayBuffer], { type: file.type });
                const url = `${AppConstant.BASE_API_URL}download/asyncUpload`;
                const nameWithExtension = `${this.helperSvc.generateGuid()}.${file.name.split('.')[1]}`;
                const data = new FormData();
                data.append('image', blob, nameWithExtension);
                data.append('qqfilename', nameWithExtension);

                const response = await this.postData<IAyncUploadResponse>({
                    url: url,
                    overrideUrl: true,
                    body: data,
                    ignoreContentType: true
                });

                return resolve(response);
            };
            reader.readAsArrayBuffer(file);
        });
    }
}