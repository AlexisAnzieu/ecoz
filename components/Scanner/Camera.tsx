import { StyleSheet, TouchableOpacity } from "react-native";
import { Camera, CameraView, PermissionResponse } from "expo-camera";
import { useCallback, useEffect, useState } from "react";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";

interface ScannerCameraProps {
  onCodeScanned: (data: string) => void;
}

export function ScannerCamera({ onCodeScanned }: ScannerCameraProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = useCallback(
    ({ data }: { data: string }) => {
      if (isScanning) {
        setIsScanning(false);
        onCodeScanned(data);
      }
    },
    [isScanning, onCodeScanned]
  );

  if (hasPermission === null) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.permissionContainer}>
          <ThemedText>Requesting camera permission...</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  if (hasPermission === false) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.permissionContainer}>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={async () => {
              const { status } = await Camera.requestCameraPermissionsAsync();
              setHasPermission(status === "granted");
            }}
          >
            <ThemedText style={styles.permissionText}>
              Grant Camera Permission
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <CameraView
      style={styles.camera}
      facing="back"
      barcodeScannerSettings={{
        barcodeTypes: ["ean13", "ean8"],
      }}
      onBarcodeScanned={handleBarCodeScanned}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionButton: {
    padding: 20,
    backgroundColor: "#007AFF",
    borderRadius: 10,
  },
  permissionText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});
