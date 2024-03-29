import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import storage from "./firebaseConfig";
import { v4 as uuid } from "uuid";

export class FirebaseService {
  static root_directory = "hotel_images";

  /****
   * Upload given file (Ex: Image) to firebase storage
   * @param {string} hotel_id Id of the hotel
   * @param {File} file file to be uploaded
   * @return {Promise<url>} url of the uploaded file
   */
  static uploadFile = async (hotel_id, file) => {
    const unique_id = uuid();
    let re = /(?:\.([^.]+))?$/;
    let file_type = re.exec("file.name.with.dots.txt")[1];
    const splited = file.name.split(".");
    const ft = splited[splited.length - 1];
    let new_file_name = hotel_id + "_" + unique_id + "." + ft;

    if (!file) {
      return null;
    }

    const storageRef = ref(
      storage,
      `/${FirebaseService.root_directory}/${hotel_id}/${new_file_name}`
    );

    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);

    return url;
  };

  /****
   * Upload given multiple files to firebase storage
   * @param {string} hotel_id Id of the hotel
   * @param {Array<File>} files files to be uploaded
   * @return {url[]} urls of the uploaded files
   */
  static async uploadFiles(hotel_id, files) {
    let urls = [];
    for (const file of files) {
        const url = await this.uploadFile(hotel_id, file);
        urls.push(url);
      }
      return urls;
  }

  /****
   * Delete a given file from firebase storage
   * @param {string} file_url url of the file
   * @return {Promise<url>} url of the deleted file
   */
  static deleteFile(file_url) {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, file_url);
      deleteObject(storageRef)
        .then((result) => {
          resolve(file_url);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /****
   * Delete multiple files from firebase
   * @param {Array<string>} file_urls Array of urls to be deleted
   * @return {Promise<Array<url>>} Array of urls of the deleted files
   */
  static deleteFiles(file_urls) {
    let promises = [];
    for (const url of file_urls) {
      promises.push(FirebaseService.deleteFile(url));
    }
    return new Promise((resolve, reject) => {
      Promise.all(promises)
        .then((result) => {
          resolve(file_urls);
        })
        .catch((err) => {
          reject("Could not delete");
        });
    });
  }
}
