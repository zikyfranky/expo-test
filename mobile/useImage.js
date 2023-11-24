import {
  CameraType,
  MediaTypeOptions,
  PermissionStatus,
  UIImagePickerPresentationStyle,
  launchCameraAsync,
  launchImageLibraryAsync,
  useCameraPermissions,
  useMediaLibraryPermissions,
} from "expo-image-picker";
import { useState } from "react";
import { Linking } from "react-native";

const useGallery = () => {
  const [cameraStatus, requestCamera] = useCameraPermissions();
  const [mediaLibraryStatus, requestMediaLibrary] =
    useMediaLibraryPermissions();
  const [error, setError] = useState(false);

  const openCamera = async (onSuccess, options = {}) => {
    let failed = false;
    if (
      (cameraStatus?.status == PermissionStatus.UNDETERMINED ||
        cameraStatus?.status == PermissionStatus.DENIED) &&
      cameraStatus?.canAskAgain
    ) {
      const newStatus = await requestCamera();

      if (newStatus.status == PermissionStatus.DENIED) {
        failed = true;
      } else {
        failed = false;
      }
    } else if (cameraStatus?.status == PermissionStatus.GRANTED) {
      failed = false;
    } else {
      failed = true;
    }

    setError(failed);

    if (failed) return;

    let config = {
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: false,
      allowsMultipleSelection: true,
      presentationStyle: UIImagePickerPresentationStyle.FULL_SCREEN,
      cameraType: CameraType.back,
      aspect: [4, 3],
      ...options,
    };

    let result = await launchCameraAsync(config);

    if (result.canceled) return;

    onSuccess(
      result.assets.map((a) => {
        return {
          ...a,
          mime: a.type + "/*",
        };
      })
    );
  };

  const openGallery = async (onSuccess, options = {}) => {
    let failed = false;
    if (
      (mediaLibraryStatus?.status == PermissionStatus.UNDETERMINED ||
        mediaLibraryStatus?.status == PermissionStatus.DENIED) &&
      mediaLibraryStatus?.canAskAgain
    ) {
      const newStatus = await requestMediaLibrary();

      if (newStatus.status == PermissionStatus.DENIED) {
        failed = true;
      } else {
        failed = false;
      }
    } else if (mediaLibraryStatus?.status == PermissionStatus.GRANTED) {
      failed = false;
    } else {
      failed = true;
    }

    setError(failed);

    if (failed) return;

    let config = {
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: false,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      ...options,
    };

    let result = await launchImageLibraryAsync(config);

    if (result.canceled) return;

    onSuccess(
      result.assets.map((a) => {
        return {
          ...a,
          mime: a.type + "/*",
        };
      })
    );
  };

  const gotoAppSettings = async () => {
    await Linking.openSettings();
    setError(false);
  };

  const getUploadable = (image) => {
    return image.uri;
  };

  return {
    openGallery,
    openCamera,
    error,
    getUploadable,
    setError,
    gotoAppSettings,
  };
};

export default useGallery;
