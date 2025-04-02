import { useState, useEffect } from "react";
import { petImages } from "./PetImages"; // Asegúrate de importar correctamente el objeto

const ChangePetImages = ({ petCharacter, energy, hunger }) => {
  // Formatear petCharacter (primera letra mayúscula, resto minúsculas)
  const formattedCharacter =
    petCharacter.charAt(0).toUpperCase() + petCharacter.slice(1).toLowerCase();

  // Determinar petType inicial y formatearlo a minúsculas
  const initialPetType = (energy > 20 && hunger > 20 ? "yellow" : "yellow");

  // Estado inicial basado en petCharacter y petType
  const [image, setImage] = useState(petImages[formattedCharacter]?.[initialPetType]);

  useEffect(() => {
    // Determinar petType y actualizar la imagen
    const petType = (energy > 20 && hunger > 20 ? "yellow" : "purple");
    setImage(petImages[formattedCharacter]?.[petType]);
  }, [formattedCharacter, energy, hunger]);

  return <img src={image} alt={`Mascota ${formattedCharacter}`} />;
};

export default ChangePetImages;
