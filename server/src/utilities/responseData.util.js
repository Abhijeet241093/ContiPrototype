export class ResponseData {
    constructor(isSuccessful, data, message){
      this.isSuccessful = isSuccessful;
      this.data = data;
      this.message =message;
    }
  }