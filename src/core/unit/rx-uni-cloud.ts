import RxUni from 'pure-ui/unit/rx-uni';
import {Observable} from 'rxjs';
import CallFunctionOptions = UniCloud.CallFunctionOptions;
import CallFunctionResult = UniCloud.CallFunctionResult;
import UploadFileOptions = UniCloud.UploadFileOptions;
import UploadFileResult = UniCloud.UploadFileResult;

export default class RxUniCloud {
  static callFunction(name: string, data?: any) {
    const options: CallFunctionOptions = {name, data};
    return new Observable<CallFunctionResult>((subscriber) => {
      options.success = (result) => subscriber.next(result);
      options.fail = (result) => {
        RxUni.showToast(result.errMsg).subscribe();
        // subscriber.error(result);
      };
      options.complete = () => subscriber.complete();
      uniCloud.callFunction(options);
    });
  }
  static uploadFile(cloudPath: string, filePath: string) {
    const options: UploadFileOptions = {cloudPath, filePath};
    return new Observable<UploadFileResult>((subscriber) => {
      options.success = (result) => subscriber.next(result);
      options.fail = (result) => subscriber.error(result);
      options.complete = () => subscriber.complete();
      uniCloud.uploadFile(options);
    });
  }
}
