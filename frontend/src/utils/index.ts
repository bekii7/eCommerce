import { cartItem } from "../contexts/CartContext";

export const fixLength = (str: string, maxLen: number) => {
  if (str.length > maxLen) {
    return str.slice(0, maxLen) + "...";
  }
  return str;
};

export const capitalize = (str: string) => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const priceOfCart = (cartItems: any[]) => {
  let sum = 0;

  cartItems.forEach((item) => {
    sum += parseFloat(item.price) * parseFloat(item.quantity);
  });

  return sum;
};

export const deliveryFee = (total: number) => {
  return total * 0.05;
};

export const cleanString = (str: string) => {
  let newStr = str.replace("&amp;", "&");
  return newStr;
};

// ZOOM LENS FUNCTIONS FOR PRODUCT DETAILS
// Handles mouse movement over the image to position the zoom lens
export const handleMouseMove = (
  e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  selectedImage: string | null,
  lensRef: React.MutableRefObject<HTMLDivElement | null>
) => {
  if (!lensRef.current || !selectedImage) return;

  const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
  let x = e.clientX - left; // Get x position relative to the image
  let y = e.clientY - top; // Get y position relative to the image

  const lensSize = 100; // Assuming the lens is 100px in diameter
  const lensRadius = lensSize / 2;

  // Show zoom lens
  lensRef.current.style.display = "block";

  // Position zoom lens centered on the mouse position
  lensRef.current.style.left = `${x - lensRadius}px`;
  lensRef.current.style.top = `${y - lensRadius}px`;

  // Calculate background position for zoom effect
  const bgX = (x / width) * 100; // Calculate the percentage relative to the image's width
  const bgY = (y / height) * 100; // Calculate the percentage relative to the image's height

  // Set zoomed-in image as background
  lensRef.current.style.backgroundImage = `url(${selectedImage})`;

  // More accurate background position: based on cursor's relative position in the image
  lensRef.current.style.backgroundPosition = `${bgX}% ${bgY}%`;
  lensRef.current.style.backgroundSize = "200%"; // Adjust zoom level for better precision
};

// Hide zoom lens when the mouse leaves the image
export const handleMouseLeave = (
  lensRef: React.MutableRefObject<HTMLDivElement | null>
) => {
  if (lensRef.current) {
    lensRef.current.style.display = "none";
  }
};

// Helper function to merge cart items
export const mergeCartItems = (
  backendItems: cartItem[],
  localItems: cartItem[]
) => {
  const mergedItemsMap = new Map();

  // First, add all local items to the map
  localItems.forEach((item) => {
    mergedItemsMap.set(item.id, { ...item });
  });

  // Then, iterate over backend items
  backendItems.forEach((backendItem) => {
    const existingItem = mergedItemsMap.get(backendItem.id);

    if (existingItem) {
      // Merge the items by summing up the quantities
      mergedItemsMap.set(backendItem.id, {
        ...existingItem,
        quantity: existingItem.quantity + backendItem.quantity,
      });
    } else {
      // If no matching item exists, add it
      mergedItemsMap.set(backendItem.id, { ...backendItem });
    }
  });

  // Convert the Map back to an array
  return Array.from(mergedItemsMap.values());
};
