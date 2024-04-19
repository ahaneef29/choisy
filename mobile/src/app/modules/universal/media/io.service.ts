import { Platform } from '@ionic/angular';

import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Directory, Filesystem, ReaddirResult } from '@capacitor/filesystem';
import { Injectable } from '@angular/core';

//https://devdactic.com/ionic-image-upload-capacitor/
@Injectable({
    providedIn: 'root'
})
export class IoService {
    private FILES_DIR = 'stored-files';

    constructor(private platform: Platform) {

    }

    async promptAndGetImage(args?: { fileName?: string }) {
        if(!args) {
            args = {};
        }
        
        let image: Photo;
        try {
            image = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.Uri,
                source: CameraSource.Photos // Camera, Photos or Prompt!
            });
        } catch(e) {
            //ignore...
            return;
        }

        return this.saveImage({ photo: image, fileName: args.fileName });
    }

    // Create a new file from a capture image
    async saveImage(args: { photo: Photo, fileName?: string }) {
        const base64Data = await this._readAsBase64(args.photo);
     
        const fileName = `${args.fileName || new Date().getTime()}.jpeg`;
        const savedFile = await Filesystem.writeFile({
            path: `${this.FILES_DIR}/${fileName}`,
            data: base64Data,
            directory: Directory.Data,
            recursive: true
        });
     
        return this.loadFileData([fileName], args.photo.webPath);
    }

    async loadFiles() {
        let result: ReaddirResult;
        try {
            result = await Filesystem.readdir({
                path: this.FILES_DIR,
                directory: Directory.Data,
            });
        } catch(e) {
            // Folder does not yet exists!
            await Filesystem.mkdir({
                path: this.FILES_DIR,
                directory: Directory.Data,
            });
        } finally {
            result = await Filesystem.readdir({
                path: this.FILES_DIR,
                directory: Directory.Data,
            });
        }

        return this.loadFileData(result.files.map(f => f.uri));
    }

    // Get the actual base64 data of an image base on the name of the file
    async loadFileData(fileNames: string[], webPath?) {
        const images: IFileData[] = [];
        for (let f of fileNames) {
            const filePath = `${this.FILES_DIR}/${f}`;
        
            const readFile = await Filesystem.readFile({
                path: filePath,
                directory: Directory.Data,
            });
        
            let blob: Blob | null = null;
            if(webPath) {
                const response = await fetch(webPath);
                blob = await response.blob();    
            }

            images.push({
                name: f,
                path: filePath,
                data: `data:image/jpeg;base64,${readFile.data}`,
                blob: <any>blob
            });
        }
        return images;
    }
    // https://ionicframework.com/docs/angular/your-first-app/3-saving-photos
    private async _readAsBase64(photo: Photo) {
        if (this.platform.is('hybrid')) {
            const file = await Filesystem.readFile({
                path: photo.path!
            });
     
            return file.data;
        } else {
            // Fetch the photo, read as a blob, then convert to base64 format
            const response = await fetch(photo.webPath!);
            const blob = await response.blob();
     
            return await this.convertBlobToBase64(blob) as string;
        }
    }

    // Helper function
    private convertBlobToBase64(blob: Blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader;
            reader.onerror = reject;
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(blob);
        });
    }
}

export interface IFileData {
    name: string;
    path: string;
    data: string;
    blob: Blob;
}