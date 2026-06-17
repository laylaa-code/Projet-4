import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";

const MAX_PHOTOS = 5;

const tableImage = require("./assets/products/table.jpeg");
const canapeImage = require("./assets/products/canape.jpeg");
const assiettesImage = require("./assets/products/assiettes.jpeg");
const tableauImage = require("./assets/products/tableau.jpeg");
const lanterneImage = require("./assets/products/lanterne.jpeg");

const demoGalleryImages = [
  {
    id: "table",
    title: "Table a manger",
    formTitle: "Table en bois avec chaises",
    description:
      "Table a manger rectangulaire en bois, couleur naturelle, vendue avec des chaises. Ideale pour salle a manger ou cuisine. Produit en bon etat general, avec quelques traces normales d'utilisation. A recuperer sur place.",
    price: "2500",
    category: "maison",
    etat: "bon_etat",
    source: tableImage,
    uri: Image.resolveAssetSource(tableImage).uri,
    fileName: "table.jpeg",
    mimeType: "image/jpeg",
  },
  {
    id: "canape",
    title: "Canape bleu",
    formTitle: "Canape d'angle bleu",
    description:
      "Canape d'angle bleu fonce avec meridienne, ideal pour salon. Design moderne, confortable et spacieux. Bon etat general, quelques traces normales d'utilisation. A recuperer sur place.",
    price: "3500",
    category: "maison",
    etat: "bon_etat",
    source: canapeImage,
    uri: Image.resolveAssetSource(canapeImage).uri,
    fileName: "canape.jpeg",
    mimeType: "image/jpeg",
  },
  {
    id: "assiettes",
    title: "Assiettes",
    formTitle: "Lot d'assiettes motif poisson",
    description:
      "Lot d'assiettes decoratives avec motif poisson bleu. Style artisanal, ideal pour la decoration ou l'usage quotidien. Produit propre et en tres bon etat.",
    price: "250",
    category: "maison",
    etat: "comme_neuf",
    source: assiettesImage,
    uri: Image.resolveAssetSource(assiettesImage).uri,
    fileName: "assiettes.jpeg",
    mimeType: "image/jpeg",
  },
  {
    id: "tableau",
    title: "Tableau floral",
    formTitle: "Tableau floral avec cadre dore",
    description:
      "Tableau decoratif representant un bouquet de fleurs, avec cadre dore travaille. Ideal pour salon, chambre ou espace de decoration. Bon etat general.",
    price: "600",
    category: "maison",
    etat: "bon_etat",
    source: tableauImage,
    uri: Image.resolveAssetSource(tableauImage).uri,
    fileName: "tableau.jpeg",
    mimeType: "image/jpeg",
  },
  {
    id: "lanterne",
    title: "Lanterne marocaine",
    formTitle: "Lanterne marocaine suspendue",
    description:
      "Lanterne marocaine decorative avec vitraux colores et structure noire. Ideale pour salon, terrasse ou decoration traditionnelle. Bel effet lumineux.",
    price: "450",
    category: "maison",
    etat: "bon_etat",
    source: lanterneImage,
    uri: Image.resolveAssetSource(lanterneImage).uri,
    fileName: "lanterne.jpeg",
    mimeType: "image/jpeg",
  },
];

const categories = [
  { label: "Choisir une categorie", value: "" },
  { label: "Mode", value: "mode" },
  { label: "Electronique", value: "electronique" },
  { label: "Maison", value: "maison" },
  { label: "Vehicules", value: "vehicules" },
  { label: "Sport", value: "sport" },
];

const etats = [
  { label: "Choisir l'etat de l'objet", value: "" },
  { label: "Neuf", value: "neuf" },
  { label: "Comme neuf", value: "comme_neuf" },
  { label: "Bon etat", value: "bon_etat" },
  { label: "Correct", value: "correct" },
];

export default function App() {
  const [screen, setScreen] = useState("form");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [etat, setEtat] = useState("");
  const [images, setImages] = useState([]);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [publishedAd, setPublishedAd] = useState(null);

  const canAddMorePhotos = images.length < MAX_PHOTOS;

  const openInternalGallery = () => {
    if (images.length >= MAX_PHOTOS) {
      Alert.alert("Limite atteinte", "Tu peux ajouter maximum 5 photos.");
      return;
    }
    setGalleryVisible(true);
  };

  const selectDemoImage = (selectedImage) => {
    if (images.length >= MAX_PHOTOS) {
      Alert.alert("Limite atteinte", "Tu peux ajouter maximum 5 photos.");
      setGalleryVisible(false);
      return;
    }

    const alreadySelected = images.some((image) => image.id === selectedImage.id);

    if (alreadySelected) {
      Alert.alert("Image deja ajoutee", "Cette image est deja selectionnee.");
      return;
    }

    setImages((currentImages) => [...currentImages, selectedImage]);

    setTitle(selectedImage.formTitle);
    setDescription(selectedImage.description);
    setPrice(selectedImage.price);
    setCategory(selectedImage.category);
    setEtat(selectedImage.etat);

    setGalleryVisible(false);
  };

  const takePhoto = async () => {
    if (!canAddMorePhotos) {
      Alert.alert("Limite atteinte", "Tu peux ajouter maximum 5 photos.");
      return;
    }

    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission refusee",
        "L'acces a la camera est necessaire pour prendre une photo."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages((currentImages) => [...currentImages, result.assets[0]]);
    }
  };

  const removeImage = (indexToRemove) => {
    setImages((currentImages) =>
      currentImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const validateForm = () => {
    if (images.length === 0) {
      Alert.alert("Photo obligatoire", "Ajoute au moins une photo du produit.");
      return false;
    }

    if (title.trim().length === 0) {
      Alert.alert("Titre obligatoire", "Saisis le titre de l'annonce.");
      return false;
    }

    if (title.trim().length > 50) {
      Alert.alert("Titre trop long", "Le titre ne doit pas depasser 50 caracteres.");
      return false;
    }

    if (description.trim().length === 0) {
      Alert.alert("Description obligatoire", "Saisis une description detaillee.");
      return false;
    }

    if (price.trim().length === 0) {
      Alert.alert("Prix obligatoire", "Saisis le prix du produit.");
      return false;
    }

    const priceNumber = Number(price.replace(",", "."));

    if (Number.isNaN(priceNumber) || priceNumber <= 0) {
      Alert.alert("Prix invalide", "Le prix doit etre un nombre superieur a 0.");
      return false;
    }

    if (!category) {
      Alert.alert("Categorie obligatoire", "Choisis une categorie.");
      return false;
    }

    if (!etat) {
      Alert.alert("Etat obligatoire", "Choisis l'etat de l'objet.");
      return false;
    }

    return true;
  };

  const createFormData = () => {
    const formData = new FormData();

    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("price", price.replace(",", "."));
    formData.append("category", category);
    formData.append("etat", etat);

    images.forEach((image, index) => {
      const fileName = image.fileName || `photo_${index + 1}.jpg`;
      const extension = fileName.split(".").pop()?.toLowerCase() || "jpg";
      const mimeType =
        image.mimeType || (extension === "png" ? "image/png" : "image/jpeg");

      formData.append("photos", {
        uri: image.uri,
        name: fileName,
        type: mimeType,
      });
    });

    return formData;
  };

  const handlePublish = () => {
    if (!validateForm()) return;

    setLoading(true);

    const finalFormData = createFormData();

    console.log("Objet FormData pret a envoyer vers une API :");
    console.log(finalFormData);

    setTimeout(() => {
      setLoading(false);

      setPublishedAd({
        title: title.trim(),
        price: price.replace(",", "."),
        category,
        etat,
        photosCount: images.length,
      });

      setScreen("success");
    }, 1800);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setCategory("");
    setEtat("");
    setImages([]);
    setGalleryVisible(false);
    setPublishedAd(null);
    setScreen("form");
  };

  if (screen === "success") {
    return (
      <SafeAreaView style={styles.successContainer}>
        <StatusBar style="dark" />

        <View style={styles.successCard}>
          <Text style={styles.successIcon}>OK</Text>
          <Text style={styles.successTitle}>Annonce publiee avec succes</Text>

          <Text style={styles.successText}>
            Ton annonce "{publishedAd?.title}" est maintenant en ligne.
          </Text>

          <View style={styles.recapBox}>
            <Text style={styles.recapText}>Prix : {publishedAd?.price} DH</Text>
            <Text style={styles.recapText}>Photos : {publishedAd?.photosCount}</Text>
            <Text style={styles.recapText}>Categorie : {publishedAd?.category}</Text>
            <Text style={styles.recapText}>Etat : {publishedAd?.etat}</Text>
          </View>

          <Pressable style={styles.primaryButton} onPress={resetForm}>
            <Text style={styles.primaryButtonText}>Publier une autre annonce</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.headerTitle}>Publier une annonce</Text>
          <Text style={styles.headerSubtitle}>
            Ajoute les informations de ton produit et jusqu'a 5 photos.
          </Text>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Photos du produit</Text>
            <Text style={styles.counterText}>
              {images.length}/{MAX_PHOTOS} photos ajoutees
            </Text>

            <View style={styles.photoButtonsRow}>
              <Pressable style={styles.secondaryButton} onPress={openInternalGallery}>
                <Text style={styles.secondaryButtonText}>Galerie</Text>
              </Pressable>

              <Pressable style={styles.secondaryButton} onPress={takePhoto}>
                <Text style={styles.secondaryButtonText}>Camera</Text>
              </Pressable>
            </View>

            <View style={styles.imagesGrid}>
              {images.map((image, index) => (
                <View key={`${image.uri}-${index}`} style={styles.imageWrapper}>
                  <Image
                    source={image.source ? image.source : { uri: image.uri }}
                    style={styles.thumbnail}
                  />

                  <Pressable
                    style={styles.deleteButton}
                    onPress={() => removeImage(index)}
                  >
                    <Text style={styles.deleteButtonText}>x</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Informations de l'annonce</Text>

            <Text style={styles.label}>Titre</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex : Table en bois avec chaises"
              value={title}
              onChangeText={(text) => {
                if (text.length <= 50) setTitle(text);
              }}
              maxLength={50}
            />
            <Text style={styles.helperText}>{title.length}/50 caracteres</Text>

            <Text style={styles.label}>Description detaillee</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Decris l'etat, les accessoires, la raison de vente..."
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />

            <Text style={styles.label}>Prix</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex : 1200"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Categorie</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={category} onValueChange={setCategory}>
                {categories.map((item) => (
                  <Picker.Item
                    key={item.value}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Etat de l'objet</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={etat} onValueChange={setEtat}>
                {etats.map((item) => (
                  <Picker.Item
                    key={item.value}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <Pressable
            style={[styles.primaryButton, loading && styles.disabledButton]}
            onPress={handlePublish}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color="#fff" />
                <Text style={styles.primaryButtonText}> Publication...</Text>
              </View>
            ) : (
              <Text style={styles.primaryButtonText}>Publier</Text>
            )}
          </Pressable>
        </ScrollView>

        <Modal
          visible={galleryVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setGalleryVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.galleryModal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Choisir une image</Text>

                <Pressable onPress={() => setGalleryVisible(false)}>
                  <Text style={styles.closeText}>Fermer</Text>
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.demoGalleryGrid}>
                  {demoGalleryImages.map((item) => {
                    const selected = images.some((image) => image.id === item.id);

                    return (
                      <Pressable
                        key={item.id}
                        style={[
                          styles.demoImageCard,
                          selected && styles.demoImageCardSelected,
                        ]}
                        onPress={() => selectDemoImage(item)}
                      >
                        <Image source={item.source} style={styles.demoImage} />
                        <Text style={styles.demoImageTitle}>{item.title}</Text>

                        {selected && (
                          <Text style={styles.selectedText}>Deja ajoutee</Text>
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F1F1F",
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#666",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginBottom: 6,
  },
  counterText: {
    fontSize: 13,
    color: "#777",
    marginBottom: 12,
  },
  photoButtonsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#F1EAFE",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#6A35D4",
    fontWeight: "700",
    fontSize: 15,
  },
  imagesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  imageWrapper: {
    position: "relative",
  },
  thumbnail: {
    width: 86,
    height: 86,
    borderRadius: 14,
    backgroundColor: "#eee",
  },
  deleteButton: {
    position: "absolute",
    top: -7,
    right: -7,
    backgroundColor: "#E53935",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F7F7F7",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#E4E4E4",
  },
  textArea: {
    height: 110,
  },
  helperText: {
    alignSelf: "flex-end",
    color: "#777",
    fontSize: 12,
    marginTop: 4,
  },
  pickerContainer: {
    backgroundColor: "#F7F7F7",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E4E4E4",
    overflow: "hidden",
  },
  primaryButton: {
    backgroundColor: "#6A35D4",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  disabledButton: {
    opacity: 0.8,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  galleryModal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 18,
    maxHeight: "82%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#222",
  },
  closeText: {
    color: "#6A35D4",
    fontWeight: "800",
    fontSize: 15,
  },
  demoGalleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingBottom: 10,
  },
  demoImageCard: {
    width: "47%",
    backgroundColor: "#F7F7F7",
    borderRadius: 16,
    padding: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  demoImageCardSelected: {
    borderColor: "#6A35D4",
    backgroundColor: "#F1EAFE",
  },
  demoImage: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
  demoImageTitle: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },
  selectedText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
    color: "#6A35D4",
    textAlign: "center",
  },
  successContainer: {
    flex: 1,
    backgroundColor: "#F6F6F6",
    justifyContent: "center",
    padding: 20,
  },
  successCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  successIcon: {
    fontSize: 42,
    marginBottom: 10,
    fontWeight: "800",
    color: "#2E7D32",
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#222",
    textAlign: "center",
    marginBottom: 10,
  },
  successText: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 18,
  },
  recapBox: {
    width: "100%",
    backgroundColor: "#F7F7F7",
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  recapText: {
    fontSize: 15,
    color: "#333",
    marginBottom: 6,
  },
});
