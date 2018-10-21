import { Predictor } from './predictor';
import { IBlobInfo } from './iblob-info.d';
import 'isomorphic-fetch';
import * as azureblob from '../resources/azurestoragejs-2.10.100/bundle/azure-storage.blob';

export class ImageUploader {
    private predictor: Predictor;

    constructor(predictor: Predictor) {
        this.predictor = predictor;
    }
 
    public uploadImage(picture: File): void {
        if (picture == null) {
            return;
        }
        const nameformats: string[] = picture.name.split('.');
        if (nameformats.length <= 1) {
            console.log("Invalid file format, '.' expected.");
            return;
        }

        const uploadTestData = {
            imageName: picture.name
        };

        fetch('http://tncapi.azurewebsites.net/api/storage/Upload2', {
            method: 'POST',
            mode: "cors",
            cache: "no-cache",
            headers: new Headers({
                'accept': 'text/plain',
                'Content-Type': 'application/json-patch+json'
            }),
            body: JSON.stringify(uploadTestData)
        }).then((response) => {
            return response.json();
        }).then((json) => {
            const blobInfo: IBlobInfo = this.getBlobInfo(json['uploadBlobSASUrl']);
            this.uploadImageToBlob(blobInfo, picture);
        }).catch(err => console.log(err));
    }

    private getBlobInfo(blobInfoUrl: string): IBlobInfo {
        //Remove https:// prefix
        const url: string = blobInfoUrl.substring(8);
        const subStrs: string[] = url.split('/').join(',').split('?').join(',').split(',');
        const blobInfo: IBlobInfo = {
            hostUri: `https://${subStrs[0]}`,
            blobName: subStrs[2],
            fileName: subStrs[3],
            containerName: subStrs[1],
            sasToken: `?${subStrs[4]}`,
            blobUri: `https://${subStrs[0]}/${subStrs[1]}/${subStrs[2]}/${subStrs[3]}`
        };

        return blobInfo;
    }

    public uploadImageToBlob(blobInfo: IBlobInfo, picture: File): void {
        const blobService = azureblob.createBlobServiceWithSas(blobInfo.hostUri, blobInfo.sasToken);
        const file = picture;
        const blockSize = file.size > 1024 * 1024 * 32 ? 1024 * 1024 * 4 : 1024 * 512;
        const options = {
            blockSize: blockSize
        };

        const speedSummary = blobService.createBlockBlobFromBrowserFile(blobInfo.containerName, `${blobInfo.blobName}/${blobInfo.fileName}`, file, options, (uploadError: any, blobResponse: any, uploadResponse: any) => {
            if (uploadError) {
                console.log(uploadError);
            } else {
                this.predictor.predict(blobInfo.blobUri);
            }
        });

        // this part of the code can be used to create a progress bar for uploading (under development)
        speedSummary.on('progress', () => {
            const process = speedSummary.getCompletePercent();
        });
    }
}
